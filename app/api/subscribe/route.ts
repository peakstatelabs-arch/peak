import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

function readSubscribers(): { email: string; subscribedAt: string }[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSubscribers(subscribers: { email: string; subscribedAt: string }[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const subscribers = readSubscribers();
    const alreadyExists = subscribers.some((s) => s.email === email);

    if (alreadyExists) {
      return NextResponse.json({ message: "Already subscribed", email });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });
    writeSubscribers(subscribers);

    return NextResponse.json({ message: "Subscribed successfully", email });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
