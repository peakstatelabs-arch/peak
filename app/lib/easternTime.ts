const EASTERN_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

// Pre-order window closes at midnight Eastern on 7/7/2026 — i.e. the moment
// Monday 7/6 ends and Tuesday 7/7 (the ship date) begins. July is EDT
// (UTC-4), so midnight ET = 04:00 UTC.
const PREORDER_DEADLINE_MS = Date.UTC(2026, 6, 7, 4, 0, 0);

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

/**
 * Computes how many stacks are still on offer, given an anchor calendar date
 * (Eastern time) on which the count equals `initial` from midnight through
 * 7:59 PM ET. The count decrements by 1 at every subsequent 8 PM ET boundary,
 * walks down to `minimum`, and then cycles back to `initial` on the next
 * decrement. The cycle length is therefore `initial - minimum + 1` days.
 *
 * Example with initial=4, minimum=1:
 *   anchor day  : 4   anchor +4 : 4   (cycles back up)
 *   anchor +1   : 3   anchor +5 : 3
 *   anchor +2   : 2   anchor +6 : 2
 *   anchor +3   : 1   anchor +7 : 1
 */
export function getStacksLeft(opts: {
  initial: number;
  minimum: number;
  /** Eastern calendar date (YYYY-MM-DD) when stacks = initial through 7:59 PM ET. */
  anchorEasternDate: string;
  /** Hour-of-day in Eastern time when the count decrements. Defaults to 20 (8 PM). */
  decrementHour?: number;
}): number {
  const decrementHour = opts.decrementHour ?? 20;

  const parts = EASTERN_DATE_FORMATTER.formatToParts(new Date());
  const read = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const currentEasternDate = `${read("year")}-${read("month")}-${read("day")}`;
  const currentEasternHour = Number(read("hour"));

  const anchorMs = Date.parse(`${opts.anchorEasternDate}T00:00:00Z`);
  const currentMs = Date.parse(`${currentEasternDate}T00:00:00Z`);
  const daysSinceAnchor = Math.floor(
    (currentMs - anchorMs) / 86_400_000,
  );

  let decrements = Math.max(0, daysSinceAnchor);
  if (daysSinceAnchor >= 0 && currentEasternHour >= decrementHour) {
    decrements += 1;
  }

  const cycleLength = opts.initial - opts.minimum + 1;
  if (cycleLength <= 0) return opts.initial;

  const positionInCycle = decrements % cycleLength;
  return opts.initial - positionInCycle;
}
