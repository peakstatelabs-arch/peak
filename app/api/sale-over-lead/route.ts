import { NextRequest, NextResponse } from "next/server";
import { SMS_MIN_AGE, ageFromDob } from "@/app/lib/smsOptInCopy";
import { SALE_OVER_CONSENT_TEXT } from "@/app/lib/saleOverCopy";

export const runtime = "nodejs";

// Members-only sale waitlist (the "sale is over" page). Sent to its own Zapier
// Catch Hook so these marketing leads stay separate from post-purchase support
// opt-ins. Until ZAPIER_SALE_OVER_WEBHOOK_URL is set, leads are only logged in
// Vercel (search "Sale-over lead:").
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const phone = normalizePhone(typeof body.phone === "string" ? body.phone : "");
  if (!phone) {
    return NextResponse.json({ error: "Please enter a valid mobile number." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "Please tick the box to agree." }, { status: 400 });
  }
  const dob = typeof body.dob === "string" ? body.dob : "";
  const today = new Date().toISOString().slice(0, 10);
  const age = ageFromDob(dob, today);
  if (age === null || age < SMS_MIN_AGE) {
    return NextResponse.json({ error: `You must be ${SMS_MIN_AGE} or older.` }, { status: 400 });
  }

  const lead = {
    phone,
    email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
    dob,
    tag: "members-sale-waitlist",
    source: typeof body.source === "string" ? body.source : "sale-over",
    page: typeof body.page === "string" ? body.page : "",
    consent_text: SALE_OVER_CONSENT_TEXT,
    opted_in_at: new Date().toISOString(),
    ip: req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "",
    user_agent: req.headers.get("user-agent") || "",
  };
  console.log("Sale-over lead:", JSON.stringify(lead));

  const hook = process.env.ZAPIER_SALE_OVER_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) console.error("Sale-over Zapier error:", res.status, await res.text());
    } catch (err) {
      console.error("Sale-over Zapier error:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
