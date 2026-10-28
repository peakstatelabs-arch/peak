import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";
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

// Transparent-background shots for the buy box (the cart keeps the
// catalog images).
const STACK_IMAGES = [
  "/BPC%20Tb%20Product%20Image%20Transparent%202.png",
  "/kpv-product-transparent.png",
  "/GHKCU.png",
];

// A stack is one vial of each (~5 weeks). It's sold as three ordinary cart
// lines, so pricing is the normal checkout: the two-stack has 2 of a product
// and gets the automatic 10% bulk discount; a single stack can still use the
// member code at checkout.
export const RECOVERY_TIERS: BundleTier[] = [
  {
    id: "1",
    label: "One Stack",
    contents: "1 vial of each (3 vials)",
    supply: "5 weeks",
    images: STACK_IMAGES,
    lines: RECOVERY_ITEMS.map((item) => ({ item, quantity: 1 })),
    addLabel: "the Stack",
  },
  {
    id: "2",
    label: "Two Stacks",
    contents: "2 vials of each (6 vials)",
    supply: "10 weeks",
    images: STACK_IMAGES,
    highlight: true,
    lines: RECOVERY_ITEMS.map((item) => ({ item, quantity: 2 })),
    addLabel: "2 Stacks",
  },
];
