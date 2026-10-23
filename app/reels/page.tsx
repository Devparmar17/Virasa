"use client";

// 08 · Reels
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import { toast } from "@/components/Toast";
import { pop, share, useAsk } from "@/components/Tap";
import { useStored } from "@/lib/store";

type Reel = {
  id: string;
  img: string;
  alt: string;
  focus: string;
  place: string;
  href: string;
  km: number;
  caption: string;
  seconds: number;
  likes: string;
  question: string;
};

const REELS: Reel[] = [
  { id: "reel-sidi", img: "/images/a9558385034112d0e27f39ea353dd7ed.jpg", alt: "Video frame: sunlight through the Tree of Life jali", focus: "28% 50%", place: "Sidi Saiyyed Mosque · 1.8 km", href: "/place", km: 1.8, caption: "This Tree of Life was carved in stone in 1573 — and centuries later it inspired the IIM Ahmedabad logo.", seconds: 42, likes: "12.4k", question: "Who carved the Tree of Life jali at Sidi Saiyyed Mosque?" },
  { id: "reel-sarkhej", img: "/images/d2ca2a032f6c259ea0b82d98120d9ff1.jpg", alt: "Video frame: Sarkhej Roza mosque and tomb complex", focus: "50% 50%", place: "Sarkhej Roza · 8 km", href: "/ar", km: 8, caption: "Tombs, a mosque and palace pavilions around one great tank. Le Corbusier compared it to the Acropolis.", seconds: 30, likes: "8.1k", question: "Tell me about Sarkhej Roza" },
  { id: "reel-pol", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", alt: "Video frame: carved wooden facades in Dhal ni Pol", focus: "50% 40%", place: "Dhal ni Pol · 650 m", href: "/explore", km: 0.65, caption: "Every pol has a chabutro — a carved tower built just to feed the birds.", seconds: 55, likes: "5.6k", question: "What is a pol, and what should I look for in Dhal ni Pol?" },
];

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ReelsScreen() {
  const [feed, setFeed] = useState<"for-you" | "near">("for-you");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [captions, setCaptions] = useStored("captions", true);
  const [liked, setLiked] = useStored<Record<string, boolean>>("liked", { "reel-sidi": true });
  const [saved, setSaved] = useStored<Record<string, boolean>>("saved", {});
  const ask = useAsk();
  const touchY = useRef<number | null>(null);
  const wheelAt = useRef(0);

  const list = feed === "near" ? [...REELS].sort((a, b) => a.km - b.km) : REELS;
  const reel = list[index % list.length];
  const go = (step: number) => {
    setIndex((i) => (i + step + list.length) % list.length);
    setPaused(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") setIndex((i) => (i + 1) % REELS.length);
      if (e.key === "ArrowUp") setIndex((i) => (i - 1 + REELS.length) % REELS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isLiked = liked[reel.id] ?? false;
  const isSaved = saved[reel.id] ?? false;
  const round = { width: "50px", height: "50px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.16)", display: "flex", alignItems: "center", justifyContent: "center" };
  const action = { border: "0", background: "none", color: "#FFFFFF", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "4px", cursor: "pointer", padding: "0" };
  const label = { fontSize: "12px", fontWeight: "700" };

  return (
    <div
      onTouchStart={(e) => {
        touchY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (touchY.current === null) return;
        const dy = e.changedTouches[0].clientY - touchY.current;
        touchY.current = null;
        if (Math.abs(dy) > 60) go(dy < 0 ? 1 : -1);
      }}
      onWheel={(e) => {
        if (Math.abs(e.deltaY) < 30 || Date.now() - wheelAt.current < 700) return;
        wheelAt.current = Date.now();
        go(e.deltaY > 0 ? 1 : -1);
      }}
      style={{ width: "390px", height: "844px", position: "relative", overflow: "hidden", background: "#1E130B", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#FFFFFF" }}
    >
      <button type="button" data-plain aria-label={paused ? "Play reel" : "Pause reel"} onClick={() => setPaused(!paused)} style={{ position: "absolute", inset: "0", padding: "0", border: "0", background: "none", cursor: "pointer", overflow: "hidden" }}>
        <img key={reel.id} src={reel.img} alt={reel.alt} className={`kenburns${paused ? " paused" : ""}`} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: reel.focus, display: "block" }} />
        {paused ? (
          <span className="pop-in" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "76px", height: "76px", margin: "-38px 0 0 -38px", borderRadius: "50%", background: "rgba(20, 12, 6, 0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        ) : null}
      </button>
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "170px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.6) 0%, rgba(20, 12, 6, 0) 100%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "440px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 0%, rgba(20, 12, 6, 0.72) 40%, rgba(20, 12, 6, 0.92) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50px", left: "8px", right: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/home" aria-label="Close reels" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </BackLink>
        <div style={{ display: "flex", gap: "6px" }}>
          {(
            [
              ["for-you", "For you"],
              ["near", "Near me"],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              aria-pressed={feed === id}
              onClick={() => {
                setFeed(id);
                setIndex(0);
                setPaused(false);
              }}
              style={{ height: "44px", padding: "0 12px", border: "0", background: "none", color: feed === id ? "#FFFFFF" : "rgba(255, 255, 255, 0.78)", fontSize: "16px", fontWeight: feed === id ? 800 : 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}
            >
              {text}
              <span style={{ width: "20px", height: "3px", borderRadius: "999px", background: feed === id ? "#F3D9A8" : "transparent" }} />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label={captions ? "Captions on" : "Captions off"}
          aria-pressed={captions}
          onClick={() => {
            setCaptions(!captions);
            toast(captions ? "Captions off" : "Captions on");
          }}
          style={{ width: "44px", height: "44px", border: "0", background: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <span style={{ height: "26px", padding: "0 6px", borderRadius: "6px", background: captions ? "#FFFFFF" : "transparent", border: captions ? "0" : "1.5px solid rgba(255, 255, 255, 0.8)", color: captions ? "#1E130B" : "#FFFFFF", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>CC</span>
        </button>
      </div>
      <div style={{ position: "absolute", right: "12px", bottom: "116px", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
        <button
          type="button"
          aria-label={`${isLiked ? "Unlike" : "Like"}, ${reel.likes} likes`}
          aria-pressed={isLiked}
          onClick={(e) => {
            pop(e.currentTarget.firstElementChild || e.currentTarget, !isLiked);
            setLiked((m) => ({ ...m, [reel.id]: !isLiked }));
          }}
          style={action}
        >
          <span style={round}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? "#F07A5A" : "none"} stroke={isLiked ? "#F07A5A" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </span>
          <span style={label}>{reel.likes}</span>
        </button>
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save"}
          aria-pressed={isSaved}
          onClick={(e) => {
            pop(e.currentTarget.firstElementChild || e.currentTarget, !isSaved);
            setSaved((m) => ({ ...m, [reel.id]: !isSaved }));
            toast(isSaved ? "Removed from Saved" : "Saved — find it under Saved › Stories", isSaved ? "info" : "success");
          }}
          style={action}
        >
          <span style={round}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
          </span>
          <span style={label}>{isSaved ? "Saved" : "Save"}</span>
        </button>
        <button type="button" aria-label="Share" onClick={() => share("Virasa Stories", reel.caption)} style={action}>
          <span style={round}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" x2="12" y1="2" y2="15" />
            </svg>
          </span>
          <span style={label}>Share</span>
        </button>
        <button type="button" aria-label="Ask Virasa AI about this reel" onClick={() => ask(reel.question)} style={action}>
          <span style={{ ...round, background: "#F3D9A8", color: "#2B1B10" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
              <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" />
            </svg>
          </span>
          <span style={label}>Ask AI</span>
        </button>
        <button type="button" aria-label="Next reel" onClick={() => go(1)} style={action}>
          <span style={{ ...round, width: "44px", height: "44px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      </div>
      <div key={reel.id} className="rise" style={{ position: "absolute", left: "20px", right: "84px", bottom: "116px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Link href={reel.href} style={{ alignSelf: "flex-start", height: "36px", padding: "0 12px 0 8px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.18)", border: "1px solid rgba(255, 255, 255, 0.28)", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F3D9A8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{reel.place}</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700" }}>
          <img src="/images/845c09135def6279c007582842533707.png" alt="" style={{ width: "28px", height: "30px", objectFit: "contain", display: "block", background: "#FFFFFF", borderRadius: "8px", padding: "2px" }} />
          <span>Virasa Stories</span>
        </div>
        {captions ? <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.45", color: "#FFFFFF", textWrap: "pretty" }}>{reel.caption}</p> : null}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "600", color: "#E7D3B5" }}>
          <span className={`eq${paused ? " paused" : ""}`} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            Narrated in English · {clock(reel.seconds)}
          </span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "44px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
        <Link href="/navigate" style={{ height: "52px", borderRadius: "14px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "800", textDecoration: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          {" Take me there "}
        </Link>
        <Link href="/story" style={{ height: "52px", borderRadius: "14px", border: "1.5px solid rgba(255, 255, 255, 0.7)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: "700", textDecoration: "none" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </svg>
          {" Full story · 2 min "}
        </Link>
      </div>
      <div style={{ position: "absolute", left: "20px", right: "20px", bottom: "22px", height: "3px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.3)", overflow: "hidden" }}>
        <div key={reel.id} data-timer onAnimationEnd={() => go(1)} style={{ width: "100%", height: "100%", borderRadius: "999px", background: "#F3D9A8", animation: `fill ${reel.seconds}s linear backwards`, animationPlayState: paused ? "paused" : "running" }} />
      </div>
    </div>
  );
}
