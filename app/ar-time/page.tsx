"use client";

// 20 · Time travel — compare the Tree of Life as it may have looked newly
// carved (left of the line) with how it stands today (right). Drag anywhere
// on the picture, or jump with the buttons below.
import { useRef, useState } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import LensModes from "@/components/LensModes";
import { useT } from "@/lib/i18n";

const IMG = "/images/a9558385034112d0e27f39ea353dd7ed.jpg";
const CHANGES = [
  ["Fresh-cut stone", "Newly carved, the sandstone was pale and sharp-edged. Four and a half centuries of sun and monsoon have softened and darkened it."],
  ["Every leaf in place", "The carving is a single slab of stone. What you see today has survived almost whole."],
  ["Light through the lattice", "The jali was made to let sunlight and breeze into the prayer hall. That part hasn't changed."],
];
const JUMPS: [string, number][] = [
  ["1573", 0],
  ["Compare", 50],
  ["Today", 100],
];

export default function ARTimeScreen() {
  const t = useT();
  // 0 shows all of 1573, 100 all of today; the line sits between them.
  const [v, setV] = useState(50);
  const [moved, setMoved] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const line = 100 - v;
  const readout = v < 34 ? t("at.mostly_old") : v > 66 ? t("at.mostly_now") : t("at.half");

  const fromPointer = (x: number) => {
    const r = area.current?.getBoundingClientRect();
    if (!r) return;
    const pos = Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100));
    setV(Math.round(100 - pos));
    setMoved(true);
  };

  return (
    <div style={{ width: "390px", minHeight: "844px", position: "relative", overflow: "hidden", background: "var(--night)", color: "var(--ink)" }}>
      {/* The picture: drag anywhere on it to move the line. */}
      <div
        ref={area}
        onPointerDown={(e) => {
          // Taps on the close button and mode tabs over the picture stay taps.
          if ((e.target as HTMLElement).closest("a, button, nav")) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.current = true;
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current && e.buttons) fromPointer(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        style={{ position: "relative", height: "540px", overflow: "hidden", touchAction: "pan-y", cursor: "ew-resize", userSelect: "none" }}
      >
        <img src={IMG} alt="Camera view of the Tree of Life jali today" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "28% 50%", display: "block" }} />
        <img src={IMG} alt="" aria-hidden="true" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "28% 50%", display: "block", filter: "sepia(0.85) saturate(1.35) brightness(1.12) contrast(1.05)", clipPath: `inset(0 ${100 - line}% 0 0)`, transition: moved ? "none" : "clip-path 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "200px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.7) 0%, rgba(20, 12, 6, 0) 100%)" }} />
        <span aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, left: `${line}%`, width: "3px", marginLeft: "-1.5px", background: "var(--paper)", boxShadow: "0 0 14px rgba(243, 217, 168, 0.9)", transition: moved ? "none" : "left 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        <span aria-hidden="true" className={moved ? undefined : "nudge"} style={{ position: "absolute", top: "330px", left: `${line}%`, width: "52px", height: "52px", marginLeft: "-26px", borderRadius: "50%", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(0, 0, 0, 0.4)", transition: moved ? "none" : "left 0.4s cubic-bezier(0.22, 1, 0.36, 1)" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18-6-6 6-6" />
            <path d="m15 6 6 6-6 6" />
          </svg>
        </span>
        <span style={{ position: "absolute", left: "14px", top: "168px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(243, 217, 168, 0.95)", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center" }}>{t("at.then")}</span>
        <span style={{ position: "absolute", right: "14px", top: "168px", height: "30px", padding: "0 12px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.72)", color: "var(--paper)", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center" }}>{t("tk.today")}</span>
        {!moved ? (
          <span className="fade-in" style={{ position: "absolute", left: "50%", bottom: "84px", transform: "translateX(-50%)", height: "36px", padding: "0 14px", borderRadius: "999px", background: "rgba(20, 12, 6, 0.75)", color: "var(--paper)", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", whiteSpace: "nowrap", pointerEvents: "none" }}>
            {t("at.drag")}
          </span>
        ) : null}

        {/* Top bar and modes */}
        <div style={{ position: "absolute", top: "50px", left: "12px", right: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--paper)" }}>
          <BackLink href="/home" aria-label="Close" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--paper)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </BackLink>
          <span style={{ fontSize: "16px", fontWeight: 800 }}>{t("lm.time")}</span>
          <span style={{ width: "44px" }} />
        </div>
        <LensModes active="time" style={{ top: "108px" }} />
      </div>

      {/* Controls and what changed */}
      <section aria-label={t("at.controls")} style={{ position: "relative", marginTop: "-24px", borderRadius: "26px 26px 0 0", background: "var(--paper)", padding: "10px 20px 28px" }}>
        <div style={{ width: "40px", height: "5px", borderRadius: "999px", background: "var(--line-strong)", margin: "0 auto" }} />
        <div style={{ marginTop: "14px", display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "21px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.01em" }}>{t("at.title")}</h1>
        </div>
        <p key={readout} className="fade-in" style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 700, color: "var(--clay)" }}>
          {readout}
        </p>
        <div role="radiogroup" aria-label={t("at.jump")} style={{ marginTop: "12px", padding: "4px", borderRadius: "14px", background: "var(--sand-deep)", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
          {JUMPS.map(([label, to]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={v === to}
              onClick={() => {
                setMoved(false);
                setV(to);
              }}
              style={{ height: "40px", border: 0, borderRadius: "10px", background: v === to ? "var(--paper)" : "transparent", color: v === to ? "var(--ink)" : "var(--ink-soft)", fontSize: "13px", fontWeight: v === to ? 800 : 700, boxShadow: v === to ? "0 2px 6px rgba(60, 36, 20, 0.14)" : "none", cursor: "pointer" }}
            >
              {label === "Compare" ? t("at.compare") : label === "Today" ? t("tk.today") : label}
            </button>
          ))}
        </div>

        <h2 style={{ margin: "18px 0 0", fontSize: "15px", fontWeight: 800 }}>{t("at.changed")}</h2>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {CHANGES.map(([title, body]) => (
            <li key={title} style={{ padding: "10px 12px", borderRadius: "14px", border: "1px solid var(--line)" }}>
              <span style={{ display: "block", fontSize: "14px", fontWeight: 800 }}>{title}</span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "13px", lineHeight: 1.45, color: "var(--ink-soft)" }}>{body}</span>
            </li>
          ))}
        </ul>
        <Link href="/story?ch=1" style={{ marginTop: "14px", height: "52px", borderRadius: "14px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="7 4 19 12 7 20 7 4" />
          </svg>
          {t("at.hear")}
        </Link>
      </section>
    </div>
  );
}
