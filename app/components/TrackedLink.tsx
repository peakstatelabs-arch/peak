"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import posthog from "posthog-js";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventProperties?: Record<string, string | number | boolean | null | undefined>;
  children: ReactNode;
};

export function TrackedLink({
  event,
  eventProperties,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        try {
          posthog.capture(event, eventProperties);
        } catch (err) {
          console.error("PostHog capture failed", err);
        }
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
