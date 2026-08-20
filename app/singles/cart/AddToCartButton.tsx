"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { readClientContact } from "@/app/lib/clientContact";

type Props = {
  slug: string;
  priceId: string;
  name: string;
  dose: string;
  unitPriceCents: number;
  image?: string;
  preorder?: boolean;
  shipsBy?: string;
};

export function AddToCartButton(props: Props) {
  const { addItem, openCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(
      {
        slug: props.slug,
        priceId: props.priceId,
        name: props.name,
        dose: props.dose,
        unitPriceCents: props.unitPriceCents,
        image: props.image,
        preorder: props.preorder,
        shipsBy: props.shipsBy,
      },
      1,
    );
    setJustAdded(true);
    openCart();
    window.setTimeout(() => setJustAdded(false), 1200);

    // Fire-and-forget analytics ping. Reuses the existing cart-event route
    // so PostHog / Zapier funnels keep working without a rewrite.
    try {
      const { email, name, sessionId } = readClientContact();
      fetch("/api/cart-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          event: "add_to_cart_click",
          funnel: "singles",
          email: email ?? null,
          name: name ?? null,
          user_id: email ?? null,
          session_id: sessionId ?? null,
          url: typeof window !== "undefined" ? window.location.href : null,
          product_slug: props.slug,
          price_id: props.priceId,
          product_name: props.name,
          dose: props.dose,
          unit_price_cents: props.unitPriceCents,
        }),
      }).catch(() => {});
    } catch {
      // Never let analytics failures block the cart.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-white text-base font-semibold py-3.5 px-6 hover:bg-[var(--primary)]/90 transition-colors"
    >
      {justAdded ? (
        <>
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          Added
        </>
      ) : (
        <>
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
          Add to Cart
        </>
      )}
    </button>
  );
}
