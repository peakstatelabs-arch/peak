"use client";

import { useState, type ReactNode } from "react";
import { SaleBanner } from "@/app/components/SalePrice";
import { useSaleStatus } from "@/app/lib/useSaleStatus";
import type { SaleStatus } from "@/app/lib/sale";
import { TIERS, tierPricing } from "@/app/getreta/retaBundles";
import { AddToCartButton } from "./AddToCartButton";
import { formatUsd } from "./CartContext";

type Props = {
  initial?: SaleStatus;
  /** The normal price + add-to-cart block, shown whenever the sale is off. */
  fallback: ReactNode;
  slug: string;
  priceId: string;
  name: string;
  dose: string;
  unitPriceCents: number;
  image?: string;
};

/**
 * Retatrutide card buy area. During the sale it's a 1/2/3-vial selector with
 * the sale prices; otherwise it renders the standard single-vial block.
 */
export function RetaCardBuy({ initial, fallback, ...product }: Props) {
  const saleActive = useSaleStatus(initial).reta;
  const [selected, setSelected] = useState(1);

  if (!saleActive) return <>{fallback}</>;

  return (
    <div>
      <div className="mb-3 text-center">
        <SaleBanner kind="reta" initial={initial} />
      </div>

      <div role="radiogroup" aria-label="Choose quantity" className="grid gap-2">
        {TIERS.map((t) => {
          const p = tierPricing(t, true);
          const active = t.vials === selected;
          return (
            <button
              key={t.vials}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(t.vials)}
              className={`relative flex items-center justify-between gap-3 rounded-xl border-2 px-3.5 py-3 text-left transition-all ${
                active
                  ? "border-[var(--primary)] bg-white shadow-sm"
                  : "border-[var(--border)] bg-white/60 hover:border-[var(--accent)]"
              }`}
            >
              {t.vials === 3 ? (
                <span className="absolute -top-2 right-3 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                  Best value
                </span>
              ) : null}
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    active ? "border-[var(--primary)]" : "border-[var(--border)]"
                  }`}
                >
                  {active ? (
                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-sm font-bold text-[var(--primary)]">
                    {t.vials} {t.vials === 1 ? "vial" : "vials"}
                  </span>
                  <span className="block text-[11px] font-medium text-[var(--primary)]/55">
                    ~{t.supply}
                  </span>
                </span>
              </span>
              <span className="flex flex-col items-end text-right tabular-nums">
                <span className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-[var(--primary)]/40 line-through">
                    {formatUsd(p.full)}
                  </span>
                  <span className="text-lg font-extrabold text-[var(--primary)]">
                    {formatUsd(p.discounted)}
                  </span>
                </span>
                <span className="mt-0.5 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Save {formatUsd(p.saves)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        <AddToCartButton {...product} quantity={selected} />
      </div>
      <p className="mt-2 text-center text-xs font-semibold text-[var(--accent-dark)]">
        Sale price applied automatically at checkout — no code needed.
      </p>
    </div>
  );
}
