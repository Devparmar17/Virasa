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

const Row = ({ icon, title, sub, dark }: { icon: string; title: string; sub: string; dark?: boolean }) => (
  <>
    <span aria-hidden="true" style={{ flex: "0 0 44px", height: "44px", borderRadius: "14px", background: dark ? "rgba(255, 255, 255, 0.16)" : "#F6EEE4", color: dark ? "#FFFFFF" : "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={icon} />
      </svg>
    </span>
    <span style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{title}</span>
      <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: dark ? "rgba(255, 255, 255, 0.85)" : "#6F5B4B" }}>{sub}</span>
    </span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  </>
);

// What to do in a city that isn't Ahmedabad.
export function Elsewhere() {
  const here = useHere();
  const t = useT();
  const ask = useAsk();
  const city = here.city;
  const img = cityImage(city);
  const row = { minHeight: "72px", padding: "12px 14px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", textDecoration: "none", cursor: "pointer", width: "100%", boxSizing: "border-box" } as const;
  return (
    <section aria-label={t("here.title", { city })} style={{ margin: "20px 20px 0" }}>
      {/* The city's photo, or a warm stone-lattice pattern when there's no photo yet. */}
      <div style={{ position: "relative", minHeight: "210px", borderRadius: "24px", overflow: "hidden", background: "linear-gradient(150deg, #A9583A 0%, #7E3D29 55%, #4E2416 100%)", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 14px 30px rgba(78, 36, 22, 0.24)" }}>
        {img ? (
          <>
            <img src={img} alt="" className="kenburns" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20, 12, 6, 0.1) 0%, rgba(20, 12, 6, 0.55) 50%, rgba(20, 12, 6, 0.9) 100%)" }} />
          </>
        ) : (
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
        <span style={{ position: "relative", alignSelf: "flex-start", margin: "16px 0 0 16px", height: "30px", padding: "0 12px 0 9px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.18)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {t("here.kicker", { city: city.toUpperCase() })}
        </span>
        <div style={{ position: "relative", padding: "14px 16px 16px" }}>
          <h2 style={{ margin: "0 2px", fontSize: "26px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" }}>{t("here.title", { city })}</h2>
          <Link href={`/trip?city=${encodeURIComponent(city)}`} style={{ ...row, marginTop: "14px", minHeight: "64px", padding: "10px 10px 10px 16px", background: "#FFFFFF", color: "#2B1B10" }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{t("here.plan")}</span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: "#6F5B4B" }}>{t("here.plan_sub")}</span>
            </span>
            <span aria-hidden="true" style={{ flex: "0 0 44px", height: "44px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
      <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <Link href={`/discover?city=${encodeURIComponent(city)}`} style={{ ...row, border: "1px solid #EFE6DA", background: "#FFFFFF", color: "#2B1B10" }}>
          <Row icon="M6 3h12l4 6-10 13L2 9ZM11 3 8 9l4 13 4-13-3-6M2 9h20" title={t("here.discover")} sub={t("here.discover_sub", { city })} />
        </Link>
        <button type="button" onClick={() => ask(`I'm in ${city}. What should I see and eat here today?`)} style={{ ...row, border: "1px solid #EFE6DA", background: "#FFFFFF", color: "#2B1B10" }}>
          <Row icon="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" title={t("here.ask")} sub={t("here.ask_sub")} />
        </button>
      </div>
    </section>
  );
}
