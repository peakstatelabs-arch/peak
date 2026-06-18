"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StatsDashboard } from "./StatsDashboard";
import { ProgramLibrary } from "./ProgramLibrary";
import { WorkoutCalendar } from "./WorkoutCalendar";
import { SessionLogger } from "./SessionLogger";
import { TodayWorkout } from "./TodayWorkout";

export type Session = {
  id: string;
  name: string;
  program_slug: string | null;
  day_label: string | null;
  focus: string | null;
  phase_label: string | null;
  workout_index: number | null;
  scheduled_for: string;
  completed: boolean;
  completed_at: string | null;
  notes: string | null;
};

export type WorkoutSet = {
  id: string;
  session_id: string | null;
  exercise: string;
  set_number: number;
  weight_lb: number | null;
  reps: number | null;
  rpe: number | null;
  completed: boolean;
  is_pr: boolean;
  created_at: string;
};

type Tab = "today" | "calendar" | "programs";

export function WorkoutsClient({
  sessions,
  sets,
  activeProgram,
  activeStarted,
  weightUnit,
}: {
  sessions: Session[];
  sets: WorkoutSet[];
  activeProgram: string | null;
  activeStarted: string | null;
  weightUnit: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("today");
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);

  const refresh = () => router.refresh();

  const openSession = useMemo(
    () => sessions.find((s) => s.id === openSessionId) ?? null,
    [sessions, openSessionId]
  );

  if (openSession) {
    return (
      <SessionLogger
        session={openSession}
        allSets={sets}
        weightUnit={weightUnit}
        onClose={() => setOpenSessionId(null)}
        onChanged={refresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      <StatsDashboard sessions={sessions} sets={sets} activeProgram={activeProgram} />

      <div className="flex gap-1 rounded-lg bg-bg-elev border border-border p-1">
        {([
          ["today", "Today"],
          ["calendar", "Calendar"],
          ["programs", "Programs"],
        ] as [Tab, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "flex-1 rounded-md py-2 text-sm font-medium transition",
              tab === value ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <TodayWorkout
          sessions={sessions}
          onOpen={(id) => setOpenSessionId(id)}
          hasProgram={!!activeProgram}
          onBrowse={() => setTab("programs")}
        />
      )}
      {tab === "calendar" && (
        <WorkoutCalendar sessions={sessions} onOpen={(id) => setOpenSessionId(id)} />
      )}
      {tab === "programs" && (
        <ProgramLibrary activeProgram={activeProgram} onChanged={refresh} />
      )}
    </div>
  );
}
