"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/utils";

type Program = {
  slug: string;
  name: string;
  days: number;
  blurb: string;
  template: { day: string; lifts: [string, number, string][] }[];
};

type Session = {
  id: string;
  name: string;
  scheduled_for: string;
  completed: boolean;
  notes: string | null;
};

export function WorkoutsClient({
  programs,
  sessions,
  activeProgram,
}: {
  programs: Program[];
  sessions: Session[];
  activeProgram: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [openProgram, setOpenProgram] = useState<string | null>(activeProgram);

  async function pickProgram(slug: string) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ active_program: slug }).eq("id", user!.id);
    setOpenProgram(slug);
    router.refresh();
  }

  async function logSession(name: string) {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("workout_sessions").insert({
      user_id: user!.id,
      name,
      scheduled_for: todayISO(),
      completed: false,
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {programs.map((p) => (
          <div key={p.slug} className={`card ${activeProgram === p.slug ? "border-accent/50" : ""}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="chip">{p.days} days/wk</span>
              {activeProgram === p.slug && <span className="chip-accent">Active</span>}
            </div>
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <p className="text-sm text-fg-muted mt-1">{p.blurb}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setOpenProgram(openProgram === p.slug ? null : p.slug)} className="btn-secondary text-xs flex-1">
                {openProgram === p.slug ? "Hide" : "View template"}
              </button>
              <button onClick={() => pickProgram(p.slug)} className="btn-primary text-xs flex-1">
                {activeProgram === p.slug ? "Selected" : "Use this"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {openProgram && (
        <section className="card">
          <h3 className="font-semibold mb-3">Template</h3>
          {programs.find((p) => p.slug === openProgram)?.template.map((d) => (
            <div key={d.day} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{d.day}</h4>
                <button onClick={() => logSession(d.day)} className="btn-secondary text-xs">
                  Start session
                </button>
              </div>
              <ul className="text-sm divide-y divide-border border border-border rounded-lg bg-bg-elev">
                {d.lifts.map(([lift, sets, reps], i) => (
                  <li key={i} className="flex justify-between px-3 py-2">
                    <span>{lift}</span>
                    <span className="text-fg-muted">{sets} × {reps}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      <section className="card">
        <h3 className="font-semibold mb-3">Recent sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-fg-muted">No sessions logged yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {sessions.map((s) => (
              <li key={s.id} className="py-2.5 flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-fg-subtle">{s.scheduled_for}</div>
                </div>
                <span className={`chip ${s.completed ? "chip-accent" : ""}`}>
                  {s.completed ? "Done" : "Planned"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="font-semibold mb-2">Exercise library</h3>
        <p className="text-sm text-fg-muted">
          Compound lifts: squat, deadlift, bench press, overhead press, row, pull-up. Accessory:
          lateral raise, face pull, leg curl, lunge, plank, calf raise. Use a logbook —
          progressive overload is the engine. We'll expand the library with video cues soon.
        </p>
      </section>
    </div>
  );
}
