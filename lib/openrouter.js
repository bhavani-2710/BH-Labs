import OpenAI from "openai";

/**
 * Returns an OpenAI client pointed at the OpenRouter gateway, or null when
 * OPENROUTER_API_KEY is unset so callers can fall back to simulation/mock mode.
 */
export function getOpenAiClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "http://github.com/bh-labs",
      "X-Title": "BH Labs",
    },
  });
}
