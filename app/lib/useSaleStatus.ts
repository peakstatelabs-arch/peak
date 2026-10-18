"use client";

import { useEffect, useState } from "react";
import type { SaleStatus } from "./sale";

const POLL_MS = 60_000;
const OFF: SaleStatus = { reta: false, powerCut: false };

// One shared poller for every component on the page.
let latest: SaleStatus | null = null;
const listeners = new Set<(s: SaleStatus) => void>();
let timer: number | undefined;

async function refresh() {
  try {
    const res = await fetch("/api/sale-status", { cache: "no-store" });
    if (!res.ok) return;
    latest = (await res.json()) as SaleStatus;
    listeners.forEach((fn) => fn(latest as SaleStatus));
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
