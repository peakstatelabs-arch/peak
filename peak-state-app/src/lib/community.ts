// Community helpers: rotating weekly challenge + streak milestone backfill.

import type { SupabaseClient } from "@supabase/supabase-js";

export type Challenge = {
  slug: string;
  title: string;
  blurb: string;
  metric: "perfect_dose_week" | "workouts_done" | "checkin_submitted" | "meal_log_days";
  goal: number; // per-member threshold to count as "hit"
  hitLabel: string;
};

const CHALLENGES: Challenge[] = [
  {
    slug: "perfect-week",
    title: "Perfect dose week",
    blurb: "Log every scheduled dose, on time.",
    metric: "perfect_dose_week",
    goal: 1,
    hitLabel: "perfect week",
  },
  {
    slug: "three-workouts",
    title: "Three sessions",
    blurb: "Crush three scheduled workouts.",
    metric: "workouts_done",
    goal: 3,
    hitLabel: "3 workouts done",
  },
  {
    slug: "checkin-rally",
    title: "Check-in rally",
    blurb: "Submit your weekly check-in.",
    metric: "checkin_submitted",
    goal: 1,
    hitLabel: "checked in",
  },
  {
    slug: "fuel-up",
    title: "Fuel up",
    blurb: "Log meals 5 of 7 days this week.",
    metric: "meal_log_days",
    goal: 5,
    hitLabel: "5+ meal days",
  },
];

/** Deterministic rotation: same challenge for everyone in a given week. */
export function challengeForWeek(weekKey: string): Challenge {
  // week_key looks like "2026-W25"; extract the week number for the rotation.
  const m = weekKey.match(/W(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 0;
  return CHALLENGES[n % CHALLENGES.length];
}

/* ───── streak milestone backfill ──────────────────────────────────── */

const STREAK_TIERS = [7, 14, 30, 60];
const DAY_MS = 86400000;

/**
 * Compute the signed-in user's current all-doses-logged streak and insert
 * a community_milestones row for any tier they've reached but don't yet
 * have. Idempotent thanks to the unique (user_id, kind) index added in
 * schema-v7. Safe to call on every page load.
 */
export async function backfillStreakMilestones(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const since = new Date(Date.now() - 65 * DAY_MS).toISOString().slice(0, 10);
  const { data: doses } = await supabase
    .from("peptide_doses")
    .select("scheduled_for, taken")
    .eq("user_id", userId)
    .gte("scheduled_for", since);

  if (!doses || doses.length === 0) return;

  const byDay = new Map<string, { total: number; done: number }>();
  for (const d of doses) {
    const e = byDay.get(d.scheduled_for) ?? { total: 0, done: 0 };
    e.total += 1;
    if (d.taken) e.done += 1;
    byDay.set(d.scheduled_for, e);
  }

  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 65; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const day = byDay.get(key);
    if (day && day.total > 0 && day.done === day.total) {
      streak += 1;
    } else if (day) {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  const tiersReached = STREAK_TIERS.filter((t) => streak >= t);
  for (const t of tiersReached) {
    // Errors on duplicate (unique index) are silently ignored — that's the point.
    await supabase
      .from("community_milestones")
      .insert({
        user_id: userId,
        kind: `streak_${t}`,
        title: `${t}-day dose streak`,
        source: "auto",
      });
  }
}
