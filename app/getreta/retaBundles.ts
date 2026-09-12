import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";

// ── Reta product (mirrors the Stripe Price + /singles catalog) ──────────────
export const RETA = {
  slug: "retatrutide" as const,
  priceId: SINGLES_PRICE_IDS.retatrutide,
  name: "Retatrutide",
  dose: "20mg",
  unitPriceCents: 21500,
};

/**
 * Bundle discounts.
 *
 * The cart charges through the single-vial Stripe Price, so a real bundle
 * discount is delivered by a Stripe *promotion code* the customer applies at
 * checkout (`allow_promotion_codes` is already enabled on the Checkout
 * Session). Until those codes exist in Stripe this stays `false` so the page
 * never advertises a discount that wouldn't actually apply.
 *
 * To turn savings on:
 *   1. Create the promo codes below in Stripe (percent-off, first-order).
 *   2. Flip BUNDLE_DISCOUNTS_LIVE to true.
 * (Or ask to switch to dedicated bundle Price IDs for auto-applied pricing.)
 */
export const BUNDLE_DISCOUNTS_LIVE = false;

export type Tier = {
  vials: number;
  label: string;
  blurb: string;
  /** Product mockup shown when this tier is selected (filenames have spaces). */
  image: string;
  /** Approx. how long this many vials lasts at a standard titration schedule. */
  supply: string;
  /** Percent off when BUNDLE_DISCOUNTS_LIVE — applied via `code` at checkout. */
  discountPct: number;
  code?: string;
  highlight?: boolean;
};

export const TIERS: Tier[] = [
  {
    vials: 1,
    label: "Single Vial",
    blurb: "One 20mg vial — try it or top up a run in progress.",
    image: "/reta%20mockup%201.png",
    supply: "6–8 weeks",
    discountPct: 0,
  },
  {
    vials: 2,
    label: "Two-Vial",
    blurb: "Covers titration into your maintenance dose without a reorder.",
    image: "/reta%20mockup%202.png",
    supply: "12–16 weeks",
    discountPct: 10,
    code: "RETA2",
    highlight: true,
  },
  {
    vials: 3,
    label: "Full Cycle",
    blurb: "A complete research cycle, stocked start to finish.",
    image: "/reta%20mockup%203.png",
    supply: "18–24 weeks",
    discountPct: 15,
    code: "RETA3",
  },
];

export function tierPricing(tier: Tier) {
  const full = tier.vials * RETA.unitPriceCents;
  const live = BUNDLE_DISCOUNTS_LIVE && tier.discountPct > 0;
  const discounted = live
    ? Math.round(full * (1 - tier.discountPct / 100))
    : full;
  return { full, discounted, live, saves: full - discounted };
}
