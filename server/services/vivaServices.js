const { jsonrepair } = require("jsonrepair");
const { EXPERIMENT_VIVA_SYSTEM_PROMPT } = require("../prompts/experimentVivaSystemPrompt");
const { getOpenAiClient } = require("../config/openrouter");

/**
 * sanitizeJsonString
 * Escapes backslashes that are not part of a recognised JSON escape sequence
 * (e.g. LaTeX \%, \_, \d from regex snippets, stray Windows paths, etc.).
 * Applied as a pre-processing step before JSON.parse or jsonrepair.
 *
 * @param {string} str - Raw string from the AI response.
 * @returns {string}   Sanitized string with stray backslashes doubled.
 */
const sanitizeJsonString = (str) => {
  return str.replace(/\\(?!["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");
};

/**
 * generateVivaQA
 * Calls the LLM via OpenRouter to produce 7-10 short viva Q&A pairs for a
 * given sub-experiment. The AI is instructed to return strict JSON; if the
 * response contains markdown fences or minor structural errors, a two-stage
 * repair strategy is applied before raising an error.
 *
 * Repair strategy:
 *  1. Strip markdown fences from the raw response.
 *  2. Try strict JSON.parse.
 *  3. On failure: sanitize bad escapes, then apply jsonrepair for structural fixes.
 *
 * @param {object} subExp                  - A sub-experiment document.
 * @param {string} subExp.title            - Title of the sub-experiment.
 * @param {string} [subExp.problemStatement] - Problem description.
 * @param {string} [subExp.theory]          - Background theory text.
 * @param {string[]} [subExp.concepts]      - Array of concept keywords.
 * @returns {Promise<Array<{ question: string, answer: string }>>}
 *   Array of Q&A pair objects.
 * @throws {Error} If the API key is missing or the AI returns malformed JSON
 *   that cannot be repaired.
 */
const generateVivaQA = async (subExp) => {
  const openai = getOpenAiClient();
  if (!openai) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const SYSTEM_PROMPT = EXPERIMENT_VIVA_SYSTEM_PROMPT(subExp);

  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-lite",
    messages: [
      {
        role: "system",
        content: "You output only valid JSON. No markdown, no commentary.",
      },
      { role: "user", content: SYSTEM_PROMPT },
    ],
    temperature: 0.7,
  });

  // Strip any accidental markdown fences from the response
  let raw = response.choices[0].message.content || "";
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  // Stage 1: strict JSON.parse
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (parseErr) {
    // Stage 2: sanitize bad escapes, then let jsonrepair patch structural issues
    try {
      const sanitized = sanitizeJsonString(raw);
      const repaired = jsonrepair(sanitized);
      parsed = JSON.parse(repaired);
    } catch (repairErr) {
      console.error(
        "generateVivaQA: failed to parse AI response even after repair",
        repairErr,
      );
      throw new Error("AI returned malformed JSON that could not be repaired.");
    }
  }

  if (!parsed || !Array.isArray(parsed.qaPairs)) {
    throw new Error("AI did not return a valid qaPairs array.");
  }

  return parsed.qaPairs;
};

module.exports = { generateVivaQA };