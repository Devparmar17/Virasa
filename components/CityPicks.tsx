"use client";

// The lower half of Home in a city other than Ahmedabad: places to see and
// local food, found by Discover's AI for the city the traveller is in. Kept
// on the phone for a day so Home doesn't ask again on every visit.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAsk } from "./Tap";
import { useHere } from "./Here";
import { travellerProfile, useStored } from "@/lib/store";
import { useT, type Key } from "@/lib/i18n";
import { lookOf } from "@/lib/kinds";
import type { Discovery, Find } from "@/lib/discover";

const INK = "var(--ink)";
const MUTED = "var(--ink-muted)";
const BRAND = "var(--clay)";
const DAY = 24 * 60 * 60 * 1000;

// Per city and language: the finds, and a photo (or none) for each by name.
type Saved = Record<string, { at: number; data: Discovery; photos?: Record<string, string | null> }>;

const Chevron = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function Section({ title, city, finds, loading, photos }: { title: string; city: string; finds: Find[]; loading: boolean; photos?: Record<string, string | null> }) {
  const t = useT();
  const ask = useAsk();
  if (!loading && !finds.length) return null;
  return (
    <section style={{ marginTop: "26px" }}>
      <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, letterSpacing: "-0.015em" }}>{title}</h2>
        <Link href={`/discover?city=${encodeURIComponent(city)}`} style={{ flex: "0 0 auto", height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: 700, color: BRAND, whiteSpace: "nowrap" }}>
          {t("hp.all")}
          <Chevron />
        </Link>
      </div>
      <ul aria-busy={loading} style={{ listStyle: "none", margin: "8px 20px 0", padding: "4px 0", borderRadius: "20px", border: "1px solid var(--line)", background: "var(--paper)" }}>
        {loading
          ? [0, 1, 2].map((i) => (
              <li key={i} aria-hidden="true" style={{ borderTop: i ? "1px solid var(--line-soft)" : "0", margin: "0 12px", minHeight: "76px", display: "flex", alignItems: "center", gap: "14px" }}>
                <span className="shimmer" style={{ flex: "0 0 52px", height: "52px", borderRadius: "14px" }} />
                <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span className="shimmer" style={{ height: "10px", width: "30%", borderRadius: "5px" }} />
                  <span className="shimmer" style={{ height: "13px", width: "70%", borderRadius: "6px" }} />
                </span>
              </li>
            ))
          : finds.map((f, i) => {
              const look = lookOf(f.kind);
              return (
                <li key={`${f.name}-${i}`} style={{ borderTop: i ? "1px solid var(--line-soft)" : "0", margin: "0 12px" }}>
                  <button type="button" onClick={() => ask(t("dc.ask", { name: f.area ? `${f.name} (${f.area})` : f.name, city }))} style={{ width: "100%", minHeight: "76px", padding: "10px 0", border: 0, background: "none", display: "flex", alignItems: "center", gap: "14px", color: INK, textAlign: "left", font: "inherit", cursor: "pointer" }}>
                    {photos?.[f.name] ? (
                      <img src={photos[f.name]!} alt="" loading="lazy" style={{ flex: "0 0 56px", width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", display: "block", background: look.bg }} />
                    ) : (
                      // No photo found (or still looking): the kind's icon on its colour.
                      <span aria-hidden="true" style={{ flex: "0 0 56px", height: "56px", borderRadius: "14px", background: look.bg, color: look.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={look.icon} />
                        </svg>
                      </span>
                    )}
                    <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: look.fg }}>{t(`hp.k.${f.kind}` as Key)}</span>
                      <span style={{ fontSize: "15px", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      <span style={{ fontSize: "13px", lineHeight: 1.35, color: MUTED, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{f.tryThis || f.why}</span>
                    </span>
                    <span style={{ color: "#B5A391" }}>
                      <Chevron size={18} />
                    </span>
                  </button>
                </li>
              );
            })}
      </ul>
    </section>
  );
}

// Places to visit as big photo cards in a row you swipe, like Ahmedabad's Top places.
function PlaceCards({ title, city, finds, loading, photos }: { title: string; city: string; finds: Find[]; loading: boolean; photos?: Record<string, string | null> }) {
  const t = useT();
  const ask = useAsk();
  if (!loading && !finds.length) return null;
  return (
    <section style={{ marginTop: "30px" }}>
      <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, letterSpacing: "-0.015em" }}>{title}</h2>
        <Link href={`/discover?city=${encodeURIComponent(city)}`} style={{ flex: "0 0 auto", height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: 700, color: BRAND, whiteSpace: "nowrap" }}>
          {t("hp.all")}
          <Chevron />
        </Link>
      </div>
      <div className="hscroll" aria-busy={loading} style={{ display: "flex", gap: "14px", padding: "12px 20px 8px" }}>
        {loading
          ? [0, 1].map((i) => (
              <div key={i} aria-hidden="true" style={{ flex: "0 0 272px", borderRadius: "20px", border: "1px solid var(--line)", overflow: "hidden" }}>
                <span className="shimmer" style={{ display: "block", height: "156px" }} />
                <span style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span className="shimmer" style={{ height: "14px", width: "60%", borderRadius: "6px" }} />
                  <span className="shimmer" style={{ height: "11px", width: "85%", borderRadius: "5px" }} />
                </span>
              </div>
            ))
          : finds.map((f, i) => {
              const look = lookOf(f.kind);
              const photo = photos?.[f.name];
              return (
                <button key={`${f.name}-${i}`} type="button" className="tap-card" onClick={() => ask(t("dc.ask", { name: f.area ? `${f.name} (${f.area})` : f.name, city }))} style={{ flex: "0 0 272px", padding: 0, border: "1px solid var(--line)", borderRadius: "20px", overflow: "hidden", background: "var(--paper)", boxShadow: "0 6px 18px rgba(90, 60, 30, 0.07)", display: "flex", flexDirection: "column", textAlign: "left", font: "inherit", color: INK, cursor: "pointer" }}>
                  <span style={{ position: "relative", display: "block", width: "100%", height: "156px", background: look.bg }}>
                    {photo ? (
                      <img src={photo} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      // No photo found: the kind's icon, large, on its colour.
                      <span aria-hidden="true" style={{ position: "absolute", inset: 0, color: look.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d={look.icon} />
                        </svg>
                      </span>
                    )}
                    <span style={{ position: "absolute", left: "10px", bottom: "10px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.94)", color: look.fg, display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 800 }}>{t(`hp.k.${f.kind}` as Key)}</span>
                  </span>
                  <span style={{ display: "block", padding: "12px 16px 14px" }}>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontSize: "17px", lineHeight: 1.25, fontWeight: 800, letterSpacing: "-0.01em" }}>{f.name}</span>
                    <span style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: "3px", fontSize: "13px", lineHeight: 1.35, color: MUTED }}>{f.why}</span>
                    {f.area ? <span style={{ display: "block", marginTop: "6px", fontSize: "13px", fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.area}</span> : null}
                  </span>
                </button>
              );
            })}
      </div>
    </section>
  );
}

export default function CityPicks() {
  const t = useT();
  const here = useHere();
  const city = here.city;
  const [lang] = useStored("lang", "en");
  const [saved, setSaved] = useStored<Saved>("cityPicks", {});
  const key = `${city.toLowerCase()}|${lang}`;
  // Shown straight away if this city was found before; refreshed after a day.
  const savedAt = saved[key]?.at ?? 0;
  const fresh = saved[key]?.data ?? null;
  const [failed, setFailed] = useState<string | null>(null);
  // The AI is sometimes busy for a moment: try up to 3 times, a few seconds apart.
  const [attempt, setAttempt] = useState(0);
  const tries = useRef<Record<string, number>>({});
  const asking = useRef<string | null>(null);

  useEffect(() => {
    if ((savedAt && Date.now() - savedAt < DAY) || failed === key || asking.current === key) return;
    asking.current = key;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 60000);
    fetch("/api/discover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, kind: "all", lang, profile: travellerProfile() }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((d: { discovery?: Discovery }) => {
        if (!d.discovery?.finds?.length) throw new Error("none");
        // Keep only the last few cities so the phone's storage stays small.
        setSaved((s) => Object.fromEntries([...Object.entries(s).sort((a, b) => b[1].at - a[1].at).slice(0, 5), [key, { at: Date.now(), data: d.discovery! }]]));
      })
      // Nothing found or no internet: the sections just stay hidden.
      .catch(() => {
        const n = (tries.current[key] = (tries.current[key] ?? 0) + 1);
        if (n < 3) window.setTimeout(() => setAttempt((a) => a + 1), 4000);
        else setFailed(key);
      })
      .finally(() => {
        window.clearTimeout(timer);
        if (asking.current === key) asking.current = null;
      });
    // The request is left to finish even if Home re-renders; `asking` stops a second one.
  }, [key, city, lang, savedAt, failed, attempt, setSaved]);

  // Once the places are here, look up a photo for each shown place, once.
  const photos = saved[key]?.photos;
  const asked = useRef<string | null>(null);
  useEffect(() => {
    if (!fresh || photos || asked.current === key) return;
    asked.current = key;
    const shown = [...fresh.finds.filter((f) => f.kind !== "food").slice(0, 6), ...fresh.finds.filter((f) => f.kind === "food").slice(0, 4)];
    fetch("/api/photos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city, items: shown.map((f) => ({ name: f.name, wiki: f.wiki, kind: f.kind })) }) })
      .then((res) => res.json())
      .then((d: { photos?: (string | null)[] }) => {
        if (!Array.isArray(d.photos)) return;
        const map = Object.fromEntries(shown.map((f, i) => [f.name, d.photos![i] ?? null]));
        setSaved((s) => (s[key] ? { ...s, [key]: { ...s[key], photos: map } } : s));
      })
      // No photos this time: the icons stay.
      .catch(() => {});
  }, [key, city, fresh, photos, setSaved]);

  if (failed === key && !fresh) return null;
  const finds = fresh?.finds ?? [];
  const loading = !fresh;
  const places = finds.filter((f) => f.kind !== "food").slice(0, 6);
  const food = finds.filter((f) => f.kind === "food").slice(0, 4);
  return (
    <>
      <PlaceCards title={t("hp.places", { city })} city={city} finds={places} loading={loading} photos={photos} />
      <Section title={t("hp.food", { city })} city={city} finds={food} loading={loading} photos={photos} />
    </>
  );
}
