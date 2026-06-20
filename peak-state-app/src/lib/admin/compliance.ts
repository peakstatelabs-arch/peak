// Admin coaching dashboard — compliance & flag computation.
//
// Pillars auto-activate from a client's existing data:
//   peptide  → has an active peptide_protocols row
//   workout  → has profiles.active_program set OR any workout_sessions row
//   nutrition→ has profiles.nutrition_targets set OR any meal_logs row
//   checkin  → always tracked
//
// Per-pillar score over the window:
//   peptide:   taken doses ÷ scheduled doses
//   workout:   completed sessions ÷ scheduled sessions
//   nutrition: days with ≥1 meal_log ÷ days in window
//   checkin:   weeks with submitted check-in ÷ weeks in window
//
// Overall %: simple average across active pillars only.

import type { SupabaseClient } from "@supabase/supabase-js";

export type WindowDays = 7 | 14 | 30;
export type PillarKey = "peptide" | "workout" | "nutrition" | "checkin";

export type PillarStat = {
  key: PillarKey;
  active: boolean;
  completed: number;
  scheduled: number; // 0 means "denominator unknown" (e.g. no doses scheduled in window)
  pct: number | null;
};

export type Flag = {
  key: "missed-doses" | "no-checkin" | "low-compliance" | "no-meals";
  label: string;
};

export type ClientRow = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  peptideProtocolName: string | null;
  programSlug: string | null;
  programStarted: string | null;
  programWeek: number | null;
  pillars: Record<PillarKey, PillarStat>;
  overallPct: number | null;
  lastActivity: string | null;
  flags: Flag[];
};

const DAY_MS = 86400000;

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfWindow(windowDays: WindowDays, now = new Date()): Date {
  const start = new Date(now.getTime() - (windowDays - 1) * DAY_MS);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

function programWeek(started: string | null, asOf = new Date()): number | null {
  if (!started) return null;
  const startMs = Date.parse(started + "T00:00:00Z");
  if (Number.isNaN(startMs)) return null;
  const days = Math.floor((asOf.getTime() - startMs) / DAY_MS);
  return Math.max(1, Math.floor(days / 7) + 1);
}

type ProfileLite = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  active_program: string | null;
  active_program_started: string | null;
  nutrition_targets: unknown | null;
};

export type ComputeOpts = {
  profiles: ProfileLite[];
  emailById: Map<string, string>;
  windowDays: WindowDays;
  now?: Date;
};

/**
 * Bulk-compute one ClientRow per profile. All Supabase reads are batched
 * across user_ids so the dashboard scales to dozens of clients without
 * an N+1 explosion.
 */
export async function computeClientRows(
  admin: SupabaseClient,
  opts: ComputeOpts
): Promise<ClientRow[]> {
  const { profiles, emailById, windowDays } = opts;
  const now = opts.now ?? new Date();
  const winStart = startOfWindow(windowDays, now);
  const winStartIso = iso(winStart);
  const todayIso = iso(now);
  const userIds = profiles.map((p) => p.id);
  if (userIds.length === 0) return [];

  // Active peptide protocols (newest one wins for the "current protocol" label)
  const { data: protocols } = await admin
    .from("peptide_protocols")
    .select("id, user_id, name, start_date, active")
    .in("user_id", userIds)
    .eq("active", true)
    .order("created_at", { ascending: false });
  const protoByUser = new Map<string, { name: string; start_date: string }>();
  for (const p of protocols ?? []) {
    if (!protoByUser.has(p.user_id)) {
      protoByUser.set(p.user_id, { name: p.name, start_date: p.start_date });
    }
  }

  // Peptide doses inside window (scheduled + taken counts)
  const { data: doses } = await admin
    .from("peptide_doses")
    .select("user_id, scheduled_for, taken")
    .in("user_id", userIds)
    .gte("scheduled_for", winStartIso)
    .lte("scheduled_for", todayIso);
  const doseAgg = new Map<string, { scheduled: number; taken: number }>();
  for (const d of doses ?? []) {
    const agg = doseAgg.get(d.user_id) ?? { scheduled: 0, taken: 0 };
    agg.scheduled += 1;
    if (d.taken) agg.taken += 1;
    doseAgg.set(d.user_id, agg);
  }

  // Most-recent two scheduled doses per user (up to today) for the missed-streak flag.
  // We pull the last 6 doses per user via a broader query then group.
  const lookbackIso = iso(new Date(now.getTime() - 14 * DAY_MS));
  const { data: recentDoses } = await admin
    .from("peptide_doses")
    .select("user_id, scheduled_for, taken")
    .in("user_id", userIds)
    .gte("scheduled_for", lookbackIso)
    .lte("scheduled_for", todayIso)
    .order("scheduled_for", { ascending: false });
  const recentDosesByUser = new Map<string, { scheduled_for: string; taken: boolean }[]>();
  for (const d of recentDoses ?? []) {
    const arr = recentDosesByUser.get(d.user_id) ?? [];
    arr.push({ scheduled_for: d.scheduled_for, taken: d.taken });
    recentDosesByUser.set(d.user_id, arr);
  }

  // Workout sessions inside window
  const { data: sessions } = await admin
    .from("workout_sessions")
    .select("user_id, scheduled_for, completed, completed_at")
    .in("user_id", userIds)
    .gte("scheduled_for", winStartIso)
    .lte("scheduled_for", todayIso);
  const sessionAgg = new Map<string, { scheduled: number; completed: number; lastCompleted: string | null }>();
  for (const s of sessions ?? []) {
    const agg = sessionAgg.get(s.user_id) ?? { scheduled: 0, completed: 0, lastCompleted: null };
    agg.scheduled += 1;
    if (s.completed) agg.completed += 1;
    if (s.completed_at && (!agg.lastCompleted || s.completed_at > agg.lastCompleted)) {
      agg.lastCompleted = s.completed_at;
    }
    sessionAgg.set(s.user_id, agg);
  }

  // "Has ever logged a workout" — for pillar activation
  const { data: anySessions } = await admin
    .from("workout_sessions")
    .select("user_id")
    .in("user_id", userIds)
    .limit(1000);
  const hasAnyWorkout = new Set<string>((anySessions ?? []).map((r) => r.user_id));

  // Meal logs inside window (unique days)
  const { data: meals } = await admin
    .from("meal_logs")
    .select("user_id, logged_for, created_at")
    .in("user_id", userIds)
    .gte("logged_for", winStartIso)
    .lte("logged_for", todayIso);
  const mealDaysByUser = new Map<string, Set<string>>();
  const lastMealByUser = new Map<string, string>();
  for (const m of meals ?? []) {
    const set = mealDaysByUser.get(m.user_id) ?? new Set<string>();
    set.add(m.logged_for);
    mealDaysByUser.set(m.user_id, set);
    const cur = lastMealByUser.get(m.user_id);
    if (!cur || m.created_at > cur) lastMealByUser.set(m.user_id, m.created_at);
  }

  // "Has ever logged a meal" — for pillar activation
  const { data: anyMeals } = await admin
    .from("meal_logs")
    .select("user_id")
    .in("user_id", userIds)
    .limit(1000);
  const hasAnyMeal = new Set<string>((anyMeals ?? []).map((r) => r.user_id));

  // Most-recent meal_log for each user (covers "days since meal" red flag,
  // even if last meal was before the window).
  const { data: recentMeals } = await admin
    .from("meal_logs")
    .select("user_id, logged_for")
    .in("user_id", userIds)
    .order("logged_for", { ascending: false })
    .limit(1000);
  const lastMealDayByUser = new Map<string, string>();
  for (const m of recentMeals ?? []) {
    if (!lastMealDayByUser.has(m.user_id)) lastMealDayByUser.set(m.user_id, m.logged_for);
  }

  // Weekly check-ins (most recent per user + count inside window)
  const { data: checkins } = await admin
    .from("weekly_checkins")
    .select("user_id, created_at")
    .in("user_id", userIds)
    .order("created_at", { ascending: false });
  const lastCheckinByUser = new Map<string, string>();
  const checkinsInWindowByUser = new Map<string, number>();
  const winStartMs = winStart.getTime();
  for (const c of checkins ?? []) {
    if (!lastCheckinByUser.has(c.user_id)) lastCheckinByUser.set(c.user_id, c.created_at);
    if (Date.parse(c.created_at) >= winStartMs) {
      checkinsInWindowByUser.set(c.user_id, (checkinsInWindowByUser.get(c.user_id) ?? 0) + 1);
    }
  }

  // Last weight log per user (last-activity contributor)
  const { data: weights } = await admin
    .from("body_weight_logs")
    .select("user_id, created_at")
    .in("user_id", userIds)
    .order("created_at", { ascending: false });
  const lastWeightByUser = new Map<string, string>();
  for (const w of weights ?? []) {
    if (!lastWeightByUser.has(w.user_id)) lastWeightByUser.set(w.user_id, w.created_at);
  }

  // Last dose taken per user (last-activity contributor)
  const { data: doseTaken } = await admin
    .from("peptide_doses")
    .select("user_id, taken_at")
    .in("user_id", userIds)
    .eq("taken", true)
    .order("taken_at", { ascending: false });
  const lastDoseTakenByUser = new Map<string, string>();
  for (const d of doseTaken ?? []) {
    if (!d.taken_at) continue;
    if (!lastDoseTakenByUser.has(d.user_id)) lastDoseTakenByUser.set(d.user_id, d.taken_at);
  }

  const weeksInWindow = Math.max(1, Math.round(windowDays / 7));

  return profiles.map((p) => {
    const proto = protoByUser.get(p.id);
    const peptideActive = Boolean(proto);
    const workoutActive = Boolean(p.active_program) || hasAnyWorkout.has(p.id);
    const nutritionActive = Boolean(p.nutrition_targets) || hasAnyMeal.has(p.id);

    const doseStat = doseAgg.get(p.id) ?? { scheduled: 0, taken: 0 };
    const sesStat = sessionAgg.get(p.id) ?? { scheduled: 0, completed: 0, lastCompleted: null };
    const mealDays = mealDaysByUser.get(p.id)?.size ?? 0;
    const checkinCount = checkinsInWindowByUser.get(p.id) ?? 0;

    const pillars: Record<PillarKey, PillarStat> = {
      peptide: pillarStat("peptide", peptideActive, doseStat.taken, doseStat.scheduled),
      workout: pillarStat("workout", workoutActive, sesStat.completed, sesStat.scheduled),
      nutrition: pillarStat("nutrition", nutritionActive, mealDays, windowDays),
      checkin: pillarStat("checkin", true, checkinCount, weeksInWindow),
    };

    const activePcts = (["peptide", "workout", "nutrition", "checkin"] as PillarKey[])
      .map((k) => pillars[k])
      .filter((s) => s.active && s.pct !== null)
      .map((s) => s.pct as number);
    const overallPct = activePcts.length
      ? Math.round(activePcts.reduce((a, b) => a + b, 0) / activePcts.length)
      : null;

    // Last activity = max of all activity timestamps
    const activityCandidates = [
      lastDoseTakenByUser.get(p.id),
      sesStat.lastCompleted ?? undefined,
      lastMealByUser.get(p.id),
      lastWeightByUser.get(p.id),
      lastCheckinByUser.get(p.id),
    ].filter(Boolean) as string[];
    const lastActivity = activityCandidates.length
      ? activityCandidates.reduce((a, b) => (a > b ? a : b))
      : null;

    // Flags
    const flags: Flag[] = [];

    // Missed ≥2 most-recent scheduled doses in a row (only if peptide pillar active)
    if (peptideActive) {
      const recent = recentDosesByUser.get(p.id) ?? [];
      if (recent.length >= 2 && !recent[0].taken && !recent[1].taken) {
        flags.push({ key: "missed-doses", label: "2+ missed doses" });
      }
    }

    // No check-in for >9 days (only flag if they've ever submitted one, OR
    // they've been a client for >9 days — but we don't track join date for
    // check-in start, so we flag everyone older than 9 days since last)
    const lastCheckinIso = lastCheckinByUser.get(p.id);
    const daysSinceCheckin = lastCheckinIso
      ? Math.floor((now.getTime() - Date.parse(lastCheckinIso)) / DAY_MS)
      : null;
    if (daysSinceCheckin !== null && daysSinceCheckin > 9) {
      flags.push({ key: "no-checkin", label: `No check-in ${daysSinceCheckin}d` });
    }

    // Overall compliance < 60
    if (overallPct !== null && overallPct < 60) {
      flags.push({ key: "low-compliance", label: `Compliance ${overallPct}%` });
    }

    // Zero nutrition logs in last 3+ days (only if nutrition pillar active)
    if (nutritionActive) {
      const lastMealDay = lastMealDayByUser.get(p.id);
      const daysSinceMeal = lastMealDay
        ? Math.floor(
            (Date.parse(todayIso + "T00:00:00Z") - Date.parse(lastMealDay + "T00:00:00Z")) / DAY_MS
          )
        : Infinity;
      if (daysSinceMeal >= 3) {
        flags.push({
          key: "no-meals",
          label: lastMealDay ? `No meals ${daysSinceMeal}d` : "No meals logged",
        });
      }
    }

    return {
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      email: emailById.get(p.id) ?? null,
      peptideProtocolName: proto?.name ?? null,
      programSlug: p.active_program,
      programStarted: p.active_program_started,
      programWeek: programWeek(p.active_program_started, now),
      pillars,
      overallPct,
      lastActivity,
      flags,
    };
  });
}

function pillarStat(
  key: PillarKey,
  active: boolean,
  completed: number,
  scheduled: number
): PillarStat {
  const pct = active && scheduled > 0 ? Math.round((completed / scheduled) * 100) : null;
  return { key, active, completed, scheduled, pct };
}

/** Sort: rows with red flags first (desc by flag count), then ascending compliance %. */
export function sortRows(rows: ClientRow[]): ClientRow[] {
  return [...rows].sort((a, b) => {
    if (a.flags.length !== b.flags.length) return b.flags.length - a.flags.length;
    const ap = a.overallPct ?? 101; // untracked floats to bottom of "ok" group
    const bp = b.overallPct ?? 101;
    return ap - bp;
  });
}

export function parseWindow(value: string | string[] | undefined): WindowDays {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  if (n === 14) return 14;
  if (n === 30) return 30;
  return 7;
}

export function formatRelative(iso: string | null, now = new Date()): string {
  if (!iso) return "—";
  const diffMs = now.getTime() - Date.parse(iso);
  if (Number.isNaN(diffMs)) return "—";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
