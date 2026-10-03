import Stripe from "stripe";

// Server-only Stripe lookup behind the post-purchase SMS support opt-in.

export type CheckoutContact = {
  sessionId: string;
  phone?: string;
  email?: string;
  name?: string;
  customerId?: string;
  paymentIntentId?: string;
  amountTotalCents?: number;
  currency?: string;
};

/**
 * Look up the buyer's contact details from a paid Stripe Checkout Session
 * (created by our own checkout route or by a Payment Link). Returns null if
 * Stripe isn't configured, the ID is bogus, or the session isn't paid.
 */
export async function fetchCheckoutContact(
  sessionId: string,
): Promise<CheckoutContact | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }
    const details = session.customer_details;
    const idOf = (v: string | { id: string } | null) =>
      typeof v === "string" ? v : v?.id ?? undefined;
    return {
      sessionId: session.id,
      phone: details?.phone ?? undefined,
      email: details?.email ?? undefined,
      name: details?.name ?? undefined,
      customerId: idOf(session.customer),
      paymentIntentId: idOf(session.payment_intent),
      amountTotalCents: session.amount_total ?? undefined,
      currency: session.currency?.toUpperCase(),
    };
  } catch (err) {
    console.error("fetchCheckoutContact error:", err);
    return null;
  }
}

/** Last four digits of a phone number, for a masked "we'll text …1234" hint. */
export function phoneLast4(phone?: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}
