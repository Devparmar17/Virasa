// 05 · Home (v2) — one focal walk, a light row of shortcuts, then calm sections
// that share one card style. Everything from the first Home is still one tap away.
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import MainNav from "@/components/MainNav";
import LangButton from "@/components/LangButton";
import VoiceSearch from "@/components/VoiceSearch";
import Highlights from "@/components/Highlights";
import { MarkOnboarded } from "@/components/Prefs";
import { Greeting } from "@/components/User";
import { frame } from "@/components/ui";
import { T, type Key } from "@/lib/i18n";
import { Elsewhere, HereCity, HereGate } from "@/components/Here";

const INK = "#2B1B10";
const MUTED = "#6F5B4B";
const BRAND = "#9A4E36";

const Chevron = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// Every section opens the same way: a title, and "see all" when there is more.
function SectionHead({ title, more }: { title: Key; more?: { href: string; label: Key } }) {
  return (
    <div style={{ padding: "0 12px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800, letterSpacing: "-0.015em" }}>
        <T k={title} />
      </h2>
      {more ? (
        <Link href={more.href} style={{ height: "44px", padding: "0 8px", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: 700, color: BRAND, whiteSpace: "nowrap" }}>
          <T k={more.label} />
          <Chevron />
        </Link>
      ) : null}
    </div>
  );
}

const ACTIONS: { href: string; label: Key; icon: ReactNode }[] = [
  {
    href: "/ar",
    label: "home.ar",
    icon: (
      <>
        <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
        <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
      </>
    ),
  },
  {
    href: "/stories",
    label: "home.stories",
    icon: <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />,
  },
  {
    href: "/reels",
    label: "home.reels",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="m10 8.5 5 3.5-5 3.5z" />
      </>
    ),
  },
  {
    href: "/tickets",
    label: "home.tickets",
    icon: (
      <>
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2M13 17v2M13 11v2" />
      </>
    ),
  },
  {
    href: "/games",
    label: "home.games",
    icon: (
      <>
        <path d="M6 11h4M8 9v4" />
        <path d="M15 12h.01M18 10h.01" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59l-.69 6.2A3 3 0 0 0 7.94 17l1.4-1.4A2 2 0 0 1 10.76 15h2.48a2 2 0 0 1 1.42.59L16.06 17a3 3 0 0 0 5.93-2.2l-.69-6.21A4 4 0 0 0 17.32 5Z" />
      </>
    ),
  },
];

const SECRETS: { href: string; img: string; alt: string; tag: Key; title: string; meta: ReactNode }[] = [
  { href: "/secret?id=dhal", img: "/images/6b114a4ce322f517be6c561ea38233e8.jpg", alt: "Carved wooden facades in Dhal ni Pol", tag: "home.tag_gem", title: "Dhal ni Pol woodcarvings", meta: <><T k="unit.m" v={{ n: 650 }} /> · <T k="unit.min_walk" v={{ n: 8 }} /></> },
  { href: "/secret?id=manek", img: "/images/manek-chowk.jpg", alt: "Food stalls at Manek Chowk at night", tag: "home.tag_taste", title: "Manek Chowk night market", meta: <><T k="home.from_8pm" /> · <T k="unit.km" v={{ n: 1.1 }} /></> },
  { href: "/secret?id=bhadra", img: "/images/bhadra-fort.jpg", alt: "The gate and tower of Bhadra Fort", tag: "home.tag_folk", title: "Bhadra Fort's secret tunnels", meta: <><T k="unit.km" v={{ n: 1.4 }} /> · <T k="unit.min_walk" v={{ n: 18 }} /></> },
];

const CITIES: { id: "jaipur" | "varanasi" | "hampi" | "kolkata"; img: string; alt: string }[] = [
  { id: "jaipur", img: "/images/amber-fort.jpg", alt: "Amber Fort, Jaipur" },
  { id: "varanasi", img: "/images/varanasi-ghats.jpg", alt: "Boats on the Ganga at Varanasi at sunrise" },
  { id: "hampi", img: "/images/hampi-chariot.jpg", alt: "The stone chariot at Vittala Temple, Hampi" },
  { id: "kolkata", img: "/images/victoria-memorial.jpg", alt: "Victoria Memorial, Kolkata" },
];

const shade: CSSProperties = { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20, 12, 6, 0) 30%, rgba(20, 12, 6, 0.82) 100%)" };

export default function HomeScreen() {
  return (
    <div style={frame({ background: "#FFFFFF", paddingBottom: "112px" })}>
      <header style={{ padding: "50px 12px 0 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <Link href="/city" aria-label="Change city" style={{ flex: "1 1 auto", minWidth: 0, height: "44px", padding: "0 8px", borderRadius: "999px", display: "flex", alignItems: "center", gap: "8px", color: INK, textDecoration: "none" }}>
          <span style={{ flex: "0 0 30px", width: "30px", height: "30px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.15, minWidth: 0 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: MUTED }}>
              <T k="home.youre_in" />
            </span>
            <span style={{ fontSize: "15px", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <HereCity />
            </span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 16px" }}>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Link>
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "2px" }}>
          <LangButton
            style={{ height: "44px", padding: "0 4px", border: "0", background: "none", display: "flex", alignItems: "center", cursor: "pointer" }}
            pillStyle={{ height: "34px", padding: "0 10px", borderRadius: "999px", background: "#F6EEE4", color: "#6E4E1E", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", fontWeight: 700 }}
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m5 8 6 6" />
                <path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
            }
          />
          <Link href="/safety" aria-label="SOS: emergency numbers and help" style={{ height: "44px", padding: "0 0 0 4px", display: "flex", alignItems: "center" }}>
            <span style={{ height: "34px", padding: "0 11px", borderRadius: "999px", background: "#B03A2E", color: "#FFFFFF", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800, letterSpacing: "0.06em", boxShadow: "0 4px 10px rgba(176, 58, 46, 0.28)" }}>
              SOS
            </span>
          </Link>
        </div>
      </header>

      <main>
        <div style={{ padding: "14px 20px 0" }}>
          <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: MUTED }}>
            <Greeting />
          </p>
          <h1 style={{ margin: "4px 0 0", fontSize: "28px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.025em", textWrap: "balance" }}>
            <T k="home.title" />
          </h1>
        </div>

        <div style={{ margin: "16px 20px 0", height: "54px", borderRadius: "16px", background: "#F6F1EA", display: "flex", alignItems: "center", padding: "0 5px 0 0" }}>
          <Link href="/search" style={{ flex: 1, minWidth: 0, height: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "0 8px 0 16px", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span style={{ flex: 1, fontSize: "15px", color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              <T k="home.search" />
            </span>
          </Link>
          <VoiceSearch style={{ flex: "0 0 44px", width: "44px", height: "44px", border: "0", borderRadius: "12px", background: "#FFFFFF", color: BRAND, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 3px rgba(60, 36, 20, 0.12)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </VoiceSearch>
        </div>

        {/* AI first: plan a whole trip, or find what locals love, in any city. */}
        <nav aria-label="Plan with AI" style={{ margin: "14px 20px 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
          <Link href="/trip" style={{ minHeight: "96px", padding: "14px", borderRadius: "20px", background: "linear-gradient(140deg, #9A4E36 0%, #7E3D29 100%)", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px", textDecoration: "none", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.26)" }}>
            <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(255, 255, 255, 0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2l2.2 6.3L20.5 10.5l-6.3 2.2L12 19l-2.2-6.3L3.5 10.5l6.3-2.2z" />
              </svg>
            </span>
            <span>
              <span style={{ display: "block", fontSize: "16px", fontWeight: 800, lineHeight: 1.2 }}>
                <T k="home.plan_ai" />
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.86)", lineHeight: 1.3 }}>
                <T k="home.plan_ai_sub" />
              </span>
            </span>
          </Link>
          <Link href="/discover" style={{ minHeight: "96px", padding: "14px", borderRadius: "20px", background: "#F6EEE4", color: INK, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px", textDecoration: "none" }}>
            <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#FFFFFF", color: "#8A6424", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
              </svg>
            </span>
            <span>
              <span style={{ display: "block", fontSize: "16px", fontWeight: 800, lineHeight: 1.2 }}>
                <T k="home.discover" />
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "12px", fontWeight: 600, color: MUTED, lineHeight: 1.3 }}>
                <T k="home.discover_sub" />
              </span>
            </span>
          </Link>
        </nav>

        {/* Away from Ahmedabad, Home is about the city the traveller is in. */}
        <HereGate elsewhere={<Elsewhere />}>
        {/* The one thing to do next: today's planned walk. */}
        <section aria-label="Planned for you" style={{ margin: "20px 20px 0" }}>
          <Link href="/walk" style={{ position: "relative", height: "216px", borderRadius: "22px", overflow: "hidden", display: "block", color: "#FFFFFF", textDecoration: "none", boxShadow: "0 14px 30px rgba(60, 36, 20, 0.18)" }}>
            <img src="/images/6b114a4ce322f517be6c561ea38233e8.jpg" alt="" className="kenburns" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span aria-hidden="true" style={{ ...shade, background: "linear-gradient(180deg, rgba(20, 12, 6, 0.05) 0%, rgba(20, 12, 6, 0.86) 100%)" }} />
            <span style={{ position: "absolute", top: "14px", left: "14px", height: "28px", padding: "0 10px", borderRadius: "999px", background: "rgba(255, 255, 255, 0.92)", color: INK, display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.04em" }}>
              <span aria-hidden="true" style={{ width: "7px", height: "7px", borderRadius: "50%", background: BRAND }} />
              <T k="home.planned" />
            </span>
            <span style={{ position: "absolute", left: "18px", right: "16px", bottom: "16px" }}>
              <span style={{ display: "block", fontSize: "23px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>
                <T k="home.walk_title" />
              </span>
              <span style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255, 255, 255, 0.88)" }}>
                  <T k="home.walk_meta" />
                </span>
                <span style={{ flex: "0 0 auto", height: "44px", padding: "0 16px", borderRadius: "999px", background: "#FFFFFF", color: INK, display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 800 }}>
                  <T k="home.start_walk" />
                  <Chevron />
                </span>
              </span>
            </span>
          </Link>
        </section>
        </HereGate>

        <nav aria-label="Quick actions" style={{ margin: "22px 12px 0", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
          {ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} style={{ padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "7px", textDecoration: "none", color: INK }}>
              <span style={{ width: "54px", height: "54px", borderRadius: "18px", background: "#F6EEE4", color: "#7E3D29", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {a.icon}
                </svg>
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700 }}>
                <T k={a.label} />
              </span>
            </Link>
          ))}
        </nav>

        <HereGate>
        <section style={{ marginTop: "30px" }}>
          <SectionHead title="home.highlights" more={{ href: "/explore", label: "home.map" }} />
          <Highlights />
        </section>

        <section style={{ marginTop: "26px" }}>
          <SectionHead title="home.secrets" />
          <ul style={{ listStyle: "none", margin: "8px 20px 0", padding: "4px 0", borderRadius: "20px", border: "1px solid #EFE6DA", background: "#FFFFFF" }}>
            {SECRETS.map((s, i) => (
              <li key={s.href} style={{ borderTop: i ? "1px solid #F3ECE2" : "0", margin: "0 12px" }}>
                <Link href={s.href} style={{ minHeight: "76px", padding: "10px 0", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: INK }}>
                  <img src={s.img} alt={s.alt} style={{ flex: "0 0 56px", width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
                  <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#8A6424" }}>
                      <T k={s.tag} />
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
                    <span style={{ fontSize: "13px", color: MUTED }}>{s.meta}</span>
                  </span>
                  <span style={{ color: "#B5A391" }}>
                    <Chevron size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Play and learn" style={{ margin: "26px 20px 0" }}>
          <Link href="/quiz" style={{ minHeight: "84px", padding: "14px 14px 14px 16px", borderRadius: "20px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none" }}>
            <span style={{ flex: "0 0 48px", width: "48px", height: "48px", borderRadius: "14px", background: "#F3D9A8", color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#E7B98A" }}>
                <T k="home.quiz_label" />
              </span>
              <span style={{ display: "block", marginTop: "3px", fontSize: "16px", fontWeight: 800 }}>
                <T k="home.quiz_title" />
              </span>
            </span>
            <Chevron size={18} />
          </Link>
        </section>
        </HereGate>

        <section style={{ marginTop: "28px" }}>
          <SectionHead title="home.next_city" more={{ href: "/city", label: "home.all_cities" }} />
          <div className="hscroll" style={{ display: "flex", gap: "12px", padding: "10px 20px 4px" }}>
            {CITIES.map((c) => (
              <Link key={c.id} href={`/plan?city=${c.id}`} style={{ position: "relative", flex: "0 0 148px", height: "184px", borderRadius: "18px", overflow: "hidden", display: "block", color: "#FFFFFF", textDecoration: "none" }}>
                <img src={c.img} alt={c.alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span aria-hidden="true" style={shade} />
                <span style={{ position: "absolute", left: "12px", right: "12px", bottom: "12px" }}>
                  <span style={{ display: "block", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em" }}><T k={`city.${c.id}`} /></span>
                  <span style={{ display: "block", marginTop: "1px", fontSize: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.85)" }}><T k={`city.${c.id}_tag`} /></span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <MainNav active="home" />
      <MarkOnboarded />
    </div>
  );
}
