import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { BodyTrackerClient } from "./Client";

export const metadata = { title: "Body Tracker — Peak State Labs" };

export default function BodyTrackerPage() {
  return (
    <>
      <PageHeader title="Body Tracker" description="Log weight, body fat, and progress." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: weights }, { data: bfRows }, { data: profile }] = await Promise.all([
    supabase
      .from("body_weight_logs")
      .select("id, weight_lb, logged_for, notes")
      .eq("user_id", user!.id)
      .order("logged_for", { ascending: false })
      .limit(120),
    supabase
      .from("body_measurements")
      .select("id, logged_for, body_fat_pct")
      .eq("user_id", user!.id)
      .not("body_fat_pct", "is", null)
      .order("logged_for", { ascending: false })
      .limit(120),
    supabase
      .from("profiles")
      .select("goal_weight_lb, goal_bf_pct, bf_tracking_enabled")
      .eq("id", user!.id)
      .single(),
  ]);

  return (
    <BodyTrackerClient
      weights={weights ?? []}
      bfEntries={(bfRows ?? []).map((r) => ({
        id: r.id,
        logged_for: r.logged_for,
        body_fat_pct: r.body_fat_pct as number,
      }))}
      goalWeight={profile?.goal_weight_lb ?? null}
      goalBf={profile?.goal_bf_pct ?? null}
      bfEnabled={profile?.bf_tracking_enabled ?? false}
    />
  );
}
