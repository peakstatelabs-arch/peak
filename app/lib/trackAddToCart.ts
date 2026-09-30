import posthog from "posthog-js";

/**
 * Report a cart add to PostHog as `add_to_cart_click` — the same event name
 * the POWER CUT stack buy buttons already send — so PostHog funnels see
 * singles, /getreta, and cross-sell adds too.
 *
 * This is in addition to (not instead of) the Zapier ping each button sends
 * via /api/cart-event, which stays unchanged. Never throws.
 *
 * Sent instantly (not batched): shoppers often add to cart and head straight
 * to checkout, and a batched event can be lost when the page changes.
 */
export function trackAddToCartInPostHog(props: {
  /** Where the add happened: "singles", "getreta", "cross_sell_…". */
  funnel: string;
  product_slug: string;
  product_name: string;
  price_id: string;
  dose: string;
  unit_price_cents: number;
  quantity: number;
}): void {
  try {
    posthog.capture("add_to_cart_click", props, { send_instantly: true });
  } catch (err) {
    console.error("PostHog add_to_cart_click failed:", err);
  }
}
