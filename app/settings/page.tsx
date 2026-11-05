"use client";

// Settings — everything the Profile screen's rows lead to.
import { useEffect, useState } from "react";
import Link from "next/link";
import Sheet from "@/components/Sheet";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toast";
import { Card, Chevron, frame, rowStyle, ScreenHeader, SectionLabel, Segmented, SwitchRow } from "@/components/ui";
import { LANGS, resetStored, useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { logOut, useUser } from "@/lib/auth";
import { Avatar } from "@/components/User";
import { translate, useT, type Key } from "@/lib/i18n";
import { BUDGETS, DEFAULT_PROFILE, DIETS, PACES, type Profile } from "@/lib/profile";
import PartyChips from "@/components/PartyChips";

export default function SettingsScreen() {
  const router = useRouter();
  const t = useT();
  const [confirmReset, setConfirmReset] = useState(false);
  const [ai, setAi] = useState<{ gemini: boolean; claude: boolean; model: string | null } | null>(null);
  useEffect(() => {
    fetch("/api/ai-status", { method: "POST" })
      .then((r) => r.json())
      .then(setAi)
      .catch(() => setAi({ gemini: false, claude: false, model: null }));
  }, []);
  const [lang, setLang] = useStored("lang", "en");
  const [settings, setSettings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [sw, setSw] = useStored("switches", { auto: true, desc: false, steps: false });
  const [prefs, setPrefs] = useStored<Record<string, boolean>>("prefs", {});
  const set = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const alert = (k: keyof Settings["alerts"]) => set({ alerts: { ...settings.alerts, [k]: !settings.alerts[k] } });
  const voice = prefs.voice ?? true;
  const [user] = useUser();
  const [profile, setProfile] = useStored<Profile>("profile", DEFAULT_PROFILE);
  const setP = (patch: Partial<Profile>) => setProfile((p) => ({ ...DEFAULT_PROFILE, ...p, ...patch }));

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title={t("st.title")} back="/profile" />
      <div style={{ padding: "0 20px" }}>
        <SectionLabel id="account">{t("st.account")}</SectionLabel>
        <Card>
          {user ? (
            <>
              <div style={{ ...rowStyle(), cursor: "default", justifyContent: "flex-start" }}>
                <Avatar style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", display: "block" }} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "13px", fontWeight: 500, color: "#6F5B4B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email} · {user.provider === "google" ? "Google" : t("st.email")}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  logOut();
                  toast(t("lg.logged_out"));
                  router.push("/login");
                }}
                style={{ ...rowStyle(true), color: "#A23A2A" }}
              >
                {t("us.logout")}
              </button>
            </>
          ) : (
            <Link href="/login" style={rowStyle(true)}>
              <span>
                {t("us.join")}
                <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 500, color: "#6F5B4B" }}>{t("st.guest")}</span>
              </span>
              <Chevron />
            </Link>
          )}
        </Card>

        <SectionLabel id="ai">AI</SectionLabel>
        <Card>
          <div style={{ ...rowStyle(true), cursor: "default" }}>
            <span>
              {t("st.ai")}
              <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 500, color: "#6F5B4B" }}>
                {ai === null ? t("st.checking") : ai.gemini || ai.claude ? t("st.ai_on") : t("st.ai_lib")}
              </span>
            </span>
            <span style={{ flex: "0 0 auto", height: "26px", padding: "0 10px", borderRadius: "999px", background: ai?.gemini ? "#EEF2FE" : "#F6EEE4", color: ai?.gemini ? "#3457C9" : "#6E4E1E", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center" }}>
              {ai === null ? "…" : ai.gemini || ai.claude ? t("st.on") : t("st.library")}
            </span>
          </div>
        </Card>

        {/* Who's travelling: the AI Guide, trip planner and Discover all follow it. */}
        <SectionLabel id="traveller">{t("trip.who").toUpperCase()}</SectionLabel>
        <PartyChips />
        <Card style={{ marginTop: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("trip.budget")}</div>
            <Segmented label={t("trip.budget")} value={profile.budget} onChange={(budget) => setP({ budget })} options={BUDGETS.map(([id, sign]) => [id, `${sign} ${t(`pf.${id}` as Key)}`])} />
          </div>
          <div>
            <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("trip.pace")}</div>
            <Segmented label={t("trip.pace")} value={profile.pace} onChange={(pace) => setP({ pace })} options={PACES.map(([id]) => [id, t(`pf.${id}` as Key)])} />
          </div>
          <div>
            <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("trip.food")}</div>
            <Segmented label={t("trip.food")} value={profile.diet} onChange={(diet) => setP({ diet })} options={DIETS.map(([id]) => [id, t(`pf.${id}` as Key)])} />
          </div>
        </Card>
        <p style={{ margin: "8px 2px 0", fontSize: "12px", lineHeight: 1.45, color: "#6F5B4B" }}>{t("trip.who_hint")}</p>

        <SectionLabel id="language">{t("st.language")}</SectionLabel>
        <Card>
          <div role="radiogroup" aria-label={t("st.app_lang")}>
            {LANGS.map((l, i) => (
              <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} onClick={() => {
                  if (lang === l.id) return;
                  setLang(l.id);
                  toast(translate(l.id, "lang.changed", { name: l.native }), "success");
                }} style={rowStyle(i === LANGS.length - 1)}>
                <span lang={l.id}>
                  {l.native}
                  <span style={{ marginLeft: "8px", fontSize: "13px", fontWeight: 500, color: "#6F5B4B" }}>{l.label}</span>
                </span>
                <span aria-hidden="true" style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", border: lang === l.id ? "7px solid #9A4E36" : "2px solid #CDBFAE", background: "#FFFFFF", transition: "border 0.18s ease" }} />
              </button>
            ))}
          </div>
        </Card>
        <p style={{ margin: "8px 2px 0", fontSize: "12px", lineHeight: 1.45, color: "#6F5B4B" }}>{t("st.lang_note")}</p>

        <SectionLabel id="stories">{t("st.stories")}</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("st.story_length")}</div>
          <Segmented
            label={t("st.story_length")}
            value={settings.length}
            onChange={(length) => set({ length })}
            options={[
              ["quick", t("st.len.quick")],
              ["classic", t("st.len.classic")],
              ["deep", t("st.len.deep")],
            ]}
          />
        </Card>

        <SectionLabel id="travel">{t("st.travel")}</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("st.pace")}</div>
          <Segmented
            label={t("st.pace")}
            value={settings.pace}
            onChange={(pace) => set({ pace })}
            options={[
              ["relaxed", t("st.pace.relaxed")],
              ["steady", t("st.pace.steady")],
              ["brisk", t("st.pace.brisk")],
            ]}
          />
          <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: 1.45, color: "#6F5B4B" }}>{t("st.pace_note")}</p>
        </Card>
        <Card style={{ marginTop: "10px" }}>
          <SwitchRow label={t("st.voice")} hint={t("st.voice_hint")} on={voice} onToggle={() => setPrefs((p) => ({ ...p, voice: !voice }))} />
          <SwitchRow label={t("st.steps")} hint={t("st.steps_hint")} on={sw.steps} onToggle={() => setSw((s) => ({ ...s, steps: !s.steps }))} last />
        </Card>

        <SectionLabel id="access">{t("st.access")}</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>{t("st.text")}</div>
          <Segmented
            label={t("st.text")}
            value={settings.text}
            onChange={(text) => set({ text })}
            options={[
              ["default", t("st.size.default")],
              ["large", t("st.size.large")],
              ["xlarge", t("st.size.xlarge")],
            ]}
          />
          <p style={{ margin: "10px 0 0", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.45, color: "#2B1B10" }}>{t("st.text_sample")}</p>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#6F5B4B" }}>{t("st.text_note")}</p>
        </Card>
        <Card style={{ marginTop: "10px" }}>
          <SwitchRow label={t("st.desc")} hint={t("st.desc_hint")} on={sw.desc} onToggle={() => setSw((s) => ({ ...s, desc: !s.desc }))} last />
        </Card>

        <SectionLabel id="alerts">{t("st.alerts")}</SectionLabel>
        <Card>
          <SwitchRow label={t("st.nearby")} hint={t("st.nearby_hint")} on={settings.alerts.nearby} onToggle={() => alert("nearby")} />
          <SwitchRow label={t("st.trips")} hint={t("st.trips_hint")} on={settings.alerts.trips} onToggle={() => alert("trips")} />
          <SwitchRow label={t("st.digest")} hint={t("st.digest_hint")} on={settings.alerts.digest} onToggle={() => alert("digest")} />
          <Link href="/notifications" style={rowStyle(true)}>
            {t("st.see_notes")}
            <Chevron />
          </Link>
        </Card>

        <SectionLabel>{t("st.data")}</SectionLabel>
        <Card>
          <Link href="/personalize" style={rowStyle()}>
            {t("st.interests")}
            <Chevron />
          </Link>
          <Link href="/saved" style={rowStyle()}>
            {t("st.packs")}
            <Chevron />
          </Link>
          <Link href="/welcome" style={rowStyle()}>
            {t("st.replay")}
            <Chevron />
          </Link>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            style={{ ...rowStyle(true), color: "#A23A2A" }}
          >
            {t("st.reset")}
          </button>
        </Card>

        <SectionLabel>{t("st.about")}</SectionLabel>
        <Card>
          <Link href="/screens" style={rowStyle()}>
            {t("st.all_screens")}
            <Chevron />
          </Link>
          <Link href="/credits" style={rowStyle()}>
            {t("st.credits")}
            <Chevron />
          </Link>
          <div style={{ ...rowStyle(true), cursor: "default" }}>
            {t("st.version")}
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#6F5B4B" }}>0.1.0</span>
          </div>
        </Card>
      </div>
      {/* Reset can't be undone, so it asks first, in the app's own sheet rather than a browser dialog. */}
      <Sheet open={confirmReset} onClose={() => setConfirmReset(false)} title={t("st.reset_q")}>
        <p>{t("st.reset_body")}</p>
        <button
          type="button"
          className="sheet-cta"
          style={{ background: "#A23A2A" }}
          onClick={() => {
            setConfirmReset(false);
            resetStored();
            toast(t("st.reset_done"), "success");
            router.push("/");
          }}
        >
          {t("st.reset")}
        </button>
        <button type="button" className="sheet-row" onClick={() => setConfirmReset(false)} style={{ justifyContent: "center" }}>
          {t("st.keep")}
        </button>
      </Sheet>
    </div>
  );
}
