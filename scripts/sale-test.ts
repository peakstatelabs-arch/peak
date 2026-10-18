// Offline verification of the temporary sale: pricing, Stripe session params
// (with Stripe mocked — nothing is sent to Stripe, no orders), and expiry.
// Run: npx tsx scripts/sale-test.ts
import assert from "node:assert/strict";

async function main() {

type Call = { fn: string; params: any };
const calls: Call[] = [];
const PRODUCT = (priceId: string) => `prod_${priceId}`;

class FakeStripe {
  prices = { retrieve: async (id: string) => ({ id, currency: "usd", product: PRODUCT(id) }) };
  coupons = {
    retrieve: async (id: string) => ({ id, valid: true }),
    list: async () => ({ data: [] }),
    create: async (params: any) => {
      calls.push({ fn: "coupons.create", params });
      return { id: "co_adhoc" };
    },
  };
  promotionCodes = { list: async () => ({ data: [] }) };
  checkout = {
    sessions: {
      create: async (params: any) => {
        calls.push({ fn: "sessions.create", params });
        return { id: "cs_test", url: "https://checkout.test/cs_test" };
      },
    },
  };
}
const stripePath = require.resolve("stripe");
require.cache[stripePath] = { id: stripePath, filename: stripePath, loaded: true, exports: { __esModule: true, default: FakeStripe } } as any;
process.env.STRIPE_SECRET_KEY = "sk_test_mock";

const { NextRequest } = await import("next/server");
const sale = await import("../app/lib/sale");
const { SINGLES_PRICE_IDS } = await import("../app/singles/cart/priceCatalog");
const { POST } = await import("../app/api/create-checkout-session/route");
const { TIERS, tierPricing } = await import("../app/getreta/retaBundles");

const LIST: Record<string, number> = {
  [SINGLES_PRICE_IDS.retatrutide]: 21500,
  [SINGLES_PRICE_IDS["cjc-ipamorelin"]]: 10500,
  [SINGLES_PRICE_IDS["bpc-tb500"]]: 14500,
  [SINGLES_PRICE_IDS["ghk-cu"]]: 8500,
};
const R = SINGLES_PRICE_IDS.retatrutide;
const CJC = SINGLES_PRICE_IDS["cjc-ipamorelin"];
const BPC = SINGLES_PRICE_IDS["bpc-tb500"];
const BULK_PCT: Record<string, number> = { BULK10: 10, BULK15: 15, BULK20: 20 };

const T = (iso: string) => Date.parse(iso);
const realNow = Date.now;
function at<T>(iso: string, fn: () => Promise<T>): Promise<T> {
  Date.now = () => T0(iso);
  return fn().finally(() => { Date.now = realNow; });
}
function T0(iso: string) { return Date.parse(iso); }

type Item = [string, number];
async function checkout(items: Item[], nowIso: string) {
  calls.length = 0;
  const res = await at(nowIso, () =>
    POST(new NextRequest("http://localhost/api/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ items: items.map(([priceId, quantity]) => ({ priceId, quantity })) }),
    })),
  );
  assert.equal(res.status, 200);
  const params = calls.find((c) => c.fn === "sessions.create")!.params;
  const coupon = calls.find((c) => c.fn === "coupons.create")?.params;
  // What Stripe would charge (before shipping/tax).
  let total = 0;
  const lines = params.line_items.map((li: any) => {
    const unit = li.price_data ? li.price_data.unit_amount : LIST[li.price];
    const product = li.price_data ? li.price_data.product : PRODUCT(li.price);
    return { amount: unit * li.quantity, product, saleInline: !!li.price_data };
  });
  let discount = 0;
  const d = params.discounts?.[0];
  if (d?.coupon === "co_adhoc") {
    for (const l of lines) if (coupon.applies_to.products.includes(l.product)) discount += Math.round((l.amount * coupon.percent_off) / 100);
  } else if (d?.coupon) {
    const sub = lines.reduce((n: number, l: any) => n + l.amount, 0);
    discount = Math.round((sub * BULK_PCT[d.coupon]) / 100);
  }
  total = lines.reduce((n: number, l: any) => n + l.amount, 0) - discount;
  return { params, coupon, total };
}

// Cart-drawer total for the same cart/time (must equal Stripe's).
function drawerTotal(items: Item[], nowIso: string) {
  const lines = items.map(([priceId, quantity]) => ({ priceId, quantity, unitPriceCents: LIST[priceId] }));
  return sale.priceCart(lines, sale.isRetaSaleActive(T(nowIso))).totalCents;
}

let passed = 0;
async function t(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed++;
  console.log(`ok - ${name}`);
}

const NOW = "2026-10-19T12:00:00-04:00"; // sale live
const sameAsDrawer = async (items: Item[], iso: string, expected: number) => {
  const r = await checkout(items, iso);
  assert.equal(r.total, expected, "stripe total");
  assert.equal(drawerTotal(items, iso), expected, "drawer total");
  return r;
};

// ── Window / timezone ───────────────────────────────────────────────────────
await t("sale ends Fri Oct 23 2026 11:59 PM America/New_York", () => {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", hour12: true });
  assert.equal(f.format(new Date(sale.SALE_ENDS_AT_MS)), "Friday, October 23, 2026 at 11:59 PM");
  assert.ok(sale.isPowerCutSaleActive(T("2026-10-23T23:59:00-04:00")));
  // POWER CUT is paused until midnight ET Oct 19; Reta is unaffected.
  assert.ok(!sale.isPowerCutSaleActive(T("2026-10-18T12:00:00-04:00")));
  assert.ok(!sale.isPowerCutSaleActive(T("2026-10-18T23:59:59-04:00")));
  assert.ok(sale.isPowerCutSaleActive(T("2026-10-19T00:00:00-04:00")));
  assert.ok(sale.isRetaSaleActive(T("2026-10-18T12:00:00-04:00")));
  assert.ok(!sale.isPowerCutSaleActive(T("2026-10-24T00:00:00-04:00")));
});

// ── 1-3 Reta ────────────────────────────────────────────────────────────────
await t("1 Reta = $165", async () => {
  const r = await sameAsDrawer([[R, 1]], NOW, 16500);
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.allow_promotion_codes, undefined);
  assert.equal(r.params.line_items[0].price_data.product, PRODUCT(R));
});
await t("2 Reta = $330 (no extra 10%)", async () => {
  const r = await sameAsDrawer([[R, 2]], NOW, 33000);
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.allow_promotion_codes, undefined);
});
await t("3 Reta = $495 (sale, $150 off list; no bulk coupon)", async () => {
  const r = await sameAsDrawer([[R, 3]], NOW, 49500);
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.allow_promotion_codes, undefined);
  assert.equal(r.params.line_items[0].price_data.unit_amount, 16500);
});
await t("4+ Reta keep 20% bulk", async () => {
  await sameAsDrawer([[R, 4]], NOW, 68800);
  await sameAsDrawer([[R, 5]], NOW, 86000);
});

// ── 4-6 POWER CUT (Payment Links + prefilled promo code) ────────────────────
await t("POWER CUT sale config: $499 / $849 / 3-stack untouched", () => {
  const s = sale.POWERCUT_SALE;
  assert.equal(s.single.listCents - s.single.saleCents, 10000);
  assert.equal(s.double.listCents - s.double.saleCents, 17000);
  assert.equal(s.single.saleCents, 49900);
  assert.equal(s.double.saleCents, 84900);
  assert.equal(s.triple, undefined);
  assert.equal(sale.withPromoCode("https://buy.stripe.com/x", "CUT100"), "https://buy.stripe.com/x?prefilled_promo_code=CUT100");
  assert.equal(s.single.code, "CUT100");
  assert.equal(s.double.code, "CUT170");
});

// ── 7-9 Mixed carts / discounts ─────────────────────────────────────────────
await t("mixed: 2 Reta + 1 CJC → no bulk, no promo box, $330 + $105", async () => {
  const r = await sameAsDrawer([[R, 2], [CJC, 1]], NOW, 33000 + 10500);
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.allow_promotion_codes, undefined);
});
await t("mixed: 2 Reta + 2 CJC → 10% on CJC only (scoped coupon)", async () => {
  const r = await sameAsDrawer([[R, 2], [CJC, 2]], NOW, 33000 + 18900);
  assert.deepEqual(r.coupon.applies_to.products, [PRODUCT(CJC)]);
  assert.equal(r.coupon.percent_off, 10);
  assert.equal(r.params.allow_promotion_codes, undefined);
});
await t("mixed: 1 Reta + 3 BPC → 15% on BPC only", async () => {
  const r = await sameAsDrawer([[R, 1], [BPC, 3]], NOW, 16500 + 36975);
  assert.deepEqual(r.coupon.applies_to.products, [PRODUCT(BPC)]);
});
await t("mixed: 4 Reta + 1 CJC → pre-sale behaviour (20% whole cart, BULK20)", async () => {
  const r = await sameAsDrawer([[R, 4], [CJC, 1]], NOW, Math.round((86000 + 10500) * 0.8));
  assert.deepEqual(r.params.discounts, [{ coupon: "BULK20" }]);
});
await t("mixed: 3 Reta + 1 CJC → $495 + $105, no bulk", async () => {
  const r = await sameAsDrawer([[R, 3], [CJC, 1]], NOW, 49500 + 10500);
  assert.equal(r.params.discounts, undefined);
});
await t("sale cart never offers customer promo codes (can't stack)", async () => {
  for (const items of [[[R, 1]], [[R, 2], [CJC, 1]], [[R, 1], [BPC, 2]]] as Item[][]) {
    const r = await checkout(items, NOW);
    assert.equal(r.params.allow_promotion_codes, undefined);
  }
});
await t("non-sale products behave exactly as before", async () => {
  let r = await sameAsDrawer([[CJC, 1]], NOW, 10500);
  assert.equal(r.params.allow_promotion_codes, true);
  assert.equal(r.params.expires_at, undefined);
  r = await sameAsDrawer([[CJC, 2]], NOW, 18900);
  assert.deepEqual(r.params.discounts, [{ coupon: "BULK10" }]);
  r = await sameAsDrawer([[CJC, 3], [BPC, 1]], NOW, Math.round((31500 + 14500) * 0.85));
  assert.deepEqual(r.params.discounts, [{ coupon: "BULK15" }]);
});

// ── 11-12 Expiry ────────────────────────────────────────────────────────────
await t("sale sessions expire by the deadline and ≥30 min out, any time", async () => {
  for (const iso of ["2026-10-18T20:00:00-04:00", NOW, "2026-10-23T12:00:00-04:00", "2026-10-23T23:28:00-04:00"]) {
    const r = await checkout([[R, 2]], iso);
    const now = T(iso) / 1000;
    assert.ok(r.params.expires_at <= sale.SALE_ENDS_AT_MS / 1000, `${iso} not past deadline`);
    assert.ok(r.params.expires_at >= now + 30 * 60, `${iso} ≥30 min`);
    assert.ok(r.params.expires_at <= now + 24 * 3600, `${iso} ≤24h`);
  }
});
await t("no sale sessions after the cutoff: full price + normal bulk rules", async () => {
  for (const iso of ["2026-10-23T23:45:00-04:00", "2026-10-23T23:59:30-04:00", "2026-10-24T09:00:00-04:00"]) {
    let r = await checkout([[R, 1]], iso);
    assert.equal(r.total, 21500);
    assert.equal(r.params.expires_at, undefined);
    assert.equal(r.params.allow_promotion_codes, true);
    r = await sameAsDrawer([[R, 2]], iso, 38700);
    assert.deepEqual(r.params.discounts, [{ coupon: "BULK10" }]);
    await sameAsDrawer([[R, 3]], iso, 54825);  // pre-sale price returns
    await sameAsDrawer([[R, 2], [CJC, 1]], iso, Math.round(53500 * 0.9));
  }
});
await t("a session created at the last sale moment can't be paid after the deadline", async () => {
  const r = await checkout([[R, 1]], "2026-10-23T23:28:00-04:00");
  assert.ok(r.params.expires_at * 1000 <= sale.SALE_ENDS_AT_MS);
});

// ── Display helpers ─────────────────────────────────────────────────────────
await t("getreta tiers: sale on / off", () => {
  const p = (v: number, on: boolean) => tierPricing(TIERS.find((x) => x.vials === v)!, on);
  assert.deepEqual([p(1, true).discounted, p(1, true).full, p(1, true).saves], [16500, 21500, 5000]);
  assert.deepEqual([p(2, true).discounted, p(2, true).full, p(2, true).saves], [33000, 43000, 10000]);
  assert.deepEqual([p(3, true).discounted, p(3, true).full, p(3, true).saves], [49500, 64500, 15000]);
  assert.equal(p(3, true).onSale, true);
  assert.equal(p(1, false).discounted, 21500);
  assert.equal(p(2, false).discounted, 38700);
  assert.equal(p(3, false).discounted, 54825);
});
await t("server status flips at cutoff (reta) / deadline (power cut)", () => {
  assert.deepEqual(sale.saleStatus(T(NOW)), { reta: true, powerCut: true });
  assert.deepEqual(sale.saleStatus(T("2026-10-18T15:00:00-04:00")), { reta: true, powerCut: false });
  assert.deepEqual(sale.saleStatus(T("2026-10-23T23:45:00-04:00")), { reta: false, powerCut: true });
  assert.deepEqual(sale.saleStatus(T("2026-10-24T00:00:01-04:00")), { reta: false, powerCut: false });
});

await t("urgency phases escalate with real time left; countdown formats", async () => {
  const { salePhase, formatRemaining } = await import("../app/components/SaleUrgency");
  const H = 3_600_000;
  assert.equal(salePhase(3 * 24 * H).label, "SALE ENDS FRIDAY");
  assert.equal(salePhase(24 * H).label, "LAST DAY");
  assert.equal(salePhase(3 * H).label, "FINAL 3 HOURS");
  assert.equal(salePhase(H).label, "FINAL HOUR");
  assert.equal(salePhase(1000).label, "FINAL HOUR");
  assert.equal(formatRemaining(2 * 86400e3 + 4 * H + 31 * 60e3 + 12e3), "2d 04h 31m 12s");
  assert.equal(formatRemaining(5 * H + 7e3), "05h 00m 07s");
  assert.equal(formatRemaining(-5), "00h 00m 00s");
});

console.log(`\n${passed} checks passed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
