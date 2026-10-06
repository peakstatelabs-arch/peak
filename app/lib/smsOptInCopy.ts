// Client-safe constants for the post-purchase SMS support opt-in. Kept apart
// from smsOptIn.ts so the browser bundle never pulls in the Stripe SDK.

export type SmsOptInSource = "powercut" | "singles";

export const SMS_OPT_IN_SOURCES: Record<SmsOptInSource, string> = {
  powercut: "/thankyou",
  singles: "/singles/thankyou",
};

// Stored with every opt-in so we can prove exactly what the customer agreed to.
export const SMS_CONSENT_TEXT =
  "By signing up, you agree to receive support and order-related text messages from Peak State Labs. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out.";

// Label of the unchecked consent checkbox above the opt-in button. Also stored
// with every opt-in alongside SMS_CONSENT_TEXT.
export const SMS_CHECKBOX_TEXT =
  "I agree to receive product instructions, order-related check-ins, and customer support texts from Peak State Labs.";

// Age gate for the SMS program: customers confirm their date of birth before
// the consent checkbox unlocks, and the server re-checks it.
export const SMS_MIN_AGE = 18;
export const SMS_UNDERAGE_TEXT =
  "SMS support is only available to customers age 18 or older.";

/**
 * Whole years between a YYYY-MM-DD date of birth and `today` (YYYY-MM-DD).
 * Returns null if the DOB isn't a real calendar date, is in the future, or is
 * before 1900.
 */
export function ageFromDob(dob: string, today: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(today);
  if (!m || !t) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== mo - 1 ||
    check.getUTCDate() !== d ||
    y < 1900 ||
    dob > today
  ) {
    return null;
  }
  const [ty, tmo, td] = [Number(t[1]), Number(t[2]), Number(t[3])];
  let age = ty - y;
  if (tmo < mo || (tmo === mo && td < d)) age -= 1;
  return age;
}
