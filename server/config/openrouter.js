const OpenAI = require("openai");

const getOpenAiClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://github.com/bh-labs",
      "X-Title": "BH Labs",
    },
  });
};

module.exports = { getOpenAiClient };
