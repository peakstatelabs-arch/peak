// Offline verification of the Black Friday / Cyber Monday sale: phases,
// preview mode, the vial ladder, Stripe session params (with Stripe mocked —
// nothing is sent to Stripe, no orders), expiry, stack prices and the quiz.
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
      // POWER CUT sessions: "cs_paid…" are paid, anything else isn't.
      retrieve: async (id: string) => ({
        id,
        payment_status: id.startsWith("cs_paid") ? "paid" : "unpaid",
        status: id.startsWith("cs_paid") ? "complete" : "open",
        customer_details: { email: "buyer@example.com", phone: "+15555550100", name: "Test Buyer" },
        collected_information: null,
        customer: null,
        payment_intent: null,
        amount_total: 44900,
        currency: "usd",
      }),
    },
  };
  static errors = { StripeInvalidRequestError: class extends Error {} };
}
const stripePath = require.resolve("stripe");
require.cache[stripePath] = { id: stripePath, filename: stripePath, loaded: true, exports: { __esModule: true, default: FakeStripe } } as any;
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_POWERCUT_SECRET_KEY = "rk_test_mock";
process.env.SALE_PREVIEW_SECRET = "letmein";

const { NextRequest } = await import("next/server");
const sale = await import("../app/lib/sale");
const bf = await import("../app/lib/bfStacks");
const { SINGLES_PRICE_IDS, RECOVERY_STACK_PRICE_IDS } = await import("../app/singles/cart/priceCatalog");
const { POST } = await import("../app/api/create-checkout-session/route");
const { TIERS, tierPricing } = await import("../app/getreta/retaBundles");

const R = SINGLES_PRICE_IDS.retatrutide;
const CJC = SINGLES_PRICE_IDS["cjc-ipamorelin"];
const BPC = SINGLES_PRICE_IDS["bpc-tb500"];
const GHK = SINGLES_PRICE_IDS["ghk-cu"];
const KPV = SINGLES_PRICE_IDS.kpv;
const NAD = SINGLES_PRICE_IDS.nad;
const STACK1 = RECOVERY_STACK_PRICE_IDS.one;
const LIST: Record<string, number> = {
  [R]: 21500, [CJC]: 10500, [BPC]: 14500, [GHK]: 8500, [KPV]: 6500, [NAD]: 13500, [STACK1]: 24900,
};
const BULK_PCT: Record<string, number> = { BULK10: 10, BULK15: 15, BULK20: 20 };

const T = (iso: string) => Date.parse(iso);
const realNow = Date.now;
function at<X>(iso: string, fn: () => Promise<X>): Promise<X> {
  Date.now = () => T(iso);
  return fn().finally(() => { Date.now = realNow; });
}

type Item = [string, number];
async function checkout(items: Item[], nowIso: string, opts: { cookie?: string; pc?: string } = {}) {
  calls.length = 0;
  const res = await at(nowIso, () =>
    POST(new NextRequest("http://localhost/api/create-checkout-session", {
      method: "POST",
      headers: opts.cookie ? { cookie: opts.cookie } : {},
      body: JSON.stringify({
        items: items.map(([priceId, quantity]) => ({ priceId, quantity })),
        ...(opts.pc ? { powerCutSessionId: opts.pc } : {}),
      }),
    })),
  );
  assert.equal(res.status, 200);
  const params = calls.find((c) => c.fn === "sessions.create")!.params;
  const coupon = calls.find((c) => c.fn === "coupons.create")?.params;
  const lines = params.line_items.map((li: any) => ({ amount: LIST[li.price] * li.quantity, product: PRODUCT(li.price) }));
  let discount = 0;
  const d = params.discounts?.[0];
  if (d?.coupon === "co_adhoc") {
    for (const l of lines) {
      if (!coupon.applies_to || coupon.applies_to.products.includes(l.product)) {
        discount += Math.round((l.amount * coupon.percent_off) / 100);
      }
    }
  } else if (d?.coupon) {
    const sub = lines.reduce((n: number, l: any) => n + l.amount, 0);
    discount = Math.round((sub * BULK_PCT[d.coupon]) / 100);
  }
  const total = lines.reduce((n: number, l: any) => n + l.amount, 0) - discount;
  return { params, coupon, total };
}

function drawerTotal(items: Item[], nowIso: string) {
  const lines = items.map(([priceId, quantity]) => ({ priceId, quantity, unitPriceCents: LIST[priceId] }));
  return sale.priceCart(lines, sale.isSaleLive(sale.salePhaseAt(T(nowIso)))).totalCents;
}

let passed = 0;
async function t(name: string, fn: () => Promise<void> | void) {
  await fn();
  passed++;
  console.log(`ok - ${name}`);
}

const BF = "2026-11-22T12:00:00-05:00";
const CM = "2026-11-29T12:00:00-05:00";
const BEFORE = "2026-11-17T12:00:00-05:00";
const AFTER = "2026-12-01T00:00:01-05:00";
// Stripe total (whole-cent rounding per line) must match the drawer within 1¢ per line.
const sameAsDrawer = async (items: Item[], iso: string, expected: number) => {
  const r = await checkout(items, iso);
  assert.ok(Math.abs(r.total - expected) <= items.length, `stripe total ${r.total} vs ${expected}`);
  assert.equal(drawerTotal(items, iso), expected, "drawer total");
  return r;
};

// ── Window / phases ─────────────────────────────────────────────────────────
await t("phases: pre → Black Friday (Nov 20–27) → Cyber Monday (to Nov 30) → over, ET", () => {
  assert.equal(sale.salePhaseAt(T("2026-11-19T23:59:59-05:00")), "pre");
  assert.equal(sale.salePhaseAt(T("2026-11-20T00:00:00-05:00")), "bf");
  assert.equal(sale.salePhaseAt(T("2026-11-27T23:59:59-05:00")), "bf");
  assert.equal(sale.salePhaseAt(T("2026-11-28T00:00:00-05:00")), "cm");
  assert.equal(sale.salePhaseAt(T("2026-11-30T23:59:59-05:00")), "cm");
  assert.equal(sale.salePhaseAt(T("2026-12-01T00:00:00-05:00")), "over");
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true });
  assert.equal(f.format(new Date(sale.SALE_STARTS_AT_MS)), "Friday, November 20 at 12:00 AM");
  assert.equal(f.format(new Date(sale.SALE_ENDS_AT_MS)), "Monday, November 30 at 11:59 PM");
});

await t("preview cookie: only with the right secret", () => {
  const now = T(BEFORE);
  assert.equal(sale.resolveSalePhase(now, "bf.letmein", "letmein"), "bf");
  assert.equal(sale.resolveSalePhase(now, "over.letmein", "letmein"), "over");
  assert.equal(sale.resolveSalePhase(now, "bf.wrong", "letmein"), "pre");
  assert.equal(sale.resolveSalePhase(now, "bf.letmein", undefined), "pre");
  assert.equal(sale.resolveSalePhase(now, "nonsense.letmein", "letmein"), "pre");
});

// ── The ladder ──────────────────────────────────────────────────────────────
await t("ladder: Reta 1→20/2→30/3→40, other singles 0%, 2→30, 4→35, 6+→40", () => {
  const p = (lines: Item[]) => sale.salePctForLines(lines.map(([priceId, quantity]) => ({ priceId, quantity })));
  assert.equal(p([[R, 1]]), 20);
  assert.equal(p([[CJC, 1]]), 0);
  assert.equal(p([[R, 2]]), 30);
  assert.equal(p([[R, 1], [CJC, 1]]), 30);
  assert.equal(p([[BPC, 3]]), 30);
  assert.equal(p([[R, 3]]), 40);                     // Reta 3+ tier
  assert.equal(p([[R, 3], [GHK, 1]]), 40);           // better of ladder (35) and Reta (40)
  assert.equal(p([[R, 2], [GHK, 1]]), 30);
  assert.equal(p([[BPC, 2], [CJC, 2]]), 35);
  assert.equal(p([[NAD, 5]]), 35);
  assert.equal(p([[R, 2], [CJC, 2], [BPC, 2]]), 40);
  assert.equal(p([[R, 9]]), 40);
});

await t("checkout during Black Friday: Stripe total = drawer total", async () => {
  let r = await sameAsDrawer([[R, 1]], BF, 17200);
  assert.equal(r.coupon.percent_off, 20);
  assert.equal(r.coupon.applies_to, undefined);
  r = await sameAsDrawer([[CJC, 1]], BF, 10500);
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.allow_promotion_codes, true);
  await sameAsDrawer([[R, 2]], BF, 30100);
  await sameAsDrawer([[R, 3]], BF, 38700);
  await sameAsDrawer([[R, 1], [CJC, 1]], BF, 22400);
  await sameAsDrawer([[BPC, 1], [CJC, 1]], BF, 17500);              // BUILD 1×
  await sameAsDrawer([[BPC, 2], [CJC, 2]], BF, 32500);              // BUILD 2×
  await sameAsDrawer([[BPC, 3], [CJC, 3]], BF, 45000);              // BUILD 3×
  await sameAsDrawer([[NAD, 2], [BPC, 2]], BF, 36400);              // LIMITLESS 2×
  await sameAsDrawer([[BPC, 1], [KPV, 1], [GHK, 1]], BF, 20650);    // RADIANCE 1×
});

await t("Cyber Monday uses the same ladder; coupon is named for the phase", async () => {
  const r = await sameAsDrawer([[BPC, 2], [KPV, 2], [GHK, 2]], CM, 35400);
  assert.match(r.coupon.name, /Cyber Monday/);
  const b = await checkout([[R, 2]], BF);
  assert.match(b.coupon.name, /Black Friday/);
});

await t("sale coupons never allow stacking a customer code", async () => {
  for (const items of [[[R, 1]], [[R, 2]], [[BPC, 3], [CJC, 3]]] as Item[][]) {
    const r = await checkout(items, BF);
    assert.equal(r.params.allow_promotion_codes, undefined);
    assert.equal(r.coupon.max_redemptions, 1);
  }
});

await t("fixed-price stack lines stay outside the ladder", async () => {
  const r = await sameAsDrawer([[STACK1, 1], [CJC, 2]], BF, 24900 + 14700);
  assert.deepEqual(r.coupon.applies_to.products, [PRODUCT(CJC)]);
});

await t("POWER CUT add-on: verified paid session → 40%, email prefilled", async () => {
  let r = await checkout([[GHK, 1]], BF, { pc: "cs_paid_123" });
  assert.equal(r.coupon.percent_off, 40);
  assert.equal(r.total, 5100);
  assert.equal(r.params.customer_email, "buyer@example.com");
  r = await checkout([[GHK, 1]], BF, { pc: "cs_unpaid_123" });
  assert.equal(r.params.discounts, undefined);
  assert.equal(r.params.customer_email, undefined);
  r = await checkout([[GHK, 1]], AFTER, { pc: "cs_paid_123" });
  assert.equal(r.params.discounts, undefined);
});

await t("sessions can't be paid long after the sale; ≥30 min, ≤24h", async () => {
  for (const iso of [BF, CM, "2026-11-30T23:00:00-05:00", "2026-11-30T23:59:00-05:00"]) {
    const r = await checkout([[R, 2]], iso);
    const now = T(iso) / 1000;
    assert.ok(r.params.expires_at >= now + 30 * 60, `${iso} ≥30 min`);
    assert.ok(r.params.expires_at <= Math.max(sale.SALE_ENDS_AT_MS / 1000, now + 31 * 60), `${iso} capped`);
    assert.ok(r.params.expires_at <= now + 24 * 3600, `${iso} ≤24h`);
    assert.equal(r.coupon.redeem_by, r.params.expires_at);
  }
});

await t("before and after the sale: normal bulk rules, no expiry", async () => {
  for (const iso of [BEFORE, AFTER]) {
    let r = await sameAsDrawer([[R, 1]], iso, 21500);
    assert.equal(r.params.allow_promotion_codes, true);
    assert.equal(r.params.expires_at, undefined);
    r = await sameAsDrawer([[R, 2]], iso, 38700);
    assert.deepEqual(r.params.discounts, [{ coupon: "BULK10" }]);
    await sameAsDrawer([[R, 1], [CJC, 1]], iso, 32000);
  }
});

await t("preview cookie turns the sale on at checkout before Nov 20", async () => {
  let r = await checkout([[R, 2]], BEFORE, { cookie: "ps_sale_preview=bf.letmein" });
  assert.equal(r.coupon.percent_off, 30);
  r = await checkout([[R, 2]], BEFORE, { cookie: "ps_sale_preview=bf.guess" });
  assert.deepEqual(r.params.discounts, [{ coupon: "BULK10" }]);
});

// ── Display prices ──────────────────────────────────────────────────────────
await t("stack page prices", () => {
  const price = (slug: keyof typeof bf.STACKS, sets: number) =>
    bf.priceLines(bf.linesFor(bf.STACKS[slug].items, sets)).price;
  assert.deepEqual([1, 2, 3].map((n) => price("shred", n)), [17200, 30100, 38700]);
  assert.deepEqual([1, 2, 3].map((n) => price("build", n)), [17500, 32500, 45000]);
  assert.deepEqual([1, 2, 3].map((n) => price("radiance", n)), [20650, 35400, 53100]);
  assert.deepEqual([1, 2, 3].map((n) => price("limitless", n)), [19600, 36400, 50400]);
  assert.deepEqual([1, 2, 3].map((n) => price("foreverstrong", n)), [22050, 37800, 56700]);
  assert.deepEqual([1, 2, 3].map((n) => price("limitlessplus", n)), [24150, 41400, 62100]);
  for (const s of Object.values(bf.STACKS)) assert.deepEqual(s.sizes.map((x) => x.sets), [1, 2, 3]);
});

await t("getreta tiers during the sale: $172 / $301 / $387", () => {
  const p = (v: number) => tierPricing(TIERS.find((x) => x.vials === v)!, true);
  assert.deepEqual([p(1).discounted, p(2).discounted, p(3).discounted], [17200, 30100, 38700]);
  assert.equal(tierPricing(TIERS[1], false).discounted, 38700);
});

await t("POWER CUT: TRANSFORM codes, $449 / $799 / $1,099, savings vs singles", () => {
  const s = sale.POWERCUT_SALE;
  assert.deepEqual([s.single.code, s.double.code, s.triple.code], ["TRANSFORM", "TRANSFORM2", "TRANSFORM3"]);
  assert.deepEqual([s.single.saleCents, s.double.saleCents, s.triple.saleCents], [44900, 79900, 109900]);
  const pct = (id: string) => Math.round(((sale.POWERCUT_VALUE_CENTS[id] - s[id].saleCents) / sale.POWERCUT_VALUE_CENTS[id]) * 100);
  assert.deepEqual([pct("single"), pct("double"), pct("triple")], [52, 57, 61]);
  assert.equal(sale.withPromoCode("https://buy.stripe.com/x", "TRANSFORM"), "https://buy.stripe.com/x?prefilled_promo_code=TRANSFORM");
});

// ── Quiz ────────────────────────────────────────────────────────────────────
await t("quiz routing", () => {
  const q = bf.resolveQuiz;
  assert.deepEqual(q("fat", 2, null), { kind: "stack", slug: "shred", sets: 2, addon: null });
  assert.deepEqual(q("fat", 3, "muscle"), { kind: "powercut", tier: 3, addon: null });
  assert.deepEqual(q("fat", 1, "skin"), { kind: "stack", slug: "shred", sets: 1, addon: "skin" });
  assert.deepEqual(q("muscle", 2, "lean"), { kind: "powercut", tier: 2, addon: null });
  assert.deepEqual(q("muscle", 3, "gut"), { kind: "stack", slug: "foreverstrong", sets: 3, addon: null });
  assert.deepEqual(q("muscle", 1, "energy"), { kind: "stack", slug: "build", sets: 1, addon: "energy" });
  assert.deepEqual(q("both", 2, "skin"), { kind: "powercut", tier: 2, addon: "skin" });
  assert.deepEqual(q("glow", null, "lean"), { kind: "stack", slug: "radiance", sets: null, addon: "lean" });
  assert.deepEqual(q("energy", null, "gut"), { kind: "stack", slug: "limitlessplus", sets: null, addon: null });
  assert.deepEqual(q("energy", null, null), { kind: "stack", slug: "limitless", sets: null, addon: null });
  assert.ok(!bf.EXTRA_OPTIONS.glow.includes("skin") && !bf.EXTRA_OPTIONS.glow.includes("gut"));
  assert.ok(!bf.EXTRA_OPTIONS.both.includes("lean") && !bf.EXTRA_OPTIONS.both.includes("muscle"));
  // Gut add-on on a stack that already has BPC/TB only adds KPV.
  assert.deepEqual(bf.addonProducts("gut", bf.STACKS.shred.items), ["kpv", "bpc-tb500"]);
  assert.deepEqual(bf.addonProducts("gut", bf.STACKS.build.items), ["kpv"]);
  assert.equal(bf.quizResultHref(q("fat", 2, "skin")), "/shred?quiz=1&sets=2&addon=skin");
});

await t("next-step nudges pick the cheapest upgrade", () => {
  const n = (lines: Item[]) => sale.nextSaleStep(lines.map(([priceId, quantity]) => ({ priceId, quantity })));
  assert.deepEqual(n([[R, 2]]), { pct: 40, addVials: 1, reta: true });
  assert.deepEqual(n([[R, 1]]), { pct: 30, addVials: 1, reta: false });
  assert.deepEqual(n([[CJC, 2]]), { pct: 35, addVials: 2, reta: false });
  assert.equal(n([[R, 3]]), null);
  assert.equal(n([[R, 3], [GHK, 2]]), null);           // already at the top
});

await t("SHRED 1 vial + add-on reaches 30%", () => {
  const p = bf.priceLines(bf.linesFor(bf.STACKS.shred.items, 1, ["ghk-cu"]));
  assert.equal(p.pct, 30);
  assert.equal(p.price, Math.round((21500 + 8500) * 0.7));
});

await t("urgency escalates on Cyber Monday only; countdown formats", async () => {
  const { saleUrgency, formatRemaining } = await import("../app/components/SaleUrgency");
  const H = 3_600_000;
  assert.equal(saleUrgency("bf", H).label, "BLACK FRIDAY SALE");
  assert.equal(saleUrgency("cm", 3 * 24 * H).label, "CYBER MONDAY SALE");
  assert.equal(saleUrgency("cm", 24 * H).label, "LAST DAY");
  assert.equal(saleUrgency("cm", 3 * H).label, "FINAL 3 HOURS");
  assert.equal(saleUrgency("cm", H).label, "FINAL HOUR");
  assert.equal(formatRemaining(2 * 86400e3 + 4 * H + 31 * 60e3 + 12e3), "2d 04h 31m 12s");
});

console.log(`\n${passed} checks passed`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
