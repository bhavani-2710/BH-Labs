const { jsonrepair } = require("jsonrepair");
const {
  EXPERIMENT_VIVA_SYSTEM_PROMPT,
} = require("../prompts/experimentVivaSystemPrompt");
const { getOpenAiClient } = require("../config/openrouter");

// Escape backslashes that aren't part of a valid JSON escape sequence
// (e.g. LaTeX-style \%, \_, \d from regex snippets, stray Windows paths, etc.)
const sanitizeJsonString = (str) => {
  return str.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "\\\\");
};

/**
 * generateVivaQA
 * Calls google/gemini-2.5-flash-lite to produce 7–9 short Q&A pairs for a sub-experiment.
 * @param {Object} subExp  - a subExperiment document (title, problemStatement, theory, concepts)
 * @returns {Array}        - [{ question, answer }, ...]
 **/
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

  let raw = response.choices[0].message.content || "";
  // Strip any accidental markdown fences
  raw = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (parseErr) {
    // Fall back: fix bad escapes, then let jsonrepair patch any remaining
    // structural issues (trailing commas, unbalanced brackets, etc.)
    try {
      const sanitized = sanitizeJsonString(raw);
      const repaired = jsonrepair(sanitized);
      parsed = JSON.parse(repaired);
    } catch (repairErr) {
      console.error("generateVivaQA: failed to parse AI response even after repair", repairErr);
      throw new Error("AI returned malformed JSON that could not be repaired.");
    }
  }

  if (!parsed || !Array.isArray(parsed.qaPairs)) {
    throw new Error("AI did not return a valid qaPairs array.");
  }
  return parsed.qaPairs;
};

module.exports = { generateVivaQA };