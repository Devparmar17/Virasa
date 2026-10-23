import { GEMINI_MODEL, geminiKey } from "@/lib/gemini";

// Which AI is connected, for Settings and the screens that use it. POST so it
// is answered at request time from the server's environment, never prerendered.
export async function POST() {
  const claude = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
  return Response.json({ gemini: Boolean(geminiKey()), claude, model: geminiKey() ? GEMINI_MODEL : null });
}
