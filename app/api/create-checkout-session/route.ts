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
      allowed_countries: ["US", "CA", "MX", "GB", "IE", "FR", "ES", "SE", "TT"],
    },
    phone_number_collection: { enabled: true },
    billing_address_collection: "auto",
    success_url: `${origin}/singles/thankyou?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/singles?checkout=cancelled`,
    automatic_tax: { enabled: false },
  };

  const bulkParams: Stripe.Checkout.SessionCreateParams = bulkTier
    ? { ...baseParams, discounts: [{ coupon: resolveCouponId(bulkTier) }] }
    : { ...baseParams, allow_promotion_codes: true };

  try {
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(bulkParams);
    } catch (bulkErr) {
      // If the bulk coupon isn't set up in Stripe yet, never break checkout —
      // fall back to a normal session with the promo-code box enabled.
      const msg = bulkErr instanceof Error ? bulkErr.message : "";
      if (bulkTier && /no such coupon|resource_missing/i.test(msg)) {
        console.error("Bulk coupon missing — falling back without discount:", msg);
        session = await stripe.checkout.sessions.create({
          ...baseParams,
          allow_promotion_codes: true,
        });
      } else {
        throw bulkErr;
      }
    }

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
