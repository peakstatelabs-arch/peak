import {
  RECOVERY_STACK_PRICE_IDS,
  SINGLES_PRICE_IDS,
} from "@/app/singles/cart/priceCatalog";
import type { BundleItem, BundleTier } from "@/app/components/productPage/BundleBuyBox";

/** Stack name, used in page copy. Change it here. */
export const RECOVERY_STACK_NAME = "FULL REPAIR";

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
// of each (~5 weeks); two stacks are 2 of each (~10 weeks).
const STACK_ONE: BundleItem = {
  slug: "full-repair-one",
  priceId: RECOVERY_STACK_PRICE_IDS.one,
  name: `${RECOVERY_STACK_NAME} Stack — One Stack`,
  dose: "1 vial each: BPC-157 + TB-500, KPV, GHK-Cu",
  unitPriceCents: 24900,
  image: "/Recovery%20Stack%201.png",
};

const STACK_TWO: BundleItem = {
  slug: "full-repair-two",
  priceId: RECOVERY_STACK_PRICE_IDS.two,
  name: `${RECOVERY_STACK_NAME} Stack — Two Stacks`,
  dose: "2 vials each: BPC-157 + TB-500, KPV, GHK-Cu",
  unitPriceCents: 44900,
  image: "/Recovery%20Stack%202%20.png",
};

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
