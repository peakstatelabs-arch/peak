import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { computeClientRows, formatRelative, type PillarKey } from "@/lib/admin/compliance";
import { MessageClientForm } from "./MessageClientForm";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = createAdminClient();
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, role, active_program, active_program_started, nutrition_targets, metabolic_type, goal_weight_lb, created_at"
    )
    .eq("id", id)
    .single();

  if (!profile || profile.role !== "client") notFound();

  const { data: { user: authUser } } = await admin.auth.admin.getUserById(id);
  const email = authUser?.email ?? null;

  const [rows] = await Promise.all([
    computeClientRows(admin, {
      profiles: [
        {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          active_program: profile.active_program,
          active_program_started: profile.active_program_started,
          nutrition_targets: profile.nutrition_targets,
        },
      ],
      emailById: new Map([[id, email ?? ""]]),
      windowDays: 7,
    }),
  ]);
  const row = rows[0];

  // Recent activity blocks (last 30 days)
  const since30 = isoDaysAgo(30);
  const since90 = isoDaysAgo(90);

  const [
    { data: recentDoses },
    { data: recentSessions },
    { data: recentMeals },
    { data: weightLogs },
    { data: checkins },
    { count: deviceCount },
  ] = await Promise.all([
    admin
      .from("peptide_doses")
      .select("id, peptide_name, dose_mg, scheduled_for, time_of_day, taken, taken_at")
      .eq("user_id", id)
      .gte("scheduled_for", since30)
      .order("scheduled_for", { ascending: false })
      .limit(40),
    admin
      .from("workout_sessions")
      .select("id, name, focus, scheduled_for, completed, completed_at, phase_label")
      .eq("user_id", id)
      .gte("scheduled_for", since30)
      .order("scheduled_for", { ascending: false })
      .limit(30),
    admin
      .from("meal_logs")
      .select("id, logged_for, meal_type, description, kcal, protein_g, carbs_g, fat_g, created_at")
      .eq("user_id", id)
      .gte("logged_for", since30)
      .order("logged_for", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(60),
    admin
      .from("body_weight_logs")
      .select("logged_for, weight_lb")
      .eq("user_id", id)
      .gte("logged_for", since90)
      .order("logged_for", { ascending: true }),
    admin
      .from("weekly_checkins")
      .select("id, week_key, weight_lb, energy, sleep, mood, notes, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(12),
    admin
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", id),
  ]);

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || email || "Client";
  const mealsByDay = groupMealsByDay(recentMeals ?? []);

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/dashboard" className="text-sm text-fg-muted hover:text-fg">← Back to dashboard</Link>
      </div>

      <PageHeader
        title={name}
        description={email || ""}
        action={
          <MessageClientForm clientId={id} clientName={name} deviceCount={deviceCount ?? 0} />
        }
      />

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Overall (7d)" value={row.overallPct === null ? "—" : `${row.overallPct}%`} />
        <Stat
          label="Active protocol"
          value={row.peptideProtocolName || "—"}
        />
        <Stat
          label="Program"
          value={
            row.programSlug
              ? `${row.programSlug}${row.programWeek ? ` · Wk ${row.programWeek}` : ""}`
              : "—"
          }
        />
        <Stat label="Last activity" value={formatRelative(row.lastActivity)} />
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <PillarBox label="Peptide" pkey="peptide" row={row} />
        <PillarBox label="Workout" pkey="workout" row={row} />
        <PillarBox label="Nutrition" pkey="nutrition" row={row} />
        <PillarBox label="Check-in" pkey="checkin" row={row} />
      </section>

      {row.flags.length > 0 && (
        <section className="card mb-6 border-danger/40">
          <h3 className="font-semibold mb-2 text-danger">Red flags</h3>
          <div className="flex flex-wrap gap-2">
            {row.flags.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 rounded-full bg-danger/10 border border-danger/30 text-danger px-2.5 py-1 text-xs font-medium"
              >
                {f.label}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="card">
          <h3 className="font-semibold mb-3">Recent doses (30d)</h3>
          {(!recentDoses || recentDoses.length === 0) ? (
            <p className="text-sm text-fg-subtle">No scheduled doses.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {recentDoses.map((d) => (
                <li key={d.id} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{d.peptide_name} · {Number(d.dose_mg)} mg</div>
                    <div className="text-xs text-fg-subtle">
                      {d.scheduled_for}{d.time_of_day ? ` · ${d.time_of_day}` : ""}
                    </div>
                  </div>
                  {d.taken ? (
                    <span className="chip-accent">Taken</span>
                  ) : isPast(d.scheduled_for) ? (
                    <span className="inline-flex items-center rounded-full bg-danger/10 border border-danger/30 text-danger px-2 py-0.5 text-xs">Missed</span>
                  ) : (
                    <span className="chip">Upcoming</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h3 className="font-semibold mb-3">Recent workouts (30d)</h3>
          {(!recentSessions || recentSessions.length === 0) ? (
            <p className="text-sm text-fg-subtle">No workouts scheduled.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {recentSessions.map((s) => (
                <li key={s.id} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-fg-subtle">
                      {s.scheduled_for}
                      {s.focus ? ` · ${s.focus}` : ""}
                      {s.phase_label ? ` · ${s.phase_label}` : ""}
                    </div>
                  </div>
                  {s.completed ? (
                    <span className="chip-accent">Done</span>
                  ) : isPast(s.scheduled_for) ? (
                    <span className="inline-flex items-center rounded-full bg-danger/10 border border-danger/30 text-danger px-2 py-0.5 text-xs">Missed</span>
                  ) : (
                    <span className="chip">Upcoming</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card lg:col-span-2">
          <h3 className="font-semibold mb-3">Recent meals (30d)</h3>
          {mealsByDay.length === 0 ? (
            <p className="text-sm text-fg-subtle">No meals logged.</p>
          ) : (
            <div className="space-y-4 text-sm">
              {mealsByDay.slice(0, 10).map((day) => (
                <div key={day.day}>
                  <div className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-1">
                    {day.day} · {day.totals.kcal} kcal · P{day.totals.protein_g} / C{day.totals.carbs_g} / F{day.totals.fat_g}
                  </div>
                  <ul className="divide-y divide-border">
                    {day.meals.map((m) => (
                      <li key={m.id} className="py-1.5 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="text-fg-subtle text-xs mr-2">{m.meal_type}</span>
                          {m.description}
                        </div>
                        <span className="text-xs text-fg-muted whitespace-nowrap">{m.kcal} kcal</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <h3 className="font-semibold mb-3">Weight (90d)</h3>
          <WeightSparkline
            points={(weightLogs ?? []).map((w) => ({ x: w.logged_for, y: Number(w.weight_lb) }))}
            goal={profile.goal_weight_lb ? Number(profile.goal_weight_lb) : null}
          />
        </section>

        <section className="card">
          <h3 className="font-semibold mb-3">Check-in history</h3>
          {(!checkins || checkins.length === 0) ? (
            <p className="text-sm text-fg-subtle">No check-ins yet.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {checkins.map((c) => (
                <li key={c.id} className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{c.week_key}</div>
                    <div className="text-xs text-fg-subtle">{new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {c.weight_lb ? `${c.weight_lb} lb · ` : ""}
                    Energy {c.energy ?? "—"} · Sleep {c.sleep ?? "—"} · Mood {c.mood ?? "—"}
                  </div>
                  {c.notes && <div className="text-xs text-fg-muted mt-1 italic">&ldquo;{c.notes}&rdquo;</div>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function isoDaysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}

function isPast(dateIso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return dateIso < today;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className="mt-1 text-base font-semibold text-fg truncate">{value}</div>
    </div>
  );
}

function PillarBox({
  label,
  pkey,
  row,
}: {
  label: string;
  pkey: PillarKey;
  row: { pillars: Record<PillarKey, { active: boolean; pct: number | null; completed: number; scheduled: number }> };
}) {
  const s = row.pillars[pkey];
  if (!s.active) {
    return (
      <div className="card opacity-60">
        <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
        <div className="mt-1 text-base text-fg-subtle">Not tracked</div>
      </div>
    );
  }
  const tone =
    s.pct === null ? "text-fg-subtle"
    : s.pct >= 80 ? "text-accent"
    : s.pct >= 60 ? "text-fg"
    : "text-danger";
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`mt-1 text-2xl font-display font-semibold ${tone}`}>
        {s.pct === null ? "—" : `${s.pct}%`}
      </div>
      <div className="text-xs text-fg-subtle">{s.completed} / {s.scheduled}</div>
    </div>
  );
}

type Meal = {
  id: string;
  logged_for: string;
  meal_type: string;
  description: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

function groupMealsByDay(meals: Meal[]) {
  const byDay = new Map<string, Meal[]>();
  for (const m of meals) {
    const arr = byDay.get(m.logged_for) ?? [];
    arr.push(m);
    byDay.set(m.logged_for, arr);
  }
  return Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([day, list]) => ({
      day,
      meals: list,
      totals: list.reduce(
        (acc, m) => ({
          kcal: acc.kcal + m.kcal,
          protein_g: acc.protein_g + m.protein_g,
          carbs_g: acc.carbs_g + m.carbs_g,
          fat_g: acc.fat_g + m.fat_g,
        }),
        { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
      ),
    }));
}

function WeightSparkline({
  points,
  goal,
}: {
  points: { x: string; y: number }[];
  goal: number | null;
}) {
  if (points.length === 0) return <p className="text-sm text-fg-subtle">No weight logs yet.</p>;
  const W = 600;
  const H = 160;
  const pad = 24;
  const ys = points.map((p) => p.y);
  const goalArr = goal ? [goal] : [];
  const minY = Math.min(...ys, ...goalArr) - 1;
  const maxY = Math.max(...ys, ...goalArr) + 1;
  const range = Math.max(maxY - minY, 1);
  const stepX = points.length > 1 ? (W - pad * 2) / (points.length - 1) : 0;
  const xy = (i: number, v: number) => {
    const x = pad + i * stepX;
    const y = H - pad - ((v - minY) / range) * (H - pad * 2);
    return [x, y] as const;
  };
  const path = points
    .map((p, i) => {
      const [x, y] = xy(i, p.y);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const first = points[0].y;
  const last = points[points.length - 1].y;
  const delta = last - first;

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-2xl font-display font-semibold">{last.toFixed(1)} lb</span>
        <span
          className={
            "text-sm font-medium " +
            (delta > 0 ? "text-amber-500" : delta < 0 ? "text-accent" : "text-fg-muted")
          }
        >
          {delta > 0 ? "+" : ""}
          {delta.toFixed(1)} lb (90d)
        </span>
        {goal && (
          <span className="text-xs text-fg-subtle ml-auto">Goal: {goal} lb</span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
        {goal && (
          <line
            x1={pad}
            x2={W - pad}
            y1={xy(0, goal)[1]}
            y2={xy(0, goal)[1]}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeDasharray="4 4"
          />
        )}
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} className="text-accent" />
        {points.map((p, i) => {
          const [x, y] = xy(i, p.y);
          return <circle key={i} cx={x} cy={y} r={2.5} className="fill-accent" />;
        })}
      </svg>
    </div>
  );
}
