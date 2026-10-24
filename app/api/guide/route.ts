import Anthropic from "@anthropic-ai/sdk";
import { isFallback, isSmallTalk, libraryAnswer, type GuideMessage } from "@/lib/guide";
import { langOf } from "@/lib/store-shared";
import { gemini, geminiKey } from "@/lib/gemini";
import { cleanProfile, describeProfile } from "@/lib/profile";

// Answers a question for the AI Guide. Google Gemini answers when
// GEMINI_API_KEY is set in .env.local; otherwise Claude does when
// ANTHROPIC_API_KEY is set. With neither, or if the request fails, the
// built-in heritage library answers instead, so the guide always replies.

const SYSTEM = `You are the Virasa AI Guide, a warm, knowledgeable heritage guide inside a travel app for India.

Answer questions about monuments, history, legends, crafts, food and how to plan a visit. The traveller is reading on a phone while walking, so keep each answer under about 90 words, in plain sentences with no markdown, headings or bullet symbols. Lead with the answer. Give dates, names and distances only when you are confident of them, and say plainly when something is legend rather than recorded history or when you are not sure. The traveller may also ask about anything else — general knowledge, language and translation, culture, food, weather, directions, everyday questions or small talk. Answer those helpfully and directly too, the way a well-informed local friend would, and where it fits, connect back to their trip. Decline only requests that are harmful.

Write years, dates, numbers and distances as digits (1573, 2 km, 9 pm), never spelled out in words.

Latency-sensitive; begin your visible answer immediately.`;

const hasKey = () => Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
// Search asks for a short, glanceable answer; the guide chat can say a little more.
const SEARCH_NOTE = "This question comes from the app's search box: answer in at most 45 words, two or three plain sentences.";

// Where the traveller is, from the city the app follows (picked, or nearest to their location).
function whereNote(place: unknown) {
  const p = (place && typeof place === "object" ? place : {}) as { city?: unknown; state?: unknown; source?: unknown };
  const city = typeof p.city === "string" ? p.city.trim().slice(0, 60) : "";
  const state = typeof p.state === "string" ? p.state.trim().slice(0, 40) : "";
  if (!city || /^(ahmedabad|amdavad)$/i.test(city)) return "\n\nThe traveller is in Ahmedabad, Gujarat, usually around the Old City near Sidi Saiyyed Mosque.";
  return `\n\nThe traveller is in ${city}${state ? `, ${state}` : ""}, India${p.source === "gps" ? " (from their phone's location)" : ""}. Answer for ${city}: "near me" and "here" mean ${city}. Never assume they are in Ahmedabad.`;
}

async function askGemini(history: GuideMessage[], lang: string, mode: string, who: string): Promise<string | null> {
  return gemini({
    system: `${SYSTEM}${who}

Reply in ${langOf(lang).label} unless the traveller asks for another language.${mode === "search" ? `

${SEARCH_NOTE}` : ""}`,
    contents: history.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.text }] })),
    maxTokens: mode === "search" ? 220 : 600,
  });
}

export async function POST(request: Request) {
  let messages: GuideMessage[] = [];
  let lang = "en";
  let mode = "chat";
  // Who is travelling, so answers suit them (children, elders, solo…).
  let who = "";
  // The city the traveller is in, when it isn't Ahmedabad.
  let away = "";
  try {
    const body = await request.json();
    if (Array.isArray(body.messages)) {
      messages = body.messages
        .filter((m: GuideMessage) => (m?.role === "user" || m?.role === "guide") && typeof m.text === "string")
        .slice(-12)
        .map((m: GuideMessage) => ({ role: m.role, text: m.text.slice(0, 2000) }));
    }
    if (typeof body.lang === "string") lang = body.lang;
    if (body.mode === "search") mode = "search";
    who = whereNote(body.place);
    const city = typeof body.place?.city === "string" ? body.place.city.trim().slice(0, 60) : "";
    if (city && !/^(ahmedabad|amdavad)$/i.test(city)) away = city;
    if (body.profile) who += `\n\n${describeProfile(cleanProfile(body.profile))} Shape every answer to suit them; for young children, explain simply and playfully.`;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Ask a question" }, { status: 400 });
  }

  const fromLibrary = () => {
    const asked = messages[messages.length - 1].text;
    // The library only knows Ahmedabad: elsewhere, say so instead of answering for the wrong city.
    if (away && !isSmallTalk(asked)) {
      const text = `I can't reach the AI right now, and my built-in guide only covers Ahmedabad, so I can't answer for ${away} yet. Please ask again in a minute — or open Discover for food and hidden places in ${away}.`;
      return Response.json({ text, source: "library", fallback: true });
    }
    let text = libraryAnswer(messages, lang);
    const fallback = isFallback(text);
    // Without Gemini the library can't answer everything: say why, right where it's noticed.
    if (fallback && !geminiKey() && mode !== "search") text += "\n\n(Gemini isn't connected yet, so I can only answer from Virasa's built-in library. Add GEMINI_API_KEY to .env.local and restart the app to have Gemini answer anything.)";
    return Response.json({ text, source: "library", fallback });
  };
  // The conversation must open with the traveller's turn.
  const history = messages.slice(messages.findIndex((m) => m.role === "user"));

  if (geminiKey()) {
    try {
      const text = await askGemini(history, lang, mode, who);
      if (text) return Response.json({ text, source: "gemini" });
    } catch (error) {
      console.error("AI Guide: Gemini request failed.", error);
    }
    if (!hasKey()) return fromLibrary();
  }
  if (!hasKey()) return fromLibrary();
  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      output_config: { effort: "low" },
      // If a safety classifier declines, retry on Anthropic's recommended fallback model.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: `${SYSTEM}${who}\n\nReply in ${langOf(lang).label} unless the traveller asks for another language.`,
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
