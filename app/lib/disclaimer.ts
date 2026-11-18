// The site-wide "Research Use Notice" popup (DisclaimerModal) stays hidden
// while this cookie is set.
export const DISCLAIMER_COOKIE = "disclaimer_ack";
// Acknowledge once: remembered for a year (and in localStorage as a backup).
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
export const DISCLAIMER_STORAGE_KEY = "psl.disclaimer_ack";

/**
 * Record that the visitor acknowledged research-use-only terms — by tapping
 * "I Understand", or by ticking the research-only checkbox when creating an
 * account or signing in — so the notice never pops up again for this visitor.
 */
export function acknowledgeDisclaimer(): void {
  if (typeof document === "undefined") return;
  // The site is reachable at both peakstate.shop and www.peakstate.shop, and
  // a plain cookie only applies to the one address it was set on. Scope it to
  // the whole domain there so acknowledging once covers both.
  const domain = /(^|\.)peakstate\.shop$/.test(window.location.hostname)
    ? ";domain=.peakstate.shop"
    : "";
  document.cookie = `${DISCLAIMER_COOKIE}=1;path=/;max-age=${ONE_YEAR_SECONDS};SameSite=Lax${domain}`;
  try {
    window.localStorage.setItem(DISCLAIMER_STORAGE_KEY, "1");
  } catch {
    // Storage blocked — the cookie still covers it.
  }
}
