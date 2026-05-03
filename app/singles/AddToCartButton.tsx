"use client";

import { useCallback, useRef, useState } from "react";

const MAX_QTY = 4;

declare global {
  interface Window {
    cartPaypal?: {
      AddToCart: (config: { id: string }) => void;
      Cart: (config: { id: string }) => void;
    };
  }
}

const HIDDEN_HOST_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "-10000px",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  opacity: 0,
  pointerEvents: "none",
};

type StorageHit = {
  storageKey: string;
  rawOld: string;
  data: unknown;
  itemPath: Array<string | number>;
};

const ID_KEYS = ["id", "productId", "product_id", "itemId", "item_id", "sku"];

function isMatchingItem(value: unknown, productId: string): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const rec = value as Record<string, unknown>;
  for (const k of ID_KEYS) {
    if (rec[k] === productId) return true;
  }
  return false;
}

function findItemPath(
  node: unknown,
  productId: string,
  path: Array<string | number>,
): Array<string | number> | null {
  if (!node || typeof node !== "object") return null;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      const child = node[i];
      if (isMatchingItem(child, productId)) return [...path, i];
      const sub = findItemPath(child, productId, [...path, i]);
      if (sub) return sub;
    }
    return null;
  }
  if (isMatchingItem(node, productId)) return path;
  const obj = node as Record<string, unknown>;
  for (const k of Object.keys(obj)) {
    const sub = findItemPath(obj[k], productId, [...path, k]);
    if (sub) return sub;
  }
  return null;
}

function locateItem(productId: string): StorageHit | null {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    const value = localStorage.getItem(key);
    if (!value || !value.includes(productId)) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      continue;
    }
    const path = findItemPath(parsed, productId, []);
    if (path) {
      return { storageKey: key, rawOld: value, data: parsed, itemPath: path };
    }
  }
  return null;
}

function setQuantityInStorage(productId: string, qty: number): boolean {
  const hit = locateItem(productId);
  if (!hit) return false;
  let cur: unknown = hit.data;
  for (let i = 0; i < hit.itemPath.length - 1; i++) {
    const seg = hit.itemPath[i];
    cur = (cur as Record<string | number, unknown>)[seg as string];
  }
  const last = hit.itemPath[hit.itemPath.length - 1];
  const container = cur as Record<string | number, unknown>;
  const item = container[last as string] as Record<string, unknown>;
  if (!item || typeof item !== "object") return false;
  const qtyKey =
    "quantity" in item ? "quantity" : "qty" in item ? "qty" : "quantity";
  item[qtyKey] = qty;
  const next = JSON.stringify(hit.data);
  localStorage.setItem(hit.storageKey, next);
  try {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: hit.storageKey,
        oldValue: hit.rawOld,
        newValue: next,
        storageArea: localStorage,
      }),
    );
  } catch {
    window.dispatchEvent(new Event("storage"));
  }
  return true;
}

function refreshCartButtons() {
  if (!window.cartPaypal) return;
  document.querySelectorAll<HTMLElement>("paypal-cart-button").forEach((el) => {
    const id = el.getAttribute("data-id");
    const parent = el.parentNode;
    if (!id || !parent) return;
    const fresh = document.createElement("paypal-cart-button");
    fresh.setAttribute("data-id", id);
    parent.replaceChild(fresh, el);
    try {
      window.cartPaypal!.Cart({ id });
    } catch {}
  });
}

export function AddToCartButton({ cartId }: { cartId: string }) {
  const [qty, setQty] = useState(0);
  const hostRef = useRef<HTMLElement | null>(null);

  const handleAdd = useCallback(() => {
    if (qty >= MAX_QTY) return;

    if (qty === 0) {
      hostRef.current?.click();
      setQty(1);
      return;
    }

    const next = Math.min(qty + 1, MAX_QTY);
    const apply = () => {
      const ok = setQuantityInStorage(cartId, next);
      if (ok) {
        setQty(next);
        requestAnimationFrame(refreshCartButtons);
      } else {
        hostRef.current?.click();
      }
    };
    apply();
  }, [qty, cartId]);

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
