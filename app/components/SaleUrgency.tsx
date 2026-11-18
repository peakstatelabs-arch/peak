"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SALE_HEADLINE, SALE_NAME, type SalePhase } from "@/app/lib/sale";
import {
  useSaleCountdown,
  useSaleStatus,
  type SaleStatus,
} from "@/app/lib/useSaleStatus";

const HOUR = 3_600_000;

type Urgency = {
  /** Headline for the bar, escalating as the final deadline approaches. */
  label: string;
  bar: string;
  pulse: boolean;
};

/**
 * Urgency from the real time left (server clock). Black Friday flows straight
 * into Cyber Monday, so only the Cyber Monday deadline escalates.
 */
export function saleUrgency(phase: SalePhase, msLeft: number): Urgency {
  const base = {
    label: `${SALE_NAME[phase].toUpperCase()} SALE`,
    bar: "bg-[#0b0f1a] text-white",
    pulse: false,
  };
  if (phase !== "cm") return base;
  if (msLeft <= HOUR)
    return { label: "FINAL HOUR", bar: "bg-red-600 text-white", pulse: true };
  if (msLeft <= 3 * HOUR)
    return { label: "FINAL 3 HOURS", bar: "bg-red-600 text-white", pulse: false };
  if (msLeft <= 24 * HOUR)
    return { label: "LAST DAY", bar: "bg-amber-400 text-[#0b0f1a]", pulse: false };
  return base;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return d > 0
    ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
    : `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

/** Live "2d 04h 31m 12s" text; renders nothing until synced with the server. */
export function SaleCountdown({ className = "" }: { className?: string }) {
  const msLeft = useSaleCountdown();
  if (msLeft === null || msLeft <= 0) return null;
  return (
    <span className={`tabular-nums font-extrabold ${className}`}>
      {formatRemaining(msLeft)}
    </span>
  );
}

/**
 * Slim sale bar. Pages that have their own sticky header render it inside
 * that header (so it stays pinned) and publish its height as --sale-bar-h for
 * anchor offsets; everywhere else GlobalSaleBar shows it at the top.
 */
export function SaleBar({
  href = "/buildyourstack",
  cta = "Build your stack",
  initial,
  sticky = true,
}: {
  href?: string;
  cta?: string;
  initial?: SaleStatus;
  sticky?: boolean;
}) {
  const status = useSaleStatus(initial);
  const msLeft = useSaleCountdown();
  const ref = useRef<HTMLDivElement>(null);
  const live = status.live && (msLeft === null || msLeft > 0);

  useEffect(() => {
    if (!sticky) return;
    const root = document.documentElement;
    const el = ref.current;
    if (!live || !el) {
      root.style.removeProperty("--sale-bar-h");
      return;
    }
    const update = () =>
      root.style.setProperty("--sale-bar-h", `${el.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--sale-bar-h");
    };
  }, [live, sticky]);

  if (!live) return null;
  const u = saleUrgency(status.phase, msLeft ?? Infinity);

  // Two lines on phones (sale name, then the countdown); one line on desktop.
  // The "build your stack" link lives in each page's header instead.
  void href;
  void cta;
  return (
    <div
      ref={ref}
      className={`px-3 py-2.5 text-center font-bold ${u.bar}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-0.5 sm:flex-row sm:gap-4">
        <span className="inline-flex items-center gap-2 text-sm sm:text-sm tracking-[0.15em]">
          <span
            className={`h-2 w-2 rounded-full bg-[var(--accent)] ${u.pulse ? "animate-ping" : "animate-pulse-slow"}`}
          />
          {u.label}
          <span className="hidden sm:inline tracking-normal font-semibold opacity-90">· {SALE_HEADLINE}</span>
        </span>
        {msLeft !== null && (
          <span className={`text-[13px] sm:text-sm ${u.pulse ? "animate-pulse-slow" : ""}`}>
            <span className="opacity-70 font-semibold">Ends in </span>
            <SaleCountdown />
          </span>
        )}
      </div>
    </div>
  );
}

// Pages that render the bar themselves (or are the sale itself).
const OWN_BAR_PREFIXES = [
  "/getreta",
  "/singles",
  "/blackfriday",
  "/shred",
  "/build",
  "/radiance",
  "/limitless",
  "/foreverstrong",
  "/limitlessplus",
  "/buildyourstack",
  "/powercutsale",
  "/stacks",
  "/sale-over",
  "/creator",
];

/** Site-wide sale bar (layout) for every page without its own. */
export function GlobalSaleBar() {
  const pathname = usePathname() ?? "/";
  if (pathname === "/") return null;
  if (OWN_BAR_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return <SaleBar sticky={false} />;
}
