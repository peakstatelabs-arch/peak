import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPush, pushConfigured } from "@/lib/push";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!pushConfigured()) {
    return NextResponse.json(
      { error: "Push isn't configured. Add VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY in Vercel project settings." },
      { status: 503 }
    );
  }

  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", user.id);

  if (!subs || subs.length === 0) {
    return NextResponse.json({ error: "No subscribed devices. Enable reminders first." }, { status: 400 });
  }

  let sent = 0;
  let expired = 0;
  for (const s of subs) {
    const result = await sendPush(s, {
      title: "Peak State Labs",
      body: "Test reminder — push is working. 🎯",
      url: "/portal/peptide-tracker",
      tag: "test",
    });
    if (result === "sent") sent++;
    if (result === "expired") {
      expired++;
      await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
    }
  }

  return NextResponse.json({ ok: true, sent, expired });
}
