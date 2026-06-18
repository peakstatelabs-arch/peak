"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PROGRAMS, getProgram, type Program } from "@/lib/programs";
import { generateProgramSchedule, isoDate, recommendedWeekdays } from "@/lib/workout";
import { cn } from "@/lib/utils";
import { CustomPlanWizard } from "./CustomPlanWizard";

const TONE: Record<string, string> = {
  "mens-12wk-gym": "from-sky-500/15 to-transparent border-sky-500/30",
  "mens-12wk-home": "from-blue-400/15 to-transparent border-blue-400/30",
  "womens-12wk-gym": "from-rose-400/15 to-transparent border-rose-400/30",
  "womens-12wk-home": "from-fuchsia-400/15 to-transparent border-fuchsia-400/30",
};

export function ProgramLibrary({
  activeProgram,
  onChanged,
}: {
  activeProgram: string | null;
  onChanged: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(activeProgram);
  const [confirming, setConfirming] = useState<Program | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-4">
      {/* AI Custom plan callout */}
      <button
        onClick={() => setShowCustom(true)}
        className="card w-full text-left bg-gradient-to-br from-accent/15 to-transparent border-accent/40 hover:border-accent/70 transition group"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="chip-accent text-[10px]">AI</span>
              <span className="text-xs uppercase tracking-wide text-accent font-semibold">Custom plan builder</span>
            </div>
            <h3 className="font-display text-lg font-semibold">Build me a plan</h3>
            <p className="text-sm text-fg-muted mt-1">
              Tell us your days, your time per session, your injuries. Claude tailors a 12-week recomp plan from the Peak State library to you.
            </p>
          </div>
          <span className="text-accent text-2xl group-hover:translate-x-1 transition">→</span>
        </div>
      </button>

      {/* 4 base programs */}
      <div className="grid gap-3 md:grid-cols-2">
        {PROGRAMS.map((p) => {
          const active = activeProgram === p.slug;
          return (
            <div
              key={p.slug}
              className={cn(
                "card bg-gradient-to-br",
                TONE[p.slug] ?? "from-bg-elev to-transparent",
                active && "ring-2 ring-accent/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <span className="chip capitalize">{p.audience}</span>
                  <span className="chip capitalize">{p.location}</span>
                  <span className="chip">{p.totalWeeks} wks</span>
                </div>
                {active && <span className="chip-accent">Active</span>}
              </div>
              <h3 className="font-display text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-fg-muted mt-1 leading-relaxed">{p.blurb}</p>
              <div className="mt-3 text-xs text-fg-subtle">
                <span className="font-medium text-fg">Equipment:</span> {p.equipment.join(" · ")}
              </div>
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
          onDone={() => { setConfirming(null); onChanged(); }}
        />
      )}

      {showCustom && (
        <CustomPlanWizard
          onCancel={() => setShowCustom(false)}
          onDone={() => { setShowCustom(false); onChanged(); }}
        />
      )}
    </div>
  );
}

function ProgramPreview({ program }: { program: Program }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const phase = program.phases[phaseIdx];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{program.name}</h3>
        <div className="flex gap-1 rounded-lg bg-bg-elev border border-border p-1">
          {program.phases.map((ph, i) => (
            <button
              key={ph.label}
              onClick={() => setPhaseIdx(i)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition",
                phaseIdx === i ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
              )}
            >
              {ph.label.split(" — ")[0]}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-fg-subtle mb-3">
        {phase.label} · {phase.weeks} weeks · {phase.workouts.length} sessions/week
      </p>
      <div className="space-y-4">
        {phase.workouts.map((wt) => (
          <div key={wt.label}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{wt.label}</h4>
              <span className="text-xs text-fg-subtle">{wt.focus}</span>
            </div>
            <ul className="text-sm divide-y divide-border border border-border rounded-lg bg-bg-elev">
              {wt.exercises.map((ex, i) => (
                <li key={i} className="flex justify-between gap-3 px-3 py-2">
                  <span className="min-w-0 truncate">
                    <span className="text-fg-subtle text-xs mr-2">{ex.code}</span>
                    {ex.name}
                  </span>
                  <span className="text-fg-muted text-xs flex-shrink-0">{ex.sets} × {ex.reps}</span>
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    const today = isoDate(new Date());
    await supabase.from("workout_sessions").delete()
      .eq("user_id", user.id).gte("scheduled_for", today).eq("completed", false);

    const schedule = generateProgramSchedule({
      program,
      startDate: new Date(startDate + "T00:00:00"),
    });
    const rows = schedule.map((s) => ({
      user_id: user.id,
      name: s.day_label,
      program_slug: s.program_slug,
      day_label: s.day_label,
      focus: s.focus,
      phase_label: s.phase_label,
      workout_index: s.workout_index,
      scheduled_for: s.scheduled_for,
      completed: false,
    }));
    const batch = 200;
    for (let i = 0; i < rows.length; i += batch) {
      const { error: e } = await supabase.from("workout_sessions").insert(rows.slice(i, i + batch));
      if (e) { setError(e.message); setSaving(false); return; }
    }
    await supabase.from("profiles")
      .update({ active_program: program.slug, active_program_started: startDate })
      .eq("id", user.id);
    setSaving(false);
    onDone();
  }

  const totalSessions = program.phases.reduce((a, ph) => a + ph.workouts.length * ph.weeks, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div className="w-full max-w-md card" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">Start {program.name}</h3>
        <p className="text-sm text-fg-muted mt-1">
          {program.totalWeeks} weeks. We'll lay every session onto your calendar with even spacing.
        </p>
        <div className="grid grid-cols-1 gap-3 mt-4">
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <p className="text-xs text-fg-subtle mt-1">
              We anchor on the Monday of the chosen week.
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-bg-elev border border-border p-3 mt-4 text-sm space-y-1">
          {program.phases.map((ph) => (
            <div key={ph.label} className="flex items-center justify-between">
              <span className="text-fg-muted">{ph.label}</span>
              <span className="text-xs text-fg-subtle">
                {ph.workouts.length} days/wk · {recommendedWeekdays(ph.workouts.length).map(dayName).join(" / ")}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="text-fg-muted">Total sessions</span>
            <span className="font-display text-lg text-accent font-semibold">{totalSessions}</span>
          </div>
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

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function dayName(n: number) { return DAYS[n - 1]; }

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const diff = (8 - day) % 7;
  d.setDate(d.getDate() + (diff === 0 ? 0 : diff));
  return d.toISOString().slice(0, 10);
}
