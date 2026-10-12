import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export const FONT = "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Tamil', 'Noto Sans Bengali', system-ui, -apple-system, 'Segoe UI', sans-serif";

// The frame every phone screen is drawn in.
export const frame = (extra?: CSSProperties): CSSProperties => ({ width: "390px", minHeight: "844px", position: "relative", background: "#FBF6EE", fontFamily: FONT, color: "#2B1B10", ...extra });

// Top bar with a back arrow, a centred title and an optional action on the right.
export function ScreenHeader({ title, back, action, dark }: { title: string; back: string; action?: ReactNode; dark?: boolean }) {
  const ink = dark ? "#FBF6EE" : "#2B1B10";
  return (
    <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Link href={back} aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: ink }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </Link>
      <h1 style={{ margin: "0", fontSize: "16px", fontWeight: 800, color: ink }}>{title}</h1>
      <span style={{ minWidth: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{action}</span>
    </div>
  );
}

export function SectionLabel({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} style={{ margin: "24px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424", scrollMarginTop: "16px" }}>
      {children}
    </h2>
  );
}

// A white card that groups setting rows.
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ border: "1px solid #EADFD2", borderRadius: "16px", background: "#FFFFFF", overflow: "hidden", ...style }}>{children}</div>;
}

export const rowStyle = (last?: boolean): CSSProperties => ({ width: "100%", minHeight: "56px", padding: "8px 14px", border: "0", borderBottom: last ? "0" : "1px solid #F0E8DD", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontSize: "15px", fontWeight: 600, textAlign: "left", textDecoration: "none", cursor: "pointer" });

export function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// The switch drawn on the Profile screen: green when on, the knob slides across.
export function SwitchRow({ label, hint, on, onToggle, last }: { label: string; hint?: string; on: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={onToggle} style={rowStyle(last)}>
      <span>
        {label}
        {hint ? <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 500, color: "#6F5B4B" }}>{hint}</span> : null}
      </span>
      <span aria-hidden="true" style={{ flex: "0 0 50px", width: "50px", height: "30px", padding: "3px", borderRadius: "999px", background: on ? "#2F7A4A" : "#CDBFAE", display: "flex", justifyContent: on ? "flex-end" : "flex-start", transition: "background-color 0.2s ease" }}>
        <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)" }} />
      </span>
    </button>
  );
}

// One-of-several choice, drawn like the story-length picker in onboarding.
export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} style={{ padding: "4px", borderRadius: "14px", background: "#F1E7DA", display: "grid", gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`, gap: "4px" }}>
      {options.map(([id, text]) => (
        <button key={id} type="button" role="radio" aria-checked={value === id} onClick={() => onChange(id)} style={{ minHeight: "44px", padding: "4px 6px", border: "0", borderRadius: "10px", background: value === id ? "#FFFFFF" : "transparent", color: value === id ? "#2B1B10" : "#5A4434", fontSize: "13px", fontWeight: value === id ? 800 : 600, boxShadow: value === id ? "0 2px 6px rgba(90, 60, 30, 0.14)" : "none", cursor: "pointer" }}>
          {text}
        </button>
      ))}
    </div>
  );
}
