"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

export const SIGNUP_FORM_ID = "signup-form";

/**
 * Visitors tap the logo / brand badge looking for a way in. Make those taps
 * bring the form into view and briefly highlight it — without focusing a
 * field, so a phone keyboard doesn't jump up over it.
 */
export function ScrollToForm({
  placement,
  className,
  children,
}: {
  /** Analytics label for which element was tapped. */
  placement: string;
  className?: string;
  children: ReactNode;
}) {
  function go() {
    try {
      posthog.capture("signup_page_logo_tapped", { placement });
    } catch {
      // Analytics must never break the page.
    }
    const form = document.getElementById(SIGNUP_FORM_ID);
    if (!form) return;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.classList.remove("signup-form-flash");
    // Restart the highlight even on repeat taps.
    void form.offsetWidth;
    form.classList.add("signup-form-flash");
  }

  return (
    <button type="button" onClick={go} className={className}>
      {children}
    </button>
  );
}
