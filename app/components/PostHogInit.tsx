"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  "phc_zCH2WXZDb9B725yJr2cFgUzn56vwnywtbiJmVrCqj6et";
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let initialized = false;

export function PostHogInit() {
  useEffect(() => {
    if (initialized || typeof window === "undefined") return;
    initialized = true;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }, []);

  return null;
}
