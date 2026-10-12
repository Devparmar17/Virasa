"use client";

// 16 · Profile & passport
import Link from "next/link";
import MainNav from "@/components/MainNav";
import { Tap } from "@/components/Tap";
import { Avatar, UserName } from "@/components/User";
import { langOf, useStored } from "@/lib/store";
import { LENGTHS, PACES, TEXT_SIZES, DEFAULT_SETTINGS } from "@/lib/settings";
import { renderVals } from "./logic";

export default function ProfileScreen() {
  // The three switches are remembered on this phone.
  const [sw, setSw] = useStored("switches", { auto: true, desc: false, steps: false });
  const [lang] = useStored("lang", "en");
  const [settings] = useStored("settings", DEFAULT_SETTINGS);
  const [pack] = useStored("pack", true);
  const v: any = renderVals({ sw }, (patch: { sw: typeof sw }) => setSw(patch.sw));
  return (
    <div style={{ width: "390px", height: "1270px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 12px 0 20px", display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ flex: "0 0 72px", width: "72px", height: "72px", borderRadius: "50%", padding: "3px", background: "#8A6424" }}>
          <Avatar style={{ width: "66px", height: "66px", borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #FFFFFF" }} />
        </span>
        <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "3px" }}>
          <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.01em" }}>
            <UserName />
          </span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
            Heritage explorer · home city Ahmedabad
          </span>
        </span>
        <Link href="/notifications" aria-label="Notifications" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </Link>
        <Tap aria-label="Settings" href="/settings" style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Tap>
      </div>
      <section aria-label="Heritage passport" style={{ position: "relative", overflow: "hidden", margin: "20px 20px 0", padding: "18px", borderRadius: "20px", background: "#2B1B10", color: "#FBF6EE" }}>
        <svg aria-hidden="true" width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", right: "-30px", top: "-30px", opacity: "0.14" }}>
          <defs>
            <pattern id="pp" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="20" height="20" fill="none" stroke="#F3D9A8" strokeWidth="1.4" />
              <rect x="10" y="10" width="20" height="20" fill="none" stroke="#F3D9A8" strokeWidth="1.4" transform="rotate(45 20 20)" />
            </pattern>
          </defs>
          <rect width="160" height="160" fill="url(#pp)" />
        </svg>
        <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#E7B98A" }}>
          HERITAGE PASSPORT
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "20px", fontWeight: "800" }}>
          {"3 of 36 states & UTs"}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "13px", color: "#D9C6AE" }}>
          14 stamps across 5 cities
        </p>
        <ul style={{ listStyle: "none", margin: "16px 0 0", padding: "0", display: "flex", gap: "10px" }}>
          <li style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#8A6424", border: "2px dashed #F3D9A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#FFFFFF" }}>
              GJ
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#D9C6AE" }}>
              6
            </span>
          </li>
          <li style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#9A4E36", border: "2px dashed #F3D9A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#FFFFFF" }}>
              RJ
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#D9C6AE" }}>
              5
            </span>
          </li>
          <li style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#5A4434", border: "2px dashed #F3D9A8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "#FFFFFF" }}>
              DL
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#D9C6AE" }}>
              3
            </span>
          </li>
          <li style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "50px", height: "50px", borderRadius: "50%", border: "2px dashed rgba(251, 246, 238, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(251, 246, 238, 0.7)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#D9C6AE" }}>
              Next
            </span>
          </li>
        </ul>
        <div style={{ marginTop: "14px", height: "6px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.16)", overflow: "hidden" }}>
          <div style={{ width: "8.3%", height: "100%", borderRadius: "999px", background: "#F3D9A8" }} />
        </div>
        <Tap href="/passport" style={{ marginTop: "14px", height: "44px", padding: "0 14px", border: "0", borderRadius: "12px", background: "#F3D9A8", color: "#2B1B10", fontSize: "14px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          {" Open passport "}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Tap>
      </section>
      <section style={{ margin: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
            YOUR INTERESTS
          </h2>
          <Link href="/personalize" style={{ height: "36px", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "700", color: "#9A4E36" }}>
            Edit
          </Link>
        </div>
        <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
          <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Architecture
          </span>
          <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Street food
          </span>
          <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "13px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Legends
          </span>
        </div>
      </section>
      <section style={{ margin: "24px 20px 0" }}>
        <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          STORIES
        </h2>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: "0", border: "1px solid #EADFD2", borderRadius: "16px", overflow: "hidden" }}>
          <li style={{ borderBottom: "1px solid #F0E8DD" }}>
            <Link href="/settings#language" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Language
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              {`${langOf(lang).label} + local`}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
          <li style={{ borderBottom: "1px solid #F0E8DD" }}>
            <Link href="/settings#stories" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Story length
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              {LENGTHS[settings.length]}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
          <li style={{ minHeight: "56px", padding: "0 10px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Play story on arrival
            </span>
            <button type="button" role="switch" aria-checked={v.sw.auto} aria-label="Play story on arrival" onClick={v.tog.auto} style={{ width: "56px", height: "44px", border: "0", background: "none", padding: "0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ width: "50px", height: "30px", borderRadius: "999px", background: v.swS.auto.track, display: "flex", alignItems: "center", justifyContent: v.swS.auto.pos, padding: "3px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)" }} />
              </span>
            </button>
          </li>
        </ul>
      </section>
      <section style={{ margin: "24px 20px 0" }}>
        <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          TRAVEL
        </h2>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: "0", border: "1px solid #EADFD2", borderRadius: "16px", overflow: "hidden" }}>
          <li style={{ borderBottom: "1px solid #F0E8DD" }}>
            <Link href="/saved" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Offline city packs
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              {pack ? "1 city · 86 MB" : "None yet"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
          <li style={{ borderBottom: "1px solid #F0E8DD" }}>
            <Link href="/city" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Upcoming trips
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              Jaipur
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
          <li style={{  }}>
            <Link href="/settings#travel" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Walking pace
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              {PACES[settings.pace]}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
        </ul>
      </section>
      <section style={{ margin: "24px 20px 0" }}>
        <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
          ACCESSIBILITY
        </h2>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: "0", border: "1px solid #EADFD2", borderRadius: "16px", overflow: "hidden" }}>
          <li style={{ borderBottom: "1px solid #F0E8DD" }}>
            <Link href="/settings#access" style={{ minHeight: "56px", padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "#2B1B10", textDecoration: "none" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Text size
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px", color: "#6F5B4B" }}>
              {TEXT_SIZES[settings.text]}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>
          </Link>
          </li>
          <li style={{ minHeight: "56px", padding: "0 10px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F0E8DD" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Audio descriptions
            </span>
            <button type="button" role="switch" aria-checked={v.sw.desc} aria-label="Audio descriptions" onClick={v.tog.desc} style={{ width: "56px", height: "44px", border: "0", background: "none", padding: "0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ width: "50px", height: "30px", borderRadius: "999px", background: v.swS.desc.track, display: "flex", alignItems: "center", justifyContent: v.swS.desc.pos, padding: "3px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)" }} />
              </span>
            </button>
          </li>
          <li style={{ minHeight: "56px", padding: "0 10px 0 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Step-free routes
            </span>
            <button type="button" role="switch" aria-checked={v.sw.steps} aria-label="Step-free routes" onClick={v.tog.steps} style={{ width: "56px", height: "44px", border: "0", background: "none", padding: "0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ width: "50px", height: "30px", borderRadius: "999px", background: v.swS.steps.track, display: "flex", alignItems: "center", justifyContent: v.swS.steps.pos, padding: "3px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)" }} />
              </span>
            </button>
          </li>
        </ul>
      </section>
      <MainNav active="profile" />
    </div>
  );
}
