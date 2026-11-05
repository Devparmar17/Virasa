"use client";

// Home follows the traveller's city: Ahmedabad's walks, stories and finds
// when they're there, and elsewhere a card that plans, discovers and asks
// about the city they're actually in.
import type { ReactNode } from "react";
import Link from "next/link";
import { useAsk } from "./Tap";
import { useStored } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { DEFAULT_HERE, isAhmedabad, type Here } from "@/lib/here";
import { cityImage } from "@/lib/trip";

export const useHere = () => useStored<Here>("here", DEFAULT_HERE)[0];

// Just the city's name, in the app's language for Ahmedabad: "Ahmedabad", "अहमदाबाद", "Jaipur".
export function HereCity() {
  const here = useHere();
  const t = useT();
  return <>{isAhmedabad(here) ? t("home.city").split(/[,،]/)[0] : here.city}</>;
}

// Shows its children in Ahmedabad, and `elsewhere` anywhere else.
export function HereGate({ children, elsewhere = null }: { children: ReactNode; elsewhere?: ReactNode }) {
  const here = useHere();
  return <>{isAhmedabad(here) ? children : elsewhere}</>;
}

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

// A light tile: icon on top, a title, one line under it.
const tile = { minHeight: "118px", padding: "14px", border: 0, borderRadius: "20px", background: "#F6EEE4", color: "#2B1B10", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "12px", textAlign: "left", textDecoration: "none", cursor: "pointer", font: "inherit", boxSizing: "border-box" } as const;
const TileBody = ({ icon, title, sub }: { icon: string; title: string; sub: string }) => (
  <>
    <span style={{ width: "38px", height: "38px", borderRadius: "12px", background: "#FFFFFF", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={icon} size={19} />
    </span>
    <span>
      <span style={{ display: "block", fontSize: "15px", fontWeight: 800, lineHeight: 1.25 }}>{title}</span>
      <span style={{ display: "block", marginTop: "3px", fontSize: "12px", fontWeight: 600, lineHeight: 1.35, color: "#6F5B4B" }}>{sub}</span>
    </span>
  </>
);

// What to do in a city that isn't Ahmedabad: one card with the city and the
// main action (plan the day), then two light tiles for finding and asking.
export function Elsewhere() {
  const here = useHere();
  const t = useT();
  const ask = useAsk();
  const city = here.city;
  const img = cityImage(city);
  return (
    <section aria-label={t("here.title", { city })} style={{ margin: "16px 20px 0" }}>
      <div style={{ position: "relative", minHeight: "196px", borderRadius: "24px", overflow: "hidden", color: "#FFFFFF", background: "linear-gradient(150deg, #B0603F 0%, #8A4129 55%, #5E2A1A 100%)", boxShadow: "0 14px 30px rgba(94, 42, 26, 0.24)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {img ? (
          <>
            <img src={img} alt="" className="kenburns" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 15%, rgba(20, 12, 6, 0.6) 50%, rgba(20, 12, 6, 0.92) 100%)" }} />
          </>
        ) : (
          // No photo of this city yet: a stone-lattice pattern instead of a flat box.
          <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.12 }}>
            <defs>
              <pattern id="here-jali" width="44" height="44" patternUnits="userSpaceOnUse">
                <rect x="11" y="11" width="22" height="22" fill="none" stroke="#FFE7C7" strokeWidth="1.4" />
                <rect x="11" y="11" width="22" height="22" fill="none" stroke="#FFE7C7" strokeWidth="1.4" transform="rotate(45 22 22)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#here-jali)" />
          </svg>
        )}
        <div style={{ position: "relative", padding: "18px" }}>
          <h2 style={{ margin: 0, fontSize: "25px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" }}>{t("here.title", { city })}</h2>
          <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 600, color: "rgba(255, 255, 255, 0.86)" }}>{t("here.plan_sub")}</p>
          <Link href={`/trip?city=${encodeURIComponent(city)}`} style={{ marginTop: "14px", height: "50px", padding: "0 8px 0 18px", borderRadius: "999px", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", fontSize: "15px", fontWeight: 800, textDecoration: "none" }}>
            {t("here.plan")}
            <span style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d="M5 12h14M13 6l6 6-6 6" size={18} />
            </span>
          </Link>
        </div>
      </div>
      <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
        <Link href={`/discover?city=${encodeURIComponent(city)}`} style={tile}>
          <TileBody icon="M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20" title={t("here.discover")} sub={t("here.discover_sub", { city })} />
        </Link>
        <button type="button" onClick={() => ask(t("here.ask_q", { city }))} style={tile}>
          <TileBody icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" title={t("here.ask")} sub={t("here.ask_sub")} />
        </button>
      </div>
    </section>
  );
}
