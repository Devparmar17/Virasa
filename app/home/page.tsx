// 05 · Home (refined)
import Link from "next/link";
import MainNav from "@/components/MainNav";
import LangButton from "@/components/LangButton";
import VoiceSearch from "@/components/VoiceSearch";
import Highlights from "@/components/Highlights";
import { MarkOnboarded } from "@/components/Prefs";
import { Avatar, UserName } from "@/components/User";
import { Tap } from "@/components/Tap";

export default function HomeScreen() {
  return (
    <div style={{ width: "390px", height: "2388px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <header style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FFFFFF", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.07)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/images/845c09135def6279c007582842533707.png" alt="" style={{ width: "46px", height: "50px", objectFit: "contain", display: "block" }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: "1" }}>
            <span style={{ fontSize: "24px", fontWeight: "800", letterSpacing: "-0.01em" }}>
              Virasa
            </span>
            <span style={{ marginTop: "5px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.16em", color: "#8A6424" }}>
              HERITAGE AI
            </span>
          </div>
        </div>
        <Link href="/profile" aria-label="Your profile" style={{ width: "50px", height: "50px", borderRadius: "50%", padding: "3px", background: "#8A6424", display: "block" }}>
          <Avatar style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #FFFFFF" }} />
        </Link>
      </header>
      <main style={{ paddingBottom: "120px" }}>
        <div style={{ padding: "18px 16px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Tap aria-label="Change location, currently Ahmedabad, Old City" href="/city" style={{ height: "44px", padding: "0 6px", border: "0", background: "none", display: "flex", alignItems: "center", gap: "9px", cursor: "pointer", color: "#2B1B10" }}>
            <span style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span style={{ fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap" }}>
              Ahmedabad, Old City
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Tap>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: "#5A4434" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9831F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              {" 28°C "}
            </span>
            <LangButton
              style={{ height: "44px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", cursor: "pointer" }}
              pillStyle={{ height: "32px", padding: "0 11px", borderRadius: "999px", background: "#F5E6CC", color: "#6E4E1E", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: "700" }}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              }
            />
          </div>
        </div>
        <div style={{ padding: "18px 20px 0" }}>
          <p style={{ margin: "0", fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em", color: "#8A6424" }}>
            NAMASTE, <UserName first upper />
          </p>
          <h1 style={{ margin: "6px 0 0", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em", textWrap: "balance" }}>
            Where will your story begin?
          </h1>
        </div>
        <div style={{ margin: "18px 20px 0", height: "58px", border: "1.5px solid #D9C7B3", borderRadius: "16px", background: "#FFFFFF", display: "flex", alignItems: "center", padding: "0 6px 0 0", boxShadow: "0 6px 16px rgba(90, 60, 30, 0.06)" }}>
          <Link href="/search" style={{ flex: "1", minWidth: "0", height: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "0 8px 0 16px", textDecoration: "none" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
            <span style={{ flex: "1", fontSize: "15px", color: "#6F5B4B" }}>
              Search monuments, stories or food
            </span>
          </Link>
          <VoiceSearch style={{ flex: "0 0 46px", width: "46px", height: "46px", border: "0", borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </VoiceSearch>
        </div>
        <nav aria-label="Quick actions" style={{ margin: "18px 20px 0", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "10px" }}>
          <Link href="/ar" style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none", color: "#2B1B10" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
              <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.15", textAlign: "center" }}>
              AR Tour
            </span>
          </Link>
          <Link href="/story" style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none", color: "#2B1B10" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.15", textAlign: "center" }}>
              Audio stories
            </span>
          </Link>
          <Link href="/reels" style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none", color: "#2B1B10" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.15", textAlign: "center" }}>
              Reels
            </span>
          </Link>
          <Link href="/search" style={{ height: "90px", paddingTop: "16px", border: "1.5px solid #D9C7B3", borderRadius: "18px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textDecoration: "none", color: "#2B1B10" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.15", textAlign: "center" }}>
              Local bites
            </span>
          </Link>
        </nav>
        <Link href="/tickets" style={{ margin: "14px 20px 0", minHeight: "64px", padding: "10px 14px", borderRadius: "18px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
          </span>
          <span style={{ flex: "1", minWidth: "0" }}>
            <span style={{ display: "block", fontSize: "15px", fontWeight: "800" }}>
              Tickets and guided walks
            </span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "12px", color: "#D9C6AE" }}>
              Reserve entry or a local guide, pay there
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
        <section style={{ marginTop: "30px" }}>
          <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>
                Heritage highlights
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#A0522D" }}>
                Iconic architecture within reach today
              </p>
            </div>
            <Link href="/explore" style={{ height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: "700", color: "#9A4E36", whiteSpace: "nowrap" }}>
              See all
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <Highlights />
        </section>
        <section style={{ margin: "26px 20px 0" }}>
          <Link href="/walk" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "10px", padding: "18px 18px 18px", borderRadius: "20px", background: "#2B1B10", color: "#FBF6EE", textDecoration: "none" }}>
            <svg aria-hidden="true" width="170" height="180" viewBox="0 0 170 180" style={{ position: "absolute", right: "-24px", top: "-12px", opacity: "0.16" }}>
              <defs>
                <pattern id="walkjali" width="42" height="42" patternUnits="userSpaceOnUse">
                  <rect x="10" y="10" width="22" height="22" fill="none" stroke="#F3D9A8" strokeWidth="1.4" />
                  <rect x="10" y="10" width="22" height="22" fill="none" stroke="#F3D9A8" strokeWidth="1.4" transform="rotate(45 21 21)" />
                </pattern>
              </defs>
              <rect width="170" height="180" fill="url(#walkjali)" />
            </svg>
            <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#E7B98A" }}>
              PLANNED FOR YOU
            </span>
            <span style={{ fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>
              Old City in a morning
            </span>
            <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#D9C6AE", maxWidth: "270px" }}>
              6 stops · 2.4 km · 2 h 40 min — picked for architecture, food and legends
            </span>
            <span style={{ marginTop: "4px", alignSelf: "flex-start", height: "44px", padding: "0 16px", borderRadius: "12px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700" }}>
              <span>
                View route
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </span>
          </Link>
        </section>
        <section style={{ marginTop: "30px" }}>
          <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>
                {"Play & learn"}
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#A0522D" }}>
                {"AR and quick games from today's stories"}
              </p>
            </div>
            <Link href="/games" style={{ height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: "700", color: "#9A4E36", whiteSpace: "nowrap" }}>
              <span>
                All games
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className="hscroll" style={{ display: "flex", gap: "12px", padding: "14px 20px 0", overflowX: "auto", scrollbarWidth: "none" }}>
            <Link href="/ar-time" style={{ flex: "0 0 160px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <span style={{ position: "relative", height: "120px", borderRadius: "16px", overflow: "hidden", display: "block", background: "#2B1B10" }}>
                <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "sepia(0.9) saturate(1.3) brightness(1.05)", clipPath: "inset(0 50% 0 0)" }} />
                <span style={{ position: "absolute", left: "50%", top: "0", bottom: "0", width: "2px", marginLeft: "-1px", background: "#FBF6EE" }} />
                <span style={{ position: "absolute", left: "50%", top: "50%", width: "24px", height: "24px", margin: "-12px 0 0 -12px", borderRadius: "50%", background: "#FBF6EE", boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", height: "22px", padding: "0 8px", borderRadius: "999px", background: "rgba(43, 27, 16, 0.85)", color: "#F3D9A8", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  AR
                </span>
              </span>
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                AR time travel
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                See 1573 through your camera
              </span>
            </Link>
            <Link href="/quiz" style={{ flex: "0 0 160px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <span style={{ position: "relative", height: "120px", borderRadius: "16px", background: "#F5E6CC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>
                </span>
                <span style={{ position: "absolute", top: "8px", left: "8px", height: "22px", padding: "0 8px", borderRadius: "999px", background: "#FFFFFF", color: "#7E3D29", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  GAME
                </span>
              </span>
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Heritage quiz
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                3 questions · +30 pts
              </span>
            </Link>
            <Link href="/puzzle" style={{ flex: "0 0 160px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <span style={{ position: "relative", height: "120px", borderRadius: "16px", overflow: "hidden", display: "block", background: "#2B1B10" }}>
                <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", left: "33.33%", top: "0", bottom: "0", width: "3px", background: "#FBF6EE" }} />
                <span style={{ position: "absolute", left: "66.66%", top: "0", bottom: "0", width: "3px", background: "#FBF6EE" }} />
                <span style={{ position: "absolute", top: "33.33%", left: "0", right: "0", height: "3px", background: "#FBF6EE" }} />
                <span style={{ position: "absolute", top: "66.66%", left: "0", right: "0", height: "3px", background: "#FBF6EE" }} />
                <span style={{ position: "absolute", right: "0", bottom: "0", width: "33.33%", height: "33.33%", background: "#2B1B10" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", height: "22px", padding: "0 8px", borderRadius: "999px", background: "#FFFFFF", color: "#7E3D29", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center" }}>
                  GAME
                </span>
              </span>
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Jali puzzle
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                Slide to rebuild · +20 pts
              </span>
            </Link>
          </div>
        </section>
        <section style={{ marginTop: "30px" }}>
          <div style={{ padding: "0 20px" }}>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>
              {"Local secrets & flavours"}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#A0522D" }}>
              Step off the map into neighbourhood lore
            </p>
          </div>
          <div style={{ padding: "14px 20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link href="/secret?id=dhal" aria-label="Dhal ni Pol woodcarvings" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", border: "1px solid #EADFD2", borderRadius: "18px", background: "#FFFFFF", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/6b114a4ce322f517be6c561ea38233e8.jpg" alt="Carved wooden facades in Dhal ni Pol" style={{ flex: "0 0 86px", width: "86px", height: "86px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ height: "24px", padding: "0 8px", borderRadius: "7px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                    Hidden gem
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B", whiteSpace: "nowrap" }}>
                    650 m · 8 min
                  </span>
                </div>
                <h3 style={{ margin: "0", fontSize: "16px", lineHeight: "1.25", fontWeight: "800" }}>
                  Dhal ni Pol woodcarvings
                </h3>
                <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.35", color: "#5A4434" }}>
                  Carved havelis and a pol bird-feeder tower
                </p>
              </div>
              <span aria-hidden="true" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </Link>
            <Link href="/secret?id=manek" aria-label="Manek Chowk night market" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", border: "1px solid #EADFD2", borderRadius: "18px", background: "#FFFFFF", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/manek-chowk.jpg" alt="Food stalls at Manek Chowk at night" style={{ flex: "0 0 86px", width: "86px", height: "86px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ height: "24px", padding: "0 8px", borderRadius: "7px", background: "#F6DCD2", color: "#8A3A22", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                    Must-taste · 8 PM
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B", whiteSpace: "nowrap" }}>
                    1.1 km
                  </span>
                </div>
                <h3 style={{ margin: "0", fontSize: "16px", lineHeight: "1.25", fontWeight: "800" }}>
                  Manek Chowk night market
                </h3>
                <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.35", color: "#5A4434" }}>
                  Must-try: Gwalior dosa, pineapple sandwich
                </p>
              </div>
              <span aria-hidden="true" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </Link>
            <Link href="/secret?id=bhadra" aria-label="Bhadra Fort's secret tunnels" style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", border: "1px solid #EADFD2", borderRadius: "18px", background: "#FFFFFF", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/bhadra-fort.jpg" alt="The gate and tower of Bhadra Fort" style={{ flex: "0 0 86px", width: "86px", height: "86px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
              <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ height: "24px", padding: "0 8px", borderRadius: "7px", background: "#EDE4DA", color: "#5A4434", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
                    Folklore
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B", whiteSpace: "nowrap" }}>
                    1.4 km · 18 min
                  </span>
                </div>
                <h3 style={{ margin: "0", fontSize: "16px", lineHeight: "1.25", fontWeight: "800" }}>
                  {"Bhadra Fort's secret tunnels"}
                </h3>
                <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.35", color: "#5A4434" }}>
                  Myths of passages running under the old city
                </p>
              </div>
              <span aria-hidden="true" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </Link>
          </div>
        </section>
        <section style={{ marginTop: "30px" }}>
          <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800", letterSpacing: "-0.01em" }}>
                Plan your next city
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#A0522D" }}>
                Heritage trails across India
              </p>
            </div>
            <Link href="/city" style={{ height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: "700", color: "#9A4E36", whiteSpace: "nowrap" }}>
              <span>
                All cities
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <div className="hscroll" style={{ display: "flex", gap: "12px", padding: "14px 20px 0", overflowX: "auto", scrollbarWidth: "none" }}>
            <Link href="/plan?city=jaipur" style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/amber-fort.jpg" alt="Amber Fort, Jaipur" style={{ width: "100%", height: "120px", borderRadius: "16px", objectFit: "cover", display: "block" }} />
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Jaipur
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                {"Rajasthan · forts & bazaars"}
              </span>
            </Link>
            <Link href="/plan?city=varanasi" style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/varanasi-ghats.jpg" alt="Boats on the Ganga at Varanasi at sunrise" style={{ width: "100%", height: "120px", borderRadius: "16px", objectFit: "cover", display: "block" }} />
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Varanasi
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                Uttar Pradesh · ghats
              </span>
            </Link>
            <Link href="/plan?city=hampi" style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/hampi-chariot.jpg" alt="The stone chariot at Vittala Temple, Hampi" style={{ width: "100%", height: "120px", borderRadius: "16px", objectFit: "cover", display: "block" }} />
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Hampi
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                Karnataka · Vijayanagara ruins
              </span>
            </Link>
            <Link href="/plan?city=kolkata" style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "#2B1B10" }}>
              <img src="/images/victoria-memorial.jpg" alt="Victoria Memorial, Kolkata" style={{ width: "100%", height: "120px", borderRadius: "16px", objectFit: "cover", display: "block" }} />
              <span style={{ marginTop: "2px", fontSize: "15px", fontWeight: "800" }}>
                Kolkata
              </span>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                West Bengal · colonial lanes
              </span>
            </Link>
          </div>
        </section>
      </main>
      <MainNav active="home" />
      <MarkOnboarded />
    </div>
  );
}
