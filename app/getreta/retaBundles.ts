import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";
import { BULK_DISCOUNTS_LIVE, bulkPctForQty } from "@/app/lib/bulkDiscount";

// ── Reta product (mirrors the Stripe Price + /singles catalog) ──────────────
export const RETA = {
  slug: "retatrutide" as const,
  priceId: SINGLES_PRICE_IDS.retatrutide,
  name: "Retatrutide",
  dose: "20mg",
  unitPriceCents: 21500,
};

// The reta vial tiers add N of the SAME product, so their discount is just the
// shared bulk-discount curve (2 → 10%, 3 → 15%). No per-tier codes — the
// checkout route auto-applies the coupon. See app/lib/bulkDiscount.ts.

export type Tier = {
  vials: number;
  label: string;
  blurb: string;
  /** Product mockup shown when this tier is selected (filenames have spaces). */
  image: string;
  /** Approx. how long this many vials lasts at a standard titration schedule. */
  supply: string;
  highlight?: boolean;
};

export const TIERS: Tier[] = [
  {
    vials: 1,
    label: "Single Vial",
    blurb: "One 20mg vial — try it or top up a run in progress.",
    image: "/reta%20mockup%201.png",
    supply: "6–8 weeks",
  },
  {
    vials: 2,
    label: "Two-Vial",
    blurb: "Covers titration into your maintenance dose without a reorder.",
    image: "/reta%20mockup%202.png",
    supply: "12–16 weeks",
    highlight: true,
  },
  {
    vials: 3,
    label: "Full Cycle",
    blurb: "A complete research cycle, stocked start to finish.",
    image: "/reta%20mockup%203.png",
    supply: "18–24 weeks",
  },
];

export function tierPricing(tier: Tier) {
  const full = tier.vials * RETA.unitPriceCents;
  const pct = bulkPctForQty(tier.vials);
  const live = BULK_DISCOUNTS_LIVE && pct > 0;
  const discounted = live ? Math.round(full * (1 - pct / 100)) : full;
  return { full, discounted, live, saves: full - discounted, pct };
}
