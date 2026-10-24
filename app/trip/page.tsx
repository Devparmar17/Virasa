"use client";

// AI Trip Planner — three short steps (where and how long, who's going, what
// they love), then Gemini plans each day around them: stops with why they suit
// this traveller, local food, hidden gems and tips. A plan can be heard aloud,
// saved, shared, and any stop explained by the AI Guide.
//
// /trip            the planner (with the last plan one tap away)
// /trip?view=last  the plan just made (Back from the guide returns here)
// /trip?id=…       a plan saved to Saved › Plans
// /trip?city=…     the planner with the city filled in
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import VoiceSearch from "@/components/VoiceSearch";
import { toast } from "@/components/Toast";
import { pop, share, useAsk } from "@/components/Tap";
import { Card, frame, Segmented, SwitchRow } from "@/components/ui";
import { speechLocale, travellerProfile, useStored } from "@/lib/store";
import { tr, useT, type Key } from "@/lib/i18n";
import { BUDGETS, DEFAULT_PROFILE, DIETS, PACES, PARTIES, type Profile } from "@/lib/profile";
import { cityImage, POPULAR_CITIES, TRIP_INTERESTS, tripId, type SavedTrip, type Trip, type TripStop } from "@/lib/trip";
import { lookOf } from "@/lib/kinds";
import { mapsUrl } from "@/lib/discover";

const INK = "#2B1B10";
const MUTED = "#6F5B4B";
const BRAND = "#9A4E36";

type Form = { city: string; days: number; interests: string[]; notes: string };
const DEFAULT_FORM: Form = { city: "", days: 2, interests: ["heritage", "food", "hidden"], notes: "" };
type Phase = "form" | "wait" | "error";

const noop = () => () => {};

const Icon = ({ d, size = 20, width = 2 }: { d: string; size?: number; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Spark = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
  </svg>
);
const ICON = {
  back: "m12 19-7-7 7-7M19 12H5",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  arrow: "M5 12h14m-7-7 7 7-7 7",
  tick: "M20 6 9 17l-5-5",
  bookmark: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",
  speaker: "M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14",
  stop: "M6 6h12v12H6z",
  bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z",
  sun: "M12 3v2M12 19v2M5.6 5.6 7 7M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  bus: "M8 6v6M16 6v6M2 12h20M7 18h.01M17 18h.01M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12M4 18h16M6 18v2M18 18v2",
  wallet: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
  map: "M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3ZM9 3v15M15 6v15",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  check: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  compass: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
};

const roundBtn: CSSProperties = { width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", color: INK, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };
const kicker: CSSProperties = { margin: "26px 0 10px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#8A6424" };
const h1: CSSProperties = { margin: 0, fontSize: "27px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" };
const hint: CSSProperties = { margin: "8px 0 0", fontSize: "15px", lineHeight: 1.45, color: "#5A4434" };
const pill = (on: boolean): CSSProperties => ({ minHeight: "46px", padding: "0 16px", borderRadius: "999px", border: `1.5px solid ${on ? BRAND : "#E2D3C1"}`, background: on ? "#FBEDE6" : "#FFFFFF", color: on ? "#7E3D29" : INK, display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, cursor: "pointer" });
const tile = (on: boolean): CSSProperties => ({ position: "relative", minHeight: "76px", padding: "12px", borderRadius: "18px", border: `1.5px solid ${on ? BRAND : "#EFE6DA"}`, background: on ? "#FBEDE6" : "#FFFFFF", color: INK, display: "flex", alignItems: "center", gap: "10px", textAlign: "left", cursor: "pointer", transition: "background-color 0.18s ease, border-color 0.18s ease" });
const smallLink: CSSProperties = { height: "40px", padding: "0 12px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: INK, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none", cursor: "pointer" };

function Tick() {
  return (
    <span className="pop-in" aria-hidden="true" style={{ position: "absolute", top: "8px", right: "8px", width: "22px", height: "22px", borderRadius: "50%", background: BRAND, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={ICON.tick} size={13} width={3} />
    </span>
  );
}

function KindIcon({ kind, size = 44 }: { kind: string; size?: number }) {
  const look = lookOf(kind);
  return (
    <span aria-hidden="true" style={{ flex: `0 0 ${size}px`, width: `${size}px`, height: `${size}px`, borderRadius: `${Math.round(size * 0.3)}px`, background: look.bg, color: look.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={look.icon} size={Math.round(size * 0.48)} />
    </span>
  );
}

// While Gemini plans: what it is doing, in plain words, and a bar that keeps moving.
function Waiting({ city, onCancel }: { city: string; onCancel: () => void }) {
  const t = useT();
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((x) => Math.min(x + 1, 5)), 4200);
    return () => window.clearInterval(id);
  }, []);
  const lines: Key[] = ["trip.wait_1", "trip.wait_2", "trip.wait_3", "trip.wait_4", "trip.wait_5", "trip.wait_6"];
  return (
    <div role="status" aria-live="polite" style={{ padding: "8px 20px 0" }}>
      <div style={{ position: "relative", height: "220px", borderRadius: "24px", overflow: "hidden", background: "linear-gradient(160deg, #3A2516 0%, #2B1B10 60%, #4A2A1A 100%)", color: "#FBF6EE", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", textAlign: "center" }}>
        <span className="pulse" style={{ width: "72px", height: "72px", borderRadius: "50%", background: BRAND, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spark size={32} />
        </span>
        <span style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>{city}</span>
        <span key={n} className="fade-in" style={{ minHeight: "22px", padding: "0 20px", fontSize: "16px", fontWeight: 700, color: "#F3D9A8" }}>
          {t(lines[n], { city })}
        </span>
      </div>
      <div aria-hidden="true" style={{ marginTop: "16px", height: "8px", borderRadius: "999px", background: "#F1E7DA", overflow: "hidden" }}>
        <span className="trip-progress" style={{ display: "block", height: "100%", borderRadius: "999px", background: BRAND }} />
      </div>
      <p style={{ margin: "10px 0 0", fontSize: "13px", color: MUTED, textAlign: "center" }}>{t("trip.wait_note")}</p>
      <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px", borderRadius: "18px", border: "1px solid #EFE6DA" }}>
            <span className="shimmer" style={{ flex: "0 0 44px", height: "44px", borderRadius: "13px" }} />
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="shimmer" style={{ width: "40%", height: "10px", borderRadius: "6px" }} />
              <span className="shimmer" style={{ width: "80%", height: "14px", borderRadius: "6px" }} />
              <span className="shimmer" style={{ width: "65%", height: "10px", borderRadius: "6px" }} />
            </span>
          </div>
        ))}
      </div>
      <button type="button" onClick={onCancel} className="sheet-row" style={{ marginTop: "18px", justifyContent: "center" }}>
        {t("trip.cancel")}
      </button>
    </div>
  );
}

// One stop on the day's timeline.
function StopCard({ s, city, last, onAsk }: { s: TripStop; city: string; last: boolean; onAsk: () => void }) {
  const t = useT();
  const meta = [s.duration, s.cost].filter(Boolean).join(" · ");
  return (
    <li style={{ display: "flex", gap: "12px" }}>
      <span style={{ flex: "0 0 44px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <KindIcon kind={s.kind} />
        {last ? null : <span aria-hidden="true" style={{ flex: 1, width: "2px", margin: "6px 0", borderRadius: "2px", background: "#EFE6DA" }} />}
      </span>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : "18px" }}>
        <p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", color: "#8A6424" }}>
          {t(`slot.${s.slot}` as Key)}
          {meta ? <span style={{ fontWeight: 600, letterSpacing: 0, color: MUTED }}> · {meta}</span> : null}
        </p>
        <h3 style={{ margin: "3px 0 0", fontSize: "17px", lineHeight: 1.3, fontWeight: 800 }}>{s.name}</h3>
        <p style={{ margin: "4px 0 0", fontSize: "calc(14px * var(--read-scale, 1))", lineHeight: 1.5, color: "#4A3728" }}>{s.why}</p>
        {s.tip ? (
          <p style={{ margin: "8px 0 0", padding: "8px 10px", borderRadius: "12px", background: "#FBF6EE", display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>
            <span style={{ flex: "0 0 auto", color: "#B5841E", marginTop: "1px" }}>
              <Icon d={ICON.bulb} size={16} />
            </span>
            {s.tip}
          </p>
        ) : null}
        <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" onClick={onAsk} style={smallLink}>
            <Spark size={12} />
            {t("trip.ask")}
          </button>
          <a href={mapsUrl(s.name, undefined, city)} target="_blank" rel="noopener noreferrer" style={smallLink}>
            <Icon d={ICON.map} size={15} />
            {t("trip.map")}
          </a>
        </div>
      </div>
    </li>
  );
}

export default function TripScreen() {
  const t = useT();
  const ask = useAsk();
  const search = useSyncExternalStore(noop, () => window.location.search, () => "");
  const params = new URLSearchParams(search);
  const openId = params.get("id");
  const askedCity = params.get("city");

  const [lang] = useStored("lang", "en");
  const [profile, setProfile] = useStored<Profile>("profile", DEFAULT_PROFILE);
  const [form, setForm] = useStored<Form>("tripForm", DEFAULT_FORM);
  const [last, setLast] = useStored<SavedTrip | null>("tripLast", null);
  const [saved, setSaved] = useStored<Record<string, SavedTrip>>("aiTrips", {});
  // Step-free is the same switch as in Settings and on walks.
  const [sw, setSw] = useStored("switches", { auto: true, desc: false, steps: false });

  const [phase, setPhase] = useState<Phase | null>(null);
  const [step, setStep] = useState(1);
  const [typed, setTyped] = useState(false);
  const [error, setError] = useState("");
  const [dayPick, setDayPick] = useState<{ id: string; n: number } | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const cityInput = useRef<HTMLInputElement>(null);

  const city = typed ? form.city : askedCity || form.city;
  const setF = (patch: Partial<Form>) => setForm((f) => ({ ...DEFAULT_FORM, ...f, ...patch }));
  const setP = (patch: Partial<Profile>) => setProfile((p) => ({ ...DEFAULT_PROFILE, ...p, ...patch }));

  // What to show: the planner, the wait, an error, or a plan (saved or just made).
  const shown: SavedTrip | null = openId ? saved[openId] ?? null : search.includes("view=last") ? last : null;
  const view = phase ?? (shown ? "result" : "form");

  useEffect(() => () => {
    abort.current?.abort();
    window.speechSynthesis?.cancel();
  }, []);

  const hush = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const plan = async () => {
    const where = city.trim();
    if (!where) {
      setStep(1);
      cityInput.current?.focus();
      toast(t("trip.need_city"), "error");
      return;
    }
    setF({ city: where });
    setTyped(true);
    hush();
    setPhase("wait");
    window.scrollTo({ top: 0 });
    const controller = new AbortController();
    abort.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 90000);
    const who = travellerProfile();
    try {
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: where, days: form.days, interests: form.interests, notes: form.notes, profile: who, lang }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.trip) throw new Error(data.error || tr("trip.error"));
      const made: SavedTrip = { id: tripId(where), trip: data.trip as Trip, lang, savedAt: Date.now(), profile: who };
      setLast(made);
      // The plan gets its own address, so Back from the guide comes back to it.
      window.history.replaceState(null, "", "/trip?view=last");
      setPhase(null);
      window.scrollTo({ top: 0 });
    } catch (e) {
      // Cancelled: the traveller is already back on the planner.
      if (abort.current !== controller) return;
      const err = e as Error;
      setError(err.name === "AbortError" ? "This is taking too long. Try again in a moment." : err.message === "Failed to fetch" ? "Check your internet connection and try again." : err.message);
      setPhase("error");
    } finally {
      window.clearTimeout(timer);
      if (abort.current === controller) abort.current = null;
    }
  };

  const cancel = () => {
    const c = abort.current;
    abort.current = null;
    c?.abort();
    setPhase("form");
    setStep(3);
  };

  const backToForm = (toStep = 1) => {
    hush();
    window.history.replaceState(null, "", "/trip");
    setPhase("form");
    setStep(toStep);
    window.scrollTo({ top: 0 });
  };

  // ---------- the plan ----------
  if (view === "result" && shown) {
    const trip = shown.trip;
    const isSaved = Boolean(saved[shown.id]);
    const day = dayPick?.id === shown.id ? dayPick.n : 1;
    const today = trip.days.find((d) => d.day === day) ?? trip.days[0];
    const img = cityImage(trip.city);
    // Who the plan was made for, which may differ from today's settings.
    const madeFor = shown.profile ?? profile;
    const party = PARTIES.find((p) => p.id === madeFor.party);
    const facts: [string, Key, string | undefined][] = [
      [ICON.sun, "trip.best", trip.bestTime],
      [ICON.bus, "trip.around", trip.gettingAround],
      [ICON.wallet, "trip.cost", trip.budget],
    ];
    const listen = () => {
      const synth = window.speechSynthesis;
      if (!synth) return toast("Reading aloud isn't available in this browser.", "error");
      if (speaking) return hush();
      synth.cancel();
      const utter = (text: string) => {
        const u = new SpeechSynthesisUtterance(text);
        const locale = speechLocale(shown.lang);
        u.lang = locale;
        const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(locale.slice(0, 2)));
        if (voice) u.voice = voice;
        return u;
      };
      // Day by day, so long plans aren't cut off by the browser's speech limit.
      const parts = [
        `${trip.title}. ${trip.summary}`,
        ...trip.days.map((d) => `${tr("trip.day", { n: d.day })}: ${d.theme}. ${d.stops.map((s) => `${tr(`slot.${s.slot}` as Key).toLowerCase()}: ${s.name}. ${s.why}`).join(" ")}`),
        trip.food.length ? `${tr("trip.food_try")}: ${trip.food.map((f) => `${f.dish}, ${f.name}`).join(". ")}.` : "",
        trip.tips.length ? `${tr("trip.tips")}: ${trip.tips.join(" ")}` : "",
      ].filter(Boolean);
      parts.forEach((text, i) => {
        const u = utter(text);
        if (i === parts.length - 1) {
          u.onend = () => setSpeaking(false);
          u.onerror = () => setSpeaking(false);
        }
        synth.speak(u);
      });
      setSpeaking(true);
    };
    const toggleSave = (el: Element) => {
      pop(el, !isSaved);
      if (isSaved) {
        const kept = saved[shown.id];
        setSaved((m) => {
          const rest = { ...m };
          delete rest[shown.id];
          return rest;
        });
        toast(`Removed ${trip.title}`, { action: { label: "Undo", run: () => setSaved((m) => ({ ...m, [kept.id]: kept })) } });
      } else {
        setSaved((m) => ({ ...m, [shown.id]: { ...shown, savedAt: Date.now() } }));
        toast(t("trip.saved_toast"), "success");
      }
    };
    const shareText = [trip.title, trip.summary, ...trip.days.map((d) => `${tr("trip.day", { n: d.day })}: ${d.stops.map((s) => s.name).join(" → ")}`)].join("\n");

    return (
      <div style={frame({ paddingBottom: "120px" })}>
        <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {openId ? (
            <BackLink href="/saved#plans" aria-label="Back" style={roundBtn}>
              <Icon d={ICON.back} size={22} />
            </BackLink>
          ) : (
            <button type="button" aria-label={t("trip.change")} onClick={() => backToForm(1)} style={roundBtn}>
              <Icon d={ICON.back} size={22} />
            </button>
          )}
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{t("trip.title")}</h1>
          <button type="button" aria-label="Share plan" onClick={() => share(trip.title, shareText)} style={roundBtn}>
            <Icon d={ICON.share} />
          </button>
        </div>

        <section aria-label={trip.title} className="rise" style={{ margin: "4px 20px 0", borderRadius: "24px", overflow: "hidden", background: INK, color: "#FBF6EE" }}>
          {img ? (
            <div style={{ height: "150px", overflow: "hidden" }}>
              <img src={img} alt="" className="kenburns" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          ) : (
            <div aria-hidden="true" style={{ height: "64px", background: "radial-gradient(circle at 20% 120%, rgba(243, 217, 168, 0.35), transparent 55%), radial-gradient(circle at 90% -20%, rgba(154, 78, 54, 0.8), transparent 60%)" }} />
          )}
          <div style={{ padding: "16px 18px 18px" }}>
            <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", color: "#E7B98A" }}>
              {trip.city.toUpperCase()}
            </p>
            <h2 style={{ margin: "6px 0 0", fontSize: "26px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" }}>{trip.title}</h2>
            <p style={{ margin: "8px 0 0", fontSize: "calc(14px * var(--read-scale, 1))", lineHeight: 1.5, color: "#D9C6AE" }}>{trip.summary}</p>
            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[t(trip.days.length === 1 ? "trip.day_n" : "trip.days_n", { n: trip.days.length }), party ? t(`who.${party.id}` as Key) : "", BUDGETS.find(([b]) => b === madeFor.budget)?.[1] ?? ""].filter(Boolean).map((x) => (
                <span key={x} style={{ height: "26px", padding: "0 10px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.12)", display: "inline-flex", alignItems: "center", fontSize: "12px", fontWeight: 700 }}>
                  {x}
                </span>
              ))}
            </div>
            <button type="button" aria-pressed={speaking} onClick={listen} style={{ marginTop: "16px", width: "100%", height: "48px", border: 0, borderRadius: "14px", background: speaking ? "#F3D9A8" : "#FBF6EE", color: INK, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
              <Icon d={speaking ? ICON.stop : ICON.speaker} />
              <span key={speaking ? "s" : "l"} className="btn-swap">{speaking ? t("trip.stop") : t("trip.listen")}</span>
            </button>
          </div>
        </section>

        {facts.some(([, , v]) => v) ? (
          <div style={{ padding: "0 20px" }}>
            <Card style={{ marginTop: "14px" }}>
              {facts
                .filter(([, , v]) => v)
                .map(([icon, label, value], i) => (
                  <div key={label} style={{ padding: "12px 14px", display: "flex", gap: "12px", alignItems: "flex-start", borderTop: i ? "1px solid #F3ECE2" : 0 }}>
                    <span style={{ flex: "0 0 36px", height: "36px", borderRadius: "11px", background: "#F6EEE4", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={icon} size={18} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: MUTED }}>{t(label)}</span>
                      <span style={{ display: "block", marginTop: "2px", fontSize: "14px", lineHeight: 1.45, fontWeight: 600 }}>{value}</span>
                    </span>
                  </div>
                ))}
            </Card>
          </div>
        ) : null}

        {trip.days.length > 1 ? (
          <div role="tablist" aria-label="Days" className="hscroll" style={{ marginTop: "22px", padding: "0 20px", display: "flex", gap: "8px" }}>
            {trip.days.map((d) => {
              const on = d.day === today.day;
              return (
                <button
                  key={d.day}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setDayPick({ id: shown.id, n: d.day })}
                  style={{ flex: "0 0 auto", maxWidth: "200px", minHeight: "58px", padding: "8px 14px", borderRadius: "16px", border: `1.5px solid ${on ? INK : "#E2D3C1"}`, background: on ? INK : "#FFFFFF", color: on ? "#FBF6EE" : INK, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: "2px", textAlign: "left", cursor: "pointer", transition: "background-color 0.18s ease, color 0.18s ease" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 800 }}>{t("trip.day", { n: d.day })}</span>
                  <span style={{ maxWidth: "100%", fontSize: "12px", fontWeight: 600, opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.theme}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        <section key={`${shown.id}-${today.day}`} className="fade-in" style={{ padding: "0 20px" }}>
          <h2 style={{ margin: "22px 0 14px", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.01em" }}>
            {trip.days.length > 1 ? today.theme : `${t("trip.day", { n: 1 })} · ${today.theme}`}
          </h2>
          <ol className="stagger" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {today.stops.map((s, i) => (
              <StopCard key={`${s.name}-${i}`} s={s} city={trip.city} last={i === today.stops.length - 1} onAsk={() => ask(`Explain ${s.name} in ${trip.city} to me simply: what it is, its story, and what to look for.`)} />
            ))}
          </ol>
        </section>

        {trip.food.length ? (
          <section style={{ marginTop: "8px" }}>
            <h2 style={{ ...kicker, padding: "0 20px" }}>{t("trip.food_try").toUpperCase()}</h2>
            <div className="hscroll" style={{ display: "flex", gap: "10px", padding: "0 20px 4px" }}>
              {trip.food.map((f) => (
                <article key={f.name} style={{ flex: "0 0 250px", padding: "14px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <KindIcon kind="food" size={36} />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "15px", fontWeight: 800, lineHeight: 1.25 }}>{f.name}</span>
                      {f.area ? <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: MUTED }}>{f.area}</span> : null}
                    </span>
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: "#B5541E" }}>
                    {t("trip.try")}: {f.dish}
                  </span>
                  <span style={{ flex: 1, fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>{f.why}</span>
                  <a href={mapsUrl(f.name, f.area, trip.city)} target="_blank" rel="noopener noreferrer" style={{ ...smallLink, alignSelf: "flex-start", marginTop: "4px" }}>
                    <Icon d={ICON.map} size={15} />
                    {t("trip.map")}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <div style={{ padding: "0 20px" }}>
          {trip.hidden.length ? (
            <>
              <h2 style={kicker}>{t("trip.hidden").toUpperCase()}</h2>
              <Card>
                {trip.hidden.map((h, i) => (
                  <div key={h.name} style={{ padding: "12px 14px", display: "flex", gap: "12px", borderTop: i ? "1px solid #F3ECE2" : 0 }}>
                    <KindIcon kind="hidden" size={38} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "15px", fontWeight: 800 }}>{h.name}</span>
                      {h.area ? <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: MUTED }}>{h.area}</span> : null}
                      <span style={{ display: "block", marginTop: "3px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>{h.why}</span>
                    </span>
                    <a href={mapsUrl(h.name, h.area, trip.city)} target="_blank" rel="noopener noreferrer" aria-label={`${h.name} on Maps`} style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#F6F1EA", color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={ICON.map} size={18} />
                    </a>
                  </div>
                ))}
              </Card>
            </>
          ) : null}

          {trip.tips.length ? (
            <>
              <h2 style={kicker}>{t("trip.tips").toUpperCase()}</h2>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {trip.tips.map((tip) => (
                  <li key={tip} style={{ display: "flex", gap: "10px", fontSize: "calc(14px * var(--read-scale, 1))", lineHeight: 1.5 }}>
                    <span style={{ flex: "0 0 auto", marginTop: "2px", color: "#2F7A4A" }}>
                      <Icon d={ICON.check} size={18} />
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <button type="button" className="sheet-row" style={{ marginTop: 0 }} onClick={() => ask(`I'm planning ${trip.title}. ${trip.days.map((d) => `Day ${d.day}: ${d.stops.map((s) => s.name).join(", ")}.`).join(" ")} What else should I know before I go?`)}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon d={ICON.chat} />
                {t("trip.ask_guide")}
              </span>
              <span aria-hidden="true">›</span>
            </button>
            <Link href={`/discover?city=${encodeURIComponent(trip.city)}`} className="sheet-row" style={{ marginTop: 0 }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Icon d={ICON.compass} />
                {t("trip.discover_more")}
              </span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>

        <div className="nav-rail">
          <div style={{ padding: "12px 20px 30px", background: "#FFFFFF", borderTop: "1px solid #EFE6DA", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)", display: "flex", gap: "10px" }}>
            <button type="button" aria-pressed={isSaved} onClick={(e) => toggleSave(e.currentTarget)} style={{ flex: 1, height: "54px", borderRadius: "16px", border: isSaved ? `1.5px solid ${BRAND}` : 0, background: isSaved ? "#FBEDE6" : BRAND, color: isSaved ? BRAND : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", fontWeight: 800, cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={ICON.bookmark} />
              </svg>
              <span key={isSaved ? "on" : "off"} className="btn-swap">{isSaved ? t("trip.saved") : t("trip.save")}</span>
            </button>
            <button type="button" onClick={() => backToForm(1)} style={{ flex: "0 0 auto", height: "54px", padding: "0 18px", borderRadius: "16px", border: 0, background: INK, color: "#FBF6EE", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              {t("trip.new")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- planning ----------
  if (view === "wait" || view === "error") {
    return (
      <div style={frame({ paddingBottom: "40px" })}>
        <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{t("trip.title")}</h1>
        </div>
        {view === "wait" ? (
          <Waiting city={city} onCancel={cancel} />
        ) : (
          <div role="alert" className="rise" style={{ padding: "40px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
            <span style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#FBEDE6", color: BRAND, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICON.compass} size={32} />
            </span>
            <h2 style={{ margin: "6px 0 0", fontSize: "21px", fontWeight: 800 }}>{t("trip.error")}</h2>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>{error}</p>
            <button type="button" className="sheet-cta" onClick={plan} style={{ marginTop: "12px" }}>
              {t("trip.retry")}
            </button>
            <button type="button" className="sheet-row" onClick={() => backToForm(1)} style={{ justifyContent: "center", marginTop: 0 }}>
              {t("trip.change")}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ---------- the planner: three short steps ----------
  const goNext = () => {
    if (step === 1 && !city.trim()) {
      cityInput.current?.focus();
      toast(t("trip.need_city"), "error");
      return;
    }
    if (step === 1) setF({ city: city.trim() });
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else plan();
  };

  return (
    <div style={frame({ paddingBottom: "130px" })}>
      <div style={{ padding: "54px 12px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        {step > 1 ? (
          <button type="button" aria-label="Back" onClick={() => setStep(step - 1)} style={roundBtn}>
            <Icon d={ICON.back} size={22} />
          </button>
        ) : (
          <BackLink href="/home" aria-label="Back" style={roundBtn}>
            <Icon d={ICON.back} size={22} />
          </BackLink>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3].map((n) => (
              <span key={n} style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#E2D3C1", overflow: "hidden", display: "block" }}>
                {n <= step ? <span className={n === step ? "step-fill" : undefined} style={{ display: "block", width: "100%", height: "100%", borderRadius: "999px", background: BRAND }} /> : null}
              </span>
            ))}
          </div>
          <span style={{ fontSize: "12px", fontWeight: 600, color: MUTED }}>{t("trip.step", { n: step })}</span>
        </div>
        <span style={{ width: "44px" }} />
      </div>

      <div key={step} className="rise" style={{ padding: "14px 20px 0" }}>
        {step === 1 ? (
          <>
            <h1 style={h1}>{t("trip.where")}</h1>
            <p style={hint}>{t("trip.where_hint")}</p>
            <div style={{ marginTop: "18px", height: "60px", borderRadius: "18px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 16px" }}>
              <span style={{ color: BRAND, display: "flex" }}>
                <Icon d={ICON.pin} size={22} />
              </span>
              <input
                ref={cityInput}
                value={city}
                onChange={(e) => {
                  setTyped(true);
                  setF({ city: e.target.value });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goNext();
                }}
                placeholder={t("trip.city_ph")}
                aria-label={t("trip.where")}
                enterKeyHint="next"
                autoComplete="off"
                style={{ flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", background: "none", fontSize: "18px", fontWeight: 700, color: INK, fontFamily: "inherit" }}
              />
              <VoiceSearch
                label={t("trip.say_city")}
                onResult={(heard) => {
                  setTyped(true);
                  setF({ city: heard.replace(/[.?!]+$/, "") });
                }}
                style={{ flex: "0 0 48px", width: "48px", height: "48px", border: 0, borderRadius: "14px", background: "#FBEDE6", color: BRAND, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Icon d={ICON.mic} size={22} />
              </VoiceSearch>
            </div>
            <h2 style={kicker}>{t("trip.popular")}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {POPULAR_CITIES.map((c) => {
                const on = city.trim().toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={(e) => {
                      pop(e.currentTarget);
                      setTyped(true);
                      setF({ city: c });
                    }}
                    style={pill(on)}
                  >
                    {on ? <Icon d={ICON.tick} size={15} width={2.8} /> : null}
                    {c}
                  </button>
                );
              })}
            </div>

            <h2 style={kicker}>{t("trip.days").toUpperCase()}</h2>
            <div style={{ padding: "8px", borderRadius: "20px", background: "#F6F1EA", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button type="button" aria-label={t("trip.fewer")} disabled={form.days <= 1} onClick={(e) => { pop(e.currentTarget); setF({ days: Math.max(1, form.days - 1) }); }} style={{ width: "56px", height: "56px", border: 0, borderRadius: "16px", background: "#FFFFFF", color: INK, opacity: form.days <= 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(60, 36, 20, 0.12)" }}>
                <Icon d={ICON.minus} size={24} width={2.4} />
              </button>
              <span key={form.days} className="pop-in" aria-live="polite" style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.01em" }}>
                {t(form.days === 1 ? "trip.day_n" : "trip.days_n", { n: form.days })}
              </span>
              <button type="button" aria-label={t("trip.more")} disabled={form.days >= 7} onClick={(e) => { pop(e.currentTarget); setF({ days: Math.min(7, form.days + 1) }); }} style={{ width: "56px", height: "56px", border: 0, borderRadius: "16px", background: "#FFFFFF", color: INK, opacity: form.days >= 7 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(60, 36, 20, 0.12)" }}>
                <Icon d={ICON.plus} size={24} width={2.4} />
              </button>
            </div>

            {last ? (
              <>
                <h2 style={kicker}>{t("trip.last")}</h2>
                <Link href="/trip?view=last" style={{ padding: "10px 12px 10px 10px", borderRadius: "18px", border: "1px solid #EFE6DA", display: "flex", alignItems: "center", gap: "12px", color: INK, textDecoration: "none" }}>
                  {cityImage(last.trip.city) ? (
                    <img src={cityImage(last.trip.city)} alt="" style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
                  ) : (
                    <KindIcon kind="heritage" size={52} />
                  )}
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: "15px", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{last.trip.title}</span>
                    <span style={{ display: "block", fontSize: "13px", color: MUTED }}>{t(last.trip.days.length === 1 ? "trip.day_n" : "trip.days_n", { n: last.trip.days.length })} · {last.trip.city}</span>
                  </span>
                  <span style={{ height: "36px", padding: "0 12px", borderRadius: "999px", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800 }}>{t("trip.open")}</span>
                </Link>
              </>
            ) : null}
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 style={h1}>{t("trip.who")}</h1>
            <p style={hint}>{t("trip.who_hint")}</p>
            <div role="radiogroup" aria-label={t("trip.who")} className="stagger" style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
              {PARTIES.map((p, i) => {
                const on = profile.party === p.id;
                return (
                  <button key={p.id} type="button" role="radio" aria-checked={on} onClick={(e) => { pop(e.currentTarget, !on); setP({ party: p.id }); }} style={{ ...tile(on), gridColumn: i === PARTIES.length - 1 ? "1 / -1" : undefined }}>
                    <span aria-hidden="true" style={{ flex: "0 0 40px", height: "40px", borderRadius: "12px", background: on ? "#FFFFFF" : "#F6EEE4", color: on ? BRAND : "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={p.icon} size={22} width={1.9} />
                    </span>
                    <span style={{ minWidth: 0, paddingRight: "16px" }}>
                      <span style={{ display: "block", fontSize: "15px", fontWeight: 800, lineHeight: 1.25 }}>{t(`who.${p.id}` as Key)}</span>
                      <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: MUTED, lineHeight: 1.3 }}>{t(`who.${p.id}_hint` as Key)}</span>
                    </span>
                    {on ? <Tick /> : null}
                  </button>
                );
              })}
            </div>

            <h2 style={kicker}>{t("trip.budget").toUpperCase()}</h2>
            <div role="radiogroup" aria-label={t("trip.budget")} style={{ padding: "4px", borderRadius: "16px", background: "#F1E7DA", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
              {BUDGETS.map(([id, sign]) => {
                const on = profile.budget === id;
                return (
                  <button key={id} type="button" role="radio" aria-checked={on} onClick={() => setP({ budget: id })} style={{ minHeight: "58px", border: 0, borderRadius: "12px", background: on ? "#FFFFFF" : "transparent", color: on ? INK : "#5A4434", boxShadow: on ? "0 2px 6px rgba(90, 60, 30, 0.14)" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: "pointer" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: on ? BRAND : "inherit" }}>{sign}</span>
                    <span style={{ fontSize: "13px", fontWeight: on ? 800 : 600 }}>{t(`pf.${id}` as Key)}</span>
                  </button>
                );
              })}
            </div>
            <h2 style={kicker}>{t("trip.pace").toUpperCase()}</h2>
            <Segmented label={t("trip.pace")} value={profile.pace} onChange={(pace) => setP({ pace })} options={PACES.map(([id]) => [id, t(`pf.${id}` as Key)])} />
            <h2 style={kicker}>{t("trip.food").toUpperCase()}</h2>
            <Segmented label={t("trip.food")} value={profile.diet} onChange={(diet) => setP({ diet })} options={DIETS.map(([id]) => [id, t(`pf.${id}` as Key)])} />
            <Card style={{ marginTop: "14px" }}>
              <SwitchRow label={t("trip.stepfree")} hint={t("trip.stepfree_hint")} on={sw.steps} onToggle={() => setSw((s) => ({ ...s, steps: !s.steps }))} last />
            </Card>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 style={h1}>{t("trip.love")}</h1>
            <p style={hint}>{t("trip.love_hint")}</p>
            <div className="stagger" style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
              {TRIP_INTERESTS.map(([id]) => {
                const on = form.interests.includes(id);
                const look = lookOf(id);
                return (
                  <button key={id} type="button" aria-pressed={on} onClick={(e) => { pop(e.currentTarget, !on); setF({ interests: on ? form.interests.filter((x) => x !== id) : [...form.interests, id] }); }} style={{ ...tile(on), minHeight: "64px" }}>
                    <span aria-hidden="true" style={{ flex: "0 0 36px", height: "36px", borderRadius: "11px", background: on ? "#FFFFFF" : look.bg, color: look.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={look.icon} size={19} />
                    </span>
                    <span style={{ minWidth: 0, paddingRight: "14px", fontSize: "14px", fontWeight: 700, lineHeight: 1.25 }}>{t(`int.${id}` as Key)}</span>
                    {on ? <Tick /> : null}
                  </button>
                );
              })}
            </div>
            <h2 style={kicker}>{t("trip.notes").toUpperCase()}</h2>
            <div style={{ position: "relative" }}>
              <textarea
                value={form.notes}
                onChange={(e) => setF({ notes: e.target.value.slice(0, 300) })}
                placeholder={t("trip.notes_ph")}
                aria-label={t("trip.notes")}
                rows={3}
                style={{ width: "100%", padding: "14px 60px 14px 14px", borderRadius: "16px", border: "1.5px solid #E2D3C1", outline: "none", resize: "none", fontSize: "15px", lineHeight: 1.45, color: INK, fontFamily: "inherit", boxSizing: "border-box" }}
              />
              <VoiceSearch label={t("trip.say_notes")} onResult={(heard) => setF({ notes: `${form.notes ? `${form.notes} ` : ""}${heard}`.slice(0, 300) })} style={{ position: "absolute", top: "10px", right: "10px", width: "44px", height: "44px", border: 0, borderRadius: "12px", background: "#FBEDE6", color: BRAND, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon d={ICON.mic} size={20} />
              </VoiceSearch>
            </div>
          </>
        ) : null}
      </div>

      <div className="nav-rail">
        <div style={{ padding: "28px 20px 24px", background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 34%)" }}>
          <button type="button" onClick={goNext} style={{ width: "100%", height: "58px", border: 0, borderRadius: "18px", background: BRAND, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "17px", fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.28)" }}>
            {step === 3 ? <Spark size={18} /> : null}
            <span>{step === 3 ? t("trip.go") : t("trip.next")}</span>
            {step === 3 ? null : <Icon d={ICON.arrow} size={20} width={2.2} />}
            {step === 1 && city.trim() ? <span className="fade-in" style={{ maxWidth: "120px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{city.trim()}</span> : null}
          </button>
        </div>
      </div>
    </div>
  );
}
