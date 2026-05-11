import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { ProgressClient } from "./Client";

export const metadata = { title: "Progress — Peak State Labs" };

export default function ProgressPage() {
  return (
    <>
      <PageHeader title="Progress" description="Weight, strength, compliance — overlaid." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ninetyAgo = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
  const [{ data: weights }, { data: doses }, { data: checkins }] = await Promise.all([
    supabase.from("body_weight_logs").select("logged_for, weight_lb").eq("user_id", user!.id).gte("logged_for", ninetyAgo).order("logged_for"),
    supabase.from("peptide_doses").select("scheduled_for, taken").eq("user_id", user!.id).gte("scheduled_for", ninetyAgo),
    supabase.from("weekly_checkins").select("created_at, energy, sleep, mood").eq("user_id", user!.id).order("created_at"),
  ]);

  return (
    <ProgressClient
      weights={weights ?? []}
      doses={doses ?? []}
      checkins={checkins ?? []}
    />
  );
}
