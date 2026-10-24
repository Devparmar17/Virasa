// 02 · Welcome
import Link from "next/link";

export default function WelcomeScreen() {
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Tamil', 'Noto Sans Bengali', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ position: "relative", height: "268px", marginTop: "64px", display: "flex", justifyContent: "center" }}>
        <div className="hero-chip hero-chip-a" style={{ position: "absolute", left: "24px", top: "150px", height: "40px", padding: "0 14px 0 6px", borderRadius: "999px", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 22px rgba(90, 52, 28, 0.14)", fontSize: "13px", fontWeight: "700", color: "#2B1B10" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
            </svg>
          </span>
          <span>
            Story · 2 min
          </span>
        </div>
        <div className="hero-chip hero-chip-b" style={{ position: "absolute", right: "22px", top: "54px", height: "40px", padding: "0 14px 0 6px", borderRadius: "999px", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 22px rgba(90, 52, 28, 0.14)", fontSize: "13px", fontWeight: "700", color: "#2B1B10" }}>
          <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span>
            22 min walk
          </span>
        </div>
        <img className="hero-arch" src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="Tree of Life stone jali at Sidi Saiyyed Mosque" style={{ width: "236px", height: "258px", objectFit: "cover", borderRadius: "118px 118px 22px 22px", display: "block", boxShadow: "0 22px 44px rgba(90, 52, 28, 0.22)", objectPosition: "4.1984% 0%", objectViewBox: "inset(0% 54.2554% 31.8072% 2.3777%)" }} />
      </div>
      <div style={{ padding: "26px 24px 0" }}>
        <h1 style={{ margin: "0", fontSize: "28px", lineHeight: "1.18", fontWeight: "800", letterSpacing: "-0.02em", textWrap: "balance" }}>
          {"India's heritage, all in one app"}
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.45", color: "#5A4434", textWrap: "pretty" }}>
          No more hopping between maps, search, YouTube and reels to understand one street.
        </p>
      </div>
      <ul style={{ listStyle: "none", margin: "22px 0 0", padding: "0 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <li style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "13px", background: "#F6EEE4", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>
              Discover hidden places
            </span>
            <span style={{ fontSize: "13px", color: "#6F5B4B" }}>
              Forts, temples, stepwells and food streets near you
            </span>
          </span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "13px", background: "#F6EEE4", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="6" cy="19" r="3" />
              <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
              <circle cx="18" cy="5" r="3" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>
              Walk there, story by story
            </span>
            <span style={{ fontSize: "13px", color: "#6F5B4B" }}>
              Routes with story stops along the way
            </span>
          </span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "13px", background: "#F6EEE4", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: "700" }}>
              Understand it in 2 minutes
            </span>
            <span style={{ fontSize: "13px", color: "#6F5B4B" }}>
              In English, हिन्दी, தமிழ், বাংলা and more
            </span>
          </span>
        </li>
      </ul>
      <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "30px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <Link href="/personalize" style={{ height: "56px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.28)" }}>
          <span>
            Get started
          </span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
          <Link href="/login#signin" style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#9A4E36", textDecoration: "none" }}>
            Sign in
          </Link>
          <Link href="/personalize" style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#5A4434", textDecoration: "none" }}>
            Explore as guest
          </Link>
        </div>
      </div>
    </div>
  );
}
