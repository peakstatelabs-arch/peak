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
 * isn't configured, the ID is bogus, the session isn't paid, or Stripe can't
 * be reached (after one retry).
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
  const stripe = new Stripe(key);
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["collected_information"],
      });
      if (session.payment_status !== "paid" && session.status !== "complete") {
        return null;
      }
      const details = session.customer_details;
      const idOf = (v: string | { id: string } | null) =>
        typeof v === "string" ? v : v?.id ?? undefined;
      // Wallet payments (Apple Pay, Link) can leave the billing name blank;
      // checkout always collects a shipping name, so fall back to it.
      const name =
        details?.name?.trim() ||
        session.collected_information?.shipping_details?.name?.trim() ||
        undefined;
      return {
        sessionId: session.id,
        phone: details?.phone ?? undefined,
        email: details?.email ?? undefined,
        name,
        customerId: idOf(session.customer),
        paymentIntentId: idOf(session.payment_intent),
        amountTotalCents: session.amount_total ?? undefined,
        currency: session.currency?.toUpperCase(),
      };
    } catch (err) {
      console.error(
        `fetchCheckoutContact error (${source}, ${keyEnv}, attempt ${attempt}):`,
        err,
      );
      // A bad/unknown session ID won't succeed on retry; anything else
      // (network blip, timeout, rate limit) gets one more try.
      if (err instanceof Stripe.errors.StripeInvalidRequestError) return null;
      if (attempt === 1) await new Promise((r) => setTimeout(r, 400));
    }
  }
  return null;
}

/** First word of a full name ("Jane Q. Doe" -> "Jane"). */
export function firstNameOf(name?: string): string {
  return name?.trim().split(/\s+/)[0] ?? "";
}

/** True when the contact has everything TextMagic needs. */
export function isCompleteContact(
  contact: CheckoutContact | null,
): contact is CheckoutContact & { phone: string; email: string; name: string } {
  return Boolean(
    contact?.phone?.trim() && contact.email?.trim() && firstNameOf(contact.name),
  );
}

/** Last four digits of a phone number, for a masked "we'll text …1234" hint. */
export function phoneLast4(phone?: string): string | null {
  const digits = (phone ?? "").replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : null;
}
