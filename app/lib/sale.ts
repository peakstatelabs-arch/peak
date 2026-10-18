// Temporary promotional sale (Reta + POWER CUT™). Single source of truth for
// the sale window, prices and promo codes. No imports from the app's alias
// paths so it can be used from server routes, client components and scripts.
//
// To retire the sale entirely, delete this file's consumers or just let it
// expire — every check below is driven by the server clock, so nothing needs
// to be changed by hand when the window closes.

import { SINGLES_PRICE_IDS } from "../singles/cart/priceCatalog";
import { bulkTierForQty, maxSameProductQty } from "./bulkDiscount";

export const SALE = {
  timeZone: "America/New_York",
  // Starts immediately on deploy (no start gate).
  // Friday, Oct 23, 2026, 11:59 PM America/New_York. EDT (UTC-4) is in effect
  // until Nov 1, 2026, so the fixed offset is correct for this date.
  endsAt: "2026-10-23T23:59:59.999-04:00",
  bannerText: "LIMITED-TIME SALE — ENDS FRIDAY AT MIDNIGHT ET",
} as const;

export const SALE_ENDS_AT_MS = Date.parse(SALE.endsAt);

// Stripe Checkout Sessions must live at least 30 minutes. Sale-priced sessions
// are made to expire at the sale end, so new ones stop being created this long
// before it (30 min + 1 min safety margin). That guarantees no session can be
// paid at a sale price after the deadline.
const STRIPE_MIN_SESSION_MS = 31 * 60 * 1000;
export const RETA_SALE_CUTOFF_MS = SALE_ENDS_AT_MS - STRIPE_MIN_SESSION_MS;

/** POWER CUT sale: runs to the end of the window (Stripe expires the codes). */
export function isPowerCutSaleActive(nowMs: number = Date.now()): boolean {
  return nowMs <= SALE_ENDS_AT_MS;
}

/** Reta sale: server-priced, so it stops early enough for session expiry. */
export function isRetaSaleActive(nowMs: number = Date.now()): boolean {
  return nowMs <= RETA_SALE_CUTOFF_MS;
}

export type SaleStatus = { reta: boolean; powerCut: boolean };

export function saleStatus(nowMs: number = Date.now()): SaleStatus {
  return { reta: isRetaSaleActive(nowMs), powerCut: isPowerCutSaleActive(nowMs) };
}

// ── Reta ────────────────────────────────────────────────────────────────────
export const RETA_PRICE_ID = SINGLES_PRICE_IDS.retatrutide;
export const RETA_LIST_UNIT_CENTS = 21500;

/** Sale TOTAL (cents) for the Reta quantities that are on sale. */
export const RETA_SALE_TOTAL_CENTS: Record<number, number> = {
  1: 16500,
  2: 33000,
};

export function retaSaleTotalCents(quantity: number): number | null {
  return RETA_SALE_TOTAL_CENTS[quantity] ?? null;
}

// ── POWER CUT™ (Payment Links; discount comes from a Stripe promo code) ─────
export const POWERCUT_SALE: Record<
  string,
  { code: string; saleCents: number; listCents: number; installment: string }
> = {
  single: { code: "CUT100", saleCents: 49900, listCents: 59900, installment: "$124.75" },
  double: { code: "CUT170", saleCents: 84900, listCents: 101900, installment: "$212.25" },
};

/** Payment Link URL with the sale code pre-applied at Stripe checkout. */
export function withPromoCode(url: string, code: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}prefilled_promo_code=${encodeURIComponent(code)}`;
}

// ── Cart pricing (shared by the cart drawer and the checkout route) ─────────
export type PriceLineInput = {
  priceId: string;
  quantity: number;
  /** List unit price in cents. */
  unitPriceCents: number;
};

export type PricedCart = {
  /** Charged amount per line, keyed by priceId (null = not a sale line). */
  saleLineCents: Record<string, number | null>;
  hasSaleLines: boolean;
  /** Everything at list price. */
  subtotalCents: number;
  /** List price minus sale price on sale lines. */
  saleSavingsCents: number;
  bulkPct: number;
  bulkDiscountCents: number;
  totalCents: number;
};

export function isRetaSaleLine(
  line: { priceId: string; quantity: number },
  retaSale: boolean,
): boolean {
  return (
    retaSale &&
    line.priceId === RETA_PRICE_ID &&
    retaSaleTotalCents(line.quantity) !== null
  );
}

/**
 * Sale lines are fixed at their sale price and never take part in the bulk
 * discount. When any sale line is present, the bulk tier comes from the
 * remaining lines only and discounts only them. With no sale line this is
 * exactly the pre-sale behaviour (tier from the highest single-product
 * quantity, applied to the whole cart).
 */
export function priceCart(lines: PriceLineInput[], retaSale: boolean): PricedCart {
  const saleLineCents: Record<string, number | null> = {};
  let subtotalCents = 0;
  let saleSavingsCents = 0;
  let nonSaleListCents = 0;
  let saleChargedCents = 0;
  const nonSale: PriceLineInput[] = [];

  for (const l of lines) {
    const list = l.unitPriceCents * l.quantity;
    subtotalCents += list;
    if (isRetaSaleLine(l, retaSale)) {
      const sale = retaSaleTotalCents(l.quantity)!;
      saleLineCents[l.priceId] = sale;
      saleSavingsCents += list - sale;
      saleChargedCents += sale;
    } else {
      saleLineCents[l.priceId] = null;
      nonSale.push(l);
      nonSaleListCents += list;
    }
  }

  const hasSaleLines = nonSale.length !== lines.length;
  const tier = bulkTierForQty(maxSameProductQty(nonSale));
  const bulkPct = tier?.pct ?? 0;
  const bulkDiscountCents = Math.round((nonSaleListCents * bulkPct) / 100);

  return {
    saleLineCents,
    hasSaleLines,
    subtotalCents,
    saleSavingsCents,
    bulkPct,
    bulkDiscountCents,
    totalCents: saleChargedCents + nonSaleListCents - bulkDiscountCents,
  };
}
