// 21 · Play & learn
import Link from "next/link";
import BackLink from "@/components/Back";
import MainNav from "@/components/MainNav";
import { Tap } from "@/components/Tap";
import { Points, StampBar, StampCount } from "@/components/Stamps";
import { T } from "@/lib/i18n";

export default function GamesScreen() {
  return (
    <div style={{ width: "390px", height: "1110px", position: "relative", overflow: "hidden", background: "var(--paper)", fontFamily: "inherit", color: "var(--ink)" }}>
      <div style={{ padding: "54px 16px 0 8px", height: "98px", display: "flex", alignItems: "center", gap: "8px" }}>
        <BackLink href="/home" aria-label="Back" style={{ flex: "0 0 44px", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <h1 style={{ flex: "1", margin: "0", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.01em" }}>
          <T k="gm.title" />
        </h1>
        <span style={{ height: "32px", padding: "0 12px", borderRadius: "999px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "13px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#C8902B" stroke="none" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>
            <Points />
          </span>
        </span>
      </div>
      <p style={{ margin: "8px 20px 0", fontSize: "14px", lineHeight: "1.45", color: "var(--ink-soft)" }}>
        <T k="gm.sub" />
      </p>
      <Link href="/quiz" style={{ position: "relative", overflow: "hidden", margin: "16px 20px 0", padding: "18px", borderRadius: "20px", background: "var(--ink)", color: "var(--cream)", display: "flex", gap: "14px", textDecoration: "none" }}>
        <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "20px", fontWeight: "800", lineHeight: "1.2" }}>
            Sidi Saiyyed Mosque
          </span>
          <span style={{ fontSize: "13px", color: "var(--sand-on-dark)" }}>
            <span style={{ fontWeight: "700", color: "var(--gold-light)" }}><T k="gm.today" /></span> · <T k="gm.quiz_meta" />
          </span>
          <span style={{ marginTop: "10px", alignSelf: "flex-start", height: "44px", padding: "0 16px", borderRadius: "12px", background: "var(--gold-light)", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "800" }}>
            <T k="pl.play_now" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
              <polygon points="7 4 19 12 7 20 7 4" />
            </svg>
          </span>
        </span>
        <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ flex: "0 0 96px", width: "96px", height: "128px", objectFit: "cover", borderRadius: "48px 48px 12px 12px", display: "block" }} />
      </Link>
      <h2 style={{ margin: "26px 20px 0", fontSize: "19px", fontWeight: "800" }}>
        <T k="gm.more" />
      </h2>
      <div style={{ margin: "12px 20px 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
        <Link href="/puzzle" style={{ padding: "10px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--paper)", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "var(--ink)" }}>
          <span style={{ position: "relative", height: "104px", borderRadius: "12px", overflow: "hidden", display: "block", background: "var(--ink)" }}>
            <img src="/images/a9558385034112d0e27f39ea353dd7ed.jpg" alt="" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <span style={{ position: "absolute", left: "33.33%", top: "0", bottom: "0", width: "3px", background: "var(--sand-light)" }} />
            <span style={{ position: "absolute", left: "66.66%", top: "0", bottom: "0", width: "3px", background: "var(--sand-light)" }} />
            <span style={{ position: "absolute", top: "33.33%", left: "0", right: "0", height: "3px", background: "var(--sand-light)" }} />
            <span style={{ position: "absolute", top: "66.66%", left: "0", right: "0", height: "3px", background: "var(--sand-light)" }} />
            <span style={{ position: "absolute", right: "0", bottom: "0", width: "33.33%", height: "33.33%", background: "var(--ink)" }} />
          </span>
          <span style={{ marginTop: "4px", fontSize: "15px", fontWeight: "800" }}>
            <T k="gm.puzzle" />
          </span>
          <span style={{ fontSize: "12px", lineHeight: "1.4", color: "var(--ink-soft)" }}>
            <T k="gm.puzzle_sub" />
          </span>
          <span style={{ marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--gold)" }}>
              <T k="gm.pts" v={{ n: 20 }} />
            </span>
            <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>
              2 min
            </span>
          </span>
        </Link>
        <Tap ask="gm.state_ask" style={{ padding: "10px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--paper)", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "var(--ink)" , textAlign: "left", cursor: "pointer", width: "100%" }}>
          <span role="img" aria-label="Illustration placeholder: guess the state" style={{ height: "104px", borderRadius: "12px", background: "var(--sand)", display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: "6px", padding: "0 12px" }}>
            <span style={{ height: "28px", padding: "0 10px", borderRadius: "8px", background: "var(--paper)", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
              Rajasthan?
            </span>
            <span style={{ height: "28px", padding: "0 10px", borderRadius: "8px", background: "var(--paper)", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
              Karnataka?
            </span>
            <span style={{ height: "28px", padding: "0 10px", borderRadius: "8px", background: "var(--clay)", color: "var(--paper)", fontSize: "12px", fontWeight: "800", display: "flex", alignItems: "center" }}>
              Gujarat?
            </span>
          </span>
          <span style={{ marginTop: "4px", fontSize: "15px", fontWeight: "800" }}>
            <T k="gm.state" />
          </span>
          <span style={{ fontSize: "12px", lineHeight: "1.4", color: "var(--ink-soft)" }}>
            <T k="gm.state_sub" />
          </span>
          <span style={{ marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--gold)" }}>
              <T k="gm.pts" v={{ n: 10 }} />
            </span>
            <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>
              <T k="gm.all_india" />
            </span>
          </span>
        </Tap>
        <Link href="/lens" style={{ padding: "10px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--paper)", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "var(--ink)" }}>
          <span style={{ height: "104px", borderRadius: "12px", background: "var(--ink)", color: "var(--gold-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 7V5a2 2 0 0 1 2-2h2" />
              <path d="M17 3h2a2 2 0 0 1 2 2v2" />
              <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
              <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 7v2M12 15v2M7 12h2M15 12h2" />
            </svg>
          </span>
          <span style={{ marginTop: "4px", fontSize: "15px", fontWeight: "800" }}>
            <T k="gm.spot" />
          </span>
          <span style={{ fontSize: "12px", lineHeight: "1.4", color: "var(--ink-soft)" }}>
            <T k="gm.spot_sub" />
          </span>
          <span style={{ marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--gold)" }}>
              <T k="gm.pts" v={{ n: 25 }} />
            </span>
            <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>
              <T k="gm.on_site" />
            </span>
          </span>
        </Link>
        <Tap ask="gm.legend_ask" style={{ padding: "10px", borderRadius: "18px", border: "1px solid var(--line)", background: "var(--paper)", display: "flex", flexDirection: "column", gap: "6px", textDecoration: "none", color: "var(--ink)" , textAlign: "left", cursor: "pointer", width: "100%" }}>
          <span style={{ height: "104px", borderRadius: "12px", background: "var(--sand-grey)", color: "var(--ink-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </span>
          <span style={{ marginTop: "4px", fontSize: "15px", fontWeight: "800" }}>
            <T k="gm.legend" />
          </span>
          <span style={{ fontSize: "12px", lineHeight: "1.4", color: "var(--ink-soft)" }}>
            <T k="gm.legend_sub" />
          </span>
          <span style={{ marginTop: "2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--gold)" }}>
              <T k="gm.pts" v={{ n: 15 }} />
            </span>
            <span style={{ height: "22px", padding: "0 8px", borderRadius: "6px", background: "var(--sand)", color: "var(--gold-deep)", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center" }}>
              1 min
            </span>
          </span>
        </Tap>
      </div>
      <section style={{ margin: "22px 20px 0", padding: "16px", borderRadius: "18px", background: "var(--paper)", border: "1px solid var(--line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "15px", fontWeight: "800" }}>
            <T k="gm.passport" />
          </span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--ink-muted)" }}>
            <StampCount />
          </span>
        </div>
        <div style={{ marginTop: "10px", height: "8px", borderRadius: "999px", background: "var(--line)", overflow: "hidden" }}>
          <StampBar />
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "12px", color: "var(--ink-muted)" }}>
          <T k="gm.relax" />
        </p>
      </section>
      <MainNav active="home" />
    </div>
  );
}
