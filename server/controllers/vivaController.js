const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const { jsonrepair } = require("jsonrepair");
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");
const VivaQA = require("../models/VivaQA");
const { generateVivaQA } = require("../services/vivaServices");

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
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5050",
      "X-Title": "BH Labs",
    },
  });
};

/**
 * Parses a JSON array out of raw LLM output. Handles the common failure
 * modes seen from providers like Gemini: unescaped quotes inside string
 * values, trailing commas, and arrays truncated mid-object because the
 * response hit a token limit. Falls back to jsonrepair (a proper,
 * string-boundary-aware repair library) instead of a hand-rolled character
 * scanner, since naive brace/quote counting breaks the moment a string
 * value itself contains a quote or brace (e.g. code snippets, or a
 * question that quotes a variable name).
 */
function parseJsonArraySafely(text) {
  const trimmed = text.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error("Parsed JSON is not an array");
    }
    return parsed;
  } catch (_) {
    // fall through to repair attempt
  }

  const repaired = jsonrepair(trimmed);
  const parsed = JSON.parse(repaired);
  if (!Array.isArray(parsed)) {
    throw new Error("Repaired JSON is not an array");
  }
  return parsed;
}

/**
 * Same idea as above but for a single JSON object (used by evaluateVivaAnswer).
 */
function parseJsonObjectSafely(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // fall through to repair attempt
  }

  const repaired = jsonrepair(trimmed);
  return JSON.parse(repaired);
}

// In-memory store for viva scores
const vivaStore = {};

// GET /api/vivas
const getVivas = async (req, res) => {
  try {
    const entries = Object.entries(vivaStore).map(([key, score]) => ({
      key,
      score,
    }));
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
// --- Batch tuning ---
const BATCH_SIZE = 6; // sub-experiments per LLM call — small enough that the
                        // model reliably returns one question per item
const BATCH_CONCURRENCY = 3; // parallel in-flight batch calls

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function buildBatchPrompt(subjectName, batch) {
  const listBlock = batch
    .map((s, i) => {
      const conceptsStr = s.concepts.length ? s.concepts.join(", ") : "N/A";
      return `${i + 1}. [Exp ${s.experimentNumber}${s.part ? ` - Part ${s.part}` : ""}] ${s.title}${
        s.problemStatement ? ` — ${s.problemStatement}` : ""
      } (concepts: ${conceptsStr})`;
    })
    .join("\n");

  return `You are a university viva examiner. Generate EXACTLY ${batch.length} deep conceptual questions for "${subjectName}" — one question per sub-experiment listed below, in the SAME ORDER as listed. Do not skip, merge, or reorder any of them.

Sub-experiments:
${listBlock}

RULES:
- NO code tracing ("what does this print?"), NO bare/trivial definitions ("what is X?"), NO trivial questions
- Mix applied/mechanism questions (internal mechanisms, tradeoffs, consequences of changes, design decisions, misconceptions) and theoretical questions (underlying theory/principles, "Why does X theoretically guarantee Y?", "Under what conditions does X fail?")
- Theoretical questions must still require explanation/reasoning, not a one-line definition
- Questions: 20-40 words, require deep understanding
- Code: optional, only to illustrate a concept (not the focus)
- Tone: direct examiner ("Explain why...", "What's the difference between...", "If you remove X, what happens?")

Return a JSON array of EXACTLY ${batch.length} objects, in the same order as the list above. Each object: question (string), code (string or ""), hint (1 sentence), transcript (3-4 sentence model answer).

Output ONLY a JSON array of ${batch.length} objects. No markdown, no backticks, no extra items, no missing items.`;
}

function fallbackQuestionFor(subExp) {
  // Used only if a batch call still comes up short after retry — guarantees
  // every sub-experiment gets at least a placeholder question rather than
  // silently dropping it.
  return {
    question: `Explain the core concept(s) behind "${subExp.title}"${
      subExp.concepts.length ? ` (${subExp.concepts.join(", ")})` : ""
    } and why they matter in practice.`,
    code: "",
    hint: "Revisit the implementation and the underlying concept you applied.",
    transcript:
      "A strong answer explains the core mechanism, why it was needed, and how it connects to the underlying concept.",
  };
}

async function generateBatch(openai, subjectName, batch) {
  async function requestBatch() {
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that outputs only valid JSON arrays. Do not add markdown backticks or commentary.",
        },
        { role: "user", content: buildBatchPrompt(subjectName, batch) },
      ],
      temperature: 0.0,
      max_tokens: Math.min(4000, 450 * batch.length + 300),
    });

    let rawText = response.choices?.[0]?.message?.content || "";
    const arrStart = rawText.indexOf("[");
    const arrEnd = rawText.lastIndexOf("]");
    if (arrStart !== -1 && arrEnd > arrStart) {
      rawText = rawText.substring(arrStart, arrEnd + 1);
    } else if (arrStart !== -1) {
      rawText = rawText.substring(arrStart);
    } else {
      rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    return rawText;
  }

  let items;
  try {
    items = parseJsonArraySafely(await requestBatch());
  } catch (e) {
    console.warn("Batch parse failed, retrying once:", e.message);
    try {
      items = parseJsonArraySafely(await requestBatch());
    } catch (e2) {
      console.error("Batch failed twice, falling back to placeholders:", e2.message);
      items = [];
    }
  }

  // Zip by index — deterministic mapping, no fuzzy matching needed.
  // Pad with fallbacks if the model returned fewer than requested;
  // ignore extras if it returned more.
  return batch.map((subExp, i) => {
    const item = items[i];
    const base = item && item.question ? item : fallbackQuestionFor(subExp);
    return {
      question: base.question,
      code: base.code || "",
      hint: base.hint || "",
      masteryTopic: subExp.concepts[0] || subExp.title,
      transcript: base.transcript || "",
      _subExpTitle: subExp.title, // internal only, stripped before response
    };
  });
}

async function runBatchesWithConcurrency(batches, worker, concurrency) {
  const results = new Array(batches.length);
  let nextIndex = 0;

  async function runNext() {
    while (nextIndex < batches.length) {
      const current = nextIndex++;
      results[current] = await worker(batches[current], current);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, batches.length) },
    () => runNext(),
  );
  await Promise.all(workers);
  return results;
}

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
      // Mock generation in simulation mode (unchanged)
      const mockQuestions = [
        {
          id: 1,
          label: "Viva Question 1 of 4",
          question: `What are the core objectives of the practical experiments in ${subject.name}?`,
          code: "",
          hint: "Recall the main tools and logic you implemented throughout this course.",
          masteryTopic: "Overview",
          transcript:
            "The core objectives are to understand basic programming structures and apply them to data manipulation and problem solving.",
        },
        {
          id: 2,
          label: "Viva Question 2 of 4",
          question: experiments[0]
            ? `Explain the core logic of Experiment 1: "${experiments[0].subExperiments?.[0]?.title || "First Lab"}".`
            : "Explain the logic of variable swapping.",
          code: experiments[0]?.subExperiments?.[0]?.referenceSolution
            ? Array.from(
              experiments[0].subExperiments[0].referenceSolution.values(),
            )[0] || ""
            : "",
          hint: "Recall the step-by-step variables manipulation you performed.",
          masteryTopic: "Logic Flow",
          transcript:
            "The logic interchanges values in memory, utilizing a temporary variable to prevent data overwrite.",
        },
        {
          id: 3,
          label: "Viva Question 3 of 4",
          question:
            "How do you analyze space complexity in standard algorithms?",
          code: "",
          hint: "Count any extra arrays or memory structures allocated during algorithm run.",
          masteryTopic: "Space Optimization",
          transcript:
            "Space complexity is analyzed by measuring auxiliary memory used relative to input size.",
        },
        {
          id: 4,
          label: "Viva Question 4 of 4",
          question:
            "Why do we flush the input buffer in C after scanning integers?",
          code: "while ((getchar()) != '\\n');",
          hint: "Think about what happens to the enter key newline character.",
          masteryTopic: "Input Buffer",
          transcript:
            "We flush the buffer to discard the leftover newline character so it doesn't interfere with subsequent reads.",
        },
      ];
      return res.json({ questions: mockQuestions, subjectName: subject.name });
    }

    // Flat list of every sub-experiment across all experiments — this
    // drives coverage, not a deduplicated problemStatement list.
    const subExperimentsList = [];
    experiments.forEach((exp) => {
      (exp.subExperiments || []).forEach((sub) => {
        subExperimentsList.push({
          experimentNumber: exp.experimentNumber,
          part: sub.part || "",
          title: sub.title || sub.problemStatement || "Untitled part",
          problemStatement: sub.problemStatement || "",
          concepts: sub.concepts || [],
        });
      });
    });

    if (subExperimentsList.length === 0) {
      return res
        .status(400)
        .json({ error: "No sub-experiments found for this subject" });
    }

    // Split into small batches so the model reliably returns one question
    // per sub-experiment per call, instead of one giant call it silently
    // under-delivers on.
    const batches = chunkArray(subExperimentsList, BATCH_SIZE);

    const batchResults = await runBatchesWithConcurrency(
      batches,
      (batch) => generateBatch(openai, subject.name, batch),
      BATCH_CONCURRENCY,
    );

    const flatQuestions = batchResults.flat();

    if (flatQuestions.length === 0) {
      throw new Error("Model returned no usable questions");
    }

    const total = flatQuestions.length;
    const finalQuestions = flatQuestions.map((q, i) => ({
      id: i + 1,
      label: `Question ${i + 1} of ${total}`,
      question: q.question,
      code: q.code,
      hint: q.hint,
      masteryTopic: q.masteryTopic,
      transcript: q.transcript,
    }));

    res.json({ questions: finalQuestions, subjectName: subject.name });
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
      return res
        .status(400)
        .json({ error: "question and studentAnswer are required" });
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
        feedback:
          "Your response does not address the question. Please provide a conceptual explanation of the topic.",
      });
    }

    const openai = getOpenAiClient();
    if (!openai) {
      // Mock evaluation in simulation mode
      const isGood = studentAnswer.toLowerCase().length > 15;
      const score = isGood
        ? Math.floor(Math.random() * 15) + 80
        : Math.floor(Math.random() * 20) + 10;
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

    async function requestEvaluation() {
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.0,
        // Feedback is a single sentence, but give enough headroom to avoid
        // any risk of truncation mid-string.
        max_tokens: 500,
      });

      let rawText = response.choices?.[0]?.message?.content || "";

      // Extract JSON object robustly
      const objStart = rawText.indexOf("{");
      const objEnd = rawText.lastIndexOf("}");
      if (objStart !== -1 && objEnd > objStart) {
        rawText = rawText.substring(objStart, objEnd + 1);
      } else {
        rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      }

      return rawText;
    }

    let rawText = await requestEvaluation();
    let evaluation;

    try {
      evaluation = parseJsonObjectSafely(rawText);
    } catch (firstAttemptError) {
      // Retry the request once instead of trying to hand-repair a single
      // truncated object (there's nothing partial to salvage the way there
      // is with an array of independent objects).
      console.warn(
        "Viva evaluation JSON parse failed, retrying once:",
        firstAttemptError.message,
      );
      rawText = await requestEvaluation();
      try {
        evaluation = parseJsonObjectSafely(rawText);
      } catch (secondAttemptError) {
        console.error(
          "Raw model output that failed to parse (first 2000 chars):",
          rawText.slice(0, 2000),
        );
        throw secondAttemptError;
      }
    }

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
      return res
        .status(503)
        .json({
          error: "GROQ_API_KEY not configured. Add it to your .env file.",
        });
    }

    // Multer saves file with a random hash name and no extension.
    // Whisper needs the extension to detect audio format — rename the file.
    const ext =
      (req.file.originalname || "recording.webm").split(".").pop() || "webm";
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
      try { fs.unlinkSync(renamedPath); } catch (_) { }
    } else if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) { }
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
// At the top of vivaController.js (outside the controller)
const pendingGenerations = new Map();

const getVivaQA = async (req, res) => {
  try {
    const { experimentId, part } = req.body;

    if (!experimentId || !part) {
      return res.status(400).json({
        error: "experimentId and part are required",
      });
    }

    const normalizedPart = part.toLowerCase();

    // 1. Fast path: return cached Q&A if it already exists
    const existing = await VivaQA.findOne({
      experimentId,
      part: normalizedPart,
    });

    if (existing) {
      return res.json({
        source: "db",
        qaPairs: existing.qaPairs,
      });
    }

    // Unique key for this experiment + part
    const key = `${experimentId}:${normalizedPart}`;

    // 2. If another request is already generating, wait for it
    if (pendingGenerations.has(key)) {
      await pendingGenerations.get(key);

      const generated = await VivaQA.findOne({
        experimentId,
        part: normalizedPart,
      });

      if (generated) {
        return res.json({
          source: "db",
          qaPairs: generated.qaPairs,
        });
      }
    }

    // 3. Start generation
    const generationPromise = (async () => {
      const experiment = await Experiment.findById(experimentId);

      if (!experiment) {
        throw new Error("Experiment not found");
      }

      const subExp = experiment.subExperiments.find(
        (s) => s.part?.toLowerCase() === normalizedPart,
      );

      if (!subExp) {
        throw new Error(
          `Sub-experiment with part "${normalizedPart}" not found`,
        );
      }

      const qaPairs = await generateVivaQA(subExp);

      try {
        const doc = await VivaQA.create({
          experimentId,
          part: normalizedPart,
          qaPairs,
        });

        return doc;
      } catch (err) {
        // Another request inserted while we were generating
        if (err.code === 11000) {
          return await VivaQA.findOne({
            experimentId,
            part: normalizedPart,
          });
        }

        throw err;
      }
    })();

    pendingGenerations.set(key, generationPromise);

    try {
      const doc = await generationPromise;

      return res.status(201).json({
        source: "ai",
        qaPairs: doc.qaPairs,
      });
    } finally {
      pendingGenerations.delete(key);
    }
  } catch (err) {
    console.error("getVivaQA error:", err);

    if (err.message === "Experiment not found") {
      return res.status(404).json({ error: err.message });
    }

    if (err.message.includes("Sub-experiment")) {
      return res.status(404).json({ error: err.message });
    }

    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
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