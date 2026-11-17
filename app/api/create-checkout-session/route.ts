import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  RECOVERY_STACK_PRICE_IDS,
  SINGLES_PRICE_IDS,
  isStackPriceId,
} from "@/app/singles/cart/priceCatalog";
import {
  bulkTierForQty,
  maxSameProductQty,
  resolveCouponId,
} from "@/app/lib/bulkDiscount";
import {
  PREVIEW_COOKIE,
  SALE_ENDS_AT_MS,
  SALE_NAME,
  isSaleLive,
  resolveSalePhase,
  salePctForLines,
} from "@/app/lib/sale";
import { fetchCheckoutContact } from "@/app/lib/smsOptIn";

export const runtime = "nodejs";

const ALLOWED_PRICE_IDS = new Set<string>([
  ...Object.values(SINGLES_PRICE_IDS),
  ...Object.values(RECOVERY_STACK_PRICE_IDS),
]);

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

/** Stripe product ID behind a Price (needed to scope sale-cart coupons). */
async function productIdForPrice(
  stripe: Stripe,
  priceId: string,
): Promise<{ productId: string; currency: string }> {
  const price = await stripe.prices.retrieve(priceId);
  const productId =
    typeof price.product === "string" ? price.product : price.product.id;
  return { productId, currency: price.currency };
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

  let body: { items?: CartItemInput[]; powerCutSessionId?: unknown } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const cartLines: { priceId: string; quantity: number }[] = [];
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
    cartLines.push({ priceId, quantity });
  }

  const stripe = new Stripe(secretKey);
  const origin = siteOrigin(req);
  const nowMs = Date.now();
  const phase = resolveSalePhase(
    nowMs,
    req.cookies.get(PREVIEW_COOKIE)?.value,
    process.env.SALE_PREVIEW_SECRET,
  );
  const saleLive = isSaleLive(phase);

  // POWER CUT™ add-ons: the buyer's paid POWER CUT checkout (on the Power Cut
  // Stripe account) unlocks the top sale tier for the add-on vials.
  let powerCutAddon = false;
  let prefillEmail: string | undefined;
  const pcSession =
    typeof body.powerCutSessionId === "string" ? body.powerCutSessionId : "";
  if (saleLive && pcSession) {
    const contact = await fetchCheckoutContact(pcSession, "powercut");
    if (contact) {
      powerCutAddon = true;
      prefillEmail = contact.email;
    }
  }

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
    ...(prefillEmail ? { customer_email: prefillEmail } : {}),
  };

  let sessionParams: Stripe.Checkout.SessionCreateParams;
  const hasStacks = cartLines.some((l) => isStackPriceId(l.priceId));
  const discountable = cartLines.filter((l) => !isStackPriceId(l.priceId));

  if (saleLive) {
    // BLACK FRIDAY / CYBER MONDAY. Decided here, on the server clock, from the
    // quantities in the request (the client only displays it): the vial
    // ladder as a one-off coupon. Fixed-price stacks stay outside it. The
    // session can't be paid after the sale (Stripe needs >= 30 min, max 24h).
    const pct = salePctForLines(discountable, powerCutAddon);
    const expiresAt = Math.max(
      Math.floor(nowMs / 1000) + 31 * 60,
      Math.min(Math.floor(SALE_ENDS_AT_MS / 1000), Math.floor(nowMs / 1000) + 24 * 3600),
    );
    sessionParams = { ...baseParams, expires_at: expiresAt };
    if (pct > 0) {
      try {
        const appliesTo = hasStacks
          ? {
              applies_to: {
                products: (
                  await Promise.all(
                    discountable.map((l) => productIdForPrice(stripe, l.priceId)),
                  )
                ).map((p) => p.productId),
              },
            }
          : {};
        const coupon = await stripe.coupons.create({
          percent_off: pct,
          duration: "once",
          name: `${SALE_NAME[phase]} sale (${pct}% off)`,
          max_redemptions: 1,
          redeem_by: expiresAt,
          ...appliesTo,
        });
        sessionParams.discounts = [{ coupon: coupon.id }];
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to apply the sale discount.";
        console.error("Sale coupon error:", err);
        return NextResponse.json({ error: message }, { status: 502 });
      }
    } else if (!hasStacks) {
      sessionParams.allow_promotion_codes = true;
    }
  } else if (hasStacks) {
    // STACK CART. A FULL REPAIR stack is sold at its fixed stack price: no
    // customer promo codes, and the bulk tier comes from the other vials
    // only, as a one-off coupon scoped to those products.
    sessionParams = { ...baseParams };
    const tier = bulkTierForQty(maxSameProductQty(discountable));
    if (tier && discountable.length > 0) {
      try {
        const products = await Promise.all(
          discountable.map((l) => productIdForPrice(stripe, l.priceId)),
        );
        const coupon = await stripe.coupons.create({
          percent_off: tier.pct,
          duration: "once",
          name: `Bulk discount (${tier.pct}% off)`,
          applies_to: { products: products.map((p) => p.productId) },
          max_redemptions: 1,
          redeem_by: Math.floor(nowMs / 1000) + 24 * 3600,
        });
        sessionParams.discounts = [{ coupon: coupon.id }];
      } catch (err) {
        console.error(
          "Could not create scoped bulk coupon for stack cart — charging full price for the other vials.",
          err,
        );
      }
    }
  } else {
    // Bulk discount: driven by the HIGHEST quantity of any single product in
    // the cart (2 → 10%, 3 → 15%, 4+ → 20%). Applied server-side as a Stripe
    // coupon on the whole cart. Stripe forbids combining `discounts` with a
    // customer-entered promo code, so the promo-code box is only offered when
    // no bulk tier applies.
    const bulkTier = bulkTierForQty(maxSameProductQty(cartLines));
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
    sessionParams = bulkDiscount
      ? { ...baseParams, discounts: [bulkDiscount] }
      : { ...baseParams, allow_promotion_codes: true };
  }

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
