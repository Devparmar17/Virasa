// 13 · Walking navigation
import Link from "next/link";
import { DestName, EtaLine, EtaMins, StoryPreview, VoiceButton } from "./parts";

export default function NavigateScreen() {
  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FAF5EC", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <svg role="img" aria-label="Walking route: turn left onto Relief Road, then continue to Sidi Saiyyed Mosque" width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: "0", display: "block" }}>
        <rect width="390" height="844" fill="#FAF5EC" />
        <g fill="#EFE5D4">
          <rect x="-10" y="-10" width="60" height="160" rx="6" />
          <rect x="70" y="-10" width="116" height="160" rx="6" />
          <rect x="206" y="-10" width="84" height="160" rx="6" />
          <rect x="310" y="-10" width="90" height="160" rx="6" />
          <rect x="-10" y="170" width="60" height="80" rx="6" />
          <rect x="70" y="170" width="116" height="80" rx="6" />
          <rect x="206" y="170" width="84" height="80" rx="6" />
          <rect x="310" y="170" width="90" height="80" rx="6" />
          <rect x="-10" y="270" width="60" height="148" rx="6" />
          <rect x="70" y="270" width="116" height="148" rx="6" />
          <rect x="310" y="270" width="90" height="148" rx="6" />
          <rect x="-10" y="442" width="60" height="108" rx="6" />
          <rect x="70" y="442" width="116" height="108" rx="6" />
          <rect x="206" y="442" width="84" height="108" rx="6" />
          <rect x="310" y="442" width="90" height="108" rx="6" />
          <rect x="-10" y="570" width="60" height="120" rx="6" />
          <rect x="70" y="570" width="116" height="120" rx="6" />
          <rect x="206" y="570" width="84" height="120" rx="6" />
          <rect x="310" y="570" width="90" height="120" rx="6" />
          <rect x="-10" y="710" width="60" height="140" rx="6" />
          <rect x="70" y="710" width="116" height="140" rx="6" />
          <rect x="206" y="710" width="84" height="140" rx="6" />
          <rect x="310" y="710" width="90" height="140" rx="6" />
        </g>
        <rect x="206" y="270" width="84" height="148" rx="6" fill="#DCE6CB" />
        <g stroke="#E4D6C1" strokeWidth="24" fill="none">
          <path d="M0 430 H390" />
          <path d="M196 0 V844" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="20" fill="none">
          <path d="M0 430 H390" />
          <path d="M196 0 V844" />
        </g>
        <text x="300" y="434" fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#8A7560">
          RELIEF RD
        </text>
        <path d="M196 700 V552" fill="none" stroke="#B9A894" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 10" />
        <path d="M196 540 V430 H120 L110 262" fill="none" stroke="#FFFFFF" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M196 540 V430 H120 L110 262" fill="none" stroke="#9A4E36" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="150" cy="430" r="15" fill="#8A6424" stroke="#FFFFFF" strokeWidth="3" />
        <g transform="translate(143 423) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
        </g>
        <g transform="translate(110 262) scale(1.3)">
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#7E3D29" stroke="#FFFFFF" strokeWidth="2.2" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <circle cx="196" cy="540" r="30" fill="#2F6FB0" opacity="0.15" />
        <circle cx="196" cy="540" r="17" fill="#2F6FB0" stroke="#FFFFFF" strokeWidth="3" />
        <polygon points="196 530 203 547 196 543 189 547" fill="#FFFFFF" />
      </svg>
      <span style={{ position: "absolute", left: "132px", top: "202px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "#2B1B10", color: "#FFFFFF", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
        <DestName />
      </span>
      <span style={{ position: "absolute", left: "96px", top: "452px", height: "24px", padding: "0 8px", borderRadius: "999px", background: "#FFFFFF", color: "#6E4E1E", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", boxShadow: "0 3px 10px rgba(90, 60, 30, 0.16)" }}>
        Teen Darwaza
      </span>
      <section aria-label="Next instruction" style={{ position: "absolute", top: "50px", left: "12px", right: "12px", borderRadius: "22px", background: "#2B1B10", color: "#FBF6EE", padding: "16px", boxShadow: "0 12px 28px rgba(43, 27, 16, 0.3)" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <span style={{ flex: "0 0 60px", width: "60px", height: "60px", borderRadius: "16px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 14 4 9 9 4" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
          </span>
          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "30px", lineHeight: "1", fontWeight: "800", letterSpacing: "-0.02em" }}>
              120 m
            </span>
            <span style={{ fontSize: "16px", fontWeight: "600" }}>
              Turn left onto Relief Road
            </span>
          </span>
          <VoiceButton style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "rgba(251, 246, 238, 0.12)", color: "#FBF6EE", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} />
        </div>
        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(251, 246, 238, 0.14)", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#D9C6AE" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="14" height="20" x="5" y="2" rx="2" />
            <path d="M12 18h.01" />
          </svg>
          {" Phone in your pocket? We'll vibrate before each turn. "}
        </div>
      </section>
      <Link href="/ar" aria-label="Switch to AR view" style={{ position: "absolute", right: "16px", top: "516px", height: "44px", padding: "0 14px 0 10px", borderRadius: "999px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "800", textDecoration: "none", boxShadow: "0 8px 18px rgba(43, 27, 16, 0.3)" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
          <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
        </svg>
        <span>
          AR view
        </span>
      </Link>
      <section aria-label="Story on your way" style={{ position: "absolute", left: "12px", right: "12px", top: "588px", borderRadius: "18px", background: "#FFFFFF", boxShadow: "0 10px 26px rgba(90, 60, 30, 0.18)", padding: "10px 10px 10px 14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid #EADFD2" }}>
        <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: "#F5E6CC", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
        </span>
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em", color: "#8A6424" }}>
            ON YOUR WAY · 2 MIN AHEAD
          </span>
          <span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.3" }}>
            Teen Darwaza and the 600-year lamp
          </span>
        </span>
        <StoryPreview style={{ flex: "0 0 auto", height: "44px", padding: "0 12px 0 10px", border: "0", borderRadius: "12px", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }} />
      </section>
      <section aria-label="Trip progress" style={{ position: "absolute", left: "0", right: "0", bottom: "0", background: "#FFFFFF", borderRadius: "24px 24px 0 0", boxShadow: "0 -10px 30px rgba(90, 60, 30, 0.14)", padding: "16px 20px 30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "26px", lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em", color: "#2F7A4A" }}>
              <EtaMins />
            </span>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
              <EtaLine />
            </span>
          </div>
          <Link href="/place" style={{ height: "44px", padding: "0 18px", borderRadius: "12px", border: "1.5px solid #E2D3C1", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
            End
          </Link>
        </div>
        <Link href="/arrived" style={{ marginTop: "12px", padding: "10px", borderRadius: "14px", background: "#FBF6EE", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#2B1B10" }}>
          <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "10px", objectFit: "cover", display: "block" }} />
          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
              Walking to
            </span>
            <span style={{ fontSize: "15px", fontWeight: "800" }}>
              <DestName />
            </span>
          </span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
