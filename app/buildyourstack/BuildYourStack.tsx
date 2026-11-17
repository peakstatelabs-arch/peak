"use client";

import { useCart } from "@/app/singles/cart/CartContext";
import { formatUsd } from "@/app/lib/money";
import { LADDER, SALE_NAME, nextStepAction, priceCart } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import { trackAddToCartInPostHog } from "@/app/lib/trackAddToCart";
import { product, supplyFor, type ProductSlug } from "@/app/lib/bfStacks";
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
    <div className="pb-40">
      {modal}
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
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
                  {t.minVials === 6 ? "+" : ""} vials
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
                    src={p.image}
                    alt=""
                    aria-hidden="true"
                    className="h-24 w-24 flex-shrink-0 rounded-2xl bg-[var(--muted)] object-contain"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">
                      {p.tagline}
                    </p>
                    <p className="text-lg font-bold text-[var(--primary)] leading-tight">{p.name}</p>
                    <p className="text-sm text-[var(--primary)]/55">
                      {p.dose} · {p.price} · {supplyFor(slug, 1)} per vial
                    </p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-[var(--primary)]/70 leading-relaxed">
                  {p.blurb}
                </p>
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
                      className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--primary)]/90"
                    >
                      Add to stack
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

      {/* Sticky savings meter */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0f1a] text-white shadow-2xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4">
          <div className="min-w-0">
            {priced.saleVials === 0 ? (
              <p className="text-sm sm:text-base font-bold">
                Add vials to start saving — 2 vials unlocks 30% off.
              </p>
            ) : (
              <>
                <p className="text-sm sm:text-base font-bold">
                  {priced.saleVials} vial{priced.saleVials === 1 ? "" : "s"}
                  {priced.pct > 0 ? (
                    <>
                      {" "}· <span className="text-[var(--accent)]">{priced.pct}% off</span> · you
                      save {formatUsd(priced.discountCents)}
                    </>
                  ) : null}
                </p>
                {priced.next && (
                  <p className="text-xs text-white/70">
                    {nextStepAction(priced.next)} to unlock {priced.next.pct}% off
                    {sale.live ? ` · ${SALE_NAME[sale.phase]} pricing` : ""}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {priced.saleVials > 0 && (
              <span className="text-right tabular-nums">
                {priced.discountCents > 0 && (
                  <span className="mr-2 text-sm text-white/40 line-through">
                    {formatUsd(priced.subtotalCents)}
                  </span>
                )}
                <span className="text-xl sm:text-2xl font-black">{formatUsd(priced.totalCents)}</span>
              </span>
            )}
            <button
              type="button"
              onClick={openCart}
              disabled={priced.saleVials === 0}
              className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm sm:text-base font-black text-[#0b0f1a] disabled:opacity-40"
            >
              Review &amp; checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
