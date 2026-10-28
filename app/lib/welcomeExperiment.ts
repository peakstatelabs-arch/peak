"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { SHOP_URL } from "@/app/research-access/constants";

// /welcome split test. Only NEW accounts from /signup and /research-access are
// enrolled: the PostHog flag decides whether their "Continue to shop" goes to
// the one-question /welcome quiz ("test") or the homepage as before
// ("control"). Returning members who sign in, skip-link clicks, and anyone
// typing peakstate.shop never touch the flag, so they never see the test.
//
// Create a PostHog Experiment with this flag key and variants "control" and
// "test". Until it exists (or if flags fail to load) everyone gets control.
export const WELCOME_FLAG_KEY = "welcome-quiz";
export const WELCOME_URL = "/welcome";

export type WelcomeVariant = "control" | "test";

/**
 * Where the post-signup "Continue to shop" button should go. Reads the flag
 * only for new accounts — reading it is what logs the experiment exposure, so
 * sign-ins must never call it.
 */
export function useWelcomeDestination(method: "create" | "signin" | null): {
  href: string;
  variant: WelcomeVariant | null;
} {
  const [variant, setVariant] = useState<WelcomeVariant | null>(null);

  useEffect(() => {
    if (method !== "create") return;
    try {
      // Fires now if flags are loaded, and again when identify() reloads them.
      return posthog.onFeatureFlags(() => {
        setVariant(
          posthog.getFeatureFlag(WELCOME_FLAG_KEY) === "test" ? "test" : "control",
        );
      });
    } catch {
      // PostHog unavailable — stay on control.
    }
  }, [method]);

  return {
    href: method === "create" && variant === "test" ? WELCOME_URL : SHOP_URL,
    variant: method === "create" ? variant : null,
  };
}
