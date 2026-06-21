// Server-only helpers for the opt-in modules system. Kept in a separate
// file from `./modules.ts` so the client bundle never pulls in
// `next/headers` via createClient().

import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { isModuleEnabled, type ModuleSlug } from "./modules";

/**
 * Call at the top of an opt-in module's page server component. If the
 * signed-in user hasn't enabled the module, bounce them to /profile
 * with the relevant toggle highlighted.
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
