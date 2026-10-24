// 14 · Arrival
import Link from "next/link";
import BackLink from "@/components/Back";
import { AutoStory } from "@/components/Prefs";
import { Confetti, Tick } from "@/components/ui";
import { StampCheck } from "../navigate/parts";

export default function ArrivedScreen() {
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <AutoStory href="/story" />
      <div style={{ position: "relative", height: "272px" }}>
        <img src="/images/358cd23211709da539c3303890c27e8b.jpg" alt="Sidi Saiyyed Mosque, Tree of Life jali" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "120px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.45) 0%, rgba(20, 12, 6, 0) 100%)" }} />
        <BackLink href="/place" aria-label="Close" style={{ position: "absolute", top: "50px", left: "16px", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </BackLink>
      </div>
      <main style={{ position: "relative", marginTop: "-26px", borderRadius: "24px 24px 0 0", background: "#FFFFFF", padding: "44px 20px 0" }}>
        <span aria-hidden="true" className="success-badge" style={{ position: "absolute", top: "-32px", left: "50%", marginLeft: "-32px", width: "64px", height: "64px", borderRadius: "50%", background: "#2F7A4A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #FFFFFF", boxShadow: "0 8px 20px rgba(47, 122, 74, 0.3)" }}>
          <Tick size={30} width={3} />
          <Confetti />
        </span>
        <p style={{ margin: "0", textAlign: "center", fontSize: "13px", fontWeight: "800", letterSpacing: "0.12em", color: "#2F7A4A" }}>
          {"YOU'VE ARRIVED"}
        </p>
        <h1 style={{ margin: "6px 0 0", textAlign: "center", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em" }}>
          Sidi Saiyyed Mosque
        </h1>
        <StampCheck id="sidi" name="Sidi Saiyyed Mosque" />
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/story" style={{ height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 8px 18px rgba(154, 78, 54, 0.26)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
            {" Play the 2-min story "}
          </Link>
          <Link href="/lens" style={{ height: "52px", borderRadius: "14px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {" Find the Tree of Life with Lens "}
          </Link>
        </div>
        <p style={{ margin: "20px 0 0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          BEFORE YOU STEP IN
        </p>
        <ul style={{ listStyle: "none", margin: "10px 0 0", padding: "0", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
          <li style={{ padding: "12px 10px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700", lineHeight: "1.3" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
              <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
            </svg>
            {" Shoes off in the prayer hall "}
          </li>
          <li style={{ padding: "12px 10px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700", lineHeight: "1.3" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
            {" Shoulders and knees covered "}
          </li>
          <li style={{ padding: "12px 10px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: "700", lineHeight: "1.3" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="22" x2="16" y1="9" y2="15" />
              <line x1="16" x2="22" y1="9" y2="15" />
            </svg>
            {" Quiet during prayer times "}
          </li>
        </ul>
        <Link href="/navigate" style={{ marginTop: "14px", minHeight: "60px", padding: "10px 12px", borderRadius: "16px", border: "1px solid #EFE6DA", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#2B1B10" }}>
          <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800" }}>
            2
          </span>
          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Next on your walk · 6 min
            </span>
            <span style={{ fontSize: "15px", fontWeight: "800" }}>
              Bhadra Fort
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </main>
    </div>
  );
}
