"use client";

// 15 · Saved & offline
import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { useAsk } from "@/components/Tap";
import { DEFAULT_SAVED, useStored } from "@/lib/store";
import { Spinner } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { cityPlan, planStops, type SavedPlan } from "@/lib/plans";
import { cityImage, type SavedTrip } from "@/lib/trip";
import type { Stamp } from "@/lib/stamps";
import type { SavedFind } from "@/lib/discover";
import { SECRETS } from "@/lib/secrets";
import { PLACES as MAP_PLACES } from "../explore/places";

type Item = {
  id: string;
  title: string;
  meta: string;
  city: string;
  km: number;
  badge: string;
  img?: string;
  href?: string;
};

const PLACES: Item[] = [
  { id: "sidi", title: "Sidi Saiyyed Mosque", meta: "1.8 km · Old City", city: "Ahmedabad", km: 1.8, badge: "Tree of Life jali", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", href: "/place" },
  { id: "dhal", title: "Dhal ni Pol", meta: "650 m · Khadia", city: "Ahmedabad", km: 0.65, badge: "Carved havelis", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", href: "/secret?id=dhal" },
  { id: "sarkhej", title: "Sarkhej Roza", meta: "8 km · 20 min drive", city: "Ahmedabad", km: 8, badge: "Best at sunset", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", href: "/secret?id=sarkhej" },
  { id: "hawa", title: "Hawa Mahal", meta: "Jaipur, Rajasthan", city: "Jaipur", km: 660, badge: "Jaipur", img: "/images/hawa-mahal.jpg", href: "/trip?city=Jaipur" },
];

// Distance in km from a line like "650 m · 8 min" or "18 km · 35 min drive".
const kmIn = (text: string) => {
  const m = text.match(/([\d.]+)\s*(km|m)\b/);
  return m ? Number(m[1]) / (m[2] === "m" ? 1000 : 1) : 1;
};

// Everything else that can be saved around the app — the finds on Home and
// the pins on the map — so a save anywhere shows up here.
const MORE_PLACES: Item[] = [
  ...SECRETS.map((s) => ({ id: s.id, title: s.title, meta: s.distance, city: "Ahmedabad", km: kmIn(s.distance), badge: s.tag, img: s.img, href: `/secret?id=${s.id}` })),
  ...MAP_PLACES.map((p) => ({ id: p.id, title: p.name, meta: `${p.km < 1 ? `${Math.round(p.km * 1000)} m` : `${p.km} km`} · ${p.mins} min walk`, city: "Ahmedabad", km: p.km, badge: p.open, img: p.img, href: p.href || p.detail })),
];
const ALL_PLACES = [...PLACES, ...MORE_PLACES.filter((it, i, all) => !PLACES.some((p) => p.id === it.id) && all.findIndex((o) => o.id === it.id) === i)];

const WALKS: Item[] = [
  { id: "walk-morning", title: "Old City in a morning", meta: "6 stops · 2.4 km · 2 h 40", city: "Ahmedabad", km: 1.8, badge: "Planned for you", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", href: "/walk" },
  { id: "walk-loop", title: "Old City short loop", meta: "4 stops · 1.4 km · 1 h 40", city: "Ahmedabad", km: 1.8, badge: "From AI Guide", img: "/images/358cd23211709da539c3303890c27e8b.jpg", href: "/ai-guide" },
];

const STORIES: Item[] = [
  { id: "story-tree", title: "Reading the Tree of Life", meta: "Sidi Saiyyed Mosque · 2:20", city: "Ahmedabad", km: 1.8, badge: "Chapter 2 of 4", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", href: "/story" },
  { id: "reel-sidi", title: "Golden hour at Sidi Saiyyed", meta: "Reel · 0:42", city: "Ahmedabad", km: 1.8, badge: "Saved from Reels", img: "/images/358cd23211709da539c3303890c27e8b.jpg", href: "/reels" },
  { id: "reel-sarkhej", title: "Sarkhej Roza, the Acropolis of Ahmedabad", meta: "Reel · 0:30", city: "Ahmedabad", km: 8, badge: "Saved from Reels", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", href: "/reels" },
  { id: "reel-pol", title: "Why every pol feeds the birds", meta: "Reel · 0:55", city: "Ahmedabad", km: 0.65, badge: "Saved from Reels", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", href: "/reels" },
  { id: "story-sarkhej", title: "Why Sarkhej was built", meta: "Sarkhej Roza · 2:10", city: "Ahmedabad", km: 8, badge: "AR Tour narration", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", href: "/ar" },
];

const TABS = ["Places", "Walks", "Stories", "Plans", "Offline"] as const;
type TabName = (typeof TABS)[number];
const NOUNS: Record<TabName, [string, string]> = { Places: ["place", "places"], Walks: ["walk", "walks"], Stories: ["story", "stories"], Plans: ["plan", "plans"], Offline: ["saved item", "saved items"] };
const SORTS = ["Recently saved", "Nearest first", "A to Z"];

// What counts as saved before the traveller changes anything.
const DEFAULTS: Record<string, boolean> = { ...DEFAULT_SAVED };

function Thumb({ item }: { item: Item }) {
  if (item.img) {
    return <img src={item.img} alt="" style={{ flex: "0 0 72px", width: "72px", height: "72px", borderRadius: "14px", objectFit: "cover", display: "block" }} />;
  }
  return (
    <div role="img" aria-label={`Photo placeholder: ${item.title}`} style={{ flex: "0 0 72px", width: "72px", height: "72px", borderRadius: "14px", background: "#EFE1C9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="44" height="44" viewBox="0 0 80 80" fill="none" stroke="#9C7A55" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 70V36h64v34" />
        <path d="M16 36V26h48v10" />
        <path d="M26 26V18h28v8" />
        <path d="M35 18v-6h10v6" />
        <path d="M16 50a4 4 0 0 1 8 0v6h-8zM30 50a4 4 0 0 1 8 0v6h-8zM44 50a4 4 0 0 1 8 0v6h-8zM58 50a4 4 0 0 1 8 0v6h-8z" />
        <path d="M4 70h72" />
      </svg>
    </div>
  );
}

export default function SavedScreen() {
  // The planner's "View in Saved" link opens this screen on the Plans tab (/saved#plans).
  const hash = useSyncExternalStore(
    () => () => {},
    () => window.location.hash,
    () => ""
  );
  const [tabPicked, setTab] = useState<TabName | null>(null);
  const tab: TabName = tabPicked ?? (hash === "#plans" ? "Plans" : "Places");
  const [plans, setPlans] = useStored<Record<string, SavedPlan>>("plans", {});
  const [aiTrips, setAiTrips] = useStored<Record<string, SavedTrip>>("aiTrips", {});
  // Finds saved from Discover.
  const [finds, setFinds] = useStored<Record<string, SavedFind>>("savedFinds", {});
  const findItems: Item[] = Object.entries(finds)
    .sort((a, b) => b[1].savedAt - a[1].savedAt)
    .map(([key, f]) => ({ id: `find-${key}`, title: f.name, meta: [f.area, f.city].filter(Boolean).join(" · "), city: f.city, km: 0, badge: f.tryThis ? `Try: ${f.tryThis}` : "Saved from Discover", href: `/discover?city=${encodeURIComponent(f.city)}` }));
  const [sort, setSort] = useState(0);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [manage, setManage] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saved, setSaved] = useStored<Record<string, boolean>>("saved", DEFAULT_SAVED);
  const [pack, setPack] = useStored("pack", false);
  // Places really visited: a stamp was collected there.
  const [stamps] = useStored<Record<string, Stamp>>("stamps", {});
  const ask = useAsk();
  const t = useT();

  // Trip plans saved from the city planner and the AI trip planner, newest first.
  const planItems: Item[] = [
    ...Object.entries(plans).flatMap(([id, p]) => {
      const city = cityPlan(id);
      if (!city) return [];
      const stops = planStops(city, p.days, p.interests).length;
      return [{ at: p.savedAt, item: { id: `plan-${id}`, title: `${p.days} ${p.days === 1 ? "day" : "days"} in ${city.name}`, meta: `${stops} stops · ${city.tag}`, city: city.name, km: 0, badge: "Trip plan", img: city.img, href: `/plan?city=${id}` } }];
    }),
    ...Object.values(aiTrips).map((p) => {
      const stops = p.trip.days.reduce((n, d) => n + d.stops.length, 0);
      return { at: p.savedAt, item: { id: `trip-${p.id}`, title: p.trip.title, meta: `${p.trip.days.length} ${p.trip.days.length === 1 ? "day" : "days"} · ${stops} stops · ${p.trip.city}`, city: p.trip.city, km: 0, badge: "AI trip plan", img: cityImage(p.trip.city), href: `/trip?id=${encodeURIComponent(p.id)}` } };
    }),
  ]
    .sort((a, b) => b.at - a.at)
    .map((x) => x.item);
  const isSaved = (id: string) => id.startsWith("plan-") || id.startsWith("trip-") || id.startsWith("find-") || (saved[id] ?? DEFAULTS[id] ?? false);
  const source = tab === "Plans" ? planItems : tab === "Walks" ? WALKS : tab === "Stories" ? STORIES : tab === "Places" ? [...findItems, ...ALL_PLACES] : pack ? [...ALL_PLACES, ...WALKS, ...STORIES].filter((it) => it.city === "Ahmedabad") : [];
  let items = source.filter((it) => isSaved(it.id));
  const needle = query.trim().toLowerCase();
  if (needle) items = items.filter((it) => `${it.title} ${it.meta}`.toLowerCase().includes(needle));
  if (sort === 1) items = [...items].sort((a, b) => a.km - b.km);
  if (sort === 2) items = [...items].sort((a, b) => a.title.localeCompare(b.title));

  const cities = new Set(items.map((it) => it.city)).size;
  const count = `${items.length} ${NOUNS[tab][items.length === 1 ? 0 : 1]}${tab === "Offline" ? " available offline" : cities > 1 ? ` · ${cities} cities` : ""}`;

  const remove = (it: Item) => {
    let undo: () => void;
    if (it.id.startsWith("find-")) {
      const key = it.id.slice(5);
      const kept = finds[key];
      setFinds((m) => {
        const rest = { ...m };
        delete rest[key];
        return rest;
      });
      undo = () => setFinds((m) => ({ ...m, [key]: kept }));
    } else if (it.id.startsWith("trip-")) {
      const id = it.id.slice(5);
      const kept = aiTrips[id];
      setAiTrips((m) => {
        const rest = { ...m };
        delete rest[id];
        return rest;
      });
      undo = () => setAiTrips((m) => ({ ...m, [id]: kept }));
    } else if (it.id.startsWith("plan-")) {
      const id = it.id.slice(5);
      const kept = plans[id];
      setPlans((p) => {
        const rest = { ...p };
        delete rest[id];
        return rest;
      });
      undo = () => setPlans((p) => ({ ...p, [id]: kept }));
    } else {
      setSaved((m) => ({ ...m, [it.id]: false }));
      undo = () => setSaved((m) => ({ ...m, [it.id]: true }));
    }
    toast(`Removed ${it.title}`, { action: { label: "Undo", run: undo } });
  };

  const row = (it: Item): ReactNode => {
    const inner = (
      <>
        <Thumb item={it} />
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800" }}>{it.title}</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>{it.meta}</span>
          {stamps[it.id] ? (
            <span style={{ alignSelf: "flex-start", height: "24px", padding: "0 8px 0 6px", borderRadius: "7px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Visited · stamp collected
            </span>
          ) : (
            <span style={{ alignSelf: "flex-start", height: "24px", padding: "0 8px", borderRadius: "7px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>{it.badge}</span>
          )}
        </span>
      </>
    );
    const rowStyle = { flex: "1", minWidth: "0", minHeight: "88px", padding: "8px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", textAlign: "left" as const };
    return (
      <li key={it.id} className="rise" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {it.href ? (
          <Link href={it.href} style={rowStyle}>
            {inner}
          </Link>
        ) : (
          <button type="button" onClick={() => ask(`Tell me about ${it.title}`)} style={{ ...rowStyle, border: "0", background: "none", cursor: "pointer" }}>
            {inner}
          </button>
        )}
        <button
          type="button"
          aria-label={`Remove ${it.title} from saved`}
          onClick={(e) => {
            // The row slides away first, then the list closes the gap.
            const li = e.currentTarget.closest("li");
            if (!li || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return remove(it);
            li.animate([{ opacity: 1, translate: "0 0" }, { opacity: 0, translate: "-28px 0" }], { duration: 220, easing: "ease-in", fill: "forwards" }).finished.then(() => remove(it));
          }} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      </li>
    );
  };

  const packStatus = downloading ? "Downloading…" : pack ? "Downloaded · 86 MB" : "Not downloaded · 86 MB";

  return (
    <div style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', 'Noto Sans Devanagari', 'Noto Sans Gujarati', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "54px 12px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        {searching ? (
          <input autoFocus type="search" aria-label="Search saved" placeholder={t("sv.search")} value={query} onChange={(e) => setQuery(e.target.value)} className="fade-in" style={{ flex: "1", minWidth: "0", height: "44px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid #D9C7B3", background: "#F6F1EA", fontSize: "15px", color: "#2B1B10", outline: "none" }} />
        ) : (
          <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>{t("sv.title")}</h1>
        )}
        <button
          type="button"
          aria-label={searching ? "Close search" : "Search saved"}
          onClick={() => {
            setSearching(!searching);
            setQuery("");
          }}
          style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          {searching ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          )}
        </button>
      </div>
      <div role="tablist" aria-label="Saved items" style={{ marginTop: "8px", padding: "0 20px", display: "flex", gap: "18px", borderBottom: "1px solid #EFE6DA" }}>
        {TABS.map((tb) => (
          <button key={tb} type="button" role="tab" aria-selected={tab === tb} onClick={() => setTab(tb)} style={{ height: "44px", padding: "0", border: "0", borderBottom: `3px solid ${tab === tb ? "#9A4E36" : "transparent"}`, background: "none", color: tab === tb ? "#2B1B10" : "#6F5B4B", fontSize: "15px", fontWeight: tab === tb ? 800 : 700, cursor: "pointer" }}>
            {t(`sv.${tb}`)}
          </button>
        ))}
      </div>
      <div style={{ flex: "1", minHeight: "0", overflowY: "auto", paddingBottom: "104px" }}>
        <section aria-label="Offline pack" aria-busy={downloading} style={{ position: "relative", overflow: "hidden", margin: "16px 20px 0", padding: "16px", borderRadius: "18px", background: "#2B1B10", color: "#FBF6EE" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className={downloading ? "float" : undefined} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
            </span>
            <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "16px", fontWeight: "800" }}>Ahmedabad pack</span>
              <span style={{ fontSize: "12px", fontWeight: "700", color: pack && !downloading ? "#9FD3B0" : "#F3D9A8" }}>{packStatus}</span>
            </span>
            <button type="button" onClick={() => setManage(true)} style={{ height: "44px", padding: "0 12px", border: "0", borderRadius: "12px", background: "rgba(251, 246, 238, 0.12)", color: "#FBF6EE", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              {pack ? "Manage" : "Download · 86 MB"}
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.45", color: "#D9C6AE" }}>{pack ? "42 places, 30 stories and 2 walks work without internet. Add a pack for any city before you travel." : "Download the pack to use places, stories and walks without internet."}</p>
          {/* How far the download has got (it takes as long as the timer in the sheet). */}
          {downloading ? <div data-timer aria-hidden="true" style={{ position: "absolute", left: 0, bottom: 0, height: "4px", width: "100%", background: "#F3D9A8", animation: "fill 2.2s linear backwards" }} /> : null}
        </section>
        <div style={{ margin: "22px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>{count}</span>
          {items.length > 1 ? (
          <button
            type="button"
            aria-label={`Sorted by ${SORTS[sort]}. Change sort order`}
            onClick={() => {
              const next = (sort + 1) % SORTS.length;
              setSort(next);
              toast(`Sorted: ${SORTS[next]}`);
            }}
            style={{ height: "36px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", gap: "4px", color: "#9A4E36", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m21 16-4 4-4-4" />
              <path d="M17 20V4" />
              <path d="m3 8 4-4 4 4" />
              <path d="M7 4v16" />
            </svg>
            {sort === 0 ? "Sort" : SORTS[sort]}
          </button>
          ) : null}
        </div>
        {items.length ? (
          <ul key={`${tab}-${sort}`} className="stagger" style={{ listStyle: "none", margin: "6px 0 0", padding: "0 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {items.map(row)}
          </ul>
        ) : (
          <div className="rise" style={{ margin: "28px 32px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
            <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#F6EEE4", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </span>
            <span style={{ fontSize: "17px", fontWeight: "800" }}>{needle ? "No matches" : tab === "Offline" ? "Nothing offline yet" : `No saved ${tab.toLowerCase()} yet`}</span>
            <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#5A4434" }}>{needle ? `Nothing saved matches "${query.trim()}".` : tab === "Offline" ? "Download the Ahmedabad pack to keep your saved items for when there's no signal." : tab === "Plans" ? "Tell the AI where you're going and who's coming, and it plans each day. Save the plan and it will wait for you here." : "Tap the bookmark on any place, walk or story and it will wait for you here."}</span>
            {!needle ? (
              <Link href={tab === "Plans" ? "/trip" : "/explore"} style={{ marginTop: "8px", height: "48px", padding: "0 20px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: "800" }}>
                {tab === "Plans" ? "Plan a trip" : "Explore nearby"}
              </Link>
            ) : null}
          </div>
        )}
      </div>
      <MainNav active="saved" />
      <Sheet open={manage} onClose={() => setManage(false)} title="Ahmedabad pack">
        <p>42 places, 30 stories, 2 walks and the Old City map. Updated 2 days ago.</p>
        {pack ? (
          <>
            <button
              type="button"
              className="sheet-row"
              disabled={checking}
              aria-busy={checking}
              onClick={() => {
                // A moment spent "checking" so the answer feels like it came from somewhere.
                setChecking(true);
                setTimeout(() => {
                  setChecking(false);
                  setManage(false);
                  toast("Ahmedabad pack is up to date", "success");
                }, 900);
              }}
            >
              <span>
                {checking ? "Checking for updates…" : "Check for updates"}
                <small>86 MB on this phone</small>
              </span>
              {checking ? <Spinner color="#9A4E36" track="#EFE6DA" /> : null}
            </button>
            <button
              type="button"
              className="sheet-row"
              style={{ color: "#A23A2A" }}
              onClick={() => {
                setPack(false);
                setManage(false);
                toast("Ahmedabad pack removed", { action: { label: "Undo", run: () => setPack(true) } });
              }}
            >
              Remove download
            </button>
          </>
        ) : (
          <button
            type="button"
            className="sheet-cta"
            disabled={downloading}
            onClick={() => {
              setDownloading(true);
              setManage(false);
              setTimeout(() => {
                setDownloading(false);
                setPack(true);
                toast("Ahmedabad pack downloaded", "success");
              }, 2200);
            }}
          >
            Download · 86 MB
          </button>
        )}
        <Link href="/city" className="sheet-row" onClick={() => setManage(false)}>
          <span>
            Add another city
            <small>Jaipur, Varanasi, Hampi, Kolkata…</small>
          </span>
          <span aria-hidden="true">›</span>
        </Link>
      </Sheet>
    </div>
  );
}
