// 00 · UI foundations


export default function FoundationsScreen() {
  return (
    <div style={{ width: "1800px", height: "1120px", position: "relative", overflow: "hidden", background: "var(--cream)", fontFamily: "inherit", color: "var(--ink)", padding: "64px 80px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <img src="/images/845c09135def6279c007582842533707.png" alt="Virasa logo" style={{ width: "72px", height: "78px", objectFit: "contain", display: "block" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "0.16em", color: "var(--gold)" }}>
            VIRASA HERITAGE AI · UI FOUNDATIONS
          </span>
          <h1 style={{ margin: "0", fontSize: "40px", lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" }}>
            One warm system for every screen, in every Indian city
          </h1>
          <p style={{ margin: "0", fontSize: "16px", color: "var(--ink-soft)" }}>
            Pulled from your home screen: sandstone neutrals, clay for actions, gold for highlights and one sans family. Every text colour passes WCAG AA on the surface it sits on.
          </p>
        </div>
      </header>
      <div style={{ marginTop: "44px", display: "grid", gridTemplateColumns: "1000px minmax(0, 1fr)", gap: "80px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <section>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
              Colour
            </h2>
            <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "20px 16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--ink)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Ink
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #2B1B10
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Headings, body
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--ink-soft)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Ink 2
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #5A4434
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Secondary text
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--ink-muted)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Muted
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #6F5B4B
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Captions · 6.4:1
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--clay)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Clay
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #9A4E36
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Primary actions
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--clay-deep)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Clay deep
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #7E3D29
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Active nav, selected pin
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--gold)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Gold
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #8A6424
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Listen, secondary actions
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--sand-light)", border: "1px solid var(--line)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Surface
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #F6F1EA
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Fields, info boxes
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--sand)", border: "1px solid var(--line)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Sand
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #F6EEE4
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Tags, icon tiles
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--paper)", border: "1px solid var(--line)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Paper
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #FFFFFF
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Screens, cards
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--clay-tint)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Selected
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #FBEDE6
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Chosen chips and rows
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--line)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Line
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #EFE6DA
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Borders, dividers
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ height: "76px", borderRadius: "14px", background: "var(--green)" }} />
                <span style={{ marginTop: "6px", fontSize: "14px", fontWeight: "800" }}>
                  Green
                </span>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-soft)" }}>
                  #2F7A4A
                </span>
                <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
                  Open now, success
                </span>
              </div>
            </div>
            <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "22px", fontSize: "13px", fontWeight: "700" }}>
              <span style={{ color: "var(--ink-muted)", fontWeight: "600" }}>
                Map categories (differ in lightness and icon, not hue alone)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--clay)" }} />
                Monument
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--rust)" }} />
                Food
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--gold)" }} />
                Craft
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--ink-soft)" }} />
                Legend
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "14px", height: "14px", borderRadius: "50%", background: "var(--blue)" }} />
                You
              </span>
            </div>
          </section>
          <section>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
              Components
            </h2>
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <button type="button" style={{ height: "52px", padding: "0 20px", border: "0", borderRadius: "14px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: "700", boxShadow: "0 8px 18px rgba(154, 78, 54, 0.26)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Start walking
              </button>
              <button type="button" style={{ height: "52px", padding: "0 20px", borderRadius: "14px", border: "1.5px solid var(--clay)", background: "var(--paper)", color: "var(--clay)", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", fontWeight: "700" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
                Play story
              </button>
              <button type="button" style={{ height: "44px", padding: "0 14px 0 10px", border: "0", borderRadius: "999px", background: "var(--gold)", color: "var(--paper)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                  <polygon points="7 4 19 12 7 20 7 4" />
                </svg>
                Listen 2 min
              </button>
              <button type="button" style={{ height: "44px", padding: "0 16px", border: "0", borderRadius: "12px", background: "var(--gold-light)", color: "var(--ink)", fontSize: "14px", fontWeight: "700" }}>
                View route
              </button>
              <button type="button" style={{ height: "44px", padding: "0 8px", border: "0", background: "none", color: "var(--clay)", display: "flex", alignItems: "center", gap: "2px", fontSize: "14px", fontWeight: "700" }}>
                See all
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <button type="button" aria-label="Voice search" style={{ width: "48px", height: "48px", border: "0", borderRadius: "12px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>
            </div>
            <div style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" aria-pressed="true" style={{ height: "48px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid var(--clay)", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "700" }}>
                Architecture
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </button>
              <button type="button" aria-pressed="false" style={{ height: "48px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid var(--line-strong)", background: "var(--paper)", color: "var(--ink)", fontSize: "14px", fontWeight: "700" }}>
                Street food
              </button>
              <button type="button" aria-pressed="true" style={{ height: "38px", padding: "0 14px", borderRadius: "999px", border: "0", background: "var(--ink)", color: "var(--paper)", fontSize: "13px", fontWeight: "700" }}>
                All
              </button>
              <button type="button" aria-pressed="false" style={{ height: "38px", padding: "0 14px 0 10px", borderRadius: "999px", border: "1.5px solid var(--line-strong)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "700" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--rust)" }} />
                Food
              </button>
              <span style={{ width: "1px", height: "32px", background: "var(--line-strong)", margin: "0 6px" }} />
              <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "var(--clay-wash)", color: "var(--clay-deep)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
                Monument
              </span>
              <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "#F6DCD2", color: "#8A3A22", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
                Must-taste · 8 PM
              </span>
              <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
                Hidden gem
              </span>
              <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "var(--sand-grey)", color: "var(--ink-soft)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
                Folklore
              </span>
              <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: "var(--green-tint)", color: "var(--green)", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center" }}>
                Open now
              </span>
            </div>
            <div style={{ marginTop: "22px", display: "flex", alignItems: "flex-end", gap: "24px" }}>
              <div style={{ width: "350px", height: "58px", border: "1.5px solid var(--line-deep)", borderRadius: "16px", background: "var(--paper)", display: "flex", alignItems: "center", gap: "12px", padding: "0 6px 0 16px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5A4434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span style={{ flex: "1", fontSize: "15px", color: "var(--ink-muted)" }}>
                  Search monuments, stories or food
                </span>
                <span style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </span>
              </div>
              <div style={{ width: "80px", height: "90px", paddingTop: "16px", border: "1.5px solid var(--line-deep)", borderRadius: "18px", background: "var(--paper)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: "700" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7E3D29" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4.5l-2-2.5h-3l-2 2.5H4a2 2 0 0 1-2-2z" />
                  <path d="M6 7V5.5A1.5 1.5 0 0 1 7.5 4h9A1.5 1.5 0 0 1 18 5.5V7" />
                </svg>
                AR Tour
              </div>
              <nav aria-label="Main" style={{ width: "390px", height: "90px", padding: "10px 4px 24px", background: "#EBCFA3", borderRadius: "24px 24px 0 0", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--clay-deep)", fontSize: "12px", fontWeight: "800" }}>
                  <span style={{ width: "58px", height: "32px", borderRadius: "999px", background: "#FBF1DE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </span>
                  <span>
                    Home
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--bark)", fontSize: "12px", fontWeight: "600" }}>
                  <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                    </svg>
                  </span>
                  <span>
                    Saved
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--bark)", fontSize: "12px", fontWeight: "600" }}>
                  <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  </span>
                  <span>
                    Explore
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--bark)", fontSize: "12px", fontWeight: "600" }}>
                  <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                      <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                      <path fill="currentColor" stroke="none" d="M12 6.6l.85 2.1 2.1.85-2.1.85L12 12.5l-.85-2.1-2.1-.85 2.1-.85z" />
                    </svg>
                  </span>
                  <span>
                    AI Guide
                  </span>
                </span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none", color: "var(--bark)", fontSize: "12px", fontWeight: "600" }}>
                  <span style={{ width: "58px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="4.5" />
                      <path d="M20 21a8 8 0 0 0-16 0" />
                    </svg>
                  </span>
                  <span>
                    Profile
                  </span>
                </span>
              </nav>
            </div>
            <p style={{ margin: "16px 0 0", fontSize: "13px", color: "var(--ink-soft)" }}>
              Bottom nav v4: Home, Saved, Explore, AI Guide, Profile. A frosted bar floating above the edge, labels at 5.9:1, and a tinted pill behind the active icon. Walks open from Home; AR Tour is a Home quick action.
            </p>
          </section>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
          <section>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
              Type · Anek, by Ek Type
            </h2>
            <dl style={{ margin: "14px 0 0", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Display · 28/34 · ExtraBold
                </dt>
                <dd style={{ margin: "0", fontSize: "28px", lineHeight: "1.2", fontWeight: "800", letterSpacing: "-0.02em" }}>
                  Where will your story begin?
                </dd>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Title · 22/28 · ExtraBold
                </dt>
                <dd style={{ margin: "0", fontSize: "22px", lineHeight: "1.25", fontWeight: "800" }}>
                  Sidi Saiyyed Mosque
                </dd>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Section · 20/26 · ExtraBold + accent subtitle 14
                </dt>
                <dd style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
                  {"Heritage highlights "}
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink-muted)" }}>
                    Iconic architecture within reach
                  </span>
                </dd>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Body · 15/22 · Regular
                </dt>
                <dd style={{ margin: "0", fontSize: "15px", lineHeight: "1.5", color: "var(--ink)" }}>
                  Built in 1573, this small mosque is famous for its carved stone jalis.
                </dd>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Label · 12/16 · Bold · +0.12em
                </dt>
                <dd style={{ margin: "0", fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "var(--gold)" }}>
                  PLANNED FOR YOU
                </dd>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <dt style={{ fontSize: "12px", fontWeight: "600", color: "var(--ink-muted)" }}>
                  Indian scripts · Anek, the same family
                </dt>
                <dd style={{ margin: "0", fontSize: "18px", fontWeight: "600", display: "flex", gap: "16px" }}>
                  <span lang="hi">
                    हिन्दी
                  </span>
                  <span lang="gu">
                    ગુજરાતી
                  </span>
                  <span lang="ta">
                    தமிழ்
                  </span>
                  <span lang="bn">
                    বাংলা
                  </span>
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
              {"Spacing, shape & touch"}
            </h2>
            <div style={{ marginTop: "14px", display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "4px", height: "4px", background: "var(--clay)" }} />
                4
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "8px", height: "8px", background: "var(--clay)" }} />
                8
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "12px", height: "12px", background: "var(--clay)" }} />
                12
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "16px", height: "16px", background: "var(--clay)" }} />
                16
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "20px", height: "20px", background: "var(--clay)" }} />
                20
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "24px", height: "24px", background: "var(--clay)" }} />
                24
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "32px", height: "32px", background: "var(--clay)" }} />
                32
              </span>
              <span style={{ marginLeft: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "44px", height: "44px", border: "2px dashed var(--clay)", borderRadius: "10px" }} />
                44 min tap
              </span>
            </div>
            <div style={{ marginTop: "18px", display: "flex", gap: "12px" }}>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "64px", height: "48px", borderRadius: "12px", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                12 thumb
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "64px", height: "48px", borderRadius: "16px", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                16 button
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "64px", height: "48px", borderRadius: "20px", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                20 card
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "64px", height: "48px", borderRadius: "24px 24px 0 0", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                24 sheet
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "64px", height: "48px", borderRadius: "999px", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                Pill
              </span>
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "700", color: "var(--ink-soft)" }}>
                <span style={{ width: "48px", height: "52px", borderRadius: "24px 24px 6px 6px", background: "var(--sand)", border: "1px solid var(--line-strong)" }} />
                Arch frame
              </span>
            </div>
            <p style={{ margin: "14px 0 0", fontSize: "13px", color: "var(--ink-soft)" }}>
              20 px screen gutter · 4-pt spacing · the arch frame is reserved for hero story moments.
            </p>
          </section>
          <section>
            <h2 style={{ margin: "0", fontSize: "20px", fontWeight: "800" }}>
              Icons
            </h2>
            <div style={{ marginTop: "14px", display: "flex", gap: "18px", color: "var(--ink)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="6" cy="19" r="3" />
                <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                <circle cx="18" cy="5" r="3" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" x2="21" y1="22" y2="22" />
                <line x1="6" x2="6" y1="18" y2="11" />
                <line x1="10" x2="10" y1="18" y2="11" />
                <line x1="14" x2="14" y1="18" y2="11" />
                <line x1="18" x2="18" y1="18" y2="11" />
                <polygon points="12 2 20 7 4 7" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 4h18" />
                <path d="M5 8h14" />
                <path d="M7 12h10" />
                <path d="M9 16h6" />
                <path d="M11 20h2" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                <path d="M7 2v20" />
                <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: "13px", color: "var(--ink-soft)" }}>
              Outline icons on a 24 px grid, 1.9 stroke, rounded ends. Filled only for play and rating.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
