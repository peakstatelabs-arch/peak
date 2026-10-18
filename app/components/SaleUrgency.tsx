"use client";

import { useEffect, useRef } from "react";
import type { SaleStatus } from "@/app/lib/sale";
import { useSaleCountdown, useSaleStatus } from "@/app/lib/useSaleStatus";

type Kind = "reta" | "powerCut";

const HOUR = 3_600_000;

type Phase = {
  /** Headline for the bar, escalating as the deadline approaches. */
  label: string;
  bar: string;
  pulse: boolean;
};

/** Urgency level from the real time left (server clock). */
export function salePhase(msLeft: number): Phase {
  if (msLeft <= HOUR)
    return { label: "FINAL HOUR", bar: "bg-red-600 text-white", pulse: true };
  if (msLeft <= 3 * HOUR)
    return { label: "FINAL 3 HOURS", bar: "bg-red-600 text-white", pulse: false };
  if (msLeft <= 24 * HOUR)
    return {
      label: "LAST DAY",
      bar: "bg-amber-400 text-[var(--primary)]",
      pulse: false,
    };
  return {
    label: "SALE ENDS FRIDAY",
    bar: "bg-[var(--primary)] text-white",
    pulse: false,
  };
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
export function SaleCountdown({
  kind,
  className = "",
}: {
  kind: Kind;
  className?: string;
}) {
  const msLeft = useSaleCountdown(kind);
  if (msLeft === null || msLeft <= 0) return null;
  return (
    <span className={`tabular-nums font-extrabold ${className}`}>
      {formatRemaining(msLeft)}
    </span>
  );
}

const BAR_COPY: Record<Kind, { savings: string; cta: string }> = {
  reta: { savings: "Save up to $150 on Retatrutide", cta: "Shop the sale" },
  powerCut: { savings: "Save up to $170 on POWER CUT™", cta: "Shop the sale" },
};

/**
 * Slim sale bar rendered inside each page's sticky header, so it stays pinned
 * while scrolling. Publishes its height as --sale-bar-h for anchor offsets.
 */
export function SaleBar({
  kind,
  href,
  initial,
}: {
  kind: Kind;
  href: string;
  initial?: SaleStatus;
}) {
  const status = useSaleStatus(initial);
  const msLeft = useSaleCountdown(kind);
  const ref = useRef<HTMLDivElement>(null);
  const live = status[kind] && (msLeft === null || msLeft > 0);

  useEffect(() => {
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
  }, [live]);

  if (!live) return null;
  const phase = salePhase(msLeft ?? Infinity);
  const copy = BAR_COPY[kind];

  return (
    <div
      ref={ref}
      className={`px-3 py-2 text-center text-[11px] sm:text-sm font-bold ${phase.bar}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-0.5 sm:gap-x-4">
        <span className="inline-flex items-center gap-1.5 tracking-wider">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-current ${phase.pulse ? "animate-ping" : "animate-pulse-slow"}`}
          />
          {phase.label}
        </span>
        <span className="hidden sm:inline opacity-90">{copy.savings}</span>
        {msLeft !== null && (
          <span className={phase.pulse ? "animate-pulse-slow" : ""}>
            <SaleCountdown kind={kind} />
          </span>
        )}
        <a href={href} className="underline underline-offset-2 hover:opacity-80">
          {copy.cta} →
        </a>
      </div>
    </div>
  );
}

type Tile = { qty: string; sale: string; was: string; save: string; best?: boolean };

const TILES: Record<Kind, Tile[]> = {
  reta: [
    { qty: "1 vial", sale: "$165", was: "$215", save: "Save $50" },
    { qty: "2 vials", sale: "$330", was: "$430", save: "Save $100" },
    { qty: "3 vials", sale: "$495", was: "$645", save: "Save $150", best: true },
  ],
  powerCut: [
    { qty: "1 stack", sale: "$499", was: "$599", save: "Save $100" },
    { qty: "2 stacks", sale: "$849", was: "$1,019", save: "Save $170", best: true },
  ],
};

/** Compact "here's the deal" card for hero sections. */
export function SaleHeroStrip({
  kind,
  href,
  initial,
  className = "",
}: {
  kind: Kind;
  href: string;
  initial?: SaleStatus;
  className?: string;
}) {
  const status = useSaleStatus(initial);
  const msLeft = useSaleCountdown(kind);
  if (!status[kind] || (msLeft !== null && msLeft <= 0)) return null;
  const phase = salePhase(msLeft ?? Infinity);

  return (
    <div
      className={`rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-3 sm:p-4 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">
          {phase.label === "SALE ENDS FRIDAY"
            ? "Limited-time sale — ends Friday"
            : `Limited-time sale — ${phase.label.toLowerCase()}`}
        </span>
        {msLeft !== null && (
          <SaleCountdown
            kind={kind}
            className="text-xs text-[var(--primary)]/70"
          />
        )}
      </div>
      <div
        className={`mt-2 grid gap-2 ${TILES[kind].length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
      >
        {TILES[kind].map((t) => (
          <a
            key={t.qty}
            href={href}
            className="relative rounded-xl border border-[var(--border)] bg-white px-2 py-2.5 text-center transition-colors hover:border-[var(--accent)]"
          >
            {t.best ? (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                Best value
              </span>
            ) : null}
            <span className="block text-[11px] font-semibold text-[var(--primary)]/60">
              {t.qty}
            </span>
            <span className="block text-xl font-extrabold tabular-nums text-[var(--primary)] sm:text-2xl">
              {t.sale}
            </span>
            <span className="block text-[11px] font-semibold tabular-nums text-[var(--primary)]/40 line-through">
              {t.was}
            </span>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              {t.save}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
