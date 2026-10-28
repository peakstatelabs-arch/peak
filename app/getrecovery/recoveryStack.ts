import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";
import {
  RECOVERY_STACK_NAME,
  STACK_ONE,
  STACK_TWO,
} from "@/app/singles/cart/stackItems";
import type { BundleItem, BundleTier } from "@/app/components/productPage/BundleBuyBox";

export { RECOVERY_STACK_NAME };

// The three vials in the stack (mirror the Stripe Prices + /singles catalog).
export const RECOVERY_ITEMS: BundleItem[] = [
  {
    slug: "bpc-tb500",
    priceId: SINGLES_PRICE_IDS["bpc-tb500"],
    name: "BPC-157 + TB-500",
    dose: "20mg blend",
    unitPriceCents: 14500,
    image: "/bpc-tb-product.png",
  },
  {
    slug: "kpv",
    priceId: SINGLES_PRICE_IDS.kpv,
    name: "KPV",
    dose: "10mg",
    unitPriceCents: 6500,
    image: "/kpv-product.png",
  },
  {
    slug: "ghk-cu",
    priceId: SINGLES_PRICE_IDS["ghk-cu"],
    name: "GHK-Cu",
    dose: "50mg",
    unitPriceCents: 8500,
    image: "/GHKCU.png",
  },
];

/** What one stack (1 vial of each) costs bought as singles. */
const SINGLES_CENTS_PER_STACK = RECOVERY_ITEMS.reduce(
  (sum, i) => sum + i.unitPriceCents,
  0,
);

// Each stack size is its own Stripe product at a fixed price (one cart line),
// so it stays outside the bulk discount and member codes. One stack is 1 vial
// of each (~5 weeks); two stacks are 2 of each (~10 weeks). The cart turns
// two One Stacks into a Two Stacks (see app/singles/cart/stackItems.ts).

export const RECOVERY_TIERS: BundleTier[] = [
  {
    id: "1",
    label: "One Stack",
    contents: "1 vial of each (3 vials)",
    supply: "5 weeks",
    images: ["/Recovery%20Stack%201.png"],
    lines: [{ item: STACK_ONE, quantity: 1 }],
    compareAtCents: SINGLES_CENTS_PER_STACK,
    addLabel: "the Stack",
  },
  {
    id: "2",
    label: "Two Stacks",
    contents: "2 vials of each (6 vials)",
    supply: "10 weeks",
    images: ["/Recovery%20Stack%202%20.png"],
    highlight: true,
    lines: [{ item: STACK_TWO, quantity: 1 }],
    compareAtCents: SINGLES_CENTS_PER_STACK * 2,
    addLabel: "2 Stacks",
  },
];
