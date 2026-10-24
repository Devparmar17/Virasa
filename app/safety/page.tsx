"use client";

// Safety & help — India's help numbers, one tap to call; hospitals, toilets,
// ATMs and more near the traveller (in Google Maps); and a way to send family
// a map link to where they are.
import { useState } from "react";
import { toast } from "@/components/Toast";
import { frame, ScreenHeader, Spinner } from "@/components/ui";
import { useT, type Key } from "@/lib/i18n";

const INK = "#2B1B10";
const MUTED = "#6F5B4B";

const Icon = ({ d, size = 20 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const PHONE = "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z";

// Help numbers that work across India.
const LINES: { n: string; key: string; fg: string; bg: string }[] = [
  { n: "108", key: "safety.108", fg: "#B03A2E", bg: "#FBE7E4" },
  { n: "1091", key: "safety.1091", fg: "#7A4E9A", bg: "#F1E8F6" },
  { n: "1363", key: "safety.1363", fg: "#2B7A85", bg: "#E1F2F3" },
  { n: "1098", key: "safety.1098", fg: "#3457C9", bg: "#EEF2FE" },
];

// What to look for nearby, and the words Maps searches for.
const NEARBY: { key: Key; q: string; icon: string }[] = [
  { key: "safety.hospital", q: "hospital", icon: "M12 6v12M6 12h12M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" },
  { key: "safety.pharmacy", q: "pharmacy", icon: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7ZM8.5 8.5l7 7" },
  { key: "safety.toilet", q: "public toilet", icon: "M7 21v-7H5V9a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v5H7M7 4a1 1 0 1 0 0 .01M17 21v-6h-2l2-8h0l2 8h-2M17 4a1 1 0 1 0 0 .01" },
  { key: "safety.atm", q: "ATM", icon: "M2 6h20v12H2zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM6 12h.01M18 12h.01" },
  { key: "safety.police", q: "police station", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { key: "safety.water", q: "drinking water", icon: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" },
];

const mapsNear = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${q} near me`)}`;

export default function SafetyScreen() {
  const t = useT();
  const [sharing, setSharing] = useState(false);

  const shareLocation = () => {
    if (!navigator.geolocation) return toast("This phone can't share its location from the browser.", "error");
    setSharing(true);
    navigator.geolocation.getCurrentPosition(
      async (p) => {
        const link = `https://maps.google.com/?q=${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`;
        const text = `I'm here: ${link}`;
        try {
          if (navigator.share) await navigator.share({ title: "My location", text });
          else {
            await navigator.clipboard.writeText(text);
            toast("Location link copied — paste it into a message", "success");
          }
        } catch (e) {
          if ((e as Error)?.name !== "AbortError") toast("Couldn't share right now", "error");
        }
        setSharing(false);
      },
      () => {
        setSharing(false);
        toast("Allow location in your browser to share where you are.", "error");
      },
      { timeout: 10000, maximumAge: 30000 }
    );
  };

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title={t("safety.title")} back="/home" />
      <div style={{ padding: "0 20px" }}>
        <p style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>{t("safety.sub")}</p>

        {/* 112 first and biggest: the one number to remember. */}
        <a href="tel:112" aria-label={`${t("safety.call")} 112, ${t("safety.112")}`} className="rise" style={{ minHeight: "92px", padding: "14px 16px", borderRadius: "22px", background: "#B03A2E", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", boxShadow: "0 12px 26px rgba(176, 58, 46, 0.3)" }}>
          <span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1 }}>112</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "18px", fontWeight: 800 }}>{t("safety.112")}</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "14px", color: "rgba(255, 255, 255, 0.9)" }}>{t("safety.112_sub")}</span>
          </span>
          <span style={{ flex: "0 0 52px", height: "52px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={PHONE} size={24} />
          </span>
        </a>

        <ul className="stagger" style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {LINES.map((l) => (
            <li key={l.n}>
              <a href={`tel:${l.n}`} aria-label={`${t("safety.call")} ${l.n}, ${t(l.key as Key)}`} style={{ minHeight: "70px", padding: "10px 12px 10px 14px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", color: INK, display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                <span style={{ flex: "0 0 64px", height: "44px", borderRadius: "12px", background: l.bg, color: l.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 800 }}>{l.n}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{t(l.key as Key)}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: MUTED }}>{t(`${l.key}_sub` as Key)}</span>
                </span>
                <span style={{ flex: "0 0 auto", height: "40px", padding: "0 12px", borderRadius: "999px", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 800 }}>
                  <Icon d={PHONE} size={15} />
                  {t("safety.call")}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <h2 style={{ margin: "26px 0 10px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#8A6424" }}>{t("safety.nearby")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
          {NEARBY.map((n) => (
            <a key={n.q} href={mapsNear(n.q)} target="_blank" rel="noopener noreferrer" style={{ minHeight: "60px", padding: "10px 12px", borderRadius: "16px", border: "1px solid #EFE6DA", background: "#FFFFFF", color: INK, display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", fontSize: "15px", fontWeight: 700 }}>
              <span style={{ flex: "0 0 36px", height: "36px", borderRadius: "11px", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={n.icon} size={19} />
              </span>
              {t(n.key)}
            </a>
          ))}
        </div>

        <button type="button" onClick={shareLocation} disabled={sharing} aria-busy={sharing} style={{ marginTop: "16px", width: "100%", minHeight: "66px", padding: "10px 14px", border: 0, borderRadius: "18px", background: INK, color: "#FBF6EE", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", cursor: "pointer" }}>
          <span style={{ flex: "0 0 44px", height: "44px", borderRadius: "14px", background: "rgba(251, 246, 238, 0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {sharing ? <Spinner /> : <Icon d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" size={22} />}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: "16px", fontWeight: 800 }}>{t("safety.share")}</span>
            <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: "#D9C6AE" }}>{t("safety.share_sub")}</span>
          </span>
        </button>

        <h2 style={{ margin: "26px 0 10px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#8A6424" }}>{t("safety.tips")}</h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {(["safety.tip1", "safety.tip2", "safety.tip3"] as Key[]).map((k) => (
            <li key={k} style={{ display: "flex", gap: "10px", fontSize: "15px", lineHeight: 1.5 }}>
              <span style={{ flex: "0 0 auto", marginTop: "2px", color: "#2F7A4A" }}>
                <Icon d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" size={18} />
              </span>
              {t(k)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
