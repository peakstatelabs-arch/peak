import { NextResponse } from "next/server";
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

export async function GET() {
  const subscribers = readSubscribers();

  return NextResponse.json({
    total: subscribers.length,
    subscribers,
  });
}
