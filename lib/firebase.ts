"use client";

// Firebase Authentication, used for "Continue with Google". The config values
// are public identifiers for the Firebase project (not secrets) and come from
// NEXT_PUBLIC_FIREBASE_* in .env.local. This module is loaded only when someone
// signs in with Google, so the rest of the app doesn't carry Firebase.
import { getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type AuthError } from "firebase/auth";

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
    const messages: Record<string, string> = {
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/cancelled-popup-request": "Google sign-in was cancelled.",
      "auth/popup-blocked": "Your browser blocked Google's sign-in window. Allow pop-ups for this site and try again.",
      "auth/unauthorized-domain": "This web address isn't allowed to sign in yet. Add it in Firebase under Authentication › Settings › Authorized domains.",
      "auth/operation-not-allowed": "Google sign-in is switched off in Firebase. Turn it on under Authentication › Sign-in method › Google.",
      "auth/network-request-failed": "Couldn't reach Google. Check your connection and try again.",
      "auth/invalid-api-key": "The Firebase settings in .env.local don't look right. Check the API key.",
    };
    return { error: messages[code] || "Google sign-in didn't work this time. Try again." };
  }
}

export async function signOutOfGoogle() {
  try {
    await signOut(auth());
  } catch {
    // Already signed out of Firebase: nothing to do.
  }
}
