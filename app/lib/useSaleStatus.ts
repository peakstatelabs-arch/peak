"use client";

import { useEffect, useState } from "react";
import type { SalePhase } from "./sale";

export type SaleStatus = { phase: SalePhase; live: boolean };

const POLL_MS = 60_000;
const OFF: SaleStatus = { phase: "pre", live: false };

// One shared poller for every component on the page.
let latest: SaleStatus | null = null;
const listeners = new Set<(s: SaleStatus) => void>();
let timer: number | undefined;

// Server clock sync for countdowns: offset = server time - browser time.
type Clock = { offsetMs: number; endsAt: number | null };
let clock: Clock | null = null;
const clockListeners = new Set<() => void>();

async function refresh() {
  try {
    const res = await fetch("/api/sale-status", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as SaleStatus & {
      serverNow: number;
      endsAt: number | null;
    };
    clock = { offsetMs: data.serverNow - Date.now(), endsAt: data.endsAt };
    latest = { phase: data.phase, live: data.live };
    listeners.forEach((fn) => fn(latest as SaleStatus));
    clockListeners.forEach((fn) => fn());
  } catch {
    // Keep the last known state; checkout is authoritative anyway.
  }
}

/**
 * Sale state for display. `initial` is the server-rendered value; the hook then
 * confirms it against the SERVER (clock + preview cookie) on mount and once a
 * minute, so an open tab flips phases on its own.
 */
export function useSaleStatus(initial: SaleStatus = OFF): SaleStatus {
  const [status, setStatus] = useState<SaleStatus>(latest ?? initial);

  useEffect(() => {
    const onChange = (s: SaleStatus) =>
      setStatus((prev) =>
        prev.phase === s.phase && prev.live === s.live ? prev : s,
      );
    listeners.add(onChange);
    if (listeners.size === 1) {
      refresh();
      timer = window.setInterval(refresh, POLL_MS);
    } else if (latest) {
      onChange(latest);
    }
    return () => {
      listeners.delete(onChange);
      if (listeners.size === 0) window.clearInterval(timer);
    };
  }, []);

  return status;
}

/**
 * Milliseconds left in the current sale phase (Black Friday, then Cyber
 * Monday), ticking every second off the SERVER clock. null until synced or
 * when no sale is running.
 */
export function useSaleCountdown(): number | null {
  useSaleStatus(); // keeps the shared poller running
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setMsLeft(
        clock && clock.endsAt !== null
          ? clock.endsAt - (Date.now() + clock.offsetMs)
          : null,
      );
    update();
    clockListeners.add(update);
    const id = window.setInterval(update, 1000);
    return () => {
      clockListeners.delete(update);
      window.clearInterval(id);
    };
  }, []);

  return msLeft;
}
