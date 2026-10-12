"use client";

// Heritage passport — every stamp collected, by state.
import { useState } from "react";
import Link from "next/link";
import Sheet from "@/components/Sheet";
import { share, useAsk } from "@/components/Tap";
import { frame, ScreenHeader } from "@/components/ui";
import { UserName } from "@/components/User";

type Stamp = { id: string; name: string; city: string; state: "GJ" | "RJ" | "DL"; when: string; href?: string };

const STATES = {
  GJ: { name: "Gujarat", ink: "#9A4E36" },
  RJ: { name: "Rajasthan", ink: "#B4552A" },
  DL: { name: "Delhi", ink: "#8A6424" },
} as const;

const STAMPS: Stamp[] = [
  { id: "sidi", name: "Sidi Saiyyed Mosque", city: "Ahmedabad", state: "GJ", when: "Oct 2026", href: "/place" },
  { id: "dhal", name: "Dhal ni Pol", city: "Ahmedabad", state: "GJ", when: "Oct 2026" },
  { id: "bhadra", name: "Bhadra Fort", city: "Ahmedabad", state: "GJ", when: "Oct 2026" },
  { id: "teen", name: "Teen Darwaza", city: "Ahmedabad", state: "GJ", when: "Oct 2026" },
  { id: "adalaj", name: "Adalaj Stepwell", city: "Ahmedabad", state: "GJ", when: "Sep 2026" },
  { id: "ranikivav", name: "Rani ki Vav", city: "Patan", state: "GJ", when: "Sep 2026" },
  { id: "citypalace", name: "City Palace", city: "Udaipur", state: "RJ", when: "Mar 2026" },
  { id: "jagdish", name: "Jagdish Temple", city: "Udaipur", state: "RJ", when: "Mar 2026" },
  { id: "bagore", name: "Bagore ki Haveli", city: "Udaipur", state: "RJ", when: "Mar 2026" },
  { id: "mehrangarh", name: "Mehrangarh Fort", city: "Jodhpur", state: "RJ", when: "Mar 2026" },
  { id: "jaswant", name: "Jaswant Thada", city: "Jodhpur", state: "RJ", when: "Mar 2026" },
  { id: "qutub", name: "Qutub Minar", city: "Delhi", state: "DL", when: "Dec 2025" },
  { id: "humayun", name: "Humayun's Tomb", city: "Delhi", state: "DL", when: "Dec 2025" },
  { id: "redfort", name: "Red Fort", city: "Delhi", state: "DL", when: "Dec 2025" },
];

const NEXT = [
  { name: "Jama Masjid", note: "11 min walk · on your morning walk", href: "/walk" },
  { name: "Sarkhej Roza", note: "8 km · best at sunset", href: "/ar" },
  { name: "Hawa Mahal", note: "Jaipur · for your trip", href: "/city" },
];

const TILT = [-7, 4, -3, 6, -5, 3];

function Seal({ stamp, index, size = 92 }: { stamp: Stamp; index: number; size?: number }) {
  const ink = STATES[stamp.state].ink;
  return (
    <span aria-hidden="true" style={{ width: `${size}px`, height: `${size}px`, borderRadius: "50%", border: `2px dashed ${ink}`, padding: "5px", display: "block", rotate: `${TILT[index % TILT.length]}deg`, background: "#FFFDF8" }}>
      <span style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${ink}`, color: ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px" }}>
        <span style={{ fontSize: `${size * 0.09}px`, fontWeight: 800, letterSpacing: "0.14em" }}>VIRASA</span>
        <span style={{ fontSize: `${size * 0.3}px`, lineHeight: 1, fontWeight: 800, letterSpacing: "-0.02em" }}>{stamp.state}</span>
        <span style={{ fontSize: `${size * 0.09}px`, fontWeight: 700, letterSpacing: "0.08em" }}>{stamp.when.toUpperCase()}</span>
      </span>
    </span>
  );
}

export default function PassportScreen() {
  const [filter, setFilter] = useState<"all" | Stamp["state"]>("all");
  const [open, setOpen] = useState<Stamp | null>(null);
  const ask = useAsk();
  const shown = STAMPS.filter((s) => filter === "all" || s.state === filter);
  const cities = new Set(STAMPS.map((s) => s.city)).size;
  const counts = (st: Stamp["state"]) => STAMPS.filter((s) => s.state === st).length;

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader
        title="Heritage passport"
        back="/profile"
        action={
          <button type="button" aria-label="Share passport" onClick={() => share("My Virasa heritage passport", `${STAMPS.length} stamps across ${cities} cities`)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
          </button>
        }
      />
      <section aria-label="Progress" style={{ margin: "8px 20px 0", padding: "18px", borderRadius: "20px", background: "#2B1B10", color: "#FBF6EE" }}>
        <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#E7B98A" }}>
          <UserName upper />
        </p>
        <p style={{ margin: "8px 0 0", fontSize: "26px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>3 of 36 states &amp; UTs</p>
        <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#D9C6AE" }}>
          {STAMPS.length} stamps across {cities} cities
        </p>
        <div style={{ marginTop: "14px", height: "6px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.16)", overflow: "hidden" }}>
          <div className="splash-bar" style={{ width: "8.3%", height: "100%", borderRadius: "999px", background: "#F3D9A8" }} />
        </div>
        <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid rgba(251, 246, 238, 0.14)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", fontSize: "13px" }}>
          <span>
            <strong style={{ color: "#F3D9A8" }}>Next: Gujarat gold</strong> · 240 / 300 pts
          </span>
          <Link href="/games" style={{ flex: "0 0 auto", whiteSpace: "nowrap", height: "36px", padding: "0 12px", borderRadius: "10px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800 }}>
            Earn points
          </Link>
        </div>
      </section>

      <div style={{ margin: "18px 0 0", padding: "0 20px", display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none" }}>
        {(["all", "GJ", "RJ", "DL"] as const).map((id) => (
          <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} style={{ flex: "0 0 auto", height: "38px", padding: "0 14px", borderRadius: "999px", border: `1.5px solid ${filter === id ? "#2B1B10" : "#E2D3C1"}`, background: filter === id ? "#2B1B10" : "#FFFFFF", color: filter === id ? "#FFFFFF" : "#2B1B10", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            {id === "all" ? `All ${STAMPS.length}` : `${STATES[id].name} ${counts(id)}`}
          </button>
        ))}
      </div>

      <ul key={filter} className="stagger" style={{ listStyle: "none", margin: "18px 0 0", padding: "0 14px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", rowGap: "18px" }}>
        {shown.map((s, i) => (
          <li key={s.id}>
            <button type="button" onClick={() => setOpen(s)} aria-label={`${s.name}, ${s.city}, ${s.when}`} style={{ width: "100%", padding: "4px 2px", border: "0", background: "none", color: "#2B1B10", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <Seal stamp={s} index={i} />
              <span style={{ fontSize: "12px", lineHeight: 1.25, fontWeight: 700, textAlign: "center" }}>{s.name}</span>
              <span style={{ marginTop: "-5px", fontSize: "11px", color: "#6F5B4B" }}>{s.city}</span>
            </button>
          </li>
        ))}
      </ul>

      <section style={{ margin: "28px 20px 0" }}>
        <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>Collect next</h2>
        <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5A4434" }}>A stamp is added when you arrive at a place.</p>
        <ul style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {NEXT.map((n) => (
            <li key={n.name}>
              <Link href={n.href} style={{ minHeight: "64px", padding: "10px 14px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #EADFD2", color: "#2B1B10", display: "flex", alignItems: "center", gap: "14px" }}>
                <span aria-hidden="true" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", border: "2px dashed #CDBFAE", color: "#A8927C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "15px", fontWeight: 800 }}>{n.name}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{n.note}</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name || ""}>
        {open ? (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span className="pop-in">
                <Seal stamp={open} index={STAMPS.indexOf(open)} size={104} />
              </span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: "#2B1B10" }}>
                  {open.city}, {STATES[open.state].name}
                </strong>
                <br />
                Stamp collected {open.when}
              </p>
            </div>
            {open.href ? (
              <Link href={open.href} className="sheet-row">
                Open place
                <span aria-hidden="true">›</span>
              </Link>
            ) : null}
            <button type="button" className="sheet-row" onClick={() => ask(`Remind me of the story of ${open.name} in ${open.city}`)}>
              <span>
                Hear its story again
                <small>The AI Guide retells it</small>
              </span>
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}
      </Sheet>
    </div>
  );
}
