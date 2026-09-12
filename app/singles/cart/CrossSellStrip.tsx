"use client";

import { useCart } from "./CartContext";
import { readClientContact } from "@/app/lib/clientContact";
import { CROSS_SELL, type CrossSellItem } from "./crossSell";

type Props = {
  slugs: string[];
  /** "cart" = rows inside the cart drawer; "buybox" = compact cards on a page. */
  variant: "cart" | "buybox";
};

export function CrossSellStrip({ slugs, variant }: Props) {
  const { lines, addItem, openCart } = useCart();
  const inCart = new Set(lines.map((l) => l.priceId));
  const items = slugs
    .map((s) => CROSS_SELL[s])
    .filter((i): i is CrossSellItem => Boolean(i) && !inCart.has(i.priceId));

  if (items.length === 0) return null;

  function add(item: CrossSellItem) {
    addItem(
      {
        slug: item.slug,
        priceId: item.priceId,
        name: item.name,
        dose: item.dose,
        unitPriceCents: item.unitPriceCents,
        image: item.image,
      },
      1,
    );
    // From the buy box, surface the cart so the add is visible. In the drawer
    // it's already open, so leave the scroll position alone.
    if (variant === "buybox") openCart();

    try {
      const { email, name, sessionId } = readClientContact();
      fetch("/api/cart-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event: "add_to_cart_click",
          funnel: `cross_sell_${variant}`,
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
          quantity: 1,
        }),
      }).catch(() => {});
    } catch {
      // Never let analytics block the cart.
    }
  }

  if (variant === "buybox") {
    return (
      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">
          Pairs well with reta
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {items.map((i) => (
            <div
              key={i.slug}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-white p-3"
            >
              <div className="flex items-center gap-2">
                <img
                  src={i.image}
                  alt={i.name}
                  className="h-10 w-10 flex-shrink-0 rounded-lg bg-[var(--muted)] object-contain"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--primary)]">
                    {i.name}
                  </p>
                  <p className="text-xs font-semibold text-[var(--primary)]/60">
                    {i.priceLabel}
                  </p>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-[var(--primary)]/60">
                {i.blurb}
              </p>
              <button
                type="button"
                onClick={() => add(i)}
                className="mt-2.5 inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--primary)]/20 bg-[var(--muted)] py-1.5 text-xs font-bold text-[var(--primary)] transition-colors hover:bg-[var(--accent)]/20"
              >
                <Plus /> Add
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // cart drawer variant
  return (
    <div className="mt-6 border-t border-[var(--border)] pt-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">
        Complete your protocol
      </p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((i) => (
          <li
            key={i.slug}
            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white p-2.5"
          >
            <img
              src={i.image}
              alt={i.name}
              className="h-12 w-12 flex-shrink-0 rounded-lg bg-[var(--muted)] object-contain"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[var(--primary)]">
                {i.name}
              </p>
              <p className="truncate text-xs text-[var(--primary)]/55">
                {i.blurb} · {i.priceLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={() => add(i)}
              className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[var(--primary)]/90"
            >
              <Plus /> Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Plus() {
  return (
    <svg
      className="h-3.5 w-3.5 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
