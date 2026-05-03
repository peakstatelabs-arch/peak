"use client";

import { useCallback, useRef, useState } from "react";

const MAX_QTY = 4;

const HIDDEN_HOST_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "-10000px",
  top: "auto",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
  pointerEvents: "none",
};

function findIncrementInShadow(host: HTMLElement): HTMLElement | null {
  const root = (host as HTMLElement & { shadowRoot?: ShadowRoot | null })
    .shadowRoot;
  if (!root) return null;

  const candidates = [
    'button[aria-label*="ncrease" i]',
    'button[aria-label*="add" i]',
    'button[data-testid*="ncrease" i]',
    'button[data-testid*="plus" i]',
    'button[data-action="add"]',
    'button.plus',
    'button[part*="plus"]',
  ];
  for (const sel of candidates) {
    const el = root.querySelector<HTMLElement>(sel);
    if (el) return el;
  }
  const buttons = root.querySelectorAll<HTMLElement>("button");
  if (buttons.length >= 2) return buttons[buttons.length - 1];
  return null;
}

export function AddToCartButton({ cartId }: { cartId: string }) {
  const [qty, setQty] = useState(0);
  const hostRef = useRef<HTMLElement | null>(null);

  const handleAdd = useCallback(() => {
    if (qty >= MAX_QTY) return;
    const host = hostRef.current;
    if (!host) {
      setQty((q) => Math.min(q + 1, MAX_QTY));
      return;
    }

    if (qty === 0) {
      host.click();
    } else {
      const plus = findIncrementInShadow(host);
      if (plus) plus.click();
      else host.click();
    }
    setQty((q) => Math.min(q + 1, MAX_QTY));
  }, [qty]);

  const label =
    qty === 0
      ? "Add to Cart"
      : qty >= MAX_QTY
        ? `Max (${MAX_QTY})`
        : `Add Another (${qty})`;

  return (
    <>
      <span aria-hidden="true" style={HIDDEN_HOST_STYLE}>
        <paypal-add-to-cart-button
          ref={(el: HTMLElement | null) => {
            hostRef.current = el;
          }}
          data-id={cartId}
        ></paypal-add-to-cart-button>
      </span>
      <button
        type="button"
        onClick={handleAdd}
        disabled={qty >= MAX_QTY}
        className="btn-accent inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-extrabold uppercase tracking-wide shadow-lg ring-2 ring-[var(--accent)]/30 transition-transform group-hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {label}
      </button>
    </>
  );
}
