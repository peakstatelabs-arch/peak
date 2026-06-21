import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { generateCheckInQuestions, type CheckInContext, type CheckInQuestion } from "@/lib/ai-checkin";
import { weekKey } from "@/lib/utils";
import { CheckInForm } from "./CheckInForm";

export const metadata = { title: "Weekly check-in — Peak State Labs" };
export const dynamic = "force-dynamic";

const DAY_MS = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export default async function CheckInPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const wk = weekKey();

  // Reuse stored questions if the user already opened a check-in for this
  // week (idempotent and free), otherwise generate fresh.
  const { data: existing } = await supabase
    .from("weekly_checkins")
    .select("ai_questions")
    .eq("user_id", user.id)
    .eq("week_key", wk)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let questions: CheckInQuestion[];
  if (existing?.ai_questions) {
    questions = existing.ai_questions as CheckInQuestion[];
  } else {
    const ctx = await buildContext(user.id);
    questions = await generateCheckInQuestions(ctx);
  }

  return (
    <>
      <PageHeader
        title="Weekly check-in"
        description="Quick honest answers. Tap a chip or type your own — your coach will see it."
      />
      <div className="max-w-xl">
        <CheckInForm questions={questions} weekKey={wk} />
      </div>
    </>
  );
}

async function buildContext(userId: string): Promise<CheckInContext> {
  const admin = createAdminClient();
  const now = new Date();
  const since7 = iso(new Date(now.getTime() - 6 * DAY_MS));
  const today = iso(now);

  const [profileR, protocolR, dosesR, sessionsR, weightsR, checkinsR] = await Promise.all([
    admin.from("profiles").select("first_name, active_program, active_program_started, metabolic_type, nutrition_targets").eq("id", userId).single(),
    admin.from("peptide_protocols").select("name, start_date").eq("user_id", userId).eq("active", true).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    admin.from("peptide_doses").select("taken, scheduled_for").eq("user_id", userId).gte("scheduled_for", since7).lte("scheduled_for", today),
    admin.from("workout_sessions").select("completed, scheduled_for").eq("user_id", userId).gte("scheduled_for", since7).lte("scheduled_for", today),
    admin.from("body_weight_logs").select("weight_lb, logged_for").eq("user_id", userId).order("logged_for", { ascending: false }).limit(20),
    admin.from("weekly_checkins").select("created_at, notes").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
  ]);

  const profile = profileR.data;
  const proto = protocolR.data;
  const doses = dosesR.data ?? [];
  const sessions = sessionsR.data ?? [];
  const weights = weightsR.data ?? [];
  const lastCheckin = (checkinsR.data ?? [])[0];

  const dosesScheduled = doses.length;
  const dosesTaken = doses.filter((d) => d.taken).length;
  const doseAdherencePct = dosesScheduled > 0 ? Math.round((dosesTaken / dosesScheduled) * 100) : null;
  const workoutsScheduled = sessions.length;
  const workoutsDone = sessions.filter((s) => s.completed).length;
  const workoutCompletionPct = workoutsScheduled > 0 ? Math.round((workoutsDone / workoutsScheduled) * 100) : null;

  const latestWeight = weights[0];
  const daysSinceWeightLog = latestWeight
    ? Math.floor((Date.parse(today + "T00:00:00Z") - Date.parse(latestWeight.logged_for + "T00:00:00Z")) / DAY_MS)
    : null;
  const target7dAgo = Date.parse(since7 + "T00:00:00Z");
  const weight7dAgo = weights.filter((w) => Date.parse(w.logged_for + "T00:00:00Z") <= target7dAgo).map((w) => Number(w.weight_lb))[0];
  const weightDelta7dLb = latestWeight && weight7dAgo ? Number(latestWeight.weight_lb) - weight7dAgo : null;

  const protocolWeek = proto?.start_date
    ? Math.max(1, Math.floor((now.getTime() - Date.parse(proto.start_date + "T00:00:00Z")) / DAY_MS / 7) + 1)
    : null;

  let goal: string | null = null;
  const nt = profile?.nutrition_targets as Record<string, unknown> | null;
  if (nt && typeof nt.goal === "string") goal = nt.goal;

  return {
    firstName: profile?.first_name ?? null,
    weekKey: weekKey(),
    protocolName: proto?.name?.split(" · ")[0] ?? null,
    protocolWeek,
    programSlug: profile?.active_program ?? null,
    doseAdherencePct,
    missedDoses: Math.max(0, dosesScheduled - dosesTaken),
    workoutCompletionPct,
    daysSinceWeightLog,
    weightDelta7dLb,
    daysSinceLastCheckin: lastCheckin ? Math.floor((now.getTime() - Date.parse(lastCheckin.created_at)) / DAY_MS) : null,
    prevCheckinNotes: lastCheckin?.notes ?? null,
    goal,
    metabolicType: profile?.metabolic_type ?? null,
  };
}
