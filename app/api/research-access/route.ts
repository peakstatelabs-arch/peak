import { NextRequest, NextResponse } from "next/server";

// Google Apps Script Web App URL for the Research Access sheet.
// Hardcoded because this endpoint is "Anyone" access — not a secret.
const SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzBB8nrTJfVLQ95JPGjApbVe9CJ8MIhU1RBiV8-Z58EeQ2n6LxY1MdvJijxv2tpN5OTPg/exec";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = (body.username ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const sheetUrl = process.env.AccountCreation || SHEETS_WEBHOOK_URL;

    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        timestamp: new Date().toISOString(),
      }),
      redirect: "follow",
    });

    const responseText = await response.text();
    console.log("Google Sheets response status:", response.status);
    console.log("Google Sheets response body:", responseText);

    if (!response.ok) {
      console.error("Google Sheets API error:", response.status, responseText);
      return NextResponse.json(
        { error: "Failed to save account", upstream: responseText },
        { status: 502 }
      );
    }

    // Apps Script always returns 200 even on internal errors, so inspect the body.
    try {
      const parsed = JSON.parse(responseText);
      if (parsed && parsed.error) {
        console.error("Apps Script reported error:", parsed.error);
        return NextResponse.json(
          { error: "Sheet write failed", upstream: parsed.error },
          { status: 502 }
        );
      }
    } catch {
      // If Apps Script returned HTML (e.g., the "Authorization required" page),
      // this catch hits — log the raw body above for debugging.
    }

    return NextResponse.json({ message: "Account recorded", email });
  } catch (err) {
    console.error("Research access error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
