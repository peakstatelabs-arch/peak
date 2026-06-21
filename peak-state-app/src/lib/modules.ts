// Optional modules: features hidden from the nav by default to keep the
// first-time experience focused on the one job (log doses, track progress).
// Clients can opt into any of these from Profile → More features.

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export type ModuleSlug = "workouts" | "nutrition" | "community" | "dosing-guide";

export type ModuleDef = {
  slug: ModuleSlug;
  label: string;
  blurb: string;
  href: string;
};

export const MODULES: ModuleDef[] = [
  {
    slug: "workouts",
    label: "Workouts",
    blurb:
      "12-week recomp programs, AI custom plans, set-by-set logger with rest timer + PR detection.",
    href: "/workouts",
  },
  {
    slug: "nutrition",
    label: "Nutrition",
    blurb:
      "Macros, meal logging, AI photo scan, AI 7-day meal plans, and your metabolic-type coach.",
    href: "/nutrition",
  },
  {
    slug: "community",
    label: "Community",
    blurb: "Wins, comments, weekly challenges, and streak leaderboard with other clients.",
    href: "/community",
  },
  {
    slug: "dosing-guide",
    label: "Dosing Guide",
    blurb:
      "Reference pages for each peptide — protocols, dose ranges, reconstitution calculator.",
    href: "/dosing-guide",
  },
];

export function isModuleEnabled(enabled: string[] | null | undefined, slug: ModuleSlug): boolean {
  return Array.isArray(enabled) && enabled.includes(slug);
}

/**
 * Server-side gate. Call at the top of a module's page server component.
 * If the signed-in user hasn't enabled the module, bounce them to /profile
 * where they can flip it on.
 */
export async function requireModule(slug: ModuleSlug): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("enabled_modules")
    .eq("id", user.id)
    .single();
  if (!isModuleEnabled(profile?.enabled_modules, slug)) {
    redirect(`/profile?enable=${slug}`);
  }
}
