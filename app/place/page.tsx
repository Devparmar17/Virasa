// 09 · Place detail
import Link from "next/link";
import BackLink from "@/components/Back";
import { Tap, Toggle } from "@/components/Tap";
import Speak from "@/components/Speak";
import SheetButton from "@/components/SheetButton";

export default function PlaceScreen() {
  return (
    <div style={{ width: "390px", height: "2168px", position: "relative", overflow: "hidden", background: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#2B1B10" }}>
      <div style={{ position: "relative", height: "340px" }}>
        <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="The Tree of Life jali seen from inside Sidi Saiyyed Mosque" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "130px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.45) 0%, rgba(20, 12, 6, 0) 100%)" }} />
        <div style={{ position: "absolute", top: "50px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between" }}>
          <BackLink href="/home" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </BackLink>
          <div style={{ display: "flex", gap: "10px" }}>
            <Toggle storeKey="saved" field="sidi" onLabel="Saved. Remove from saved" offLabel="Save" onToast="Saved — find it under Saved" offToast="Removed from Saved" style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)", cursor: "pointer" }}
              on={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9A4E36" stroke="#9A4E36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
              off={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
            />
            <Tap aria-label="Share" shareTitle="Sidi Saiyyed Mosque" shareText="Home of the Tree of Life jali — on Virasa" style={{ width: "44px", height: "44px", border: "0", borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </Tap>
          </div>
        </div>
        <Tap aria-label="View all photos" href="/gallery" style={{ position: "absolute", right: "16px", bottom: "36px", height: "40px", padding: "0 14px", border: "0", borderRadius: "999px", background: "rgba(43, 27, 16, 0.78)", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21" />
          </svg>
          <span>
            1 / 5
          </span>
        </Tap>
      </div>
      <main style={{ position: "relative", marginTop: "-24px", borderRadius: "24px 24px 0 0", background: "#FFFFFF", padding: "22px 20px 120px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "#F6E3DA", color: "#7E3D29", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            Monument
          </span>
          <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
            1573 · Gujarat Sultanate
          </span>
        </div>
        <h1 style={{ margin: "12px 0 0", fontSize: "28px", lineHeight: "1.15", fontWeight: "800", letterSpacing: "-0.02em" }}>
          Sidi Saiyyed Mosque
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "15px", color: "#6F5B4B", fontWeight: "500" }}>
          Home of the Tree of Life jali
        </p>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: "#5A4434" }}>
          <a href="https://www.google.com/maps/search/?api=1&query=Sidi%20Saiyyed%20Mosque%2C%20Ahmedabad" target="_blank" rel="noopener noreferrer" style={{ minHeight: "32px", display: "flex", alignItems: "center", gap: "4px", color: "#2F7A4A", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "3px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Hours on Maps
          </a>
          <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#B9A894" }} />
          <span>
            22 min walk
          </span>
        </div>
        <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
          <Link href="/story" style={{ height: "48px", borderRadius: "14px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
            <span>
              Play story · 2:20
            </span>
          </Link>
          <Link href="/lens" style={{ height: "48px", borderRadius: "14px", border: "1.5px solid #9A4E36", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px", fontWeight: "700", textDecoration: "none" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {" Scan with AI Lens "}
          </Link>
        </div>
        <section style={{ marginTop: "22px", padding: "18px", borderRadius: "18px", background: "#F6F1EA", border: "1px solid #EFE6DA" }}>
          <p style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", color: "#8A6424" }}>
            THE STORY IN 30 SECONDS
          </p>
          <p style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#2B1B10", textWrap: "pretty" }}>
            {"Built in 1573 by Sidi Saiyyed, an Abyssinian noble in the Gujarat Sultanate's army, this small mosque was left unfinished when the Mughals took the city. Its carved stone jalis — above all the Tree of Life — became Ahmedabad's unofficial symbol."}
          </p>
          <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Speak text="Built in 1573 by Sidi Saiyyed, an Abyssinian noble in the Gujarat Sultanate&apos;s army, this small mosque was left unfinished when the Mughals took the city. Its carved stone jalis, above all the Tree of Life, became Ahmedabad&apos;s unofficial symbol." style={{ height: "44px", padding: "0 14px 0 10px", border: "0", borderRadius: "12px", background: "#2B1B10", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              {" Listen · 0:30 "}
            </Speak>
            <SheetButton title="History of the mosque" label="Read full history" style={{ height: "44px", padding: "0 10px", border: "0", background: "none", color: "#9A4E36", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              <p>Sidi Saiyyed came to Gujarat from Abyssinia (today&apos;s Ethiopia) and rose in the service of the Gujarat Sultanate. In 1572–73, the sultanate&apos;s final year, he began this small mosque beside the city wall at Lal Darwaja.</p>
              <p>The building is modest — a single arcaded prayer hall with no courtyard minarets — but its west wall holds ten stone screens. Eight are geometric. Two, flanking the central arch, show trees whose branches fold back on themselves like lace: the Tree of Life.</p>
              <p>The central arch is filled with plain stone. The usual explanation is that work stopped when Akbar&apos;s Mughal army took Gujarat in 1573, before its screen could be carved.</p>
              <p>Under British rule the mosque was used as a government office for a time, and paper casts of the jalis were sent to museums in London and New York. In 1961 the new Indian Institute of Management Ahmedabad based its emblem on the tree, and the screen has stood for the city ever since.</p>
            </SheetButton>
          </div>
        </section>
        <section id="chapters" style={{ marginTop: "30px", scrollMarginTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontSize: "19px", fontWeight: "800" }}>
              Story chapters
            </h2>
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
              4 parts · 2:20
            </span>
          </div>
          <ol style={{ listStyle: "none", margin: "10px 0 0", padding: "0", display: "flex", flexDirection: "column" }}>
            <li>
              <Link href="/story" style={{ minHeight: "60px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", borderBottom: "1px solid #F3ECE2" }}>
                <span style={{ flex: "0 0 32px", width: "32px", height: "32px", borderRadius: "50%", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span style={{ flex: "1", fontSize: "15px", fontWeight: "700" }}>
                  Who was Sidi Saiyyed?
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                  0:40
                </span>
              </Link>
            </li>
            <li>
              <Link href="/story" style={{ minHeight: "60px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", borderBottom: "1px solid #F3ECE2" }}>
                <span style={{ flex: "0 0 32px", width: "32px", height: "32px", borderRadius: "50%", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <polygon points="7 4 19 12 7 20 7 4" />
                  </svg>
                </span>
                <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    Reading the Tree of Life
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#9A4E36" }}>
                    Up next
                  </span>
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                  0:50
                </span>
              </Link>
            </li>
            <li>
              <Link href="/story" style={{ minHeight: "60px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10", borderBottom: "1px solid #F3ECE2" }}>
                <span style={{ flex: "0 0 32px", width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #D9C7B3", color: "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800" }}>
                  3
                </span>
                <span style={{ flex: "1", fontSize: "15px", fontWeight: "700" }}>
                  The window left blank
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                  0:30
                </span>
              </Link>
            </li>
            <li>
              <Link href="/story" style={{ minHeight: "60px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#2B1B10" }}>
                <span style={{ flex: "0 0 32px", width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #D9C7B3", color: "#5A4434", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800" }}>
                  4
                </span>
                <span style={{ flex: "1", fontSize: "15px", fontWeight: "700" }}>
                  From stone screen to a logo
                </span>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#6F5B4B" }}>
                  0:20
                </span>
              </Link>
            </li>
          </ol>
        </section>
        <section style={{ marginTop: "30px" }}>
          <h2 style={{ margin: "0", fontSize: "19px", fontWeight: "800" }}>
            Look for these on site
          </h2>
          <div className="hscroll" style={{ margin: "12px -20px 0", padding: "0 20px", display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none" }}>
            <article style={{ flex: "0 0 210px", border: "1px solid #EFE6DA", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF" }}>
              <div style={{ position: "relative", height: "112px" }}>
                <img src="/images/358cd23211709da539c3303890c27e8b.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", width: "26px", height: "26px", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  1
                </span>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "800" }}>
                  The Tree of Life
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: "1.4", color: "#5A4434" }}>
                  Intertwined trees and curling palm fronds, all cut from stone
                </p>
              </div>
            </article>
            <article style={{ flex: "0 0 210px", border: "1px solid #EFE6DA", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF" }}>
              <div style={{ position: "relative", height: "112px", background: "#EFE1C9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/images/sidi-lattice.jpg" alt="A geometric stone screen in a side arch of the mosque" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", display: "block" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", width: "26px", height: "26px", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  2
                </span>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "800" }}>
                  Geometric lattices
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: "1.4", color: "#5A4434" }}>
                  Repeating star-and-square screens in the side arches
                </p>
              </div>
            </article>
            <article style={{ flex: "0 0 210px", border: "1px solid #EFE6DA", borderRadius: "16px", overflow: "hidden", background: "#FFFFFF" }}>
              <div style={{ position: "relative", height: "112px", background: "#EFE1C9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/images/sidi-exterior.jpg" alt="The west wall of the mosque, with its row of arches" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 45%", display: "block" }} />
                <span style={{ position: "absolute", top: "8px", left: "8px", width: "26px", height: "26px", borderRadius: "50%", background: "#2B1B10", color: "#FFFFFF", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  3
                </span>
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "800" }}>
                  The blank arch
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: "1.4", color: "#5A4434" }}>
                  Filled with plain stone — the work stopped here
                </p>
              </div>
            </article>
          </div>
        </section>
        <section style={{ marginTop: "30px" }}>
          <h2 style={{ margin: "0", fontSize: "19px", fontWeight: "800" }}>
            Before you go
          </h2>
          <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
            <div style={{ padding: "14px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
                Dress
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.3" }}>
                Cover shoulders and knees
              </span>
            </div>
            <div style={{ padding: "14px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
                Time needed
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.3" }}>
                20–30 minutes
              </span>
            </div>
            <div style={{ padding: "14px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
                Best light
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.3" }}>
                Late afternoon
              </span>
            </div>
            <div style={{ padding: "14px", borderRadius: "14px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9A4E36" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#6F5B4B" }}>
                Entry
              </span>
              <span style={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.3" }}>
                Free
              </span>
            </div>
          </div>
          <div style={{ marginTop: "12px", display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "13px", lineHeight: "1.45", color: "#5A4434" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "0 0 18px", marginTop: "1px" }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>
              Open daily, 7 AM – 6 PM, at Lal Darwaja. Visits pause during prayer times.
            </span>
          </div>
          <Link href="/tickets?book=sidi-guided" style={{ marginTop: "14px", minHeight: "64px", padding: "10px 14px", borderRadius: "16px", background: "#2B1B10", color: "#FBF6EE", display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
            <span style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: "#F3D9A8", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0" }}>
              <span style={{ display: "block", fontSize: "15px", fontWeight: "800" }}>
                Visit with a heritage guide
              </span>
              <span style={{ display: "block", marginTop: "2px", fontSize: "12px", color: "#D9C6AE" }}>
                45 min · from ₹150 · reserve now, pay there
              </span>
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
          </Link>
        </section>
        <section style={{ marginTop: "30px" }}>
          <h2 style={{ margin: "0", fontSize: "19px", fontWeight: "800" }}>
            Nearby, on foot
          </h2>
          <div className="hscroll" style={{ margin: "12px -20px 0", padding: "0 20px", display: "flex", gap: "12px", overflowX: "auto", scrollbarWidth: "none" }}>
            <article style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <img src="/images/bhadra-fort.jpg" alt="The gate and tower of Bhadra Fort" style={{ width: "100%", height: "110px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
              <span style={{ fontSize: "15px", fontWeight: "800" }}>
                Bhadra Fort
              </span>
              <span style={{ marginTop: "-4px", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                450 m · 6 min
              </span>
            </article>
            <article style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <img src="/images/teen-darwaza.jpg" alt="The three arches of Teen Darwaza" style={{ width: "100%", height: "110px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
              <span style={{ fontSize: "15px", fontWeight: "800" }}>
                Teen Darwaza
              </span>
              <span style={{ marginTop: "-4px", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                750 m · 9 min
              </span>
            </article>
            <article style={{ flex: "0 0 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <img src="/images/jama-masjid.jpg" alt="The courtyard of Jama Masjid, Ahmedabad" style={{ width: "100%", height: "110px", borderRadius: "14px", objectFit: "cover", display: "block" }} />
              <span style={{ fontSize: "15px", fontWeight: "800" }}>
                Jama Masjid
              </span>
              <span style={{ marginTop: "-4px", fontSize: "12px", fontWeight: "600", color: "#6F5B4B" }}>
                1.1 km · 13 min
              </span>
            </article>
          </div>
        </section>
      </main>
      <div className="nav-rail">
        <div style={{ padding: "12px 20px 30px", background: "#FFFFFF", borderTop: "1px solid #EFE6DA", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)", display: "flex", gap: "10px" }}>
        <Link href="/walk" aria-label="Add to a heritage walk" style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "14px", border: "1.5px solid #E2D3C1", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Link>
        <Link href="/navigate" style={{ flex: "1", height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 8px 18px rgba(154, 78, 54, 0.26)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
          <span>
            Start walking · 22 min
          </span>
        </Link>
        </div>
      </div>
    </div>
  );
}
