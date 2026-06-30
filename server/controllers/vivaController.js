const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");
const VivaQA = require("../models/VivaQA");
const { generateVivaQA } = require("./aiController");

// Groq client for Whisper transcription (free, fast, accurate for technical terms)
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: apiKey,
  });
};

const getOpenAiClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5050",
      "X-Title": "BH Labs",
    }
  });
};

function cleanRawJson(rawText) {
  let result = "";
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    
    if (inString) {
      if (escapeNext) {
        const validEscapes = ['"', '\\', '/', 'b', 'f', 'n', 'r', 't', 'u'];
        if (validEscapes.includes(char)) {
          result += char;
        } else {
          result = result.substring(0, result.length - 1) + "\\\\" + char;
        }
        escapeNext = false;
      } else if (char === '\\') {
        escapeNext = true;
        result += char;
      } else if (char === '"') {
        inString = false;
        result += char;
      } else {
        result += char;
      }
    } else {
      if (char === '"') {
        inString = true;
      }
      result += char;
    }
  }
  return result;
}

// In-memory store for viva scores
const vivaStore = {};

// GET /api/vivas
const getVivas = async (req, res) => {
  try {
    const entries = Object.entries(vivaStore).map(([key, score]) => ({ key, score }));
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/vivas
const saveVivaScore = async (req, res) => {
  try {
    const { key, score } = req.body;
    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }
    vivaStore[key] = score;
    res.json({ key, score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/vivas/generate
const generateVivaQuestions = async (req, res) => {
  try {
    const { subjectId } = req.body;
    if (!subjectId) {
      return res.status(400).json({ error: "subjectId is required" });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    const experiments = await Experiment.find({ subjectId });

    const openai = getOpenAiClient();
    if (!openai) {
      // Mock generation in simulation mode
      const mockQuestions = [
        {
          id: 1,
          label: "Viva Question 1 of 4",
          question: `What are the core objectives of the practical experiments in ${subject.name}?`,
          code: "",
          hint: "Recall the main tools and logic you implemented throughout this course.",
          masteryTopic: "Overview",
          transcript: "The core objectives are to understand basic programming structures and apply them to data manipulation and problem solving."
        },
        {
          id: 2,
          label: "Viva Question 2 of 4",
          question: experiments[0] ? `Explain the core logic of Experiment 1: "${experiments[0].subExperiments?.[0]?.title || "First Lab"}".` : "Explain the logic of variable swapping.",
          code: experiments[0]?.subExperiments?.[0]?.referenceSolution ? Array.from(experiments[0].subExperiments[0].referenceSolution.values())[0] || "" : "",
          hint: "Recall the step-by-step variables manipulation you performed.",
          masteryTopic: "Logic Flow",
          transcript: "The logic interchanges values in memory, utilizing a temporary variable to prevent data overwrite."
        },
        {
          id: 3,
          label: "Viva Question 3 of 4",
          question: "How do you analyze space complexity in standard algorithms?",
          code: "",
          hint: "Count any extra arrays or memory structures allocated during algorithm run.",
          masteryTopic: "Space Optimization",
          transcript: "Space complexity is analyzed by measuring auxiliary memory used relative to input size."
        },
        {
          id: 4,
          label: "Viva Question 4 of 4",
          question: "Why do we flush the input buffer in C after scanning integers?",
          code: "while ((getchar()) != '\\n');",
          hint: "Think about what happens to the enter key newline character.",
          masteryTopic: "Input Buffer",
          transcript: "We flush the buffer to discard the leftover newline character so it doesn't interfere with subsequent reads."
        }
      ];
      return res.json({ questions: mockQuestions, subjectName: subject.name });
    }

    // Collect all unique concepts across every experiment and sub-experiment
    const allConcepts = [];
    experiments.forEach((exp) => {
      exp.subExperiments.forEach((sub) => {
        sub.concepts.forEach((c) => {
          if (c && !allConcepts.includes(c)) allConcepts.push(c);
        });
      });
    });

    // At least one question per concept; minimum 5, cap at 20
    const numQuestions = Math.min(20, Math.max(5, allConcepts.length));

    const prompt = `You are a friendly, conversational college lab assistant helping a student prepare. Generate exactly ${numQuestions} challenging, conceptually deep viva questions for the subject: "${subject.name}" (${subject.description || ""}).

The student has completed the following practical experiments in the lab:
${experiments.map((exp) => `Experiment ${exp.experimentNumber}: ${exp.problemStatement}\nSub-parts:\n${exp.subExperiments.map(s => `- Title: "${s.title}", concepts: [${s.concepts.join(", ")}]`).join("\n")}`).join("\n\n")}

All concepts that MUST be covered (one question per concept at minimum):
${allConcepts.map((c, i) => `${i + 1}. ${c}`).join("\n")}

IMPORTANT RULES FOR QUESTIONS:
- Generate exactly ${numQuestions} questions — one for each concept listed above.
- Questions must NOT be simple definitions (e.g., do NOT ask "What is X?"). Instead, ask about:
  1. Internal mechanics, logic flow, and execution behavior.
  2. Performance trade-offs (time vs. space complexity constraints).
  3. Edge cases, potential bugs, or failure states (e.g., buffer overflows, out-of-bounds, infinite loops).
- Tone MUST be casual, conversational, and friendly. Avoid overly formal or robotic academic phrasing. Start occasionally with phrases like "So, let's talk about...", "Hey, what happens if...", "Can you explain why...".
- Questions should require critical thinking and technical depth to answer, yet remain direct and concise (under 25 words).
- Every concept in the list above must appear as a "masteryTopic" for exactly one question.

For each question, provide:
1. "id": integer (1 to ${numQuestions})
2. "label": "Question X of ${numQuestions}"
3. "question": The conversational, technical question text (under 25 words)
4. "code": A multi-line C/C++/python/java/js code snippet representing a realistic scenario or bug. Use standard JSON formatting. Do not double-escape structural newlines.
5. "hint": A deep conceptual clue pointing to underlying principles
6. "masteryTopic": The concept name from the list above (must match exactly)
7. "transcript": A conversational, clear model answer in 2-3 sentences explaining the mechanics, complexity, or logic.

Output ONLY a valid JSON array. No markdown, no commentary.
[
  {
    "id": 1,
    "label": "Question 1 of ${numQuestions}",
    "question": "...",
    "code": "...",
    "hint": "...",
    "masteryTopic": "...",
    "transcript": "..."
  }
]`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are an assistant that outputs only valid JSON arrays. Do not add markdown backticks or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.0
    });

    let rawText = response.choices?.[0]?.message?.content || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    const cleanedText = cleanRawJson(rawText);
    const parsedQuestions = JSON.parse(cleanedText);
    
    res.json({ questions: parsedQuestions, subjectName: subject.name });
  } catch (error) {
    console.error("Generate viva questions error:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/vivas/evaluate
const evaluateVivaAnswer = async (req, res) => {
  try {
    const { question, studentAnswer, modelAnswer } = req.body;
    if (!question || !studentAnswer) {
      return res.status(400).json({ error: "question and studentAnswer are required" });
    }

    // 1. Fast-path local validation for obvious non-answers
    const cleanAns = studentAnswer.trim().toLowerCase();
    const nonAnswers = [
      "i don't know", "i dont know", "dont know", "don't know", "no idea", 
      "no clue", "skip", "hello", "hi", "hey", "test", "nothing", "pass", 
      "no", "yes", "i do not know", "do not know", "none"
    ];
    
    if (cleanAns.length < 5 || nonAnswers.includes(cleanAns) || cleanAns.split(" ").length < 3) {
      return res.json({
        score: 0,
        feedback: "Your response does not address the question. Please provide a conceptual explanation of the topic."
      });
    }

    const openai = getOpenAiClient();
    if (!openai) {
      // Mock evaluation in simulation mode
      const isGood = studentAnswer.toLowerCase().length > 15;
      const score = isGood ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 20) + 10;
      const feedback = isGood
        ? "Excellent explanation. You correctly identified the core logical variables. Focus now on time complexity analysis."
        : "Your response is too short or doesn't address the main concepts of the question.";
      return res.json({ score, feedback });
    }

    const systemPrompt = `You are a friendly and conversational college lab assistant evaluating a student's answer for accuracy and correctness relative to the expected model answer.
    
SCORING CRITERIA:
1. If the student's answer is empty, off-topic, nonsense, a greeting, or explicitly states they don't know (like "I don't know", "skip", "no idea"), you MUST award a score of EXACTLY 0. No exceptions.
2. If the student's answer is completely wrong or does not address the core concepts of the question, you MUST award a score between 0 and 10.
3. If the student's answer is partially correct but has major errors, omissions, or is too brief (less than 10 words) to demonstrate understanding, you MUST award a score between 10 and 40.
4. If the student's answer is correct in concept but lacks specific details or key keywords from the expected answer, you MUST award a score between 40 and 70.
5. If the student's answer is mostly correct and matches the expected answer key points, you MUST award a score between 70 and 90.
6. If the student's answer is exceptionally detailed, completely correct, and matches the expected answer perfectly, you MUST award a score between 90 and 100.

CRITICAL: While you evaluate the score accurately and strictly based on technical correctness, your feedback MUST be given in a casual, conversational, and friendly tone (like a peer). Avoid overly formal phrasing.

You must output a valid JSON object only. Do not include markdown code block formatting (like \`\`\`json) or any explanation. Output ONLY the JSON:
{
  "score": <integer score from 0 to 100 based on the strict rules above>,
  "feedback": "<a short, conversational, friendly one-sentence feedback explaining why they received this score and what to focus on. Use casual language like 'Hey', 'Good try', or 'Almost there!'>"
}`;

    const userPrompt = `Question: "${question}"
Expected Answer: "${modelAnswer || ""}"
Student's Answer: "${studentAnswer}"`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.0
    });

    let rawText = response.choices?.[0]?.message?.content || "";
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    const cleanedText = cleanRawJson(rawText);
    const evaluation = JSON.parse(cleanedText);
    
    res.json(evaluation);
  } catch (error) {
    console.error("Evaluate viva answer error:", error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/vivas/transcribe  — accepts audio file, returns transcript via Whisper
const transcribeAudio = async (req, res) => {
  let renamedPath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const groq = getGroqClient();
    if (!groq) {
      fs.unlinkSync(req.file.path);
      return res.status(503).json({ error: "GROQ_API_KEY not configured. Add it to your .env file." });
    }

    // Multer saves file with a random hash name and no extension.
    // Whisper needs the extension to detect audio format — rename the file.
    const ext = (req.file.originalname || "recording.webm").split(".").pop() || "webm";
    renamedPath = req.file.path + "." + ext;
    fs.renameSync(req.file.path, renamedPath);

    const audioStream = fs.createReadStream(renamedPath);

    const transcription = await groq.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-large-v3",
      language: "en",
      response_format: "json",
    });

    // Clean up renamed temp file
    fs.unlinkSync(renamedPath);

    const text = transcription.text?.trim() || "";
    res.json({ transcript: text });
  } catch (error) {
    console.error("Whisper transcription error:", error);
    // Clean up whichever file exists
    if (renamedPath) {
      try { fs.unlinkSync(renamedPath); } catch (_) {}
    } else if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET /api/vivas/qa
 * Body: { experimentId, part }
 *
 * If a VivaQA document already exists for (experimentId, part), return it.
 * Otherwise fetch the sub-experiment from the Experiment document, call OpenAI
 * to generate 7-9 Q&A pairs, persist them, and return.
 */
const getVivaQA = async (req, res) => {
  try {
    const { experimentId, part } = req.body;

    if (!experimentId || !part) {
      return res.status(400).json({ error: "experimentId and part are required" });
    }

    // 1. Check DB cache first
    const existing = await VivaQA.findOne({ experimentId, part });
    if (existing) {
      return res.json({ source: "db", qaPairs: existing.qaPairs });
    }

    // 2. Load the experiment and locate the matching sub-experiment
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) {
      return res.status(404).json({ error: "Experiment not found" });
    }

    const subExp = experiment.subExperiments.find(
      (s) => s.part && s.part.toLowerCase() === part.toLowerCase(),
    );
    if (!subExp) {
      return res.status(404).json({ error: `Sub-experiment with part "${part}" not found` });
    }

    // 3. Generate via OpenAI
    const qaPairs = await generateVivaQA(subExp);

    // 4. Persist to DB so subsequent requests are instant
    const doc = await VivaQA.create({ experimentId, part, qaPairs });

    return res.status(201).json({ source: "ai", qaPairs: doc.qaPairs });
  } catch (err) {
    console.error("getVivaQA error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getVivas,
  saveVivaScore,
  generateVivaQuestions,
  evaluateVivaAnswer,
  transcribeAudio,
  getVivaQA,
};
