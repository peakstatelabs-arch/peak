import { NextResponse } from "next/server";
import {
  RETA_SALE_CUTOFF_MS,
  SALE_ENDS_AT_MS,
  saleStatus,
} from "@/app/lib/sale";

export const dynamic = "force-dynamic";

// Server-clock sale state for the client UI. Display only — the checkout
// route re-evaluates the sale itself and never trusts the browser. `serverNow`
// lets countdowns run off the server's clock instead of the visitor's.
export async function GET() {
  const now = Date.now();
  return NextResponse.json(
    {
      ...saleStatus(now),
      serverNow: now,
      endsAt: { reta: RETA_SALE_CUTOFF_MS, powerCut: SALE_ENDS_AT_MS },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
