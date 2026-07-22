import { getOpenAiClient } from "@/lib/openrouter";
import { EXPLAIN_CODE_SYSTEM_PROMPT } from "@/lib/prompts/explainCodeSystemPrompt.js";

export const dynamic = "force-dynamic";

const sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
};
const enc = new TextEncoder();

const simulate = (controller, text) => {
  const words = text.split(" ");
  for (let i = 0; i < words.length; i += 3) {
    const chunk = words.slice(i, i + 3).join(" ") + " ";
    controller.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`));
  }
  controller.enqueue(enc.encode("data: [DONE]\n\n"));
};

export async function POST(req) {
  const { experimentTitle, problemStatement, algorithm, code, language } = await req.json();
  if (!code) return Response.json({ error: "code is required" }, { status: 400 });

  const openai = getOpenAiClient();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!openai) {
          const mock =
            `[BH.AI Assistant - Simulation Mode]\n\n` +
            `To enable live AI explanations, add OPENROUTER_API_KEY to the environment.\n\n` +
            `Structural breakdown of the ${String(language).toUpperCase()} code:\n` +
            `1. **Imports/Includes**\n2. **Main Structure**\n3. **Core Logic**`;
          simulate(controller, mock);
          controller.close();
          return;
        }
        const responseStream = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: EXPLAIN_CODE_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Experiment Title:\n${experimentTitle || "Not provided"}\n\nProblem Statement:\n${problemStatement || "Not provided"}\n\nAlgorithm:\n${algorithm || "Not provided"}\n\nProgramming Language:\n${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nExplain this program to a student.`,
            },
          ],
          stream: true,
        });
        for await (const chunk of responseStream) {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        }
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: `Error: ${err.message}` } }] })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: sseHeaders });
}
