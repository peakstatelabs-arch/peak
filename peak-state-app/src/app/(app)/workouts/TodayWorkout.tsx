"use client";

import { getProgram } from "@/lib/programs";
import { relativeDayLabel, isoDate } from "@/lib/workout";
import type { Session } from "./WorkoutsClient";

export function TodayWorkout({
  sessions,
  onOpen,
  hasProgram,
  onBrowse,
}: {
  sessions: Session[];
  onOpen: (id: string) => void;
  hasProgram: boolean;
  onBrowse: () => void;
}) {
  const today = isoDate(new Date());
  const todays = sessions.filter((s) => s.scheduled_for === today);
  const upcoming = sessions
    .filter((s) => s.scheduled_for > today && !s.completed)
    .slice(0, 5);

  if (!hasProgram) {
    return (
      <div className="card text-center py-10">
        <h3 className="font-semibold">No program yet</h3>
        <p className="text-sm text-fg-muted mt-1 mb-4">
          Pick a program and we'll schedule every session onto your calendar.
        </p>
        <button onClick={onBrowse} className="btn-primary">Browse programs</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-semibold mb-3">Today</h3>
        {todays.length === 0 ? (
          <div className="card flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-accent flex-shrink-0" />
            <span className="text-sm text-fg-muted">Rest day — recover and refuel.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {todays.map((s) => (
              <SessionCard key={s.id} session={s} onOpen={onOpen} highlight />
            ))}
          </div>
        )}
      </div>

      {upcoming.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Coming up</h3>
          <div className="space-y-2">
            {upcoming.map((s) => (
              <SessionCard key={s.id} session={s} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  onOpen,
  highlight,
}: {
  session: Session;
  onOpen: (id: string) => void;
  highlight?: boolean;
}) {
  const program = session.program_slug ? getProgram(session.program_slug) : undefined;
  const day = program?.days.find((d) => d.label === session.day_label);
  const exCount = day?.exercises.length ?? 0;

  return (
    <button
      onClick={() => onOpen(session.id)}
      className={`card w-full text-left flex items-center justify-between gap-3 hover:border-accent/40 transition ${
        highlight ? "border-accent/40 bg-accent/5" : ""
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold">{session.day_label ?? session.name}</span>
          {session.completed && <span className="chip-accent text-[10px]">Done</span>}
        </div>
        <div className="text-xs text-fg-muted mt-0.5 truncate">
          {session.focus ?? ""}{exCount ? ` · ${exCount} exercises` : ""}
        </div>
        <div className="text-xs text-fg-subtle mt-0.5">{relativeDayLabel(session.scheduled_for)}</div>
      </div>
      <span className="text-accent text-sm font-medium flex-shrink-0">
        {session.completed ? "Review" : "Start →"}
      </span>
    </button>
  );
}
