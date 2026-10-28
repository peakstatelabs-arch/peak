"use client";

import { useState } from "react";
import { useCart, formatUsd, type CartLine } from "@/app/singles/cart/CartContext";
import { readClientContact } from "@/app/lib/clientContact";
import { trackAddToCartInPostHog } from "@/app/lib/trackAddToCart";
import { bulkPctForQty, BULK_DISCOUNTS_LIVE } from "@/app/lib/bulkDiscount";
import { CrossSellStrip } from "@/app/singles/cart/CrossSellStrip";

export type BundleItem = Omit<CartLine, "quantity">;

export type BundleTier = {
  id: string;
  label: string;
  /** What's in the box, e.g. "2 × 10mg vials". */
  contents: string;
  /** Approx. how long the tier lasts, e.g. "10 weeks". */
  supply: string;
  /** Product shots for this tier; several render side by side (e.g. a stack). */
  images: string[];
  highlight?: boolean;
  /** Cart lines this tier adds. Each product is one Stripe line. */
  lines: { item: BundleItem; quantity: number }[];
  /** Button label after "Add", e.g. "2 Vials" or "the Stack". */
  addLabel: string;
  /**
   * For a tier sold at its own fixed price (a stack): what the same vials
   * cost bought separately. Shown crossed out, and the bulk curve is skipped.
   */
  compareAtCents?: number;
};

/**
 * Prices a tier the same way checkout will: list price, minus the bulk tier
 * unlocked by the highest quantity of any one product (see bulkDiscount.ts).
 */
export function bundlePricing(tier: BundleTier) {
  const lineCents = tier.lines.reduce(
    (sum, l) => sum + l.item.unitPriceCents * l.quantity,
    0,
  );
  if (tier.compareAtCents) {
    const saves = tier.compareAtCents - lineCents;
    return {
      full: tier.compareAtCents,
      discounted: lineCents,
      live: saves > 0,
      saves,
      pct: Math.round((saves / tier.compareAtCents) * 100),
    };
  }
  const full = lineCents;
  const pct = bulkPctForQty(Math.max(...tier.lines.map((l) => l.quantity)));
  const live = BULK_DISCOUNTS_LIVE && pct > 0;
  const discounted = live ? Math.round(full * (1 - pct / 100)) : full;
  return { full, discounted, live, saves: full - discounted, pct };
}

/**
 * Buy section for the /getreta-style pages: heading, tier picker with an
 * add-to-cart button, and a big image of the selected tier (desktop). Adds
 * go through the singles cart, so checkout is the existing Stripe flow.
 */
export function BundleBuyBox({
  funnel,
  eyebrow = "GET YOURS",
  title,
  description,
  tiers,
  defaultTierId,
  crossSellSlugs,
  imageAlt,
}: {
  /** Analytics funnel name, e.g. "getcjc". */
  funnel: string;
  eyebrow?: string;
  title: string;
  description: string;
  tiers: BundleTier[];
  defaultTierId: string;
  crossSellSlugs?: string[];
  imageAlt: string;
}) {
  const { addItem, openCart } = useCart();
  const [selected, setSelected] = useState(defaultTierId);
  const tier = tiers.find((t) => t.id === selected) ?? tiers[0];
  const { discounted, live } = bundlePricing(tier);

  function handleAdd() {
    for (const { item, quantity } of tier.lines) {
      addItem(item, quantity);
      trackAddToCartInPostHog({
        funnel,
        product_slug: item.slug,
        product_name: item.name,
        price_id: item.priceId,
        dose: item.dose,
        unit_price_cents: item.unitPriceCents,
        quantity,
      });

      // Fire-and-forget Zapier ping, matching the /singles add-to-cart event.
      try {
        const { email, name, sessionId } = readClientContact();
        fetch("/api/cart-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          keepalive: true,
          body: JSON.stringify({
            event: "add_to_cart_click",
            funnel,
            email: email ?? null,
            name: name ?? null,
            user_id: email ?? null,
            session_id: sessionId ?? null,
            url: typeof window !== "undefined" ? window.location.href : null,
            product_slug: item.slug,
            price_id: item.priceId,
            product_name: item.name,
            dose: item.dose,
            unit_price_cents: item.unitPriceCents,
            quantity,
          }),
        }).catch(() => {});
      } catch {
        // Never let analytics failures block the cart.
      }
    }
    openCart();
  }

  return (
    // Mobile order: heading → picker/CTA → image. Desktop: two columns, with
    // the picker as a sticky right rail beside the heading + image.
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
      {/* Heading */}
      <div className="order-1 lg:col-start-1 lg:row-start-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Picker + guarantee */}
      <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-[calc(6rem+var(--member-banner-h,0px))]">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-sm">
          <div className={`grid gap-3 ${tiers.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {tiers.map((t) => {
              const p = bundlePricing(t);
              const isActive = t.id === selected;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t.id)}
                  aria-pressed={isActive}
                  className={`relative flex items-center justify-between gap-3 rounded-2xl border-2 p-3 text-left transition-all sm:flex-col sm:items-stretch sm:justify-start sm:gap-0 sm:p-3.5 ${
                    isActive
                      ? "border-[var(--primary)] bg-[var(--muted)] shadow-sm"
                      : "border-[var(--border)] bg-white hover:border-[var(--accent)]"
                  }`}
                >
                  {t.highlight ? (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      Most popular
                    </span>
                  ) : null}

                  {/* Thumbnail — mobile only (desktop shows the big image) */}
                  <img
                    src={t.images[0]}
                    alt=""
                    aria-hidden="true"
                    className="h-14 w-14 flex-shrink-0 object-contain sm:hidden"
                    loading="lazy"
                  />

                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[var(--primary)]">
                      {t.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-[var(--primary)]/55">
                      {t.contents}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-dark)] sm:mt-2">
                      <svg
                        className="h-3 w-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      ~{t.supply}
                    </span>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end text-right sm:mt-3 sm:items-start sm:text-left">
                    <span className="flex flex-wrap items-baseline justify-end gap-x-1.5 tabular-nums sm:justify-start">
                      <span className="text-lg font-extrabold text-[var(--primary)] sm:text-xl">
                        {formatUsd(p.discounted)}
                      </span>
                      {p.live ? (
                        <span className="text-xs font-semibold text-[var(--primary)]/40 line-through">
                          {formatUsd(p.full)}
                        </span>
                      ) : null}
                    </span>
                    {p.live && p.saves > 0 ? (
                      <span className="mt-1 inline-flex items-center whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        Save {formatUsd(p.saves)} · {p.pct}%
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white text-base font-semibold py-3.5 px-6 hover:bg-[var(--primary)]/90 transition-colors"
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Add {tier.addLabel} — {formatUsd(discounted)}
          </button>

          {live ? (
            <p className="mt-2 text-center text-xs font-semibold text-[var(--accent-dark)]">
              {tier.compareAtCents
                ? `Stack price — you save ${formatUsd(bundlePricing(tier).saves)} vs. buying each vial separately.`
                : "Bulk discount applied automatically at checkout — no code needed."}
            </p>
          ) : null}
        </div>
        {crossSellSlugs ? (
          <CrossSellStrip
            slugs={crossSellSlugs}
            variant="buybox"
            heading="Pairs well with"
          />
        ) : null}
        <GuaranteeNote />
      </div>

      {/* Big image + supply — desktop only. On mobile each tier carries its
          own thumbnail. */}
      <div className="order-3 hidden lg:col-start-1 lg:row-start-2 lg:block">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
          <div className="flex items-center justify-center gap-2">
            {tier.images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={i === 0 ? `${imageAlt} — ${tier.label}` : ""}
                aria-hidden={i === 0 ? undefined : true}
                className={`w-auto object-contain transition-opacity duration-200 ${
                  tier.images.length > 1 ? "h-36 sm:h-44" : "h-44 sm:h-56"
                }`}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2.5 text-center">
            <svg
              className="w-5 h-5 flex-shrink-0 text-[var(--accent-dark)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold text-[var(--primary)]/80">
              {tier.contents} —{" "}
              <span className="font-extrabold text-[var(--accent-dark)]">
                lasts ~{tier.supply}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Guarantee line under a buy box. */
function GuaranteeNote() {
  return (
    <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs text-[var(--primary)]/55 leading-relaxed">
      <svg
        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--primary)]/45"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Backed by our satisfaction guarantee — reship or refund if anything&rsquo;s
      wrong. Secure checkout via Stripe.
    </p>
  );
}
