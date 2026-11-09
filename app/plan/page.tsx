"use client";

// Trip plan for a city — pick the length and interests, then save it.
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import { toast } from "@/components/Toast";
import { pop, share, useAsk } from "@/components/Tap";
import { frame } from "@/components/ui";
import { useStored } from "@/lib/store";
import { CITY_PLANS, cityPlan, DEFAULT_INTERESTS, INTERESTS, planStops, type Interest, type SavedPlan, type Slot } from "@/lib/plans";
import { useT, type Key } from "@/lib/i18n";

const noop = () => () => {};
const SLOT_ICON: Record<Slot, string> = {
  Morning: "M12 2v2 M4.93 4.93l1.41 1.41 M2 12h2 M20 12h2 M17.66 6.34l1.41-1.41 M6 16a6 6 0 0 1 12 0 M2 20h20",
  Afternoon: "M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  Evening: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
};
const chip = (on: boolean): CSSProperties => ({ flex: "0 0 auto", minHeight: "44px", padding: "0 14px", borderRadius: "999px", border: `1.5px solid ${on ? "var(--clay)" : "var(--line-strong)"}`, background: on ? "var(--clay-tint)" : "var(--paper)", color: on ? "var(--clay-deep)" : "var(--ink)", fontSize: "13px", fontWeight: 700, cursor: "pointer" });
const label: CSSProperties = { margin: "22px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "var(--gold)" };

export default function PlanScreen() {
  const t = useT();
  // Which city comes from the address: /plan?city=jaipur
  const cityId = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get("city") || "jaipur",
    () => "jaipur"
  );
  const city = cityPlan(cityId) || CITY_PLANS[0];

  const [plans, setPlans] = useStored<Record<string, SavedPlan>>("plans", {});
  // Interests chosen in onboarding seed the plan until they are changed here.
  const [onboarding] = useStored<Record<string, boolean> | null>("interests", null);
  const saved = plans[city.id];
  const [draft, setDraft] = useState<{ city: string; days: number; interests: Interest[] } | null>(null);
  const mine = draft?.city === city.id ? draft : null;
  const fromOnboarding = onboarding ? INTERESTS.map(([id]) => id).filter((id) => onboarding[id]) : [];
  const days = mine?.days ?? saved?.days ?? 2;
  const interests = mine?.interests ?? saved?.interests ?? (fromOnboarding.length ? fromOnboarding : DEFAULT_INTERESTS);
  const ask = useAsk();

  const stops = planStops(city, days, interests);
  // A saved plan stays in step with whatever is changed on this screen.
  const change = (next: { days?: number; interests?: Interest[] }) => {
    const merged = { city: city.id, days: next.days ?? days, interests: next.interests ?? interests };
    setDraft(merged);
    if (saved) setPlans((p) => ({ ...p, [city.id]: { ...p[city.id], days: merged.days, interests: merged.interests } }));
  };
  const toggleSave = (el: Element) => {
    pop(el, !saved);
    if (saved) {
      const kept = saved;
      setPlans((p) => {
        const rest = { ...p };
        delete rest[city.id];
        return rest;
      });
      toast(t("pn.removed"), { action: { label: t("sv.undo"), run: () => setPlans((p) => ({ ...p, [city.id]: kept })) } });
    } else {
      setPlans((p) => ({ ...p, [city.id]: { days, interests, savedAt: Date.now() } }));
      toast(t("trip.saved_toast"), "success");
    }
  };

  return (
    <div style={frame({ paddingBottom: "124px" })}>
      <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <BackLink href="/home" aria-label={t("on.back")} style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </BackLink>
        <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{t("pn.title")}</h1>
        <button type="button" aria-label={t("c.share_plan")} onClick={() => share(t("sv.plan_title", { days: days === 1 ? t("trip.day_n", { n: 1 }) : t("trip.days_n", { n: days }), city: city.name }), stops.map((s) => `${t("trip.day", { n: s.day })}: ${s.name}`).join("\n"))} style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
        </button>
      </div>

      <section key={city.id} aria-label={city.name} style={{ margin: "4px 20px 0", borderRadius: "20px", background: "var(--ink)", color: "var(--cream)", overflow: "hidden" }}>
        <div style={{ height: "150px", overflow: "hidden" }}>
          <img src={city.img} alt={city.alt} className="kenburns" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ padding: "16px 18px 18px" }}>
        <h2 style={{ margin: 0, fontSize: "30px", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em" }}>{city.name}</h2>
        <p style={{ margin: "4px 0 0", fontSize: "14px", fontWeight: 700, color: "var(--gold-light)" }}>{city.tag}</p>
        <p key={`${days}-${stops.length}`} className="fade-in" style={{ margin: "8px 0 0", fontSize: "14px", color: "var(--sand-on-dark)" }}>
          {days} {days === 1 ? "day" : "days"} · {stops.length} stops · {city.season}
        </p>
        <p style={{ margin: "12px 0 0", paddingTop: "12px", borderTop: "1px solid rgba(251, 246, 238, 0.14)", fontSize: "13px", lineHeight: 1.45, color: "var(--sand-on-dark)" }}>{city.getting}</p>
        </div>
      </section>

      <div style={{ padding: "0 20px" }}>
        <h3 style={label}>{t("pn.how_long").toUpperCase()}</h3>
        <div role="radiogroup" aria-label={t("pn.how_long")} style={{ padding: "4px", borderRadius: "14px", background: "var(--sand-deep)", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "4px" }}>
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" role="radio" aria-checked={days === n} onClick={() => change({ days: n })} style={{ height: "46px", border: 0, borderRadius: "10px", background: days === n ? "var(--paper)" : "transparent", color: days === n ? "var(--ink)" : "var(--ink-soft)", fontSize: "14px", fontWeight: days === n ? 800 : 600, boxShadow: days === n ? "0 2px 6px rgba(90, 60, 30, 0.14)" : "none", cursor: "pointer" }}>
              {n} {n === 1 ? "day" : "days"}
            </button>
          ))}
        </div>

        <h3 style={label}>{t("pn.like").toUpperCase()}</h3>
      </div>
      <div className="hscroll" style={{ padding: "0 20px", display: "flex", gap: "8px" }}>
        {INTERESTS.map(([id, text]) => {
          const on = interests.includes(id);
          return (
            <button key={id} type="button" aria-pressed={on} onClick={() => change({ interests: on ? interests.filter((x) => x !== id) : [...interests, id] })} style={chip(on)}>
              {on ? (
                <svg className="pop-in" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: "6px", verticalAlign: "-2px" }}>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
              {text}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "0 20px" }}>
        {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
          const list = stops.filter((s) => s.day === day);
          return (
            <section key={day} style={{ marginTop: "26px" }}>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 800 }}>Day {day}</h3>
              <ol key={`${day}-${list.length}`} className="stagger" style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                {list.map((s) => (
                  <li key={s.name}>
                    <button type="button" onClick={() => ask(t("pn.ask_stop", { name: s.name, city: city.name }))} style={{ width: "100%", padding: "12px 14px", borderRadius: "16px", border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)", display: "flex", gap: "12px", textAlign: "left", cursor: "pointer" }}>
                      <span aria-hidden="true" style={{ flex: "0 0 40px", width: "40px", height: "40px", borderRadius: "12px", background: s.core ? "var(--clay-wash)" : "var(--sand)", color: s.core ? "var(--clay)" : "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={SLOT_ICON[s.slot]} />
                        </svg>
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--gold)" }}>{t(`pn.${s.slot}` as Key).toUpperCase()}</span>
                        <span style={{ display: "block", marginTop: "2px", fontSize: "15px", lineHeight: 1.3, fontWeight: 800 }}>{s.name}</span>
                        <span style={{ display: "block", marginTop: "3px", fontSize: "13px", lineHeight: 1.45, color: "var(--ink-soft)" }}>{s.note}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}

        <h3 style={label}>{t("pn.ready").toUpperCase()}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {city.ticket ? (
            <Link href={`/tickets?book=${city.ticket}`} className="sheet-row" style={{ marginTop: 0 }}>
              <span>
                {t("pn.book")}
                <small>{t("pn.book_sub")}</small>
              </span>
              <span aria-hidden="true">›</span>
            </Link>
          ) : null}
          <Link href="/city" className="sheet-row" style={{ marginTop: 0 }}>
            <span>
              {t("pn.pack", { city: city.name })}
              <small>{t("pn.pack_sub")}</small>
            </span>
            <span aria-hidden="true">›</span>
          </Link>
          <button type="button" className="sheet-row" style={{ marginTop: 0 }} onClick={() => ask(t("pn.ask", { days: days === 1 ? t("trip.day_n", { n: 1 }) : t("trip.days_n", { n: days }), city: city.name }))}>
            <span>
              {t("pn.ask_city", { city: city.name })}
              <small>{t("pn.ask_city_sub")}</small>
            </span>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>

      <div className="nav-rail">
        <div style={{ padding: "12px 20px 30px", background: "var(--paper)", borderTop: "1px solid var(--line)", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)", display: "flex", gap: "10px" }}>
          <button type="button" aria-pressed={!!saved} onClick={(e) => toggleSave(e.currentTarget)} style={{ flex: 1, height: "52px", borderRadius: "14px", border: saved ? "1.5px solid var(--clay)" : "0", background: saved ? "var(--clay-tint)" : "var(--clay)", color: saved ? "var(--clay)" : "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "15px", fontWeight: 800, cursor: "pointer" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <span key={saved ? "on" : "off"} className="btn-swap">{saved ? t("trip.saved") : t("trip.save")}</span>
          </button>
          {saved ? (
            <Link href="/saved#plans" className="pop-in" style={{ flex: "0 0 auto", height: "52px", padding: "0 16px", borderRadius: "14px", background: "var(--ink)", color: "var(--cream)", display: "flex", alignItems: "center", fontSize: "15px", fontWeight: 700 }}>
              {t("pn.view")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
