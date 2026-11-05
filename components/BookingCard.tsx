"use client";

// A booking the AI Guide put together, shown in the chat: check it, add a
// pickup point or name if needed, and confirm — it lands in My tickets.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "./Toast";
import { pop } from "./Tap";
import { Spinner } from "./ui";
import { useUser } from "@/lib/auth";
import { useStored } from "@/lib/store";
import { draftTicket, draftTotal, type BookingDraft } from "@/lib/booking";
import { bookable, CAR_ADDONS, longDate, rupees, type Ticket } from "@/lib/tickets";
import { useT, type Key } from "@/lib/i18n";

const field = { width: "100%", height: "48px", padding: "0 12px", borderRadius: "12px", border: "1.5px solid #D9C7B3", background: "#FFFFFF", fontSize: "15px", color: "#2B1B10", outline: "none", boxSizing: "border-box" } as const;

export default function BookingCard({ draft, bookedRef, onBooked }: { draft: BookingDraft; bookedRef?: string; onBooked: (ref: string) => void }) {
  const router = useRouter();
  const [user] = useUser();
  const t = useT();
  const [uiLang] = useStored("lang", "en");
  const [, setTickets] = useStored<Ticket[]>("tickets", []);
  const [pickup, setPickup] = useState(draft.pickup);
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const item = bookable(draft.item);
  if (!item) return null;
  const who = name ?? user?.name ?? "";
  const needsPickup = item.kind === "car" || Boolean(draft.car);
  const car = draft.car ? CAR_ADDONS.find((c) => c.id === draft.car) : undefined;
  const people = item.kind === "car" ? String(draft.adults) : `${t("bk.adults", { n: draft.adults })}${draft.children ? ` · ${t("bk.kids", { n: draft.children })}` : ""}`;
  const total = draftTotal(draft);

  const confirm = (el: Element) => {
    if (needsPickup && pickup.trim().length < 3) return setError(t("bk.need_pickup"));
    if (who.trim().length < 2) return setError(t("bk.need_name"));
    setBusy(true);
    setTimeout(() => {
      const ticket = draftTicket({ ...draft, pickup: pickup.trim() }, who.trim());
      setTickets((list) => [ticket, ...list]);
      setBusy(false);
      pop(el, true);
      onBooked(ticket.ref);
      toast(t("bk.booked", { ref: ticket.ref }), { tone: "success", action: { label: t("bk.view"), run: () => router.push("/tickets#mine") } });
    }, 600);
  };

  return (
    <div style={{ padding: "12px", borderRadius: "6px 20px 20px 20px", background: "#FFFFFF", border: "1px solid #EFE6DA" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {item.img ? <img src={item.img} alt="" style={{ flex: "0 0 52px", width: "52px", height: "52px", borderRadius: "12px", objectFit: "cover" }} /> : null}
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontSize: "11px", fontWeight: 800, letterSpacing: "0.06em", color: "#8A6424" }}>{t(`tk.kind.${item.kind}` as Key).toUpperCase()}</span>
          <span style={{ display: "block", fontSize: "15px", lineHeight: 1.25, fontWeight: 800 }}>{item.title}</span>
          <span style={{ display: "block", fontSize: "12px", color: "#6F5B4B" }}>{item.place}</span>
        </span>
      </div>
      <dl style={{ margin: "12px 0 0", padding: "10px 12px", borderRadius: "12px", background: "#F6F1EA", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px 10px" }}>
        {[
          [t("tk.date"), longDate(draft.date, uiLang)],
          [item.kind === "car" ? t("tk.pickup") : t("tk.time"), draft.slot === "Any time" ? t("tk.any_time") : draft.slot],
          [item.kind === "car" ? t("tk.passengers") : t("tk.guests"), people],
          ...(car ? [[t("tk.car"), t(`tk.carl.${car.id}` as Key)]] : []),
          [t("tk.total"), rupees(total)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "#8A6424" }}>{k.toUpperCase()}</dt>
            <dd style={{ margin: "1px 0 0", fontSize: "14px", fontWeight: 700 }}>{v}</dd>
          </div>
        ))}
      </dl>
      {bookedRef ? (
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ flex: 1, height: "44px", padding: "0 12px", borderRadius: "12px", background: "#E3F1E7", color: "#2F7A4A", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 800 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {t("bk.booked", { ref: bookedRef })}
          </span>
          <Link href="/tickets#mine" style={{ height: "44px", padding: "0 14px", borderRadius: "12px", border: "1.5px solid #E2D3C1", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800, textDecoration: "none" }}>
            {t("bk.see")}
          </Link>
        </div>
      ) : (
        <>
          {needsPickup ? (
            <input aria-label={t("bk.pickup_ph")} placeholder={t("bk.pickup_ph")} value={pickup} onChange={(e) => { setPickup(e.target.value); setError(""); }} style={{ ...field, marginTop: "10px" }} />
          ) : null}
          {user?.name && name === null ? null : (
            <input aria-label={t("bk.name_ph")} placeholder={t("bk.name_ph")} autoComplete="name" value={who} onChange={(e) => { setName(e.target.value); setError(""); }} style={{ ...field, marginTop: "8px" }} />
          )}
          {error ? (
            <p role="alert" style={{ margin: "6px 2px 0", fontSize: "13px", fontWeight: 600, color: "#A23A2A" }}>
              {error}
            </p>
          ) : null}
          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button type="button" disabled={busy} aria-busy={busy} onClick={(e) => confirm(e.currentTarget)} style={{ flex: 1, height: "46px", border: 0, borderRadius: "12px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}>
              {busy ? <Spinner /> : null}
              {busy ? t("bk.booking") : t("bk.confirm", { price: rupees(total) })}
            </button>
            <Link href={`/tickets?book=${item.id}`} style={{ height: "46px", padding: "0 14px", borderRadius: "12px", border: "1.5px solid #E2D3C1", color: "#2B1B10", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: 800, textDecoration: "none" }}>
              {t("trip.change")}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
