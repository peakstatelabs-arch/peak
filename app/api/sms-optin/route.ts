import { NextRequest, NextResponse } from "next/server";
import {
  SMS_CHECKBOX_TEXT,
  SMS_CONSENT_TEXT,
  SMS_MIN_AGE,
  SMS_OPT_IN_SOURCES,
  SMS_UNDERAGE_TEXT,
  ageFromDob,
  type SmsOptInSource,
} from "@/app/lib/smsOptInCopy";
import {
  fetchCheckoutContact,
  firstNameOf,
  isCompleteContact,
} from "@/app/lib/smsOptIn";

export const runtime = "nodejs";

// Zapier Catch Hook that receives each post-purchase SMS support opt-in (route
// it to a Google Sheet, ClickFunnels, or your SMS tool from inside Zapier).
// Catch-hook URLs are write-only, so the value is safe to keep here as a
// fallback, but it can be overridden via the ZAPIER_SMS_OPTIN_WEBHOOK_URL env
// var without a redeploy.
const ZAPIER_SMS_OPTIN_WEBHOOK_URL =
  process.env.ZAPIER_SMS_OPTIN_WEBHOOK_URL ||
  "https://hooks.zapier.com/hooks/catch/27218922/4mwk1ga/";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Normalize a phone to E.164 (e.g. "(515) 802-4949" -> "+15158024949").
// Bare 10-digit numbers are treated as US. Stripe Payment Links can return the
// checkout phone formatted.
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const source = str(body.source) as SmsOptInSource;
  if (!Object.hasOwn(SMS_OPT_IN_SOURCES, source)) {
    return NextResponse.json({ error: "Unknown source." }, { status: 400 });
  }

  // Age gate: re-check the date of birth server-side so the 18+ requirement
  // can't be bypassed. "Today" is taken in UTC+14 (the earliest timezone) so a
  // customer who has just turned 18 in their own timezone is never rejected.
  const dateOfBirth = str(body.dateOfBirth);
  const today = new Date(Date.now() + 14 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const age = ageFromDob(dateOfBirth, today);
  if (age === null) {
    return NextResponse.json(
      { error: "Please enter a valid date of birth." },
      { status: 400 },
    );
  }
  if (age < SMS_MIN_AGE) {
    return NextResponse.json({ error: SMS_UNDERAGE_TEXT }, { status: 403 });
  }

  // The consent checkbox must be ticked before an opt-in is recorded.
  if (body.consentChecked !== true) {
    return NextResponse.json(
      { error: "Please check the box to agree to receive texts." },
      { status: 400 },
    );
  }

  // Name, email and phone always come from the customer's Stripe checkout —
  // never from the browser — and TextMagic only gets complete contacts.
  const sessionId = str(body.sessionId);
  if (!sessionId) {
    return NextResponse.json(
      { error: "We couldn't find your order. Please contact support." },
      { status: 400 },
    );
  }
  const contact = await fetchCheckoutContact(sessionId, source);
  if (!isCompleteContact(contact)) {
    console.error(
      "SMS opt-in blocked: incomplete Stripe contact",
      JSON.stringify({
        source,
        session_id: sessionId,
        found: Boolean(contact),
        has_name: Boolean(firstNameOf(contact?.name)),
        has_email: Boolean(contact?.email),
        has_phone: Boolean(contact?.phone),
      }),
    );
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  // If a Stripe phone can't be normalized, keep it as-is rather than lose the
  // opt-in.
  const phone = normalizePhone(contact.phone) ?? contact.phone.trim();
  const phoneSource = "stripe_checkout";

  const record = {
    event: "sms_support_opt_in",
    opted_in_at: new Date().toISOString(),
    source,
    source_page: SMS_OPT_IN_SOURCES[source],
    phone,
    phone_source: phoneSource,
    email: contact.email.trim(),
    name: contact.name.trim(),
    stripe_checkout_session_id: contact.sessionId,
    stripe_customer_id: contact.customerId ?? "",
    stripe_payment_intent_id: contact.paymentIntentId ?? "",
    order_total: contact.amountTotalCents != null
      ? (contact.amountTotalCents / 100).toFixed(2)
      : "",
    currency: contact.currency ?? "",
    consent_text: SMS_CONSENT_TEXT,
    consent_checkbox_checked: true,
    consent_checkbox_text: SMS_CHECKBOX_TEXT,
    date_of_birth: dateOfBirth,
    age_verified: true,
    age_at_opt_in: age,
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "",
    user_agent: req.headers.get("user-agent") || "",
  };

  // Always log the full record (including consent proof) so an opt-in is
  // recoverable from the Vercel logs even if Zapier is down.
  console.log("SMS opt-in:", JSON.stringify(record));

  // Zapier only gets the fields it needs to text the customer.
  const zapierPayload = {
    first_name: firstNameOf(contact.name),
    email: record.email,
    phone: record.phone,
    source: record.source,
    opted_in_at: record.opted_in_at,
    age_verified: record.age_verified,
  };

  if (!ZAPIER_SMS_OPTIN_WEBHOOK_URL) {
    console.error("ZAPIER_SMS_OPTIN_WEBHOOK_URL is not set");
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(ZAPIER_SMS_OPTIN_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zapierPayload),
    });
    if (!res.ok) {
      console.error("Zapier SMS opt-in webhook non-OK:", res.status, await res.text());
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error("Zapier SMS opt-in webhook failed:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
