"use client";

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

  const tier = TIERS.find((t) => t.vials === selected) ?? TIERS[0];
  const { discounted, live } = tierPricing(tier);

  function handleAdd() {
    addItem(
      {
        slug: RETA.slug,
        priceId: RETA.priceId,
        name: RETA.name,
        dose: RETA.dose,
        unitPriceCents: RETA.unitPriceCents,
        image: RETA.cartImage,
      },
      tier.vials,
    );

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
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-sm">
      {/* Tier selector — horizontal rows on mobile, cards on desktop */}
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

              {/* Thumbnail — mobile only (desktop shows the big product image) */}
              <img
                src={t.image}
                alt=""
                aria-hidden="true"
                className="h-14 w-14 flex-shrink-0 object-contain sm:hidden"
                loading="lazy"
              />

              {/* Identity */}
              <div className="min-w-0">
                <span className="block text-sm font-bold text-[var(--primary)]">
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-[var(--primary)]/55">
                  {t.vials} × 20mg vial{t.vials > 1 ? "s" : ""}
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

              {/* Pricing */}
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
                ) : (
                  <span className="mt-1 text-xs font-medium text-[var(--primary)]/50">
                    {formatUsd(RETA.unitPriceCents)}/vial
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Add to cart — right under the options */}
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
        Add {tier.vials > 1 ? `${tier.vials} Vials` : "to Cart"} — {formatUsd(discounted)}
      </button>

      {live ? (
        <p className="mt-2 text-center text-xs font-semibold text-[var(--accent-dark)]">
          Bulk discount applied automatically at checkout — no code needed.
        </p>
      ) : null}
    </div>
  );
}
