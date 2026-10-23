// 04 · Location priming
import Link from "next/link";
import BackLink from "@/components/Back";
import GeoLink from "@/components/GeoLink";

export default function LocationScreen() {
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 12px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BackLink href="/personalize" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#9A4E36" }} />
            <span style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#E2D3C1", overflow: "hidden", display: "block" }}>
              <span className="step-fill" style={{ display: "block", width: "100%", height: "100%", borderRadius: "999px", background: "#9A4E36" }} />
            </span>
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
            Step 2 of 2
          </span>
        </div>
        <span style={{ width: "54px" }} />
      </div>
      <div style={{ margin: "6px 24px 0", height: "250px", borderRadius: "24px", overflow: "hidden", position: "relative", background: "#F4F1EA", border: "1px solid #E6D8C4" }}>
        <svg aria-hidden="true" width="342" height="250" viewBox="0 0 342 250" style={{ position: "absolute", inset: "0", display: "block" }}>
          <path d="M0 0 H58 C46 70 70 150 50 250 H0 Z" fill="#D3E4DF" />
          <rect x="250" y="190" width="70" height="44" rx="10" fill="#DFE8CF" />
          <g stroke="#E9DDCB" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M80 40 H330" />
            <path d="M90 130 H330" />
            <path d="M100 215 H240" />
            <path d="M110 0 V250" />
            <path d="M270 0 V180" />
            <path d="M320 20 V240" />
          </g>
          <g stroke="#E1D8C8" strokeWidth="12" fill="none" strokeLinecap="round">
            <path d="M58 88 H342" />
            <path d="M50 176 C140 168 230 182 342 160" />
            <path d="M168 0 V250" />
            <path d="M214 0 L300 250" />
          </g>
          <g stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round">
            <path d="M58 88 H342" />
            <path d="M50 176 C140 168 230 182 342 160" />
            <path d="M168 0 V250" />
            <path d="M214 0 L300 250" />
          </g>
          <circle cx="190" cy="128" r="76" fill="#2F6FB0" opacity="0.08" />
          <circle cx="190" cy="128" r="76" fill="none" stroke="#2F6FB0" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
          <g>
            <path d="M118 62c0 9-12 18-12 18s-12-9-12-18a12 12 0 0 1 24 0Z" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="106" cy="62" r="4" fill="#FFFFFF" />
          </g>
          <g>
            <path d="M262 84c0 9-12 18-12 18s-12-9-12-18a12 12 0 0 1 24 0Z" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="250" cy="84" r="4" fill="#FFFFFF" />
          </g>
          <g>
            <path d="M244 186c0 9-12 18-12 18s-12-9-12-18a12 12 0 0 1 24 0Z" fill="#8A6424" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="232" cy="186" r="4" fill="#FFFFFF" />
          </g>
          <circle cx="190" cy="128" r="16" fill="#2F6FB0" opacity="0.18" />
          <circle cx="190" cy="128" r="8" fill="#2F6FB0" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
        <span style={{ position: "absolute", left: "152px", top: "40px", height: "22px", padding: "0 8px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.92)", fontSize: "11px", fontWeight: "700", color: "#2F5F95", display: "flex", alignItems: "center" }}>
          10-min walk
        </span>
        <span style={{ position: "absolute", left: "20px", top: "84px", height: "28px", padding: "0 10px", borderRadius: "9px", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(90, 52, 28, 0.14)", fontSize: "12px", fontWeight: "700", color: "#2B1B10", display: "flex", alignItems: "center", gap: "4px" }}>
          {"Teen Darwaza "}
          <span style={{ color: "#6F5B4B", fontWeight: "600" }}>
            · 5 min
          </span>
        </span>
        <span style={{ position: "absolute", right: "14px", top: "106px", height: "28px", padding: "0 10px", borderRadius: "9px", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(90, 52, 28, 0.14)", fontSize: "12px", fontWeight: "700", color: "#2B1B10", display: "flex", alignItems: "center", gap: "4px" }}>
          {"Manek Chowk "}
          <span style={{ color: "#6F5B4B", fontWeight: "600" }}>
            · 8 min
          </span>
        </span>
        <span style={{ position: "absolute", left: "116px", top: "208px", height: "28px", padding: "0 10px", borderRadius: "9px", background: "#FFFFFF", boxShadow: "0 4px 12px rgba(90, 52, 28, 0.14)", fontSize: "12px", fontWeight: "700", color: "#2B1B10", display: "flex", alignItems: "center", gap: "4px" }}>
          {"Dhal ni Pol "}
          <span style={{ color: "#6F5B4B", fontWeight: "600" }}>
            · 9 min
          </span>
        </span>
      </div>
      <div style={{ padding: "26px 24px 0" }}>
        <h1 style={{ margin: "0", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em", textWrap: "balance" }}>
          See the stories around you
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: "1.45", color: "#5A4434" }}>
          Allow location while you use Virasa so we can:
        </p>
      </div>
      <ul style={{ listStyle: "none", margin: "14px 0 0", padding: "0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: "600" }}>
          <span style={{ flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span>
            Show places within a short walk
          </span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: "600" }}>
          <span style={{ flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span>
            Start a story the moment you arrive
          </span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", fontWeight: "600" }}>
          <span style={{ flex: "0 0 28px", width: "28px", height: "28px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <span>
            Guide you there, turn by turn
          </span>
        </li>
      </ul>
      <div style={{ margin: "16px 24px 0", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", lineHeight: "1.4", color: "#6F5B4B" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 18px" }}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
        <span>
          Only while the app is open. Never sold or shared.
        </span>
      </div>
      <div style={{ position: "absolute", left: "24px", right: "24px", bottom: "30px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <GeoLink href="/home" style={{ height: "56px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.28)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>
            Allow while using the app
          </span>
        </GeoLink>
        <Link href="/city" style={{ height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "700", color: "#5A4434", textDecoration: "none" }}>
          Choose a city instead
        </Link>
      </div>
    </div>
  );
}
