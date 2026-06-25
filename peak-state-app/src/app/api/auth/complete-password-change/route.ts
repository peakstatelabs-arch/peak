import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * Flip must_change_password to false for the signed-in user.
 *
 * Why a server route: the regular user-scoped Supabase client can have
 * its update blocked by RLS or race against the post-redirect layout
 * check on /change-password → /dashboard, which is what was bouncing
 * brand-new clients into a password-change loop. The admin client
 * bypasses RLS and we await the write here so the response only
 * returns 200 after the flag is actually committed.
 */
export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
