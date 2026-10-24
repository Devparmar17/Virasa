"use client";

// 07 · Navigation (map)
import { useState } from "react";
import Link from "next/link";
import MainNav from "@/components/MainNav";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { pop, useAsk } from "@/components/Tap";
import { DEFAULT_SAVED, useStored } from "@/lib/store";
import { PLACES, CATEGORIES, type Category } from "./places";
import { useT } from "@/lib/i18n";

export default function ExploreScreen() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [selected, setSelected] = useState("sidi");
  const [listOpen, setListOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  // Searching the map: the typed words, and whether the results list is open.
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [located, setLocated] = useState(0);
  const [layers, setLayers] = useStored<Record<string, boolean>>("layers", { labels: true, savedOnly: false });
  const [saved, setSaved] = useStored<Record<string, boolean>>("saved", DEFAULT_SAVED);
  const ask = useAsk();
  const t = useT();
  // Opening hours the dictionary knows; anything else stays as written.
  const openText = (o: string) => (o === "Open now" ? t("place.open_now") : o === "Always open" ? t("ex.always_open") : o);

  const place = PLACES.find((p) => p.id === selected) || PLACES[0];
  const needle = q.trim().toLowerCase();
  const matchesQ = (p: (typeof PLACES)[number]) => !needle || `${p.name} ${CATEGORIES[p.cat].label} ${CATEGORIES[p.cat].chip} ${p.fact}`.toLowerCase().includes(needle);
  const matches = PLACES.filter(matchesQ);
  const choose = (id: string) => {
    setSelected(id);
    setQ("");
    setSearching(false);
    setListOpen(false);
  };
  const shown = PLACES.filter((p) => filter === "all" || p.cat === filter);
  const isSaved = saved[place.id] ?? false;
  const select = (id: string) => {
    setSelected(id);
    setListOpen(false);
    setSearching(false);
  };
  // Props for a map pin: tap or Enter selects it; filtered-out pins fade back.
  const pin = (id: string) => {
    const p = PLACES.find((x) => x.id === id)!;
    const dim = (filter !== "all" && p.cat !== filter) || (layers.savedOnly && !saved[id]) || !matchesQ(p);
    return {
      role: "button",
      filter: "url(#pin-shadow)",
      tabIndex: dim ? -1 : 0,
      "aria-label": `${p.name}, ${CATEGORIES[p.cat].label}`,
      "aria-pressed": selected === id,
      onClick: () => select(id),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") select(id);
      },
      style: { cursor: "pointer", transform: `translate(${p.x}px, ${p.y}px) scale(${selected === id ? 1.25 : 1})`, opacity: dim ? 0.22 : 1, pointerEvents: dim ? ("none" as const) : ("auto" as const), transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease" },
    };
  };
  return (
    <div style={{ width: "390px", height: "min(844px, 100dvh)", minHeight: "640px", position: "relative", overflow: "hidden", background: "#F4F1EA", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div className="map-canvas" style={{ position: "absolute", left: 0, top: 0, width: "390px", height: "844px" }}>
      <svg role="img" aria-label="Map of Ahmedabad's Old City with heritage places" width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: "0", display: "block" }}>
        <defs>
          {/* A soft lift under the pins and the cluster bubble. */}
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3C2414" floodOpacity="0.28" />
          </filter>
        </defs>
        <rect width="390" height="844" fill="#F4F1EA" />
        {/* City blocks between the streets. */}
        <g fill="#ECE6DB">
          <rect x="115" y="155" width="20" height="40" rx="6" />
          <rect x="115" y="205" width="20" height="70" rx="6" />
          <rect x="115" y="285" width="20" height="110" rx="6" />
          <rect x="115" y="405" width="20" height="110" rx="6" />
          <rect x="115" y="525" width="20" height="110" rx="6" />
          <rect x="115" y="645" width="20" height="70" rx="6" />
          <rect x="145" y="155" width="46" height="40" rx="6" />
          <rect x="145" y="205" width="46" height="70" rx="6" />
          <rect x="145" y="285" width="46" height="110" rx="6" />
          <rect x="145" y="405" width="46" height="110" rx="6" />
          <rect x="145" y="525" width="46" height="110" rx="6" />
          <rect x="145" y="645" width="46" height="70" rx="6" />
          <rect x="201" y="155" width="74" height="40" rx="6" />
          <rect x="201" y="205" width="74" height="70" rx="6" />
          <rect x="201" y="285" width="74" height="110" rx="6" />
          <rect x="201" y="405" width="74" height="110" rx="6" />
          <rect x="201" y="525" width="74" height="110" rx="6" />
          <rect x="201" y="645" width="74" height="70" rx="6" />
          <rect x="285" y="155" width="50" height="40" rx="6" />
          <rect x="285" y="205" width="50" height="70" rx="6" />
          <rect x="285" y="285" width="50" height="110" rx="6" />
          <rect x="285" y="405" width="50" height="110" rx="6" />
          <rect x="285" y="525" width="50" height="110" rx="6" />
          <rect x="285" y="645" width="50" height="70" rx="6" />
          <rect x="345" y="155" width="30" height="40" rx="6" />
          <rect x="345" y="205" width="30" height="70" rx="6" />
          <rect x="345" y="285" width="30" height="110" rx="6" />
          <rect x="345" y="405" width="30" height="110" rx="6" />
          <rect x="345" y="525" width="30" height="110" rx="6" />
          <rect x="345" y="645" width="30" height="70" rx="6" />
        </g>
        <path d="M0 0 H86 C70 200 96 420 74 600 C62 700 70 780 60 844 H0 Z" fill="#BFDCE4" />
        <path d="M86 0 C70 200 96 420 74 600 C62 700 70 780 60 844" fill="none" stroke="#A9CFDA" strokeWidth="1.5" />
        <path d="M92 0 C76 200 102 420 80 600 C68 700 76 780 66 844" fill="none" stroke="#D3E8C6" strokeWidth="8" />
        <rect x="296" y="300" width="58" height="36" rx="10" fill="#D3E8C6" />
        <rect x="128" y="540" width="52" height="40" rx="10" fill="#D3E8C6" />
        <rect x="250" y="190" width="44" height="30" rx="10" fill="#D3E8C6" />
        <g stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M110 200 H370" />
          <path d="M106 280 H380" />
          <path d="M112 400 H380" />
          <path d="M116 520 H360" />
          <path d="M120 640 H340" />
          <path d="M140 150 V700" />
          <path d="M196 140 V720" />
          <path d="M280 140 V700" />
          <path d="M340 160 V660" />
          <path d="M160 230 L210 260 L250 250" />
          <path d="M290 420 L320 470 L360 480" />
          <path d="M150 450 L200 430" />
        </g>
        {/* The Old City heritage zone: a light wash and a fine edge. */}
        <path d="M114 172 L302 150 L362 300 L352 560 L252 652 L122 622 Z" fill="#9A4E36" fillOpacity="0.045" stroke="#C59A72" strokeWidth="1.4" strokeDasharray="2 5" strokeLinecap="round" strokeLinejoin="round" />
        <g stroke="#E1D8C8" strokeWidth="12" fill="none" strokeLinecap="round">
          <path d="M0 240 C120 246 250 236 390 242" />
          <path d="M0 604 C130 598 250 608 390 600" />
          <path d="M80 336 C170 330 260 340 390 326" />
          <path d="M80 470 C180 462 280 476 390 462" />
          <path d="M232 0 C226 200 238 500 232 844" />
          <path d="M120 844 L340 110" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round">
          <path d="M0 240 C120 246 250 236 390 242" />
          <path d="M0 604 C130 598 250 608 390 600" />
          <path d="M80 336 C170 330 260 340 390 326" />
          <path d="M80 470 C180 462 280 476 390 462" />
          <path d="M232 0 C226 200 238 500 232 844" />
          <path d="M120 844 L340 110" />
        </g>
        <g fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#7F776B" stroke="#F4F1EA" strokeWidth="3" paintOrder="stroke" letterSpacing="0.3">
          <text x="300" y="320">
            Relief Rd
          </text>
          <text x="300" y="456">
            Gandhi Rd
          </text>
          <text x="244" y="560" transform="rotate(-90 244 560)">
            Kalupur Rd
          </text>
        </g>
        <text x="42" y="430" transform="rotate(-84 42 430)" fontFamily="Plus Jakarta Sans, system-ui, sans-serif" fontSize="11" fontWeight="700" fontStyle="italic" fill="#4F8697" letterSpacing="2.5">
          Sabarmati
        </text>
        <g {...pin("bhadra")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#5A4434" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </g>
        </g>
        <g {...pin("teen")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <g {...pin("jama")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <g {...pin("manek")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#C0612F" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </g>
        </g>
        <g {...pin("dhal")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#8A6424" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="3" />
            <path d="M8.12 8.12 12 12" />
            <path d="M20 4 8.12 15.88" />
            <circle cx="6" cy="18" r="3" />
            <path d="M14.8 14.8 20 20" />
          </g>
        </g>
        <g {...pin("kalupur")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#9A4E36" stroke="#FFFFFF" strokeWidth="2.5" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <circle key={selected} className="fade-in" cx={place.x} cy={place.y - 38} r="30" fill="#9A4E36" opacity="0.16" />
        <g {...pin("sidi")}>
          <circle cy="-22" r="22" fill="transparent" />
          <path d="M0 0 C-4 -8 -14 -14 -14 -24 A14 14 0 1 1 14 -24 C14 -14 4 -8 0 0Z" fill="#7E3D29" stroke="#FFFFFF" strokeWidth="2.2" />
          <g transform="translate(-7 -31) scale(0.58)" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" x2="21" y1="22" y2="22" />
            <line x1="6" x2="6" y1="18" y2="11" />
            <line x1="10" x2="10" y1="18" y2="11" />
            <line x1="14" x2="14" y1="18" y2="11" />
            <line x1="18" x2="18" y1="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
          </g>
        </g>
        <circle cx={place.x} cy={place.y - 18} r="30" fill="#9A4E36" opacity="0.14" style={{ transition: "cx 0.35s cubic-bezier(0.22, 1, 0.36, 1), cy 0.35s cubic-bezier(0.22, 1, 0.36, 1)" }} />
        <circle key={located} className="locate-ring" cx="318" cy="420" r="24" fill="#2F6FB0" opacity="0.16" />
        <circle cx="318" cy="420" r="8" fill="#2F6FB0" stroke="#FFFFFF" strokeWidth="3" />
      </svg>
      {layers.labels ? (
        <span key={selected} className="label-in" style={{ position: "absolute", left: `${Math.min(Math.max(place.x, 96), 294)}px`, top: `${place.y < 340 ? place.y + 14 : place.y - 98}px`, transform: "translateX(-50%)", whiteSpace: "nowrap", height: "30px", padding: "0 12px", borderRadius: "999px", background: "#2B1B10", color: "#FFFFFF", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", boxShadow: "0 6px 16px rgba(43, 27, 16, 0.25)" }}>
          {place.name}
        </span>
      ) : null}
      </div>
      <div style={{ position: "absolute", top: "54px", left: "16px", right: "16px", height: "54px", borderRadius: "18px", background: "rgba(255, 255, 255, 0.96)", border: "1px solid rgba(226, 211, 193, 0.7)", boxShadow: "0 10px 26px rgba(60, 36, 20, 0.14)", display: "flex", alignItems: "center", padding: "0 4px 0 0" }}>
        <label style={{ flex: "1", minWidth: 0, height: "52px", display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 14px" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            enterKeyHint="search"
            aria-label={t("ex.where")}
            placeholder={t("ex.where")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSearching(true);
            }}
            onFocus={() => setSearching(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches[0] && needle) choose(matches[0].id);
              if (e.key === "Escape") {
                setQ("");
                setSearching(false);
                e.currentTarget.blur();
              }
            }}
            style={{ flex: 1, minWidth: 0, width: 0, height: "44px", border: 0, outline: "none", background: "transparent", fontSize: "15px", fontWeight: 600, color: "#2B1B10" }}
          />
          {q ? (
            <button type="button" aria-label="Clear search" onClick={() => setQ("")} style={{ flex: "0 0 36px", width: "36px", height: "36px", border: 0, borderRadius: "50%", background: "#F3ECE2", color: "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          ) : null}
        </label>
        <button type="button" aria-label="Map layers" onClick={() => setLayersOpen(true)} style={{ width: "44px", height: "44px", border: "0", borderRadius: "14px", background: "#F6F1EA", color: "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          </svg>
        </button>
      </div>
      {searching && needle ? (
        <div role="listbox" aria-label="Places on the map" className="label-in" style={{ position: "absolute", zIndex: 6, top: "116px", left: "16px", right: "16px", maxHeight: "300px", overflowY: "auto", padding: "6px", borderRadius: "18px", background: "#FFFFFF", border: "1px solid rgba(226, 211, 193, 0.7)", boxShadow: "0 14px 30px rgba(60, 36, 20, 0.16)" }}>
          {matches.length ? (
            matches.map((p) => (
              <button key={p.id} type="button" role="option" aria-selected={p.id === selected} onClick={() => choose(p.id)} style={{ width: "100%", minHeight: "56px", padding: "6px 8px", border: 0, borderRadius: "12px", background: "none", color: "#2B1B10", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", cursor: "pointer" }}>
                {p.img ? <img src={p.img} alt="" style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", display: "block" }} /> : <span aria-hidden="true" style={{ flex: "0 0 40px", height: "40px", borderRadius: "10px", background: CATEGORIES[p.cat].tagBg }} />}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "15px", fontWeight: 800 }}>{p.name}</span>
                  <span style={{ display: "block", marginTop: "1px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>
                    {t(`ex.one.${p.cat}`)} · {t("unit.min_walk", { n: p.mins })}
                  </span>
                </span>
                <span aria-hidden="true" style={{ width: "10px", height: "10px", borderRadius: "50%", background: CATEGORIES[p.cat].color }} />
              </button>
            ))
          ) : (
            <p style={{ margin: 0, padding: "14px 10px", fontSize: "14px", color: "#6F5B4B" }}>{t("ex.no_match", { q: q.trim() })}</p>
          )}
        </div>
      ) : null}
      <div className="hscroll" style={{ position: "absolute", top: "116px", left: "16px", right: "0", display: "flex", gap: "8px", overflowX: "auto", paddingRight: "16px", paddingBottom: "8px", scrollbarWidth: "none" }}>
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} style={{ flex: "0 0 auto", height: "38px", padding: "0 14px", borderRadius: "999px", border: "0", background: filter === "all" ? "#2B1B10" : "#FFFFFF", color: filter === "all" ? "#FFFFFF" : "#2B1B10", fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(43, 27, 16, 0.18)", cursor: "pointer" }}>
          {t("ex.all")}
        </button>
        {(Object.keys(CATEGORIES) as Category[]).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => {
              setFilter(filter === c ? "all" : c);
              const first = PLACES.find((p) => p.cat === c);
              if (filter !== c && first && place.cat !== c) setSelected(first.id);
            }}
            style={{ flex: "0 0 auto", height: "38px", padding: "0 14px 0 10px", borderRadius: "999px", border: "0", background: filter === c ? "#2B1B10" : "#FFFFFF", color: filter === c ? "#FFFFFF" : "#2B1B10", fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(90, 60, 30, 0.14)", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
          >
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: CATEGORIES[c].color, border: filter === c ? "1.5px solid #FFFFFF" : "0" }} />
            {t(`ex.cat.${c}`)}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="Show my location"
        onClick={(e) => {
          pop(e.currentTarget);
          setLocated((n) => n + 1);
          toast(`You're on Gandhi Road · ${place.mins} min walk to ${place.name}`);
        }}
        style={{ position: "absolute", right: "16px", bottom: "338px", width: "48px", height: "48px", border: "1px solid rgba(226, 211, 193, 0.7)", borderRadius: "16px", background: "#FFFFFF", color: "#2F6FB0", boxShadow: "0 8px 20px rgba(60, 36, 20, 0.16)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="2" x2="5" y1="12" y2="12" />
          <line x1="19" x2="22" y1="12" y2="12" />
          <line x1="12" x2="12" y1="2" y2="5" />
          <line x1="12" x2="12" y1="19" y2="22" />
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <section aria-label="Selected place" style={{ position: "absolute", left: "0", right: "0", bottom: "0", background: "#FFFFFF", borderRadius: "26px 26px 0 0", boxShadow: "0 -10px 30px rgba(90, 60, 30, 0.14)", padding: "8px 20px 100px" }}>
        <div style={{ width: "40px", height: "5px", borderRadius: "999px", background: "#DCCDBA", margin: "0 auto" }} />
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>{needle ? t(matches.length === 1 ? "ex.found_one" : "ex.found", { n: matches.length }) : filter === "all" ? t("ex.nearby") : t(shown.length === 1 ? "ex.count_one" : "ex.count", { n: shown.length, cat: t(`ex.cat.${filter}`) })}</span>
          <button type="button" onClick={() => setListOpen(true)} style={{ height: "36px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", color: "#9A4E36", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            {t("ex.list")}
          </button>
        </div>
        <div key={place.id} className="rise">
          <Link href={place.href || place.detail || "/explore"} onClick={(e) => { if (!place.href && !place.detail) { e.preventDefault(); ask(`Tell me about ${place.name}`); } }} style={{ marginTop: "10px", display: "flex", gap: "14px", textDecoration: "none", color: "#2B1B10" }}>
            {place.img ? (
              <img src={place.img} alt="" style={{ flex: "0 0 92px", width: "92px", height: "92px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
            ) : (
              <span aria-hidden="true" style={{ flex: "0 0 92px", width: "92px", height: "92px", borderRadius: "14px", background: CATEGORIES[place.cat].tagBg, color: CATEGORIES[place.cat].color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
            )}
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ display: "flex", gap: "6px" }}>
                <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: CATEGORIES[place.cat].tagBg, color: CATEGORIES[place.cat].tagFg, fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>{t(`ex.one.${place.cat}`)}</span>
                <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: "#E3F1E7", color: "#2F7A4A", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>{openText(place.open)}</span>
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{place.name}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: "#5A4434" }}>
                <span>
                  {place.fact} · {place.mins} min walk
                </span>
              </span>
            </span>
          </Link>
          <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
            <Link href={place.id === "sidi" ? "/navigate" : `/navigate?to=${place.id}`} style={{ flex: "1", height: "50px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              <span>{t("ex.walk_there")}</span>
            </Link>
            {place.href ? (
              <Link href="/story" style={{ flex: "1", height: "50px", borderRadius: "14px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
                {t("ex.story")}
              </Link>
            ) : (
              place.detail ? (
                <Link href={place.detail} style={{ flex: "1", height: "50px", borderRadius: "14px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
                  {t("ex.read")}
                </Link>
              ) : (
                <button type="button" onClick={() => ask(`Tell me the story of ${place.name}`)} style={{ flex: "1", height: "50px", borderRadius: "14px", border: "1.5px solid #9A4E36", background: "none", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                  {t("ex.ask")}
                </button>
              )
            )}
            <button
              type="button"
              aria-label={`${isSaved ? "Remove" : "Save"} ${place.name}`}
              aria-pressed={isSaved}
              onClick={(e) => {
                pop(e.currentTarget, !isSaved);
                setSaved((m) => ({ ...m, [place.id]: !isSaved }));
                toast(isSaved ? "Removed from Saved" : "Saved for later", isSaved ? "info" : "success");
              }}
              style={{ flex: "0 0 50px", width: "50px", height: "50px", borderRadius: "14px", border: `1.5px solid ${isSaved ? "#9A4E36" : "#E2D3C1"}`, background: isSaved ? "#FBEDE6" : "#FFFFFF", color: isSaved ? "#9A4E36" : "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <MainNav active="explore" />
      <Sheet open={listOpen} onClose={() => setListOpen(false)} title={filter === "all" ? "Places nearby" : CATEGORIES[filter].chip}>
        <p>Nearest first. Tap a place to see it on the map.</p>
        {[...shown]
          .sort((a, b) => a.km - b.km)
          .map((p) => (
            <button key={p.id} type="button" className="sheet-row" aria-pressed={selected === p.id} onClick={() => select(p.id)}>
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
                <span aria-hidden="true" style={{ flex: "0 0 12px", width: "12px", height: "12px", borderRadius: "50%", background: CATEGORIES[p.cat].color }} />
                <span style={{ minWidth: "0" }}>
                  {p.name}
                  <small>
                    {CATEGORIES[p.cat].label} · {p.open}
                  </small>
                </span>
              </span>
              <span style={{ flex: "0 0 auto", fontSize: "13px", color: "#6F5B4B" }}>{p.mins} min</span>
            </button>
          ))}
      </Sheet>
      <Sheet open={layersOpen} onClose={() => setLayersOpen(false)} title={t("ex.layers")}>
        {(
          [
            ["labels", "Place names", "Show the name above the selected pin"],
            ["savedOnly", "Saved places only", "Fade the places you have not saved"],
          ] as const
        ).map(([id, name, hint]) => (
          <button key={id} type="button" role="switch" aria-checked={!!layers[id]} className="sheet-row" onClick={() => setLayers((l) => ({ ...l, [id]: !l[id] }))}>
            <span>
              {name}
              <small>{hint}</small>
            </span>
            <span aria-hidden="true" style={{ flex: "0 0 46px", width: "46px", height: "28px", padding: "3px", borderRadius: "999px", background: layers[id] ? "#2F7A4A" : "#CDBFAE", display: "flex", justifyContent: layers[id] ? "flex-end" : "flex-start", transition: "background-color 0.2s ease" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#FFFFFF" }} />
            </span>
          </button>
        ))}
      </Sheet>
    </div>
  );
}
