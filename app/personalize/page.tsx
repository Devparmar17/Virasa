"use client";

// 03 · Personalise
import Link from "next/link";
import BackLink from "@/components/Back";
import { useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { renderVals } from "./logic";
import { DEFAULT_PROFILE, PARTIES, type Profile } from "@/lib/profile";
import { useT, type Key } from "@/lib/i18n";

export default function PersonalizeScreen() {
  // Choices are remembered, and length and language are the same ones Settings edits.
  const [interests, setInterests] = useStored<Record<string, boolean> | null>("interests", null);
  const [settings, setSettings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [lang, setLang] = useStored("lang", "en");
  // The story-language row has three choices; "Local" stands for any regional language (Settings offers five).
  const local = lang !== "en" && lang !== "hi";
  const state = { sel: interests || undefined, len: settings.length, lang: local ? "gu" : lang };
  const setState = (patch: Record<string, any>) => {
    if (patch.sel) setInterests(patch.sel);
    if (patch.len) setSettings((s) => ({ ...s, length: patch.len }));
    // Picking "Local" keeps a regional language already chosen in Settings (Tamil, Bengali…).
    if (patch.lang && !(patch.lang === "gu" && local)) setLang(patch.lang);
  };
  const v: any = renderVals(state, setState);
  const t = useT();
  const [profile, setProfile] = useStored<Profile>("profile", DEFAULT_PROFILE);
  return (
    <div style={{ width: "390px", minHeight: "844px", paddingBottom: "120px", position: "relative", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'Noto Sans Tamil', 'Noto Sans Bengali', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ padding: "54px 12px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BackLink href="/login" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <span style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#E2D3C1", overflow: "hidden", display: "block" }}>
              <span className="step-fill" style={{ display: "block", width: "100%", height: "100%", borderRadius: "999px", background: "#9A4E36" }} />
            </span>
            <span style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#E2D3C1" }} />
          </div>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
            Step 1 of 2
          </span>
        </div>
        <Link href="/location" style={{ height: "44px", padding: "0 10px", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: "700", color: "#5A4434" }}>
          Skip
        </Link>
      </div>
      <div style={{ padding: "18px 20px 0" }}>
        <h1 style={{ margin: "0", fontSize: "26px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em", textWrap: "balance" }}>
          What pulls you into a place?
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: "1.45", color: "#5A4434" }}>
          Pick a few. Your feed, walks and stories will follow them — change anytime.
        </p>
      </div>
      <fieldset style={{ border: "0", margin: "20px 0 0", padding: "0 20px", minWidth: "0" }}>
        <legend style={{ padding: "0", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em", color: "#2B1B10" }}>
          {t("trip.who")}
        </legend>
        <div role="radiogroup" aria-label={t("trip.who")} style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {PARTIES.map((p) => {
            const on = profile.party === p.id;
            return (
              <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => setProfile((x) => ({ ...DEFAULT_PROFILE, ...x, party: p.id }))} style={{ height: "48px", padding: "0 14px 0 10px", borderRadius: "999px", border: `1.5px solid ${on ? "#9A4E36" : "#E2D3C1"}`, background: on ? "#FBEDE6" : "#FFFFFF", color: on ? "#7E3D29" : "#2B1B10", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "background-color 0.18s ease, border-color 0.18s ease" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={p.icon} />
                </svg>
                {t(`who.${p.id}` as Key)}
              </button>
            );
          })}
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: "1.4", color: "#6F5B4B" }}>{t("trip.who_hint")}</p>
      </fieldset>
      <fieldset style={{ border: "0", margin: "22px 0 0", padding: "0 20px", minWidth: "0" }}>
        <legend style={{ padding: "0", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em", color: "#2B1B10" }}>
          <span>
            Interests
          </span>
          <span style={{ letterSpacing: "0", fontWeight: "600", color: "#6F5B4B" }}>
            {v.count}{" selected"}
          </span>
        </legend>
        <div className="stagger" style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
          <button type="button" onClick={v.tog.arch} aria-pressed={v.on.arch} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.arch.bd}`, background: v.s.arch.bg, color: v.s.arch.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" x2="21" y1="22" y2="22" />
              <line x1="6" x2="6" y1="18" y2="11" />
              <line x1="10" x2="10" y1="18" y2="11" />
              <line x1="14" x2="14" y1="18" y2="11" />
              <line x1="18" x2="18" y1="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
            <span style={{ flex: "1" }}>
              Architecture
            </span>
            {v.on.arch ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.well} aria-pressed={v.on.well} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.well.bd}`, background: v.s.well.bg, color: v.s.well.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h18" />
              <path d="M5 8h14" />
              <path d="M7 12h10" />
              <path d="M9 16h6" />
              <path d="M11 20h2" />
            </svg>
            <span style={{ flex: "1" }}>
              Stepwells
            </span>
            {v.on.well ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.food} aria-pressed={v.on.food} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.food.bd}`, background: v.s.food.bg, color: v.s.food.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
            <span style={{ flex: "1" }}>
              Street food
            </span>
            {v.on.food ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.craft} aria-pressed={v.on.craft} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.craft.bd}`, background: v.s.craft.bg, color: v.s.craft.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="6" cy="6" r="3" />
              <path d="M8.12 8.12 12 12" />
              <path d="M20 4 8.12 15.88" />
              <circle cx="6" cy="18" r="3" />
              <path d="M14.8 14.8 20 20" />
            </svg>
            <span style={{ flex: "1" }}>
              {"Crafts & textiles"}
            </span>
            {v.on.craft ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.legend} aria-pressed={v.on.legend} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.legend.bd}`, background: v.s.legend.bg, color: v.s.legend.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span style={{ flex: "1" }}>
              Legends
            </span>
            {v.on.legend ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.spirit} aria-pressed={v.on.spirit} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.spirit.bd}`, background: v.s.spirit.bg, color: v.s.spirit.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span style={{ flex: "1" }}>
              Spiritual places
            </span>
            {v.on.spirit ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.fest} aria-pressed={v.on.fest} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.fest.bd}`, background: v.s.fest.bg, color: v.s.fest.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
              <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
            </svg>
            <span style={{ flex: "1" }}>
              Festivals
            </span>
            {v.on.fest ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
          <button type="button" onClick={v.tog.photo} aria-pressed={v.on.photo} style={{ height: "52px", padding: "0 12px", borderRadius: "16px", border: `1.5px solid ${v.s.photo.bd}`, background: v.s.photo.bg, color: v.s.photo.fg, display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", textAlign: "left" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <span style={{ flex: "1" }}>
              Photo spots
            </span>
            {v.on.photo ? (
              <>
                <svg className="pop-in" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : null}
          </button>
        </div>
      </fieldset>
      <fieldset style={{ border: "0", margin: "22px 0 0", padding: "0 20px", minWidth: "0" }}>
        <legend style={{ padding: "0", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em", color: "#2B1B10" }}>
          Story length
        </legend>
        <div role="group" style={{ marginTop: "10px", padding: "4px", borderRadius: "16px", background: "#F1E7DA", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
          <button type="button" onClick={v.setLen.quick} aria-pressed={v.lenOn.quick} style={{ height: "52px", borderRadius: "12px", border: `1.5px solid ${v.lenS.quick.bd}`, background: v.lenS.quick.bg, boxShadow: v.lenS.quick.sh, color: v.lenS.quick.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: "pointer" }}>
            <span style={{ fontSize: "14px", fontWeight: "700" }}>
              Quick
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: v.lenS.quick.sub }}>
              1 min
            </span>
          </button>
          <button type="button" onClick={v.setLen.classic} aria-pressed={v.lenOn.classic} style={{ height: "52px", borderRadius: "12px", border: `1.5px solid ${v.lenS.classic.bd}`, background: v.lenS.classic.bg, boxShadow: v.lenS.classic.sh, color: v.lenS.classic.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: "pointer" }}>
            <span style={{ fontSize: "14px", fontWeight: "700" }}>
              Classic
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: v.lenS.classic.sub }}>
              3 min
            </span>
          </button>
          <button type="button" onClick={v.setLen.deep} aria-pressed={v.lenOn.deep} style={{ height: "52px", borderRadius: "12px", border: `1.5px solid ${v.lenS.deep.bd}`, background: v.lenS.deep.bg, boxShadow: v.lenS.deep.sh, color: v.lenS.deep.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: "pointer" }}>
            <span style={{ fontSize: "14px", fontWeight: "700" }}>
              Deep dive
            </span>
            <span style={{ fontSize: "12px", fontWeight: "600", color: v.lenS.deep.sub }}>
              10 min
            </span>
          </button>
        </div>
      </fieldset>
      <fieldset style={{ border: "0", margin: "22px 0 0", padding: "0 20px", minWidth: "0" }}>
        <legend style={{ padding: "0", fontSize: "15px", fontWeight: "800", letterSpacing: "-0.01em", color: "#2B1B10" }}>
          Story language
        </legend>
        <div role="group" style={{ marginTop: "10px", padding: "4px", borderRadius: "16px", background: "#F1E7DA", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
          <button type="button" lang="en" onClick={v.setLang.en} aria-pressed={v.langOn.en} style={{ height: "44px", borderRadius: "12px", border: `1.5px solid ${v.langS.en.bd}`, background: v.langS.en.bg, boxShadow: v.langS.en.sh, color: v.langS.en.fg, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            English
          </button>
          <button type="button" lang="hi" onClick={v.setLang.hi} aria-pressed={v.langOn.hi} style={{ height: "44px", borderRadius: "12px", border: `1.5px solid ${v.langS.hi.bd}`, background: v.langS.hi.bg, boxShadow: v.langS.hi.sh, color: v.langS.hi.fg, fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
            हिन्दी
          </button>
          <button type="button" onClick={v.setLang.gu} aria-pressed={v.langOn.gu} style={{ height: "44px", borderRadius: "12px", border: `1.5px solid ${v.langS.gu.bd}`, background: v.langS.gu.bg, boxShadow: v.langS.gu.sh, color: v.langS.gu.fg, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Local
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: "1.4", color: "#6F5B4B" }}>
          {"Local follows the state you're in — ગુજરાતી in Gujarat, தமிழ் in Tamil Nadu, বাংলা in West Bengal."}
        </p>
      </fieldset>
      <div className="nav-rail">
        <div style={{ padding: "28px 20px 24px", background: "linear-gradient(180deg, rgba(251, 246, 238, 0) 0%, #FBF6EE 34%)" }}>
        <Link href="/location" style={{ height: "56px", borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.28)" }}>
          <span>
            {v.cta}
          </span>
          {v.count ? (
            <span key={v.count} className="pop-in" style={{ minWidth: "26px", height: "26px", padding: "0 8px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800 }}>
              {v.count}
            </span>
          ) : null}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        </div>
      </div>
    </div>
  );
}
