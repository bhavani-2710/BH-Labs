const OpenAI = require("openai");

/**
 * getOpenAiClient
 * Creates and returns a pre-configured OpenAI client pointed at the OpenRouter
 * API gateway. Returns null if OPENROUTER_API_KEY is not set so that callers
 * can fall back to mock/simulation mode instead of throwing.
 *
 * The SDK automatically attaches the `Authorization: Bearer <apiKey>` header;
 * only extra OpenRouter-specific headers are added here.
 *
 * @returns {OpenAI|null} Configured OpenAI client, or null when the key is missing.
 */
const getOpenAiClient = () => {
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
};

module.exports = { getOpenAiClient };
