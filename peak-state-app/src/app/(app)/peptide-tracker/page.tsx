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
        description="Choose a protocol, schedule your doses, get notified when it's time."
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
  if (!user) return null;

  const back = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  const forward = new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10);

  const [{ data: protocols }, { data: doses }, { data: profile }] = await Promise.all([
    supabase
      .from("peptide_protocols")
      .select("id, name, peptide_name, dose_mg, frequency, time_of_day, start_date, end_date, active, protocol_type, stacks, bpc_track")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, scheduled_for, time_of_day, taken, taken_at, notes")
      .eq("user_id", user.id)
      .gte("scheduled_for", back)
      .lte("scheduled_for", forward)
      .order("scheduled_for"),
    supabase
      .from("profiles")
      .select("morning_time, evening_time, notifications_enabled, timezone")
      .eq("id", user.id)
      .single(),
  ]);

  return (
    <PeptideTrackerClient
      protocols={protocols ?? []}
      doses={doses ?? []}
      profile={{
        morning_time: profile?.morning_time ?? "08:00",
        evening_time: profile?.evening_time ?? "20:00",
        notifications_enabled: profile?.notifications_enabled ?? false,
        timezone: profile?.timezone ?? null,
      }}
    />
  );
}
