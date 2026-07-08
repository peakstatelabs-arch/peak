"use client";

import { useState } from "react";
import { useCart } from "@/app/lib/CartContext";

export function AddToCartButton({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn-primary product-card__buy"
      onClick={() => {
        addItem(productId);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}
