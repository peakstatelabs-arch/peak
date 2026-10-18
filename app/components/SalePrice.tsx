"use client";

import { SALE, type SaleStatus } from "@/app/lib/sale";
import { useSaleStatus } from "@/app/lib/useSaleStatus";

type Kind = "reta" | "powerCut";

/** Small "LIMITED-TIME SALE" pill; renders nothing once the sale is over. */
export function SaleBanner({
  kind,
  initial,
  className = "",
}: {
  kind: Kind;
  initial?: SaleStatus;
  className?: string;
}) {
  const sale = useSaleStatus(initial);
  if (!sale[kind]) return null;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--accent-dark)] ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-slow" />
      <span>{SALE.bannerText}</span>
    </div>
  );
}

/** `list` normally; struck-through `list` + `sale` while the sale is live. */
export function SalePriceInline({
  kind,
  list,
  sale,
  initial,
}: {
  kind: Kind;
  list: string;
  sale: string;
  initial?: SaleStatus;
}) {
  const status = useSaleStatus(initial);
  if (!status[kind]) return <>{list}</>;
  return (
    <>
      <span className="mr-1.5 text-[0.55em] font-semibold text-[var(--primary)]/40 line-through">
        {list}
      </span>
      {sale}
    </>
  );
}
