"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProgram, exerciseVideoUrl, type Exercise } from "@/lib/programs";
import { estimate1RM, bestE1RMByExercise, relativeDayLabel, workoutForSession } from "@/lib/workout";
import { cn } from "@/lib/utils";
import type { Session, WorkoutSet } from "./WorkoutsClient";

type Cell = {
  id: string | null;
  weight: string;
  reps: string;
  completed: boolean;
  isPr: boolean;
};

type Block = { letter: string; exercises: { ex: Exercise; idx: number }[] };

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
  const workout = program ? workoutForSession(program, session.day_label, session.phase_label) : undefined;

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

  // Group exercises by letter (A1+A2 = superset block)
  const blocks: Block[] = useMemo(() => {
    if (!workout) return [];
    const m = new Map<string, { ex: Exercise; idx: number }[]>();
    workout.exercises.forEach((ex, idx) => {
      const letter = ex.code.replace(/[0-9]/g, "") || "Z";
      if (!m.has(letter)) m.set(letter, []);
      m.get(letter)!.push({ ex, idx });
    });
    return Array.from(m.entries()).map(([letter, exercises]) => ({ letter, exercises }));
  }, [workout]);

  const [cells, setCells] = useState<Record<string, Cell>>(() => {
    const init: Record<string, Cell> = {};
    if (workout) {
      workout.exercises.forEach((ex, exIdx) => {
        const targetSets = parseSetsCount(ex.sets);
        const existing = allSets.filter((s) => s.session_id === session.id && s.exercise === ex.name);
        for (let n = 1; n <= targetSets; n++) {
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

  if (!workout) {
    return (
      <div className="space-y-4">
        <button onClick={onClose} className="btn-ghost text-sm">← Back</button>
        <div className="card">
          We couldn't load this session's workout. It may be from a deleted program.
        </div>
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

    if (cell.completed) {
      setCell(k, { completed: false, isPr: false });
      if (cell.id) await supabase.from("workout_sets").update({ completed: false, is_pr: false }).eq("id", cell.id);
      return;
    }

    const weight = cell.weight ? Number(cell.weight) : null;
    const reps = cell.reps ? Number(cell.reps) : null;

    let isPr = false;
    if (weight && reps) {
      const e1 = estimate1RM(weight, reps);
      const best = runningBest.current.get(ex.name) ?? 0;
      if (e1 > best) {
        isPr = true;
        runningBest.current.set(ex.name, e1);
        setPrToast(`New PR — ${ex.name}: ${e1} ${weightUnit} e1RM`);
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

    if (ex.restSec > 0) setRest({ left: ex.restSec, total: ex.restSec });
  }

  async function finishWorkout() {
    setFinishing(true);
    await supabase.from("workout_sessions")
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq("id", session.id);
    setFinishing(false);
    onChanged();
    onClose();
  }

  const totalSets = workout.exercises.reduce((a, ex) => a + parseSetsCount(ex.sets), 0);
  const doneSets = Object.values(cells).filter((c) => c.completed).length;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-4 pb-28">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="btn-ghost text-sm">← Back</button>
        {session.completed && <span className="chip-accent">Completed</span>}
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold">{workout.label}</h2>
        <p className="text-sm text-fg-muted">
          {workout.focus} · {session.phase_label ?? ""}{session.phase_label ? " · " : ""}{relativeDayLabel(session.scheduled_for)}
        </p>
      </div>

      <div className="card">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-fg-muted">{doneSets} / {totalSets} sets</span>
          <span className="font-medium text-accent">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div key={block.letter} className="card">
            {block.exercises.length > 1 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="chip-accent text-[10px]">Superset {block.letter}</span>
                <span className="text-xs text-fg-muted">Alternate {block.exercises.length} exercises</span>
              </div>
            )}
            <div className={cn(block.exercises.length > 1 && "space-y-4")}>
              {block.exercises.map(({ ex, idx }) => (
                <ExerciseBlock
                  key={idx}
                  ex={ex}
                  exIdx={idx}
                  cells={cells}
                  setCell={setCell}
                  toggleSet={toggleSet}
                  prevSet={lastByExercise.get(ex.name)}
                  bestE1RM={histBest.get(ex.name)}
                  weightUnit={weightUnit}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {!session.completed && (
        <button onClick={finishWorkout} disabled={finishing} className="btn-primary w-full">
          {finishing ? "Finishing…" : "Finish workout"}
        </button>
      )}

      {prToast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 rounded-full bg-amber-400 text-black text-sm font-semibold px-4 py-2 shadow-lg">
          🏆 {prToast}
        </div>
      )}

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

function ExerciseBlock({
  ex, exIdx, cells, setCell, toggleSet, prevSet, bestE1RM, weightUnit,
}: {
  ex: Exercise;
  exIdx: number;
  cells: Record<string, Cell>;
  setCell: (k: string, patch: Partial<Cell>) => void;
  toggleSet: (ex: Exercise, exIdx: number, setNo: number) => void;
  prevSet?: WorkoutSet;
  bestE1RM?: number;
  weightUnit: string;
}) {
  const targetSets = parseSetsCount(ex.sets);
  return (
    <div>
      <div className="mb-1">
        <div className="flex items-baseline gap-2">
          <span className="text-fg-subtle text-xs flex-shrink-0">{ex.code}</span>
          <h3 className="font-semibold leading-snug">{ex.name}</h3>
        </div>
        <div className="text-xs text-fg-muted mt-0.5">
          {ex.sets} × {ex.reps}{ex.restSec > 0 ? ` · rest ${ex.restSec}s` : " · no rest"}
        </div>
        <a
          href={exerciseVideoUrl(ex)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-1 text-xs text-accent hover:underline"
          title="Watch a demo"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
          </svg>
          Watch demo
        </a>
      </div>
      {ex.note && <p className="text-xs text-fg-subtle italic mb-2">{ex.note}</p>}
      {bestE1RM ? <span className="chip text-[10px] mb-2 inline-block">Best {bestE1RM} {weightUnit} e1RM</span> : null}
      {prevSet && (
        <p className="text-xs text-fg-subtle mb-2">
          Last: {prevSet.weight_lb ?? "—"} {weightUnit} × {prevSet.reps ?? "—"}
        </p>
      )}

      <div className="space-y-1.5">
        <div className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 text-[10px] uppercase tracking-wide text-fg-subtle px-1">
          <span>Set</span>
          <span>{weightUnit}</span>
          <span>Reps</span>
          <span></span>
        </div>
        {Array.from({ length: targetSets }, (_, i) => i + 1).map((setNo) => {
          const k = keyOf(exIdx, setNo);
          const cell = cells[k];
          if (!cell) return null;
          return (
            <div key={setNo} className="grid grid-cols-[2rem_1fr_1fr_2.5rem] gap-2 items-center">
              <span className="text-sm text-fg-muted text-center">{setNo}</span>
              <input
                type="number"
                inputMode="decimal"
                className={cn("input py-2 text-center", cell.completed && "opacity-60")}
                placeholder={prevSet?.weight_lb != null ? String(prevSet.weight_lb) : "0"}
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
}

/** Parse "5", "4 sets", "6 sets of 6,6,4,4,2,2" → numeric set count. */
function parseSetsCount(sets: string): number {
  const m = sets.match(/(\d+)/);
  if (!m) return 3;
  return Number(m[1]);
}
