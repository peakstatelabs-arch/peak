import { NextRequest, NextResponse } from "next/server";

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

    const sheetUrl = process.env.AccountCreation;
    if (!sheetUrl) {
      console.error("AccountCreation env variable is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error("Google Sheets API error:", response.status);
      return NextResponse.json({ error: "Failed to save account" }, { status: 502 });
    }

    return NextResponse.json({ message: "Account recorded", email });
  } catch (err) {
    console.error("Research access error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
