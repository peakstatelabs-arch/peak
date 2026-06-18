"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { todayISO, type MacroTargets } from "@/lib/nutrition";
import { cn } from "@/lib/utils";
import type { Plan, PlanData, PlanMeal } from "./NutritionClient";

export function MealPlanView({
  activePlan,
  targets,
  goal,
  metabolicType,
  dietaryPrefs,
  onChanged,
}: {
  activePlan: Plan | null;
  targets: MacroTargets;
  goal: string;
  metabolicType: string | null;
  dietaryPrefs: Record<string, unknown>;
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dayIdx, setDayIdx] = useState(0);
  const [showWizard, setShowWizard] = useState(false);

  async function generate(prefs: {
    likes: string; dislikes: string; allergies: string; style: string; prepTimeMin: number;
  }) {
    setBuilding(true);
    setError(null);
    try {
      const res = await fetch("/portal/api/ai/meal-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targets, goal, metabolicType, prefs }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Couldn't generate the plan."); return; }
      const plan = json.plan as PlanData;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not signed in."); return; }
      // Deactivate previous active plan
      await supabase.from("meal_plans").update({ active: false }).eq("user_id", user.id).eq("active", true);
      // Insert new
      await supabase.from("meal_plans").insert({
        user_id: user.id, week_start: todayISO(), plan, active: true,
      });
      // Save prefs on profile
      await supabase.from("profiles").update({ dietary_prefs: prefs }).eq("id", user.id);
      setShowWizard(false);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setBuilding(false);
    }
  }

  if (!activePlan) {
    return (
      <div className="space-y-4">
        <div className="card text-center py-10">
          <div className="chip-accent inline-block mb-3">AI meal plan</div>
          <h3 className="font-display text-xl font-semibold">Get a 7-day plan tailored to you</h3>
          <p className="text-sm text-fg-muted mt-2 max-w-md mx-auto">
            Claude builds a week of meals around your targets, goal, foods you love, and anything to avoid.
            Includes grocery list and prep times.
          </p>
          <button onClick={() => setShowWizard(true)} className="btn-primary mt-5">
            Build my plan →
          </button>
        </div>
        {showWizard && (
          <PrefsWizard
            initial={normalizePrefs(dietaryPrefs)}
            building={building}
            error={error}
            onCancel={() => setShowWizard(false)}
            onGenerate={generate}
          />
        )}
      </div>
    );
  }

  const plan = activePlan.plan as PlanData;
  const day = plan.days[dayIdx];

  return (
    <div className="space-y-5">
      <div className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="chip-accent text-[10px] mb-1 inline-block">AI plan · {activePlan.week_start}</div>
            <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
            <p className="text-sm text-fg-muted mt-1 leading-relaxed">{plan.summary}</p>
          </div>
          <button onClick={() => setShowWizard(true)} className="btn-secondary text-xs flex-shrink-0">
            Regenerate
          </button>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {plan.days.map((d, i) => (
          <button
            key={d.day_index}
            onClick={() => setDayIdx(i)}
            className={cn(
              "flex-shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition",
              dayIdx === i ? "border-accent bg-accent/10 text-accent" : "border-border bg-bg-elev text-fg-muted"
            )}
          >
            {d.day_label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {day.meals.map((m, i) => (
          <MealCard key={i} meal={m} />
        ))}
      </div>

      <details className="card">
        <summary className="cursor-pointer font-semibold">Grocery list ({plan.grocery.length})</summary>
        <ul className="mt-3 grid grid-cols-2 gap-y-1 gap-x-3 text-sm text-fg-muted">
          {plan.grocery.map((g, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-accent mt-0.5">•</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </details>

      {showWizard && (
        <PrefsWizard
          initial={normalizePrefs(dietaryPrefs)}
          building={building}
          error={error}
          onCancel={() => setShowWizard(false)}
          onGenerate={generate}
        />
      )}
    </div>
  );
}

function MealCard({ meal }: { meal: PlanMeal }) {
  const [open, setOpen] = useState(false);
  const supabase = createClient();
  const [logging, setLogging] = useState(false);
  const [logged, setLogged] = useState(false);

  async function logIt() {
    setLogging(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLogging(false); return; }
    await supabase.from("meal_logs").insert({
      user_id: user.id,
      logged_for: todayISO(),
      meal_type: meal.type,
      description: meal.name,
      kcal: meal.kcal,
      protein_g: meal.protein_g,
      carbs_g: meal.carbs_g,
      fat_g: meal.fat_g,
      source: "manual",
    });
    setLogging(false);
    setLogged(true);
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{meal.type}</div>
          <h4 className="font-semibold">{meal.name}</h4>
          <p className="text-sm text-fg-muted mt-0.5">{meal.description}</p>
          <div className="text-xs text-fg-subtle mt-1">
            {meal.kcal} kcal · {meal.protein_g}P / {meal.carbs_g}C / {meal.fat_g}F
            {meal.prep_min ? ` · ${meal.prep_min} min prep` : ""}
          </div>
        </div>
        <button
          onClick={logIt}
          disabled={logging || logged}
          className={cn("text-xs flex-shrink-0", logged ? "btn-secondary" : "btn-primary")}
        >
          {logged ? "Logged ✓" : logging ? "…" : "Log it"}
        </button>
      </div>
      {(meal.ingredients?.length || meal.instructions) && (
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-accent mt-3 hover:underline"
        >
          {open ? "Hide recipe" : "Show recipe →"}
        </button>
      )}
      {open && (
        <div className="mt-3 border-t border-border pt-3 space-y-3 text-sm">
          {meal.ingredients && (
            <div>
              <h5 className="text-xs uppercase tracking-wide text-fg-subtle mb-1">Ingredients</h5>
              <ul className="text-fg-muted">
                {meal.ingredients.map((ing, i) => (
                  <li key={i} className="flex gap-2"><span className="text-accent">•</span>{ing}</li>
                ))}
              </ul>
            </div>
          )}
          {meal.instructions && (
            <div>
              <h5 className="text-xs uppercase tracking-wide text-fg-subtle mb-1">How to make it</h5>
              <p className="text-fg-muted leading-relaxed">{meal.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PrefsWizard({
  initial, building, error, onCancel, onGenerate,
}: {
  initial: { likes: string; dislikes: string; allergies: string; style: string; prepTimeMin: number };
  building: boolean;
  error: string | null;
  onCancel: () => void;
  onGenerate: (p: { likes: string; dislikes: string; allergies: string; style: string; prepTimeMin: number }) => void;
}) {
  const [prefs, setPrefs] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onCancel}>
      <div
        className="w-full sm:max-w-lg card rounded-b-none sm:rounded-card max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Tell us your preferences</h3>
          <button onClick={onCancel} className="btn-ghost text-sm">Close</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="label">Foods you love</label>
            <input className="input" value={prefs.likes}
              onChange={(e) => setPrefs({ ...prefs, likes: e.target.value })}
              placeholder="e.g. salmon, eggs, sweet potato, berries" />
          </div>
          <div>
            <label className="label">Foods to avoid (dislikes)</label>
            <input className="input" value={prefs.dislikes}
              onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
              placeholder="e.g. mushrooms, tofu, cottage cheese" />
          </div>
          <div>
            <label className="label">Allergies</label>
            <input className="input" value={prefs.allergies}
              onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })}
              placeholder="e.g. dairy, peanuts, shellfish" />
          </div>
          <div>
            <label className="label">Diet style</label>
            <select className="input" value={prefs.style}
              onChange={(e) => setPrefs({ ...prefs, style: e.target.value })}>
              <option value="omnivore">Omnivore</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="low-carb">Low-carb</option>
              <option value="keto">Keto</option>
            </select>
          </div>
          <div>
            <label className="label">Max prep time per meal: {prefs.prepTimeMin} min</label>
            <input type="range" min={10} max={60} step={5} value={prefs.prepTimeMin}
              onChange={(e) => setPrefs({ ...prefs, prepTimeMin: Number(e.target.value) })}
              className="w-full accent-[rgb(var(--accent))]" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button onClick={() => onGenerate(prefs)} disabled={building} className="btn-primary w-full">
            {building ? "Building your plan…" : "Generate plan →"}
          </button>
          <p className="text-xs text-fg-subtle text-center">~10-15 seconds</p>
        </div>
      </div>
    </div>
  );
}

function normalizePrefs(p: Record<string, unknown>) {
  return {
    likes: (p.likes as string) ?? "",
    dislikes: (p.dislikes as string) ?? "",
    allergies: (p.allergies as string) ?? "",
    style: (p.style as string) ?? "omnivore",
    prepTimeMin: (p.prepTimeMin as number) ?? 30,
  };
}
