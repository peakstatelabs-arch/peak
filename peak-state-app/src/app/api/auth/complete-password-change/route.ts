import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await request.json();
  if (typeof password !== "string" || password.length < 10) {
    return NextResponse.json(
      { error: "Password must be at least 10 characters." },
      { status: 400 }
    );
  }

  // Use the admin client for both writes so the must_change_password flag
  // can't be blocked by RLS and the two updates can't race against the
  // post-redirect layout check.
  const admin = createAdminClient();

  const { error: pwError } = await admin.auth.admin.updateUserById(user.id, {
    password,
  });
  if (pwError) {
    return NextResponse.json({ error: pwError.message }, { status: 400 });
  }

  const { error: profileError } = await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
