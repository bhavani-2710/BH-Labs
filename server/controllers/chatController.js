const { getOpenAiClient } = require("../config/openrouter");
const { EXPLAIN_CODE_SYSTEM_PROMPT } = require("../prompts/explainCodeSystemPrompt");
const { getChatAssistantSystemPrompt } = require("../prompts/chatAssistantSystemPrompt");

/**
 * simulateStream
 * Utility that simulates a Server-Sent Events (SSE) stream by splitting a
 * static text string into small word-chunks and sending them at ~100 ms
 * intervals. Used as a fallback when no OpenRouter API key is configured.
 *
 * @param {import("express").Response} res  - Express response object.
 * @param {string}                    text  - The complete text to stream word-by-word.
 * @returns {void}
 */
const simulateStream = (res, text) => {
  const words = text.split(" ");
  let i = 0;
  const interval = setInterval(() => {
    if (i < words.length) {
      const chunk = words.slice(i, i + 3).join(" ") + " ";
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`);
      i += 3;
    } else {
      res.write("data: [DONE]\n\n");
      clearInterval(interval);
      res.end();
    }
  }, 100);
};

/**
 * setSseHeaders
 * Sets the standard HTTP headers required for a Server-Sent Events (SSE)
 * streaming response. Must be called before any data is written.
 *
 * @param {import("express").Response} res - Express response object.
 * @returns {void}
 */
const setSseHeaders = (res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
};

// ── Controller: POST /api/explain ────────────────────────────────────────────

/**
 * explainCode
 * Streams a step-by-step code explanation to the client using Server-Sent
 * Events. When the OpenRouter API key is present, calls the live LLM;
 * otherwise falls back to a static simulation message.
 *
 * Expected request body:
 *   - code           {string}  Required. The code snippet to explain.
 *   - language       {string}  Programming language (e.g. "c", "python").
 *   - experimentTitle   {string}  Optional context for the explanation.
 *   - problemStatement  {string}  Optional context for the explanation.
 *   - algorithm         {string}  Optional context for the explanation.
 *
 * @param {import("express").Request}  req
 * @param {import("express").Response} res
 */
const explainCode = async (req, res) => {
  try {
    const { experimentTitle, problemStatement, algorithm, code, language } = req.body;

    if (!code) {
      return res.status(400).json({ error: "code is required" });
    }

    setSseHeaders(res);

    const openai = getOpenAiClient();

    if (!openai) {
      // Simulation mode — no API key configured
      const mockExplanation =
        `[BH.AI Assistant - Simulation Mode]\n\n` +
        `To enable live AI explanations, please add your OPENROUTER_API_KEY in the server/.env file.\n\n` +
        `Here is a simplified structural breakdown of the ${language.toUpperCase()} code:\n` +
        `1. **Imports/Includes**: The program includes standard libraries needed for standard input and output.\n` +
        `2. **Main Structure**: It defines an entrypoint function which acts as the main runner of the task.\n` +
        `3. **Core Logic**: It implements variables and control flows to execute operations.`;

      simulateStream(res, mockExplanation);
      return;
    }

    const responseStream = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: EXPLAIN_CODE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Experiment Title:
                    ${experimentTitle || "Not provided"}

                    Problem Statement:
                    ${problemStatement || "Not provided"}

                    Algorithm:
                    ${algorithm || "Not provided"}

                    Programming Language:
                    ${language}

                    Code:
                    \`\`\`${language}
                    ${code}
                    \`\`\`

                    Explain this program to a student.
          `,
        },
      ],
      stream: true,
    });

    for await (const chunk of responseStream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Explain controller error:", err);
    res.write(
      `data: ${JSON.stringify({ choices: [{ delta: { content: `Error: ${err.message}` } }] })}\n\n`,
    );
    res.end();
  }
};

// ── Controller: POST /api/chat ────────────────────────────────────────────────

/**
 * chatWithAssistant
 * Streams a tutoring chat reply to the client using Server-Sent Events.
 * Maintains conversation history so the model has prior context. Falls back to
 * a simulation message when no API key is configured.
 *
 * Expected request body:
 *   - message  {string}   Required. The student's latest message.
 *   - language {string}   Programming language currently active in the editor.
 *   - code     {string}   Current code content in the editor (may be empty).
 *   - history  {Array}    Prior chat messages in {sender, text} format.
 *
 * @param {import("express").Request}  req
 * @param {import("express").Response} res
 */
const chatWithAssistant = async (req, res) => {
  try {
    const { message, code, language, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    setSseHeaders(res);

    const openai = getOpenAiClient();

    if (!openai) {
      // Simulation mode — no API key configured
      const mockReply = `[Simulation Mode] I received your question: "${message}". Please configure OPENROUTER_API_KEY in the server/.env file to chat with the live model.`;
      simulateStream(res, mockReply);
      return;
    }

    // Build message array: system prompt → conversation history → latest user message
    const messages = [
      { role: "system", content: getChatAssistantSystemPrompt(language, code) },
      ...(history || []).map((h) => ({
        role: h.sender === "ai" ? "assistant" : "user",
        content: h.text,
      })),
      { role: "user", content: message },
    ];

    const responseStream = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      stream: true,
    });

    for await (const chunk of responseStream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Chat controller error:", err);
    res.write(
      `data: ${JSON.stringify({ choices: [{ delta: { content: `Error: ${err.message}` } }] })}\n\n`,
    );
    res.end();
  }
};

module.exports = {
  explainCode,
  chatWithAssistant,
};
