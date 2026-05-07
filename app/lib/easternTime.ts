const EASTERN_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const EASTERN_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/New_York",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

const CUTOFF_SECONDS = 15 * 3600; // 3:00 PM Eastern

export function getEasternShippingState(): {
  isAfterCutoff: boolean;
  secondsRemaining: number;
} {
  const parts = EASTERN_TIME_FORMATTER.formatToParts(new Date());
  const read = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const currentSecondOfDay =
    read("hour") * 3600 + read("minute") * 60 + read("second");

  const isAfterCutoff = currentSecondOfDay >= CUTOFF_SECONDS;
  // Before 3 PM ET: count down to today's 3 PM cutoff.
  // After 3 PM ET: count down to midnight ET (when the next-day window resets).
  const target = isAfterCutoff ? 86400 : CUTOFF_SECONDS;

  return {
    isAfterCutoff,
    secondsRemaining: target - currentSecondOfDay,
  };
}

/**
 * Computes how many stacks are still on offer, given an anchor calendar date
 * (Eastern time) on which the count equals `initial` from midnight through
 * 7:59 PM ET. The count decrements by 1 at every subsequent 8 PM ET boundary
 * and never drops below `minimum`.
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

  return Math.max(opts.minimum, opts.initial - decrements);
}
