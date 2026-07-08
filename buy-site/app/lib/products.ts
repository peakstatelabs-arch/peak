export type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;
  priceId: string;
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
];

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function formatPrice(cents: number): string {
  return (cents % 100 === 0)
    ? `$${cents / 100}`
    : `$${(cents / 100).toFixed(2)}`;
}
