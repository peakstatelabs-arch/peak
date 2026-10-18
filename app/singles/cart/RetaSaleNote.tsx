"use client";

import { SaleBanner } from "@/app/components/SalePrice";
import { useSaleStatus } from "@/app/lib/useSaleStatus";
import type { SaleStatus } from "@/app/lib/sale";

/** Sale banner + bundle prices shown above the Reta add-to-cart button. */
export function RetaSaleNote({ initial }: { initial?: SaleStatus }) {
  const sale = useSaleStatus(initial);
  if (!sale.reta) return null;
  return (
    <div className="mb-4 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-3 py-3 text-center">
      <SaleBanner kind="reta" initial={initial} />
      <p className="mt-2 text-sm font-bold text-[var(--primary)]">
        1 vial <span className="text-[var(--accent-dark)]">$165</span>{" "}
        <span className="text-xs font-semibold text-[var(--primary)]/45 line-through">
          $215
        </span>{" "}
        <span className="text-[var(--primary)]/30">·</span> 2 vials{" "}
        <span className="text-[var(--accent-dark)]">$330</span>{" "}
        <span className="text-xs font-semibold text-[var(--primary)]/45 line-through">
          $430
        </span>{" "}
        <span className="text-[var(--primary)]/30">·</span> 3 vials{" "}
        <span className="text-[var(--accent-dark)]">$495</span>{" "}
        <span className="text-xs font-semibold text-[var(--primary)]/45 line-through">
          $645
        </span>
      </p>
      <p className="mt-1 text-[11px] text-[var(--primary)]/60">
        Save $50 on one, $100 on two, $150 on three. Sale prices don&rsquo;t
        combine with other discounts.
      </p>
    </div>
  );
}
