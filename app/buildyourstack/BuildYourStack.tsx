"use client";

import { useCart } from "@/app/singles/cart/CartContext";
import { formatUsd } from "@/app/lib/money";
import { LADDER, pctOff, priceCart } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import { trackAddToCartInPostHog } from "@/app/lib/trackAddToCart";
import { PRODUCT_CUTOUT, product, supplyFor, type ProductSlug } from "@/app/lib/bfStacks";
import { useMembersGate } from "@/app/components/sale/MembersGate";

const ORDER: ProductSlug[] = [
  "retatrutide",
  "cjc-ipamorelin",
  "bpc-tb500",
  "nad",
  "ghk-cu",
  "kpv",
];

export function BuildYourStack({ initialSale }: { initialSale: SaleStatus }) {
  const sale = useSaleStatus(initialSale);
  const { lines, hydrated, addItem, setQuantity, openCart } = useCart();
  const { guard, modal } = useMembersGate("buildyourstack");
  const shown = hydrated ? lines : [];
  const priced = priceCart(shown, sale.live);
  const qtyOf = (priceId: string) =>
    shown.find((l) => l.priceId === priceId)?.quantity ?? 0;

  function change(slug: ProductSlug, delta: number) {
    const p = product(slug);
    const current = qtyOf(p.priceId);
    if (delta > 0) {
      guard(() => {
        addItem(
          {
            slug: p.slug,
            priceId: p.priceId,
            name: p.name,
            dose: p.dose,
            unitPriceCents: p.priceCents,
            image: p.image,
          },
          1,
        );
        trackAddToCartInPostHog({
          funnel: "buildyourstack",
          product_slug: p.slug,
          product_name: p.name,
          price_id: p.priceId,
          dose: p.dose,
          unit_price_cents: p.priceCents,
          quantity: 1,
        });
      });
    } else if (current > 0) {
      setQuantity(p.priceId, current - 1);
    }
  }

  return (
    <div className="pb-20">
      {modal}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {LADDER.map((t) => {
            const reached = sale.live && priced.saleVials >= t.minVials;
            return (
              <div
                key={t.minVials}
                className={`rounded-2xl border-2 px-2 py-3 text-center transition-colors ${
                  reached
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#0b0f1a]"
                    : "border-[var(--border)] bg-white text-[var(--primary)]"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                  {t.minVials}
                  {t.minVials === 4 ? "+" : ""} vial{t.minVials === 1 ? "" : "s"}
                </p>
                <p className="text-2xl sm:text-3xl font-black">{t.pct}% off</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER.map((slug) => {
            const p = product(slug);
            const qty = qtyOf(p.priceId);
            return (
              <div
                key={slug}
                className={`flex flex-col rounded-3xl border-2 bg-white p-5 transition-colors ${
                  qty > 0 ? "border-[var(--primary)]" : "border-[var(--border)]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={PRODUCT_CUTOUT[slug]}
                    alt=""
                    aria-hidden="true"
                    className="h-24 w-24 flex-shrink-0 object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">
                      {p.tagline}
                    </p>
                    <p className="text-lg font-bold text-[var(--primary)] leading-tight">{p.name}</p>
                    <p className="text-sm text-[var(--primary)]/55">
                      {p.dose} · {supplyFor(slug, 1)} per vial
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-[var(--primary)]/70 leading-relaxed">
                  {p.blurb}
                </p>
                {sale.live && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.08] px-3 py-2">
                    <span className="tabular-nums">
                      <span className="mr-1.5 text-xs text-[var(--primary)]/45 line-through">{p.price}</span>
                      <span className="text-lg font-black text-[var(--primary)]">
                        {formatUsd(pctOff(p.priceCents, 20))}
                      </span>
                      <span className="ml-1.5 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
                        20% OFF
                      </span>
                    </span>
                    <span className="text-right text-[11px] leading-tight text-[var(--primary)]/70">
                      as low as
                      <span className="block text-sm font-extrabold text-[var(--accent)] tabular-nums">
                        {formatUsd(pctOff(p.priceCents, 40))}
                      </span>
                      <span className="block">in a 4+ stack</span>
                    </span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-xl border border-[var(--border)]">
                    <button
                      type="button"
                      aria-label={`Remove one ${p.name}`}
                      onClick={() => change(slug, -1)}
                      disabled={qty === 0}
                      className="h-11 w-11 text-xl font-bold text-[var(--primary)] disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-lg font-extrabold tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label={`Add one ${p.name}`}
                      onClick={() => change(slug, 1)}
                      className="h-11 w-11 text-xl font-bold text-[var(--primary)]"
                    >
                      +
                    </button>
                  </div>
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => change(slug, 1)}
                      className="buy-cta rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--primary)]/90"
                    >
                      + Add to stack
                    </button>
                  ) : (
                    <span className="text-sm font-bold text-emerald-700">✓ In your stack</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky savings meter — one slim line; hidden until something is added */}
      {priced.saleVials > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0f1a]/95 text-white backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2">
            <div className="min-w-0 text-xs leading-tight">
              <p className="font-bold">
                {priced.saleVials} vial{priced.saleVials === 1 ? "" : "s"} ·{" "}
                <span className="text-[var(--accent)]">{priced.pct}% off</span> ·{" "}
                <span className="tabular-nums">{formatUsd(priced.totalCents)}</span>
                {priced.discountCents > 0 && (
                  <span className="ml-1 text-white/40 line-through tabular-nums">
                    {formatUsd(priced.subtotalCents)}
                  </span>
                )}
              </p>
              {priced.next && (
                <p className="truncate text-[11px] text-white/60">
                  +{priced.next.addVials} vial{priced.next.addVials === 1 ? "" : "s"} → {priced.next.pct}% off
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openCart}
              className="flex-shrink-0 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-extrabold text-[#0b0f1a]"
            >
              Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
