import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

/**
 * Persist terms acceptance via admin client so RLS or any iOS Safari
 * cookie weirdness can't drop the write silently the way it did with
 * password change. Logs each step to Vercel so we can debug live
 * issues against real-user accounts.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("accept-terms: no user from cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { version } = await request.json();
  if (typeof version !== "string" || !version) {
    return NextResponse.json({ error: "Missing terms version." }, { status: 400 });
  }

  console.log("accept-terms: starting", { userId: user.id, version });

  const admin = createAdminClient();
  const { error, data } = await admin
    .from("profiles")
    .update({
      terms_accepted_at: new Date().toISOString(),
      terms_version: version,
    })
    .eq("id", user.id)
    .select("id, must_change_password, terms_accepted_at, terms_version");

  if (error) {
    console.error("accept-terms: profile update failed", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("accept-terms: profile after update", data);

  return NextResponse.json({ ok: true });
}
