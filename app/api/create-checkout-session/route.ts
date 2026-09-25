import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";
import { bulkTierForQty, resolveCouponId } from "@/app/lib/bulkDiscount";

export const runtime = "nodejs";

const ALLOWED_PRICE_IDS = new Set<string>(Object.values(SINGLES_PRICE_IDS));

type CartItemInput = { priceId: unknown; quantity: unknown };

function siteOrigin(req: NextRequest): string {
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (envOrigin) return envOrigin;
  const forwardedHost = req.headers.get("x-forwarded-host");
  const host = forwardedHost || req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

/**
 * Resolve a configured bulk-discount identifier (e.g. "BULK15") to something
 * Stripe Checkout can apply. The value may have been created either as a
 * Coupon (whose ID is that string) or as a Promotion code (whose customer-
 * facing code is that string) — try both. Returns null if neither exists, so
 * the caller can fall back to full price instead of breaking checkout.
 */
async function resolveBulkDiscount(
  stripe: Stripe,
  id: string,
): Promise<Stripe.Checkout.SessionCreateParams.Discount | null> {
  // 1) A coupon whose ID is exactly `id`.
  try {
    const coupon = await stripe.coupons.retrieve(id);
    if (!("deleted" in coupon && coupon.deleted) && coupon.valid) {
      return { coupon: id };
    }
  } catch {
    // Not a coupon ID — try a promotion code next.
  }
  // 2) An active promotion code whose code is `id` (e.g. "BULK15").
  try {
    const promos = await stripe.promotionCodes.list({
      code: id,
      active: true,
      limit: 1,
    });
    const promo = promos.data[0];
    if (promo) return { promotion_code: promo.id };
  } catch {
    // Ignore — try coupon-by-name next.
  }
  // 3) A coupon whose *name* is `id` (Stripe auto-generates coupon IDs, so a
  //    coupon created in the dashboard as "BULK15" likely has a random ID).
  try {
    const coupons = await stripe.coupons.list({ limit: 100 });
    const match = coupons.data.find((c) => c.valid && c.name === id);
    if (match) return { coupon: match.id };
  } catch {
    // Ignore — fall through to null.
  }
  return null;
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error("STRIPE_SECRET_KEY is not set");
    return NextResponse.json(
      { error: "Checkout is not configured." },
      { status: 500 },
    );
  }

  let body: { items?: CartItemInput[] } = {};
  try {
    body = (await req.json()) as { items?: CartItemInput[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  for (const raw of rawItems) {
    const priceId = typeof raw.priceId === "string" ? raw.priceId : "";
    const quantity =
      typeof raw.quantity === "number" && Number.isFinite(raw.quantity)
        ? Math.floor(raw.quantity)
        : 0;
    if (!ALLOWED_PRICE_IDS.has(priceId)) {
      return NextResponse.json(
        { error: `Unknown product: ${priceId}` },
        { status: 400 },
      );
    }
    if (quantity < 1 || quantity > 20) {
      return NextResponse.json(
        { error: "Invalid quantity." },
        { status: 400 },
      );
    }
    lineItems.push({ price: priceId, quantity });
  }

  const stripe = new Stripe(secretKey);
  const origin = siteOrigin(req);

  // Bulk discount: driven by the HIGHEST quantity of any single product in the
  // cart (2 → 10%, 3 → 15%, 4+ → 20%). Applied server-side as a Stripe coupon
  // on the whole cart. Stripe forbids combining `discounts` with a
  // customer-entered promo code, so the promo-code box is only offered when no
  // bulk tier applies.
  const maxSameQty = lineItems.reduce(
    (m, li) => Math.max(m, li.quantity ?? 0),
    0,
  );
  const bulkTier = bulkTierForQty(maxSameQty);

  const baseParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "MX", "GB", "IE", "FR", "PT", "SE", "TT"],
    },
    phone_number_collection: { enabled: true },
    billing_address_collection: "auto",
    success_url: `${origin}/singles/thankyou?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/singles?checkout=cancelled`,
    automatic_tax: { enabled: false },
  };

  // The configured value (e.g. "BULK15") may be either a coupon ID or a
  // promotion-code name — resolve whichever actually exists in this account.
  let bulkDiscount: Stripe.Checkout.SessionCreateParams.Discount | null = null;
  if (bulkTier) {
    const id = resolveCouponId(bulkTier);
    bulkDiscount = await resolveBulkDiscount(stripe, id);
    if (!bulkDiscount) {
      console.error(
        `Bulk discount "${id}" not found as a coupon ID or an active promotion code — charging full price.`,
      );
    }
  }

  // Stripe forbids combining `discounts` with a customer-entered promo code,
  // so only offer the promo-code box when no bulk discount is applied.
  const sessionParams: Stripe.Checkout.SessionCreateParams = bulkDiscount
    ? { ...baseParams, discounts: [bulkDiscount] }
    : { ...baseParams, allow_promotion_codes: true };

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session.";
    console.error("Stripe checkout session error:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
