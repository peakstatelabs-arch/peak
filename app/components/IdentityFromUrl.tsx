"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { saveClientContact } from "@/app/lib/clientContact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reads an email from `?u=` (and optional name from `?n=`) placed on links in
// outbound emails, persists the contact so downstream Add-to-Cart clicks can
// attribute the visitor, then strips the params from the URL so they don't
// linger in the address bar or get shared/screenshotted.
export function IdentityFromUrl() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const rawEmail = url.searchParams.get("u");
      if (!rawEmail) return;

      const email = decodeURIComponent(rawEmail).trim().toLowerCase();
      if (!EMAIL_RE.test(email)) return;

      const rawName = url.searchParams.get("n");
      const name = rawName ? decodeURIComponent(rawName).trim() : undefined;

      saveClientContact({ email, name });

      try {
        posthog.identify(email, name ? { email, name } : { email });
      } catch {
        // PostHog may not be ready yet — the localStorage write above is what
        // downstream CTA handlers actually rely on.
      }

      url.searchParams.delete("u");
      url.searchParams.delete("n");
      const cleaned =
        url.pathname +
        (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "") +
        url.hash;
      window.history.replaceState({}, "", cleaned);
    } catch {
      // Any failure here is silent — the visitor still uses the site normally.
    }
  }, []);

  return null;
}
