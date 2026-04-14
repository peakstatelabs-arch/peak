import { NextRequest, NextResponse } from "next/server";

// Zapier Catch Hook that forwards research-access signups into ClickFunnels 2.0.
// Hardcoded because catch-hook URLs are write-only (they can't read anything),
// but can be overridden via the ZAPIER_CF_WEBHOOK_URL env var without a redeploy.
const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/27218922/u7jnrb3/";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name ?? body.username ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const webhookUrl = process.env.ZAPIER_CF_WEBHOOK_URL || ZAPIER_WEBHOOK_URL;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "";
    const userAgent = req.headers.get("user-agent") || "";

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        timestamp: new Date().toISOString(),
        source: "research-access-form",
        ip,
        user_agent: userAgent,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Zapier webhook error:", response.status, responseText);
      return NextResponse.json(
        { error: "Failed to record account" },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: "Account recorded", email });
  } catch (err) {
    console.error("Research access error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
