const OpenAI = require("openai");

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
 */
const generateVivaQA = async (subExp) => {
  const openai = getOpenAiClient();
  if (!openai) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const prompt = `You are an expert viva examiner for engineering lab practicals.

Generate 7 to 9 short viva question-and-answer pairs for the following sub-experiment.

Sub-Experiment Details:
Title: ${subExp.title}
Problem Statement: ${subExp.problemStatement || "N/A"}
Theory: ${subExp.theory || "N/A"}
Concepts: ${(subExp.concepts || []).join(", ") || "N/A"}

Rules:
- Questions must be concise and conceptual (not "what is X" definitions).
- Answers must be 1–3 sentences maximum.
- Cover fundamentals, working principle, output behaviour, and edge cases.
- Output STRICT JSON only — no markdown fences, no commentary.

Format:
{
  "qaPairs": [
    { "question": "...", "answer": "..." }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content: "You output only valid JSON. No markdown, no commentary.",
      },
      { role: "user", content: prompt },
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
