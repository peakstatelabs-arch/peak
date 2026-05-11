"use client";

import { useMemo, useState } from "react";

export function NutritionClient() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(34);
  const [weightLb, setWeightLb] = useState(195);
  const [heightIn, setHeightIn] = useState(70);
  const [activity, setActivity] = useState(1.55);
  const [goal, setGoal] = useState<"cut" | "recomp" | "bulk">("cut");

  const out = useMemo(() => {
    const kg = weightLb / 2.20462;
    const cm = heightIn * 2.54;
    const bmr = sex === "male"
      ? 10 * kg + 6.25 * cm - 5 * age + 5
      : 10 * kg + 6.25 * cm - 5 * age - 161;
    const tdee = bmr * activity;
    const target = goal === "cut" ? tdee - 500 : goal === "bulk" ? tdee + 300 : tdee - 100;
    const protein = Math.round(kg * (goal === "cut" ? 2.4 : 2.0));
    const fat = Math.round((target * 0.25) / 9);
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), target: Math.round(target), protein, fat, carbs };
  }, [sex, age, weightLb, heightIn, activity, goal]);

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold mb-3">TDEE + macro calculator</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Sex</label>
            <select className="input" value={sex} onChange={(e) => setSex(e.target.value as any)}>
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
            <select className="input" value={goal} onChange={(e) => setGoal(e.target.value as any)}>
              <option value="cut">Cut</option>
              <option value="recomp">Recomp</option>
              <option value="bulk">Bulk</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
          <Stat label="BMR" v={`${out.bmr}`} unit="kcal" />
          <Stat label="TDEE" v={`${out.tdee}`} unit="kcal" />
          <Stat label="Target" v={`${out.target}`} unit="kcal" highlight />
          <Stat label="Protein" v={`${out.protein}`} unit="g" />
          <Stat label="Carbs" v={`${out.carbs}`} unit="g" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <PlanCard title="Cut" cals="−500 kcal" body="2.4 g/kg protein. 25% fat. Carbs around training. 1.0–1.5 lb/week loss target." />
        <PlanCard title="Recomp" cals="−100 kcal" body="Slow body fat reduction while gaining strength. Best for new-to-Reta clients." />
        <PlanCard title="Bulk" cals="+300 kcal" body="Lean gaining. 2.0 g/kg protein. Slight calorie surplus. Push hard in the gym." />
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Peptide + nutrition synergy</h3>
        <ul className="text-sm space-y-2 text-fg-muted">
          <li>• <strong className="text-fg">Retatrutide:</strong> Appetite drops — prioritize protein first, hit 130–180g/day even when not hungry. Eat slowly to avoid GI distress.</li>
          <li>• <strong className="text-fg">CJC/Ipamorelin:</strong> Dose on an empty stomach. No carbs for 90 minutes after to preserve GH pulse.</li>
          <li>• <strong className="text-fg">BPC-157 / TB-500:</strong> Recovery blend — pair with adequate protein (2.2 g/kg) and 7+ hours sleep.</li>
        </ul>
      </div>
    </div>
  );
}

function Num({ label, v, on }: { label: string; v: number; on: (n: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" className="input" value={v} onChange={(e) => on(Number(e.target.value))} />
    </div>
  );
}

function Stat({ label, v, unit, highlight }: { label: string; v: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border border-border p-3 ${highlight ? "bg-accent/10 border-accent/40" : "bg-bg-elev"}`}>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`font-display text-xl font-semibold mt-0.5 ${highlight ? "text-accent" : ""}`}>{v} <span className="text-xs text-fg-muted">{unit}</span></div>
    </div>
  );
}

function PlanCard({ title, cals, body }: { title: string; cals: string; body: string }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <span className="chip">{cals}</span>
      </div>
      <p className="text-sm text-fg-muted">{body}</p>
    </div>
  );
}
