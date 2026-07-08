"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SiteFooter } from "@/app/components/SiteFooter";
import { useCart } from "@/app/lib/CartContext";
import { getProduct, formatPrice } from "@/app/lib/products";

function redirectTo(url: string) {
  window.location.href = url;
}

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lineItems = items
    .map((item) => {
      const product = getProduct(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lineItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      redirectTo(data.url);
    } catch {
      setError("Something went wrong starting checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="cart-section">
          <div className="container">
            <h1>Your Cart</h1>

            {lineItems.length === 0 ? (
              <p className="cart-empty">
                Your cart is empty.{" "}
                <Link href="/#products">Browse the collection</Link>.
              </p>
            ) : (
              <>
                <div className="cart-items">
                  {lineItems.map((item) => (
                    <div className="cart-item" key={item.productId}>
                      <div className="cart-item__info">
                        <h3>{item.product.name}</h3>
                        <p>{formatPrice(item.product.price)} each</p>
                      </div>
                      <div className="cart-item__qty">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="cart-item__total">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <p className="cart-summary__subtotal">
                    Subtotal <span>{formatPrice(subtotal)}</span>
                  </p>
                  {error && <p className="cart-error">{error}</p>}
                  <button
                    type="button"
                    className="btn-primary cart-checkout"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? "Redirecting…" : "Checkout"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
