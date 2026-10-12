import Anthropic from "@anthropic-ai/sdk";
import { libraryAnswer, type GuideMessage } from "@/lib/guide";
import { langOf } from "@/lib/store-shared";

// Answers a question for the AI Guide. With an Anthropic key in the
// environment (ANTHROPIC_API_KEY in .env.local) Claude answers; without one,
// or if the request fails, the built-in heritage library answers instead.

const SYSTEM = `You are the Virasa AI Guide, a warm, knowledgeable heritage guide inside a travel app for India. The traveller is standing near Sidi Saiyyed Mosque in the Old City of Ahmedabad, Gujarat.

Answer questions about monuments, history, legends, crafts, food and how to plan a visit. The traveller is reading on a phone while walking, so keep each answer under about 90 words, in plain sentences with no markdown, headings or bullet symbols. Lead with the answer. Give dates, names and distances only when you are confident of them, and say plainly when something is legend rather than recorded history or when you are not sure. If asked about something unrelated to travel and heritage, say briefly what you can help with instead.

Latency-sensitive; begin your visible answer immediately.`;

const hasKey = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

export async function POST(request: Request) {
  let messages: GuideMessage[] = [];
  let lang = "en";
  try {
    const body = await request.json();
    if (Array.isArray(body.messages)) {
      messages = body.messages
        .filter((m: GuideMessage) => (m?.role === "user" || m?.role === "guide") && typeof m.text === "string")
        .slice(-12)
        .map((m: GuideMessage) => ({ role: m.role, text: m.text.slice(0, 2000) }));
    }
    if (typeof body.lang === "string") lang = body.lang;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Ask a question" }, { status: 400 });
  }

  const fromLibrary = () => Response.json({ text: libraryAnswer(messages, lang), source: "library" });
  if (!hasKey()) return fromLibrary();

  // The conversation must open with the traveller's turn.
  const history = messages.slice(messages.findIndex((m) => m.role === "user"));
  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low" },
      // If a safety classifier declines, retry on Anthropic's recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: `${SYSTEM}\n\nReply in ${langOf(lang).label} unless the traveller asks for another language.`,
      messages: history.map((m) => ({ role: m.role === "user" ? ("user" as const) : ("assistant" as const), content: m.text })),
    });
    if (response.stop_reason === "refusal") return fromLibrary();
    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();
    if (!text) return fromLibrary();
    return Response.json({ text, source: "claude" });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("AI Guide: the Anthropic key was rejected; answering from the library.");
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error("AI Guide: rate limited; answering from the library.");
    } else if (error instanceof Anthropic.APIError) {
      console.error(`AI Guide: API error ${error.status}: ${error.message}`);
    } else {
      console.error("AI Guide: request failed.", error);
    }
    return fromLibrary();
  }
}
