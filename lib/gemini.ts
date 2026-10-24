// Google Gemini, called from server routes only (the key never reaches the browser).
// Set GEMINI_API_KEY in .env.local; GEMINI_MODEL picks a different model.

export const geminiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
// If the chosen model is retired, overloaded or rate-limited, try Google's
// aliases for its current Flash and Flash-Lite models before giving up.
export const LITE_MODEL = "gemini-flash-lite-latest";
const FALLBACK_MODELS = ["gemini-flash-latest", LITE_MODEL];
// Long JSON answers (trip plans, Discover): Flash-Lite writes them in seconds,
// where Flash can take half a minute when it's busy, so Flash is the backup.
// Lite now and then gets stuck repeating itself, so it gets a second try.
export const FAST_MODELS = [LITE_MODEL, GEMINI_MODEL, LITE_MODEL];
// Answers worth retrying on another model: not found, rate-limited, overloaded, or a server fault.
const TRY_NEXT = new Set([404, 429, 500, 503]);

export type GeminiPart = { text: string } | { inline_data: { mime_type: string; data: string } };
export type GeminiTurn = { role: "user" | "model"; parts: GeminiPart[] };

type Reply = { candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[]; error?: { message?: string } };

// One request: instructions, the conversation (text and images), and optionally
// a JSON schema the answer must follow. Returns the text, or null on any failure.
// `models` overrides the order models are tried in.
export async function gemini({ system, contents, schema, maxTokens = 600, temperature = 0.6, timeoutMs = 12000, models = [GEMINI_MODEL, ...FALLBACK_MODELS] }: { system: string; contents: GeminiTurn[]; schema?: object; maxTokens?: number; temperature?: number; timeoutMs?: number; models?: string[] }): Promise<string | null> {
  const key = geminiKey();
  if (!key) return null;
  const config = { temperature, maxOutputTokens: maxTokens, ...(schema ? { responseMimeType: "application/json", responseSchema: schema } : {}) };
  // Lite thinks briefly: just as complete, faster, and it no longer gets stuck repeating itself.
  const bodyFor = (model: string) =>
    JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: model === LITE_MODEL ? { ...config, thinkingConfig: { thinkingLevel: "low" } } : config,
    });
  try {
    // The same model twice in a row is tried once; a model listed again later is a retry.
    for (const model of models.filter((m, i) => m !== models[i - 1])) {
      let res: Response;
      try {
        res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: bodyFor(model),
          // Don't hang a traveller's screen on a slow model: move on to the next one.
          signal: AbortSignal.timeout(timeoutMs),
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
      const answer = data.candidates?.[0];
      // A JSON answer cut off at the token limit can't be read: try the next model.
      if (schema && answer?.finishReason === "MAX_TOKENS") {
        console.error(`Gemini ${model} ran out of room, trying the next model.`);
        continue;
      }
      const text = (answer?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
      return text || null;
    }
    return null;
  } catch (error) {
    console.error("Gemini request failed.", error);
    return null;
  }
}
