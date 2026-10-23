"use client";

// A "Local secrets & flavours" find, described in full.
import { useSyncExternalStore } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import Speak from "@/components/Speak";
import { toast } from "@/components/Toast";
import { pop, share, useAsk } from "@/components/Tap";
import { frame } from "@/components/ui";
import { useStored } from "@/lib/store";
import { KIND, secret, SECRETS, type Secret } from "@/lib/secrets";

const noop = () => () => {};
const round = { width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "rgba(255, 255, 255, 0.94)", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(43, 27, 16, 0.18)", cursor: "pointer" } as const;

// Drawn in place of a photo when there isn't one, in the colour of the find's kind.
function Art({ item, size }: { item: Secret; size: number }) {
  const k = KIND[item.kind];
  const paths = {
    gem: ["M3 21h18", "M5 21V8l7-5 7 5v13", "M9 21v-6h6v6", "M9 10h.01M15 10h.01"],
    food: ["M4 12h16a8 8 0 0 1-16 0Z", "M2 21h20", "M8 7c0-1 1-1 1-2s-1-1-1-2M12 7c0-1 1-1 1-2s-1-1-1-2M16 7c0-1 1-1 1-2s-1-1-1-2"],
    legend: ["M3 21V9h4v12", "M17 21V9h4v12", "M7 21V12h10v9", "M10 21v-4a2 2 0 0 1 4 0v4", "M3 9V6h1v1h2V6h1v3M17 9V6h1v1h2V6h1v3", "M2 21h20"],
    monument: ["M2 21h20", "M4 21V11h16v10", "M6 11a6 6 0 0 1 12 0", "M12 5V2", "M8 21v-5a1 1 0 0 1 2 0v5", "M14 21v-5a1 1 0 0 1 2 0v5"],
  }[item.kind];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={k.ink} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default function SecretScreen() {
  // Which find comes from the address: /secret?id=manek
  const id = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("id") || "dhal",
    () => "dhal"
  );
  const item = secret(id) || SECRETS[0];
  const k = KIND[item.kind];
  const [saved, setSaved] = useStored<Record<string, boolean>>("saved", {});
  const isSaved = saved[item.id] ?? false;
  const ask = useAsk();
  const others = SECRETS.filter((s) => s.id !== item.id && s.group === item.group);
  const go = item.go || { label: `Walk there · ${item.mins} min`, href: `/navigate?to=${item.id}` };

  return (
    <div key={item.id} style={frame({ background: "#FFFFFF", paddingBottom: "124px" })}>
      <div style={{ position: "relative", height: "300px", background: k.tint, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {item.img ? <img src={item.img} alt={item.alt} className="kenburns" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.focus, display: "block" }} /> : <span role="img" aria-label={`Illustration: ${item.alt}`} className="float"><Art item={item} size={132} /></span>}
        {item.img ? <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "130px", background: "linear-gradient(180deg, rgba(20, 12, 6, 0.45) 0%, rgba(20, 12, 6, 0) 100%)" }} /> : null}
        <div style={{ position: "absolute", top: "50px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between" }}>
          <BackLink href="/home" aria-label="Back" style={round}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </BackLink>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              aria-label={isSaved ? "Saved. Remove from saved" : "Save"}
              aria-pressed={isSaved}
              onClick={(e) => {
                pop(e.currentTarget, !isSaved);
                setSaved((m) => ({ ...m, [item.id]: !isSaved }));
                toast(isSaved ? "Removed from Saved" : "Saved — find it under Saved", isSaved ? "info" : "success");
              }}
              style={round}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "#9A4E36" : "none"} stroke={isSaved ? "#9A4E36" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </button>
            <button type="button" aria-label="Share" onClick={() => share(item.title, item.line)} style={round}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <main style={{ position: "relative", marginTop: "-24px", borderRadius: "24px 24px 0 0", background: "#FFFFFF", padding: "22px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ height: "26px", padding: "0 10px", borderRadius: "7px", background: k.tagBg, color: k.tagFg, fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center" }}>{item.tag}</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>{item.distance}</span>
        </div>
        <h1 style={{ margin: "10px 0 0", fontSize: "26px", lineHeight: 1.18, fontWeight: 800, letterSpacing: "-0.02em", textWrap: "balance" }}>{item.title}</h1>
        <p style={{ margin: "6px 0 0", fontSize: "15px", color: "#6F5B4B" }}>{item.line}</p>

        <div style={{ marginTop: "16px" }}>
          <Speak text={`${item.title}. ${item.story.join(" ")}`} playingLabel="Stop listening" style={{ height: "46px", padding: "0 16px 0 12px", border: "1.5px solid #9A4E36", borderRadius: "14px", background: "#FFFFFF", color: "#9A4E36", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            Listen to this
          </Speak>
        </div>

        <section style={{ marginTop: "20px" }}>
          {item.story.map((p) => (
            <p key={p} style={{ margin: "0 0 12px", fontSize: "calc(15px * var(--read-scale, 1))", lineHeight: 1.6, color: "#2B1B10", textWrap: "pretty" }}>
              {p}
            </p>
          ))}
        </section>

        <section style={{ marginTop: "18px" }}>
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>{item.listTitle}</h2>
          <ol style={{ listStyle: "none", margin: "12px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {item.list.map((row, i) => (
              <li key={row.name} style={{ padding: "12px 14px", borderRadius: "16px", background: "#F6F1EA", border: "1px solid #EFE6DA", display: "flex", gap: "12px" }}>
                <span aria-hidden="true" style={{ flex: "0 0 30px", width: "30px", height: "30px", borderRadius: "50%", background: k.ink, color: "#FFFFFF", fontSize: "13px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 800 }}>{row.name}</span>
                    {row.badge ? <span style={{ height: "20px", padding: "0 7px", borderRadius: "6px", background: k.tagBg, color: k.tagFg, fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center" }}>{row.badge}</span> : null}
                  </span>
                  <span style={{ display: "block", marginTop: "3px", fontSize: "13px", lineHeight: 1.5, color: "#5A4434" }}>{row.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {item.record ? (
          <section style={{ marginTop: "22px", padding: "16px", borderRadius: "18px", background: "#E3F1E7", border: "1px solid #C7E0CF" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#1F5A36", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              {item.record.title}
            </h2>
            <ul style={{ margin: "10px 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "14px", lineHeight: 1.5, color: "#23422F" }}>
              {item.record.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section style={{ marginTop: "26px" }}>
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>Before you go</h2>
          <dl style={{ margin: "12px 0 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
            {item.know.map((row) => (
              <div key={row.label} style={{ padding: "12px 14px", borderRadius: "14px", background: "#F6F1EA" }}>
                <dt style={{ fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{row.label}</dt>
                <dd style={{ margin: "3px 0 0", fontSize: "15px", lineHeight: 1.3, fontWeight: 800 }}>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p style={{ margin: "12px 0 0", padding: "12px 14px", borderRadius: "14px", background: "#FBEDE6", fontSize: "13px", lineHeight: 1.5, color: "#5A4434" }}>
            <strong style={{ color: "#2B1B10" }}>Tip. </strong>
            {item.tip}
          </p>
          <button type="button" onClick={() => ask(item.question)} style={{ marginTop: "8px", minHeight: "44px", padding: "0 4px", border: 0, background: "none", color: "#9A4E36", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            Still curious? Ask the AI Guide
          </button>
        </section>

        <section style={{ marginTop: "22px" }}>
          <h2 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>{item.group === "highlight" ? "More heritage highlights" : item.group === "stop" ? "More stops on the walk" : "More local secrets"}</h2>
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {others.map((o) => (
              <Link key={o.id} href={`/secret?id=${o.id}`} style={{ padding: "12px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", gap: "14px" }}>
                {o.img ? (
                  <img src={o.img} alt="" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", objectFit: "cover", display: "block" }} />
                ) : (
                  <span aria-hidden="true" style={{ flex: "0 0 64px", width: "64px", height: "64px", borderRadius: "12px", background: KIND[o.kind].tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Art item={o} size={36} />
                  </span>
                )}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: KIND[o.kind].tagFg }}>{o.tag}</span>
                  <span style={{ display: "block", marginTop: "2px", fontSize: "15px", lineHeight: 1.25, fontWeight: 800 }}>{o.title}</span>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="nav-rail">
        <div style={{ padding: "12px 20px 30px", background: "#FFFFFF", borderTop: "1px solid #EFE6DA", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)" }}>
          <Link href={go.href} style={{ height: "52px", borderRadius: "14px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            {go.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
