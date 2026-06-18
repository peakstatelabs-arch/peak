export type Goal = "cut" | "recomp" | "bulk";
export type Sex = "male" | "female";

export type MacroTargets = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type TargetInputs = {
  sex: Sex;
  age: number;
  weightLb: number;
  heightIn: number;
  activity: number;
  goal: Goal;
};

/** Mifflin-St Jeor BMR → TDEE → goal-adjusted target + macro split. */
export function computeTargets(i: TargetInputs): MacroTargets & { bmr: number; tdee: number } {
  const kg = i.weightLb / 2.20462;
  const cm = i.heightIn * 2.54;
  const bmr = i.sex === "male"
    ? 10 * kg + 6.25 * cm - 5 * i.age + 5
    : 10 * kg + 6.25 * cm - 5 * i.age - 161;
  const tdee = bmr * i.activity;
  const kcal = i.goal === "cut" ? tdee - 500 : i.goal === "bulk" ? tdee + 300 : tdee - 100;
  const protein = Math.round(kg * (i.goal === "cut" ? 2.4 : 2.0));
  const fat = Math.round((kcal * 0.25) / 9);
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcal: Math.round(kcal),
    protein,
    carbs,
    fat,
  };
}

export const DEFAULT_TARGETS: MacroTargets = { kcal: 2200, protein: 180, carbs: 200, fat: 60 };

export type MealLog = {
  id: string;
  logged_for: string;
  meal_type: string;
  description: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  items: { name: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }[] | null;
  source: string;
  created_at: string;
};

export function sumMacros(logs: MealLog[]): MacroTargets {
  return logs.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      protein: acc.protein + m.protein_g,
      carbs: acc.carbs + m.carbs_g,
      fat: acc.fat + m.fat_g,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export function mealTypeLabel(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
