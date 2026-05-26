// Pre-order window closes at midnight Eastern on 6/8/2026 — i.e. the moment
// Thursday 6/7 ends and Friday 6/8 (the ship date) begins. June is EDT
// (UTC-4), so midnight ET = 04:00 UTC.
const PREORDER_DEADLINE_MS = Date.UTC(2026, 5, 8, 4, 0, 0);

export function getEasternShippingState(): {
  isAfterCutoff: boolean;
  secondsRemaining: number;
} {
  const now = Date.now();
  const msRemaining = PREORDER_DEADLINE_MS - now;
  return {
    isAfterCutoff: msRemaining <= 0,
    secondsRemaining: Math.max(0, Math.floor(msRemaining / 1000)),
  };
}
