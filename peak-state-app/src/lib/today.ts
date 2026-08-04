import type { createClient } from "@/lib/supabase/server";
import { todayInZone } from "@/lib/utils";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

/**
 * The user's saved IANA timezone (`profiles.timezone`), or null if unset.
 * Server-side counterpart to the client `useTimezone()` hook.
 */
export async function getUserTimezone(
  supabase: ServerClient,
  userId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", userId)
    .single();
  return (data as { timezone: string | null } | null)?.timezone ?? null;
}

/**
 * "Today" (YYYY-MM-DD) in the user's saved timezone. Use this in server
 * components instead of `todayISO()` / `new Date().toISOString().slice(0,10)`,
 * which resolve to UTC and roll the date over in the evening for users west of
 * UTC.
 */
export async function getUserTodayISO(
  supabase: ServerClient,
  userId: string,
): Promise<string> {
  return todayInZone(await getUserTimezone(supabase, userId));
}
