"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProgram, type Exercise } from "@/lib/programs";
import { estimate1RM, bestE1RMByExercise, relativeDayLabel } from "@/lib/workout";
import { cn } from "@/lib/utils";
import type { Session, WorkoutSet } from "./WorkoutsClient";

type Cell = {
  id: string | null;
  weight: string;
  reps: string;
  completed: boolean;
  isPr: boolean;
};

const keyOf = (exIdx: number, setNo: number) => `${exIdx}-${setNo}`;

export function SessionLogger({
  session,
  allSets,
  weightUnit,
  onClose,
  onChanged,
}: {
  session: Session;
  allSets: WorkoutSet[];
  weightUnit: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const supabase = createClient();
  const program = session.program_slug ? getProgram(session.program_slug) : undefined;
  const day = program?.days.find((d) => d.label === session.day_label);

  // Historical bests (exclude this session) for PR detection + "previous" reference.
  const histBest = useMemo(
    () => bestE1RMByExercise(allSets.filter((s) => s.session_id !== session.id && s.completed)),
    [allSets, session.id]
  );
  const lastByExercise = useMemo(() => {
    const m = new Map<string, WorkoutSet>();
    for (const s of allSets) {
      if (s.session_id === session.id || !s.completed) continue;
      const prev = m.get(s.exercise);
      if (!prev || s.created_at > prev.created_at) m.set(s.exercise, s);
    }
    return m;
  }, [allSets, session.id]);

  // Initialize cells from any sets already logged for this session.
  const [cells, setCells] = useState<Record<string, Cell>>(() => {
    const init: Record<string, Cell> = {};
    if (day) {
      day.exercises.forEach((ex, exIdx) => {
        const existing = allSets.filter((s) => s.session_id === session.id && s.exercise === ex.name);
        for (let n = 1; n <= ex.sets; n++) {
          const row = existing.find((s) => s.set_number === n);
          init[keyOf(exIdx, n)] = {
            id: row?.id ?? null,
            weight: row?.weight_lb != null ? String(row.weight_lb) : "",
            reps: row?.reps != null ? String(row.reps) : "",
            completed: row?.completed ?? false,
            isPr: row?.is_pr ?? false,
          };
        }
      });
    }
    return init;
  });

  const runningBest = useRef<Map<string, number>>(new Map(histBest));
  const [rest, setRest] = useState<{ left: number; total: number } | null>(null);
  const [prToast, setPrToast] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);

  // Rest timer countdown.
  useEffect(() => {
    if (!rest) return;
    if (rest.left <= 0) {
      setRest(null);
      try { navigator.vibrate?.(200); } catch {}
      return;
    }
    const t = setTimeout(() => setRest((r) => (r ? { ...r, left: r.left - 1 } : null)), 1000);
    return () => clearTimeout(t);
  }, [rest]);

  if (!day) {
    return (
      <div className="space-y-4">
        <button onClick={onClose} className="btn-ghost text-sm">← Back</button>
        <div className="card">This session's program could not be loaded.</div>
      </div>
    );
  }

  function setCell(k: string, patch: Partial<Cell>) {
    setCells((c) => ({ ...c, [k]: { ...c[k], ...patch } }));
  }

  async function toggleSet(ex: Exercise, exIdx: number, setNo: number) {
    const k = keyOf(exIdx, setNo);
    const cell = cells[k];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Un-complete: just flip the flag.
    if (cell.completed) {
      setCell(k, { completed: false, isPr: false });
      if (cell.id) await supabase.from("workout_sets").update({ completed: false, is_pr: false }).eq("id", cell.id);
      return;
    }

    const weight = cell.weight ? Number(cell.weight) : null;
    const reps = cell.reps ? Number(cell.reps) : null;

    // PR detection
    let isPr = false;
    if (weight && reps) {
      const e1 = estimate1RM(weight, reps);
      const best = runningBest.current.get(ex.name) ?? 0;
      if (e1 > best) {
        isPr = true;
        runningBest.current.set(ex.name, e1);
        setPrToast(`New PR — ${ex.name}: ${e1} lb e1RM`);
        try { navigator.vibrate?.([60, 40, 120]); } catch {}
        setTimeout(() => setPrToast(null), 3500);
      }
    }

    const payload = {
      user_id: user.id,
      session_id: session.id,
      exercise: ex.name,
      set_number: setNo,
      weight_lb: weight,
      reps,
      target_reps: ex.reps,
      completed: true,
      is_pr: isPr,
    };

    if (cell.id) {
      await supabase.from("workout_sets").update(payload).eq("id", cell.id);
      setCell(k, { completed: true, isPr });
    } else {
      const { data } = await supabase.from("workout_sets").insert(payload).select("id").single();
      setCell(k, { completed: true, isPr, id: data?.id ?? null });
    }

    // Start rest timer.
    if (ex.restSec) setRest({ left: ex.restSec, total: ex.restSec });
  }

  async function finishWorkout() {
    setFinishing(true);
    await supabase
      .from("workout_sessions")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", session.id);
    setFinishing(false);
    onChanged();
    onClose();
  }

  const totalSets = day.exercises.reduce((a, ex) => a + ex.sets, 0);
  const doneSets = Object.values(cells).filter((c) => c.completed).length;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="btn-ghost text-sm">← Back</button>
        {session.completed && <span className="chip-accent">Completed</span>}
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">{day.label}</h2>
        <p className="text-sm text-fg-muted">{day.focus} · {relativeDayLabel(session.scheduled_for)}</p>
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-fg-muted">{doneSets} / {totalSets} sets</span>
          <span className="font-medium text-accent">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {day.exercises.map((ex, exIdx) => {
          const prev = lastByExercise.get(ex.name);
          const best = histBest.get(ex.name);
          return (
            <div key={exIdx} className="card">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <h3 className="font-semibold">{ex.name}</h3>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {ex.sets} × {ex.reps}{ex.muscle ? ` · ${ex.muscle}` : ""}
                  </div>
                </div>
                {best ? <span className="chip text-[10px]">Best {best} lb e1RM</span> : null}
              </div>
              {ex.cue && <p className="text-xs text-fg-subtle italic mb-2">{ex.cue}</p>}
              {prev && (
                <p className="text-xs text-fg-subtle mb-2">
                  Last time: {prev.weight_lb ?? "—"} {weightUnit} × {prev.reps ?? "—"}
                </p>
              )}

              <div className="space-y-1.5">
                <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-[10px] uppercase tracking-wide text-fg-subtle px-1">
                  <span>Set</span>
                  <span>{weightUnit}</span>
                  <span>Reps</span>
                  <span></span>
                </div>
                {Array.from({ length: ex.sets }, (_, i) => i + 1).map((setNo) => {
                  const k = keyOf(exIdx, setNo);
                  const cell = cells[k];
                  return (
                    <div key={setNo} className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center">
                      <span className="text-sm text-fg-muted text-center">{setNo}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className={cn("input py-2 text-center", cell.completed && "opacity-60")}
                        placeholder={prev?.weight_lb != null ? String(prev.weight_lb) : "0"}
                        value={cell.weight}
                        onChange={(e) => setCell(k, { weight: e.target.value })}
                      />
                      <input
                        type="number"
                        inputMode="numeric"
                        className={cn("input py-2 text-center", cell.completed && "opacity-60")}
                        placeholder={ex.reps}
                        value={cell.reps}
                        onChange={(e) => setCell(k, { reps: e.target.value })}
                      />
                      <button
                        onClick={() => toggleSet(ex, exIdx, setNo)}
                        className={cn(
                          "h-9 w-9 rounded-lg border-2 flex items-center justify-center transition relative",
                          cell.completed ? "border-accent bg-accent text-accent-fg" : "border-border hover:border-accent/50"
                        )}
                        aria-label={cell.completed ? "Mark set incomplete" : "Complete set"}
                      >
                        {cell.completed ? "✓" : ""}
                        {cell.isPr && (
                          <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-amber-400 text-black font-bold rounded-full px-1">PR</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!session.completed && (
        <button onClick={finishWorkout} disabled={finishing} className="btn-primary w-full">
          {finishing ? "Finishing…" : "Finish workout"}
        </button>
      )}

      {/* PR toast */}
      {prToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 rounded-full bg-amber-400 text-black text-sm font-semibold px-4 py-2 shadow-lg">
          🏆 {prToast}
        </div>
      )}

      {/* Rest timer */}
      {rest && (
        <div className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm">
          <div className="rounded-xl border border-accent/40 bg-bg-card shadow-xl p-3 flex items-center gap-3">
            <div className="font-display text-2xl font-semibold text-accent tabular-nums w-16 text-center">
              {Math.floor(rest.left / 60)}:{String(rest.left % 60).padStart(2, "0")}
            </div>
            <div className="flex-1 text-xs text-fg-muted">Rest</div>
            <button onClick={() => setRest((r) => (r ? { ...r, left: r.left + 15 } : null))} className="btn-secondary text-xs px-3 py-1.5">
              +15s
            </button>
            <button onClick={() => setRest(null)} className="btn-ghost text-xs px-3 py-1.5">Skip</button>
          </div>
        </div>
      )}
    </div>
  );
}
