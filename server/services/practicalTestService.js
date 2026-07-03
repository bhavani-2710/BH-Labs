/**
 * practicalTestService.js
 *
 * Business logic for generating and persisting practical test questions.
 * Separated from the controller so that the HTTP layer stays thin and
 * this logic can be tested or reused independently.
 *
 * Flow:
 *  1. getQuestions (controller) receives the HTTP request.
 *  2. generateQuestionsForSubject (this service) does all the heavy lifting:
 *     a. Loads the subject and its experiments from the DB.
 *     b. Decides whether to generate a full fresh batch (bank not yet full)
 *        or sample from the bank plus one fresh question.
 *     c. Calls the OpenRouter LLM (or falls back to mock data).
 *     d. Persists new questions via persistQuestions.
 *     e. Returns the final shuffled array of 10 questions.
 */

const mongoose = require("mongoose");
const Subject = require("../models/Subject");
const Experiment = require("../models/Experiment");
const TestQuestion = require("../models/TestQuestion");
const { jsonrepair } = require("jsonrepair");
const { PRACTICAL_TEST_SYSTEM_PROMPT } = require("../prompts/practicalTestSystemPrompt");
const { getOpenAiClient } = require("../config/openrouter");

// ── Constants ─────────────────────────────────────────────────────────────────

/** Maximum number of questions stored per subject in the question bank. */
const QUESTION_BANK_LIMIT = 50;

/** Total number of questions served per test attempt. */
const TEST_SIZE = 10;

/** Number of questions reused from the existing bank once it is full. */
const REUSE_FROM_BANK = 9;

/** Number of freshly generated questions added per test once the bank is full. */
const FRESH_PER_TEST = 1;

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * sanitizeJsonString
 * Escapes backslashes that are not part of a recognised JSON escape sequence
 * (e.g. LaTeX \%, stray Windows paths, regex snippets). This prevents
 * JSON.parse from throwing on otherwise valid content.
 *
 * @param {string} str - Raw JSON string from the AI response.
 * @returns {string}   Sanitized string safe to pass to JSON.parse.
 */
const sanitizeJsonString = (str) =>
  str.replace(/\\(?!["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");

/**
 * extractQuestionsRegex
 * Fallback parser that extracts question objects directly from free-form text
 * using a regex when full JSON parsing has already failed. Returns only
 * questions that have exactly 4 options and a valid correctIndex.
 *
 * @param {string} text - Raw text from the AI response.
 * @returns {Array<{text: string, options: string[], correctIndex: number}>}
 */
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
      // Ignore malformed individual matches and continue
    }
  }
  return matches;
};

/**
 * generateMockQuestions
 * Produces a deterministic set of placeholder MCQs based on the subject's
 * sub-experiment titles. Used when no AI key is configured or when the AI
 * call fails, so the application stays functional in degraded environments.
 *
 * @param {string} subjectName       - Human-readable subject name for question text.
 * @param {Array}  subExperiments    - Array of sub-experiment objects with title/problemStatement.
 * @param {number} [count=TEST_SIZE] - Number of questions to generate.
 * @returns {Array<{text: string, options: string[], correctIndex: number}>}
 */
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

/**
 * generateAIQuestions
 * Calls the OpenRouter LLM to produce `count` unique MCQ(s) for the given
 * subject. Passes previously used question texts (`avoidTexts`) so the model
 * avoids generating near-duplicates. Parses the response with a two-stage
 * strategy: strict JSON first, regex extraction as fallback.
 *
 * @param {object}   params
 * @param {OpenAI}   params.openai         - Pre-configured OpenAI/OpenRouter client.
 * @param {object}   params.subject        - Mongoose Subject document.
 * @param {string}   params.subExpsContext - Formatted string of sub-experiment details.
 * @param {number}   params.count          - Exact number of questions to generate.
 * @param {string[]} [params.avoidTexts=[]] - Previously used question texts to avoid.
 * @returns {Promise<Array<{text: string, options: string[], correctIndex: number}>>}
 * @throws {Error} When the AI returns unusable output despite both parse strategies.
 */
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

The following are the experiment details from which the practical test must be generated.
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
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "system", content: PRACTICAL_TEST_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 1.0,
  });

  const contentText = response.choices[0].message.content.trim();
  const cleanedText = contentText
    .replace(/^```json\s*/i, "")
    .replace(/```$/, "")
    .trim();

  // Stage 1: strict JSON parse (with sanitization + jsonrepair)
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
    // Stage 2: regex extraction fallback
    console.warn(
      "JSON parsing error for generated questions, attempting regex fallback extraction...",
      parseErr,
    );
    const extracted = extractQuestionsRegex(cleanedText).slice(0, count);
    if (extracted.length > 0) return extracted;
    throw new Error("AI question generation failed for both JSON and regex parsing");
  }
};

/**
 * persistQuestions
 * Writes a batch of validated question objects to the TestQuestion collection.
 * Silently swallows storage errors so that a DB hiccup never prevents the
 * questions from reaching the client in the same request.
 *
 * @param {mongoose.Types.ObjectId|string} subjectId - The subject the questions belong to.
 * @param {Array<{text: string, options: string[], correctIndex: number}>} questions
 * @returns {Promise<void>}
 */
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

// ── Exported service function ─────────────────────────────────────────────────

/**
 * generateQuestionsForSubject
 * Core service function that assembles a 10-question test for a given subject.
 *
 * Strategy:
 *  - If the question bank has fewer than QUESTION_BANK_LIMIT entries, generate
 *    a full fresh batch of TEST_SIZE questions and add them all to the bank.
 *  - Once the bank is full, sample REUSE_FROM_BANK random questions from the DB
 *    and generate FRESH_PER_TEST new question(s), then shuffle.
 *
 * @param {string} subjectId - MongoDB ObjectId string for the subject.
 * @returns {Promise<Array<{id: number, text: string, options: string[], correctIndex: number}>>}
 * @throws {Error} With `.statusCode = 404` if the subject is not found.
 */
const generateQuestionsForSubject = async (subjectId) => {
  const subject = await Subject.findById(subjectId);
  if (!subject) {
    const notFoundErr = new Error("Subject not found");
    notFoundErr.statusCode = 404;
    throw notFoundErr;
  }

  // Collect all sub-experiments across the subject's experiments
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

  // Ensure there is always at least one context entry for question generation
  if (subExperiments.length === 0) {
    subExperiments.push({
      title: `${subject.name} Basic Execution`,
      problemStatement: `Standard exercises on ${subject.name}`,
      theory: "Core programming syntax and fundamentals",
      algorithm: "Basic sequential steps",
    });
  }

  // Shuffle sub-experiments so the AI sees varied context across requests
  const shuffledSubExps = [...subExperiments].sort(() => Math.random() - 0.5);
  const subExpsContext = shuffledSubExps
    .map(
      (sub, index) =>
        `[Subexperiment ${index + 1}]
        Title: ${sub.title}
        Problem: ${sub.problemStatement}
        Theory: ${sub.theory}
        Algorithm: ${sub.algorithm}`,
    )
    .join("\n\n");

  const openai = getOpenAiClient();
  const existingCount = await TestQuestion.countDocuments({ subjectId });
  let finalQuestions = [];

  if (existingCount < QUESTION_BANK_LIMIT) {
    // Bank still filling up: generate a fresh batch and add it all to the bank
    let freshQs;

    if (!openai) {
      console.log(`[Practical Test] OpenAI key missing. Generating mock questions for ${subject.name}`);
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

    // Hard-cap the insertion to avoid exceeding QUESTION_BANK_LIMIT due to race conditions
    const preInsertCount = await TestQuestion.countDocuments({ subjectId });
    const remainingSlots = Math.max(0, QUESTION_BANK_LIMIT - preInsertCount);
    await persistQuestions(subjectId, freshQs.slice(0, remainingSlots));
    finalQuestions = freshQs;
  } else {
    // Bank is full: reuse random archived questions + generate 1 fresh question
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

  // Add sequential IDs for the client
  return finalQuestions.map((q, idx) => ({
    id: idx + 1,
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
  }));
};

module.exports = { generateQuestionsForSubject };
