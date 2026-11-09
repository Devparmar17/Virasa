"use client";

// 02 · Log in or sign up — Google, email, or carry on as a guest.
import { useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import BackLink from "@/components/Back";
import { useRouter } from "next/navigation";
import Sheet from "@/components/Sheet";
import { toast } from "@/components/Toast";
import { frame, Spinner, Tick } from "@/components/ui";
import { googleSignIn, isEmail, logIn, logOut, signUp, useUser } from "@/lib/auth";
import { Avatar, GoogleMark } from "@/components/User";
import { readStored } from "@/lib/store";
import { useT } from "@/lib/i18n";

type View = "choose" | "signup" | "signin";

const onHash = (fn: () => void) => {
  window.addEventListener("hashchange", fn);
  return () => window.removeEventListener("hashchange", fn);
};
const field: CSSProperties = { width: "100%", height: "54px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid var(--line-deep)", background: "var(--paper)", fontSize: "16px", color: "var(--ink)", outline: "none" };
const primary: CSSProperties = { width: "100%", height: "56px", border: 0, borderRadius: "16px", background: "var(--clay)", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)" };
const outline: CSSProperties = { width: "100%", height: "56px", borderRadius: "16px", border: "1.5px solid var(--line-deep)", background: "var(--paper)", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" };

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 700 }}>{label}</span>
      {children}
      {error ? (
        <span role="alert" className="rise" style={{ display: "block", marginTop: "6px", fontSize: "13px", fontWeight: 600, color: "var(--red)" }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ display: "block", marginTop: "6px", fontSize: "13px", color: "var(--ink-muted)" }}>{hint}</span>
      ) : null}
    </label>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  // Welcome's "Sign in" link opens /login#signin straight on the form.
  const hash = useSyncExternalStore(
    onHash,
    () => window.location.hash,
    () => ""
  );
  const [picked, setView] = useState<View | null>(null);
  const view: View = picked ?? (hash === "#signin" ? "signin" : hash === "#signup" ? "signup" : "choose");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<"" | "google" | "form">("");
  // Which button just worked: it turns green with a tick for a moment before moving on.
  const [ok, setOk] = useState<"" | "google" | "form">("");
  // Counts failed tries, so the error shakes again each time.
  const [tries, setTries] = useState(0);
  const [setup, setSetup] = useState(false);
  const [user] = useUser();
  const t = useT();
  // Once someone signs in here we are already leaving, so only people who arrive signed in see their account.
  const [leaving, setLeaving] = useState(false);

  const done = (who: string, isNew: boolean, via: "google" | "form") => {
    setLeaving(true);
    setOk(via);
    toast(isNew ? t("lg.welcome_new", { name: who }) : t("lg.welcome_back", { name: who }), "success");
    // Signing in always leads through interests (with language) and location; earlier
    // choices are remembered, so a returning traveller can skip straight through.
    // A short pause lets the tick land before the screen changes.
    setTimeout(() => router.push("/personalize"), 650);
  };
  const firstName = () => (readStored<{ name: string } | null>("user", null)?.name || "traveller").trim().split(/\s+/)[0];

  const google = async () => {
    // Treated as leaving from the start: the account is stored a moment before
    // this finishes, and the "you're signed in" panel mustn't flash up meanwhile.
    setLeaving(true);
    setBusy("google");
    const problem = await googleSignIn();
    setBusy("");
    if (problem) setLeaving(false);
    if (problem === "not-configured") setSetup(true);
    else if (problem) toast(problem, "error");
    else done(firstName(), false, "google");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (view === "signup" && name.trim().length < 2) found.name = t("lg.err_name");
    if (!isEmail(email)) found.email = t("lg.err_email");
    if (view === "signup" ? password.length < 8 : !password) found.password = view === "signup" ? t("lg.err_short") : t("lg.err_pw");
    setErrors(found);
    if (Object.keys(found).length) {
      setTries((n) => n + 1);
      return;
    }
    setLeaving(true);
    setBusy("form");
    // Held for a beat at least, so the spinner reads as a step rather than a flicker.
    const [problem] = await Promise.all([view === "signup" ? signUp(name, email, password) : logIn(email, password), new Promise((r) => setTimeout(r, 450))]);
    setBusy("");
    if (problem) {
      setLeaving(false);
      setErrors({ form: problem });
      setTries((n) => n + 1);
    } else done(firstName(), view === "signup", "form");
  };

  const switchTo = (next: View) => {
    setView(next);
    setErrors({});
    setPassword("");
  };

  const googleButton = (
    <button type="button" onClick={google} disabled={!!busy || !!ok} aria-busy={busy === "google"} style={{ ...outline, ...(ok === "google" ? { borderColor: "var(--green)", color: "var(--green)" } : null) }}>
      <span key={ok === "google" ? "ok" : busy === "google" ? "busy" : "idle"} className="btn-swap">
        {ok === "google" ? <Tick /> : busy === "google" ? <Spinner color="#9A4E36" track="#D9C7B3" /> : <GoogleMark />}
        {ok === "google" ? t("lg.signed_in_short") : busy === "google" ? t("lg.google_wait") : t("lg.google")}
      </span>
    </button>
  );

  return (
    <div style={frame({ height: "844px" })}>
      <svg aria-hidden="true" width="390" height="844" viewBox="0 0 390 844" style={{ position: "absolute", inset: 0, opacity: 0.07, pointerEvents: "none" }}>
        <defs>
          <pattern id="jali-login" width="56" height="56" patternUnits="userSpaceOnUse">
            <rect x="14" y="14" width="28" height="28" fill="none" stroke="#9A4E36" strokeWidth="1.2" />
            <rect x="14" y="14" width="28" height="28" fill="none" stroke="#9A4E36" strokeWidth="1.2" transform="rotate(45 28 28)" />
            <circle cx="28" cy="28" r="5" fill="none" stroke="#9A4E36" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="390" height="300" fill="url(#jali-login)" />
      </svg>
      <div style={{ position: "relative", padding: "54px 8px 0", height: "98px", display: "flex", alignItems: "center" }}>
        {view === "choose" ? (
          <BackLink href="/welcome" aria-label={t("on.back")} style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </BackLink>
        ) : (
          <button type="button" aria-label={t("lg.back_options")} onClick={() => switchTo("choose")} style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
        )}
      </div>

      {user && !leaving ? (
        <div key="account" className="stagger" style={{ position: "relative", padding: "28px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <span style={{ width: "104px", height: "104px", borderRadius: "50%", padding: "4px", background: "var(--gold)" }}>
            <Avatar style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", display: "block", border: "3px solid var(--paper)" }} />
          </span>
          <h1 style={{ margin: "22px 0 0", fontSize: "28px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>{t("lg.signed_in")}</h1>
          <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700 }}>{user.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "14px", color: "var(--ink-soft)", overflowWrap: "anywhere" }}>
            {user.email} · {user.provider === "google" ? "Google" : "Email"}
          </p>
          <Link href="/home" style={{ ...primary, marginTop: "30px", textDecoration: "none" }}>
            {t("lg.continue")}
          </Link>
          <button
            type="button"
            onClick={() => {
              logOut();
              toast(t("lg.logged_out"));
            }}
            style={{ ...outline, marginTop: "12px" }}
          >
            {t("lg.other")}
          </button>
        </div>
      ) : view === "choose" ? (
        <div key="choose" className="stagger" style={{ position: "relative", padding: "18px 24px 0", display: "flex", flexDirection: "column" }}>
          <div className="splash-logo" style={{ alignSelf: "center", width: "112px", height: "112px", borderRadius: "50%", background: "var(--paper)", border: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 44px rgba(122, 74, 40, 0.16)" }}>
            <img src="/images/845c09135def6279c007582842533707.png" alt="Virasa" style={{ width: "66px", height: "72px", objectFit: "contain", display: "block" }} />
          </div>
          <h1 style={{ margin: "26px 0 0", fontSize: "30px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>{t("lg.title")}</h1>
          <p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: 1.5, color: "var(--ink-soft)", textAlign: "center", textWrap: "balance" }}>{t("lg.sub")}</p>
          <div style={{ marginTop: "34px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {googleButton}
            <button type="button" onClick={() => switchTo("signup")} style={primary}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              {t("lg.signup_email")}
            </button>
          </div>
          <div style={{ margin: "26px 0 0", display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: 600, color: "var(--ink-muted)" }}>
            <span style={{ flex: 1, height: "1px", background: "var(--line-strong)" }} />
            {t("lg.have")}
            <span style={{ flex: 1, height: "1px", background: "var(--line-strong)" }} />
          </div>
          <button type="button" onClick={() => switchTo("signin")} style={{ ...outline, marginTop: "16px", borderColor: "var(--clay)", color: "var(--clay)", background: "transparent" }}>
            {t("lg.login")}
          </button>
          <Link href="/personalize" style={{ marginTop: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "var(--ink-soft)" }}>
            {t("wl.guest")}
          </Link>
        </div>
      ) : (
        <form key={view} noValidate onSubmit={submit} className="stagger" style={{ position: "relative", padding: "6px 24px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>{view === "signup" ? t("lg.create") : t("lg.welcome")}</h1>
            <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "var(--ink-soft)" }}>{view === "signup" ? t("lg.create_sub") : t("lg.welcome_sub")}</p>
          </div>
          {view === "signup" ? (
            <Field label={t("lg.name")} error={errors.name}>
              <input type="text" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} style={{ ...field, borderColor: errors.name ? "var(--red)" : "var(--line-deep)" }} />
            </Field>
          ) : null}
          <Field label={t("lg.email")} error={errors.email}>
            <input type="email" name="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} style={{ ...field, borderColor: errors.email ? "var(--red)" : "var(--line-deep)" }} />
          </Field>
          <Field label={t("lg.password")} error={errors.password} hint={view === "signup" ? t("lg.pw_hint") : undefined}>
            <span style={{ position: "relative", display: "block" }}>
              <input type={showPassword ? "text" : "password"} name="password" autoComplete={view === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} style={{ ...field, paddingRight: "76px", borderColor: errors.password ? "var(--red)" : "var(--line-deep)" }} />
              <button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "6px", top: "5px", height: "44px", padding: "0 12px", border: 0, borderRadius: "10px", background: "none", color: "var(--clay)", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                {showPassword ? t("lg.hide") : t("lg.show")}
              </button>
            </span>
          </Field>
          {errors.form ? (
            <p key={tries} role="alert" className="shake" style={{ margin: 0, padding: "12px 14px", borderRadius: "12px", background: "#FBE9E4", color: "#8A2D1F", fontSize: "14px", lineHeight: 1.45, fontWeight: 600 }}>
              {errors.form}
            </p>
          ) : null}
          <button type="submit" disabled={!!busy || !!ok} aria-busy={busy === "form"} style={{ ...primary, marginTop: "4px", ...(ok === "form" ? { background: "var(--green)", boxShadow: "0 10px 22px rgba(47, 122, 74, 0.28)" } : null) }}>
            <span key={ok === "form" ? "ok" : busy === "form" ? "busy" : "idle"} className="btn-swap">
              {ok === "form" ? <Tick /> : busy === "form" ? <Spinner /> : null}
              {ok === "form" ? (view === "signup" ? t("lg.created") : t("lg.logged_in")) : busy === "form" ? (view === "signup" ? t("lg.creating") : t("lg.logging")) : view === "signup" ? t("lg.create_btn") : t("lg.login")}
            </span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: 600, color: "var(--ink-muted)" }}>
            <span style={{ flex: 1, height: "1px", background: "var(--line-strong)" }} />
            {t("lg.or")}
            <span style={{ flex: 1, height: "1px", background: "var(--line-strong)" }} />
          </div>
          {googleButton}
          <p style={{ margin: "2px 0 0", fontSize: "15px", color: "var(--ink-soft)", textAlign: "center" }}>
            {view === "signup" ? t("lg.have") : t("lg.new")}{" "}
            <button type="button" onClick={() => switchTo(view === "signup" ? "signin" : "signup")} style={{ minHeight: "44px", padding: "0 4px", border: 0, background: "none", color: "var(--clay)", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              {view === "signup" ? t("lg.login") : t("lg.signup")}
            </button>
          </p>
        </form>
      )}


      <Sheet open={setup} onClose={() => setSetup(false)} title="lg.g_title">
        <p>{t("lg.g_body")}</p>
        <button
          type="button"
          className="sheet-cta"
          onClick={() => {
            setSetup(false);
            switchTo("signup");
          }}
        >
          {t("lg.signup_email")}
        </button>
      </Sheet>
    </div>
  );
}
