// Product slug -> Stripe Price ID. Shared by the client cart and the
// /api/create-checkout-session endpoint (which uses this to allowlist
// incoming price IDs so the API can never be tricked into charging a
// price the site doesn't sell).
export const SINGLES_PRICE_IDS = {
  retatrutide: "price_1TqxLnB7ajQM0hh3XqyHZLnp",
  "cjc-ipamorelin": "price_1TqxN4B7ajQM0hh3R0yH8HNS",
  "bpc-tb500": "price_1TqxNdB7ajQM0hh3FGfwjVGg",
  "ghk-cu": "price_1TqxO7B7ajQM0hh3MWREyOZV",
} as const;

export type SinglesProductSlug = keyof typeof SINGLES_PRICE_IDS;
