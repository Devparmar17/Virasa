import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import Speak from "./Speak";
import { Toggle } from "./Tap";
import { HIGHLIGHTS, KIND, listenMins, type Secret } from "@/lib/secrets";

// Home's "Heritage highlights" row: one card per monument, each opening its
// description, with save and listen on the card itself.

type Card = {
  id: string;
  href: string;
  title: string;
  line: string;
  fact: string;
  distance: string;
  walk?: boolean;
  rating: string;
  open?: string;
  img?: string;
  alt: string;
  focus?: string;
  art?: Secret;
  listen: ReactNode;
};

// Listen sits beside the title as a quiet round button; the card itself is the main target.
const listenStyle: CSSProperties = { position: "relative", zIndex: 2, flex: "0 0 44px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "11px", fontWeight: 800, textDecoration: "none", cursor: "pointer" };

const Play = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <polygon points="7 4 19 12 7 20 7 4" />
  </svg>
);

const Bookmark = ({ on }: { on: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "#9A4E36" : "none"} stroke={on ? "#9A4E36" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

// The place with a full page and a recorded story comes first; the rest come from the library.
const CARDS: Card[] = [
  {
    id: "sidi",
    href: "/place",
    title: "Sidi Saiyyed Mosque",
    line: "Famous Tree of Life jali stonework",
    fact: "1573 · Gujarat Sultanate",
    distance: "1.8 km · 22 min walk",
    walk: true,
    rating: "",
    open: "Visit by day",
    img: "/images/358cd23211709da539c3303890c27e8b.jpg",
    alt: "The Tree of Life stone jali inside Sidi Saiyyed Mosque",
    listen: (
      <Link href="/story" aria-label="Listen to the story, 2 min" style={listenStyle}>
        <Play />
      </Link>
    ),
  },
  ...HIGHLIGHTS.map(
    (h): Card => ({
      id: h.id,
      href: `/secret?id=${h.id}`,
      title: h.title,
      line: h.line,
      fact: h.fact || h.tag,
      distance: h.distance,
      walk: h.walk,
      rating: "",
      open: h.open,
      img: h.img,
      alt: h.alt,
      focus: h.focus,
      art: h,
      listen: (
        <Speak text={`${h.title}. ${h.story.join(" ")}`} playingLabel="" label={`Listen, ${listenMins(h)} min`} style={listenStyle}>
          <Play />
        </Speak>
      ),
    })
  ),
];

function Placeholder({ item }: { item: Secret }) {
  const k = KIND[item.kind];
  return (
    <span role="img" aria-label={`Illustration: ${item.alt}`} style={{ width: "100%", height: "100%", background: k.tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke={k.ink} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 21h20" />
        <path d="M4 21V11h16v10" />
        <path d="M6 11a6 6 0 0 1 12 0" />
        <path d="M12 5V2" />
        <path d="M8 21v-5a1 1 0 0 1 2 0v5" />
        <path d="M14 21v-5a1 1 0 0 1 2 0v5" />
      </svg>
    </span>
  );
}

export default function Highlights() {
  return (
    <div className="hscroll" style={{ display: "flex", gap: "14px", padding: "12px 20px 8px" }}>
      {CARDS.map((c) => (
        <article key={c.id} className="tap-card" style={{ position: "relative", flex: "0 0 272px", border: "1px solid #EFE6DA", borderRadius: "20px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 6px 18px rgba(90, 60, 30, 0.07)", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", height: "156px" }}>
            {c.img ? <img src={c.img} alt={c.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.focus, display: "block" }} /> : c.art ? <Placeholder item={c.art} /> : null}
            <span style={{ position: "absolute", left: "10px", bottom: "10px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.94)", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "#2B1B10" }}>
              {c.walk ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
                  <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                  <path d="M9 17h6" />
                </svg>
              )}
              <span>{c.distance}</span>
            </span>
            <Toggle
              storeKey="saved"
              field={c.id}
              onLabel={`Saved. Remove ${c.title} from saved`}
              offLabel={`Save ${c.title}`}
              onToast="Saved — find it under Saved"
              offToast="Removed from Saved"
              style={{ position: "absolute", zIndex: 2, top: "8px", right: "8px", width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              on={<Bookmark on />}
              off={<Bookmark on={false} />}
            />
          </div>
          <div style={{ flex: 1, padding: "12px 12px 14px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* The title's link stretches over the whole card, so the card is one big target. */}
              <Link href={c.href} className="card-link" style={{ display: "block", textDecoration: "none", color: "#2B1B10" }}>
                <h3 style={{ margin: 0, fontSize: "17px", lineHeight: 1.25, fontWeight: 800, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.title}</h3>
              </Link>
              <p style={{ margin: "3px 0 0", fontSize: "13px", lineHeight: 1.35, color: "#6F5B4B", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.line}</p>
              <p style={{ margin: "6px 0 0", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 700, color: "#2B1B10", whiteSpace: "nowrap" }}>
                {c.open ? <span style={{ color: "#2F7A4A" }}>{c.open}</span> : null}
                <span style={{ fontWeight: 600, color: "#6F5B4B" }}>{c.open ? "· " : ""}{(/^\d{4}$/.test(c.fact.split(" · ")[0]) ? `Built ${c.fact.split(" · ")[0]}` : c.fact.split(" · ")[0])}</span>
              </p>
            </div>
            {c.listen}
          </div>
        </article>
      ))}
    </div>
  );
}
