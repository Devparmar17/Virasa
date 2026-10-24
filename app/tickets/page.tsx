"use client";

// Tickets & guided walks — browse, reserve, and keep your bookings.
import { useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackLink, { canGoBack } from "@/components/Back";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { frame, Spinner, SuccessBadge } from "@/components/ui";
import { useUser } from "@/lib/auth";
import { useStored } from "@/lib/store";
import { bookable, BOOKABLES, cancelTerms, CANCEL_FEE_RATE, dayKey, longDate, newRef, nextDays, priceOf, rupees, type Bookable, type Ticket } from "@/lib/tickets";

const noop = () => () => {};
const GUIDE_LANGS = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["gu", "ગુજરાતી"],
] as const;

const chip = (on: boolean): CSSProperties => ({ flex: "0 0 auto", minHeight: "44px", padding: "0 14px", borderRadius: "999px", border: `1.5px solid ${on ? "#2B1B10" : "#E2D3C1"}`, background: on ? "#2B1B10" : "#FFFFFF", color: on ? "#FFFFFF" : "#2B1B10", fontSize: "13px", fontWeight: 700, cursor: "pointer" });
const label: CSSProperties = { margin: "22px 0 8px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#8A6424" };
const primary: CSSProperties = { width: "100%", height: "56px", border: 0, borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)" };

function Thumb({ item, size }: { item: Bookable; size: number }) {
  const box: CSSProperties = { flex: `0 0 ${size}px`, width: `${size}px`, height: `${size}px`, borderRadius: "14px", display: "block" };
  if (item.img) return <img src={item.img} alt="" style={{ ...box, objectFit: "cover" }} />;
  return (
    <span aria-hidden="true" style={{ ...box, background: "#EFE1C9", color: "#9C7A55", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2M13 17v2M13 11v2" />
      </svg>
    </span>
  );
}

function Stepper({ name, hint, value, min, max, onChange }: { name: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const round = (off: boolean): CSSProperties => ({ width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid #D9C7B3", background: "#FFFFFF", color: off ? "#CDBFAE" : "#2B1B10", fontSize: "22px", lineHeight: 1, fontWeight: 600, cursor: off ? "default" : "pointer" });
  return (
    <div style={{ minHeight: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
      <span>
        <span style={{ display: "block", fontSize: "15px", fontWeight: 700 }}>{name}</span>
        <span style={{ display: "block", marginTop: "2px", fontSize: "12px", color: "#6F5B4B" }}>{hint}</span>
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button type="button" aria-label={`Fewer ${name.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} style={round(value <= min)}>
          −
        </button>
        <span aria-live="polite" style={{ minWidth: "22px", textAlign: "center", fontSize: "17px", fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
          {value}
        </span>
        <button type="button" aria-label={`More ${name.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} style={round(value >= max)}>
          +
        </button>
      </span>
    </div>
  );
}

// A booking drawn as a ticket: details, then the code to show at the gate.
function TicketCard({ ticket, onCancel }: { ticket: Ticket; onCancel?: () => void }) {
  const item = bookable(ticket.item);
  if (!item) return null;
  const people = `${ticket.adults} adult${ticket.adults === 1 ? "" : "s"}${ticket.children ? `, ${ticket.children} child${ticket.children === 1 ? "" : "ren"}` : ""}`;
  // The stripes are decoration drawn from the code; staff read the code itself.
  const bars = [...ticket.ref.replace("VR-", "").repeat(4)].map((c) => (c.charCodeAt(0) % 4) + 1);
  return (
    <article className="rise" style={{ borderRadius: "20px", background: "#FFFFFF", border: "1px solid #EFE6DA", boxShadow: ticket.cancelled ? "none" : "0 10px 24px rgba(90, 60, 30, 0.08)", overflow: "hidden" }}>
      <div style={{ padding: "16px", display: "flex", gap: "14px", alignItems: "center", opacity: ticket.cancelled ? 0.6 : 1 }}>
        <Thumb item={item} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "16px", lineHeight: 1.25, fontWeight: 800 }}>{item.title}</div>
          <div style={{ marginTop: "3px", fontSize: "13px", color: "#5A4434" }}>{item.place}</div>
        </div>
        {ticket.cancelled ? <span style={{ flex: "0 0 auto", height: "26px", padding: "0 10px", borderRadius: "999px", background: "#FBE9E4", color: "#A23A2A", fontSize: "12px", fontWeight: 800, display: "flex", alignItems: "center" }}>Cancelled</span> : null}
      </div>
      <dl style={{ margin: 0, padding: "0 16px 14px", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px 12px" }}>
        {[
          ["Date", longDate(ticket.date)],
          ["Time", ticket.slot],
          ["Guests", people],
          ["Price", rupees(ticket.total)],
        ].map(([k, v]) => (
          <div key={k}>
            <dt style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#8A6424" }}>{k.toUpperCase()}</dt>
            <dd style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 700 }}>{v}</dd>
          </div>
        ))}
      </dl>
      {ticket.cancelled ? (
        <div style={{ borderTop: "2px dashed #E2D3C1", padding: "14px 16px 16px", background: "#F6F1EA", display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", color: "#5A4434" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#8A6424" }}>
            {ticket.ref} · CANCELLED {new Date(ticket.cancelled.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }).toUpperCase()}
          </span>
          {ticket.total ? (
            <>
              <span>
                Cancellation charge ({Math.round(CANCEL_FEE_RATE * 100)}%): <strong style={{ color: "#2B1B10" }}>{rupees(ticket.cancelled.fee)}</strong>
              </span>
              <span>
                Refunded: <strong style={{ color: "#2F7A4A" }}>{rupees(ticket.cancelled.refund)}</strong>
              </span>
            </>
          ) : (
            <span>Nothing was paid, so nothing was charged.</span>
          )}
        </div>
      ) : (
      <div style={{ borderTop: "2px dashed #E2D3C1", padding: "14px 16px 16px", background: "#F6F1EA" }}>
        <div aria-hidden="true" style={{ height: "40px", display: "flex", alignItems: "stretch", gap: "2px" }}>
          {bars.map((w, i) => (
            <span key={i} style={{ flex: `${w} 0 0`, background: i % 2 ? "transparent" : "#2B1B10" }} />
          ))}
        </div>
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <span>
            <span style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: "#8A6424" }}>BOOKING CODE</span>
            <span style={{ display: "block", fontSize: "20px", fontWeight: 800, letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>{ticket.ref}</span>
          </span>
          {onCancel ? (
            <button type="button" onClick={onCancel} style={{ minHeight: "44px", padding: "0 12px", border: "1.5px solid #E2D3C1", borderRadius: "12px", background: "#FFFFFF", color: "#A23A2A", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              Cancel
            </button>
          ) : null}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "12px", lineHeight: 1.45, color: "#5A4434" }}>
          {item.meet}. Name on booking: {ticket.name}.
        </p>
      </div>
      )}
    </article>
  );
}

export default function TicketsScreen() {
  const router = useRouter();
  const [user] = useUser();
  const [tickets, setTickets] = useStored<Ticket[]>("tickets", []);
  const [tab, setTab] = useState<"book" | "mine" | null>(null);
  const [filter, setFilter] = useState<"all" | Bookable["kind"]>("all");
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const [done, setDone] = useState<Ticket | null>(null);

  // Links elsewhere in the app open a booking directly (/tickets?book=<id>) or the bookings list (#mine).
  const linked = useSyncExternalStore(
    noop,
    () => `${new URLSearchParams(window.location.search).get("book") || ""}|${window.location.hash}`,
    () => "|"
  );
  const [linkedItem, hash] = linked.split("|");
  // Today's date exists only in the browser, so the calendar is drawn there.
  const today = useSyncExternalStore(
    noop,
    () => dayKey(new Date()),
    () => ""
  );

  const view = tab ?? (hash === "#mine" ? "mine" : "book");
  const item = bookable(picked === undefined ? linkedItem : picked || "");

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guideLang, setGuideLang] = useState("en");
  const [nameTyped, setName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [reserving, setReserving] = useState(false);
  const [cancelling, setCancelling] = useState<Ticket | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const active = tickets.filter((t) => !t.cancelled);
  const cancelled = tickets.filter((t) => t.cancelled);
  const confirmCancel = () => {
    const t = cancelling;
    if (!t) return;
    setCancelBusy(true);
    setTimeout(() => {
      const terms = cancelTerms(t.total);
      setTickets((list) => list.map((x) => (x.ref === t.ref ? { ...x, cancelled: { at: Date.now(), ...terms } } : x)));
      setCancelBusy(false);
      setCancelling(null);
      toast("Booking cancelled", "success");
    }, 700);
  };
  const name = nameTyped ?? user?.name ?? "";

  const days = today && item ? nextDays(today).map((d) => ({ ...d, off: !!item.closed?.includes(d.weekday) })) : [];
  const chosenDate = days.find((d) => d.key === date && !d.off)?.key || days.find((d) => !d.off)?.key || "";
  const chosenSlot = item?.slots.includes(slot) ? slot : item?.slots[0] || "";
  const total = item ? priceOf(item, adults, children) : 0;

  const open = (id: string | null) => {
    setPicked(id);
    setDone(null);
    setError("");
    setDate("");
    setSlot("");
    window.scrollTo({ top: 0 });
  };

  const reserve = () => {
    if (!item) return;
    if (name.trim().length < 2) {
      setError("Enter the name the booking should be under.");
      return;
    }
    const ticket: Ticket = { ref: newRef(), item: item.id, date: chosenDate, slot: chosenSlot, adults, children, name: name.trim(), guideLang: item.kind === "guided" ? guideLang : undefined, total };
    // A short "Reserving…" beat before the confirmation, as a real booking would take.
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      setTickets((list) => [ticket, ...list]);
      setDone(ticket);
      setPicked(null);
      window.scrollTo({ top: 0 });
    }, 700);
  };

  const shown = BOOKABLES.filter((b) => filter === "all" || b.kind === filter);
  const back = done || item ? null : "/home";

  return (
    <div style={frame({ paddingBottom: item && !done ? "120px" : "48px" })}>
      <div style={{ padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {back ? (
          <BackLink href={back} aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </BackLink>
        ) : (
          <button
            type="button"
            aria-label="Back to all tickets"
            // A booking opened from another screen (Book on a place, a plan…) goes back there.
            onClick={() => (picked === undefined && linkedItem && !done && canGoBack() ? router.back() : open(null))} style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
        )}
        <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>{done ? "Booking saved" : item ? "Book" : "Tickets & guided walks"}</h1>
        <span style={{ width: "44px" }} />
      </div>

      {done ? (
        <div key="done" style={{ padding: "4px 20px 0" }}>
          <div className="rise" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "6px 12px 20px" }}>
            <SuccessBadge />
            <h2 style={{ margin: "16px 0 0", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.01em" }}>Booking saved</h2>
            <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.5, color: "#5A4434" }}>Find it any time under My tickets.</p>
          </div>
          <TicketCard ticket={done} />
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setTab("mine");
            }}
            style={{ ...primary, marginTop: "18px" }}
          >
            See my tickets
          </button>
          <Link href="/home" style={{ marginTop: "6px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#5A4434" }}>
            Back to Home
          </Link>
        </div>
      ) : item ? (
        <div key={item.id} style={{ padding: "0 20px" }}>
          <div className="rise" style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            <Thumb item={item} size={84} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "inline-flex", height: "22px", padding: "0 8px", borderRadius: "6px", background: item.kind === "guided" ? "#F6E3DA" : "#F6EEE4", color: item.kind === "guided" ? "#7E3D29" : "#6E4E1E", fontSize: "11px", fontWeight: 700, alignItems: "center" }}>{item.kind === "guided" ? "Guided walk" : "Entry ticket"}</span>
              <h2 style={{ margin: "6px 0 0", fontSize: "20px", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.01em" }}>{item.title}</h2>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#5A4434" }}>
                {item.place} · {item.duration}
              </p>
            </div>
          </div>
          <p style={{ margin: "14px 0 0", fontSize: "14px", lineHeight: 1.5, color: "#5A4434" }}>{item.blurb}</p>

          <h3 style={label}>DATE</h3>
          <div className="hscroll" role="radiogroup" aria-label="Date" style={{ margin: "0 -20px", padding: "0 20px 4px", display: "flex", gap: "8px" }}>
            {days.map((d) => (
              <button key={d.key} type="button" role="radio" aria-checked={chosenDate === d.key} disabled={d.off} onClick={() => setDate(d.key)} style={{ flex: "0 0 68px", height: "76px", borderRadius: "16px", border: `1.5px solid ${chosenDate === d.key ? "#9A4E36" : "#E2D3C1"}`, background: chosenDate === d.key ? "#9A4E36" : "#FFFFFF", color: d.off ? "#B9AA98" : chosenDate === d.key ? "#FFFFFF" : "#2B1B10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", cursor: d.off ? "default" : "pointer" }}>
                <span style={{ fontSize: "11px", fontWeight: 700 }}>{d.off ? "Closed" : d.top}</span>
                <span style={{ fontSize: "20px", lineHeight: 1, fontWeight: 800 }}>{d.day}</span>
                <span style={{ fontSize: "11px", fontWeight: 600 }}>{d.month}</span>
              </button>
            ))}
          </div>

          <h3 style={label}>TIME</h3>
          <div role="radiogroup" aria-label="Time" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {item.slots.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={chosenSlot === s} onClick={() => setSlot(s)} style={chip(chosenSlot === s)}>
                {s}
              </button>
            ))}
          </div>

          <h3 style={label}>GUESTS</h3>
          <div style={{ padding: "4px 14px", borderRadius: "16px", background: "#FFFFFF", border: "1px solid #EFE6DA" }}>
            <Stepper name="Adults" hint={`${rupees(item.adult)}${item.adult ? " each" : ""}`} value={adults} min={1} max={10} onChange={setAdults} />
            <div style={{ height: "1px", background: "#F3ECE2" }} />
            <Stepper name="Children" hint={`Age 5–15 · ${rupees(item.child)}${item.child ? " each" : ""}`} value={children} min={0} max={10} onChange={setChildren} />
          </div>

          {item.kind === "guided" ? (
            <>
              <h3 style={label}>GUIDE SPEAKS</h3>
              <div role="radiogroup" aria-label="Guide language" style={{ display: "flex", gap: "8px" }}>
                {GUIDE_LANGS.map(([id, text]) => (
                  <button key={id} type="button" role="radio" aria-checked={guideLang === id} lang={id} onClick={() => setGuideLang(id)} style={chip(guideLang === id)}>
                    {text}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <h3 style={label}>NAME ON BOOKING</h3>
          <input
            type="text"
            aria-label="Name on booking"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            aria-invalid={!!error}
            style={{ width: "100%", height: "54px", padding: "0 14px", borderRadius: "14px", border: `1.5px solid ${error ? "#A23A2A" : "#D9C7B3"}`, background: "#FFFFFF", fontSize: "16px", color: "#2B1B10", outline: "none" }}
          />
          {error ? (
            <p role="alert" className="rise" style={{ margin: "6px 0 0", fontSize: "13px", fontWeight: 600, color: "#A23A2A" }}>
              {error}
            </p>
          ) : null}

          <div className="nav-rail">
            <div style={{ padding: "12px 20px 30px", background: "#FFFFFF", borderTop: "1px solid #EFE6DA", boxShadow: "0 -8px 20px rgba(90, 60, 30, 0.08)", display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ flex: "0 0 auto" }}>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>Total</span>
                <span key={total} className="pop-in" style={{ display: "block", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.01em" }}>
                  {rupees(total)}
                </span>
              </span>
              <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <button type="button" onClick={reserve} disabled={!chosenDate || reserving} aria-busy={reserving} style={{ ...primary, width: "100%" }}>
                  <span key={reserving ? "busy" : "idle"} className="btn-swap">
                    {reserving ? <Spinner /> : null}
                    {reserving ? "Booking…" : total ? `Book · ${rupees(total)}` : "Book"}
                  </span>
                </button>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#6F5B4B", textAlign: "center" }}>{total ? `Cancel later and get ${rupees(cancelTerms(total).refund)} back (50%)` : "Free · cancel any time"}</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Tickets" style={{ margin: "0 20px", padding: "4px", borderRadius: "14px", background: "#F1E7DA", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "4px" }}>
            {(
              [
                ["book", "Book"],
                ["mine", `My tickets${active.length ? ` · ${active.length}` : ""}`],
              ] as const
            ).map(([id, text]) => (
              <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setTab(id)} style={{ height: "44px", border: 0, borderRadius: "10px", background: view === id ? "#FFFFFF" : "transparent", color: view === id ? "#2B1B10" : "#5A4434", fontSize: "14px", fontWeight: view === id ? 800 : 600, boxShadow: view === id ? "0 2px 6px rgba(90, 60, 30, 0.14)" : "none", cursor: "pointer" }}>
                {text}
              </button>
            ))}
          </div>

          {view === "book" ? (
            <>
              <div className="hscroll" style={{ margin: "16px 0 0", padding: "0 20px", display: "flex", gap: "8px" }}>
                {(
                  [
                    ["all", "All"],
                    ["guided", "Guided walks"],
                    ["entry", "Entry tickets"],
                  ] as const
                ).map(([id, text]) => (
                  <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} style={chip(filter === id)}>
                    {text}
                  </button>
                ))}
              </div>
              <ul key={filter} className="stagger" style={{ listStyle: "none", margin: "14px 0 0", padding: "0 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {shown.map((b) => (
                  <li key={b.id}>
                    <button type="button" onClick={() => open(b.id)} style={{ width: "100%", padding: "12px", borderRadius: "18px", border: "1px solid #EFE6DA", background: "#FFFFFF", color: "#2B1B10", display: "flex", gap: "14px", alignItems: "center", textAlign: "left", cursor: "pointer" }}>
                      <Thumb item={b} size={76} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        {b.tag ? <span style={{ display: "inline-flex", height: "22px", padding: "0 8px", marginBottom: "4px", borderRadius: "6px", background: "#F6EEE4", color: "#6E4E1E", fontSize: "11px", fontWeight: 700, alignItems: "center" }}>{b.tag}</span> : null}
                        <span style={{ display: "block", fontSize: "16px", lineHeight: 1.25, fontWeight: 800 }}>{b.title}</span>
                        <span style={{ display: "block", marginTop: "3px", fontSize: "12px", fontWeight: 600, color: "#6F5B4B" }}>{b.place}</span>
                        <span style={{ display: "block", marginTop: "6px", fontSize: "13px", fontWeight: 700, color: "#9A4E36" }}>
                          {b.adult ? `From ${rupees(b.adult)}` : "Free"} · {b.kind === "guided" ? b.duration : "Entry"}
                        </span>
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6F5B4B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : tickets.length ? (
            <div style={{ margin: "16px 0 0", padding: "0 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {active.map((t) => (
                <TicketCard key={t.ref} ticket={t} onCancel={() => setCancelling(t)} />
              ))}
              {cancelled.length ? <h2 style={{ ...label, margin: active.length ? "10px 0 -4px" : "0 0 -4px" }}>CANCELLED</h2> : null}
              {cancelled.map((t) => (
                <TicketCard key={t.ref} ticket={t} />
              ))}
            </div>
          ) : (
            <div className="rise" style={{ margin: "44px 32px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px" }}>
              <span style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F6EEE4", color: "#9A4E36", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  <path d="M13 5v2M13 17v2M13 11v2" />
                </svg>
              </span>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>No tickets yet</span>
              <span style={{ fontSize: "14px", lineHeight: 1.45, color: "#5A4434" }}>Book a guided walk or monument entry and it will be kept here, ready to show at the gate.</span>
              <button type="button" onClick={() => setTab("book")} style={{ ...primary, marginTop: "10px", width: "auto", padding: "0 24px", height: "50px" }}>
                Browse tickets
              </button>
            </div>
          )}
        </>
      )}
      <Sheet open={!!cancelling} onClose={() => (cancelBusy ? null : setCancelling(null))} title="Cancel this booking?">
        {cancelling ? (
          <>
            <p>
              {bookable(cancelling.item)?.title} · {longDate(cancelling.date)}, {cancelling.slot}
            </p>
            {cancelling.total ? (
              <div style={{ margin: "4px 0 6px", padding: "14px", borderRadius: "14px", border: "1px solid #EFE6DA", background: "#FFFFFF", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                <span style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5A4434" }}>You paid</span>
                  <strong>{rupees(cancelling.total)}</strong>
                </span>
                <span style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5A4434" }}>Cancellation charge ({Math.round(CANCEL_FEE_RATE * 100)}%)</span>
                  <strong style={{ color: "#A23A2A" }}>− {rupees(cancelTerms(cancelling.total).fee)}</strong>
                </span>
                <span style={{ paddingTop: "8px", borderTop: "1px solid #F3ECE2", display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                  <strong>You get back</strong>
                  <strong style={{ color: "#2F7A4A" }}>{rupees(cancelTerms(cancelling.total).refund)}</strong>
                </span>
              </div>
            ) : (
              <p>It was free, so there is nothing to charge or refund.</p>
            )}
            <button type="button" className="sheet-cta" disabled={cancelBusy} aria-busy={cancelBusy} onClick={confirmCancel} style={{ background: "#A23A2A", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span key={cancelBusy ? "busy" : "idle"} className="btn-swap">
                {cancelBusy ? <Spinner /> : null}
                {cancelBusy ? "Cancelling…" : cancelling.total ? `Cancel and refund ${rupees(cancelTerms(cancelling.total).refund)}` : "Cancel booking"}
              </span>
            </button>
            <button type="button" className="sheet-row" disabled={cancelBusy} onClick={() => setCancelling(null)} style={{ justifyContent: "center" }}>
              Keep my booking
            </button>
          </>
        ) : null}
      </Sheet>
    </div>
  );
}
