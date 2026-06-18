import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { WorkoutsClient } from "./WorkoutsClient";

export const metadata = { title: "Workouts — Peak State Labs" };

export default function WorkoutsPage() {
  return (
    <>
      <PageHeader title="Training" description="Your programs, calendar, and every lift — tracked." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const back = new Date(Date.now() - 45 * 86400000).toISOString().slice(0, 10);
  const forward = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const setsSince = new Date(Date.now() - 120 * 86400000).toISOString();

  const [{ data: sessions }, { data: sets }, { data: profile }] = await Promise.all([
    supabase
      .from("workout_sessions")
      .select("id, name, program_slug, day_label, focus, scheduled_for, completed, completed_at, notes")
      .eq("user_id", user.id)
      .gte("scheduled_for", back)
      .lte("scheduled_for", forward)
      .order("scheduled_for"),
    supabase
      .from("workout_sets")
      .select("id, session_id, exercise, set_number, weight_lb, reps, rpe, completed, is_pr, created_at")
      .eq("user_id", user.id)
      .gte("created_at", setsSince)
      .order("created_at"),
    supabase
      .from("profiles")
      .select("active_program, active_program_started, weight_unit")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <WorkoutsClient
      sessions={sessions ?? []}
      sets={sets ?? []}
      activeProgram={profile?.active_program ?? null}
      activeStarted={profile?.active_program_started ?? null}
      weightUnit={profile?.weight_unit ?? "lb"}
    />
  );
}
