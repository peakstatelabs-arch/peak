"use client";

import { SALE_HEADLINE, SALE_NAME } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";

/** Small "BLACK FRIDAY SALE" pill; renders nothing outside the sale. */
export function SaleBanner({
  initial,
  className = "",
}: {
  initial?: SaleStatus;
  className?: string;
}) {
  const sale = useSaleStatus(initial);
  if (!sale.live) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-dark)] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-slow" />
      <span>
        {SALE_NAME[sale.phase]} sale — {SALE_HEADLINE}
      </span>
    </div>
  );
}

/** `list` normally; struck-through `list` + `sale` while the sale is live. */
export function SalePriceInline({
  list,
  sale,
  initial,
}: {
  list: string;
  sale: string;
  initial?: SaleStatus;
}) {
  const status = useSaleStatus(initial);
  if (!status.live) return <>{list}</>;
  return (
    <>
      <span className="mr-1.5 text-[0.55em] font-semibold text-[var(--primary)]/40 line-through">
        {list}
      </span>
      {sale}
    </>
  );
}
