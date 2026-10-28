export type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  priceId: string;
  /** Groups variant products (e.g. different stack sizes) under one featured card. */
  bundleId?: string;
  /** Shown as the option label when part of a bundle, e.g. "One Stack". */
  variantLabel?: string;
};

export const products: Product[] = [
  {
    id: "engine",
    name: "The Engine",
    tag: "Rapid Renewal",
    description:
      "A fast-acting rejuvenation serum that accelerates cellular turnover, visibly smoothing texture and restoring radiance in record time.",
    price: 21500,
    priceId: "price_1TqxLnB7ajQM0hh3XqyHZLnp",
  },
  {
    id: "architect",
    name: "The Architect",
    tag: "Scar Repair",
    description:
      "Formulated to support the skin's natural repair process, helping soften the look of scars and rebuild smoother, more even texture.",
    price: 10500,
    priceId: "price_1TqxN4B7ajQM0hh3R0yH8HNS",
  },
  {
    id: "shield",
    name: "The Shield",
    tag: "Blemish Defense",
    description:
      "A protective daily formula that helps guard against breakouts, congestion, and everyday environmental stress.",
    price: 14500,
    priceId: "price_1TqxNdB7ajQM0hh3FGfwjVGg",
  },
  {
    id: "restorer",
    name: "The Restorer",
    tag: "Collagen + Strength",
    description:
      "Supports collagen production to help strengthen nails, revitalize hair, and firm the look of skin over time.",
    price: 8500,
    priceId: "price_1TqxO7B7ajQM0hh3MWREyOZV",
  },
  {
    id: "catalyst",
    name: "The Catalyst",
    tag: "Cellular Glow",
    description:
      "Works at the cellular level to activate skin's natural renewal process, helping spark a healthy, lasting glow from within.",
    price: 13500,
    priceId: "price_1U6dtWB7ajQM0hh3LZxQAAeh",
  },
  {
    id: "regulator",
    name: "The Regulator",
    tag: "Tone Balance",
    description:
      "Helps regulate and even out skin tone, calming discoloration to support a more balanced, radiant complexion over time.",
    price: 6500,
    priceId: "price_1U6ds5B7ajQM0hh3C6JAi8AC",
  },
  {
    id: "full-repair-one",
    name: "The Full Repair",
    tag: "Full Recovery",
    description:
      "A full recovery stack for optimizing skin health and slowing the visible signs of aging.",
    price: 24900,
    priceId: "price_1UVfyBB7ajQM0hh3Eve4rmff",
    bundleId: "full-repair",
    variantLabel: "One Stack",
  },
  {
    id: "full-repair-two",
    name: "The Full Repair",
    tag: "Full Recovery",
    description:
      "A full recovery stack for optimizing skin health and slowing the visible signs of aging.",
    price: 44900,
    priceId: "price_1UVfymB7ajQM0hh3mkOxGK4f",
    bundleId: "full-repair",
    variantLabel: "Two Stacks",
  },
];

export const standaloneProducts: Product[] = products.filter(
  (product) => !product.bundleId,
);

export type Bundle = {
  bundleId: string;
  name: string;
  tag: string;
  description: string;
  variants: Product[];
};

export const bundles: Bundle[] = (() => {
  const grouped = new Map<string, Product[]>();
  for (const product of products) {
    if (!product.bundleId) continue;
    const variants = grouped.get(product.bundleId) ?? [];
    variants.push(product);
    grouped.set(product.bundleId, variants);
  }
  return Array.from(grouped.entries()).map(([bundleId, variants]) => ({
    bundleId,
    name: variants[0].name,
    tag: variants[0].tag,
    description: variants[0].description,
    variants,
  }));
})();

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function formatPrice(cents: number): string {
  return (cents % 100 === 0)
    ? `$${cents / 100}`
    : `$${(cents / 100).toFixed(2)}`;
}
