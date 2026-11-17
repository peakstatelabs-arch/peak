import { NextResponse } from "next/server";
import { isSaleLive, phaseEndsAtMs } from "@/app/lib/sale";
import { getSalePhase } from "@/app/lib/salePhaseServer";

export const dynamic = "force-dynamic";

// Server-clock sale state for the client UI (honours the preview cookie).
// Display only — the checkout route re-evaluates the sale itself and never
// trusts the browser. `serverNow` lets countdowns run off the server's clock.
export async function GET() {
  const now = Date.now();
  const phase = await getSalePhase();
  return NextResponse.json(
    {
      phase,
      live: isSaleLive(phase),
      serverNow: now,
      endsAt: phaseEndsAtMs(phase),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
