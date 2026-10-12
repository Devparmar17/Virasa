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

const listenStyle: CSSProperties = { flex: "0 0 auto", height: "44px", padding: "0 14px 0 10px", border: 0, borderRadius: "999px", background: "#8A6424", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap", cursor: "pointer" };

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
    distance: "22 min · 1.8 km",
    walk: true,
    rating: "4.9",
    open: "Open now",
    img: "/images/358cd23211709da539c3303890c27e8b.jpg",
    alt: "The Tree of Life stone jali inside Sidi Saiyyed Mosque",
    listen: (
      <Link href="/story" style={listenStyle}>
        <Play />
        Listen 2 min
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
      rating: h.rating || "4.7",
      open: h.open,
      img: h.img,
      alt: h.alt,
      focus: h.focus,
      art: h,
      listen: (
        <Speak text={`${h.title}. ${h.story.join(" ")}`} playingLabel="Stop" style={listenStyle}>
          <Play />
          Listen {listenMins(h)} min
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
    <div className="hscroll" style={{ display: "flex", gap: "14px", padding: "14px 20px 6px" }}>
      {CARDS.map((c) => (
        <article key={c.id} style={{ flex: "0 0 300px", border: "1px solid #EADFD2", borderRadius: "20px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 8px 20px rgba(90, 60, 30, 0.08)", display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", height: "172px" }}>
            <Link href={c.href} aria-label={c.title} style={{ display: "block", width: "100%", height: "100%", textDecoration: "none" }}>
              {c.img ? <img src={c.img} alt={c.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.focus, display: "block" }} /> : c.art ? <Placeholder item={c.art} /> : null}
            </Link>
            <span style={{ position: "absolute", top: "12px", left: "12px", height: "30px", padding: "0 11px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.95)", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "#2B1B10", pointerEvents: "none" }}>
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
              style={{ position: "absolute", top: "8px", right: "8px", width: "40px", height: "40px", border: 0, borderRadius: "50%", background: "rgba(255, 255, 255, 0.95)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(43, 27, 16, 0.16)", cursor: "pointer" }}
              on={<Bookmark on />}
              off={<Bookmark on={false} />}
            />
            <span style={{ position: "absolute", bottom: "12px", left: "12px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "rgba(43, 27, 16, 0.78)", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", pointerEvents: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#F3C267" stroke="none" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {c.rating}
            </span>
            {c.open ? <span style={{ position: "absolute", bottom: "12px", right: "12px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "#E3F1E7", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: 700, color: "#2F7A4A", pointerEvents: "none" }}>{c.open}</span> : null}
          </div>
          <div style={{ flex: 1, padding: "14px 16px 16px", display: "flex", flexDirection: "column" }}>
            <Link href={c.href} style={{ display: "block", textDecoration: "none", color: "#2B1B10" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</h3>
              <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#A0522D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.line}</p>
            </Link>
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: "13px", lineHeight: 1.3, fontWeight: 600, color: "#6F5B4B" }}>{c.fact}</span>
              {c.listen}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
