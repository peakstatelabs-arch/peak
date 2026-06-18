"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { sumMacros, MEAL_TYPES, mealTypeLabel, type MacroTargets, type MealLog, type MealType, todayISO } from "@/lib/nutrition";
import { cn } from "@/lib/utils";
import { AddMealSheet } from "./AddMealSheet";

export function TodayNutrition({
  meals,
  weekMeals,
  targets,
  onChanged,
}: {
  meals: MealLog[];
  weekMeals: { logged_for: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }[];
  targets: MacroTargets;
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [addingType, setAddingType] = useState<MealType | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const totals = useMemo(() => sumMacros(meals), [meals]);

  async function remove(id: string) {
    setRemoving(id);
    await supabase.from("meal_logs").delete().eq("id", id);
    setRemoving(null);
    onChanged();
  }

  const weekTotals = aggregateWeek(weekMeals);

  // group by meal type
  const grouped: Record<MealType, MealLog[]> = {
    breakfast: [], lunch: [], dinner: [], snack: [],
  };
  for (const m of meals) {
    const k = (m.meal_type as MealType);
    if (grouped[k]) grouped[k].push(m);
    else grouped.snack.push(m);
  }

  return (
    <div className="space-y-5">
      {/* Macro rings */}
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{new Date().toLocaleDateString("en-US", { weekday: "long" })}</h3>
            <p className="text-xs text-fg-muted">{todayISO()}</p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-semibold">
              {totals.kcal} <span className="text-sm text-fg-muted">/ {targets.kcal}</span>
            </div>
            <div className="text-xs text-fg-subtle">{Math.max(0, targets.kcal - totals.kcal)} kcal left</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <MacroRing label="kcal" done={totals.kcal} target={targets.kcal} color="rgb(var(--accent))" big />
          <MacroRing label="Protein" done={totals.protein} target={targets.protein} color="#60a5fa" />
          <MacroRing label="Carbs" done={totals.carbs} target={targets.carbs} color="#fb7185" />
          <MacroRing label="Fat" done={totals.fat} target={targets.fat} color="#fbbf24" />
        </div>
      </section>

      {/* Week strip */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">This week</h3>
          <span className="text-xs text-fg-subtle">{weekTotals.compliantDays}/7 days on target</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekTotals.days.map((d) => (
            <div key={d.day} className="text-center">
              <div className={cn(
                "h-12 rounded-md flex items-end overflow-hidden border border-border bg-bg-elev"
              )}>
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${Math.min(110, Math.round((d.kcal / targets.kcal) * 100))}%`,
                    background: d.kcal === 0 ? "transparent"
                      : d.kcal > targets.kcal * 1.1 ? "rgb(220 38 38 / 0.5)"
                      : d.kcal < targets.kcal * 0.7 ? "rgb(var(--fg-subtle) / 0.4)"
                      : "rgb(var(--accent) / 0.7)",
                  }}
                />
              </div>
              <div className="text-[10px] text-fg-subtle mt-1">{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Meals by type */}
      {MEAL_TYPES.map((type) => (
        <section key={type} className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">{mealTypeLabel(type)}</h3>
            <button onClick={() => setAddingType(type)} className="btn-primary text-xs">
              + Log
            </button>
          </div>
          {grouped[type].length === 0 ? (
            <p className="text-sm text-fg-subtle">Nothing logged yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {grouped[type].map((m) => (
                <li key={m.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{m.description}</span>
                      {m.source.startsWith("ai") && (
                        <span className="chip-accent text-[9px]">AI</span>
                      )}
                    </div>
                    <div className="text-xs text-fg-muted mt-0.5">
                      {m.kcal} kcal · {m.protein_g}P · {m.carbs_g}C · {m.fat_g}F
                    </div>
                  </div>
                  <button
                    onClick={() => remove(m.id)}
                    disabled={removing === m.id}
                    className="btn-ghost text-xs text-danger flex-shrink-0"
                    aria-label="Remove"
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {addingType && (
        <AddMealSheet
          mealType={addingType}
          onCancel={() => setAddingType(null)}
          onSaved={() => { setAddingType(null); onChanged(); }}
        />
      )}
    </div>
  );
}

function MacroRing({
  label, done, target, color, big,
}: {
  label: string;
  done: number;
  target: number;
  color: string;
  big?: boolean;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((done / target) * 100)) : 0;
  const R = big ? 26 : 22;
  const C = 2 * Math.PI * R;
  const offset = C - (pct / 100) * C;
  const size = big ? 64 : 56;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={R} stroke="rgb(var(--border))" strokeWidth={4} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={R}
            stroke={color} strokeWidth={4} fill="none"
            strokeDasharray={C} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-display font-semibold", big ? "text-xs" : "text-[10px]")}>{pct}%</span>
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle mt-1.5">{label}</div>
      <div className={cn("text-xs font-medium", done > target * 1.1 ? "text-danger" : "")}>
        {done}{label === "kcal" ? "" : "g"} <span className="text-fg-subtle">/ {target}{label === "kcal" ? "" : "g"}</span>
      </div>
    </div>
  );
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function aggregateWeek(rows: { logged_for: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }[]) {
  const byDay = new Map<string, number>();
  for (const r of rows) {
    byDay.set(r.logged_for, (byDay.get(r.logged_for) ?? 0) + r.kcal);
  }
  const days: { day: string; label: string; kcal: number }[] = [];
  let compliantDays = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    const kcal = byDay.get(iso) ?? 0;
    days.push({ day: iso, label: WEEKDAY[d.getDay()], kcal });
    if (kcal > 0) compliantDays += 1;
  }
  return { days, compliantDays };
}
