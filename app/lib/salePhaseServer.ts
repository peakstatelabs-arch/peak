import { cookies } from "next/headers";
import {
  PREVIEW_COOKIE,
  isSaleLive,
  resolveSalePhase,
  type SalePhase,
} from "./sale";
import type { SaleStatus } from "./useSaleStatus";

/** Sale phase for the current request (server clock + preview cookie). */
export async function getSalePhase(): Promise<SalePhase> {
  const jar = await cookies();
  return resolveSalePhase(
    Date.now(),
    jar.get(PREVIEW_COOKIE)?.value,
    process.env.SALE_PREVIEW_SECRET,
  );
}

/** Server-rendered initial value for the client sale hooks. */
export async function getSaleStatus(): Promise<SaleStatus> {
  const phase = await getSalePhase();
  return { phase, live: isSaleLive(phase) };
}
