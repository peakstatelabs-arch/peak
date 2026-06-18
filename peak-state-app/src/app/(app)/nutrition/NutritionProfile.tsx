"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { computeTargets, type Goal, type MacroTargets, type Sex } from "@/lib/nutrition";

export function NutritionProfile({
  targets,
  goal: initialGoal,
  savedInputs,
  metabolicType,
  dietaryPrefs,
  onChanged,
}: {
  targets: MacroTargets;
  goal: string;
  savedInputs: Record<string, unknown> | null;
  metabolicType: string | null;
  dietaryPrefs: Record<string, unknown>;
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [sex, setSex] = useState<Sex>((savedInputs?.sex as Sex) ?? "male");
  const [age, setAge] = useState((savedInputs?.age as number) ?? 34);
  const [weightLb, setWeightLb] = useState((savedInputs?.weightLb as number) ?? 195);
  const [heightIn, setHeightIn] = useState((savedInputs?.heightIn as number) ?? 70);
  const [activity, setActivity] = useState((savedInputs?.activity as number) ?? 1.55);
  const [goal, setGoal] = useState<Goal>((initialGoal as Goal) ?? "recomp");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const out = useMemo(
    () => computeTargets({ sex, age, weightLb, heightIn, activity, goal }),
    [sex, age, weightLb, heightIn, activity, goal]
  );

  async function saveTargets() {
    setSaving(true);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg({ kind: "err", text: "Not signed in." }); setSaving(false); return; }
    const { error } = await supabase.from("profiles").update({
      nutrition_targets: {
        kcal: out.kcal, protein: out.protein, carbs: out.carbs, fat: out.fat,
        goal,
        inputs: { sex, age, weightLb, heightIn, activity },
      },
    }).eq("id", user.id);
    setSaving(false);
    if (error) { setMsg({ kind: "err", text: error.message }); return; }
    setMsg({ kind: "ok", text: "Saved. Today's rings now use these targets." });
    onChanged();
  }

  return (
    <div className="space-y-5">
      <section className="card">
        <h3 className="font-semibold mb-3">TDEE + macro calculator</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Sex</label>
            <select className="input" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Num label="Age" v={age} on={setAge} />
          <Num label="Weight (lb)" v={weightLb} on={setWeightLb} />
          <Num label="Height (in)" v={heightIn} on={setHeightIn} />
          <div>
            <label className="label">Activity</label>
            <select className="input" value={activity} onChange={(e) => setActivity(Number(e.target.value))}>
              <option value={1.2}>Sedentary</option>
              <option value={1.375}>Light (1-3×/wk)</option>
              <option value={1.55}>Moderate (3-5×/wk)</option>
              <option value={1.725}>High (6-7×/wk)</option>
              <option value={1.9}>Athlete</option>
            </select>
          </div>
          <div>
            <label className="label">Goal</label>
            <select className="input" value={goal} onChange={(e) => setGoal(e.target.value as Goal)}>
              <option value="cut">Cut</option>
              <option value="recomp">Recomp</option>
              <option value="bulk">Bulk</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
          <Stat label="BMR" v={`${out.bmr}`} unit="kcal" />
          <Stat label="TDEE" v={`${out.tdee}`} unit="kcal" />
          <Stat label="Target" v={`${out.kcal}`} unit="kcal" highlight />
          <Stat label="Protein" v={`${out.protein}`} unit="g" />
          <Stat label="Carbs" v={`${out.carbs}`} unit="g" />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={saveTargets} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save as my targets"}
          </button>
          {msg && (
            <span className={msg.kind === "ok" ? "text-success text-sm" : "text-danger text-sm"}>
              {msg.text}
            </span>
          )}
        </div>
      </section>

      <section className="card bg-gradient-to-br from-accent/10 to-transparent border-accent/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="chip-accent text-[10px] mb-1 inline-block">Metabolic typing</div>
            <h3 className="font-display text-lg font-semibold">Find your metabolic type</h3>
            <p className="text-sm text-fg-muted mt-1 max-w-md">
              {metabolicType
                ? `Your type: ${metabolicType}. Retake the quiz any time.`
                : "A short quiz tunes your macros and meal plan to how your body burns fuel."}
            </p>
          </div>
          <Link href="/nutrition/quiz" className="btn-primary text-xs flex-shrink-0">
            {metabolicType ? "Retake" : "Take quiz"}
          </Link>
        </div>
      </section>

      <section className="card">
        <h3 className="font-semibold mb-2">Peptide + nutrition synergy</h3>
        <ul className="text-sm space-y-2 text-fg-muted">
          <li>• <strong className="text-fg">Retatrutide:</strong> Appetite drops — prioritize protein first, hit 130–180g/day even when not hungry. Eat slowly to avoid GI distress.</li>
          <li>• <strong className="text-fg">CJC/Ipamorelin:</strong> Dose on an empty stomach. No carbs for 90 minutes after to preserve GH pulse.</li>
          <li>• <strong className="text-fg">BPC-157 / TB-500:</strong> Recovery blend — pair with adequate protein (2.2 g/kg) and 7+ hours sleep.</li>
        </ul>
      </section>
    </div>
  );
}

function Num({ label, v, on }: { label: string; v: number; on: (n: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" inputMode="decimal" className="input" value={v} onChange={(e) => on(Number(e.target.value))} />
    </div>
  );
}

function Stat({ label, v, unit, highlight }: { label: string; v: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border border-border p-3 ${highlight ? "bg-accent/10 border-accent/40" : "bg-bg-elev"}`}>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`font-display text-xl font-semibold mt-0.5 ${highlight ? "text-accent" : ""}`}>
        {v} <span className="text-xs text-fg-muted">{unit}</span>
      </div>
    </div>
  );
}
