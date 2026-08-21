import { NextRequest, NextResponse } from "next/server";

// Captures leads from the POWER CUT 10%-code popup (email only).
//
// Storage target, in order of preference:
//   1. POWERCUT_LEADS  — a dedicated Apps Script / Zapier catch-hook URL.
//   2. Subscribers     — the existing email Google Apps Script sheet.
//
// The visitor always receives their code on a 200 as long as the email is
// valid — a storage hiccup must never cost them the discount.

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const code = process.env.POWERCUT_CODE || "PEAKSTATE";
    const storeUrl = process.env.POWERCUT_LEADS || process.env.Subscribers;

    if (storeUrl) {
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        req.headers.get("x-real-ip") ||
        "";
      const userAgent = req.headers.get("user-agent") || "";

      try {
        const response = await fetch(storeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            source: "powercut-10-code",
            timestamp: new Date().toISOString(),
            ip,
            user_agent: userAgent,
          }),
        });
        if (!response.ok) {
          console.error("POWER CUT lead storage error:", response.status);
        }
      } catch (storeErr) {
        // Never block the visitor from getting their code on a storage failure.
        console.error("POWER CUT lead storage failed:", storeErr);
      }
    } else {
      console.warn(
        "No POWERCUT_LEADS or Subscribers env var set — lead not stored.",
      );
    }

    return NextResponse.json({ message: "Success", code });
  } catch (err) {
    console.error("POWER CUT code error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
