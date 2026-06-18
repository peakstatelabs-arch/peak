import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { NutritionClient } from "./NutritionClient";
import { DEFAULT_TARGETS, todayISO } from "@/lib/nutrition";

export const metadata = { title: "Nutrition — Peak State Labs" };

export default function NutritionPage() {
  return (
    <>
      <PageHeader title="Nutrition" description="Track meals. Hit your macros. Stay in your range." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const today = todayISO();
  const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

  const [{ data: todayMeals }, { data: weekMeals }, { data: profile }, { data: activePlan }, { data: activeProtocols }] = await Promise.all([
    supabase.from("meal_logs")
      .select("id, logged_for, meal_type, description, kcal, protein_g, carbs_g, fat_g, items, source, created_at")
      .eq("user_id", user.id).eq("logged_for", today).order("created_at"),
    supabase.from("meal_logs")
      .select("logged_for, kcal, protein_g, carbs_g, fat_g")
      .eq("user_id", user.id).gte("logged_for", sevenAgo).order("logged_for"),
    supabase.from("profiles")
      .select("metabolic_type, nutrition_targets, dietary_prefs")
      .eq("id", user.id).single(),
    supabase.from("meal_plans")
      .select("id, week_start, plan, created_at")
      .eq("user_id", user.id).eq("active", true)
      .order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("peptide_protocols")
      .select("peptide_name")
      .eq("user_id", user.id).eq("active", true),
  ]);

  const targets = (profile?.nutrition_targets as Record<string, number> | null) ?? null;
  const initialTargets = targets
    ? {
        kcal: targets.kcal ?? DEFAULT_TARGETS.kcal,
        protein: targets.protein ?? DEFAULT_TARGETS.protein,
        carbs: targets.carbs ?? DEFAULT_TARGETS.carbs,
        fat: targets.fat ?? DEFAULT_TARGETS.fat,
      }
    : DEFAULT_TARGETS;
  const goal = (targets?.goal as unknown as string) ?? "recomp";

  return (
    <NutritionClient
      todayMeals={todayMeals ?? []}
      weekMeals={weekMeals ?? []}
      targets={initialTargets}
      goal={goal}
      metabolicType={profile?.metabolic_type ?? null}
      dietaryPrefs={(profile?.dietary_prefs as Record<string, unknown> | null) ?? {}}
      activePlan={activePlan ?? null}
      activePeptides={(activeProtocols ?? []).map((p) => p.peptide_name)}
      savedInputs={(targets?.inputs as unknown as Record<string, unknown> | null) ?? null}
    />
  );
}
