"use client";

import { useEffect, useState } from "react";
import type { SaleStatus } from "./sale";

const POLL_MS = 60_000;
const OFF: SaleStatus = { reta: false, powerCut: false };

// One shared poller for every component on the page.
let latest: SaleStatus | null = null;
const listeners = new Set<(s: SaleStatus) => void>();
let timer: number | undefined;

// Server clock sync for countdowns: offset = server time - browser time.
type Clock = { offsetMs: number; endsAt: { reta: number; powerCut: number } };
let clock: Clock | null = null;
const clockListeners = new Set<() => void>();

async function refresh() {
  try {
    const res = await fetch("/api/sale-status", { cache: "no-store" });
    if (!res.ok) return;
    const data = (await res.json()) as SaleStatus & {
      serverNow: number;
      endsAt: Clock["endsAt"];
    };
    clock = { offsetMs: data.serverNow - Date.now(), endsAt: data.endsAt };
    latest = { reta: data.reta, powerCut: data.powerCut };
    listeners.forEach((fn) => fn(latest as SaleStatus));
    clockListeners.forEach((fn) => fn());
  } catch {
    // Keep the last known state; checkout is authoritative anyway.
  }
}

/**
 * Sale state for display. `initial` is the server-rendered value; the hook then
 * confirms it against the SERVER clock (never the browser's) on mount and once
 * a minute, so an open tab returns to normal pricing when the sale ends.
 */
export function useSaleStatus(initial: SaleStatus = OFF): SaleStatus {
  const [status, setStatus] = useState<SaleStatus>(latest ?? initial);

  useEffect(() => {
    const onChange = (s: SaleStatus) =>
      setStatus((prev) =>
        prev.reta === s.reta && prev.powerCut === s.powerCut ? prev : s,
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
 * Milliseconds left in the sale for `kind`, ticking every second off the
 * SERVER clock. null until the first sync with the server completes.
 */
export function useSaleCountdown(kind: "reta" | "powerCut"): number | null {
  useSaleStatus(); // keeps the shared poller running
  const [msLeft, setMsLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () =>
      setMsLeft(
        clock ? clock.endsAt[kind] - (Date.now() + clock.offsetMs) : null,
      );
    update();
    clockListeners.add(update);
    const id = window.setInterval(update, 1000);
    return () => {
      clockListeners.delete(update);
      window.clearInterval(id);
    };
  }, [kind]);

  return msLeft;
}
