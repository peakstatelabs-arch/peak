"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string; // YYYY-MM-DD
  onChange: (next: string) => void;
  minDate?: string; // YYYY-MM-DD; days strictly before this are disabled
  placeholder?: string;
  className?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"]; // Sun-first

function parseISO(s: string | null | undefined): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplay(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function DatePicker({ value, onChange, minDate, placeholder, className }: Props) {
  const selected = parseISO(value);
  const min = parseISO(minDate);

  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? min ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(d: Date) {
    onChange(toISO(d));
    setOpen(false);
  }

  // Build 6 weeks × 7 days grid for viewMonth.
  const monthStart = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay()); // back to Sunday
  const today = startOfDay(new Date());
  const minDay = min ? startOfDay(min) : null;

  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }

  function shiftMonth(delta: number) {
    setViewMonth((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  return (
    <div ref={wrapperRef} className={"relative " + (className ?? "")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input w-full text-left flex items-center justify-between gap-2"
      >
        <span className={selected ? "text-fg" : "text-fg-subtle"}>
          {selected ? formatDisplay(selected) : (placeholder ?? "Pick a date")}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-fg-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[280px] rounded-xl border border-border bg-bg-card shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => shiftMonth(-1)} className="h-7 w-7 rounded-md hover:bg-bg-elev text-fg-muted hover:text-fg flex items-center justify-center" aria-label="Previous month">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className="text-sm font-medium">
              {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
            </div>
            <button type="button" onClick={() => shiftMonth(1)} className="h-7 w-7 rounded-md hover:bg-bg-elev text-fg-muted hover:text-fg flex items-center justify-center" aria-label="Next month">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_SHORT.map((d, i) => (
              <div key={i} className="text-center text-[10px] uppercase tracking-wide text-fg-subtle py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === viewMonth.getMonth();
              const isToday = startOfDay(d).getTime() === today.getTime();
              const isSelected = selected && startOfDay(d).getTime() === startOfDay(selected).getTime();
              const disabled = minDay ? startOfDay(d).getTime() < minDay.getTime() : false;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(d)}
                  className={[
                    "h-8 rounded-md text-sm flex items-center justify-center transition",
                    disabled
                      ? "text-fg-subtle/40 cursor-not-allowed"
                      : isSelected
                      ? "bg-accent text-accent-fg font-semibold"
                      : isToday
                      ? "border border-accent/40 text-fg hover:bg-bg-elev"
                      : inMonth
                      ? "text-fg hover:bg-bg-elev"
                      : "text-fg-subtle/60 hover:bg-bg-elev",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
