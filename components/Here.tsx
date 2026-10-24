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
      <div style={{ position: "relative", borderRadius: "22px", overflow: "hidden", background: "#2B1B10", color: "#FBF6EE" }}>
        {img ? <img src={img} alt="" className="kenburns" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} /> : null}
        <div style={{ position: "relative", padding: "18px 18px 20px", background: "linear-gradient(180deg, rgba(43, 27, 16, 0.2) 0%, rgba(43, 27, 16, 0.85) 100%)" }}>
          <p style={{ margin: 0, fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#F3D9A8" }}>{t("here.kicker", { city: city.toUpperCase() })}</p>
          <h2 style={{ margin: "6px 0 0", fontSize: "26px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>{t("here.title", { city })}</h2>
          <Link href={`/trip?city=${encodeURIComponent(city)}`} style={{ ...row, marginTop: "14px", background: "#9A4E36", color: "#FFFFFF" }}>
            <Row dark icon="M3 11l19-9-9 19-2-8-8-2z" title={t("here.plan")} sub={t("here.plan_sub")} />
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
