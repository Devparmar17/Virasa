"use client";

// 12 · Heritage walk plan
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import { toast } from "@/components/Toast";
import { share, Toggle, useAsk } from "@/components/Tap";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, PACE_SPEED, type Settings } from "@/lib/settings";

type Stop = { id: string; name: string; hook: string; visit: number; extra: string; at: number; href?: string };

// `at` is each stop's distance along the route in metres, so any two stops
// have a walking distance whatever order they are visited in.
const STOPS: Stop[] = [
  { id: "sidi", name: "Sidi Saiyyed Mosque", hook: "The Tree of Life jali", visit: 20, extra: "story 2 min", at: 0, href: "/place" },
  { id: "bhadra", name: "Bhadra Fort", hook: "Lakshmi and the night guard", visit: 25, extra: "legend 3 min", at: 450, href: "/secret?id=bhadra" },
  { id: "teen", name: "Teen Darwaza", hook: "The lamp kept burning for 600 years", visit: 10, extra: "legend 1 min", at: 750, href: "/secret?id=teen" },
  { id: "jama", name: "Jama Masjid", hook: "260 pillars under 15 domes", visit: 25, extra: "story 3 min", at: 1150, href: "/secret?id=jama" },
  { id: "chandravilas", name: "Chandravilas", hook: "Fafda and jalebi since 1900", visit: 15, extra: "snack stop", at: 1300, href: "/secret?id=chandravilas" },
  { id: "manek", name: "Manek Chowk", hook: "Morning market, night food street", visit: 20, extra: "chai break", at: 1400, href: "/secret?id=manek" },
  { id: "dhal", name: "Dhal ni Pol", hook: "Carved havelis and a bird-feeder tower", visit: 30, extra: "story 2 min", at: 2400, href: "/secret?id=dhal" },
];
const BASE_ORDER = ["sidi", "bhadra", "teen", "jama", "manek", "dhal"];
// The short loop the AI Guide suggests; it opens here as /walk?plan=loop.
const LOOP_ORDER = ["sidi", "bhadra", "teen", "manek"];
const query = (k: string) => new URLSearchParams(window.location.search).get(k);

// The step-free route swaps stepped lanes for slightly longer level ones.
const legMetres = (a: Stop, b: Stop, stepFree: boolean) => Math.round((Math.abs(a.at - b.at) * (stepFree ? 1.15 : 1)) / 10) * 10;
const walkMins = (m: number, speed: number) => Math.max(1, Math.floor(m / speed + 0.49));
const metres = (m: number) => (m >= 1000 ? `${+(m / 1000).toFixed(1)} km` : `${m} m`);

const THUMBS: Record<string, React.ReactNode> = {
  sidi: (
    <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  bhadra: (
    <img src="/images/bhadra-fort.jpg" alt="The gate and tower of Bhadra Fort" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  teen: (
    <img src="/images/teen-darwaza.jpg" alt="The three arches of Teen Darwaza" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  jama: (
    <img src="/images/jama-masjid.jpg" alt="The courtyard of Jama Masjid, Ahmedabad" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  manek: (
    <img src="/images/manek-chowk.jpg" alt="Food stalls at Manek Chowk at night" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  dhal: (
    <img src="/images/6b114a4ce322f517be6c561ea38233e8.jpg" alt="" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
  chandravilas: (
    <img src="/images/fafda-jalebi.jpg" alt="Fafda and jalebi" style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
  ),
};

export default function WalkScreen() {
  // Step-free is the same switch as on Profile and Settings; the other two belong to this walk.
  const [extras, setExtras] = useStored("walkOptions", { food: false, short: false });
  const [sw, setSw] = useStored("switches", { auto: true, desc: false, steps: false });
  const [settings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const speed = PACE_SPEED[settings.pace] ?? 80;
  const opt = { steps: sw.steps, food: extras.food, short: extras.short };
  // Which plan (the morning walk, or the guide's loop) and whether to open ready to edit.
  const plan = useSyncExternalStore(() => () => {}, () => query("plan"), () => null);
  const editLink = useSyncExternalStore(() => () => {}, () => query("edit") === "1", () => false);
  const loop = plan === "loop";
  const [order, setOrder] = useStored<string[]>(loop ? "walkOrderLoop" : "walkOrder", loop ? LOOP_ORDER : BASE_ORDER);
  const [editPick, setEditing] = useState<boolean | null>(null);
  const editing = editPick ?? editLink;
  const stopsHead = useRef<HTMLDivElement>(null);
  // Opened to edit: bring the stops into view.
  useEffect(() => {
    if (editLink) stopsHead.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editLink]);
  const ask = useAsk();

  // Build today's plan from the saved order and the chosen options.
  let ids = order.filter((id) => id !== "chandravilas");
  if (opt.food) ids.splice(Math.max(ids.indexOf("jama"), 0) + 1, 0, "chandravilas");
  if (opt.short) ids = ids.slice(0, 3);
  const stops = ids.map((id) => STOPS.find((x) => x.id === id)!).filter(Boolean);
  const walked = stops.slice(1).reduce((n, st, i) => n + legMetres(stops[i], st, opt.steps), 0);
  const minutes = stops.reduce((n, st) => n + st.visit, 0) + stops.slice(1).reduce((n, st, i) => n + walkMins(legMetres(stops[i], st, opt.steps), speed), 0);
  const total = `${minutes >= 60 ? `${Math.floor(minutes / 60)} h ` : ""}${String(minutes % 60).padStart(minutes >= 60 ? 2 : 1, "0")}${minutes >= 60 ? "" : " min"}`;

  const move = (i: number, step: number) => {
    const a = stops[i].id;
    const b = stops[i + step]?.id;
    if (!b) return;
    setOrder((o) => {
      const next = [...o];
      const ia = next.indexOf(a);
      const ib = next.indexOf(b);
      if (ia < 0 || ib < 0) return o;
      [next[ia], next[ib]] = [next[ib], next[ia]];
      return next;
    });
  };
  const remove = (id: string) => {
    const at = order.indexOf(id);
    const name = STOPS.find((x) => x.id === id)?.name;
    setOrder((o) => o.filter((x) => x !== id));
    toast(`Removed ${name}`, { action: { label: "Undo", run: () => setOrder((o) => (o.includes(id) ? o : [...o.slice(0, at), id, ...o.slice(at)])) } });
  };
  const add = (id: string) => {
    setOrder((o) => (o.includes(id) ? o : [...o, id]));
    toast(`Added ${STOPS.find((x) => x.id === id)?.name}`, "success");
  };
  // Stops that could be added (the snack stop has its own switch above).
  const addable = STOPS.filter((x) => !order.includes(x.id) && x.id !== "chandravilas");
  const arrow = (off: boolean) => ({ width: "36px", height: "32px", border: "1.5px solid #E2D3C1", borderRadius: "10px", background: "#FFFFFF", color: off ? "#CDBFAE" : "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: off ? "default" : "pointer" });
  const NOTES = { steps: ["Step-free route on", "Step-free route off"], food: ["Added a snack stop at Chandravilas", "Snack stop removed"], short: ["Trimmed to the first three stops", "Back to the full walk"] };
  const v = {
    opt,
    optS: Object.fromEntries(Object.entries(opt).map(([k, on]) => [k, on ? { bg: "#FBEDE6", bd: "#9A4E36", fg: "#7E3D29" } : { bg: "#FFFFFF", bd: "#E2D3C1", fg: "#2B1B10" }])) as Record<keyof typeof opt, { bg: string; bd: string; fg: string }>,
    tog: Object.fromEntries(
      (Object.keys(opt) as (keyof typeof opt)[]).map((k) => [
        k,
        () => {
          if (k === "steps") setSw((x) => ({ ...x, steps: !x.steps }));
          else setExtras((o) => ({ ...o, [k]: !o[k] }));
          toast(NOTES[k][opt[k] ? 1 : 0]);
        },
      ])
    ) as Record<keyof typeof opt, () => void>,
  };
  return (
    <div style={{ width: "390px", minHeight: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/home" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <span style={{ fontSize: "16px", fontWeight: "800" }}>
          Heritage walk
        </span>
        <button type="button" aria-label="Share walk" onClick={() => share("Old City in a morning", `${stops.length} stops · ${metres(walked)} · ${total} — a heritage walk on Virasa`)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        </button>
      </div>
      <svg role="img" aria-label="Route map with six numbered stops through the Old City" width="390" height="210" viewBox="0 0 390 210" style={{ display: "block" }}>
        <rect width="390" height="210" fill="#F4F1EA" />
        <path d="M0 0 H52 C40 70 60 140 44 210 H0 Z" fill="#BFDCE4" />
        <g stroke="#FFFFFF" strokeWidth="3" fill="none">
          <path d="M60 40 H390" />
          <path d="M60 100 H390" />
          <path d="M60 180 H390" />
          <path d="M140 0 V210" />
          <path d="M260 0 V210" />
          <path d="M330 0 V210" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round">
          <path d="M50 92 C150 88 260 98 390 90" />
          <path d="M190 0 C186 80 196 150 192 210" />
          <path d="M100 210 L300 0" />
        </g>
        <path d="M88 66 C95 92 100 110 110 120 S150 128 165 125 S205 116 215 120 S230 140 238 152 S290 170 322 164" fill="none" stroke="#9A4E36" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 8" />
        <g fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="12" fontWeight="800" textAnchor="middle">
          <circle cx="88" cy="66" r="13" fill="#2B1B10" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="88" y="70" fill="#FFFFFF">
            1
          </text>
          <circle cx="110" cy="120" r="13" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="110" y="124" fill="#FFFFFF">
            2
          </text>
          <circle cx="165" cy="125" r="13" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="165" y="129" fill="#FFFFFF">
            3
          </text>
          <circle cx="215" cy="120" r="13" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="215" y="124" fill="#FFFFFF">
            4
          </text>
          <circle cx="238" cy="152" r="13" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="238" y="156" fill="#FFFFFF">
            5
          </text>
          <circle cx="322" cy="164" r="13" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <text x="322" y="168" fill="#FFFFFF">
            6
          </text>
        </g>
      </svg>
      <main style={{ padding: "20px 20px 120px" }}>
        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#8A6424" }}>
          {loop ? "AHMEDABAD · FROM YOUR AI GUIDE" : "AHMEDABAD · PLANNED FOR YOU"}
        </p>
        <h1 style={{ margin: "6px 0 0", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em" }}>
          {loop ? "Old City short loop" : "Old City in a morning"}
        </h1>
        <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <span style={{ height: "28px", padding: "0 10px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Architecture
          </span>
          <span style={{ height: "28px", padding: "0 10px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Street food
          </span>
          <span style={{ height: "28px", padding: "0 10px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Legends
          </span>
        </div>
        <dl style={{ margin: "18px 0 0", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", border: "1px solid #EFE6DA", borderRadius: "16px", overflow: "hidden" }}>
          <div style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderRight: "1px solid #EFE6DA" }}>
            <dt style={{ order: "2", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Stops
            </dt>
            <dd style={{ order: "1", margin: "0", fontSize: "18px", fontWeight: "800" }}>
              {stops.length}
            </dd>
          </div>
          <div style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderRight: "1px solid #EFE6DA" }}>
            <dt style={{ order: "2", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Walking
            </dt>
            <dd style={{ order: "1", margin: "0", fontSize: "18px", fontWeight: "800" }}>
              {metres(walked)}
            </dd>
          </div>
          <div style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", borderRight: "1px solid #EFE6DA" }}>
            <dt style={{ order: "2", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Total
            </dt>
            <dd style={{ order: "1", margin: "0", fontSize: "18px", fontWeight: "800" }}>
              {total}
            </dd>
          </div>
          <div style={{ padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <dt style={{ order: "2", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Terrain
            </dt>
            <dd style={{ order: "1", margin: "0", fontSize: "18px", fontWeight: "800" }}>
              {opt.steps ? "Step-free" : "Flat"}
            </dd>
          </div>
        </dl>
        <div style={{ marginTop: "14px", padding: "12px 14px", borderRadius: "14px", background: "#F6F1EA", display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: "1.45", color: "#5A4434" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B9831F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 18px", marginTop: "1px" }}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <span>
            <strong style={{ color: "#2B1B10" }}>
              Start by 8 AM.
            </strong>
            {" The lanes are cooler and Manek Chowk's morning market is open."}
          </span>
        </div>
        <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" aria-pressed={v.opt.steps} onClick={v.tog.steps} style={{ height: "40px", padding: "0 12px", borderRadius: "999px", border: `1.5px solid ${v.optS.steps.bd}`, background: v.optS.steps.bg, color: v.optS.steps.fg, fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="16" cy="4" r="1" />
              <path d="m18 19 1-7-6 1" />
              <path d="m5 8 3-3 5.5 3-2.36 3.5" />
              <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
              <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
            </svg>
            <span>
              Step-free route
            </span>
            {v.opt.steps ? (
              <svg className="pop-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
          <button type="button" aria-pressed={v.opt.food} onClick={v.tog.food} style={{ height: "40px", padding: "0 12px", borderRadius: "999px", border: `1.5px solid ${v.optS.food.bd}`, background: v.optS.food.bg, color: v.optS.food.fg, fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span>
              More food stops
            </span>
            {v.opt.food ? (
              <svg className="pop-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
          <button type="button" aria-pressed={v.opt.short} onClick={v.tog.short} style={{ height: "40px", padding: "0 12px", borderRadius: "999px", border: `1.5px solid ${v.optS.short.bd}`, background: v.optS.short.bg, color: v.optS.short.fg, fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              Only 1 hour
            </span>
            {v.opt.short ? (
              <svg className="pop-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </button>
        </div>
        <Link href="/tickets?book=morning-walk" style={{ marginTop: "14px", minHeight: "60px", padding: "10px 14px", borderRadius: "16px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: "#F6EEE4", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
          </span>
          <span style={{ flex: "1", minWidth: "0" }}>
            <span style={{ display: "block", fontSize: "15px", fontWeight: "800" }}>Do this walk with a guide</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>7:45 AM daily · ₹350 a person</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        <div ref={stopsHead} style={{ marginTop: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", scrollMarginTop: "16px" }}>
          <h2 style={{ margin: "0", fontSize: "19px", fontWeight: "800" }}>
            Your stops
          </h2>
          <button type="button" aria-pressed={editing} onClick={() => setEditing(!editing)} style={{ height: "40px", padding: "0 14px", border: editing ? "0" : "1.5px solid #E2D3C1", borderRadius: "999px", background: editing ? "#9A4E36" : "#FFFFFF", color: editing ? "#FFFFFF" : "#9A4E36", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
            {editing ? "Done" : "Edit stops"}
          </button>
        </div>
        {editing ? (
          <p className="fade-in" style={{ margin: "4px 0 0", fontSize: "13px", color: "#6F5B4B" }}>Move stops up or down, remove one, or add another below.</p>
        ) : null}
        <ol style={{ listStyle: "none", margin: "8px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
          {stops.map((stop, i) => {
            const next = stops[i + 1];
            const row = { flex: "1", minWidth: "0", minHeight: "72px", display: "flex", gap: "12px", alignItems: "center", textDecoration: "none", color: "#2B1B10", textAlign: "left" as const };
            const text = (
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "15px", fontWeight: "800" }}>{stop.name}</span>
                <span style={{ fontSize: "13px", color: "#5A4434" }}>{stop.hook}</span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                  {stop.visit} min · {stop.extra}
                </span>
              </span>
            );
            return (
              <li key={stop.id} className="rise" style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: "0 0 32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: "32px", height: "32px", borderRadius: "50%", background: i === 0 ? "#2B1B10" : "#9A4E36", color: "#FFFFFF", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
                  {next ? <span style={{ flex: "1", width: "0", borderLeft: "2px dashed #D9C7B3", marginTop: "4px" }} /> : null}
                </div>
                <div style={{ flex: "1", minWidth: "0", paddingBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {stop.href ? (
                      <Link href={stop.href} style={row}>
                        {THUMBS[stop.id]}
                        {text}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => ask(`Tell me about ${stop.name}`)} style={{ ...row, padding: "0", border: "0", background: "none", cursor: "pointer" }}>
                        {THUMBS[stop.id]}
                        {text}
                      </button>
                    )}
                    {editing ? (
                      <span className="pop-in" style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <button type="button" aria-label={`Move ${stop.name} earlier`} disabled={i === 0} onClick={() => move(i, -1)} style={arrow(i === 0)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m6 15 6-6 6 6" />
                          </svg>
                        </button>
                        <button type="button" aria-label={`Move ${stop.name} later`} disabled={!next} onClick={() => move(i, 1)} style={arrow(!next)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </button>
                      </span>
                    ) : null}
                    {editing && order.includes(stop.id) && stops.length > 2 ? (
                      <button type="button" className="fade-in" aria-label={`Remove ${stop.name}`} onClick={() => remove(stop.id)} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "#FBEDE6", color: "#A23A2A", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                  {next ? (
                    <div style={{ height: "34px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
                        <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
                      </svg>
                      <span>
                        {walkMins(legMetres(stop, next, opt.steps), speed)} min walk · {metres(legMetres(stop, next, opt.steps))}
                      </span>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
        {editing && addable.length ? (
          <div className="fade-in" style={{ marginTop: "10px", padding: "14px", borderRadius: "16px", border: "1.5px dashed #E2D3C1", background: "#FFFFFF" }}>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#2B1B10" }}>Add a stop</p>
            <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {addable.map((x) => (
                <button key={x.id} type="button" onClick={() => add(x.id)} style={{ minHeight: "40px", padding: "0 14px 0 10px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  <span aria-hidden="true" style={{ color: "#9A4E36", fontSize: "16px", fontWeight: 800 }}>+</span>
                  {x.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </main>
      <div className="nav-rail">
        <div style={{ padding: "12px 20px 30px", background: "#FFFFFF", borderTop: "1px solid #EFE6DA", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)", display: "flex", gap: "10px" }}>
        <Toggle storeKey="downloads" field="walk-morning" onLabel="Walk downloaded. Remove download" offLabel="Download walk for offline use" onToast="Walk downloaded — maps and stories work offline" offToast="Download removed" style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "14px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          on={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F7A4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="m8 12 3 3 5-6" />
            </svg>
          }
          off={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
          }
        />
        <Link href="/navigate" style={{ flex: "1", height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 8px 18px rgba(154, 78, 54, 0.26)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>
            Start walk
          </span>
        </Link>
        </div>
      </div>
    </div>
  );
}
