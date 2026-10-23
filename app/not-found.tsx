import Link from "next/link";
import { frame } from "@/components/ui";

export const metadata = { title: "Off the map — Virasa" };

// Shown for any address that isn't a screen.
export default function NotFound() {
  return (
    <div style={frame({ height: "844px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", textAlign: "center" })}>
      <span className="float" aria-hidden="true" style={{ width: "112px", height: "112px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #EFE6DA", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 44px rgba(122, 74, 40, 0.14)" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </span>
      <h1 style={{ margin: "28px 0 0", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>This lane isn&apos;t on the map</h1>
      <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>The page you were looking for doesn&apos;t exist, or has moved. Let&apos;s get you back to somewhere with a story.</p>
      <Link href="/home" style={{ marginTop: "26px", alignSelf: "stretch", height: "56px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800 }}>
        Back to Home
      </Link>
      <Link href="/explore" style={{ marginTop: "6px", height: "48px", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: 700, color: "#5A4434" }}>
        Open the map
      </Link>
    </div>
  );
}
