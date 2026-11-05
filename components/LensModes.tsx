"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { replacingScreen } from "./Back";
import { useT, type Key } from "@/lib/i18n";

// The three camera modes, as one switch shared by their screens. Equal tabs
// with an icon and a one-line label, so the switch reads the same everywhere.
// Switching replaces the screen, so Back closes the camera rather than
// stepping back through modes.
type Mode = "lens" | "ar" | "time";

const MODES: { id: Mode; href: string; label: Key; icon: ReactNode }[] = [
  {
    id: "lens",
    href: "/lens",
    label: "lm.identify",
    icon: (
      <>
        <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
        <circle cx="12" cy="12" r="3.5" />
      </>
    ),
  },
  {
    id: "ar",
    href: "/ar",
    label: "lm.ar",
    icon: (
      <>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
  {
    id: "time",
    href: "/ar-time",
    label: "lm.time",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
];

export default function LensModes({ active, style }: { active: Mode; style?: CSSProperties }) {
  const t = useT();
  return (
    <nav
      aria-label={t("lm.modes")}
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        width: "318px",
        padding: "4px",
        borderRadius: "999px",
        background: "rgba(20, 12, 6, 0.55)",
        WebkitBackdropFilter: "blur(12px)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "2px",
        ...style,
      }}
    >
      {MODES.map((m) => {
        const on = m.id === active;
        const inner = (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {m.icon}
            </svg>
            {t(m.label)}
          </>
        );
        const look: CSSProperties = { height: "38px", padding: "0 6px", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "13px", fontWeight: on ? 800 : 700, whiteSpace: "nowrap", textDecoration: "none", transition: "background-color 0.25s ease, color 0.25s ease" };
        return on ? (
          <span key={m.id} aria-current="page" style={{ ...look, background: "#FFFFFF", color: "#2B1B10" }}>
            {inner}
          </span>
        ) : (
          <Link key={m.id} href={m.href} replace onClick={() => replacingScreen()} style={{ ...look, color: "#FFFFFF" }}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
