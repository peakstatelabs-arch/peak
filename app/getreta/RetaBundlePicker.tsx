"use client";

import { useState } from "react";
import { useCart, formatUsd } from "@/app/singles/cart/CartContext";
import { readClientContact } from "@/app/lib/clientContact";
import { RETA, TIERS, tierPricing } from "./retaBundles";

type Props = {
  /** Selected vial count, owned by the parent so the product image can swap. */
  selected: number;
  onSelect: (vials: number) => void;
};

export function RetaBundlePicker({ selected, onSelect }: Props) {
  const { addItem, openCart } = useCart();
  const [copied, setCopied] = useState(false);

  const tier = TIERS.find((t) => t.vials === selected) ?? TIERS[0];
  const { full, discounted, live, saves } = tierPricing(tier);

  function handleAdd() {
    addItem(
      {
        slug: RETA.slug,
        priceId: RETA.priceId,
        name: RETA.name,
        dose: RETA.dose,
        unitPriceCents: RETA.unitPriceCents,
        image: tier.image,
      },
      tier.vials,
    );

    if (live && tier.code) {
      try {
        navigator.clipboard?.writeText(tier.code);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard blocked — code is still displayed for manual entry.
      }
    }

    openCart();

    // Fire-and-forget analytics, matching the /singles add-to-cart event.
    try {
      const { email, name, sessionId } = readClientContact();
      fetch("/api/cart-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event: "add_to_cart_click",
          funnel: "getreta",
          email: email ?? null,
          name: name ?? null,
          user_id: email ?? null,
          session_id: sessionId ?? null,
          url: typeof window !== "undefined" ? window.location.href : null,
          product_slug: RETA.slug,
          price_id: RETA.priceId,
          product_name: RETA.name,
          dose: RETA.dose,
          unit_price_cents: RETA.unitPriceCents,
          quantity: tier.vials,
        }),
      }).catch(() => {});
    } catch {
      // Never let analytics failures block the cart.
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 sm:p-7 shadow-sm">
      {/* Tier selector */}
      <div className="grid gap-3 sm:grid-cols-3">
        {TIERS.map((t) => {
          const p = tierPricing(t);
          const isActive = t.vials === selected;
          return (
            <button
              key={t.vials}
              type="button"
              onClick={() => onSelect(t.vials)}
              aria-pressed={isActive}
              className={`relative flex flex-col rounded-2xl border-2 p-4 text-left transition-all ${
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
              <span className="text-sm font-bold text-[var(--primary)]">
                {t.label}
              </span>
              <span className="mt-0.5 text-xs font-medium text-[var(--primary)]/55">
                {t.vials} × 20mg vial{t.vials > 1 ? "s" : ""}
              </span>
              <span className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[var(--primary)]">
                  {formatUsd(p.discounted)}
                </span>
                {p.live ? (
                  <span className="text-sm font-semibold text-[var(--primary)]/40 line-through">
                    {formatUsd(p.full)}
                  </span>
                ) : null}
              </span>
              {p.live && p.saves > 0 ? (
                <span className="mt-1 text-xs font-bold text-[var(--accent-dark)]">
                  Save {formatUsd(p.saves)} with code {t.code}
                </span>
              ) : (
                <span className="mt-1 text-xs font-medium text-[var(--primary)]/50">
                  {formatUsd(RETA.unitPriceCents)}/vial
                </span>
              )}
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-dark)]">
                <svg
                  className="w-3 h-3 flex-shrink-0"
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
            </button>
          );
        })}
      </div>

      {/* Selected tier detail + add to cart */}
      <div className="mt-5 rounded-2xl bg-[var(--muted)] p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <p className="text-sm font-bold text-emerald-700">
            In Stock • Lab-tested 99%+ purity • Ships within 24 hrs
          </p>
        </div>

        {/* Supply length for the selected tier */}
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3">
          <div className="flex items-center gap-2">
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
            <span className="text-sm font-semibold text-[var(--primary)]/80">
              Supply
            </span>
          </div>
          <span className="text-base font-extrabold text-[var(--accent-dark)]">
            ~{tier.supply}
          </span>
        </div>

        <p className="mt-3 text-sm text-[var(--primary)]/70 leading-relaxed">
          {tier.blurb}
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]/50">
              {tier.label}
            </p>
            <p className="text-3xl font-bold text-[var(--primary)]">
              {formatUsd(discounted)}
              {live && discounted !== full ? (
                <span className="ml-2 text-lg font-semibold text-[var(--primary)]/40 line-through">
                  {formatUsd(full)}
                </span>
              ) : null}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white text-base font-semibold py-3.5 px-6 hover:bg-[var(--primary)]/90 transition-colors"
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
          Add {tier.vials > 1 ? `${tier.vials} Vials` : "to Cart"} — {formatUsd(discounted)}
        </button>

        {live && tier.code ? (
          <p className="mt-2 text-center text-xs font-semibold text-[var(--accent-dark)]">
            {copied
              ? `Code ${tier.code} copied — paste it at checkout`
              : `Apply code ${tier.code} at checkout for ${tier.discountPct}% off`}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[var(--primary)]/60">
          <span className="inline-flex items-center gap-1.5">
            <Check /> Third-party COA included
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check /> 1-on-1 coaching + custom dosing
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check /> Discreet shipping
          </span>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="w-3.5 h-3.5 flex-shrink-0 text-[var(--accent-dark)]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
