"use client";

// Firebase Authentication, used for "Continue with Google". The config values
// are public identifiers for the Firebase project (not secrets) and come from
// NEXT_PUBLIC_FIREBASE_* in .env.local. This module is loaded only when someone
// signs in with Google, so the rest of the app doesn't carry Firebase.
import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type AuthError } from "firebase/auth";
import { tr, type Key } from "./i18n";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const auth = () => getAuth(getApps()[0] ?? initializeApp(config));

export type GoogleProfile = { name: string; email: string; picture?: string };

// Opens Google's account chooser in a popup; resolves with the profile, or an
// error message for the login screen.
export async function signInWithGoogle(): Promise<{ profile: GoogleProfile } | { error: string }> {
  const provider = new GoogleAuthProvider();
  // Always offer the account chooser, so a shared phone doesn't reuse the last person.
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const { user } = await signInWithPopup(auth(), provider);
    const email = user.email || "";
    return { profile: { name: user.displayName || email.split("@")[0] || "Traveller", email, picture: user.photoURL || undefined } };
  } catch (e) {
    const code = (e as AuthError)?.code || "";
    // Travellers see a plain message in their language. Setup problems (this web
    // address not yet allowed in Firebase, Google sign-in switched off, a wrong
    // key) all say the same thing: use email for now. The code goes to the console.
    if (code) console.warn("Google sign-in:", code);
    const messages: Record<string, Key> = {
      "auth/popup-closed-by-user": "lg.g_cancel",
      "auth/cancelled-popup-request": "lg.g_cancel",
      "auth/popup-blocked": "lg.g_popup",
      "auth/unauthorized-domain": "lg.g_ready",
      "auth/operation-not-allowed": "lg.g_ready",
      "auth/invalid-api-key": "lg.g_ready",
      "auth/network-request-failed": "lg.g_net",
    };
    return { error: tr(messages[code] || "lg.g_fail") };
  }
}

export async function signOutOfGoogle() {
  try {
    await signOut(auth());
  } catch {
    // Already signed out of Firebase: nothing to do.
  }
}
