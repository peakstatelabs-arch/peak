"use client";

import { useEffect } from "react";

const PAYPAL_MERCHANT_ID = "3GSRRAUXGEEM6";

const PRODUCT_IDS = [
  "3GQWA553XEXNU",
  "SPCE9E3H3VVX2",
  "B62P3JVPTD6CA",
  "MRUXNK54XGUQ6",
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

const TRIM_FLAG = "__paypalTrimWatched";

function shouldKeep(el: Element): {
  keep: boolean;
  recurse: boolean;
} {
  const tag = el.tagName.toLowerCase();
  if (
    tag === "select" ||
    tag === "button" ||
    tag === "input" ||
    tag === "form" ||
    tag === "label"
  ) {
    return { keep: true, recurse: false };
  }
  const hasControl = el.querySelector("select, button, input, form, label");
  if (hasControl) return { keep: true, recurse: true };
  return { keep: false, recurse: false };
}

function trimContainer(parent: Element) {
  const children = Array.from(parent.children);
  const decisions = children.map((child) => ({ child, ...shouldKeep(child) }));
  const anyKeep = decisions.some((d) => d.keep);
  if (!anyKeep) return;
  for (const { child, keep, recurse } of decisions) {
    if (!(child instanceof HTMLElement)) continue;
    if (keep) {
      if (child.style.display === "none") child.style.display = "";
      if (recurse) trimContainer(child);
    } else {
      if (child.style.display !== "none") child.style.display = "none";
    }
  }
}

const QUANTITY_OPTIONS = ["0", "1", "2", "3", "4"] as const;

function adjustSelect(select: HTMLSelectElement) {
  const opts = Array.from(select.options);
  const values = opts.map((o) => o.value);
  const optionsCorrect =
    values.length === QUANTITY_OPTIONS.length &&
    QUANTITY_OPTIONS.every((v, i) => values[i] === v);

  if (optionsCorrect) return;

  const isFirstAdjustment = select.dataset.peakQtyInit !== "true";
  const previousValue = select.value;

  while (select.firstChild) select.removeChild(select.firstChild);
  for (const v of QUANTITY_OPTIONS) {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  }

  if (isFirstAdjustment || !QUANTITY_OPTIONS.includes(previousValue as never)) {
    select.value = "0";
  } else {
    select.value = previousValue;
  }
  select.dataset.peakQtyInit = "true";
}

function trimHost(host: Element) {
  trimContainer(host);
  host.querySelectorAll("select").forEach(adjustSelect);
  const sr = (host as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
  if (sr) {
    Array.from(sr.children).forEach((c) => {
      if (c instanceof HTMLElement) trimContainer(c);
    });
    sr.querySelectorAll("select").forEach(adjustSelect);
  }
}

function watchHost(host: Element) {
  const flagged = host as Element & { [TRIM_FLAG]?: boolean };
  if (flagged[TRIM_FLAG]) {
    trimHost(host);
    return;
  }
  flagged[TRIM_FLAG] = true;

  const observer = new MutationObserver(() => trimHost(host));
  observer.observe(host, { childList: true, subtree: true });
  const sr = (host as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
  if (sr) {
    const sObserver = new MutationObserver(() => trimHost(host));
    sObserver.observe(sr, { childList: true, subtree: true });
  }
  trimHost(host);
}

function setupTrimming() {
  let attempts = 0;
  const tick = () => {
    attempts += 1;
    let allFound = true;
    PRODUCT_IDS.forEach((id) => {
      const host = document.querySelector(
        `paypal-add-to-cart-button[data-id="${id}"]`,
      );
      if (host) {
        watchHost(host);
        if (host.children.length === 0) {
          const sr = (host as Element & { shadowRoot?: ShadowRoot | null })
            .shadowRoot;
          if (!sr || sr.children.length === 0) allFound = false;
        }
      } else {
        allFound = false;
      }
    });
    if (!allFound && attempts < 60) {
      setTimeout(tick, 150);
    }
  };
  tick();
}

function initButtons() {
  if (!window.cartPaypal) return;
  PRODUCT_IDS.forEach((id) => window.cartPaypal!.AddToCart({ id }));
  VIEW_CART_IDS.forEach((id) => window.cartPaypal!.Cart({ id }));
  setupTrimming();
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
