import { type Program } from "./programs";

const DAY = 86400000;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export type ScheduledSession = {
  program_slug: string;
  day_label: string;
  focus: string;
  scheduled_for: string;
};

/** Roll a date forward to the next given weekday (1=Mon … 7=Sun), inclusive. */
function rollTo(d: Date, weekday: number): Date {
  const out = new Date(d);
  const cur = out.getDay() === 0 ? 7 : out.getDay();
  out.setDate(out.getDate() + ((weekday - cur + 7) % 7));
  return out;
}

/**
 * Lay a program's training days onto the calendar for `weeks`, anchored on the
 * Monday of the start week. Each program day has a fixed weekday.
 */
export function generateProgramSchedule(opts: {
  program: Program;
  startDate: Date;
  weeks: number;
}): ScheduledSession[] {
  const { program, startDate, weeks } = opts;
  const week1Monday = rollTo(startDate, 1);
  const out: ScheduledSession[] = [];
  for (let w = 0; w < weeks; w++) {
    const monday = new Date(week1Monday.getTime() + w * 7 * DAY);
    for (const day of program.days) {
      const date = new Date(monday.getTime() + (day.weekday - 1) * DAY);
      out.push({
        program_slug: program.slug,
        day_label: day.label,
        focus: day.focus,
        scheduled_for: isoDate(date),
      });
    }
  }
  return out;
}

/** Estimated 1RM via Epley formula. */
export function estimate1RM(weight: number, reps: number): number {
  if (!weight || !reps) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

export type LoggedSet = {
  exercise: string;
  weight_lb: number | null;
  reps: number | null;
};

/** Total volume = sum(weight × reps) across logged sets. */
export function totalVolume(sets: LoggedSet[]): number {
  return sets.reduce((acc, s) => acc + (s.weight_lb ?? 0) * (s.reps ?? 0), 0);
}

/** Best estimated 1RM per exercise from a set of logged rows. */
export function bestE1RMByExercise(sets: LoggedSet[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const s of sets) {
    if (!s.weight_lb || !s.reps) continue;
    const e1 = estimate1RM(s.weight_lb, s.reps);
    if (e1 > (m.get(s.exercise) ?? 0)) m.set(s.exercise, e1);
  }
  return m;
}

export function fmtVolume(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${Math.round(v)}`;
}

export function relativeDayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / DAY);
  const rel = diff === 0 ? "today" : diff === 1 ? "tomorrow" : diff === -1 ? "yesterday" : diff > 0 ? `in ${diff} days` : `${-diff} days ago`;
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${date} · ${rel}`;
}
