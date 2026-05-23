const EASTERN_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
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
