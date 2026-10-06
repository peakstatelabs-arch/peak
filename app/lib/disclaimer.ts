// The site-wide "Research Use Notice" popup (DisclaimerModal) stays hidden
// while this cookie is set.
export const DISCLAIMER_COOKIE = "disclaimer_ack";
const ONE_DAY_SECONDS = 60 * 60 * 24;

/**
 * Record that the visitor acknowledged research-use-only terms — by tapping
 * "I Understand", or by ticking the research-only checkbox when creating an
 * account or signing in — so the notice doesn't pop up for the next 24 hours.
 */
export function acknowledgeDisclaimer(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${DISCLAIMER_COOKIE}=1;path=/;max-age=${ONE_DAY_SECONDS};SameSite=Lax`;
}
