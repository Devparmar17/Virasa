"use client";

import { useCallback, useSyncExternalStore } from "react";

// Small persisted app state (saved places, language, settings…), kept in
// localStorage and shared between every component that reads the same key.
const PREFIX = "virasa:";
const cache = new Map<string, unknown>();
const defaults = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function read<T>(key: string): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = defaults.get(key) as T;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw !== null) value = JSON.parse(raw);
  } catch {
    // Storage blocked or corrupt: fall back to the default.
  }
  cache.set(key, value);
  return value;
}

// Reads a stored value outside React (event handlers, auth helpers).
export function readStored<T>(key: string, initial: T): T {
  if (!defaults.has(key)) defaults.set(key, initial);
  return typeof window === "undefined" ? initial : read<T>(key);
}

export function setStored<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Still works for this visit, just not persisted.
  }
  listeners.get(key)?.forEach((fn) => fn());
}

export function useStored<T>(key: string, initial: T) {
  if (!defaults.has(key)) defaults.set(key, initial);
  const subscribe = useCallback(
    (fn: () => void) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(fn);
      return () => {
        listeners.get(key)?.delete(fn);
      };
    },
    [key]
  );
  const value = useSyncExternalStore(
    subscribe,
    () => read<T>(key),
    () => defaults.get(key) as T
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read<T>(key);
      setStored(key, typeof next === "function" ? (next as (p: T) => T)(prev) : next);
    },
    [key]
  );
  return [value, set] as const;
}

// Clears everything the app has remembered on this device.
export function resetStored() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Nothing persisted to clear.
  }
  cache.clear();
  listeners.forEach((set) => set.forEach((fn) => fn()));
}

import { DEFAULT_SAVED } from "./store-shared";

// Registered up front so every reader of "saved" starts from the same places.
defaults.set("saved", DEFAULT_SAVED);

export { DEFAULT_SAVED, LANGS, langOf, speechLocale } from "./store-shared";

import { DEFAULT_PROFILE, type Profile } from "./profile";

// Who is travelling, as sent to the AI: the profile, plus the step-free switch
// that Settings, walks and the trip planner share.
// The first default registered for a key is the one every reader gets, so these match the other readers.
export const travellerProfile = (): Profile => ({ ...DEFAULT_PROFILE, ...readStored<Profile>("profile", DEFAULT_PROFILE), stepFree: readStored("switches", { auto: true, desc: false, steps: false }).steps });
