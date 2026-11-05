"use client";

// 18 · AI Guide — a conversation with Virasa's guide (Gemini when connected).
// A new chat opens on a greeting and four starters; answers are shown and,
// unless turned off, read aloud. The conversation is kept until "New chat".
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { pop } from "@/components/Tap";
import { Greeting } from "@/components/User";
import { LANGS, langOf, readStored, speechLocale, travellerProfile, useStored } from "@/lib/store";
import { DEFAULT_HERE, isAhmedabad, type Here } from "@/lib/here";
import type { GuideMessage } from "@/lib/guide";
import BookingCard from "@/components/BookingCard";
import { BOOKING_WORDS, type BookingDraft } from "@/lib/booking";
import { dayKey } from "@/lib/tickets";
import { useT, type Key } from "@/lib/i18n";

// A message in the thread: who said it, what, and for answers where it came from.
type Msg = GuideMessage & { kind?: "plan" | "booking"; source?: string; vote?: "up" | "down"; draft?: BookingDraft; bookedRef?: string };

const THREAD = "guideThread";

// The walk the guide suggests for "Plan 2 hours here".
const PLAN_STOPS: [string, string][] = [
  ["Sidi Saiyyed Mosque", "20 min"],
  ["Bhadra Fort", "25 min"],
  ["Teen Darwaza", "10 min"],
  ["Manek Chowk · chai", "20 min"],
];

const Icon = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const Spark = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
  </svg>
);
const GuideMark = ({ size = 28 }: { size?: number }) => (
  <span aria-hidden="true" style={{ flex: `0 0 ${size}px`, width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Spark size={Math.round(size * 0.46)} />
  </span>
);

// The four ways into a new chat.
const STARTERS: { title: Key; sub: Key; icon: ReactNode; ask?: Key; plan?: boolean; href?: string }[] = [
  {
    title: "gd.s_plan",
    sub: "gd.s_plan_sub",
    icon: <path d="M3 11l19-9-9 19-2-8-8-2z" />,
    plan: true,
  },
  {
    title: "gd.s_lens",
    sub: "gd.s_lens_sub",
    icon: (
      <>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    href: "/lens",
  },
  {
    title: "gd.s_disc",
    sub: "gd.s_disc_sub",
    icon: (
      <>
        <path d="M6 3h12l4 6-10 13L2 9Z" />
        <path d="M11 3 8 9l4 13 4-13-3-6M2 9h20" />
      </>
    ),
    href: "/discover",
  },
  {
    title: "gd.s_legend",
    sub: "gd.s_legend_sub",
    icon: <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
    ask: "gd.s_legend_ask",
  },
];

export default function AIGuideScreen() {
  const [thread, setThread] = useStored<Msg[]>(THREAD, []);
  const t = useT();
  const current = () => readStored<Msg[]>(THREAD, []);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useStored("lang", "en");
  const [here] = useStored<Here>("here", DEFAULT_HERE);
  // Answers are read aloud as well as shown, unless the traveller turns it off.
  const [prefs, setPrefs] = useStored<Record<string, boolean>>("prefs", {});
  const readAloud = prefs.guideVoice ?? true;
  const [speaking, setSpeaking] = useState<number | null>(null);
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
  const busyRef = useRef(false);

  const say = useCallback(
    (text: string, idx: number, as?: string) => {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const locale = speechLocale(as || lang);
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
      const asked = [...readStored<Msg[]>(THREAD, []), { role: "user" as const, text: question }];
      setThread(asked);
      setQ("");
      setBusy(true);
      let answer = "";
      let source = "";
      // Asking to book something: the guide puts the booking together for a tap to confirm.
      if (BOOKING_WORDS.test(question)) {
        try {
          const res = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: question, today: dayKey(new Date()), lang: replyLang || lang }) });
          const data = await res.json();
          if (data.intent === "book" || data.intent === "unavailable") {
            const reply: Msg = data.intent === "book" ? { role: "guide", text: data.reply, kind: "booking", draft: data.draft, source: "booking" } : { role: "guide", text: data.reply, source: "booking" };
            const answered = [...readStored<Msg[]>(THREAD, []), reply];
            setThread(answered);
            setBusy(false);
            busyRef.current = false;
            if (readAloud || byVoice) say(data.reply, answered.length - 1, replyLang);
            return;
          }
        } catch {
          // Couldn't put a booking together: answer as usual below.
        }
      }
      try {
        const res = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: asked.map(({ role, text }) => ({ role, text })), lang: replyLang || lang, profile: travellerProfile(), place: readStored<Here>("here", DEFAULT_HERE) }),
        });
        const data = await res.json();
        answer = data.text || "";
        source = data.source || "";
      } catch {
        // Offline or the server is down: say so below.
      }
      if (!answer) answer = t("gd.err_offline");
      const answered = [...readStored<Msg[]>(THREAD, []), { role: "guide" as const, text: answer, source }];
      setThread(answered);
      setBusy(false);
      busyRef.current = false;
      // A question asked aloud is always answered aloud; typed ones too while read-aloud is on.
      if (readAloud || byVoice) say(answer, answered.length - 1, replyLang);
    },
    [lang, readAloud, say, setThread, t]
  );

  // A booking confirmed from its card is marked as booked in the conversation.
  const markBooked = (i: number, ref: string) => setThread(current().map((m, n) => (n === i ? { ...m, bookedRef: ref } : m)));

  // "Plan 2 hours here" answers with the walk card straight away.
  const askPlan = () => {
    if (busyRef.current) return;
    const text = `${t("gd.plan_intro")} ${PLAN_STOPS.map(([name, mins]) => `${name} (${mins})`).join(", ")}. 1 h 40, 1.4 km. ${t("gd.plan_tip")}`;
    const next: Msg[] = [...current(), { role: "user", text: t("gd.plan_ask") }, { role: "guide", text, kind: "plan", source: "library" }];
    setThread(next);
    if (readAloud) say(text, next.length - 1);
  };

  const newChat = () => {
    hush();
    setThread([]);
    setQ("");
  };

  const rate = (i: number, vote: "up" | "down", el: Element) => {
    const was = thread[i]?.vote;
    pop(el, was !== vote);
    setThread(current().map((m, n) => (n === i ? { ...m, vote: was === vote ? undefined : vote } : m)));
    if (was !== vote) toast(vote === "up" ? t("gd.thanks_up") : t("gd.thanks_down"), "success");
  };

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
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [thread, busy]);

  const speak = () => {
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      toast(t("gd.mic_none"), "error");
      return;
    }
    if (recRef.current) {
      recRef.current.stop();
      return;
    }
    hush();
    const rec = new Recognition();
    rec.lang = speechLocale(lang);
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    let final = "";
    rec.onresult = (e) => {
      let heard = "";
      for (const r of Array.from(e.results)) heard += r[0].transcript;
      setQ(heard);
      if (e.results[e.results.length - 1].isFinal) final = heard.trim();
    };
    rec.onerror = (e) => {
      const why: Record<string, string> = {
        "no-speech": t("gd.mic_quiet"),
        "not-allowed": t("gd.mic_allow"),
        "service-not-allowed": t("gd.mic_allow"),
        "audio-capture": t("gd.mic_missing"),
        network: t("gd.mic_net"),
      };
      if (e.error !== "aborted") toast(why[e.error] || t("gd.mic_stopped"), "error");
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

  const lastIsGuide = thread.length > 0 && thread[thread.length - 1].role === "guide";
  const chip = { flex: "0 0 auto", height: "38px", padding: "0 14px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none", cursor: "pointer" } as const;
  const roundBtn = (on: boolean) => ({ flex: "0 0 40px", width: "40px", height: "40px", border: 0, borderRadius: "50%", background: on ? "#FBEDE6" : "#F6F1EA", color: on ? "#9A4E36" : "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }) as const;


  return (
    <div style={{ width: "390px", height: "min(844px, 100dvh)", minHeight: "640px", position: "relative", overflow: "hidden", background: "#FFFFFF", color: "#2B1B10" }}>
      {/* Header: who you're talking to, and the voice and language controls. */}
      <header style={{ position: "relative", zIndex: 2, padding: "50px 10px 10px 14px", display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.96)", borderBottom: "1px solid #F3ECE2" }}>
        <GuideMark size={40} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "17px", fontWeight: 800, whiteSpace: "nowrap" }}>
            {t("tab.guide")}
          </span>
          <span style={{ marginTop: "2px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B", whiteSpace: "nowrap", overflow: "hidden" }}>
            <span aria-hidden="true" style={{ flex: "0 0 7px", width: "7px", height: "7px", borderRadius: "50%", background: "#2F7A4A" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{isAhmedabad(here) ? t("gd.near_sidi") : t("gd.in_city", { city: here.city })}</span>
          </span>
        </span>
        {thread.length ? (
          <button type="button" aria-label={t("gd.new_chat")} onClick={newChat} className="fade-in" style={roundBtn(false)}>
            <Icon size={18}>
              <path d="M12 20h9" />
              <path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.86z" />
            </Icon>
          </button>
        ) : null}
        <button
          type="button"
          aria-pressed={readAloud}
          aria-label={readAloud ? t("gd.voice_is_on") : t("gd.voice_turn_on")}
          onClick={() => {
            if (readAloud) hush();
            setPrefs((p) => ({ ...p, guideVoice: !readAloud }));
            toast(readAloud ? t("gd.toast_text") : t("gd.toast_voice"), readAloud ? "info" : "success");
          }}
          style={roundBtn(readAloud)}
        >
          <Icon size={18}>
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
          </Icon>
        </button>
        <button type="button" aria-label={t("gd.lang_label", { name: langOf(lang).label })} onClick={() => setLangOpen(true)} style={{ flex: "0 0 auto", minWidth: "40px", height: "40px", padding: "0 10px", border: 0, borderRadius: "999px", background: "#F6F1EA", color: "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, cursor: "pointer" }}>
          {langOf(lang).short}
        </button>
      </header>

      {/* The conversation, or a welcome with starters when it's new. */}
      <div ref={log} role="log" aria-label={t("gd.convo")} className="chat-log" style={{ position: "absolute", left: 0, right: 0, top: "101px", bottom: lastIsGuide && !busy ? "214px" : "168px", overflowY: "auto", padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: "14px" }}>
        {thread.length === 0 ? (
          <div className="stagger" style={{ margin: "auto 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ width: "64px", height: "64px", borderRadius: "22px", background: "linear-gradient(140deg, #9A4E36, #C27A52)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(154, 78, 54, 0.28)" }}>
              <Spark size={28} />
            </span>
            <h1 style={{ margin: "16px 0 0", fontSize: "24px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.02em" }}>
              <Greeting />
            </h1>
            <p style={{ margin: "6px 0 0", maxWidth: "290px", fontSize: "14px", lineHeight: 1.5, color: "#6F5B4B" }}>
              {gemini ? t("gd.intro_ai") : t("gd.intro_lib")}
            </p>
            {/* The whole-trip planner leads: any city, planned around who is going. */}
            <Link href="/trip" style={{ marginTop: "20px", width: "100%", minHeight: "76px", padding: "14px 14px 14px 16px", borderRadius: "20px", background: "linear-gradient(140deg, #9A4E36, #7E3D29)", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)", boxSizing: "border-box" }}>
              <span style={{ flex: "0 0 44px", height: "44px", borderRadius: "14px", background: "rgba(255, 255, 255, 0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22}>
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </Icon>
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{t("gd.whole_trip")}</span>
                <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: "rgba(255, 255, 255, 0.85)" }}>{t("gd.whole_trip_sub")}</span>
              </span>
              <Icon size={18}>
                <path d="m9 18 6-6-6-6" />
              </Icon>
            </Link>
            <div style={{ marginTop: "10px", width: "100%", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px", textAlign: "left" }}>
              {STARTERS.map((s) => {
                const inner = (
                  <>
                    <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18}>{s.icon}</Icon>
                    </span>
                    <span style={{ marginTop: "10px", display: "block", fontSize: "14px", lineHeight: 1.25, fontWeight: 800 }}>{t(s.title)}</span>
                    <span style={{ marginTop: "3px", display: "block", fontSize: "12px", lineHeight: 1.35, color: "#6F5B4B" }}>{t(s.sub)}</span>
                  </>
                );
                const card = { minHeight: "112px", padding: "14px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", color: "#2B1B10", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", textDecoration: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(90, 60, 30, 0.05)" } as const;
                return s.href ? (
                  <Link key={s.title} href={s.href} style={card}>
                    {inner}
                  </Link>
                ) : (
                  <button key={s.title} type="button" onClick={() => (s.plan ? askPlan() : s.ask ? ask(t(s.ask)) : undefined)} style={card}>
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          thread.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="rise" style={{ alignSelf: "flex-end", maxWidth: "290px", padding: "11px 14px", borderRadius: "20px 20px 6px 20px", background: "#9A4E36", color: "#FFFFFF", fontSize: "15px", lineHeight: 1.45 }}>
                {m.text}
              </div>
            ) : (
              <div key={i} className="rise" style={{ alignSelf: "stretch", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <GuideMark />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {m.kind === "booking" && m.draft ? (
                    <>
                      <div style={{ marginBottom: "8px", padding: "11px 14px", borderRadius: "6px 20px 20px 20px", background: "#F6F1EA", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.5 }}>{m.text}</div>
                      <BookingCard draft={m.draft} bookedRef={m.bookedRef} onBooked={(ref) => markBooked(i, ref)} />
                    </>
                  ) : m.kind === "plan" ? (
                    <div style={{ padding: "12px", borderRadius: "6px 20px 20px 20px", background: "#FFFFFF", border: "1px solid #EFE6DA" }}>
                      <p style={{ margin: "0 2px", fontSize: "15px", lineHeight: 1.45 }}>{t("gd.plan_intro")}</p>
                      <div style={{ marginTop: "10px", padding: "12px", borderRadius: "14px", background: "#F6F1EA" }}>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "14px", fontWeight: 800 }}>{t("gd.plan_name")}</span>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#6F5B4B" }}>1 h 40 · 1.4 km</span>
                        </div>
                        <ol style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                          {PLAN_STOPS.map(([name, mins], n) => (
                            <li key={name} style={{ minHeight: "26px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: 700 }}>
                              <span style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", background: n === 0 ? "#2B1B10" : "#9A4E36", color: "#FFFFFF", fontSize: "11px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n + 1}</span>
                              <span style={{ flex: 1 }}>{name}</span>
                              <span style={{ fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{mins}</span>
                            </li>
                          ))}
                        </ol>
                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                          <Link href="/navigate" style={{ flex: 1, height: "44px", borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "14px", fontWeight: 800, textDecoration: "none" }}>
                            <Icon size={16}>
                              <polygon points="3 11 22 2 13 21 11 13 3 11" />
                            </Icon>
                            {t("home.start_walk")}
                          </Link>
                          <Link href="/walk?plan=loop&edit=1" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", borderRadius: "12px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: 800, textDecoration: "none" }}>
                            {t("gd.edit_plan")}
                          </Link>
                        </div>
                      </div>
                      <p style={{ margin: "10px 2px 0", fontSize: "13px", lineHeight: 1.4, color: "#5A4434" }}>{t("gd.plan_tip")}</p>
                    </div>
                  ) : (
                    <div style={{ padding: "11px 14px", borderRadius: "6px 20px 20px 20px", background: "#F6F1EA", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>
                  )}
                  {/* Under each answer: listen, who answered, and was it helpful. */}
                  <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                      type="button"
                      aria-label={speaking === i ? t("gd.stop_reading") : t("gd.read_answer")}
                      aria-pressed={speaking === i}
                      onClick={() => (speaking === i ? hush() : say(m.text, i))}
                      style={{ height: "32px", padding: "0 11px 0 9px", border: 0, borderRadius: "999px", background: speaking === i ? "#9A4E36" : "transparent", color: speaking === i ? "#FFFFFF" : "#7E3D29", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}
                    >
                      {speaking === i ? (
                        <span className="eq" aria-hidden="true" style={{ height: "11px" }}>
                          <i />
                          <i />
                          <i />
                        </span>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <polygon points="7 4 19 12 7 20 7 4" />
                        </svg>
                      )}
                      {speaking === i ? t("trip.stop") : t("trip.listen")}
                    </button>
                    {m.source ? (
                      <span style={{ flex: 1, minWidth: 0, fontSize: "11px", fontWeight: 700, color: m.source === "gemini" ? "#3457C9" : "#8A7563", display: "flex", alignItems: "center", gap: "4px" }}>
                        {m.source === "gemini" ? <Spark size={10} /> : null}
                        {m.source === "library" ? t("gd.src_library") : m.source === "booking" ? t("gd.src_booking") : t("tab.guide")}
                      </span>
                    ) : (
                      <span style={{ flex: 1 }} />
                    )}
                    {(["up", "down"] as const).map((d) => (
                      <button key={d} type="button" aria-label={d === "up" ? t("gd.helpful") : t("gd.not_helpful")} aria-pressed={m.vote === d} onClick={(e) => rate(i, d, e.currentTarget)} style={{ width: "36px", height: "36px", border: 0, borderRadius: "50%", background: m.vote === d ? "#F6EEE4" : "transparent", color: m.vote === d ? "#9A4E36" : "#A8927C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Icon size={15}>
                          {d === "up" ? (
                            <>
                              <path d="M7 10v12" />
                              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                            </>
                          ) : (
                            <>
                              <path d="M17 14V2" />
                              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                            </>
                          )}
                        </Icon>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          )
        )}
        {busy ? (
          <div className="rise" style={{ alignSelf: "flex-start", display: "flex", gap: "8px", alignItems: "center" }}>
            <GuideMark />
            <span className="typing" aria-label={t("gd.writing")} style={{ padding: "14px 16px", borderRadius: "6px 20px 20px 20px", background: "#F6F1EA" }}>
              <i />
              <i />
              <i />
            </span>
          </div>
        ) : null}
      </div>

      {/* Follow-ups, once there's an answer to follow up on. */}
      {lastIsGuide && !busy ? (
        <div aria-label={t("gd.followups")} className="hscroll fade-in" style={{ position: "absolute", left: 0, right: 0, bottom: "168px", padding: "0 16px", display: "flex", gap: "8px" }}>
          <button type="button" onClick={() => ask(t("gd.more"))} style={chip}>
            {t("gd.more")}
          </button>
          <button type="button" onClick={() => ask(t("gd.simpler"))} style={chip}>
            {t("gd.simpler")}
          </button>
          {lang !== "hi" ? (
            <button type="button" onClick={() => ask(t("gd.hindi_ask"), "hi")} style={chip}>
              {t("gd.in_hindi")}
            </button>
          ) : null}
          <button type="button" onClick={() => ask(t("gd.kid_ask"))} style={chip}>
            {t("gd.kid")}
          </button>
          <Link href="/lens" style={chip}>
            <span style={{ color: "#9A4E36", display: "flex" }}>
              <Icon size={15}>
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </Icon>
            </span>
            {t("gd.s_lens")}
          </Link>
        </div>
      ) : null}

      {/* The message box: type, or tap the mic and speak. */}
      <div style={{ position: "absolute", left: "12px", right: "12px", bottom: "100px", minHeight: "56px", padding: "0 6px 0 16px", borderRadius: "28px", background: "#FFFFFF", border: `1.5px solid ${listening ? "#9A4E36" : "#E2D3C1"}`, boxShadow: listening ? "0 0 0 4px rgba(154, 78, 54, 0.14)" : "0 6px 18px rgba(90, 60, 30, 0.08)", display: "flex", alignItems: "center", gap: "6px", transition: "border-color 0.2s ease, box-shadow 0.2s ease" }}>
        {listening ? (
          <span className="eq" aria-hidden="true" style={{ height: "14px", color: "#9A4E36" }}>
            <i />
            <i />
            <i />
          </span>
        ) : null}
        <input
          type="text"
          enterKeyHint="send"
          aria-label={t("gd.ask_label")}
          placeholder={listening ? t("gd.listening") : t("gd.placeholder")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(q);
          }}
          style={{ flex: 1, minWidth: 0, width: 0, height: "44px", border: 0, outline: "none", background: "transparent", fontSize: "15px", color: "#2B1B10" }}
        />
        {q.trim() ? (
          <button type="button" aria-label={t("gd.send")} disabled={busy} onClick={() => ask(q)} className="pop-in" style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: busy ? 0.5 : 1 }}>
            <Icon size={20}>
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </Icon>
          </button>
        ) : (
          <button type="button" aria-label={listening ? t("gd.stop_listen") : t("gd.speak")} aria-pressed={listening} onClick={speak} className={listening ? "pulse" : undefined} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon size={20}>
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </Icon>
          </button>
        )}
      </div>

      <MainNav active="ai-guide" />
      <Sheet open={langOpen} onClose={() => setLangOpen(false)} title={t("gd.lang_title")}>
        <p>{t("gd.lang_sheet")}</p>
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            className="sheet-row"
            aria-pressed={lang === l.id}
            onClick={() => {
              setLang(l.id);
              setLangOpen(false);
              toast(t("gd.lang_set", { name: l.label }), "success");
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

// The browser's speech recogniser, as much of it as the guide uses.
type SpeechRec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
};
