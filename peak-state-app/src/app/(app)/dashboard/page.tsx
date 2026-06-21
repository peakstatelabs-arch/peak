import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { OnboardingChecklist, type ChecklistData } from "@/components/OnboardingChecklist";
import { todayISO } from "@/lib/utils";

export const metadata = { title: "Dashboard — Peak State Labs" };

export default async function Dashboard() {
  return (
    <>
      <PageHeader title="Today" description="Your daily snapshot." />
      <Suspense fallback={null}>
        <OnboardingSection />
      </Suspense>
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

async function OnboardingSection() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileR, doseR, checkinR] = await Promise.all([
    supabase
      .from("profiles")
      .select("notifications_enabled, goal_weight_lb, metabolic_type, nutrition_targets")
      .eq("id", user.id)
      .single(),
    supabase
      .from("peptide_doses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("taken", true),
    supabase
      .from("weekly_checkins")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const p = profileR.data;
  const data: ChecklistData = {
    remindersEnabled: Boolean(p?.notifications_enabled),
    goalWeightSet: p?.goal_weight_lb !== null && p?.goal_weight_lb !== undefined,
    metabolicQuizDone: Boolean(p?.metabolic_type),
    nutritionTargetsSet: Boolean(p?.nutrition_targets),
    firstDoseLogged: (doseR.count ?? 0) > 0,
    firstCheckinDone: (checkinR.count ?? 0) > 0,
  };

  return <OnboardingChecklist data={data} />;
}

async function DosingCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = todayISO();

  const [{ data: doses }, { data: protocols }] = await Promise.all([
    supabase
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, time_of_day, taken, scheduled_for")
      .eq("user_id", user!.id)
      .eq("scheduled_for", today)
      .order("time_of_day"),
    supabase
      .from("peptide_protocols")
      .select("name, peptide_name, protocol_type, stacks, bpc_track, active")
      .eq("user_id", user!.id)
      .eq("active", true),
  ]);

  const hasProtocol = (protocols?.length ?? 0) > 0;
  const protocolLabel = summarizeProtocols(protocols ?? []);

  // No protocol at all → onboarding CTA
  if (!hasProtocol) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Today's dosing</h3>
        </div>
        <p className="text-sm text-fg-muted">
          No protocol yet.{" "}
          <Link href="/peptide-tracker" className="text-accent hover:underline">Build a protocol</Link>{" "}
          to start your schedule.
        </p>
      </div>
    );
  }

  // Has a protocol but nothing today → show next dose
  if (!doses || doses.length === 0) {
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
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Today's dosing</h3>
          <Link href="/peptide-tracker" className="text-xs text-fg-muted hover:text-fg">View all →</Link>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-sm text-fg-muted">Rest day — nothing scheduled today.</span>
        </div>

        {nextDay ? (
          <div className="rounded-lg border border-border bg-bg-elev p-3">
            <div className="text-xs uppercase tracking-wide text-fg-subtle mb-2">
              Next dose · {relativeDayLabel(nextDay)}
            </div>
            <ul className="space-y-1.5">
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
        ) : (
          <p className="text-sm text-fg-muted">No upcoming doses scheduled.</p>
        )}

        {protocolLabel && (
          <p className="text-xs text-fg-subtle mt-3">On: {protocolLabel}</p>
        )}
      </div>
    );
  }

  // Has doses today
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Today's dosing</h3>
        <Link href="/peptide-tracker" className="text-xs text-fg-muted hover:text-fg">View all →</Link>
      </div>
      <ul className="space-y-2">
        {doses.map((d) => (
          <li key={d.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${d.taken ? "bg-success" : "bg-fg-subtle"}`} />
              <span className="font-medium">{d.peptide_name}</span>
              <span className="text-fg-muted">{d.dose_mg} mg</span>
            </div>
            <span className="text-xs text-fg-subtle">
              {d.time_of_day === "morning" ? "AM" : d.time_of_day === "evening" ? "PM" : (d.time_of_day ?? "")}
            </span>
          </li>
        ))}
      </ul>
      {protocolLabel && (
        <p className="text-xs text-fg-subtle mt-3">On: {protocolLabel}</p>
      )}
    </div>
  );
}

function summarizeProtocols(
  protocols: { protocol_type: string | null; stacks: number | null; bpc_track: string | null; peptide_name: string }[]
): string {
  if (protocols.length === 0) return "";
  const powerCut = protocols.find((p) => p.protocol_type?.startsWith("power_cut"));
  if (powerCut) {
    const track = powerCut.bpc_track === "performance" ? "Performance" : "Foundation";
    const stacks = powerCut.stacks ?? 1;
    return `POWER CUT™ — ${track} · ${stacks} stack${stacks > 1 ? "s" : ""}`;
  }
  const names = Array.from(new Set(protocols.map((p) => p.peptide_name)));
  return names.join(", ");
}

function relativeDayLabel(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  const rel = diff === 1 ? "tomorrow" : diff <= 0 ? "today" : `in ${diff} days`;
  const date = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${date} · ${rel}`;
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
