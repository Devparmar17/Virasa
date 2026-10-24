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

type View = "choose" | "signup" | "signin";

const onHash = (fn: () => void) => {
  window.addEventListener("hashchange", fn);
  return () => window.removeEventListener("hashchange", fn);
};
const field: CSSProperties = { width: "100%", height: "54px", padding: "0 14px", borderRadius: "14px", border: "1.5px solid #D9C7B3", background: "#FFFFFF", fontSize: "16px", color: "#2B1B10", outline: "none" };
const primary: CSSProperties = { width: "100%", height: "56px", border: 0, borderRadius: "16px", background: "#9A4E36", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "16px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(154, 78, 54, 0.24)" };
const outline: CSSProperties = { width: "100%", height: "56px", borderRadius: "16px", border: "1.5px solid #D9C7B3", background: "#FFFFFF", color: "#2B1B10", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" };

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 700 }}>{label}</span>
      {children}
      {error ? (
        <span role="alert" className="rise" style={{ display: "block", marginTop: "6px", fontSize: "13px", fontWeight: 600, color: "#A23A2A" }}>
          {error}
        </span>
      ) : hint ? (
        <span style={{ display: "block", marginTop: "6px", fontSize: "13px", color: "#6F5B4B" }}>{hint}</span>
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
  // Once someone signs in here we are already leaving, so only people who arrive signed in see their account.
  const [leaving, setLeaving] = useState(false);

  const done = (who: string, isNew: boolean, via: "google" | "form") => {
    setLeaving(true);
    setOk(via);
    toast(isNew ? `Welcome to Virasa, ${who}` : `Welcome back, ${who}`, "success");
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
    if (view === "signup" && name.trim().length < 2) found.name = "Enter your name.";
    if (!isEmail(email)) found.email = "Enter an email address like name@example.com.";
    if (view === "signup" ? password.length < 8 : !password) found.password = view === "signup" ? "Use at least 8 characters." : "Enter your password.";
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
    <button type="button" onClick={google} disabled={!!busy || !!ok} aria-busy={busy === "google"} style={{ ...outline, ...(ok === "google" ? { borderColor: "#2F7A4A", color: "#2F7A4A" } : null) }}>
      <span key={ok === "google" ? "ok" : busy === "google" ? "busy" : "idle"} className="btn-swap">
        {ok === "google" ? <Tick /> : busy === "google" ? <Spinner color="#9A4E36" track="#D9C7B3" /> : <GoogleMark />}
        {ok === "google" ? "Signed in" : busy === "google" ? "Waiting for Google…" : "Continue with Google"}
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
          <BackLink href="/welcome" aria-label="Back" style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </BackLink>
        ) : (
          <button type="button" aria-label="Back to sign-in options" onClick={() => switchTo("choose")} style={{ width: "44px", height: "44px", border: 0, borderRadius: "50%", background: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#2B1B10", cursor: "pointer" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
        )}
      </div>

      {user && !leaving ? (
        <div key="account" className="stagger" style={{ position: "relative", padding: "28px 24px 0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <span style={{ width: "104px", height: "104px", borderRadius: "50%", padding: "4px", background: "#8A6424" }}>
            <Avatar style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", display: "block", border: "3px solid #FFFFFF" }} />
          </span>
          <h1 style={{ margin: "22px 0 0", fontSize: "28px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>You&apos;re signed in</h1>
          <p style={{ margin: "8px 0 0", fontSize: "16px", fontWeight: 700 }}>{user.name}</p>
          <p style={{ margin: "2px 0 0", fontSize: "14px", color: "#5A4434", overflowWrap: "anywhere" }}>
            {user.email} · {user.provider === "google" ? "Google" : "Email"}
          </p>
          <Link href="/home" style={{ ...primary, marginTop: "30px", textDecoration: "none" }}>
            Continue to Virasa
          </Link>
          <button
            type="button"
            onClick={() => {
              logOut();
              toast("You're logged out");
            }}
            style={{ ...outline, marginTop: "12px" }}
          >
            Use a different account
          </button>
        </div>
      ) : view === "choose" ? (
        <div key="choose" className="stagger" style={{ position: "relative", padding: "18px 24px 0", display: "flex", flexDirection: "column" }}>
          <div className="splash-logo" style={{ alignSelf: "center", width: "112px", height: "112px", borderRadius: "50%", background: "#FFFFFF", border: "1px solid #EFE6DA", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 44px rgba(122, 74, 40, 0.16)" }}>
            <img src="/images/845c09135def6279c007582842533707.png" alt="Virasa" style={{ width: "66px", height: "72px", objectFit: "contain", display: "block" }} />
          </div>
          <h1 style={{ margin: "26px 0 0", fontSize: "30px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Your journey, saved</h1>
          <p style={{ margin: "10px 0 0", fontSize: "16px", lineHeight: 1.5, color: "#5A4434", textAlign: "center", textWrap: "balance" }}>Sign in so Virasa greets you by name.</p>
          <div style={{ marginTop: "34px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {googleButton}
            <button type="button" onClick={() => switchTo("signup")} style={primary}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              Sign up with email
            </button>
          </div>
          <div style={{ margin: "26px 0 0", display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>
            <span style={{ flex: 1, height: "1px", background: "#E2D3C1" }} />
            Already have an account?
            <span style={{ flex: 1, height: "1px", background: "#E2D3C1" }} />
          </div>
          <button type="button" onClick={() => switchTo("signin")} style={{ ...outline, marginTop: "16px", borderColor: "#9A4E36", color: "#9A4E36", background: "transparent" }}>
            Log in
          </button>
          <Link href="/personalize" style={{ marginTop: "8px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#5A4434" }}>
            Explore as guest
          </Link>
        </div>
      ) : (
        <form key={view} noValidate onSubmit={submit} className="stagger" style={{ position: "relative", padding: "6px 24px 0", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "28px", lineHeight: 1.15, fontWeight: 800, letterSpacing: "-0.02em" }}>{view === "signup" ? "Create your account" : "Welcome back"}</h1>
            <p style={{ margin: "8px 0 0", fontSize: "15px", lineHeight: 1.5, color: "#5A4434" }}>{view === "signup" ? "It takes less than a minute." : "Log in to pick up where you left off."}</p>
          </div>
          {view === "signup" ? (
            <Field label="Name" error={errors.name}>
              <input type="text" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} style={{ ...field, borderColor: errors.name ? "#A23A2A" : "#D9C7B3" }} />
            </Field>
          ) : null}
          <Field label="Email" error={errors.email}>
            <input type="email" name="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} style={{ ...field, borderColor: errors.email ? "#A23A2A" : "#D9C7B3" }} />
          </Field>
          <Field label="Password" error={errors.password} hint={view === "signup" ? "At least 8 characters." : undefined}>
            <span style={{ position: "relative", display: "block" }}>
              <input type={showPassword ? "text" : "password"} name="password" autoComplete={view === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} style={{ ...field, paddingRight: "76px", borderColor: errors.password ? "#A23A2A" : "#D9C7B3" }} />
              <button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "6px", top: "5px", height: "44px", padding: "0 12px", border: 0, borderRadius: "10px", background: "none", color: "#9A4E36", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </Field>
          {errors.form ? (
            <p key={tries} role="alert" className="shake" style={{ margin: 0, padding: "12px 14px", borderRadius: "12px", background: "#FBE9E4", color: "#8A2D1F", fontSize: "14px", lineHeight: 1.45, fontWeight: 600 }}>
              {errors.form}
            </p>
          ) : null}
          <button type="submit" disabled={!!busy || !!ok} aria-busy={busy === "form"} style={{ ...primary, marginTop: "4px", ...(ok === "form" ? { background: "#2F7A4A", boxShadow: "0 10px 22px rgba(47, 122, 74, 0.28)" } : null) }}>
            <span key={ok === "form" ? "ok" : busy === "form" ? "busy" : "idle"} className="btn-swap">
              {ok === "form" ? <Tick /> : busy === "form" ? <Spinner /> : null}
              {ok === "form" ? (view === "signup" ? "Account created" : "Logged in") : busy === "form" ? (view === "signup" ? "Creating your account…" : "Logging in…") : view === "signup" ? "Create account" : "Log in"}
            </span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: 600, color: "#6F5B4B" }}>
            <span style={{ flex: 1, height: "1px", background: "#E2D3C1" }} />
            or
            <span style={{ flex: 1, height: "1px", background: "#E2D3C1" }} />
          </div>
          {googleButton}
          <p style={{ margin: "2px 0 0", fontSize: "15px", color: "#5A4434", textAlign: "center" }}>
            {view === "signup" ? "Already have an account? " : "New to Virasa? "}
            <button type="button" onClick={() => switchTo(view === "signup" ? "signin" : "signup")} style={{ minHeight: "44px", padding: "0 4px", border: 0, background: "none", color: "#9A4E36", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
              {view === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>
        </form>
      )}


      <Sheet open={setup} onClose={() => setSetup(false)} title="Google sign-in isn't set up yet">
        <p>Google sign-in uses Firebase, and this copy of Virasa isn&apos;t connected to a Firebase project yet. Add the project&apos;s settings to .env.local to switch it on (the README has the steps), or use email for now.</p>
        <button
          type="button"
          className="sheet-cta"
          onClick={() => {
            setSetup(false);
            switchTo("signup");
          }}
        >
          Sign up with email
        </button>
      </Sheet>
    </div>
  );
}
