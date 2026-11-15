"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

/* ============================================================
 * Tiny localStorage-backed store for the 20-Pound Reta Roadmap.
 *
 * Everything a reader enters (their weights, checklists, weekly
 * scorecards) lives only in their own browser under the "rr:" prefix.
 * Values are read through useSyncExternalStore so the server render and
 * the first client render agree (both see the fallback), then hydrate.
 * ============================================================ */

export const STORAGE_PREFIX = "rr:";
const STORE_EVENT = "rr:store-changed";

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(STORAGE_PREFIX + key);
    else window.localStorage.setItem(STORAGE_PREFIX + key, value);
  } catch {
    /* storage unavailable (private mode etc.) — the page still works */
  }
  window.dispatchEvent(new Event(STORE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(STORE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(STORE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * A JSON value persisted under `key`. `fallback` must be referentially
 * stable (define it at module scope) so snapshots stay stable.
 */
export function usePersistent<T>(key: string, fallback: T) {
  const cache = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: fallback,
  });

  const getSnapshot = useCallback(() => {
    const raw = readRaw(key);
    if (raw !== cache.current.raw) {
      let value = fallback;
      if (raw) {
        try {
          value = JSON.parse(raw) as T;
        } catch {
          value = fallback;
        }
      }
      cache.current = { raw, value };
    }
    return cache.current.value;
  }, [key, fallback]);

  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    [key, getSnapshot],
  );

  return [value, set] as const;
}

/** True once the component is running in the browser (post-hydration). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** Clears everything the roadmap has saved for this reader. */
export function resetAll() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(STORE_EVENT));
}
