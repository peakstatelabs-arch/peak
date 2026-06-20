import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { sendPush, pushConfigured } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!pushConfigured()) {
    return NextResponse.json({ error: "Push isn't configured on the server." }, { status: 503 });
  }

  let payload: { userId?: string; title?: string; body?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const userId = (payload.userId || "").trim();
  const title = (payload.title || "").trim();
  const body = (payload.body || "").trim();
  if (!userId || !title || !body) {
    return NextResponse.json({ error: "userId, title, body all required." }, { status: 400 });
  }
  if (title.length > 60 || body.length > 240) {
    return NextResponse.json({ error: "Title ≤60, body ≤240 chars." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", userId);

  if (!subs || subs.length === 0) {
    return NextResponse.json({ error: "Client has no subscribed devices." }, { status: 400 });
  }

  let sent = 0;
  let expired = 0;
  for (const s of subs) {
    const result = await sendPush(s, {
      title,
      body,
      url: "/portal/dashboard",
      tag: `coach-${Date.now()}`,
    });
    if (result === "sent") sent++;
    if (result === "expired") {
      expired++;
      await admin.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
    }
  }

  return NextResponse.json({ ok: true, sent, expired });
}
