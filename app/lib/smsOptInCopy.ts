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
