"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getProgram } from "@/lib/programs";
import { isoDate, workoutForSession } from "@/lib/workout";
import type { Session } from "./WorkoutsClient";

export function WorkoutCalendar({
  sessions,
  onOpen,
}: {
  sessions: Session[];
  onOpen: (id: string) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState<string | null>(isoDate(new Date()));

  const byDay = useMemo(() => {
    const m = new Map<string, Session[]>();
    for (const s of sessions) {
      const arr = m.get(s.scheduled_for) ?? [];
      arr.push(s);
      m.set(s.scheduled_for, arr);
    }
    return m;
  }, [sessions]);

  const grid = useMemo(() => buildGrid(cursor), [cursor]);
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedSessions = selected ? byDay.get(selected) ?? [] : [];

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold">Calendar</h2>
          <p className="text-xs text-fg-subtle mt-0.5 lg:hidden">Next 7 days</p>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={() => shift(cursor, setCursor, -1)} className="btn-ghost text-sm px-2 py-1">←</button>
          <span className="text-sm font-medium w-32 text-center">{monthLabel}</span>
          <button onClick={() => shift(cursor, setCursor, 1)} className="btn-ghost text-sm px-2 py-1">→</button>
        </div>
      </div>

      {/* Desktop: month grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wide text-fg-subtle mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-center py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            if (!cell) return <div key={i} className="min-h-[60px]" />;
            const iso = isoDate(cell);
            const day = byDay.get(iso) ?? [];
            const isToday = iso === isoDate(new Date());
            const isSelected = iso === selected;
            const inMonth = cell.getMonth() === cursor.getMonth();
            const hasWorkout = day.length > 0;
            const allDone = hasWorkout && day.every((s) => s.completed);
            return (
              <button
                key={i}
                onClick={() => setSelected(iso)}
                className={cn(
                  "min-h-[60px] sm:min-h-[78px] rounded-md border text-xs flex flex-col items-stretch p-1 transition text-left overflow-hidden",
                  isSelected ? "border-accent bg-accent/10" : isToday ? "border-accent/40 bg-bg-elev" : "border-border bg-bg-elev hover:border-accent/30",
                  !inMonth && "opacity-40"
                )}
              >
                <span className={cn("font-medium text-[11px] leading-none mb-1 px-0.5", isToday && "text-accent")}>
                  {cell.getDate()}
                </span>
                {hasWorkout && (
                  <div className="flex flex-col gap-0.5">
                    {day.slice(0, 2).map((s) => (
                      <span
                        key={s.id}
                        className={cn(
                          "text-[9px] sm:text-[10px] leading-tight font-semibold truncate px-0.5 rounded",
                          allDone || s.completed ? "text-accent line-through opacity-70" : "text-fg"
                        )}
                      >
                        {s.day_label ?? s.name}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical 7-day strip starting from today (rest days included) */}
      <MobileWorkoutList
        byDay={byDay}
        selected={selected}
        onSelect={setSelected}
      />

      {selected && (
        <div className="mt-5 border-t border-border pt-4">
          <div className="text-sm font-medium mb-3">
            {new Date(selected + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </div>
          {selectedSessions.length === 0 ? (
            <p className="text-sm text-fg-muted">Rest day — nothing scheduled.</p>
          ) : (
            <div className="space-y-2">
              {selectedSessions.map((s) => {
                const program = s.program_slug ? getProgram(s.program_slug) : undefined;
                const wt = program ? workoutForSession(program, s.day_label, s.phase_label) : undefined;
                const exCount = wt?.exercises.length ?? 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => onOpen(s.id)}
                    className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev px-3 py-2.5 hover:border-accent/40 text-left transition"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{s.day_label ?? s.name}</div>
                      <div className="text-xs text-fg-subtle truncate">
                        {s.focus ?? ""}{exCount ? ` · ${exCount} exercises` : ""}
                      </div>
                    </div>
                    <span className="text-xs text-accent flex-shrink-0">
                      {s.completed ? "Review" : "Start →"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function MobileWorkoutList({
  byDay,
  selected,
  onSelect,
}: {
  byDay: Map<string, Session[]>;
  selected: string | null;
  onSelect: (iso: string) => void;
}) {
  const today = isoDate(new Date());
  const start = new Date(today + "T00:00:00");
  const days: { iso: string; date: Date; sessions: Session[] }[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const iso = isoDate(date);
    days.push({ iso, date, sessions: byDay.get(iso) ?? [] });
  }

  return (
    <ul className="lg:hidden space-y-2">
      {days.map(({ iso, date, sessions }) => {
        const isToday = iso === today;
        const isSelected = iso === selected;
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = date.getDate();
        const isRest = sessions.length === 0;
        const allDone = !isRest && sessions.every((s) => s.completed);
        return (
          <li key={iso}>
            <button
              onClick={() => onSelect(iso)}
              className={cn(
                "w-full flex items-stretch gap-3 rounded-lg border p-3 text-left transition",
                isSelected
                  ? "border-accent bg-accent/10"
                  : isToday
                  ? "border-accent/40 bg-bg-elev"
                  : "border-border bg-bg-elev hover:border-accent/30",
                isRest && !isSelected && "opacity-70"
              )}
            >
              <div className="flex flex-col items-center justify-center min-w-[42px]">
                <span className={cn("text-[10px] uppercase tracking-wider", isToday ? "text-accent" : "text-fg-subtle")}>
                  {isToday ? "Today" : weekday}
                </span>
                <span className={cn("font-display text-xl font-semibold leading-none mt-0.5", isToday && "text-accent")}>
                  {dayNum}
                </span>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                {isRest ? (
                  <div className="text-sm text-fg-subtle py-1">Rest day</div>
                ) : (
                  sessions.map((s) => (
                    <div key={s.id} className="min-w-0">
                      <div
                        className={cn(
                          "text-sm font-medium truncate",
                          s.completed ? "text-accent line-through opacity-70" : "text-fg"
                        )}
                      >
                        {s.day_label ?? s.name}
                      </div>
                      {s.focus && (
                        <div className="text-xs text-fg-subtle truncate">{s.focus}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
              {allDone && (
                <span className="self-center text-xs text-accent font-semibold whitespace-nowrap">✓</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function shift(cursor: Date, set: (d: Date) => void, by: number) {
  const d = new Date(cursor);
  d.setMonth(d.getMonth() + by);
  set(d);
}

function buildGrid(cursor: Date): (Date | null)[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const startDay = first.getDay() === 0 ? 7 : first.getDay();
  const cells: (Date | null)[] = [];
  const padStart = startDay - 1;
  const padStartDate = new Date(first);
  padStartDate.setDate(first.getDate() - padStart);
  for (let i = 0; i < padStart; i++) {
    cells.push(new Date(padStartDate.getFullYear(), padStartDate.getMonth(), padStartDate.getDate() + i));
  }
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  }
  while (cells.length % 7 !== 0) {
    const l = cells[cells.length - 1]!;
    cells.push(new Date(l.getFullYear(), l.getMonth(), l.getDate() + 1));
  }
  return cells;
}
