import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { todayInZone, localDateISO } from "@/lib/utils";
import { getUserTodayISO, getUserTimezone } from "@/lib/today";
import { TodayDoseCard } from "./TodayDoseCard";

export const metadata = { title: "Today — Peak State Labs" };
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <>
      <PageHeader title="Today" description="One thing at a time." />
      <Suspense fallback={<CardSkeleton />}>
        <TodayHero />
      </Suspense>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <Suspense fallback={<StatSkeleton />}>
          <StreakStat />
        </Suspense>
        <Suspense fallback={<StatSkeleton />}>
          <WeekStat />
        </Suspense>
        <Suspense fallback={<StatSkeleton />}>
          <WeightStat />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <CheckInReminder />
      </Suspense>
    </>
  );
}

function StatSkeleton() {
  return <div className="card h-20 animate-pulse bg-bg-elev/40" />;
}

/* ─── Hero: today's doses (or what's next) ──────────────────────────── */

async function TodayHero() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = await getUserTodayISO(supabase, user!.id);

  const [{ data: dosesRaw }, { data: protocols }] = await Promise.all([
    supabase
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, time_of_day, taken, scheduled_for")
      .eq("user_id", user!.id)
      .eq("scheduled_for", today),
    supabase
      .from("peptide_protocols")
      .select("id")
      .eq("user_id", user!.id)
      .eq("active", true)
      .limit(1),
  ]);

  // Display order: untaken first (so the next dose is always at the top),
  // then morning before evening, then alphabetical. Taken doses slide to
  // the bottom but stay visible so the user can undo a mis-tap.
  const timeRank = (t: string | null) => (t === "morning" ? 0 : 1);
  const doses = [...(dosesRaw ?? [])].sort((a, b) => {
    if (a.taken !== b.taken) return a.taken ? 1 : -1;
    const tr = timeRank(a.time_of_day) - timeRank(b.time_of_day);
    if (tr !== 0) return tr;
    return a.peptide_name.localeCompare(b.peptide_name);
  });

  // Admins can land here without a protocol (the wizard gate skips them).
  if (!protocols || protocols.length === 0) {
    return (
      <section className="card text-center py-10">
        <p className="text-fg-muted">No active protocol.</p>
        <Link href="/onboard-protocol" className="btn-primary mt-4 inline-flex">
          Set one up
        </Link>
      </section>
    );
  }

  // Has a protocol — today's doses (or next)
  if (doses && doses.length > 0) {
    return <TodayDoseCard doses={doses} />;
  }

  // Has a protocol, nothing today — show next
  const { data: upcoming } = await supabase
    .from("peptide_doses")
    .select("id, peptide_name, dose_mg, time_of_day, scheduled_for")
    .eq("user_id", user!.id)
    .gt("scheduled_for", today)
    .order("scheduled_for")
    .limit(12);

  const nextDay = upcoming?.[0]?.scheduled_for ?? null;
  const nextDoses = nextDay ? upcoming!.filter((d) => d.scheduled_for === nextDay) : [];

  return (
    <section className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle mb-1">Today</div>
      <h2 className="font-display text-xl font-semibold">Rest day. Enjoy it.</h2>

      {nextDay && (
        <div className="mt-4 rounded-lg border border-border bg-bg-elev/40 p-3">
          <div className="text-xs uppercase tracking-wide text-fg-subtle mb-2">
            Next dose · {relativeDayLabel(nextDay, today)}
          </div>
          <ul className="space-y-1">
            {nextDoses.map((d) => (
              <li key={d.id} className="flex items-center justify-between text-sm">
                <span className="font-medium">{d.peptide_name}</span>
                <span className="text-xs text-fg-subtle">
                  {d.dose_mg} mg · {d.time_of_day === "morning" ? "AM" : "PM"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function relativeDayLabel(iso: string, todayIso: string): string {
  const d = new Date(iso + "T00:00:00");
  const today = new Date(todayIso + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  const rel = diff === 1 ? "tomorrow" : diff <= 0 ? "today" : `in ${diff} days`;
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${date} · ${rel}`;
}

/* ─── Stats: streak / this week / weight ─────────────────────────────── */

async function StreakStat() {
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
    const tz = await getUserTimezone(supabase, user!.id);
    const cursor = new Date(todayInZone(tz) + "T00:00:00");
    for (let i = 0; i < 60; i++) {
      const key = localDateISO(cursor);
      const day = byDay.get(key);
      if (day && day.total > 0 && day.done === day.total) streak += 1;
      else if (day) break;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return <StatBox label="Streak" value={String(streak)} unit={streak === 1 ? "day" : "days"} />;
}

async function WeekStat() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = await getUserTodayISO(supabase, user!.id);
  // Monday of the user's current week, anchored to their local "today".
  const base = new Date(today + "T00:00:00");
  const day = base.getDay() === 0 ? 7 : base.getDay();
  const weekStart = new Date(base);
  weekStart.setDate(base.getDate() - (day - 1));
  const startIso = localDateISO(weekStart);

  const { data } = await supabase
    .from("peptide_doses")
    .select("taken")
    .eq("user_id", user!.id)
    .gte("scheduled_for", startIso)
    .lte("scheduled_for", today);

  const total = data?.length ?? 0;
  const done = data?.filter((d) => d.taken).length ?? 0;

  return <StatBox label="This week" value={`${done}/${total}`} unit="doses" />;
}

async function WeightStat() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: logs } = await supabase
    .from("body_weight_logs")
    .select("weight_lb, logged_for")
    .eq("user_id", user!.id)
    .order("logged_for", { ascending: false })
    .limit(2);

  const latest = logs?.[0];
  if (!latest) {
    return (
      <Link href="/body-tracker" className="card block hover:bg-bg-elev/40">
        <div className="text-xs uppercase tracking-wide text-fg-subtle">Weight</div>
        <div className="mt-1 text-sm text-accent">Log first →</div>
      </Link>
    );
  }
  const prev = logs?.[1];
  const delta = prev ? +(Number(latest.weight_lb) - Number(prev.weight_lb)).toFixed(1) : null;

  return (
    <Link href="/body-tracker" className="card block hover:bg-bg-elev/40">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">Weight</div>
      <div className="mt-1">
        <span className="font-display text-2xl font-semibold">{latest.weight_lb}</span>
        <span className="text-fg-muted text-xs ml-1">lb</span>
      </div>
      {delta !== null && (
        <div
          className={
            "text-xs " + (delta < 0 ? "text-accent" : delta > 0 ? "text-fg-muted" : "text-fg-subtle")
          }
        >
          {delta > 0 ? "+" : ""}
          {delta} last
        </div>
      )}
    </Link>
  );
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className="mt-1">
        <span className="font-display text-2xl font-semibold">{value}</span>
        {unit && <span className="text-fg-muted text-xs ml-1">{unit}</span>}
      </div>
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
    <Link
      href="/check-in"
      className="mt-4 block card border-accent/40 bg-accent/5 hover:bg-accent/10 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Weekly check-in is ready</h3>
          <p className="text-sm text-fg-muted mt-1">Takes 60 seconds. Keeps your coach in the loop.</p>
        </div>
        <span className="text-accent">→</span>
      </div>
    </Link>
  );
}
