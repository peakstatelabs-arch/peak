"use client";

import { useCart } from "./CartContext";

export function ViewCartButton({
  variant = "header",
}: {
  variant?: "header" | "inline";
}) {
  const { itemCount, hydrated, openCart } = useCart();

  const base =
    "relative inline-flex items-center gap-2 rounded-xl font-semibold transition-colors";
  const styles =
    variant === "header"
      ? "bg-[var(--primary)] text-white text-sm py-2 px-3 sm:px-4 hover:bg-[var(--primary)]/90"
      : "bg-[var(--primary)] text-white text-base py-3 px-6 hover:bg-[var(--primary)]/90";

  return (
    <button
      type="button"
      onClick={openCart}
      className={`${base} ${styles}`}
      aria-label={`View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
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
      <span className={variant === "header" ? "hidden sm:inline" : ""}>Cart</span>
      {hydrated && itemCount > 0 ? (
        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-[var(--accent)] px-2 text-xs font-extrabold text-[var(--primary)]">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}
