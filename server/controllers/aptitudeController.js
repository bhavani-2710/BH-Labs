const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");
const TestQuestion = require("../models/TestQuestion");
const { jsonrepair } = require("jsonrepair");
const { APTITUDE_SYSTEM_PROMPT } = require("../prompts/aptitudeSystemPrompt");
const { getOpenAiClient } = require("../config/openrouter");

const QUESTION_BANK_LIMIT = 50;
const TEST_SIZE = 10;
const REUSE_FROM_BANK = 9;
const FRESH_PER_TEST = 1;

// ---------- Mock fallback generator (used when no AI key, or AI call fails) ----------
const generateMockQuestions = (subjectName, subExperiments, count = TEST_SIZE) => {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const subExp = subExperiments[i % subExperiments.length] || {
      title: "Programming Concepts",
      problemStatement: "Basic control structures and variables",
    };

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

    questions.push({ text, options, correctIndex });
  }

  return questions;
};

// ---------- Helpers for parsing the AI response ----------
const sanitizeJsonString = (str) =>
  str.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");

const extractQuestionsRegex = (text) => {
  const matches = [];
  const objRegex =
    /\{\s*"id"\s*:\s*\d+\s*,\s*(?:"subexperiment"\s*:\s*"([\s\S]*?)"\s*,\s*)?"text"\s*:\s*"([\s\S]*?)"\s*,\s*"options"\s*:\s*\[([\s\S]*?)\]\s*,\s*"correctIndex"\s*:\s*(\d)\s*\}/gi;
  let match;
  while ((match = objRegex.exec(text)) !== null) {
    try {
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
          text: qText.replace(/\\"/g, '"'),
          options,
          correctIndex: correctIdx,
        });
      }
    } catch (e) {
      // Ignore malformed matches
    }
  }
  return matches;
};

// Calls the AI to generate `count` question(s). `avoidTexts` (previously used
// question text, from the DB bank) is passed so the model steers away from
// duplicates. Only question text is shared with the AI - never answers tied
// to any other subject or user data.
const generateAIQuestions = async ({ openai, subject, subExpsContext, count, avoidTexts = [] }) => {
  const avoidContext =
    avoidTexts.length > 0
      ? `\n\nDo NOT repeat or closely rephrase any of these previously used questions:\n${avoidTexts
          .map((t, i) => `${i + 1}. ${t}`)
          .join("\n")}`
      : "";

  const userPrompt = `
                      Subject:
                      ${subject.name}

                      The following are the experiment details from which the aptitude test must be generated.
                      Generate exactly ${count} unique MCQ(s) based ONLY on this information.

                      Experiment Details
                      ------------------
                      ${subExpsContext}
                      ${avoidContext}

                      Randomization Seed:
                      Timestamp: ${Date.now()}
                      Seed: ${Math.random()}
                    `;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      { role: "system", content: APTITUDE_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 1.0,
  });

  const contentText = response.choices[0].message.content.trim();
  const cleanedText = contentText
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const sanitizedText = sanitizeJsonString(cleanedText);
    const repairedText = jsonrepair(sanitizedText);
    const parsed = JSON.parse(repairedText);
    const arr = Array.isArray(parsed) ? parsed : [parsed];

    const clean = arr
      .filter(
        (q) =>
          q &&
          typeof q.text === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctIndex === "number",
      )
      .slice(0, count)
      .map((q) => ({ text: q.text, options: q.options, correctIndex: q.correctIndex }));

    if (clean.length > 0) return clean;
    throw new Error("No valid questions parsed from AI response");
  } catch (parseErr) {
    console.warn(
      "JSON parsing error for generated questions, attempting regex fallback extraction...",
      parseErr,
    );
    const extracted = extractQuestionsRegex(cleanedText).slice(0, count);
    if (extracted.length > 0) return extracted;
    throw new Error("AI question generation failed for both JSON and regex parsing");
  }
};

// Appends questions to the subject's bank. Never throws - a storage hiccup
// should not stop questions from reaching the client.
const persistQuestions = async (subjectId, questions) => {
  try {
    const docs = questions
      .filter(
        (q) =>
          q &&
          typeof q.text === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctIndex === "number",
      )
      .map((q) => ({
        subjectId,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      }));

    if (docs.length === 0) return;
    await TestQuestion.insertMany(docs);
  } catch (err) {
    console.error("Failed to persist generated questions:", err);
  }
};

// GET /api/aptitude/questions/:subjectId

// Prevents two near-simultaneous requests for the same subject from both
// reading a stale bank count and both inserting a full batch (e.g. double
// click, React StrictMode double-invoking an effect, a network retry).
// Any request that arrives while one is already running for that subject
// just awaits and reuses the same in-flight result instead of starting a
// second generation.
const inFlightGenerations = new Map();

const getQuestions = async (req, res) => {
  const { subjectId } = req.params;

  if (inFlightGenerations.has(subjectId)) {
    try {
      const responseQs = await inFlightGenerations.get(subjectId);
      return res.json(responseQs);
    } catch (err) {
      console.error("Get questions error (in-flight reuse):", err);
      return res.status(500).json({ error: "Failed to generate aptitude questions" });
    }
  }

  const generationPromise = generateQuestionsForSubject(subjectId);
  inFlightGenerations.set(subjectId, generationPromise);

  try {
    const responseQs = await generationPromise;
    return res.json(responseQs);
  } catch (err) {
    console.error("Get questions error:", err);
    if (err.statusCode === 404) {
      return res.status(404).json({ error: "Subject not found" });
    }
    return res.status(500).json({ error: "Failed to generate aptitude questions" });
  } finally {
    inFlightGenerations.delete(subjectId);
  }
};

// Does the actual work: figures out how many questions exist for the subject,
// generates/reuses accordingly, persists new ones, and returns the response shape.
const generateQuestionsForSubject = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    const notFoundErr = new Error("Subject not found");
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  const experiments = await Experiment.find({ subjectId });

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
    subExperiments.push({
      title: `${subject.name} Basic Execution`,
      problemStatement: `Standard exercises on ${subject.name}`,
      theory: "Core programming syntax and fundamentals",
      algorithm: "Basic sequential steps",
    });
  }

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

  const openai = getOpenAiClient();
  const existingCount = await TestQuestion.countDocuments({ subjectId });

  let finalQuestions = [];

  if (existingCount < QUESTION_BANK_LIMIT) {
    // Bank still filling up - generate a fresh batch of 10 and add them all to the bank
    let freshQs;

    if (!openai) {
      console.log(
        `[Aptitude] OpenAI key missing. Generating mock questions for ${subject.name}`,
      );
      freshQs = generateMockQuestions(subject.name, subExperiments, TEST_SIZE);
    } else {
      const existingDocs = await TestQuestion.find({ subjectId }).select("text").lean();
      const avoidTexts = existingDocs.map((d) => d.text);

      try {
        freshQs = await generateAIQuestions({
          openai,
          subject,
          subExpsContext,
          count: TEST_SIZE,
          avoidTexts,
        });
      } catch (err) {
        console.error("AI generation failed, falling back to mock questions:", err);
        freshQs = generateMockQuestions(subject.name, subExperiments, TEST_SIZE);
      }
    }

    // Re-check the count right before writing, and hard-cap what gets stored
    // so the bank can never be pushed past QUESTION_BANK_LIMIT in one batch -
    // this is a second line of defense on top of the in-flight request lock.
    const preInsertCount = await TestQuestion.countDocuments({ subjectId });
    const remainingSlots = Math.max(0, QUESTION_BANK_LIMIT - preInsertCount);
    await persistQuestions(subjectId, freshQs.slice(0, remainingSlots));
    finalQuestions = freshQs;
  } else {
    // Bank is big enough - reuse 9 random questions from DB + 1 freshly generated one
    const sampled = await TestQuestion.aggregate([
      { $match: { subjectId: new mongoose.Types.ObjectId(subjectId) } },
      { $sample: { size: REUSE_FROM_BANK } },
    ]);

    let freshQ;

    if (!openai) {
      freshQ = generateMockQuestions(subject.name, subExperiments, FRESH_PER_TEST)[0];
    } else {
      const avoidTexts = sampled.map((q) => q.text);
      try {
        const generated = await generateAIQuestions({
          openai,
          subject,
          subExpsContext,
          count: FRESH_PER_TEST,
          avoidTexts,
        });
        freshQ = generated[0];
      } catch (err) {
        console.error("AI generation failed, falling back to mock question:", err);
        freshQ = generateMockQuestions(subject.name, subExperiments, FRESH_PER_TEST)[0];
      }
    }

    await persistQuestions(subjectId, [freshQ]);

    finalQuestions = [
      ...sampled.map((q) => ({ text: q.text, options: q.options, correctIndex: q.correctIndex })),
      freshQ,
    ].sort(() => Math.random() - 0.5);
  }

  return finalQuestions.map((q, idx) => ({
    id: idx + 1,
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
  }));
};

module.exports = {
  getQuestions,
};