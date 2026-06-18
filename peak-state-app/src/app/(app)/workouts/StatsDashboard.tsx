"use client";

import { useMemo } from "react";
import { getProgram, GOAL_LABEL } from "@/lib/programs";
import { totalVolume, bestE1RMByExercise, fmtVolume } from "@/lib/workout";
import type { Session, WorkoutSet } from "./WorkoutsClient";

export function StatsDashboard({
  sessions,
  sets,
  activeProgram,
}: {
  sessions: Session[];
  sets: WorkoutSet[];
  activeProgram: string | null;
}) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgoISO = new Date(now.getTime() - 7 * 86400000).toISOString();
    const todayISO = now.toISOString().slice(0, 10);

    const weekSets = sets.filter((s) => s.created_at >= weekAgoISO && s.completed);
    const weekVolume = totalVolume(weekSets);

    // sessions completed in last 7 days
    const startWeek = new Date(now.getTime() - 7 * 86400000).toISOString().slice(0, 10);
    const sessionsThisWeek = sessions.filter(
      (s) => s.completed && s.scheduled_for >= startWeek && s.scheduled_for <= todayISO
    ).length;

    // weekly streak: consecutive prior weeks (incl. this) with >=1 completed session
    let streak = 0;
    for (let w = 0; w < 26; w++) {
      const end = new Date(now.getTime() - w * 7 * 86400000);
      const start = new Date(end.getTime() - 7 * 86400000);
      const startS = start.toISOString().slice(0, 10);
      const endS = end.toISOString().slice(0, 10);
      const any = sessions.some((s) => s.completed && s.scheduled_for > startS && s.scheduled_for <= endS);
      if (any) streak++;
      else if (w > 0) break;
      else break;
    }

    const prs = sets.filter((s) => s.is_pr).length;
    const bests = bestE1RMByExercise(sets.filter((s) => s.completed));
    const topLift = [...bests.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;

    return { weekVolume, sessionsThisWeek, streak, prs, topLift };
  }, [sessions, sets]);

  const program = activeProgram ? getProgram(activeProgram) : undefined;

  return (
    <section className="space-y-3">
      {program && (
        <div className="card flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-fg-subtle">Current program</div>
            <div className="font-display text-lg font-semibold mt-0.5">{program.name}</div>
            <div className="text-xs text-fg-muted mt-0.5">
              {GOAL_LABEL[program.goal]} · {program.daysPerWeek} days/wk · {program.level}
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center">
            <span className="text-accent text-lg font-bold">{program.daysPerWeek}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="This week" value={`${stats.sessionsThisWeek}`} unit="sessions" />
        <Stat label="Weekly volume" value={fmtVolume(stats.weekVolume)} unit="lb lifted" accent />
        <Stat label="Week streak" value={`${stats.streak}`} unit={stats.streak === 1 ? "week" : "weeks"} />
        <Stat label="PRs logged" value={`${stats.prs}`} unit="all time" />
      </div>

      {stats.topLift && (
        <div className="card flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-fg-subtle">Top estimated 1RM</div>
            <div className="font-medium mt-0.5">{stats.topLift[0]}</div>
          </div>
          <div className="font-display text-2xl font-semibold text-accent">
            {stats.topLift[1]} <span className="text-sm text-fg-muted">lb</span>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, unit, accent }: { label: string; value: string; unit: string; accent?: boolean }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`font-display text-2xl font-semibold mt-1 ${accent ? "text-accent" : ""}`}>{value}</div>
      <div className="text-xs text-fg-subtle mt-0.5">{unit}</div>
    </div>
  );
}
