// Google Gemini, called from server routes only (the key never reaches the browser).
// Set GEMINI_API_KEY in .env.local; GEMINI_MODEL picks a different model.

export const geminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
// If the chosen model is retired, overloaded or rate-limited, try Google's
// aliases for its current Flash and Flash-Lite models before giving up.
const FALLBACK_MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];
// Answers worth retrying on another model: not found, rate-limited, overloaded, or a server fault.
const TRY_NEXT = new Set([404, 429, 500, 503]);

export type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };
export type GeminiTurn = { role: "user" | "model"; parts: GeminiPart[] };

type Reply = { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };

// One request: instructions, the conversation (text and images), and optionally
// a JSON schema the answer must follow. Returns the text, or null on any failure.
export async function gemini({ system, contents, schema, maxTokens = 600, temperature = 0.6 }: { system: string; contents: GeminiTurn[]; schema?: object; maxTokens?: number; temperature?: number }): Promise<string | null> {
  const key = geminiKey();
  if (!key) return null;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents,
    generationConfig: { temperature, maxOutputTokens: maxTokens, ...(schema ? { responseMimeType: "application/json", responseSchema: schema } : {}) },
  });
  try {
    for (const model of [...new Set([GEMINI_MODEL, ...FALLBACK_MODELS])]) {
      let res: Response;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body,
          // Don't hang a traveller's screen on a slow model: move on to the next one.
          signal: AbortSignal.timeout(12000),
        });
      } catch (error) {
        if ((error as Error).name !== "TimeoutError") throw error;
        console.error(`Gemini ${model} took too long, trying the next model.`);
        continue;
      }
      const data = (await res.json()) as Reply;
      if (TRY_NEXT.has(res.status)) {
        console.error(`Gemini ${model} unavailable (${res.status}), trying the next model.`);
        continue;
      }
      if (!res.ok) {
        console.error(`Gemini error ${res.status}: ${data.error?.message ?? "unknown"}`);
        return null;
      }
      const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
      return text || null;
    }
    return null;
  } catch (error) {
    console.error("Gemini request failed.", error);
    return null;
  }
}
