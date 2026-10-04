import Stripe from "stripe";
import type { SmsOptInSource } from "@/app/lib/smsOptInCopy";

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

// Power Cut (Payment Links) and Singles (our own checkout route) live in two
// separate Stripe accounts, so each source needs its own account's key.
const STRIPE_KEY_ENV: Record<SmsOptInSource, string> = {
  powercut: "STRIPE_POWERCUT_SECRET_KEY",
  singles: "STRIPE_SECRET_KEY",
};

/**
 * Look up the buyer's contact details from a paid Stripe Checkout Session in
 * the Stripe account that owns `source`. Returns null if that account's key
 * isn't configured, the ID is bogus, or the session isn't paid.
 */
export async function fetchCheckoutContact(
  sessionId: string,
  source: SmsOptInSource,
): Promise<CheckoutContact | null> {
  const keyEnv = STRIPE_KEY_ENV[source];
  const key = process.env[keyEnv];
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  if (!key) {
    console.error(`fetchCheckoutContact: ${keyEnv} is not set`);
    return null;
  }
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
    console.error(`fetchCheckoutContact error (${source}, ${keyEnv}):`, err);
    return null;
  }
}

/** Last four digits of a phone number, for a masked "we'll text …1234" hint. */
export function phoneLast4(phone?: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}
