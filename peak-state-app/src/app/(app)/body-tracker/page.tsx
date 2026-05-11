import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { BodyTrackerClient } from "./Client";

export const metadata = { title: "Body Tracker — Peak State Labs" };

export default function BodyTrackerPage() {
  return (
    <>
      <PageHeader title="Body Tracker" description="Log weight, measurements, and progress." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: weights }, { data: measurements }, { data: profile }] = await Promise.all([
    supabase
      .from("body_weight_logs")
      .select("id, weight_lb, logged_for, notes")
      .eq("user_id", user!.id)
      .order("logged_for", { ascending: false })
      .limit(120),
    supabase
      .from("body_measurements")
      .select("id, logged_for, waist_in, chest_in, hip_in, arm_in, thigh_in, body_fat_pct, notes")
      .eq("user_id", user!.id)
      .order("logged_for", { ascending: false })
      .limit(30),
    supabase.from("profiles").select("goal_weight_lb").eq("id", user!.id).single(),
  ]);

  return (
    <BodyTrackerClient
      weights={weights ?? []}
      measurements={measurements ?? []}
      goalWeight={profile?.goal_weight_lb ?? null}
    />
  );
}
