// Quantity-based "buy more of the same product, save more" discount.
//
// The discount is delivered by ONE reusable Stripe coupon per tier (no
// per-bundle SKUs). The checkout route counts the highest quantity of any
// SINGLE product in the cart, picks the tier, and auto-applies that coupon to
// the whole cart. Because it's applied server-side via the `discounts` param,
// nothing needs to be typed — but Stripe then disallows a customer-entered
// promo code in the same session, so the email code only applies on carts
// that don't qualify for a bulk tier (they're never worse off: the bulk tier
// is always ≥ the 10% email code).
//
// Stripe setup required (once): create three coupons whose IDs are exactly
// BULK10 (10% off), BULK15 (15% off), BULK20 (20% off) — or set the matching
// env vars below to your coupon IDs. Until they exist the checkout route falls
// back to a normal session so nothing breaks.

/**
 * Master switch for the whole feature — display AND checkout application.
 * Keep this in step with whether the Stripe coupons actually exist.
 */
export const BULK_DISCOUNTS_LIVE = true;

export type BulkTier = {
  /** Minimum quantity of a single product to unlock this tier. */
  minQty: number;
  /** Percent off the whole cart. */
  pct: number;
  /** Env var holding the Stripe coupon ID (server-side only). */
  couponEnv: string;
  /** Coupon ID used when the env var is unset (name it this in Stripe). */
  couponFallback: string;
};

// Ascending by minQty.
export const BULK_TIERS: BulkTier[] = [
  { minQty: 2, pct: 10, couponEnv: "STRIPE_COUPON_BULK10", couponFallback: "BULK10" },
  { minQty: 3, pct: 15, couponEnv: "STRIPE_COUPON_BULK15", couponFallback: "BULK15" },
  { minQty: 4, pct: 20, couponEnv: "STRIPE_COUPON_BULK20", couponFallback: "BULK20" },
];

/** Highest quantity held by any single product line in the cart. */
export function maxSameProductQty(lines: { quantity: number }[]): number {
  return lines.reduce((m, l) => Math.max(m, l.quantity), 0);
}

/** The best tier unlocked by a given single-product quantity, or null. */
export function bulkTierForQty(qty: number): BulkTier | null {
  if (!BULK_DISCOUNTS_LIVE) return null;
  let match: BulkTier | null = null;
  for (const t of BULK_TIERS) {
    if (qty >= t.minQty) match = t;
  }
  return match;
}

/** The next tier a customer could still reach from `qty`, or null if maxed. */
export function nextBulkTier(qty: number): BulkTier | null {
  if (!BULK_DISCOUNTS_LIVE) return null;
  for (const t of BULK_TIERS) {
    if (qty < t.minQty) return t;
  }
  return null;
}

/** Percent off for a given single-product quantity (0 if none). */
export function bulkPctForQty(qty: number): number {
  return bulkTierForQty(qty)?.pct ?? 0;
}

/** Resolve the Stripe coupon ID for a tier (server-side; reads env). */
export function resolveCouponId(tier: BulkTier): string {
  return process.env[tier.couponEnv] || tier.couponFallback;
}
