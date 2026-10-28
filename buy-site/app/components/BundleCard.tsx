"use client";

import { useState } from "react";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import { formatPrice, type Bundle } from "@/app/lib/products";

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const [selectedId, setSelectedId] = useState(bundle.variants[0].id);
  const selected =
    bundle.variants.find((variant) => variant.id === selectedId) ??
    bundle.variants[0];

  return (
    <div className="bundle-card">
      <span className="product-card__tag">
        <span className="product-card__tag-dot" />
        {bundle.tag}
      </span>
      <h3>{bundle.name}</h3>
      <p className="product-card__desc">{bundle.description}</p>

      <div
        className="bundle-card__options"
        role="radiogroup"
        aria-label={`${bundle.name} options`}
      >
        {bundle.variants.map((variant) => (
          <label
            key={variant.id}
            className={
              variant.id === selectedId
                ? "bundle-option bundle-option--selected"
                : "bundle-option"
            }
          >
            <input
              type="radio"
              name={`bundle-${bundle.bundleId}`}
              checked={variant.id === selectedId}
              onChange={() => setSelectedId(variant.id)}
            />
            <span className="bundle-option__label">{variant.variantLabel}</span>
            <span className="bundle-option__price">
              {formatPrice(variant.price)}
            </span>
          </label>
        ))}
      </div>

      <div className="bundle-card__footer">
        <AddToCartButton productId={selected.id} />
      </div>
    </div>
  );
}
