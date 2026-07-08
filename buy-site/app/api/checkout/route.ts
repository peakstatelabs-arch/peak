import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProduct } from "@/app/lib/products";

// A broad but not fully exhaustive list of Stripe-supported shipping
// destinations. Intentionally omits comprehensively sanctioned countries
// (Cuba, Iran, North Korea, Syria) and a handful of others we couldn't
// verify against Stripe's current canonical list. Add more on request.
const ALLOWED_SHIPPING_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
  [
    "US", "CA", "MX",
    "GB", "IE",
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI",
    "ES", "SE",
    "CH", "NO", "IS", "LI",
    "AU", "NZ",
    "JP", "KR", "SG", "HK", "TW", "MY", "TH", "PH", "ID", "VN", "IN",
    "AE", "SA", "IL", "JO", "KW", "QA", "BH", "OM",
    "ZA", "NG", "KE", "GH", "EG", "MA",
    "BR", "AR", "CL", "CO", "PE", "UY", "CR", "PA",
    "AL", "AD", "BA", "MC", "ME", "MK", "RS", "SM", "VA", "GI", "MD", "UA",
    "BD", "LK", "NP", "PK",
    "FJ",
    "DO", "JM", "TT", "BS", "BB",
  ];

type CheckoutItem = { productId?: string; quantity?: number };

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Checkout is not configured yet." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => null);
  const requestedItems: CheckoutItem[] = Array.isArray(body?.items)
    ? body.items
    : [];

  const lineItems = requestedItems
    .map((item) => {
      if (!item.productId) return null;
      const product = getProduct(item.productId);
      if (!product) return null;
      const quantity = Math.min(
        Math.max(Math.trunc(item.quantity ?? 1), 1),
        20,
      );
      return { price: product.priceId, quantity };
    })
    .filter((item): item is { price: string; quantity: number } => item !== null);

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const origin = request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      shipping_address_collection: {
        allowed_countries: ALLOWED_SHIPPING_COUNTRIES,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong starting checkout. Please try again." },
      { status: 502 },
    );
  }
}
