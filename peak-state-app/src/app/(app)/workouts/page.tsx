import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { WorkoutsClient } from "./Client";

export const metadata = { title: "Workouts — Peak State Labs" };

export const PROGRAMS: Array<{
  slug: string;
  name: string;
  days: number;
  blurb: string;
  template: { day: string; lifts: [string, number, string][] }[];
}> = [
  {
    slug: "push-pull-legs",
    name: "Push / Pull / Legs",
    days: 6,
    blurb: "Classic 6-day hypertrophy split. Best for intermediate and advanced lifters chasing recomp.",
    template: [
      { day: "Push 1", lifts: [["Bench press", 4, "6-8"], ["Overhead press", 3, "8-10"], ["Incline DB press", 3, "10-12"], ["Lateral raise", 4, "12-15"], ["Triceps pushdown", 3, "10-12"]] },
      { day: "Pull 1", lifts: [["Deadlift", 3, "5"], ["Barbell row", 3, "6-8"], ["Pull-up", 3, "AMRAP"], ["Face pull", 3, "12-15"], ["Barbell curl", 3, "10-12"]] },
      { day: "Legs 1", lifts: [["Back squat", 4, "6-8"], ["Romanian deadlift", 3, "8-10"], ["Leg press", 3, "10-12"], ["Leg curl", 3, "10-12"], ["Standing calf raise", 4, "12-15"]] },
    ],
  },
  {
    slug: "upper-lower",
    name: "Upper / Lower 4-day",
    days: 4,
    blurb: "Highest training economy for a 4-day-a-week schedule. Built around heavy compounds + accessory work.",
    template: [
      { day: "Upper A", lifts: [["Bench press", 4, "5"], ["Pendlay row", 4, "6"], ["Overhead press", 3, "8"], ["Chest-supported row", 3, "10"], ["Triceps + biceps", 3, "10-12"]] },
      { day: "Lower A", lifts: [["Back squat", 4, "5"], ["Romanian deadlift", 3, "8"], ["Walking lunge", 3, "10/leg"], ["Calves", 4, "12"]] },
    ],
  },
  {
    slug: "minimalist-3day",
    name: "Minimalist 3-Day",
    days: 3,
    blurb: "Full-body, low volume, high intensity. Pairs well with aggressive cuts on Reta.",
    template: [
      { day: "Full Body A", lifts: [["Squat", 3, "5"], ["Bench press", 3, "5"], ["Row", 3, "8"], ["Plank", 3, "60s"]] },
    ],
  },
];

export default function WorkoutsPage() {
  return (
    <>
      <PageHeader title="Workouts" description="Pick a program. Log your sets. Track every lift." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: sessions }, { data: profile }] = await Promise.all([
    supabase
      .from("workout_sessions")
      .select("id, name, scheduled_for, completed, notes")
      .eq("user_id", user!.id)
      .order("scheduled_for", { ascending: false })
      .limit(20),
    supabase.from("profiles").select("active_program").eq("id", user!.id).single(),
  ]);
  return <WorkoutsClient programs={PROGRAMS} sessions={sessions ?? []} activeProgram={profile?.active_program ?? null} />;
}
