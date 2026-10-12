"use client";

// 18 · AI Guide
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { pop } from "@/components/Tap";
import { LANGS, langOf, useStored } from "@/lib/store";
import { UserName } from "@/components/User";
import type { GuideMessage } from "@/lib/guide";

// The conversation the screen opens with, so follow-ups have context.
const SEED: GuideMessage[] = [
  { role: "user", text: "Plan 2 hours here. I love old architecture and street food." },
  { role: "guide", text: "Here's a 4-stop loop that ends with chai at Manek Chowk: Sidi Saiyyed Mosque (20 min), Bhadra Fort (25 min), Teen Darwaza (10 min), Manek Chowk for chai (20 min). 1 h 40, 1.4 km. Tip: carry a scarf — two stops are mosques." },
];

const SPEECH_LOCALE: Record<string, string> = { en: "en-IN", hi: "hi-IN", gu: "gu-IN", ta: "ta-IN", bn: "bn-IN" };

export default function AIGuideScreen() {
  const [q, setQ] = useState("");
  const [thread, setThread] = useState<GuideMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [vote, setVote] = useState<"" | "up" | "down">("");
  const [lang, setLang] = useStored("lang", "en");
  const log = useRef<HTMLDivElement>(null);
  const threadRef = useRef<GuideMessage[]>([]);
  const busyRef = useRef(false);

  const ask = useCallback(
    async (text: string, replyLang?: string) => {
      const question = text.trim();
      if (!question || busyRef.current) return;
      busyRef.current = true;
      threadRef.current = [...threadRef.current, { role: "user", text: question }];
      setThread(threadRef.current);
      setQ("");
      setBusy(true);
      let answer = "";
      try {
        const res = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...SEED, ...threadRef.current], lang: replyLang || lang }),
        });
        answer = (await res.json()).text || "";
      } catch {
        // Offline or the server is down: say so below.
      }
      if (!answer) answer = "I couldn't reach the guide just now. Check your connection and try again.";
      threadRef.current = [...threadRef.current, { role: "guide", text: answer }];
      setThread(threadRef.current);
      setBusy(false);
      busyRef.current = false;
    },
    [lang]
  );

  // A question handed over from another screen (Lens, Reels, Search…) is asked on arrival.
  useEffect(() => {
    let handed = "";
    try {
      handed = window.sessionStorage.getItem("virasa:ask") || "";
    } catch {
      // No storage: nothing was handed over.
    }
    if (!handed) return;
    // Cleared only once it is asked, so a re-run of this effect still finds it.
    const t = setTimeout(() => {
      try {
        window.sessionStorage.removeItem("virasa:ask");
      } catch {
        // Nothing to clear.
      }
      ask(handed);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: thread.length ? "smooth" : "auto" });
  }, [thread, busy]);

  const speak = () => {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      toast("Voice input isn't available in this browser. Type your question instead.");
      return;
    }
    const rec = new Recognition();
    rec.lang = SPEECH_LOCALE[lang] || "en-IN";
    rec.onresult = (e: any) => ask(e.results[0][0].transcript);
    rec.onerror = () => toast("Didn't catch that. Tap the mic and try again.");
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const rate = (next: "up" | "down", el: Element) => {
    pop(el);
    setVote(vote === next ? "" : next);
    if (vote !== next) toast(next === "up" ? "Thanks — glad that helped" : "Thanks — we'll use this to improve the guide");
  };

  const v = { q, empty: q.length === 0, typed: q.length > 0 };
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FBF6EE", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <header style={{ position: "relative", zIndex: "1", padding: "54px 12px 12px 16px", display: "flex", alignItems: "center", gap: "12px", background: "#FFFFFF", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.07)" }}>
        <span style={{ flex: "0 0 46px", width: "46px", height: "46px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
            <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
            <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
          </svg>
        </span>
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "17px", fontWeight: "800" }}>
            AI Guide
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#5A4434" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2F7A4A" }} />
            Near Sidi Saiyyed Mosque, Ahmedabad
          </span>
        </span>
        <button type="button" aria-label={`Guide language: ${langOf(lang).label}`} onClick={() => setLangOpen(true)} style={{ height: "44px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <span style={{ height: "32px", padding: "0 11px", borderRadius: "999px", background: "#F5E6CC", color: "#6E4E1E", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "700" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
            <span>
              {langOf(lang).short}
            </span>
          </span>
        </button>
      </header>
      <div ref={log} role="log" aria-label="Conversation with AI Guide" className="chat-log" style={{ position: "absolute", left: "0", right: "0", top: "112px", bottom: "210px", overflowY: "auto", padding: "12px 16px 8px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div aria-hidden="true" style={{ flex: "1 0 0" }} />
        <div style={{ alignSelf: "flex-start", maxWidth: "300px", padding: "12px 14px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EADFD2", fontSize: "15px", lineHeight: "1.45" }}>
          Namaste <UserName first />! Ask me anything about the places around you.
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: "280px", padding: "12px 14px", borderRadius: "18px 18px 6px 18px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", lineHeight: "1.45" }}>
          Plan 2 hours here. I love old architecture and street food.
        </div>
        <div style={{ alignSelf: "flex-start", width: "318px", padding: "12px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EADFD2" }}>
          <p style={{ margin: "0 2px", fontSize: "15px", lineHeight: "1.45" }}>
            {"Here's a 4-stop loop that ends with chai at Manek Chowk."}
          </p>
          <div style={{ marginTop: "10px", padding: "12px", borderRadius: "14px", background: "#FBF6EE", border: "1px solid #EADFD2" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", fontWeight: "800" }}>
                Old City short loop
              </span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
                1 h 40 · 1.4 km
              </span>
            </div>
            <ol style={{ listStyle: "none", margin: "8px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
              <li style={{ height: "24px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  1
                </span>
                <span style={{ flex: "1" }}>
                  Sidi Saiyyed Mosque
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  20 min
                </span>
              </li>
              <li style={{ height: "24px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  2
                </span>
                <span style={{ flex: "1" }}>
                  Bhadra Fort
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  25 min
                </span>
              </li>
              <li style={{ height: "24px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  3
                </span>
                <span style={{ flex: "1" }}>
                  Teen Darwaza
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  10 min
                </span>
              </li>
              <li style={{ height: "24px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  4
                </span>
                <span style={{ flex: "1" }}>
                  Manek Chowk · chai
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  20 min
                </span>
              </li>
            </ol>
            <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
              <Link href="/navigate" style={{ flex: "1", height: "44px", borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                <span>
                  Start walk
                </span>
              </Link>
              <Link href="/walk" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "12px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
                Edit plan
              </Link>
            </div>
          </div>
          <p style={{ margin: "10px 2px 0", fontSize: "13px", lineHeight: "1.4", color: "#5A4434" }}>
            Tip: carry a scarf — two stops are mosques.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6F5B4B" }}>
          <span style={{ flex: "1" }}>
            {"From Virasa's verified heritage library"}
          </span>
          <button type="button" aria-label="Helpful" aria-pressed={vote === "up"} onClick={(e) => rate("up", e.currentTarget)} style={{ width: "36px", height: "36px", border: "0", borderRadius: "50%", background: vote === "up" ? "#F5E6CC" : "none", color: vote === "up" ? "#9A4E36" : "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </button>
          <button type="button" aria-label="Not helpful" aria-pressed={vote === "down"} onClick={(e) => rate("down", e.currentTarget)} style={{ width: "36px", height: "36px", border: "0", borderRadius: "50%", background: vote === "down" ? "#F5E6CC" : "none", color: vote === "down" ? "#9A4E36" : "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 14V2" />
              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
            </svg>
          </button>
        </div>
        {thread.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="rise" style={{ alignSelf: "flex-end", maxWidth: "280px", padding: "12px 14px", borderRadius: "18px 18px 6px 18px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", lineHeight: "1.45" }}>
              {m.text}
            </div>
          ) : (
            <div key={i} className="rise" style={{ alignSelf: "flex-start", maxWidth: "318px", padding: "12px 14px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EADFD2", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: "1.45", whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          )
        )}
        {busy ? (
          <div className="rise typing" aria-label="The guide is writing" style={{ alignSelf: "flex-start", padding: "14px 16px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EADFD2" }}>
            <i />
            <i />
            <i />
          </div>
        ) : null}
      </div>
      <div aria-label="Suggested questions" style={{ position: "absolute", left: "0", right: "0", bottom: "162px", padding: "0 16px", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        <Link href="/lens" style={{ flex: "0 0 auto", height: "38px", padding: "0 12px 0 10px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span>
            What am I looking at?
          </span>
        </Link>
        <button type="button" onClick={() => ask("Explain in हिन्दी", "hi")} style={{ flex: "0 0 auto", height: "38px", padding: "0 12px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          {"Explain in "}
          <span lang="hi">
            हिन्दी
          </span>
        </button>
        <button type="button" onClick={() => ask("Give me the kid-friendly version")} style={{ flex: "0 0 auto", height: "38px", padding: "0 12px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          Kid-friendly version
        </button>
      </div>
      <div style={{ position: "absolute", left: "12px", right: "12px", bottom: "100px", height: "54px", padding: "0 5px", borderRadius: "27px", background: "#FFFFFF", border: "1.5px solid #D9C7B3", boxShadow: "0 6px 16px rgba(90, 60, 30, 0.08)", display: "flex", alignItems: "center", gap: "4px" }}>
        <Link href="/lens" aria-label="Ask with your camera" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", color: "#5A4434", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </Link>
        <input type="text" aria-label="Ask the AI Guide" placeholder="Ask about any place in India…" value={v.q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(q); }} style={{ flex: "1", minWidth: "0", height: "44px", border: "0", outline: "none", background: "transparent", fontSize: "15px", color: "#2B1B10" }} />
        {v.empty ? (
          <>
            <button type="button" aria-label={listening ? "Listening…" : "Speak to the guide"} onClick={speak} className={listening ? "pulse" : undefined} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </button>
          </>
        ) : null}
        {v.typed ? (
          <>
            <button type="button" aria-label="Send" disabled={busy} onClick={() => ask(q)} className="pop-in" style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </>
        ) : null}
      </div>
      <MainNav active="ai-guide" />
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title="Guide language">
        <p>The guide answers and narrates in the language you pick.</p>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            className="sheet-row"
            aria-pressed={lang === l.id}
            onClick={() => {
              setLang(l.id);
              setLangOpen(false);
              toast(`Guide language: ${l.label}`);
            }}
          >
            <span>
              {l.native}
              <small>{l.label}</small>
            </span>
            <span aria-hidden="true">{lang === l.id ? "✓" : ""}</span>
          </button>
        ))}
      </Sheet>
    </div>
  );
}
