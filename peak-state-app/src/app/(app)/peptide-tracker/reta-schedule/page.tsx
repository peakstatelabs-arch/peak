import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { RetaScheduleEditor, type RetaDoseRow } from "./Client";

export const metadata = { title: "Retatrutide schedule — Peak State Labs" };
export const dynamic = "force-dynamic";

export default async function RetaSchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: doses } = await supabase
    .from("peptide_doses")
    .select("id, dose_mg, scheduled_for, taken, taken_at, notes")
    .eq("user_id", user.id)
    .eq("peptide_name", "Retatrutide")
    .order("scheduled_for", { ascending: true });

  const rows: RetaDoseRow[] = (doses ?? []).map((d) => ({
    id: d.id as string,
    dose_mg: Number(d.dose_mg),
    scheduled_for: d.scheduled_for as string,
    taken: d.taken as boolean,
    notes: (d.notes as string | null) ?? null,
  }));

  return (
    <div className="space-y-5">
      <Link
        href="/peptide-tracker"
        className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Peptide Tracker
      </Link>

      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Retatrutide schedule
        </h1>
        <p className="text-sm text-fg-muted mt-1">
          Edit any upcoming week's dose. Past doses are read-only.
        </p>
      </header>

      {rows.length === 0 ? (
        <section className="card text-center">
          <p className="text-fg-muted">No Retatrutide doses scheduled.</p>
        </section>
      ) : (
        <RetaScheduleEditor rows={rows} />
      )}
    </div>
  );
}
