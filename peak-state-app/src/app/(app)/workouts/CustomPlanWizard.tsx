"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getProgram, recommendedWeekdays } from "@/lib/programs";
import { isoDate } from "@/lib/workout";

type Inputs = {
  audience: "men" | "women";
  location: "home" | "gym";
  daysPerWeek: number;
  minutesPerSession: number;
  experience: "beginner" | "intermediate" | "advanced";
  injuries: string;
  goalNote: string;
};

type AIPlan = {
  name: string;
  rationale: string;
  phases: {
    label: string;
    weeks: number;
    workouts: {
      label: string;
      focus: string;
      exercises: { code: string; name: string; sets: string; reps: string; restSec: number }[];
    }[];
  }[];
};

const DAY = 86400000;

export function CustomPlanWizard({ onCancel, onDone }: { onCancel: () => void; onDone: () => void }) {
  const supabase = createClient();
  const [step, setStep] = useState<"intake" | "generating" | "review">("intake");
  const [inputs, setInputs] = useState<Inputs>({
    audience: "men",
    location: "gym",
    daysPerWeek: 4,
    minutesPerSession: 60,
    experience: "intermediate",
    injuries: "",
    goalNote: "",
  });
  const [plan, setPlan] = useState<AIPlan | null>(null);
  const [baseSlug, setBaseSlug] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(nextMondayISO());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setStep("generating");
    setError(null);
    try {
      const res = await fetch("/portal/api/ai/generate-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "AI request failed.");
        setStep("intake");
        return;
      }
      setPlan(json.plan);
      setBaseSlug(json.baseSlug);
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
      setStep("intake");
    }
  }

  async function save() {
    if (!plan || !baseSlug) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    const today = isoDate(new Date());
    await supabase.from("workout_sessions").delete()
      .eq("user_id", user.id).gte("scheduled_for", today).eq("completed", false);

    // Lay AI plan onto the calendar with even spacing per phase
    const week1Monday = rollToMonday(new Date(startDate + "T00:00:00"));
    const rows: Record<string, unknown>[] = [];
    let weekIdx = 0;
    for (const phase of plan.phases) {
      const days = recommendedWeekdays(phase.workouts.length);
      for (let pw = 0; pw < phase.weeks; pw++) {
        const monday = new Date(week1Monday.getTime() + (weekIdx + pw) * 7 * DAY);
        phase.workouts.forEach((wt, i) => {
          const weekday = days[i] ?? days[days.length - 1];
          const date = new Date(monday.getTime() + (weekday - 1) * DAY);
          rows.push({
            user_id: user.id,
            name: wt.label,
            program_slug: baseSlug, // we anchor to the base program for exercise lookup
            day_label: wt.label,
            focus: wt.focus,
            phase_label: phase.label,
            workout_index: i,
            scheduled_for: isoDate(date),
            completed: false,
          });
        });
      }
      weekIdx += phase.weeks;
    }

    const batch = 200;
    for (let i = 0; i < rows.length; i += batch) {
      const { error: e } = await supabase.from("workout_sessions").insert(rows.slice(i, i + batch));
      if (e) { setError(e.message); setSaving(false); return; }
    }
    await supabase.from("profiles")
      .update({
        active_program: baseSlug,
        active_program_started: startDate,
        workout_preferences: { ...inputs, custom: true, ai_name: plan.name },
      })
      .eq("id", user.id);
    setSaving(false);
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-2xl card max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "intake" && (
          <Intake
            inputs={inputs}
            setInputs={setInputs}
            error={error}
            onCancel={onCancel}
            onGenerate={generate}
          />
        )}
        {step === "generating" && <Generating />}
        {step === "review" && plan && (
          <Review
            plan={plan}
            startDate={startDate}
            setStartDate={setStartDate}
            error={error}
            saving={saving}
            onBack={() => setStep("intake")}
            onSave={save}
          />
        )}
      </div>
    </div>
  );
}

function Intake({
  inputs, setInputs, error, onCancel, onGenerate,
}: {
  inputs: Inputs;
  setInputs: (i: Inputs) => void;
  error: string | null;
  onCancel: () => void;
  onGenerate: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="chip-accent text-[10px]">AI</span>
        <h3 className="font-display text-lg font-semibold">Build me a plan</h3>
      </div>
      <p className="text-sm text-fg-muted">
        Claude tailors a 12-week Peak State recomp plan to your constraints. Sessions, exercises, and progression all stay faithful to the Peak State library.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Pick label="I am" value={inputs.audience} options={[["men","Male"],["women","Female"]]} onChange={(v) => setInputs({ ...inputs, audience: v as Inputs["audience"] })} />
        <Pick label="I train at" value={inputs.location} options={[["gym","Gym"],["home","Home"]]} onChange={(v) => setInputs({ ...inputs, location: v as Inputs["location"] })} />
        <Pick label="Experience" value={inputs.experience} options={[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]]} onChange={(v) => setInputs({ ...inputs, experience: v as Inputs["experience"] })} />
        <div>
          <label className="label">Days per week</label>
          <select
            className="input"
            value={inputs.daysPerWeek}
            onChange={(e) => setInputs({ ...inputs, daysPerWeek: Number(e.target.value) })}
          >
            {[2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} days</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="label">Minutes per session: {inputs.minutesPerSession} min</label>
          <input
            type="range"
            min={20}
            max={90}
            step={5}
            value={inputs.minutesPerSession}
            onChange={(e) => setInputs({ ...inputs, minutesPerSession: Number(e.target.value) })}
            className="w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div className="col-span-2">
          <label className="label">Injuries or limitations (optional)</label>
          <input
            className="input"
            value={inputs.injuries}
            onChange={(e) => setInputs({ ...inputs, injuries: e.target.value })}
            placeholder="e.g. lower back, bad shoulder, no overhead pressing"
          />
        </div>
        <div className="col-span-2">
          <label className="label">Anything specific you want? (optional)</label>
          <input
            className="input"
            value={inputs.goalNote}
            onChange={(e) => setInputs({ ...inputs, goalNote: e.target.value })}
            placeholder="e.g. emphasize glutes, drop body fat fast, prep for hiking trip"
          />
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={onGenerate} className="btn-primary flex-1">Generate my plan →</button>
      </div>
    </div>
  );
}

function Pick<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-1.5">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex-1 rounded-lg border px-2 py-2 text-sm transition ${
              value === v
                ? "border-accent bg-accent/10 text-accent font-medium"
                : "border-border bg-bg-elev text-fg-muted hover:text-fg"
            }`}
          >{l}</button>
        ))}
      </div>
    </div>
  );
}

function Generating() {
  return (
    <div className="py-12 text-center">
      <div className="inline-block animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mb-4" />
      <h3 className="font-display text-lg font-semibold">Building your plan</h3>
      <p className="text-sm text-fg-muted mt-1">Claude is reshaping the program around you. ~5–10 seconds.</p>
    </div>
  );
}

function Review({
  plan, startDate, setStartDate, error, saving, onBack, onSave,
}: {
  plan: AIPlan;
  startDate: string;
  setStartDate: (s: string) => void;
  error: string | null;
  saving: boolean;
  onBack: () => void;
  onSave: () => void;
}) {
  const totalSessions = plan.phases.reduce((a, ph) => a + ph.workouts.length * ph.weeks, 0);
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="chip-accent text-[10px]">AI</span>
          <span className="text-xs uppercase tracking-wide text-fg-subtle">Your custom plan</span>
        </div>
        <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
        <p className="text-sm text-fg-muted mt-1 italic leading-relaxed">{plan.rationale}</p>
      </div>

      <div className="rounded-lg bg-bg-elev border border-border p-3 text-sm space-y-1">
        {plan.phases.map((ph) => (
          <div key={ph.label} className="flex items-center justify-between">
            <span className="text-fg-muted">{ph.label}</span>
            <span className="text-xs text-fg-subtle">
              {ph.weeks} weeks · {ph.workouts.length} sessions/wk
            </span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <span className="text-fg-muted">Total sessions</span>
          <span className="font-display text-lg text-accent font-semibold">{totalSessions}</span>
        </div>
      </div>

      <div>
        <label className="label">Start date</label>
        <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div className="space-y-3">
        {plan.phases.map((ph) => (
          <details key={ph.label} className="card">
            <summary className="cursor-pointer font-medium">{ph.label} — {ph.workouts.length} sessions/wk</summary>
            <div className="mt-3 space-y-3">
              {ph.workouts.map((wt) => (
                <div key={wt.label}>
                  <div className="flex items-center justify-between mb-1">
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
          </details>
        ))}
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button onClick={onBack} className="btn-secondary flex-1">← Tweak inputs</button>
        <button onClick={onSave} disabled={saving} className="btn-primary flex-1">
          {saving ? "Scheduling…" : `Save & schedule ${totalSessions} sessions`}
        </button>
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

function rollToMonday(d: Date): Date {
  const out = new Date(d);
  const cur = out.getDay() === 0 ? 7 : out.getDay();
  out.setDate(out.getDate() + ((1 - cur + 7) % 7));
  return out;
}
