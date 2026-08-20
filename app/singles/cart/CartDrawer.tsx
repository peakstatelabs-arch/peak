"use client";

import { useEffect, useState } from "react";
import { formatUsd, useCart, type CartLine } from "./CartContext";

export function CartDrawer() {
  const {
    lines: allLines,
    hydrated,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    subtotalCents,
    itemCount,
  } = useCart();
  // Only render lines after client-side rehydration. Server rendered with
  // an empty cart; we must match that on the first client paint to avoid
  // hydration mismatches, then swap in the real state.
  const lines = hydrated ? allLines : [];
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // When the cart mixes in-stock vials with pre-orders, the order ships in
  // two waves: in-stock now, pre-orders on their release date. Surface that
  // split explicitly so it's never a surprise after checkout.
  const inStockLines = lines.filter((l) => !l.preorder);
  const preorderLines = lines.filter((l) => l.preorder);
  const isSplitShipment = inStockLines.length > 0 && preorderLines.length > 0;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, closeCart]);

  async function handleCheckout() {
    setCheckoutError(null);
    if (lines.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            priceId: l.priceId,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };
      if (!res.ok || !data.url) {
        setCheckoutError(
          data.error || "Something went wrong starting checkout. Please try again.",
        );
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setCheckoutError(
        "Network error starting checkout. Please try again in a moment.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[100] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--primary)]">Your Cart</h2>
            <p className="text-xs text-[var(--primary)]/60">
              {itemCount === 0
                ? "No items yet"
                : `${itemCount} item${itemCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--primary)]/60">
              <svg
                className="w-12 h-12 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              <p className="text-sm">Your cart is empty.</p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-4 text-sm font-semibold text-[var(--primary)] underline underline-offset-4"
              >
                Continue browsing
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {lines.map((line) => (
                <CartLineRow
                  key={line.priceId}
                  line={line}
                  onQtyChange={(q) => setQuantity(line.priceId, q)}
                  onRemove={() => removeItem(line.priceId)}
                />
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <footer className="border-t border-[var(--border)] px-5 sm:px-6 py-5 space-y-4 bg-[var(--muted)]">
            {isSplitShipment && (
              <SplitShipmentNotice
                inStockLines={inStockLines}
                preorderLines={preorderLines}
              />
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--primary)]/70">
                Subtotal
              </span>
              <span className="text-2xl font-bold text-[var(--primary)]">
                {formatUsd(subtotalCents)}
              </span>
            </div>
            <p className="text-xs text-[var(--primary)]/55">
              Shipping and taxes calculated at checkout.
            </p>
            {checkoutError && (
              <p className="text-sm text-red-600 font-medium">{checkoutError}</p>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] text-[var(--primary)] text-base font-bold py-3.5 px-6 hover:bg-[var(--accent-dark)] hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      opacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Redirecting…
                </>
              ) : (
                <>
                  Checkout
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[var(--primary)]/55">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure checkout by Stripe
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}

function lineLabel(line: CartLine): string {
  return line.quantity > 1 ? `${line.name} ×${line.quantity}` : line.name;
}

function SplitShipmentNotice({
  inStockLines,
  preorderLines,
}: {
  inStockLines: CartLine[];
  preorderLines: CartLine[];
}) {
  // Group pre-orders by ship date so each wave lists the right vials, even if
  // future pre-orders carry different release dates.
  const byDate = new Map<string, CartLine[]>();
  for (const line of preorderLines) {
    const key = line.shipsBy ?? "when ready";
    const group = byDate.get(key);
    if (group) group.push(line);
    else byDate.set(key, [line]);
  }

  return (
    <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-3">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 flex-shrink-0 text-[var(--accent-dark)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 001 1h1m-2-8h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01.052.316V16a1 1 0 01-1 1h-1"
          />
        </svg>
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
          Your order ships in 2 shipments
        </p>
      </div>

      <ul className="mt-2.5 space-y-1.5">
        <li className="flex gap-2 text-xs text-[var(--primary)]/70">
          <span className="font-bold text-[var(--primary)] whitespace-nowrap">
            Ships now:
          </span>
          <span>{inStockLines.map(lineLabel).join(", ")}</span>
        </li>
        {Array.from(byDate.entries()).map(([date, group]) => (
          <li key={date} className="flex gap-2 text-xs text-[var(--primary)]/70">
            <span className="font-bold text-[var(--primary)] whitespace-nowrap">
              Ships {date}:
            </span>
            <span>{group.map(lineLabel).join(", ")}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2.5 text-[11px] leading-relaxed text-[var(--primary)]/55">
        Both shipments are free — you&rsquo;re only charged once, today. Pre-order
        vials follow as soon as they&rsquo;re ready.
      </p>
    </div>
  );
}

function CartLineRow({
  line,
  onQtyChange,
  onRemove,
}: {
  line: CartLine;
  onQtyChange: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-4 items-start rounded-2xl border border-[var(--border)] bg-white p-3">
      <div className="w-20 h-20 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center overflow-hidden flex-shrink-0">
        {line.image ? (
          <img
            src={line.image}
            alt={line.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]/40 px-2 text-center">
            {line.name}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-[var(--primary)] truncate">
              {line.name}
            </p>
            <p className="text-xs text-[var(--primary)]/60">{line.dose}</p>
            {line.preorder && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent-dark)]">
                Pre-order
                {line.shipsBy ? ` · Ships ${line.shipsBy}` : ""}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${line.name}`}
            className="text-[var(--primary)]/40 hover:text-red-600 transition-colors p-1 -m-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-lg border border-[var(--border)] bg-white">
            <button
              type="button"
              onClick={() => onQtyChange(line.quantity - 1)}
              aria-label={`Decrease quantity of ${line.name}`}
              className="w-8 h-8 flex items-center justify-center text-[var(--primary)] hover:bg-[var(--muted)] transition-colors rounded-l-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>
            <span
              aria-live="polite"
              className="w-8 text-center text-sm font-semibold text-[var(--primary)]"
            >
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => onQtyChange(line.quantity + 1)}
              aria-label={`Increase quantity of ${line.name}`}
              className="w-8 h-8 flex items-center justify-center text-[var(--primary)] hover:bg-[var(--muted)] transition-colors rounded-r-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          <p className="font-bold text-[var(--primary)]">
            {formatUsd(line.unitPriceCents * line.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
}
