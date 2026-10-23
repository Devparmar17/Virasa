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
  // Answers are read aloud as well as shown, unless the traveller turns it off.
  const [prefs, setPrefs] = useStored<Record<string, boolean>>("prefs", {});
  const readAloud = prefs.guideVoice ?? true;
  const [speaking, setSpeaking] = useState<number | null>(null);
  // Who answered each reply: Gemini, Claude or the built-in library.
  const [sources, setSources] = useState<Record<number, string>>({});
  // Whether Gemini is connected on the server, so the guide can say who is answering.
  const [gemini, setGemini] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/ai-status", { method: "POST" })
      .then((r) => r.json())
      .then((d) => setGemini(Boolean(d.gemini)))
      .catch(() => setGemini(false));
  }, []);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const log = useRef<HTMLDivElement>(null);
  const threadRef = useRef<GuideMessage[]>([]);
  const busyRef = useRef(false);

  const say = useCallback(
    (text: string, idx: number, as?: string) => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const locale = SPEECH_LOCALE[as || lang] || "en-IN";
      const u = new SpeechSynthesisUtterance(text);
      u.lang = locale;
      const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));
      if (voice) u.voice = voice;
      u.onend = () => setSpeaking((n) => (n === idx ? null : n));
      u.onerror = () => setSpeaking((n) => (n === idx ? null : n));
      setSpeaking(idx);
      synth.speak(u);
    },
    [lang]
  );
  const hush = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(null);
  };
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const ask = useCallback(
    async (text: string, replyLang?: string, byVoice?: boolean) => {
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
        const data = await res.json();
        answer = data.text || "";
        // The answer's place in the thread, taken now: the updater runs later, after the thread grows.
        const at = threadRef.current.length;
        if (answer) setSources((s) => ({ ...s, [at]: data.source }));
      } catch {
        // Offline or the server is down: say so below.
      }
      if (!answer) answer = "I couldn't reach the guide just now. Check your connection and try again.";
      threadRef.current = [...threadRef.current, { role: "guide", text: answer }];
      setThread(threadRef.current);
      setBusy(false);
      busyRef.current = false;
      // A question asked aloud is always answered aloud; typed ones too while read-aloud is on.
      if (readAloud || byVoice) say(answer, threadRef.current.length - 1, replyLang);
    },
    [lang, readAloud, say]
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
      toast("Voice input isn't available in this browser. Type your question instead.", "error");
      return;
    }
    if (recRef.current) {
      recRef.current.stop();
      return;
    }
    hush();
    const rec = new Recognition();
    rec.lang = SPEECH_LOCALE[lang] || "en-IN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    let final = "";
    rec.onresult = (e: any) => {
      let heard = "";
      for (const r of e.results) heard += r[0].transcript;
      setQ(heard);
      if (e.results[e.results.length - 1].isFinal) final = heard.trim();
    };
    rec.onerror = (e: any) => {
      const why: Record<string, string> = {
        "no-speech": "Didn't hear anything. Tap the mic and start speaking.",
        "not-allowed": "Allow the microphone in your browser to talk to the guide.",
        "service-not-allowed": "Allow the microphone in your browser to talk to the guide.",
        "audio-capture": "No microphone was found on this device.",
        network: "Voice input needs an internet connection. Type your question instead.",
      };
      if (e.error !== "aborted") toast(why[e.error] || "Voice input stopped. Tap the mic to try again.", "error");
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
      if (final) ask(final, undefined, true);
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const rate = (next: "up" | "down", el: Element) => {
    pop(el, vote !== next);
    setVote(vote === next ? "" : next);
    if (vote !== next) toast(next === "up" ? "Thanks — glad that helped" : "Thanks — we'll use this to improve the guide", "success");
  };

  const v = { q, empty: q.length === 0, typed: q.length > 0 };
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <header style={{ position: "relative", zIndex: "1", padding: "54px 12px 12px 16px", display: "flex", alignItems: "center", gap: "12px", background: "#FFFFFF", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.07)" }}>
        <span style={{ flex: "0 0 46px", width: "46px", height: "46px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
            <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
            <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
          </svg>
        </span>
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "17px", fontWeight: "800" }}>
            AI Guide
            {gemini ? (
              <span className="fade-in" style={{ height: "22px", padding: "0 8px", borderRadius: "999px", background: "#EEF2FE", color: "#3457C9", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
                </svg>
                Gemini
              </span>
            ) : null}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#5A4434" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2F7A4A" }} />
            Near Sidi Saiyyed Mosque, Ahmedabad
          </span>
        </span>
        <button
          type="button"
          aria-pressed={readAloud}
          aria-label={readAloud ? "Answers are read aloud. Turn off" : "Read answers aloud"}
          onClick={() => {
            if (readAloud) hush();
            setPrefs((p) => ({ ...p, guideVoice: !readAloud }));
            toast(readAloud ? "Answers will be shown only" : "Answers will be read aloud", readAloud ? "info" : "success");
          }}
          style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: readAloud ? "#FBEDE6" : "#F6F1EA", color: readAloud ? "#9A4E36" : "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {readAloud ? (
              <>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </>
            ) : (
              <>
                <line x1="22" x2="16" y1="9" y2="15" />
                <line x1="16" x2="22" y1="9" y2="15" />
              </>
            )}
          </svg>
        </button>
        <button type="button" aria-label={`Guide language: ${langOf(lang).label}`} onClick={() => setLangOpen(true)} style={{ height: "44px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <span style={{ height: "32px", padding: "0 11px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "700" }}>
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
        {gemini === false ? (
          <div role="note" className="fade-in" style={{ alignSelf: "stretch", padding: "10px 12px", borderRadius: "14px", background: "#F6F1EA", border: "1px dashed #E2D3C1", fontSize: "12px", lineHeight: 1.45, color: "#5A4434" }}>
            <strong style={{ color: "#2B1B10" }}>Gemini isn&apos;t connected yet.</strong> For now answers come from Virasa&apos;s built-in library. To let Gemini answer anything you ask, add <strong>GEMINI_API_KEY</strong> to .env.local and restart the app.
          </div>
        ) : null}
        <div style={{ alignSelf: "flex-start", maxWidth: "300px", padding: "12px 14px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EFE6DA", fontSize: "15px", lineHeight: "1.45" }}>
          Namaste <UserName first />! Ask me anything about the places around you.
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: "280px", padding: "12px 14px", borderRadius: "18px 18px 6px 18px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", lineHeight: "1.45" }}>
          Plan 2 hours here. I love old architecture and street food.
        </div>
        <div style={{ alignSelf: "flex-start", width: "318px", padding: "12px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EFE6DA" }}>
          <p style={{ margin: "0 2px", fontSize: "15px", lineHeight: "1.45" }}>
            {"Here's a 4-stop loop that ends with chai at Manek Chowk."}
          </p>
          <div style={{ marginTop: "10px", padding: "12px", borderRadius: "14px", background: "#F6F1EA", border: "1px solid #EFE6DA" }}>
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
              <Link href="/walk?plan=loop&edit=1" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "12px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
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
          <button type="button" aria-label="Helpful" aria-pressed={vote === "up"} onClick={(e) => rate("up", e.currentTarget)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: vote === "up" ? "#F6EEE4" : "none", color: vote === "up" ? "#9A4E36" : "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 10v12" />
              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            </svg>
          </button>
          <button type="button" aria-label="Not helpful" aria-pressed={vote === "down"} onClick={(e) => rate("down", e.currentTarget)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: vote === "down" ? "#F6EEE4" : "none", color: vote === "down" ? "#9A4E36" : "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
            <div key={i} className="rise" style={{ alignSelf: "flex-start", maxWidth: "318px", padding: "12px 14px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EFE6DA", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: "1.45", whiteSpace: "pre-wrap" }}>
              {m.text}
              <span style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  aria-label={speaking === i ? "Stop reading this answer" : "Read this answer aloud"}
                  aria-pressed={speaking === i}
                  onClick={() => (speaking === i ? hush() : say(m.text, i))}
                  style={{ height: "34px", padding: "0 12px 0 10px", border: 0, borderRadius: "999px", background: speaking === i ? "#9A4E36" : "#F6EEE4", color: speaking === i ? "#FFFFFF" : "#7E3D29", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}
                >
                  {speaking === i ? (
                    <span className="eq" aria-hidden="true" style={{ height: "12px" }}>
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <polygon points="7 4 19 12 7 20 7 4" />
                    </svg>
                  )}
                  {speaking === i ? "Stop" : "Listen"}
                </button>
                {sources[i] ? (
                  <span style={{ fontSize: "11px", fontWeight: 700, color: sources[i] === "gemini" ? "#3457C9" : "#8A7563" }}>
                    {sources[i] === "gemini" ? "Answered by Gemini" : sources[i] === "claude" ? "Answered by Claude" : "From Virasa's library"}
                  </span>
                ) : null}
              </span>
            </div>
          )
        )}
        {busy ? (
          <div className="rise typing" aria-label="The guide is writing" style={{ alignSelf: "flex-start", padding: "14px 16px", borderRadius: "18px 18px 18px 6px", background: "#FFFFFF", border: "1px solid #EFE6DA" }}>
            <i />
            <i />
            <i />
          </div>
        ) : null}
      </div>
      <div aria-label="Suggested questions" className="hscroll" style={{ position: "absolute", left: "0", right: "0", bottom: "162px", padding: "0 16px", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
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
        <input type="text" aria-label="Ask the AI Guide" placeholder={listening ? "Listening… speak now" : gemini ? "Ask Gemini anything…" : "Ask about any place in India…"} value={v.q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ask(q); }} style={{ flex: "1", minWidth: "0", height: "44px", border: "0", outline: "none", background: "transparent", fontSize: "15px", color: "#2B1B10" }} />
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
