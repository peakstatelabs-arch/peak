import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { todayISO } from "@/lib/utils";

export const metadata = { title: "Dashboard — Peak State Labs" };

export default async function Dashboard() {
  return (
    <>
      <PageHeader title="Today" description="Your daily snapshot." />
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<CardSkeleton />}>
          <DosingCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <WeightCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <WorkoutCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <StreakCard />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <CheckInReminder />
      </Suspense>
    </>
  );
}

async function DosingCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = todayISO();
  const { data: doses } = await supabase
    .from("peptide_doses")
    .select("id, peptide_name, dose_mg, time_of_day, taken, scheduled_for")
    .eq("user_id", user!.id)
    .eq("scheduled_for", today)
    .order("time_of_day");

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Today's dosing</h3>
        <Link href="/peptide-tracker" className="text-xs text-fg-muted hover:text-fg">View all →</Link>
      </div>
      {!doses || doses.length === 0 ? (
        <p className="text-sm text-fg-muted">
          Nothing scheduled today. <Link href="/peptide-tracker" className="text-accent hover:underline">Build a protocol</Link>.
        </p>
      ) : (
        <ul className="space-y-2">
          {doses.map((d) => (
            <li key={d.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${d.taken ? "bg-success" : "bg-fg-subtle"}`} />
                <span className="font-medium">{d.peptide_name}</span>
                <span className="text-fg-muted">{d.dose_mg} mg</span>
              </div>
              <span className="text-xs text-fg-subtle">{d.time_of_day ?? ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

async function WeightCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: logs } = await supabase
    .from("body_weight_logs")
    .select("weight_lb, logged_for")
    .eq("user_id", user!.id)
    .order("logged_for", { ascending: false })
    .limit(2);

  const latest = logs?.[0];
  const prev = logs?.[1];
  const delta = latest && prev ? +(latest.weight_lb - prev.weight_lb).toFixed(1) : null;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Body weight</h3>
        <Link href="/body-tracker" className="text-xs text-fg-muted hover:text-fg">Log →</Link>
      </div>
      {!latest ? (
        <p className="text-sm text-fg-muted">No weigh-ins yet. <Link href="/body-tracker" className="text-accent hover:underline">Log your first</Link>.</p>
      ) : (
        <div>
          <div className="flex items-end gap-2">
            <span className="font-display text-3xl font-semibold">{latest.weight_lb}</span>
            <span className="text-fg-muted text-sm pb-1">lb</span>
            {delta !== null && (
              <span className={`ml-2 text-sm pb-1 ${delta < 0 ? "text-accent" : delta > 0 ? "text-fg-muted" : "text-fg-subtle"}`}>
                {delta > 0 ? "+" : ""}{delta} from last
              </span>
            )}
          </div>
          <p className="text-xs text-fg-subtle mt-1">Logged {latest.logged_for}</p>
        </div>
      )}
    </div>
  );
}

async function WorkoutCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("workout_sessions")
    .select("id, name, scheduled_for")
    .eq("user_id", user!.id)
    .gte("scheduled_for", todayISO())
    .order("scheduled_for")
    .limit(1);

  const next = data?.[0];
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Next workout</h3>
        <Link href="/workouts" className="text-xs text-fg-muted hover:text-fg">Plan →</Link>
      </div>
      {next ? (
        <div>
          <div className="font-medium">{next.name}</div>
          <div className="text-xs text-fg-subtle mt-1">{next.scheduled_for}</div>
        </div>
      ) : (
        <p className="text-sm text-fg-muted">No workout scheduled. <Link href="/workouts" className="text-accent hover:underline">Pick a program</Link>.</p>
      )}
    </div>
  );
}

async function StreakCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data: doses } = await supabase
    .from("peptide_doses")
    .select("scheduled_for, taken")
    .eq("user_id", user!.id)
    .gte("scheduled_for", since.toISOString().slice(0, 10));

  let streak = 0;
  if (doses && doses.length > 0) {
    const byDay = new Map<string, { total: number; done: number }>();
    for (const d of doses) {
      const e = byDay.get(d.scheduled_for) ?? { total: 0, done: 0 };
      e.total += 1;
      if (d.taken) e.done += 1;
      byDay.set(d.scheduled_for, e);
    }
    const cursor = new Date();
    for (let i = 0; i < 60; i++) {
      const key = cursor.toISOString().slice(0, 10);
      const day = byDay.get(key);
      if (day && day.total > 0 && day.done === day.total) {
        streak += 1;
      } else if (day) {
        break;
      }
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Compliance streak</h3>
      <div className="flex items-end gap-2">
        <span className="font-display text-3xl font-semibold">{streak}</span>
        <span className="text-fg-muted text-sm pb-1">day{streak === 1 ? "" : "s"}</span>
      </div>
      <p className="text-xs text-fg-subtle mt-1">Consecutive days with all doses logged.</p>
    </div>
  );
}

async function CheckInReminder() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { data } = await supabase
    .from("weekly_checkins")
    .select("created_at")
    .eq("user_id", user!.id)
    .gte("created_at", sevenDaysAgo.toISOString())
    .limit(1);

  if (data && data.length > 0) return null;
  return (
    <Link href="/check-in" className="mt-4 block card border-accent/40 bg-accent/5 hover:bg-accent/10 transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Weekly check-in is ready</h3>
          <p className="text-sm text-fg-muted mt-1">Takes 60 seconds — keeps your charts accurate.</p>
        </div>
        <span className="text-accent">→</span>
      </div>
    </Link>
  );
}
