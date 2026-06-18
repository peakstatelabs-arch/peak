"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { TodayNutrition } from "./TodayNutrition";
import { MealPlanView } from "./MealPlanView";
import { NutritionCoach } from "./NutritionCoach";
import { NutritionProfile } from "./NutritionProfile";
import type { MacroTargets, MealLog } from "@/lib/nutrition";

export type Plan = {
  id: string;
  week_start: string;
  plan: PlanData;
  created_at: string;
};

export type PlanMeal = {
  type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  description: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  prep_min?: number;
  ingredients?: string[];
  instructions?: string;
};

export type PlanData = {
  name: string;
  summary: string;
  days: { day_index: number; day_label: string; meals: PlanMeal[] }[];
  grocery: string[];
};

type Tab = "today" | "plan" | "coach" | "profile";

export function NutritionClient({
  todayMeals,
  weekMeals,
  targets,
  goal,
  metabolicType,
  dietaryPrefs,
  activePlan,
  activePeptides,
  savedInputs,
}: {
  todayMeals: MealLog[];
  weekMeals: { logged_for: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }[];
  targets: MacroTargets;
  goal: string;
  metabolicType: string | null;
  dietaryPrefs: Record<string, unknown>;
  activePlan: Plan | null;
  activePeptides: string[];
  savedInputs: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("today");

  const refresh = () => router.refresh();

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-lg bg-bg-elev border border-border p-1 overflow-x-auto">
        {([
          ["today", "Today"],
          ["plan", "Plan"],
          ["coach", "Coach"],
          ["profile", "Targets"],
        ] as [Tab, string][]).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "flex-1 min-w-[64px] rounded-md py-2 text-sm font-medium transition whitespace-nowrap",
              tab === value ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "today" && (
        <TodayNutrition
          meals={todayMeals}
          weekMeals={weekMeals}
          targets={targets}
          onChanged={refresh}
        />
      )}
      {tab === "plan" && (
        <MealPlanView
          activePlan={activePlan}
          targets={targets}
          goal={goal}
          metabolicType={metabolicType}
          dietaryPrefs={dietaryPrefs}
          onChanged={refresh}
        />
      )}
      {tab === "coach" && (
        <NutritionCoach
          targets={targets}
          goal={goal}
          metabolicType={metabolicType}
          todayMeals={todayMeals}
          activePeptides={activePeptides}
        />
      )}
      {tab === "profile" && (
        <NutritionProfile
          targets={targets}
          goal={goal}
          savedInputs={savedInputs}
          metabolicType={metabolicType}
          dietaryPrefs={dietaryPrefs}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
