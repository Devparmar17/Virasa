// 01 · Splash
import Link from "next/link";
import AutoAdvance from "@/components/AutoAdvance";

export default function MainScreen() {
  return (
    <>
      <AutoAdvance to="/welcome" ms={2000} />
      <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FBF6EE", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
        <svg aria-hidden="true" width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: "0", opacity: "0.09" }}>
          <defs>
            <pattern id="jali" width="56" height="56" patternUnits="userSpaceOnUse">
              <rect x="14" y="14" width="28" height="28" fill="none" stroke="#9A4E36" strokeWidth="1.2" />
              <rect x="14" y="14" width="28" height="28" fill="none" stroke="#9A4E36" strokeWidth="1.2" transform="rotate(45 28 28)" />
              <circle cx="28" cy="28" r="5" fill="none" stroke="#9A4E36" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3" fill="#9A4E36" />
              <circle cx="56" cy="0" r="3" fill="#9A4E36" />
              <circle cx="0" cy="56" r="3" fill="#9A4E36" />
              <circle cx="56" cy="56" r="3" fill="#9A4E36" />
            </pattern>
          </defs>
          <rect width="390" height="844" fill="url(#jali)" />
        </svg>
        <Link href="/welcome" aria-label="Continue to Virasa" style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#2B1B10", paddingBottom: "40px" }}>
          <div className="splash-logo" style={{ width: "176px", height: "176px", borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 44px rgba(122, 74, 40, 0.18)", border: "1px solid #EADFD2" }}>
            <img src="/images/845c09135def6279c007582842533707.png" alt="" style={{ width: "104px", height: "112px", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ marginTop: "30px", fontSize: "46px", fontWeight: "800", letterSpacing: "-0.02em", lineHeight: "1" }}>
            Virasa
          </div>
          <div style={{ marginTop: "10px", fontSize: "14px", fontWeight: "700", letterSpacing: "0.32em", color: "#8A6424", paddingLeft: "0.32em" }}>
            HERITAGE AI
          </div>
          <div style={{ marginTop: "26px", fontSize: "17px", fontWeight: "500", color: "#5A4434" }}>
            Every street has a story.
          </div>
        </Link>
        <div style={{ position: "absolute", left: "0", right: "0", bottom: "58px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", pointerEvents: "none" }}>
          <div style={{ width: "120px", height: "4px", borderRadius: "999px", background: "#EADFD2", overflow: "hidden" }}>
            <div className="splash-bar" style={{ width: "100%", height: "100%", borderRadius: "999px", background: "#9A4E36" }} />
          </div>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B", letterSpacing: "0.02em" }}>
            Heritage stories from every corner of India
          </div>
        </div>
      </div>
    </>
  );
}
