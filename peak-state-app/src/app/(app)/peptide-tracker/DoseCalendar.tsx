"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Dose, ProfilePrefs } from "./Client";

const PEPTIDE_COLOR: Record<string, string> = {
  "Retatrutide": "bg-accent",
  "CJC-1295 + Ipamorelin": "bg-blue-400",
  "BPC-157 + TB-500": "bg-fuchsia-400",
  "GHK-Cu": "bg-amber-400",
};

// Text color per compound for the calendar labels.
const PEPTIDE_TEXT: Record<string, string> = {
  "Retatrutide": "text-accent",
  "CJC-1295 + Ipamorelin": "text-blue-400",
  "BPC-157 + TB-500": "text-fuchsia-400",
  "GHK-Cu": "text-amber-400",
};

// Compact label shown inside calendar cells.
const PEPTIDE_SHORT: Record<string, string> = {
  "Retatrutide": "Reta",
  "CJC-1295 + Ipamorelin": "CJC + Ipa",
  "BPC-157 + TB-500": "BPC + TB",
  "GHK-Cu": "GHK-Cu",
};

function shortLabel(name: string) {
  return PEPTIDE_SHORT[name] ?? name;
}

// "08:00" -> "8a", "20:00" -> "8p"
function compactTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12;
  if (h === 0) h = 12;
  return m === 0 ? `${h}${ampm}` : `${h}:${String(m).padStart(2, "0")}${ampm}`;
}

function timeFor(timeOfDay: string | null, profile: ProfilePrefs): string {
  return timeOfDay === "morning" ? profile.morning_time : profile.evening_time;
}

function DaySection({
  label,
  time,
  doses,
  tone,
}: {
  label: "AM" | "PM";
  time: string;
  doses: Dose[];
  tone: "warm" | "cool";
}) {
  const labelColor = tone === "warm" ? "text-amber-300" : "text-sky-300";
  return (
    <div className="px-0.5">
      <div className="flex items-baseline gap-1 mb-0.5">
        <span className={cn("text-[9px] font-bold tracking-wider", labelColor)}>{label}</span>
        <span className="text-[9px] text-fg-subtle leading-none">{time}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        {doses.slice(0, 2).map((d) => (
          <span
            key={d.id}
            className={cn(
              "text-[10px] sm:text-[11px] leading-tight font-semibold truncate",
              PEPTIDE_TEXT[d.peptide_name] ?? "text-fg-muted",
              d.taken && "line-through opacity-60"
            )}
            title={d.peptide_name}
          >
            {shortLabel(d.peptide_name)}
          </span>
        ))}
        {doses.length > 2 && (
          <span className="text-[9px] text-fg-subtle leading-tight">+{doses.length - 2} more</span>
        )}
      </div>
    </div>
  );
}

export function DoseCalendar({
  doses,
  onChanged,
  profile,
}: {
  doses: Dose[];
  onChanged: () => void;
  profile: ProfilePrefs;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selected, setSelected] = useState<string | null>(todayISO());

  const grid = useMemo(() => buildGrid(cursor), [cursor]);
  const byDay = useMemo(() => {
    const m = new Map<string, Dose[]>();
    for (const d of doses) {
      const arr = m.get(d.scheduled_for) ?? [];
      arr.push(d);
      m.set(d.scheduled_for, arr);
    }
    return m;
  }, [doses]);

  function prevMonth() {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() - 1);
    setCursor(d);
  }
  function nextMonth() {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + 1);
    setCursor(d);
  }

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedDoses = selected ? byDay.get(selected) ?? [] : [];

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="btn-ghost text-sm px-2 py-1" aria-label="Previous month">←</button>
          <span className="text-sm font-medium w-32 text-center">{monthLabel}</span>
          <button onClick={nextMonth} className="btn-ghost text-sm px-2 py-1" aria-label="Next month">→</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] uppercase tracking-wide text-fg-subtle mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((cell, i) => {
          if (!cell) return <div key={i} className="min-h-[72px]" />;
          const iso = cell.toISOString().slice(0, 10);
          const day = byDay.get(iso) ?? [];
          const morning = day.filter((d) => d.time_of_day === "morning");
          const evening = day.filter((d) => d.time_of_day !== "morning");
          const isToday = iso === todayISO();
          const isSelected = iso === selected;
          const inMonth = cell.getMonth() === cursor.getMonth();
          return (
            <button
              key={i}
              onClick={() => setSelected(iso)}
              className={cn(
                "min-h-[72px] sm:min-h-[100px] rounded-md border text-xs flex flex-col items-stretch justify-start p-1 transition text-left overflow-hidden",
                isSelected
                  ? "border-accent bg-accent/10"
                  : isToday
                  ? "border-accent/40 bg-bg-elev"
                  : "border-border bg-bg-elev hover:border-accent/30",
                !inMonth && "opacity-40"
              )}
            >
              <span className={cn("font-medium text-[11px] leading-none mb-1 px-0.5", isToday && "text-accent")}>
                {cell.getDate()}
              </span>

              {morning.length > 0 && (
                <DaySection
                  label="AM"
                  time={compactTime(profile.morning_time)}
                  doses={morning}
                  tone="warm"
                />
              )}
              {morning.length > 0 && evening.length > 0 && (
                <div className="border-t border-border my-0.5" />
              )}
              {evening.length > 0 && (
                <DaySection
                  label="PM"
                  time={compactTime(profile.evening_time)}
                  doses={evening}
                  tone="cool"
                />
              )}
            </button>
          );
        })}
      </div>

      <Legend />

      {selected && (
        <SelectedDayDetail
          dateISO={selected}
          doses={selectedDoses}
          profile={profile}
          onChanged={onChanged}
        />
      )}
    </section>
  );
}

function SelectedDayDetail({
  dateISO,
  doses,
  profile,
  onChanged,
}: {
  dateISO: string;
  doses: Dose[];
  profile: ProfilePrefs;
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(d: Dose) {
    setBusy(d.id);
    const next = !d.taken;
    await supabase
      .from("peptide_doses")
      .update({ taken: next, taken_at: next ? new Date().toISOString() : null })
      .eq("id", d.id);
    setBusy(null);
    onChanged();
  }

  const display = new Date(dateISO + "T00:00:00");
  const dayLabel = display.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const morning = doses.filter((d) => d.time_of_day === "morning");
  const evening = doses.filter((d) => d.time_of_day !== "morning");

  return (
    <div className="mt-5 border-t border-border pt-4">
      <div className="text-sm font-medium mb-3">{dayLabel}</div>
      {doses.length === 0 ? (
        <p className="text-sm text-fg-muted">No doses scheduled.</p>
      ) : (
        <div className="space-y-5">
          {morning.length > 0 && (
            <DoseGroup
              label="Morning"
              clock={formatClockLong(profile.morning_time)}
              tone="warm"
              doses={morning}
              busy={busy}
              onToggle={toggle}
            />
          )}
          {evening.length > 0 && (
            <DoseGroup
              label="Evening"
              clock={formatClockLong(profile.evening_time)}
              tone="cool"
              doses={evening}
              busy={busy}
              onToggle={toggle}
            />
          )}
        </div>
      )}
    </div>
  );
}

function DoseGroup({
  label,
  clock,
  tone,
  doses,
  busy,
  onToggle,
}: {
  label: "Morning" | "Evening";
  clock: string;
  tone: "warm" | "cool";
  doses: Dose[];
  busy: string | null;
  onToggle: (d: Dose) => void;
}) {
  const headerColor = tone === "warm" ? "text-amber-300" : "text-sky-300";
  const wrapBorder = tone === "warm" ? "border-amber-400/20" : "border-sky-400/20";
  const wrapBg = tone === "warm" ? "bg-amber-400/5" : "bg-sky-400/5";

  return (
    <div className={cn("rounded-lg border p-3", wrapBorder, wrapBg)}>
      <div className="flex items-baseline gap-2 mb-2.5">
        <span className={cn("text-xs font-bold uppercase tracking-widest", headerColor)}>
          {label}
        </span>
        <span className="text-xs text-fg-muted">· {clock}</span>
      </div>
      <ul className="space-y-2">
        {doses.map((d) => (
          <li key={d.id}>
            <button
              onClick={() => onToggle(d)}
              disabled={busy === d.id}
              className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-card px-3 py-2.5 hover:border-accent/40 text-left transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={cn(
                    "h-4 w-4 rounded-full border-2 flex-shrink-0",
                    d.taken ? "border-accent bg-accent" : "border-border"
                  )}
                />
                <div className="min-w-0">
                  <div
                    className={cn(
                      "text-sm font-semibold truncate",
                      PEPTIDE_TEXT[d.peptide_name] ?? "text-fg"
                    )}
                  >
                    {d.peptide_name}
                  </div>
                  <div className="text-xs text-fg-subtle truncate">
                    {d.dose_mg} mg{d.notes ? ` · ${d.notes}` : ""}
                  </div>
                </div>
              </div>
              <span className="text-xs text-fg-muted flex-shrink-0">
                {d.taken ? "Logged" : "Tap to log"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatClockLong(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-3 mt-3 text-xs text-fg-muted">
      {Object.entries(PEPTIDE_COLOR).map(([name, color]) => (
        <div key={name} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", color)} />
          {name}
        </div>
      ))}
    </div>
  );
}

function buildGrid(cursor: Date): (Date | null)[] {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const startDay = first.getDay() === 0 ? 7 : first.getDay(); // 1=Mon..7=Sun
  const cells: (Date | null)[] = [];
  // pad front
  const padStart = startDay - 1;
  const padStartDate = new Date(first);
  padStartDate.setDate(first.getDate() - padStart);
  for (let i = 0; i < padStart; i++) {
    cells.push(new Date(padStartDate.getFullYear(), padStartDate.getMonth(), padStartDate.getDate() + i));
  }
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  }
  // pad end to multiple of 7
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!;
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  return cells;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
