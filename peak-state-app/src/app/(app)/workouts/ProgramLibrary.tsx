"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PROGRAMS, getProgram, GOAL_LABEL, type Program } from "@/lib/programs";
import { generateProgramSchedule, isoDate } from "@/lib/workout";
import { cn } from "@/lib/utils";

export function ProgramLibrary({
  activeProgram,
  onChanged,
}: {
  activeProgram: string | null;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(activeProgram);
  const [confirming, setConfirming] = useState<Program | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {PROGRAMS.map((p) => {
          const active = activeProgram === p.slug;
          return (
            <div key={p.slug} className={cn("card", active && "border-accent/50")}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <span className="chip">{GOAL_LABEL[p.goal]}</span>
                  <span className="chip">{p.daysPerWeek} days/wk</span>
                </div>
                {active && <span className="chip-accent">Active</span>}
              </div>
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-fg-muted mt-1">{p.blurb}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setExpanded(expanded === p.slug ? null : p.slug)}
                  className="btn-secondary text-xs flex-1"
                >
                  {expanded === p.slug ? "Hide" : "Preview"}
                </button>
                <button onClick={() => setConfirming(p)} className="btn-primary text-xs flex-1">
                  {active ? "Reschedule" : "Start program"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {expanded && <ProgramPreview program={getProgram(expanded)!} />}

      {confirming && (
        <StartProgramModal
          program={confirming}
          onCancel={() => setConfirming(null)}
          onDone={() => {
            setConfirming(null);
            onChanged();
          }}
        />
      )}
    </div>
  );
}

function ProgramPreview({ program }: { program: Program }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{program.name} — weekly split</h3>
      <div className="space-y-4">
        {program.days.map((d) => (
          <div key={d.label}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{d.label}</h4>
              <span className="text-xs text-fg-subtle">{d.focus}</span>
            </div>
            <ul className="text-sm divide-y divide-border border border-border rounded-lg bg-bg-elev">
              {d.exercises.map((ex, i) => (
                <li key={i} className="flex justify-between px-3 py-2">
                  <span>{ex.name}</span>
                  <span className="text-fg-muted">{ex.sets} × {ex.reps}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function StartProgramModal({
  program,
  onCancel,
  onDone,
}: {
  program: Program;
  onCancel: () => void;
  onDone: () => void;
}) {
  const supabase = createClient();
  const [startDate, setStartDate] = useState(nextMondayISO());
  const [weeks, setWeeks] = useState(program.weeks);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    // Clear future incomplete sessions before re-scheduling.
    const today = isoDate(new Date());
    await supabase
      .from("workout_sessions")
      .delete()
      .eq("user_id", user.id)
      .gte("scheduled_for", today)
      .eq("completed", false);

    const schedule = generateProgramSchedule({
      program,
      startDate: new Date(startDate + "T00:00:00"),
      weeks,
    });

    const rows = schedule.map((s) => ({
      user_id: user.id,
      name: s.day_label,
      program_slug: s.program_slug,
      day_label: s.day_label,
      focus: s.focus,
      scheduled_for: s.scheduled_for,
      completed: false,
    }));

    const batch = 200;
    for (let i = 0; i < rows.length; i += batch) {
      const { error: e } = await supabase.from("workout_sessions").insert(rows.slice(i, i + batch));
      if (e) { setError(e.message); setSaving(false); return; }
    }

    await supabase
      .from("profiles")
      .update({ active_program: program.slug, active_program_started: startDate })
      .eq("id", user.id);

    setSaving(false);
    onDone();
  }

  const totalSessions = program.days.length * weeks;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">Start {program.name}</h3>
        <p className="text-sm text-fg-muted mt-1">
          We'll lay {program.daysPerWeek} sessions/week onto your calendar.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="label">Weeks</label>
            <input type="number" className="input" value={weeks} min={1} max={24} onChange={(e) => setWeeks(Number(e.target.value))} />
          </div>
        </div>
        <div className="rounded-lg bg-bg-elev border border-border p-3 mt-4 text-sm flex items-center justify-between">
          <span className="text-fg-muted">Total sessions scheduled</span>
          <span className="font-display text-lg text-accent font-semibold">{totalSessions}</span>
        </div>
        {error && <p className="text-danger text-sm mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          <button onClick={start} disabled={saving} className="btn-primary flex-1">
            {saving ? "Scheduling…" : "Schedule it"}
          </button>
        </div>
      </div>
    </div>
  );
}

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const diff = (8 - day) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 0 : diff));
  return d.toISOString().slice(0, 10);
}
