"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTodayISO } from "@/components/TimezoneProvider";
import type { Dose } from "./Client";

export function TodayDoses({ doses, onChanged }: { doses: Dose[]; onChanged: () => void }) {
  const today = useTodayISO();
  const todays = doses.filter((d) => d.scheduled_for === today);
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

  if (todays.length === 0) {
    return (
      <section className="card border-accent/20 bg-accent/5">
        <div className="text-sm">
          <strong className="font-semibold">Nothing scheduled today.</strong>{" "}
          <span className="text-fg-muted">Enjoy the day off.</span>
        </div>
      </section>
    );
  }

  const done = todays.filter((d) => d.taken).length;

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Today's doses</h2>
        <span className="chip-accent text-xs">{done} / {todays.length} logged</span>
      </div>
      <ul className="space-y-2">
        {todays
          .sort((a, b) => (a.time_of_day ?? "").localeCompare(b.time_of_day ?? ""))
          .map((d) => (
            <li key={d.id}>
              <button
                onClick={() => toggle(d)}
                disabled={busy === d.id}
                className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev px-3 py-2.5 hover:border-accent/40 text-left transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${
                      d.taken ? "border-accent bg-accent" : "border-border"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{d.peptide_name}</div>
                    <div className="text-xs text-fg-subtle truncate">
                      {d.dose_mg} mg · {d.time_of_day ?? "any time"}
                      {d.notes ? ` · ${d.notes}` : ""}
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
    </section>
  );
}
