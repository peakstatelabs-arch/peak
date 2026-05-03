"use client";

import { useEffect } from "react";

const PAYPAL_MERCHANT_ID = "3GSRRAUXGEEM6";

const PRODUCT_IDS = [
  "3GQWA553XEXNU",
  "SPCE9E3H3VVX2",
  "B62P3JVPTD6CA",
] as const;

const VIEW_CART_IDS = ["pp-view-cart-header", "pp-view-cart-floating"] as const;

declare global {
  interface Window {
    cartPaypal?: {
      AddToCart: (config: { id: string }) => void;
      Cart: (config: { id: string }) => void;
    };
  }
}

function initButtons() {
  if (!window.cartPaypal) return;
  PRODUCT_IDS.forEach((id) => window.cartPaypal!.AddToCart({ id }));
  VIEW_CART_IDS.forEach((id) => window.cartPaypal!.Cart({ id }));
}

export function CartScripts() {
  useEffect(() => {
    if (window.cartPaypal) {
      initButtons();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-cart="true"]',
    );
    if (existing) {
      existing.addEventListener("load", initButtons);
      return () => existing.removeEventListener("load", initButtons);
    }

    const script = document.createElement("script");
    script.src = "https://www.paypalobjects.com/ncp/cart/cart.js";
    script.setAttribute("data-merchant-id", PAYPAL_MERCHANT_ID);
    script.setAttribute("data-paypal-cart", "true");
    script.async = true;
    script.addEventListener("load", initButtons);
    document.head.appendChild(script);
  }, []);

  return null;
}
