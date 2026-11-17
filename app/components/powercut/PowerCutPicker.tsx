"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { formatUsd } from "@/app/lib/money";
import {
  POWERCUT_SALE,
  POWERCUT_VALUE_CENTS,
  SALE_NAME,
  withPromoCode,
} from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import { ADDONS, PRODUCT_CUTOUT, type AddonKey } from "@/app/lib/bfStacks";

export type PcTier = {
  id: string;
  name: string;
  subtitle: string;
  features: string[];
  stripeUrl: string;
};

const IDS = ["single", "double", "triple"] as const;
const COUNT = ["One", "Two", "Three"];
const PEPTIDES = ["retatrutide", "cjc-ipamorelin", "bpc-tb500"] as const;
// Each name on at most two lines in the narrow tiles.
const NAME_LINES: Record<(typeof PEPTIDES)[number], string[]> = {
  retatrutide: ["Retatrutide"],
  "cjc-ipamorelin": ["CJC-1295/", "Ipamorelin Blend"],
  "bpc-tb500": ["BPC-157/", "TB-500 Blend"],
};
const DOSE: Record<(typeof PEPTIDES)[number], string> = {
  retatrutide: "20mg",
  "cjc-ipamorelin": "10mg",
  "bpc-tb500": "20mg",
};

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    // never block the page
  }
}

/** "Two POWER CUT™ Cycles (20 weeks)" */
export function cyclesLabel(n: number): string {
  return `${COUNT[n - 1]} POWER CUT™ Cycle${n === 1 ? "" : "s"} (${n * 10} weeks)`;
}

function Check() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function priceOf({ id, live }: { id: string; live: boolean }) {
  const value = POWERCUT_VALUE_CENTS[id];
  const price = POWERCUT_SALE[id].saleCents;
  const saved = value - price;
  return { value, price, saved, pct: Math.round((saved / value) * 100), live };
}

function ClaimButton({ tier, live, big }: { tier: PcTier; live: boolean; big?: boolean }) {
  const ps = POWERCUT_SALE[tier.id];
  const href = live ? withPromoCode(tier.stripeUrl, ps.code) : tier.stripeUrl;
  return (
    <>
      <a
        href={href}
        data-rewardful
        onClick={() => track("bf_powercut_checkout", { tier: tier.id })}
        className={`flex items-center justify-center whitespace-nowrap rounded-2xl bg-[var(--accent)] px-4 font-black text-[#0b0f1a] hover:opacity-90 ${big ? "h-16 text-lg sm:text-xl" : "h-14 text-base sm:text-lg"}`}
      >
        Claim my POWER CUT&trade; →
      </a>
      <p className="mt-2 text-center text-xs text-white/50">
        Code {ps.code} is applied for you at checkout.
      </p>
    </>
  );
}

/**
 * The BF POWER CUT™ offer: the recommended tier (what's inside, price, claim
 * button), then the other two tiers, each expandable to its full breakdown.
 */
export function PowerCutPicker({
  tiers,
  tier,
  fromQuiz,
  addon,
  initialSale,
}: {
  tiers: PcTier[];
  tier: 1 | 2 | 3;
  fromQuiz: boolean;
  addon: AddonKey | null;
  initialSale: SaleStatus;
}) {
  const sale = useSaleStatus(initialSale);
  const [open, setOpen] = useState<string | null>(null);
  const main = tiers.find((t) => t.id === IDS[tier - 1]) ?? tiers[1];
  const p = priceOf({ id: main.id, live: sale.live });
  const others = tiers.filter((t) => t.id !== main.id);

  return (
    <div id="pricing" className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14 scroll-mt-28">
      {fromQuiz && (
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
          ✓ Built from your answers
        </p>
      )}
      <h1 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight leading-tight">
        {fromQuiz ? "Your Stack: " : ""}
        {cyclesLabel(tier)}
      </h1>
      <p className="mt-3 text-base sm:text-lg text-white/75">
        Burn fat and build lean muscle at the same time — three peptides in one
        structured 10-week system, with 1-on-1 coaching included.
      </p>

      {/* What's inside: the three peptides, how many vials, how long */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {PEPTIDES.map((slug) => (
          <div key={slug} className="rounded-2xl border border-white/10 bg-white/5 px-1.5 py-3 text-center">
            <img src={PRODUCT_CUTOUT[slug]} alt="" aria-hidden="true" className="mx-auto h-16 sm:h-20 w-auto object-contain" />
            <p className="mt-2 text-lg font-black text-[var(--accent)]">
              {tier * 2} vials
            </p>
            <p className="text-[10.5px] sm:text-xs font-bold leading-tight tracking-tight text-white">
              {NAME_LINES[slug].map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </p>
            <p className="text-[11px] text-white/50">{DOSE[slug]}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-sm font-semibold text-white/70">
        {tier * 6} vials total · lasts {tier * 10} weeks
      </p>

      {/* Recommended card */}
      <div className="mt-6 rounded-3xl border-2 border-[var(--accent)] bg-white/5 p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-white/60">{main.name}</p>
        <p className="mt-1 text-base text-white/80">{main.subtitle}</p>
        <ul className="mt-4 space-y-2">
          {main.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-white/90">
              <Check />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-3 border-t border-white/10 pt-5">
          <span className="text-5xl font-black tabular-nums">{formatUsd(p.price)}</span>
          <span className="text-lg font-semibold text-white/40 line-through tabular-nums">
            {formatUsd(p.value)}
          </span>
        </div>
        <p className="mt-2 inline-flex rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-extrabold text-emerald-300">
          You save {formatUsd(p.saved)} ({p.pct}% off) · {SALE_NAME[sale.phase]} price
        </p>
        <div className="mt-5">
          <ClaimButton tier={main} live={sale.live} big />
        </div>
        {addon && (
          <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
            {ADDONS[addon].emoji} Want {ADDONS[addon].label.toLowerCase()} too?
            Right after checkout you can add it to your stack at{" "}
            <strong className="text-[var(--accent)]">40% off</strong>.
          </p>
        )}
      </div>

      {/* The other two options */}
      <p className="mt-10 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-white/60">
        Other POWER CUT&trade; options
      </p>
      <div className="mt-3 space-y-3">
        {others.map((t) => {
          const n = IDS.indexOf(t.id as (typeof IDS)[number]) + 1;
          const op = priceOf({ id: t.id, live: sale.live });
          const isOpen = open === t.id;
          return (
            <div key={t.id} className="rounded-2xl border border-white/15 bg-white/5">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setOpen(isOpen ? null : t.id);
                  if (!isOpen) track("bf_powercut_option_open", { tier: t.id });
                }}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <span>
                  <span className="block text-base font-extrabold">{cyclesLabel(n)}</span>
                  <span className="block text-xs text-white/60">
                    {t.name} · {n * 6} vials
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="flex-shrink-0 text-right tabular-nums">
                    <span className="block text-xl font-black">{formatUsd(op.price)}</span>
                    <span className="block whitespace-nowrap text-[11px] font-bold text-emerald-300">
                      Save {op.pct}%
                    </span>
                  </span>
                  <span className={`text-xl text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
                    ⌄
                  </span>
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-white/10 p-4">
                  <p className="text-sm text-white/80">{t.subtitle}</p>
                  <ul className="mt-3 space-y-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/90">
                        <Check />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm">
                    <span className="mr-2 text-white/40 line-through">{formatUsd(op.value)}</span>
                    <span className="font-extrabold text-emerald-300">
                      You save {formatUsd(op.saved)} ({op.pct}% off)
                    </span>
                  </p>
                  <div className="mt-4">
                    <ClaimButton tier={t} live={sale.live} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
