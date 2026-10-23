"use client";

// Stories — choose what to hear: search by place, pick up where you left off,
// start any chapter of the full Sidi Saiyyed story, or play a short listen.
// Chapters and listens you have finished are ticked.
import { useState } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import { frame, Tick } from "@/components/ui";
import { useT } from "@/lib/i18n";
import { listenMins, SECRETS } from "@/lib/secrets";
import { useStored } from "@/lib/store";
import { CHAPTER_SECONDS, CHAPTERS } from "../story/script";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const Play = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <polygon points="7 4 19 12 7 20 7 4" />
  </svg>
);

// The full story is about this place; searching for it finds the chapters.
const FULL_STORY_WORDS = "sidi saiyyed mosque jali tree of life ahmedabad";

export default function StoriesScreen() {
  const t = useT();
  const [q, setQ] = useState("");
  const [storyDone] = useStored<Record<number, boolean>>("storyDone", { 0: true });
  const [heard] = useStored<Record<string, boolean>>("heard", {});

  const needle = q.trim().toLowerCase();
  const fullMatches = !needle || FULL_STORY_WORDS.includes(needle) || CHAPTERS.some((c) => c.toLowerCase().includes(needle));
  const chapters = CHAPTERS.map((title, i) => ({ title, i })).filter(({ title }) => !needle || fullMatches || title.toLowerCase().includes(needle));
  const listens = SECRETS.filter((s) => !needle || `${s.title} ${s.tag} ${s.line} ${s.story.join(" ")}`.toLowerCase().includes(needle));
  const nextCh = CHAPTERS.findIndex((_, i) => !storyDone[i]);
  const allDone = nextCh === -1;
  const resume = allDone ? 0 : nextCh;
  const doneCount = CHAPTERS.filter((_, i) => storyDone[i]).length;

  return (
    <div style={frame({ paddingBottom: "40px" })}>
      <div style={{ padding: "54px 12px 0 8px", display: "flex", alignItems: "center", gap: "4px" }}>
        <BackLink href="/home" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>{t("home.stories")}</h1>
      </div>

      {/* Find a story by the place it is about. */}
      <label style={{ margin: "12px 20px 0", height: "52px", padding: "0 6px 0 14px", borderRadius: "16px", background: "#F6F1EA", display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input type="search" enterKeyHint="search" aria-label={t("lib.search")} placeholder={t("lib.search")} value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, width: 0, height: "44px", border: 0, outline: "none", background: "transparent", fontSize: "15px", fontWeight: 600, color: "#2B1B10" }} />
        {q ? (
          <button type="button" aria-label="Clear search" onClick={() => setQ("")} style={{ flex: "0 0 36px", width: "36px", height: "36px", border: 0, borderRadius: "50%", background: "#EFE6DA", color: "#6F5B4B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        ) : null}
      </label>

      {/* Pick up where you left off. */}
      {!needle ? (
        <section aria-label={t("lib.continue")} style={{ margin: "16px 20px 0" }}>
          <Link href={`/story?ch=${resume}`} className="tap-card" style={{ position: "relative", padding: "14px", borderRadius: "22px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", boxShadow: "0 14px 30px rgba(43, 27, 16, 0.22)" }}>
            <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 76px", width: "76px", height: "88px", borderRadius: "38px 38px 12px 12px", objectFit: "cover", display: "block" }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em", color: "#E7B98A" }}>{allDone ? t("lib.again") : t("lib.continue")}</span>
              <span style={{ display: "block", marginTop: "4px", fontSize: "17px", lineHeight: 1.2, fontWeight: 800 }}>{CHAPTERS[resume]}</span>
              <span style={{ display: "block", marginTop: "3px", fontSize: "13px", color: "#D9C6AE" }}>{t("lib.chapter", { n: resume + 1, total: CHAPTERS.length })}</span>
              <span aria-hidden="true" style={{ marginTop: "10px", display: "block", height: "4px", borderRadius: "999px", background: "rgba(251, 246, 238, 0.18)", overflow: "hidden" }}>
                <span className="step-fill" style={{ display: "block", width: `${(doneCount / CHAPTERS.length) * 100}%`, height: "100%", borderRadius: "999px", background: "#F3D9A8" }} />
              </span>
            </span>
            <span aria-hidden="true" style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "50%", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Play size={18} />
            </span>
          </Link>
        </section>
      ) : null}

      {/* The full story, chapter by chapter, ticked as you finish them. */}
      {chapters.length > 0 ? (
        <section style={{ marginTop: "26px" }}>
          <div style={{ padding: "0 20px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "10px" }}>
            <span>
              <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, letterSpacing: "-0.015em" }}>{t("lib.full")}</h2>
              <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6F5B4B" }}>{t("lib.full_hint")}</p>
            </span>
            <span style={{ flex: "0 0 auto", fontSize: "12px", fontWeight: 700, color: "#2F7A4A" }}>{t("lib.progress", { n: doneCount, total: CHAPTERS.length })}</span>
          </div>
          <ol style={{ listStyle: "none", margin: "10px 20px 0", padding: "4px 0", borderRadius: "20px", border: "1px solid #EFE6DA", background: "#FFFFFF" }}>
            {chapters.map(({ title, i }, k) => {
              const done = !!storyDone[i];
              return (
                <li key={title} style={{ margin: "0 12px", borderTop: k ? "1px solid #F3ECE2" : 0 }}>
                  <Link href={`/story?ch=${i}`} aria-label={`${i + 1}. ${title}${done ? `, ${t("lib.listened")}` : ""}`} style={{ minHeight: "62px", padding: "8px 0", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10" }}>
                    <span style={{ flex: "0 0 34px", width: "34px", height: "34px", borderRadius: "50%", background: done ? "#2F7A4A" : i === resume ? "#9A4E36" : "#F6EEE4", color: done || i === resume ? "#FFFFFF" : "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800 }}>
                      {done ? <Tick size={16} width={3} /> : i + 1}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "15px", fontWeight: 700 }}>{title}</span>
                      {done ? <span style={{ display: "block", marginTop: "1px", fontSize: "12px", fontWeight: 700, color: "#2F7A4A" }}>{t("lib.listened")}</span> : null}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#6F5B4B", fontVariantNumeric: "tabular-nums" }}>{clock(CHAPTER_SECONDS.classic[i])}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      {/* Short listens: play here, or open the place to read more. */}
      {listens.length > 0 ? (
        <section style={{ marginTop: "26px" }}>
          <div style={{ padding: "0 20px" }}>
            <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, letterSpacing: "-0.015em" }}>{t("lib.short")}</h2>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#6F5B4B" }}>{t("lib.short_hint")}</p>
          </div>
          <ul style={{ listStyle: "none", margin: "10px 20px 0", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {listens.map((s) => (
              <li key={s.id} className="tap-card" style={{ position: "relative", padding: "10px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ position: "relative", flex: "0 0 56px" }}>
                  {s.img ? <img src={s.img} alt="" style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", display: "block" }} /> : <span aria-hidden="true" style={{ display: "block", width: "56px", height: "56px", borderRadius: "14px", background: "#F6EEE4" }} />}
                  {heard[s.id] ? (
                    <span aria-hidden="true" style={{ position: "absolute", right: "-4px", bottom: "-4px", width: "22px", height: "22px", borderRadius: "50%", background: "#2F7A4A", color: "#FFFFFF", border: "2px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Tick size={11} width={3.4} />
                    </span>
                  ) : null}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/story?s=${s.id}`} className="card-link" style={{ display: "block", fontSize: "15px", fontWeight: 800, color: "#2B1B10", textDecoration: "none" }}>
                    {s.title}
                  </Link>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "13px", color: heard[s.id] ? "#2F7A4A" : "#6F5B4B", fontWeight: heard[s.id] ? 700 : 400 }}>
                    {heard[s.id] ? t("lib.listened") : s.tag} · {t("unit.min", { n: listenMins(s) })}
                  </span>
                </span>
                <span aria-hidden="true" style={{ position: "relative", zIndex: 2, flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <Play />
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {needle && !chapters.length && !listens.length ? (
        <p className="fade-in" style={{ margin: "28px 20px 0", textAlign: "center", fontSize: "15px", color: "#6F5B4B" }}>
          {t("lib.none", { q: q.trim() })}
        </p>
      ) : null}
    </div>
  );
}
