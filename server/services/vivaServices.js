const OpenAI = require("openai");
const {
  EXPERIMENT_VIVA_SYSTEM_PROMPT,
} = require("../prompts/experimentVivaSystemPrompt");

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
 * generateVivaQA
 * Calls GPT-oss-120b to produce 7–9 short Q&A pairs for a sub-experiment.
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
    model: "google/gemini-2.5-flash",
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

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.qaPairs)) {
    throw new Error("AI did not return a valid qaPairs array.");
  }
  return parsed.qaPairs;
};

module.exports = { generateVivaQA };
