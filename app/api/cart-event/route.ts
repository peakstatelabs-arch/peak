import { NextRequest, NextResponse } from "next/server";

// Zapier Catch Hook for Add-to-Cart click events. Hardcoded with an env
// override so it can be swapped without a redeploy.
const ZAPIER_WEBHOOK_URL =
  process.env.ZAPIER_ADD_TO_CART_WEBHOOK_URL ||
  "https://hooks.zapier.com/hooks/catch/27218922/4ytdskf/";

// Simple GET so production can be probed in a browser without making the
// route public-write only. Returns 200 if the route is deployed.
export async function GET() {
  return NextResponse.json({ ok: true, method: "GET" });
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown> = {};

  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    // Malformed JSON — keep an empty payload and continue. We never block
    // the client; the worst case is Zapier receives a near-empty event.
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "";
  const userAgent = req.headers.get("user-agent") || "";

  const body = {
    event: "add_to_cart_click",
    timestamp: new Date().toISOString(),
    ...payload,
    ip,
    user_agent: userAgent,
  };

  // Await the upstream fetch so Vercel's serverless runtime doesn't freeze the
  // function before the request leaves the network. We still catch errors so
  // the client always gets a 200 — Zapier outages must never block checkout.
  let upstreamStatus: number | null = null;
  try {
    const res = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    upstreamStatus = res.status;
    if (!res.ok) {
      console.error(
        "Zapier add-to-cart webhook non-OK:",
        res.status,
        await res.text(),
      );
    }
  } catch (err) {
    console.error("Zapier add-to-cart webhook failed:", err);
  }

  return NextResponse.json({ ok: true, upstreamStatus });
}
