"use client";

// 15 · Saved & offline
import { useState, type ReactNode } from "react";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { useAsk } from "@/components/Tap";
import { DEFAULT_SAVED, useStored } from "@/lib/store";

type Item = {
  id: string;
  title: string;
  meta: string;
  city: string;
  km: number;
  badge: string;
  visited?: boolean;
  img?: string;
  href?: string;
};

const PLACES: Item[] = [
  { id: "sidi", title: "Sidi Saiyyed Mosque", meta: "1.8 km · Old City", city: "Ahmedabad", km: 1.8, badge: "Visited · stamp collected", visited: true, img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", href: "/place" },
  { id: "dhal", title: "Dhal ni Pol", meta: "650 m · Khadia", city: "Ahmedabad", km: 0.65, badge: "Visited", visited: true, img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg" },
  { id: "sarkhej", title: "Sarkhej Roza", meta: "8 km · 20 min drive", city: "Ahmedabad", km: 8, badge: "Best at sunset", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg" },
  { id: "hawa", title: "Hawa Mahal", meta: "Jaipur, Rajasthan", city: "Jaipur", km: 660, badge: "For your Jaipur trip" },
];

const WALKS: Item[] = [
  { id: "walk-morning", title: "Old City in a morning", meta: "6 stops · 2.4 km · 2 h 40", city: "Ahmedabad", km: 1.8, badge: "Planned for you", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", href: "/walk" },
  { id: "walk-loop", title: "Old City short loop", meta: "4 stops · 1.4 km · 1 h 40", city: "Ahmedabad", km: 1.8, badge: "From AI Guide", img: "/images/358cd23211709da539c3303890c27e8b.jpg", href: "/ai-guide" },
];

const STORIES: Item[] = [
  { id: "story-tree", title: "Reading the Tree of Life", meta: "Sidi Saiyyed Mosque · 2:20", city: "Ahmedabad", km: 1.8, badge: "Chapter 2 of 4", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", href: "/story" },
  { id: "reel-sidi", title: "Golden hour at Sidi Saiyyed", meta: "Reel · 0:42", city: "Ahmedabad", km: 1.8, badge: "Saved from Reels", img: "/images/358cd23211709da539c3303890c27e8b.jpg", href: "/reels" },
  { id: "story-sarkhej", title: "Why Sarkhej was built", meta: "Sarkhej Roza · 2:10", city: "Ahmedabad", km: 8, badge: "AR Tour narration", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", href: "/ar" },
];

const TABS = ["Places", "Walks", "Stories", "Offline"] as const;
type TabName = (typeof TABS)[number];
const NOUNS: Record<TabName, [string, string]> = { Places: ["place", "places"], Walks: ["walk", "walks"], Stories: ["story", "stories"], Offline: ["saved item", "saved items"] };
const SORTS = ["Recently saved", "Nearest first", "A to Z"];

// What counts as saved before the traveller changes anything.
const DEFAULTS: Record<string, boolean> = { ...DEFAULT_SAVED, "walk-morning": true, "walk-loop": true, "story-tree": true, "story-sarkhej": true };

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
  const [tab, setTab] = useState<TabName>("Places");
  const [sort, setSort] = useState(0);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [manage, setManage] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useStored<Record<string, boolean>>("saved", DEFAULT_SAVED);
  const [pack, setPack] = useStored("pack", true);
  const ask = useAsk();

  const isSaved = (id: string) => saved[id] ?? DEFAULTS[id] ?? false;
  const source = tab === "Walks" ? WALKS : tab === "Stories" ? STORIES : tab === "Places" ? PLACES : pack ? [...PLACES, ...WALKS, ...STORIES].filter((it) => it.city === "Ahmedabad") : [];
  let items = source.filter((it) => isSaved(it.id));
  const needle = query.trim().toLowerCase();
  if (needle) items = items.filter((it) => `${it.title} ${it.meta}`.toLowerCase().includes(needle));
  if (sort === 1) items = [...items].sort((a, b) => a.km - b.km);
  if (sort === 2) items = [...items].sort((a, b) => a.title.localeCompare(b.title));

  const cities = new Set(items.map((it) => it.city)).size;
  const count = `${items.length} ${NOUNS[tab][items.length === 1 ? 0 : 1]}${tab === "Offline" ? " available offline" : cities > 1 ? ` · ${cities} cities` : ""}`;

  const remove = (it: Item) => {
    setSaved((m) => ({ ...m, [it.id]: false }));
    toast(`Removed ${it.title}`);
  };

  const row = (it: Item): ReactNode => {
    const inner = (
      <>
        <Thumb item={it} />
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: "800" }}>{it.title}</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>{it.meta}</span>
          {it.visited ? (
            <span style={{ alignSelf: "flex-start", height: "24px", padding: "0 8px 0 6px", borderRadius: "7px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {it.badge}
            </span>
          ) : (
            <span style={{ alignSelf: "flex-start", height: "24px", padding: "0 8px", borderRadius: "7px", background: "#F5E6CC", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>{it.badge}</span>
          )}
        </span>
      </>
    );
    const rowStyle = { flex: "1", minWidth: "0", minHeight: "88px", padding: "8px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", textAlign: "left" as const };
    return (
      <li key={it.id} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {it.href ? (
          <Link href={it.href} style={rowStyle}>
            {inner}
          </Link>
        ) : (
          <button type="button" onClick={() => ask(`Tell me about ${it.title}`)} style={{ ...rowStyle, border: "0", background: "none", cursor: "pointer" }}>
            {inner}
          </button>
        )}
        <button type="button" aria-label={`Remove ${it.title} from saved`} onClick={() => remove(it)} style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "none", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
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
          <input autoFocus type="search" aria-label="Search saved" placeholder="Search saved places, walks, stories" value={query} onChange={(e) => setQuery(e.target.value)} className="fade-in" style={{ flex: "1", minWidth: "0", height: "44px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid #D9C7B3", background: "#FBF6EE", fontSize: "15px", color: "#2B1B10", outline: "none" }} />
        ) : (
          <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.02em" }}>Saved</h1>
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
      <div role="tablist" aria-label="Saved items" style={{ marginTop: "8px", padding: "0 20px", display: "flex", gap: "22px", borderBottom: "1px solid #EADFD2" }}>
        {TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} style={{ height: "44px", padding: "0", border: "0", borderBottom: `3px solid ${tab === t ? "#9A4E36" : "transparent"}`, background: "none", color: tab === t ? "#2B1B10" : "#6F5B4B", fontSize: "15px", fontWeight: tab === t ? 800 : 700, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ flex: "1", minHeight: "0", overflowY: "auto", paddingBottom: "104px" }}>
        <section aria-label="Offline pack" style={{ margin: "16px 20px 0", padding: "16px", borderRadius: "18px", background: "#2B1B10", color: "#FBF6EE" }}>
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
              Manage
            </button>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: "13px", lineHeight: "1.45", color: "#D9C6AE" }}>{pack ? "42 places, 30 stories and 2 walks work without internet. Add a pack for any city before you travel." : "Download the pack to use places, stories and walks without internet."}</p>
        </section>
        <div style={{ margin: "22px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>{count}</span>
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
        </div>
        {items.length ? (
          <ul key={`${tab}-${sort}`} className="stagger" style={{ listStyle: "none", margin: "6px 0 0", padding: "0 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {items.map(row)}
          </ul>
        ) : (
          <div className="rise" style={{ margin: "28px 32px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
            <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#F5E6CC", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </span>
            <span style={{ fontSize: "17px", fontWeight: "800" }}>{needle ? "No matches" : tab === "Offline" ? "Nothing offline yet" : `No saved ${tab.toLowerCase()} yet`}</span>
            <span style={{ fontSize: "14px", lineHeight: "1.45", color: "#5A4434" }}>{needle ? `Nothing saved matches "${query.trim()}".` : tab === "Offline" ? "Download the Ahmedabad pack to keep your saved items for when there's no signal." : "Tap the bookmark on any place, walk or story and it will wait for you here."}</span>
            {!needle ? (
              <Link href="/explore" style={{ marginTop: "8px", height: "48px", padding: "0 20px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: "800" }}>
                Explore nearby
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
              onClick={() => {
                setManage(false);
                toast("Ahmedabad pack is up to date");
              }}
            >
              <span>
                Check for updates
                <small>86 MB on this phone</small>
              </span>
            </button>
            <button
              type="button"
              className="sheet-row"
              style={{ color: "#A23A2A" }}
              onClick={() => {
                setPack(false);
                setManage(false);
                toast("Ahmedabad pack removed");
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
                toast("Ahmedabad pack downloaded");
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
