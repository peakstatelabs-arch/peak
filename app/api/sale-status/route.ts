import { NextResponse } from "next/server";
import { saleStatus } from "@/app/lib/sale";

export const dynamic = "force-dynamic";

// Server-clock sale state for the client UI. Display only — the checkout
// route re-evaluates the sale itself and never trusts the browser.
export async function GET() {
  return NextResponse.json(saleStatus(), {
    headers: { "Cache-Control": "no-store" },
  });
}
