import { SINGLES_PRICE_IDS } from "./priceCatalog";

// Curated add-ons for the cross-sell strips (cart drawer + reta buy box).
// Mirrors the /singles catalog data so a "+ Add" drops a real cart line.
export type CrossSellItem = {
  slug: string;
  priceId: string;
  name: string;
  dose: string;
  unitPriceCents: number;
  priceLabel: string;
  image: string;
  blurb: string;
};

export const CROSS_SELL: Record<string, CrossSellItem> = {
  "ghk-cu": {
    slug: "ghk-cu",
    priceId: SINGLES_PRICE_IDS["ghk-cu"],
    name: "GHK-Cu",
    dose: "50mg",
    unitPriceCents: 8500,
    priceLabel: "$85",
    image: "/GHKCU.png",
    blurb: "Skin, hair & tissue renewal",
  },
  "cjc-ipamorelin": {
    slug: "cjc-ipamorelin",
    priceId: SINGLES_PRICE_IDS["cjc-ipamorelin"],
    name: "CJC-1295 + Ipamorelin",
    dose: "10mg blend",
    unitPriceCents: 10500,
    priceLabel: "$105",
    image: "/cjc-ipa-product.png",
    blurb: "Build lean muscle, sleep & recovery",
  },
  "bpc-tb500": {
    slug: "bpc-tb500",
    priceId: SINGLES_PRICE_IDS["bpc-tb500"],
    name: "BPC-157 + TB-500",
    dose: "20mg blend",
    unitPriceCents: 14500,
    priceLabel: "$145",
    image: "/bpc-tb-product.png",
    blurb: "Joint, tendon & tissue repair",
  },
};

// Cart drawer shows all three; the reta buy box shows the first two.
export const CART_CROSSSELL_SLUGS = ["ghk-cu", "cjc-ipamorelin", "bpc-tb500"];
export const BUYBOX_CROSSSELL_SLUGS = ["cjc-ipamorelin", "bpc-tb500"];
