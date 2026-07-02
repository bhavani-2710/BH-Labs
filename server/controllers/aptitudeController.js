const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");
const { jsonrepair } = require("jsonrepair");
const { APTITUDE_SYSTEM_PROMPT } = require("../prompts/aptitudeSystemPrompt");
const { getOpenAiClient } = require("../config/openrouter");

// Generates fallback mock questions based on subexperiments when API key is missing
const generateMockQuestions = (subjectName, subExperiments) => {
  const questions = [];
  const count = 10;

  for (let i = 0; i < count; i++) {
    // Pick a subexperiment to base the question on
    const subExp = subExperiments[i % subExperiments.length] || {
      title: "Programming Concepts",
      problemStatement: "Basic control structures and variables",
    };

    const qNum = i + 1;
    let text = `Regarding "${subExp.title}": Which of the following best describes the core programming requirement or logic involved?`;
    let options = [
      `Implementing correct loops and conditions for: ${subExp.title}`,
      `Managing dynamic memory allocations for pointers`,
      `Opening and writing to external file streams`,
      `None of the above`,
    ];
    let correctIndex = 0;

    if (i % 3 === 1) {
      text = `In the context of the subexperiment "${subExp.title}", what is the primary algorithmic complexity or structure expected?`;
      options = [
        "O(N Log N) optimal divide and conquer structure",
        "O(N^2) nested loop comparison iterations",
        "O(1) constant time direct access logic",
        "O(N) linear scan approach",
      ];
      correctIndex = 1;
    } else if (i % 3 === 2) {
      text = `Which error scenario is most critical to validate when implementing "${subExp.title}"?`;
      options = [
        "Memory leakage from unreleased pointer handles",
        "Handling boundary inputs / null parameters gracefully",
        "Stack overflow from infinite recursion loops",
        "All of the above",
      ];
      correctIndex = 3;
    }

    questions.push({
      id: qNum,
      text,
      options,
      correctIndex,
    });
  }

  return questions;
};

// GET /api/aptitude/questions/:subjectId
const getQuestions = async (req, res) => {
  try {
    const { subjectId } = req.params;

    // 1. Fetch the subject details
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // 2. Fetch all experiments for this subject
    const experiments = await Experiment.find({ subjectId });

    // Compile all subexperiments
    const subExperiments = [];
    experiments.forEach((exp) => {
      if (exp.subExperiments && Array.isArray(exp.subExperiments)) {
        exp.subExperiments.forEach((sub) => {
          subExperiments.push({
            title: sub.title,
            problemStatement: sub.problemStatement,
            theory: sub.theory || "",
            algorithm: sub.algorithm || "",
          });
        });
      }
    });

    if (subExperiments.length === 0) {
      // Fallback details if no experiments exist yet in DB
      subExperiments.push({
        title: `${subject.name} Basic Execution`,
        problemStatement: `Standard exercises on ${subject.name}`,
        theory: "Core programming syntax and fundamentals",
        algorithm: "Basic sequential steps",
      });
    }

    const openai = getOpenAiClient();

    // 3. If OpenRouter API key is missing, return fallback mock questions
    if (!openai) {
      console.log(
        `[Aptitude] OpenAI key missing. Generating mock questions for ${subject.name}`,
      );
      const mockQs = generateMockQuestions(subject.name, subExperiments);
      return res.json(mockQs);
    }

    // 4. Shuffle subexperiments randomly on each query to inject variety into attention layers
    const shuffledSubExps = [...subExperiments].sort(() => Math.random() - 0.5);

    const subExpsContext = shuffledSubExps
      .map((sub, index) => {
        return `[Subexperiment ${index + 1}]
                Title: ${sub.title}
                Problem: ${sub.problemStatement}
                Theory: ${sub.theory}
                Algorithm: ${sub.algorithm}`;
      })
      .join("\n\n");

    const systemPrompt = APTITUDE_SYSTEM_PROMPT;

    const userPrompt = `
                        Subject:
                        ${subject.name}

                        The following are the experiment details from which the aptitude test must be generated.
                        Generate exactly 10 unique MCQs based ONLY on this information.

                        Experiment Details
                        ------------------
                        ${subExpsContext}

                        Randomization Seed:
                        Timestamp: ${Date.now()}
                        Seed: ${Math.random()}
                      `;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 1.0, // Maximum recommended temperature for maximum response diversity
    });

    const contentText = response.choices[0].message.content.trim();
    const cleanedText = contentText
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const sanitizeJsonString = (str) => {
      // Escape backslashes that are not part of a valid JSON escape sequence
      return str.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");
    };

    const extractQuestionsRegex = (text) => {
      const matches = [];
      const objRegex =
        /\{\s*"id"\s*:\s*\d+\s*,\s*(?:"subexperiment"\s*:\s*"([\s\S]*?)"\s*,\s*)?"text"\s*:\s*"([\s\S]*?)"\s*,\s*"options"\s*:\s*\[([\s\S]*?)\]\s*,\s*"correctIndex"\s*:\s*(\d)\s*\}/gi;
      let match;
      while ((match = objRegex.exec(text)) !== null) {
        try {
          const subExp = match[1] || "General Concept";
          const qText = match[2];
          const optionsRaw = match[3];
          const correctIdx = parseInt(match[4], 10);

          const options = [];
          const optRegex = /"([\s\S]*?)"/g;
          let optMatch;
          while ((optMatch = optRegex.exec(optionsRaw)) !== null) {
            options.push(optMatch[1].replace(/\\"/g, '"'));
          }

          if (options.length === 4) {
            matches.push({
              subexperiment: subExp.replace(/\\"/g, '"'),
              text: qText.replace(/\\"/g, '"'),
              options,
              correctIndex: correctIdx,
            });
          }
        } catch (e) {
          // Ignore
        }
      }
      return matches;
    };

    const resolveSubexperimentTitle = (qSub, qText, idx) => {
      let subTitle = (qSub || "").trim().replace(/^["']|["']$/g, "");

      const matched = subExperiments.find(
        (s) =>
          subTitle.toLowerCase() === s.title.toLowerCase() ||
          qText.toLowerCase().includes(s.title.toLowerCase()) ||
          s.title.toLowerCase().includes(subTitle.toLowerCase()),
      );

      if (matched) return matched.title;

      if (subExperiments.length > 0) {
        return subExperiments[idx % subExperiments.length].title;
      }
      return "General Concept";
    };

    try {
      const sanitizedText = sanitizeJsonString(cleanedText);
      const repairedText = jsonrepair(sanitizedText);
      const parsedQuestions = JSON.parse(repairedText);
      if (Array.isArray(parsedQuestions)) {
        const formattedQs = parsedQuestions.map((q, idx) => ({
          id: idx + 1,
          subexperiment: resolveSubexperimentTitle(
            q.subexperiment,
            q.text,
            idx,
          ),
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
        }));
        return res.json(formattedQs.slice(0, 10));
      } else {
        throw new Error("Parsed content is not a JSON array");
      }
    } catch (parseErr) {
      console.warn(
        "JSON parsing error for generated questions, attempting regex fallback extraction...",
        parseErr,
      );

      const extractedQs = extractQuestionsRegex(cleanedText);
      if (extractedQs.length >= 5) {
        const formattedQs = extractedQs.map((q, idx) => ({
          id: idx + 1,
          subexperiment: resolveSubexperimentTitle(
            q.subexperiment,
            q.text,
            idx,
          ),
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
        }));
        return res.json(formattedQs.slice(0, 10));
      }

      console.error(
        "Regex fallback extraction failed to find enough questions. Using mock questions.",
      );
      const fallbackQs = generateMockQuestions(subject.name, subExperiments);
      return res.json(fallbackQs);
    }
  } catch (err) {
    console.error("Get questions error:", err);
    res.status(500).json({ error: "Failed to generate aptitude questions" });
  }
};

module.exports = {
  getQuestions,
};
