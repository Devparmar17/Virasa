"use client";

// Settings — everything the Profile screen's rows lead to.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/Toast";
import { Card, Chevron, frame, rowStyle, ScreenHeader, SectionLabel, Segmented, SwitchRow } from "@/components/ui";
import { LANGS, resetStored, useStored } from "@/lib/store";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";
import { logOut, useUser } from "@/lib/auth";
import { Avatar } from "@/components/User";

export default function SettingsScreen() {
  const router = useRouter();
  const [lang, setLang] = useStored("lang", "en");
  const [settings, setSettings] = useStored<Settings>("settings", DEFAULT_SETTINGS);
  const [sw, setSw] = useStored("switches", { auto: true, desc: false, steps: false });
  const [prefs, setPrefs] = useStored<Record<string, boolean>>("prefs", {});
  const set = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  const alert = (k: keyof Settings["alerts"]) => set({ alerts: { ...settings.alerts, [k]: !settings.alerts[k] } });
  const voice = prefs.voice ?? true;
  const [user] = useUser();

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <ScreenHeader title="Settings" back="/profile" />
      <div style={{ padding: "0 20px" }}>
        <SectionLabel id="account">ACCOUNT</SectionLabel>
        <Card>
          {user ? (
            <>
              <div style={{ ...rowStyle(), cursor: "default", justifyContent: "flex-start" }}>
                <Avatar style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", display: "block" }} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "13px", fontWeight: 500, color: "#6F5B4B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email} · {user.provider === "google" ? "Google" : "Email"}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  logOut();
                  toast("You're logged out");
                  router.push("/login");
                }}
                style={{ ...rowStyle(true), color: "#A23A2A" }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" style={rowStyle(true)}>
              <span>
                Log in or sign up
                <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 500, color: "#6F5B4B" }}>You&apos;re exploring as a guest</span>
              </span>
              <Chevron />
            </Link>
          )}
        </Card>

        <SectionLabel id="language">LANGUAGE</SectionLabel>
        <Card>
          <div role="radiogroup" aria-label="App language">
            {LANGS.map((l, i) => (
              <button key={l.id} type="button" role="radio" aria-checked={lang === l.id} onClick={() => setLang(l.id)} style={rowStyle(i === LANGS.length - 1)}>
                <span lang={l.id}>
                  {l.native}
                  <span style={{ marginLeft: "8px", fontSize: "13px", fontWeight: 500, color: "#6F5B4B" }}>{l.label}</span>
                </span>
                <span aria-hidden="true" style={{ flex: "0 0 22px", width: "22px", height: "22px", borderRadius: "50%", border: lang === l.id ? "7px solid #9A4E36" : "2px solid #CDBFAE", background: "#FFFFFF", transition: "border 0.18s ease" }} />
              </button>
            ))}
          </div>
        </Card>
        <p style={{ margin: "8px 2px 0", fontSize: "12px", lineHeight: 1.45, color: "#6F5B4B" }}>The AI Guide answers in this language. Story transcripts come in English, Hindi and Gujarati.</p>

        <SectionLabel id="stories">STORIES</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>Story length</div>
          <Segmented
            label="Story length"
            value={settings.length}
            onChange={(length) => set({ length })}
            options={[
              ["quick", "Quick · 1 min"],
              ["classic", "Classic · 3 min"],
              ["deep", "Deep · 10 min"],
            ]}
          />
        </Card>
        <Card style={{ marginTop: "10px" }}>
          <SwitchRow label="Play story on arrival" hint="Start the narration when you reach a place" on={sw.auto} onToggle={() => setSw((s) => ({ ...s, auto: !s.auto }))} last />
        </Card>

        <SectionLabel id="travel">TRAVEL</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>Walking pace</div>
          <Segmented
            label="Walking pace"
            value={settings.pace}
            onChange={(pace) => set({ pace })}
            options={[
              ["relaxed", "Relaxed"],
              ["steady", "Steady"],
              ["brisk", "Brisk"],
            ]}
          />
          <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: 1.45, color: "#6F5B4B" }}>Walk times in your plans are worked out at this pace.</p>
        </Card>
        <Card style={{ marginTop: "10px" }}>
          <SwitchRow label="Voice guidance" hint="Spoken turn-by-turn directions" on={voice} onToggle={() => setPrefs((p) => ({ ...p, voice: !voice }))} />
          <SwitchRow label="Step-free routes" hint="Avoid stairs and stepped lanes" on={sw.steps} onToggle={() => setSw((s) => ({ ...s, steps: !s.steps }))} last />
        </Card>

        <SectionLabel id="access">ACCESSIBILITY</SectionLabel>
        <Card style={{ padding: "14px" }}>
          <div style={{ marginBottom: "8px", fontSize: "15px", fontWeight: 600 }}>Text size</div>
          <Segmented
            label="Text size"
            value={settings.text}
            onChange={(text) => set({ text })}
            options={[
              ["default", "Default"],
              ["large", "Large"],
              ["xlarge", "Extra large"],
            ]}
          />
          <p style={{ margin: "10px 0 0", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.45, color: "#2B1B10" }}>See how the branches curl like palm fronds, rising from one trunk.</p>
          <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#6F5B4B" }}>Applies to story transcripts and AI Guide answers.</p>
        </Card>
        <Card style={{ marginTop: "10px" }}>
          <SwitchRow label="Audio descriptions" hint="Describe what is in front of you at each stop" on={sw.desc} onToggle={() => setSw((s) => ({ ...s, desc: !s.desc }))} last />
        </Card>

        <SectionLabel id="alerts">NOTIFICATIONS</SectionLabel>
        <Card>
          <SwitchRow label="Stories nearby" hint="When you walk past a place with a story" on={settings.alerts.nearby} onToggle={() => alert("nearby")} />
          <SwitchRow label="Trip reminders" hint="Packs to download before you travel" on={settings.alerts.trips} onToggle={() => alert("trips")} />
          <SwitchRow label="Weekly digest" hint="New stories and games, once a week" on={settings.alerts.digest} onToggle={() => alert("digest")} />
          <Link href="/notifications" style={rowStyle(true)}>
            See your notifications
            <Chevron />
          </Link>
        </Card>

        <SectionLabel>YOUR DATA</SectionLabel>
        <Card>
          <Link href="/personalize" style={rowStyle()}>
            Edit interests
            <Chevron />
          </Link>
          <Link href="/saved" style={rowStyle()}>
            Offline city packs
            <Chevron />
          </Link>
          <Link href="/welcome" style={rowStyle()}>
            Replay the welcome tour
            <Chevron />
          </Link>
          <button
            type="button"
            onClick={() => {
              if (!window.confirm("Reset Virasa on this phone? Saved places, downloads and settings will be cleared.")) return;
              resetStored();
              toast("Virasa has been reset");
              router.push("/");
            }}
            style={{ ...rowStyle(true), color: "#A23A2A" }}
          >
            Reset app data
          </button>
        </Card>

        <SectionLabel>ABOUT</SectionLabel>
        <Card>
          <Link href="/screens" style={rowStyle()}>
            All screens
            <Chevron />
          </Link>
          <Link href="/credits" style={rowStyle()}>
            Photo credits
            <Chevron />
          </Link>
          <div style={{ ...rowStyle(true), cursor: "default" }}>
            Version
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#6F5B4B" }}>0.1.0</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
