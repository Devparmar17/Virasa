"use client";

// 13 · Walking navigation — the walk plays out live: the dot moves along the
// route, the instruction counts down and changes at each turn (with a buzz and,
// if voice is on, a spoken prompt), and arriving opens the arrival card.
// Without real positioning the walk is simulated at demo speed.
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { Confetti, SuccessBadge } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { directionsUrl, say, StampCheck, StoryPreview, useEndWalk, useTrip, useVoice, VoiceButton } from "./parts";

const noop = () => () => {};
// How long the simulated walk takes, start to finish.
const DEMO_MS = 40000;
const TICK = 200;
const PACE = 80; // metres a minute

// The route in map coordinates: up the main road, left onto Relief Road, then right past Teen Darwaza.
const ROUTE: [number, number][] = [
  [196, 600],
  [196, 430],
  [120, 430],
  [110, 262],
];
const SEG = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
const LEN = SEG.reduce((a, b) => a + b, 0);
const TURN1 = SEG[0];
const TURN2 = SEG[0] + SEG[1];
const TEEN = SEG[0] + 46; // Teen Darwaza sits on Relief Road, 46 px after the first turn

// The point and heading a given distance along the route.
function along(d: number) {
  let left = Math.max(0, Math.min(d, LEN));
  for (let i = 0; i < SEG.length; i++) {
    if (left <= SEG[i] || i === SEG.length - 1) {
      const [x1, y1] = ROUTE[i];
      const [x2, y2] = ROUTE[i + 1];
      const f = SEG[i] ? Math.min(left / SEG[i], 1) : 0;
      return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, heading: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90, seg: i };
    }
    left -= SEG[i];
  }
  return { x: ROUTE[0][0], y: ROUTE[0][1], heading: 0, seg: 0 };
}

const pathTo = (d: number) => {
  const p = along(d);
  return ["M", ...ROUTE.slice(0, p.seg + 1).flat(), p.x, p.y].join(" ").replace("M ", "M");
};
const pathFrom = (d: number) => {
  const p = along(d);
  return ["M", p.x, p.y, ...ROUTE.slice(p.seg + 1).flat()].join(" ");
};

function clock(mins: number) {
  const d = new Date(Date.now() + mins * 60000);
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const TurnIcon = ({ kind }: { kind: "left" | "right" | "arrive" }) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "left" ? (
      <>
        <polyline points="9 14 4 9 9 4" />
        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
      </>
    ) : kind === "right" ? (
      <>
        <polyline points="15 14 20 9 15 4" />
        <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
      </>
    ) : (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    )}
  </svg>
);

export default function NavigateScreen() {
  const t = useT();
  const trip = useTrip();
  const end = useEndWalk();
  const voice = useVoice();
  const [walked, setWalked] = useState(0); // 0..1 of the route
  const [paused, setPaused] = useState(false);
  const arrived = walked >= 1;
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const reduce = useSyncExternalStore(noop, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);

  // The simulated walk.
  useEffect(() => {
    if (paused || arrived) return;
    const id = setInterval(() => setWalked((w) => Math.min(1, w + TICK / DEMO_MS)), TICK);
    return () => clearInterval(id);
  }, [paused, arrived]);

  const metres = trip.km * 1000;
  const d = walked * LEN;
  const toM = (px: number) => Math.max(0, Math.round(((px / LEN) * metres) / 10) * 10);
  const fmt = (m: number) => (m >= 1000 ? t("unit.km", { n: +(m / 1000).toFixed(1) }) : t("unit.m", { n: m }));
  const left = metres * (1 - walked);
  const mins = arrived ? 0 : Math.max(1, Math.ceil(left / PACE));

  // Which instruction is current, how far to it, and what follows.
  const step = d < TURN1 ? 0 : d < TURN2 ? 1 : 2;
  const steps = [
    { kind: "left" as const, text: t("nav.turn_left_relief"), dist: toM(TURN1 - d) },
    { kind: "right" as const, text: trip.id === "teen" ? t("nav.turn_right") : t("nav.turn_right_teen"), dist: toM(TURN2 - d) },
    { kind: "arrive" as const, text: t("nav.arrive_at", { dest: trip.name }), dist: toM(LEN - d) },
  ];
  const now = steps[step];
  const next = steps[step + 1];

  // A buzz and (when voice is on) a spoken prompt each time the instruction changes, and on arrival.
  const said = useRef(-1);
  useEffect(() => {
    const at = arrived ? 3 : step;
    if (said.current === at) return;
    const first = said.current === -1;
    said.current = at;
    if (!first) {
      try {
        navigator.vibrate?.(arrived ? [60, 80, 60] : 40);
      } catch {
        // No vibration: the screen still changes.
      }
    }
    if (voice && !first) say(arrived ? t("nav.arrived") : steps[step].text);
  });

  const me = along(d);
  const teenAhead = TEEN - d;
  const teenMins = Math.max(1, Math.round(toM(teenAhead) / PACE));
  const teenLabel = teenAhead > 12 ? t("nav.on_way", { n: teenMins }) : teenAhead > -12 ? t("nav.passing") : t("nav.passed");

  const glass: CSSProperties = { position: "absolute", height: "44px", padding: "0 14px 0 10px", borderRadius: "999px", border: 0, display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 800, textDecoration: "none", cursor: "pointer" };

  return (
    <div style={{ width: "390px", height: "min(844px, 100dvh)", minHeight: "680px", position: "relative", overflow: "hidden", background: "#F4F1EA", color: "#2B1B10" }}>
      <svg role="img" aria-label={`Walking route to ${trip.name}`} width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: 0, display: "block" }}>
        <rect width="390" height="844" fill="#F4F1EA" />
        <g fill="#ECE6DB">
          {[-10, 70, 206, 310].flatMap((x, i) =>
            [
              [-10, 160],
              [170, 80],
              [270, 148],
              [442, 108],
              [570, 120],
              [710, 140],
            ].map(([y, h]) => <rect key={`${x}-${y}`} x={x} y={y} width={[60, 116, 84, 90][i]} height={h} rx="8" />)
          )}
        </g>
        <rect x="206" y="270" width="84" height="148" rx="10" fill="#D3E8C6" />
        <g stroke="#E1D8C8" strokeWidth="24" fill="none">
          <path d="M0 430 H390" />
          <path d="M196 0 V844" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="20" fill="none">
          <path d="M0 430 H390" />
          <path d="M196 0 V844" />
        </g>
        <text x="300" y="434" fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#7F776B" letterSpacing="0.4">
          RELIEF RD
        </text>
        {/* Walked so far: a quiet dotted trail. Still to go: the route in brand colour. */}
        <path d={pathTo(d)} fill="none" stroke="#B9A894" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 10" />
        <path d={pathFrom(d)} fill="none" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathFrom(d)} fill="none" stroke="#9A4E36" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Teen Darwaza, the story stop on the way. */}
        <g transform="translate(150 430)" opacity={teenAhead < -12 ? 0.55 : 1}>
          {Math.abs(teenAhead) <= 12 && !reduce ? <circle r="15" fill="none" stroke="#8A6424" strokeWidth="3" className="nav-ping" /> : null}
          <circle r="15" fill="#8A6424" stroke="#FFFFFF" strokeWidth="3" />
          <g transform="translate(-7 -7) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </g>
        </g>
        {/* The destination. */}
        <g transform="translate(110 262) scale(1.3)" filter="url(#nav-shadow)">
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#7E3D29" stroke="#FFFFFF" strokeWidth="2.2" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <defs>
          <filter id="nav-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3C2414" floodOpacity="0.3" />
          </filter>
        </defs>
        {/* You: an accuracy halo and an arrow pointing the way you walk. */}
        <g style={{ transform: `translate(${me.x}px, ${me.y}px)`, transition: reduce ? "none" : `transform ${TICK}ms linear` }}>
          <circle r="30" fill="#2F6FB0" opacity="0.14" className={paused || arrived || reduce ? undefined : "nav-halo"} />
          <circle r="17" fill="#2F6FB0" stroke="#FFFFFF" strokeWidth="3" />
          <polygon points="0 -10 7 7 0 3 -7 7" fill="#FFFFFF" style={{ transform: `rotate(${me.heading}deg)`, transition: "transform 0.4s ease" }} />
        </g>
      </svg>

      <span style={{ position: "absolute", left: "143px", top: "200px", transform: "translateX(-50%)", height: "28px", padding: "0 11px", borderRadius: "999px", background: "#2B1B10", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(43, 27, 16, 0.25)" }}>{trip.name}</span>

      {/* The instruction: big distance, what to do, and what comes after. */}
      <section aria-label="Next instruction" aria-live="polite" style={{ position: "absolute", top: "50px", left: "12px", right: "12px", borderRadius: "24px", background: "#2B1B10", color: "#FBF6EE", boxShadow: "0 14px 30px rgba(43, 27, 16, 0.3)", overflow: "hidden" }}>
        <div style={{ padding: "16px", display: "flex", gap: "14px", alignItems: "center" }}>
          <span key={now.kind} className="pop-in" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "18px", background: now.kind === "arrive" ? "#9FD3B0" : "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TurnIcon kind={now.kind} />
          </span>
          <span key={step} className="btn-swap" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px" }}>
            <span style={{ fontSize: "30px", lineHeight: 1, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(now.dist)}</span>
            <span style={{ fontSize: "16px", lineHeight: 1.25, fontWeight: 600 }}>{now.text}</span>
          </span>
          <VoiceButton current={now.text} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "rgba(251, 246, 238, 0.12)", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} />
        </div>
        {next ? (
          <div key={`next-${step}`} className="fade-in" style={{ padding: "10px 16px", background: "rgba(251, 246, 238, 0.08)", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#D9C6AE" }}>
            <span style={{ fontWeight: 800, color: "#F3D9A8" }}>{t("nav.then")}</span>
            <span style={{ transform: "scale(0.55)", transformOrigin: "left center", width: "19px", height: "19px", display: "inline-flex" }}>
              <TurnIcon kind={next.kind} />
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next.text}</span>
          </div>
        ) : null}
      </section>

      <Link href="/ar" aria-label="Switch to AR view" style={{ ...glass, right: "16px", bottom: "308px", background: "#2B1B10", color: "#FBF6EE", boxShadow: "0 8px 18px rgba(43, 27, 16, 0.3)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
          <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
        </svg>
        {t("nav.ar")}
      </Link>

      {/* The story stop: counts down as you approach, glows when you reach it. */}
      {trip.id === "teen" ? null : (
      <section aria-label="Story on your way" className={Math.abs(teenAhead) <= 12 ? "nav-here" : undefined} style={{ position: "absolute", left: "12px", right: "12px", bottom: "222px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid #EFE6DA", boxShadow: "0 10px 26px rgba(90, 60, 30, 0.16)", padding: "10px 10px 10px 12px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: "#F6EEE4", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
        </span>
        <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
          <span key={teenLabel} className="fade-in" style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", color: "#8A6424" }}>
            {teenLabel}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.3 }}>{t("nav.teen_story")}</span>
        </span>
        <StoryPreview style={{ flex: "0 0 auto", minWidth: "64px", height: "44px", padding: "0 12px 0 10px", border: 0, borderRadius: "12px", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }} />
      </section>
      )}

      {/* Trip progress. */}
      <section aria-label="Trip progress" style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#FFFFFF", borderRadius: "26px 26px 0 0", boxShadow: "0 -10px 30px rgba(90, 60, 30, 0.14)", padding: "14px 20px 26px" }}>
        <div role="progressbar" aria-label="Walk progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(walked * 100)} style={{ height: "6px", borderRadius: "999px", background: "#F3ECE2", overflow: "hidden" }}>
          <div style={{ width: `${walked * 100}%`, height: "100%", borderRadius: "999px", background: "linear-gradient(90deg, #2F7A4A, #4E9A68)", transition: `width ${TICK}ms linear` }} />
        </div>
        <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span key={mins} className="fade-in" style={{ fontSize: "28px", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-0.02em", color: "#2F7A4A", fontVariantNumeric: "tabular-nums" }}>
                {t("unit.min", { n: mins })}
              </span>
              {paused ? <span style={{ height: "24px", padding: "0 8px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center" }}>{t("nav.paused")}</span> : null}
            </div>
            <div style={{ marginTop: "3px", fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>{t("nav.eta_line", { km: fmt(Math.round(left / 10) * 10), time: mounted ? clock(mins) : "…" })}</div>
          </div>
          <button
            type="button"
            aria-label={paused ? t("nav.resume") : t("nav.pause")}
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
            style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "16px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg key={paused ? "play" : "pause"} className="pop-in" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              {paused ? <polygon points="7 4 19 12 7 20 7 4" /> : <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />}
            </svg>
          </button>
          <a href={directionsUrl(trip.id, trip.name)} target="_blank" rel="noopener noreferrer" aria-label={`Directions to ${trip.name} in Google Maps`} style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "16px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3ZM9 3v15M15 6v15" />
            </svg>
          </a>
          <button type="button" onClick={() => end()} style={{ height: "48px", padding: "0 18px", borderRadius: "16px", border: "1.5px solid #F1D5CC", background: "#FBEDE6", color: "#A23A2A", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
            {t("nav.end")}
          </button>
        </div>
        <Link href={trip.arrive} style={{ marginTop: "12px", padding: "10px", borderRadius: "16px", background: "#F6F1EA", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#2B1B10" }}>
          <img src={trip.img} alt="" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{t("nav.walking_to")}</span>
            <span style={{ fontSize: "15px", fontWeight: 800 }}>{trip.name}</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </section>

      {/* Arrived: the walk's finish, with the stamp and what to do next. */}
      {arrived ? (
        <div role="dialog" aria-modal="true" aria-labelledby="arrived-title" style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex", alignItems: "flex-end" }}>
          <div className="fade-in" style={{ position: "absolute", inset: 0, background: "rgba(30, 19, 11, 0.45)" }} />
          <div className="arrive-card" style={{ position: "relative", width: "100%", padding: "34px 22px 28px", borderRadius: "28px 28px 0 0", background: "#FFFFFF", boxShadow: "0 -16px 40px rgba(43, 27, 16, 0.24)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ position: "relative" }}>
              <SuccessBadge size={80} />
              <Confetti count={22} spread={130} />
            </span>
            <h2 id="arrived-title" style={{ margin: "18px 0 0", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {t("nav.arrived")}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "17px", fontWeight: 700 }}>{trip.name}</p>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "#6F5B4B" }}>{t("nav.walked", { km: fmt(metres), m: trip.mins })}</p>
            <StampCheck id={trip.id} name={trip.name} />
            <Link href={trip.id === "sidi" ? "/story" : trip.arrive} style={{ marginTop: "18px", width: "100%", height: "54px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", fontWeight: 800, textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                <polygon points="7 4 19 12 7 20 7 4" />
              </svg>
              {t("nav.hear_story")}
            </Link>
            <button type="button" onClick={() => end(true)} style={{ marginTop: "10px", width: "100%", height: "50px", borderRadius: "16px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
              {t("nav.done")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
