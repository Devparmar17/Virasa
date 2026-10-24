"use client";

// Discover like a local — hidden places, local food, markets, festivals and
// small experiences in any city, found by Gemini and shaped to who is
// travelling. No ratings are made up: each find says why locals love it, and
// Maps opens the real place with its reviews and opening hours.
//
// /discover?city=Jaipur opens on that city; otherwise the city you are in.
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import VoiceSearch from "@/components/VoiceSearch";
import { pop, useAsk } from "@/components/Tap";
import { toast } from "@/components/Toast";
import { frame } from "@/components/ui";
import { travellerProfile, useStored } from "@/lib/store";
import { DEFAULT_HERE, type Here } from "@/lib/here";
import { useT, type Key } from "@/lib/i18n";
import { POPULAR_CITIES } from "@/lib/trip";
import { FIND_KINDS, mapsUrl, type Discovery, type Find, type FindKind, type SavedFind } from "@/lib/discover";
import { lookOf } from "@/lib/kinds";

const INK = "#2B1B10";
const MUTED = "#6F5B4B";
const BRAND = "#9A4E36";

const noop = () => () => {};

const Icon = ({ d, size = 20, width = 2 }: { d: string; size?: number; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const Spark = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
  </svg>
);
const ICON = {
  back: "m12 19-7-7 7-7M19 12H5",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  search: "m21 21-4.3-4.3M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
  map: "M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3ZM9 3v15M15 6v15",
  bulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z",
  clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v6l4 2",
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 16v-4M12 8h.01",
  route: "M3 11l19-9-9 19-2-8-8-2z",
};
const ALL_ICON = "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z";

const smallBtn: CSSProperties = { height: "40px", padding: "0 12px", borderRadius: "999px", border: "1.5px solid #E2D3C1", background: "#FFFFFF", color: INK, display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none", cursor: "pointer" };

function FindCard({ f, city, onAsk }: { f: Find; city: string; onAsk: () => void }) {
  const t = useT();
  const look = lookOf(f.kind);
  const [finds, setFinds] = useStored<Record<string, SavedFind>>("savedFinds", {});
  const key = `${city}|${f.name}`.toLowerCase();
  const saved = Boolean(finds[key]);
  const toggle = (el: Element) => {
    pop(el, !saved);
    setFinds((m) => {
      const next = { ...m };
      if (saved) delete next[key];
      else next[key] = { ...f, city, savedAt: Date.now() };
      return next;
    });
    toast(saved ? `Removed ${f.name}` : `Saved ${f.name}`, saved ? "info" : "success");
  };
  return (
    <li style={{ padding: "14px", borderRadius: "20px", border: "1px solid #EFE6DA", background: "#FFFFFF" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span aria-hidden="true" style={{ flex: "0 0 46px", height: "46px", borderRadius: "14px", background: look.bg, color: look.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={look.icon} size={22} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: "12px", fontWeight: 800, letterSpacing: "0.06em", color: look.fg }}>{t(`disc.${f.kind}` as Key).toUpperCase()}</span>
          <span style={{ display: "block", marginTop: "2px", fontSize: "17px", lineHeight: 1.25, fontWeight: 800 }}>{f.name}</span>
          {f.area ? <span style={{ display: "block", marginTop: "1px", fontSize: "13px", fontWeight: 600, color: MUTED }}>{f.area}</span> : null}
        </span>
      </div>
      <p style={{ margin: "10px 0 0", fontSize: "calc(14px * var(--read-scale, 1))", lineHeight: 1.5, color: "#4A3728" }}>{f.why}</p>
      {f.tryThis || f.when ? (
        <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {f.tryThis ? (
            <span style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.4, fontWeight: 700, color: f.kind === "food" ? "#B5541E" : INK }}>
              <span style={{ flex: "0 0 auto", color: look.fg }}>
                <Spark size={14} />
              </span>
              {f.kind === "food" ? `${t("trip.try")}: ${f.tryThis}` : f.tryThis}
            </span>
          ) : null}
          {f.when ? (
            <span style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.4, color: "#5A4434" }}>
              <span style={{ flex: "0 0 auto", color: MUTED }}>
                <Icon d={ICON.clock} size={15} />
              </span>
              {t("disc.when")}: {f.when}
            </span>
          ) : null}
        </div>
      ) : null}
      {f.tip ? (
        <p style={{ margin: "10px 0 0", padding: "8px 10px", borderRadius: "12px", background: "#FBF6EE", display: "flex", gap: "8px", fontSize: "13px", lineHeight: 1.45, color: "#5A4434" }}>
          <span style={{ flex: "0 0 auto", color: "#B5841E" }}>
            <Icon d={ICON.bulb} size={16} />
          </span>
          {f.tip}
        </p>
      ) : null}
      <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {f.href ? (
          <Link href={f.href} style={{ ...smallBtn, background: INK, borderColor: INK, color: "#FBF6EE" }}>
            <Icon d={ICON.book} size={15} />
            {t("disc.open")}
          </Link>
        ) : null}
        <button type="button" onClick={onAsk} style={smallBtn}>
          <Spark />
          {t("trip.ask")}
        </button>
        <a href={mapsUrl(f.name, f.area, city)} target="_blank" rel="noopener noreferrer" style={smallBtn}>
          <Icon d={ICON.map} size={15} />
          {t("trip.map")}
        </a>
        <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${f.name} from Saved` : `Save ${f.name}`} onClick={(e) => toggle(e.currentTarget)} style={{ ...smallBtn, marginLeft: "auto", width: "40px", padding: 0, justifyContent: "center", borderColor: saved ? "#9A4E36" : "#E2D3C1", background: saved ? "#FBEDE6" : "#FFFFFF", color: saved ? "#9A4E36" : INK }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      </div>
    </li>
  );
}

function Skeleton() {
  return (
    <ul aria-hidden="true" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {[0, 1, 2].map((i) => (
        <li key={i} style={{ padding: "14px", borderRadius: "20px", border: "1px solid #EFE6DA", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span className="shimmer" style={{ flex: "0 0 46px", height: "46px", borderRadius: "14px" }} />
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="shimmer" style={{ width: "35%", height: "10px", borderRadius: "6px" }} />
              <span className="shimmer" style={{ width: "70%", height: "15px", borderRadius: "6px" }} />
            </span>
          </span>
          <span className="shimmer" style={{ width: "95%", height: "11px", borderRadius: "6px" }} />
          <span className="shimmer" style={{ width: "80%", height: "11px", borderRadius: "6px" }} />
        </li>
      ))}
    </ul>
  );
}

type Result = { data?: Discovery; error?: string };

export default function DiscoverScreen() {
  const t = useT();
  const ask = useAsk();
  const search = useSyncExternalStore(noop, () => window.location.search, () => "");
  const fromLink = new URLSearchParams(search).get("city");
  const [lang] = useStored("lang", "en");
  // Opens on the city the traveller is in, unless a link names another.
  const [here] = useStored<Here>("here", DEFAULT_HERE);
  const [picked, setPicked] = useState<string | null>(null);
  const city = picked ?? (fromLink || here.city);
  const [draft, setDraft] = useState<string | null>(null);
  const typed = draft ?? city;
  const [kind, setKind] = useState<FindKind | "all">("all");
  const [results, setResults] = useState<Record<string, Result>>({});
  const asking = useRef(new Set<string>());

  const key = `${city.toLowerCase()}|${kind}|${lang}`;
  const result = results[key];

  useEffect(() => {
    if (results[key] || asking.current.has(key)) return;
    asking.current.add(key);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 60000);
    fetch("/api/discover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, kind, lang, profile: travellerProfile() }),
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        setResults((r) => ({ ...r, [key]: res.ok && data.discovery ? { data: data.discovery } : { error: data.error || "Couldn't find anything right now." } }));
      })
      .catch((e: Error) => {
        setResults((r) => ({ ...r, [key]: { error: e.name === "AbortError" ? "This is taking too long. Try again in a moment." : "Check your internet connection and try again." } }));
      })
      .finally(() => {
        window.clearTimeout(timer);
        asking.current.delete(key);
      });
  }, [key, city, kind, lang, results]);

  const go = (next: string) => {
    const where = next.trim().replace(/[.?!]+$/, "");
    if (!where) return;
    setPicked(where);
    setDraft(null);
  };
  const retry = () =>
    setResults((r) => {
      const rest = { ...r };
      delete rest[key];
      return rest;
    });

  const finds = result?.data?.finds ?? [];

  return (
    <div style={frame({ paddingBottom: "48px" })}>
      <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/home" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: INK }}>
          <Icon d={ICON.back} size={22} />
        </BackLink>
        <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{t("home.discover")}</h1>
        <span style={{ width: "44px" }} />
      </div>

      <div style={{ padding: "6px 20px 0" }}>
        <h2 style={{ margin: 0, fontSize: "27px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" }}>{t("disc.title")}</h2>
        <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.45, color: "#5A4434" }}>{t("disc.sub")}</p>

        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            go(typed);
          }}
          style={{ marginTop: "16px", height: "58px", borderRadius: "18px", border: "1.5px solid #E2D3C1", display: "flex", alignItems: "center", gap: "8px", padding: "0 6px 0 14px" }}
        >
          <span style={{ color: BRAND, display: "flex" }}>
            <Icon d={ICON.pin} size={21} />
          </span>
          <input value={typed} onChange={(e) => setDraft(e.target.value)} placeholder={t("disc.city_ph")} aria-label={t("disc.city_ph")} enterKeyHint="search" autoComplete="off" style={{ flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", background: "none", fontSize: "17px", fontWeight: 700, color: INK, fontFamily: "inherit" }} />
          <VoiceSearch label={t("trip.say_city")} onResult={go} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "12px", background: "#FBEDE6", color: BRAND, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon d={ICON.mic} />
          </VoiceSearch>
          <button type="submit" style={{ flex: "0 0 auto", height: "44px", padding: "0 14px", border: 0, borderRadius: "12px", background: BRAND, color: "#FFFFFF", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
            {t("disc.find")}
          </button>
        </form>
      </div>

      <div className="hscroll" style={{ marginTop: "10px", padding: "0 20px", display: "flex", gap: "6px" }}>
        {POPULAR_CITIES.filter((c) => c.toLowerCase() !== city.toLowerCase()).map((c) => (
          <button key={c} type="button" onClick={() => go(c)} style={{ flex: "0 0 auto", height: "36px", padding: "0 12px", borderRadius: "999px", border: 0, background: "#F6F1EA", color: "#5A4434", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="What to discover" className="hscroll" style={{ marginTop: "18px", padding: "0 20px", display: "flex", gap: "8px" }}>
        {FIND_KINDS.map(([id]) => {
          const on = kind === id;
          const look = id === "all" ? { fg: INK, icon: ALL_ICON } : lookOf(id);
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={(e) => {
                pop(e.currentTarget);
                setKind(id);
              }}
              style={{ flex: "0 0 auto", height: "46px", padding: "0 14px", borderRadius: "999px", border: `1.5px solid ${on ? INK : "#E2D3C1"}`, background: on ? INK : "#FFFFFF", color: on ? "#FBF6EE" : INK, display: "flex", alignItems: "center", gap: "7px", fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "background-color 0.18s ease, color 0.18s ease" }}
            >
              <span style={{ color: on ? "#F3D9A8" : look.fg, display: "flex" }}>
                <Icon d={look.icon} size={17} />
              </span>
              {t(`disc.${id}` as Key)}
            </button>
          );
        })}
      </div>

      <section aria-live="polite" aria-busy={!result} style={{ padding: "18px 20px 0" }}>
        {!result ? (
          <>
            <p className="fade-in" style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: BRAND }}>
              <span className="typing" aria-hidden="true" style={{ display: "inline-flex", gap: "4px" }}>
                <i />
                <i />
                <i />
              </span>
              {t("disc.wait", { city })}
            </p>
            <Skeleton />
          </>
        ) : result.error ? (
          <div role="alert" className="rise" style={{ padding: "24px 18px", borderRadius: "20px", background: "#FBF6EE", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>{result.error}</p>
            <button type="button" className="sheet-cta" onClick={retry} style={{ marginTop: "14px" }}>
              {t("trip.retry")}
            </button>
          </div>
        ) : (
          <>
            {result.data?.intro ? (
              <p className="fade-in" style={{ margin: "0 0 14px", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.5, fontWeight: 600, color: INK }}>
                <strong style={{ fontWeight: 800 }}>{result.data.city}.</strong> {result.data.intro}
              </p>
            ) : null}
            {finds.length ? (
              <ul className="stagger" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {finds.map((f, i) => (
                  <FindCard key={`${f.name}-${i}`} f={f} city={result.data?.city || city} onAsk={() => ask(`Explain ${f.name}${f.area ? ` in ${f.area}` : ""}, ${result.data?.city || city} to me: why locals love it, its story, and how to make the most of a visit.`)} />
                ))}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: "15px", color: MUTED }}>{t("disc.none")}</p>
            )}
            <Link href={`/trip?city=${encodeURIComponent(result.data?.city || city)}`} style={{ marginTop: "14px", height: "56px", borderRadius: "16px", background: BRAND, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: 800, textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)" }}>
              <Icon d={ICON.route} />
              {t("disc.plan", { city: result.data?.city || city })}
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
