// Black Friday / Cyber Monday sale. Single source of truth for the sale
// window, the vial-count discount ladder, POWER CUT™ sale prices + promo codes
// and cart pricing. No imports from the app's alias paths so it can be used
// from middleware, server routes, client components and scripts.
//
// Every check is driven by the server clock (or a signed-off preview cookie,
// see resolveSalePhase), so nothing needs to be changed by hand when the sale
// starts, flips from Black Friday to Cyber Monday, or ends.

import { SINGLES_PRICE_IDS, isStackPriceId } from "../singles/cart/priceCatalog";
import { bulkTierForQty, maxSameProductQty } from "./bulkDiscount";

// ── Sale window (America/New_York; EST = UTC-5 for all of these dates) ─────
export const SALE_STARTS_AT_MS = Date.parse("2026-11-20T00:00:00.000-05:00");
/** Black Friday branding runs to the end of Friday Nov 27… */
export const BLACK_FRIDAY_ENDS_AT_MS = Date.parse("2026-11-27T23:59:59.999-05:00");
/** …then Cyber Monday branding until the sale ends Monday Nov 30. */
export const SALE_ENDS_AT_MS = Date.parse("2026-11-30T23:59:59.999-05:00");

export type SalePhase = "pre" | "bf" | "cm" | "over";

export function salePhaseAt(nowMs: number): SalePhase {
  if (nowMs < SALE_STARTS_AT_MS) return "pre";
  if (nowMs <= BLACK_FRIDAY_ENDS_AT_MS) return "bf";
  if (nowMs <= SALE_ENDS_AT_MS) return "cm";
  return "over";
}

export const isSaleLive = (phase: SalePhase) => phase === "bf" || phase === "cm";

/** When the current phase's countdown runs out (null outside the sale). */
export function phaseEndsAtMs(phase: SalePhase): number | null {
  if (phase === "bf") return BLACK_FRIDAY_ENDS_AT_MS;
  if (phase === "cm") return SALE_ENDS_AT_MS;
  return null;
}

export const SALE_NAME: Record<SalePhase, string> = {
  pre: "Black Friday",
  bf: "Black Friday",
  cm: "Cyber Monday",
  over: "Black Friday",
};

export const SALE_HEADLINE = "Up to 60% off stacks";

// ── Preview mode ────────────────────────────────────────────────────────────
// Visiting any page with ?salepreview=<SALE_PREVIEW_SECRET>&mode=<phase> sets
// this cookie for that browser only, making the whole site (pages, cart AND
// checkout) behave as if it were that phase. mode=off clears it. Without the
// SALE_PREVIEW_SECRET env var set, preview is disabled entirely.
export const PREVIEW_COOKIE = "ps_sale_preview";
export const PREVIEW_MODES: SalePhase[] = ["pre", "bf", "cm", "over"];

export function previewCookieValue(mode: SalePhase, secret: string): string {
  return `${mode}.${secret}`;
}

/** Phase for this request: the preview cookie wins if it carries the secret. */
export function resolveSalePhase(
  nowMs: number,
  previewCookie: string | undefined | null,
  secret: string | undefined | null,
): SalePhase {
  if (previewCookie && secret) {
    const dot = previewCookie.indexOf(".");
    const mode = previewCookie.slice(0, dot) as SalePhase;
    if (
      dot > 0 &&
      previewCookie.slice(dot + 1) === secret &&
      PREVIEW_MODES.includes(mode)
    ) {
      return mode;
    }
  }
  return salePhaseAt(nowMs);
}

// ── "Continue to regular site" opt-out ──────────────────────────────────────
/** Set when a visitor picks the regular site; "/" then skips the sale page. */
export const REGULAR_SITE_COOKIE = "ps_regular_site";

// ── The discount ladder (by TOTAL vials in the cart) ────────────────────────
export const LADDER: { minVials: number; pct: number }[] = [
  { minVials: 2, pct: 30 },
  { minVials: 4, pct: 35 },
  { minVials: 6, pct: 40 },
];
/** One Reta vial on its own (nothing else in the cart). */
export const LONE_RETA_PCT = 20;
/** Add-ons bought after a POWER CUT™ (already 6 vials) get the top tier. */
export const POWERCUT_ADDON_PCT = 40;

export const RETA_PRICE_ID = SINGLES_PRICE_IDS.retatrutide;

export function ladderPct(vials: number): number {
  let pct = 0;
  for (const t of LADDER) if (vials >= t.minVials) pct = t.pct;
  return pct;
}

/** The next ladder step from `vials`, or null at the top. */
export function nextLadderStep(vials: number): { pct: number; addVials: number } | null {
  for (const t of LADDER) {
    if (vials < t.minVials) return { pct: t.pct, addVials: t.minVials - vials };
  }
  return null;
}

type QtyLine = { priceId: string; quantity: number };

/** Sale percent for a set of (non-stack) lines. */
export function salePctForLines(lines: QtyLine[], powerCutAddon = false): number {
  const vials = lines.reduce((n, l) => n + l.quantity, 0);
  if (vials === 0) return 0;
  if (powerCutAddon) return POWERCUT_ADDON_PCT;
  if (vials === 1 && lines.some((l) => l.priceId === RETA_PRICE_ID)) {
    return LONE_RETA_PCT;
  }
  return ladderPct(vials);
}

/** Price of `listCents` at `pct` off, rounded to the cent. */
export function pctOff(listCents: number, pct: number): number {
  return listCents - Math.round((listCents * pct) / 100);
}

// ── POWER CUT™ (Payment Links on its own Stripe account) ────────────────────
// Sale price comes from a Stripe promo code pre-applied on the Payment Link.
// valueCents = the same vials bought as singles (2 / 4 / 6 vials each of
// Reta $215, CJC/IPA $105, BPC/TB $145).
export const POWERCUT_VALUE_CENTS: Record<string, number> = {
  single: 93000,
  double: 186000,
  triple: 279000,
};

export const POWERCUT_SALE: Record<string, { code: string; saleCents: number }> = {
  single: { code: "TRANSFORM", saleCents: 44900 },
  double: { code: "TRANSFORM2", saleCents: 79900 },
  triple: { code: "TRANSFORM3", saleCents: 109900 },
};

/** Payment Link URL with the sale code pre-applied at Stripe checkout. */
export function withPromoCode(url: string, code: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}prefilled_promo_code=${encodeURIComponent(code)}`;
}

// ── Cart pricing (shared by the cart drawer and the checkout route) ─────────
export type PriceLineInput = QtyLine & {
  /** List unit price in cents. */
  unitPriceCents: number;
};

export type PricedCart = {
  /** The Black Friday ladder is pricing this cart. */
  saleLive: boolean;
  /** A FULL REPAIR stack is in the cart (fixed price, no codes). */
  hasStackLines: boolean;
  /** Everything at list price. */
  subtotalCents: number;
  /** Vials that count toward the sale ladder (stacks excluded). */
  saleVials: number;
  /** Percent off the discountable lines (sale ladder or normal bulk tier). */
  pct: number;
  discountCents: number;
  totalCents: number;
  /** Sale only: the next ladder step, to nudge toward. */
  next: { pct: number; addVials: number } | null;
};

/**
 * Sale live: every vial counts toward the ladder (2 → 30%, 4 → 35%, 6+ → 40%,
 * a lone Reta vial 20%), applied to the whole cart except fixed-price stacks.
 * Otherwise: the normal bulk discount (highest single-product quantity).
 */
export function priceCart(
  lines: PriceLineInput[],
  saleLive: boolean,
  powerCutAddon = false,
): PricedCart {
  let subtotalCents = 0;
  let stackCents = 0;
  let discountableCents = 0;
  const discountable: PriceLineInput[] = [];

  for (const l of lines) {
    const list = l.unitPriceCents * l.quantity;
    subtotalCents += list;
    if (isStackPriceId(l.priceId)) {
      stackCents += list;
    } else {
      discountable.push(l);
      discountableCents += list;
    }
  }

  const saleVials = discountable.reduce((n, l) => n + l.quantity, 0);
  const pct = saleLive
    ? salePctForLines(discountable, powerCutAddon)
    : (bulkTierForQty(maxSameProductQty(discountable))?.pct ?? 0);
  const discountCents = Math.round((discountableCents * pct) / 100);

  return {
    saleLive,
    hasStackLines: stackCents > 0,
    subtotalCents,
    saleVials,
    pct,
    discountCents,
    totalCents: subtotalCents - discountCents,
    next: saleLive && !powerCutAddon ? nextLadderStep(saleVials) : null,
  };
}
