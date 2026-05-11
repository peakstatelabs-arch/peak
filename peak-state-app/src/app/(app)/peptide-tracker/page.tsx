import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { PeptideTrackerClient } from "./Client";

export const metadata = { title: "Peptide Tracker — Peak State Labs" };

export default async function PeptideTracker() {
  return (
    <>
      <PageHeader
        title="Peptide Tracker"
        description="Build protocols, log doses, and stay consistent."
      />
      <Suspense fallback={<><CardSkeleton /><div className="h-4" /><CardSkeleton /></>}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: protocols }, { data: doses }] = await Promise.all([
    supabase
      .from("peptide_protocols")
      .select("id, name, peptide_name, dose_mg, frequency, time_of_day, start_date, end_date, active")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, scheduled_for, time_of_day, taken, taken_at, notes")
      .eq("user_id", user!.id)
      .gte("scheduled_for", new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString().slice(0, 10))
      .order("scheduled_for", { ascending: false })
      .limit(60),
  ]);

  return <PeptideTrackerClient protocols={protocols ?? []} doses={doses ?? []} />;
}
