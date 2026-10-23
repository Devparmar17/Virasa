"use client";

import { readStored, setStored, useStored } from "./store";

// Who is using the app. `null` means a guest.
export type User = { name: string; email: string; picture?: string; provider: "google" | "email" };

// Email accounts live in this browser only (there is no server yet): the
// password is kept as a salted SHA-256 hash, never as typed.
type Account = { name: string; email: string; salt: string; hash: string };

export const useUser = () => useStored<User | null>("user", null);

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
// Google sign-in through Firebase Authentication, when its project is set in .env.local.
export const FIREBASE_READY = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN && process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

async function digest(salt: string, password: string) {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const out = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(out)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const accounts = () => readStored<Account[]>("accounts", []);
const clean = (email: string) => email.trim().toLowerCase();

export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

// Each returns an error message for the form, or null when it worked.
export async function signUp(name: string, email: string, password: string): Promise<string | null> {
  const list = accounts();
  if (list.some((a) => a.email === clean(email))) return "There's already an account with this email. Log in instead.";
  const salt = crypto.randomUUID();
  const account: Account = { name: name.trim(), email: clean(email), salt, hash: await digest(salt, password) };
  setStored("accounts", [...list, account]);
  setStored<User | null>("user", { name: account.name, email: account.email, provider: "email" });
  return null;
}

export async function logIn(email: string, password: string): Promise<string | null> {
  const account = accounts().find((a) => a.email === clean(email));
  // Same message either way, so the form doesn't reveal which emails have accounts.
  if (!account || account.hash !== (await digest(account.salt, password))) return "That email and password don't match. Check them and try again.";
  setStored<User | null>("user", { name: account.name, email: account.email, provider: "email" });
  return null;
}

export function logOut() {
  // A Google account signed in through Firebase is signed out there too.
  if (FIREBASE_READY && readStored<User | null>("user", null)?.provider === "google") {
    import("./firebase").then((m) => m.signOutOfGoogle()).catch(() => {});
  }
  setStored<User | null>("user", null);
}

type TokenResponse = { access_token?: string; error?: string };
type GoogleWindow = Window & {
  google?: { accounts: { oauth2: { initTokenClient: (o: { client_id: string; scope: string; callback: (r: TokenResponse) => void; error_callback?: (e: { type: string }) => void }) => { requestAccessToken: (o?: { prompt?: string }) => void } } } };
};

let gsi: Promise<void> | null = null;
function loadGoogle() {
  gsi ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      gsi = null;
      reject(new Error("Could not load Google sign-in"));
    };
    document.head.appendChild(s);
  });
  return gsi;
}

// Opens Google's account chooser and signs the traveller in with the account
// they pick. Needs NEXT_PUBLIC_GOOGLE_CLIENT_ID (see README).
export async function googleSignIn(): Promise<string | null> {
  // Firebase first: it handles Google's consent screen for any Google account.
  if (FIREBASE_READY) {
    const { signInWithGoogle } = await import("./firebase");
    const result = await signInWithGoogle();
    if ("error" in result) return result.error;
    setStored<User | null>("user", { ...result.profile, provider: "google" });
    return null;
  }
  if (!GOOGLE_CLIENT_ID) return "not-configured";
  try {
    await loadGoogle();
  } catch {
    return "Couldn't reach Google. Check your connection and try again.";
  }
  const google = (window as GoogleWindow).google;
  if (!google) return "Couldn't start Google sign-in. Try again.";
  return new Promise((resolve) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      callback: async (response) => {
        if (!response.access_token) {
          resolve("Google sign-in was cancelled.");
          return;
        }
        try {
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${response.access_token}` } });
          if (!res.ok) throw new Error(String(res.status));
          const profile = await res.json();
          setStored<User | null>("user", { name: profile.name || profile.email, email: profile.email, picture: profile.picture, provider: "google" });
          resolve(null);
        } catch {
          resolve("Signed in, but couldn't read your Google profile. Try again.");
        }
      },
      error_callback: (e) => resolve(e.type === "popup_closed" ? "Google sign-in was cancelled." : "Google's sign-in window was blocked. Allow pop-ups and try again."),
    });
    // Always show the account chooser, so a shared phone doesn't sign in as the last person.
    client.requestAccessToken({ prompt: "select_account" });
  });
}
