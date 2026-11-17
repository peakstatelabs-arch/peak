"use client";

import { useState } from "react";
import { useCart } from "@/app/singles/cart/CartContext";
import { CrossSellStrip } from "@/app/singles/cart/CrossSellStrip";
import { formatUsd } from "@/app/lib/money";
import { nextSaleStep, nextStepAction, SALE_NAME } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import { trackAddToCartInPostHog } from "@/app/lib/trackAddToCart";
import {
  ADDONS,
  IS_BLEND,
  SHORT_NAME,
  STACKS,
  addonProducts,
  linesFor,
  priceLines,
  product,
  type AddonKey,
  type Line,
  type StackSlug,
} from "@/app/lib/bfStacks";
import { useMembersGate } from "./MembersGate";

export function StackBuyBox({
  slug,
  initialSets,
  addon,
  fromQuiz,
  initialSale,
}: {
  slug: StackSlug;
  initialSets: number | null;
  addon: AddonKey | null;
  fromQuiz: boolean;
  initialSale: SaleStatus;
}) {
  const stack = STACKS[slug];
  const sale = useSaleStatus(initialSale);
  const { addItem, openCart } = useCart();
  const { guard, modal } = useMembersGate(`stack_${slug}`);

  const recommended =
    initialSets && stack.sizes.some((s) => s.sets === initialSets)
      ? initialSets
      : null;
  const [sets, setSets] = useState(recommended ?? stack.defaultSets);
  const extra = addon ? addonProducts(addon, stack.items) : [];
  const [withAddon, setWithAddon] = useState(extra.length > 0);

  const size = stack.sizes.find((s) => s.sets === sets) ?? stack.sizes[0];
  const lines: Line[] = linesFor(stack.items, sets, withAddon ? extra : []);
  const total = priceLines(lines, sale.live);
  const next = sale.live
    ? nextSaleStep(lines.map((l) => ({ priceId: product(l.slug).priceId, quantity: l.quantity })))
    : null;
  const addonPrice = priceLines(linesFor([], sets, extra), false).full;

  function addToCart() {
    for (const l of lines) {
      const p = product(l.slug);
      addItem(
        {
          slug: p.slug,
          priceId: p.priceId,
          name: p.name,
          dose: p.dose,
          unitPriceCents: p.priceCents,
          image: p.image,
        },
        l.quantity,
      );
      trackAddToCartInPostHog({
        funnel: `bf_${slug}`,
        product_slug: p.slug,
        product_name: p.name,
        price_id: p.priceId,
        dose: p.dose,
        unit_price_cents: p.priceCents,
        quantity: l.quantity,
      });
    }
    openCart();
  }

  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
      {modal}
      <div className="order-1 lg:col-start-1 lg:row-start-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
          <span>{SALE_NAME[sale.phase].toUpperCase()} PRICING</span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          {fromQuiz ? `Your ${stack.name} Stack` : `The ${stack.name} Stack`}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
          {stack.items.map((i) => SHORT_NAME[i]).join(" + ")}. Every vial in
          your cart counts toward your discount: 2 vials 30% off, 4 vials 35%
          off, 6+ vials 40% off.
        </p>
      </div>

      <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-[calc(6rem+var(--sale-bar-h,0px))]">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-sm">
          {fromQuiz && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-sm font-bold text-emerald-700">
              <span aria-hidden="true">✓</span> Built from your answers
            </div>
          )}

          <div className={`grid gap-3 ${stack.sizes.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {stack.sizes.map((s) => {
              const p = priceLines(linesFor(stack.items, s.sets), sale.live);
              const active = s.sets === sets;
              const badge =
                recommended === s.sets
                  ? "Your stack"
                  : !recommended && s.sets === stack.defaultSets
                    ? "Most popular"
                    : null;
              return (
                <button
                  key={s.sets}
                  type="button"
                  onClick={() => setSets(s.sets)}
                  aria-pressed={active}
                  className={`relative flex items-center justify-between gap-3 rounded-2xl border-2 p-3 text-left transition-all sm:flex-col sm:items-stretch sm:justify-start sm:gap-0 sm:p-3.5 ${
                    active
                      ? "border-[var(--primary)] bg-[var(--muted)] shadow-sm"
                      : "border-[var(--border)] bg-white hover:border-[var(--accent)]"
                  }`}
                >
                  {badge ? (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      {badge}
                    </span>
                  ) : null}
                  <img
                    src={s.image}
                    alt=""
                    aria-hidden="true"
                    className="h-14 w-14 flex-shrink-0 object-contain sm:hidden"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[var(--primary)]">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-[var(--primary)]/55">
                      {p.vials} vial{p.vials === 1 ? "" : "s"} · ~{s.supply}
                    </span>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end text-right sm:mt-3 sm:items-start sm:text-left">
                    <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 tabular-nums sm:justify-start">
                      <span className="text-lg font-extrabold text-[var(--primary)] sm:text-xl">
                        {formatUsd(p.price)}
                      </span>
                      {p.saves > 0 && (
                        <span className="text-xs font-semibold text-[var(--primary)]/40 line-through">
                          {formatUsd(p.full)}
                        </span>
                      )}
                    </span>
                    {p.saves > 0 && (
                      <span className="mt-1 inline-flex items-center whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        Save {formatUsd(p.saves)} · {p.pct}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {extra.length > 0 && addon && (
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent)]/10 p-3.5">
              <input
                type="checkbox"
                checked={withAddon}
                onChange={(e) => setWithAddon(e.target.checked)}
                className="mt-1 h-5 w-5 accent-[var(--primary)]"
              />
              <span className="flex-1">
                <span className="block text-sm font-extrabold text-[var(--primary)]">
                  {ADDONS[addon].emoji} Add for {ADDONS[addon].label.toLowerCase()}:
                </span>
                <span className="mt-1.5 block space-y-1">
                  {extra.map((e) => (
                    <span key={e} className="block text-sm text-[var(--primary)]">
                      <span className="mr-1.5 inline-block rounded-md bg-[var(--primary)] px-1.5 py-0.5 text-xs font-extrabold text-white">
                        {sets} vial{sets === 1 ? "" : "s"}
                      </span>
                      <span className="font-bold">{SHORT_NAME[e]}</span>{" "}
                      <span className="text-[var(--primary)]/60">({product(e).dose.replace(/ blend$/i, "")})</span>
                      {IS_BLEND[e] && (
                        <span className="block pl-0.5 text-xs font-semibold text-[var(--accent-dark)]">
                          {IS_BLEND[e]}
                        </span>
                      )}
                    </span>
                  ))}
                </span>
                <span className="mt-1.5 block text-xs font-medium text-[var(--primary)]/65">
                  {formatUsd(addonPrice)} before discount — and it pushes your
                  whole order to a bigger discount.
                </span>
              </span>
            </label>
          )}

          <div className="mt-5 rounded-2xl bg-[#0b0f1a] px-4 py-3.5 text-white">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-white/70">
                {total.vials} vial{total.vials === 1 ? "" : "s"}
                {total.pct > 0 ? ` · ${total.pct}% off` : ""}
              </span>
              <span className="tabular-nums">
                {total.saves > 0 && (
                  <span className="mr-2 text-sm font-semibold text-white/40 line-through">
                    {formatUsd(total.full)}
                  </span>
                )}
                <span className="text-2xl font-extrabold">{formatUsd(total.price)}</span>
              </span>
            </div>
            {total.saves > 0 && (
              <p className="mt-1 text-sm font-extrabold text-[var(--accent)]">
                You save {formatUsd(total.saves)}
              </p>
            )}
            {next && (
              <p className="mt-1 text-xs text-white/70">
                {nextStepAction(next)} to unlock {next.pct}% off your whole cart.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => guard(addToCart)}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white text-base font-bold py-4 px-6 hover:bg-[var(--primary)]/90 transition-colors"
          >
            Add {stack.name} {size.label} — {formatUsd(total.price)}
          </button>
          <p className="mt-2 text-center text-xs font-semibold text-[var(--accent-dark)]">
            Sale price applied automatically at checkout. No code needed.
          </p>
        </div>
        <CrossSellStrip
          slugs={["retatrutide", "cjc-ipamorelin", "bpc-tb500", "nad", "kpv", "ghk-cu"].filter(
            (s) => !lines.some((l) => l.slug === s),
          )}
          variant="buybox"
          heading="Stack more, save more"
        />
      </div>

      <div className="order-3 hidden lg:col-start-1 lg:row-start-2 lg:block">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
          <img
            src={size.image}
            alt={`${stack.name} stack — ${size.label}`}
            className="mx-auto h-72 w-auto object-contain"
          />
          <p className="mt-4 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary)]/80">
            {stack.items.map((i) => `${sets}× ${SHORT_NAME[i]}`).join(" · ")} —{" "}
            <span className="font-extrabold text-[var(--accent-dark)]">
              lasts ~{size.supply}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
