import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * "Today" as YYYY-MM-DD in a specific IANA timezone (e.g. the user's saved
 * `profiles.timezone`). Use this anywhere the value is shown to the user or
 * compared against a calendar date.
 *
 * `new Date().toISOString().slice(0,10)` always resolves to UTC, so for users
 * west of UTC the date rolls to "tomorrow" in the evening (e.g. a Central-time
 * user after 7 PM sees the next day). Passing the user's timezone — the same
 * value the dose-reminder cron uses — keeps "today" correct.
 *
 * When `timeZone` is omitted or empty it falls back to the runtime's local
 * zone, which in the browser is the device's zone.
 */
export function todayInZone(timeZone?: string | null): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || undefined,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Local calendar date (YYYY-MM-DD) of a Date that was built from local
 * year/month/day parts (e.g. `new Date(2026, 7, 4)`), without the UTC shift
 * that `date.toISOString().slice(0,10)` introduces.
 */
export function localDateISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function weekKey(d: Date = new Date()) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}
