import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";
import type { BundleItem, BundleTier } from "@/app/components/productPage/BundleBuyBox";

// ── CJC-1295 + Ipamorelin (mirrors the Stripe Price + /singles catalog) ─────
export const CJC: BundleItem = {
  slug: "cjc-ipamorelin",
  priceId: SINGLES_PRICE_IDS["cjc-ipamorelin"],
  name: "CJC-1295 + Ipamorelin",
  dose: "10mg blend",
  unitPriceCents: 10500,
  image: "/cjc-ipa-product.png",
};

// Each 10mg vial lasts ~5 weeks. Same product, so the shared bulk-discount
// curve applies (2 → 10%, 3 → 15%) — see app/lib/bulkDiscount.ts.
export const CJC_TIERS: BundleTier[] = [
  {
    id: "1",
    label: "Single Vial",
    contents: "1 × 10mg vial",
    supply: "5 weeks",
    images: ["/Peak%20State%20Labs%20Vial%20Mockup.png"],
    lines: [{ item: CJC, quantity: 1 }],
    addLabel: "to Cart",
  },
  {
    id: "2",
    label: "Two Vials",
    contents: "2 × 10mg vials",
    supply: "10 weeks",
    images: ["/Peak%20State%20Labs%20Twin%20Vials.png"],
    highlight: true,
    lines: [{ item: CJC, quantity: 2 }],
    addLabel: "2 Vials",
  },
  {
    id: "3",
    label: "Full Cycle",
    contents: "3 × 10mg vials",
    supply: "15 weeks",
    images: ["/Peak%20State%20Peptide%20Vial%20Trio.png"],
    lines: [{ item: CJC, quantity: 3 }],
    addLabel: "3 Vials",
  },
];
