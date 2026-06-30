const OpenAI = require("openai");

const getOpenAiClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5050",
      "X-Title": "BH Labs",
    }
  });
};

// POST /api/explain (streams code explanation)
const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code) {
      console.log('code is required');

      return res.status(400).json({ error: "code is required" });
    }

    // Set streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const openai = getOpenAiClient();

    if (!openai) {
      // Mock stream simulation when key is missing
      const mockExplanation = `[BH.AI Assistant - Simulation Mode]\n\n` +
        `To enable live AI explanations, please add your OPENROUTER_API_KEY in the server/.env file.\n\n` +
        `Here is a simplified structural breakdown of the ${language.toUpperCase()} code:\n` +
        `1. **Imports/Includes**: The program includes standard libraries needed for standard input and output.\n` +
        `2. **Main Structure**: It defines an entrypoint function which acts as the main runner of the task.\n` +
        `3. **Core Logic**: It implements variables and control flows to execute operations.\n` +
        `4. **Output Results**: It prints out the finalized operations to the console terminal.`;

      const words = mockExplanation.split(" ");
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
      return;
    }

    const responseStream = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "You are a friendly AI coding assistant designed to explain solutions to students. Explain the provided code step-by-step in very simple, easy-to-understand language dont over explain keep it to the point.Do not output markdown code blocks unless necessary."
        },
        {
          role: "user",
          content: `Explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
        }
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
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: `Error: ${err.message}` } }] })}\n\n`);
    res.end();
  }
};

// POST /api/chat (streams chat assistant responses)
const chatWithAssistant = async (req, res) => {
  try {
    const { message, code, language, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // Set streaming headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const openai = getOpenAiClient();

    if (!openai) {
      // Mock stream simulation when key is missing
      const mockReply = `[Simulation Mode] I received your question: "${message}". Please configure OPENROUTER_API_KEY in the server/.env file to chat with the live model.`;
      const words = mockReply.split(" ");
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
      return;
    }

    const systemPrompt = `You are Bh.AI, a friendly programming tutor assisting a student in a lab workspace.
The student is coding in the ${language} language.
The current code in their editor is:
\`\`\`${language}
${code || "(empty)"}
\`\`\`

Answer their questions in an encouraging, simple, and tutoring style. Guide them towards the answer rather than just giving the solution code outright. Always explain concepts simply.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).map(h => ({ role: h.sender === "ai" ? "assistant" : "user", content: h.text })),
      { role: "user", content: message }
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
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: `Error: ${err.message}` } }] })}\n\n`);
    res.end();
  }
};

module.exports = {
  explainCode,
  chatWithAssistant,
};
