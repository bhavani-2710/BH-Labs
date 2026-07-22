import { getOpenAiClient } from "@/lib/openrouter";
import { getChatAssistantSystemPrompt } from "@/lib/prompts/chatAssistantSystemPrompt.js";

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
  const { message, code, language, history } = await req.json();
  if (!message) return Response.json({ error: "message is required" }, { status: 400 });

  const openai = getOpenAiClient();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!openai) {
          simulate(controller, `[Simulation Mode] I received your question: "${message}". Configure OPENROUTER_API_KEY to chat with the live model.`);
          controller.close();
          return;
        }
        const messages = [
          { role: "system", content: getChatAssistantSystemPrompt(language, code) },
          ...(history || []).map((h) => ({ role: h.sender === "ai" ? "assistant" : "user", content: h.text })),
          { role: "user", content: message },
        ];
        const responseStream = await openai.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages,
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
