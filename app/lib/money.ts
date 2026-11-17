/** "$1,019" / "$172.50" — safe to call from server and client components. */
export function formatUsd(cents: number): string {
  const whole = Math.round(cents) % 100 === 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100);
}
