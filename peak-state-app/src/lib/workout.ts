import { type Program, phaseForWeek, recommendedWeekdays } from "./programs";

const DAY = 86400000;
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export type ScheduledSession = {
  program_slug: string;
  day_label: string;
  focus: string;
  workout_index: number; // 0-based index into the phase's workouts (for the logger)
  phase_label: string;
  week_in_phase: number; // 1-based
  scheduled_for: string;
};

function rollTo(d: Date, weekday: number): Date {
  const out = new Date(d);
  const cur = out.getDay() === 0 ? 7 : out.getDay();
  out.setDate(out.getDate() + ((weekday - cur + 7) % 7));
  return out;
}

/**
 * Lay a multi-phase program onto the calendar.
 *  - Anchors on the Monday of the start week.
 *  - For each week, picks the right phase, lays its N workouts on the chosen
 *    weekdays (defaults to recommended even spacing for that N).
 */
export function generateProgramSchedule(opts: {
  program: Program;
  startDate: Date;
  weekdays?: number[]; // override; otherwise inferred per-phase from workout count
}): ScheduledSession[] {
  const { program, startDate } = opts;
  const week1Monday = rollTo(startDate, 1);
  const out: ScheduledSession[] = [];

  let weekIdx = 0;
  for (const phase of program.phases) {
    const days = opts.weekdays?.slice(0, phase.workouts.length) ??
      recommendedWeekdays(phase.workouts.length);

    for (let pw = 0; pw < phase.weeks; pw++) {
      const monday = new Date(week1Monday.getTime() + (weekIdx + pw) * 7 * DAY);
      phase.workouts.forEach((wkout, i) => {
        const weekday = days[i] ?? days[days.length - 1];
        const date = new Date(monday.getTime() + (weekday - 1) * DAY);
        out.push({
          program_slug: program.slug,
          day_label: wkout.label,
          focus: wkout.focus,
          workout_index: i,
          phase_label: phase.label,
          week_in_phase: pw + 1,
          scheduled_for: isoDate(date),
        });
      });
    }
    weekIdx += phase.weeks;
  }
  return out;
}

/** Build session name shown to clients: phase + day label. */
export function sessionName(s: ScheduledSession): string {
  return `${s.day_label} · ${s.phase_label}`;
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

export function totalVolume(sets: LoggedSet[]): number {
  return sets.reduce((acc, s) => acc + (s.weight_lb ?? 0) * (s.reps ?? 0), 0);
}

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

/** Pull the workout definition for a saved session. */
export function workoutForSession(
  program: Program,
  dayLabel: string | null,
  phaseLabel: string | null
) {
  if (!dayLabel) return undefined;
  const phase = phaseLabel
    ? program.phases.find((ph) => ph.label === phaseLabel)
    : undefined;
  if (phase) {
    return phase.workouts.find((wt) => wt.label === dayLabel);
  }
  // legacy fallback: scan all phases
  for (const ph of program.phases) {
    const found = ph.workouts.find((wt) => wt.label === dayLabel);
    if (found) return found;
  }
  return undefined;
}

export { phaseForWeek, recommendedWeekdays };
