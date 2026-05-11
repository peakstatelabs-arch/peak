import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { email, password, firstName, lastName } = await request.json();
  if (!email || !password || password.length < 10) {
    return NextResponse.json({ error: "Email and a 10+ char password required." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("profiles").upsert({
    id: data.user!.id,
    first_name: firstName || null,
    last_name: lastName || null,
    role: "client",
    must_change_password: true,
    disclaimer_dismissed: false,
  });

  return NextResponse.json({ ok: true, userId: data.user!.id });
}
