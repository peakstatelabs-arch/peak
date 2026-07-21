import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";

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

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "MX", "GB", "IE", "FR", "ES", "SE"],
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      success_url: `${origin}/singles/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/singles?checkout=cancelled`,
      automatic_tax: { enabled: false },
    });

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
