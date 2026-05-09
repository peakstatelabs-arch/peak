"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import posthog from "posthog-js";
import { readClientContact } from "@/app/lib/clientContact";

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: string;
  eventProperties?: Record<string, string | number | boolean | null | undefined>;
  /**
   * Optional same-origin endpoint that receives a fire-and-forget POST when
   * the link is clicked. The endpoint gets the event name, any provided
   * eventProperties, and the visitor's email/name (if previously captured at
   * /research-access). Failures are swallowed so the click navigates as
   * normal even if the endpoint is unreachable.
   */
  webhookEndpoint?: string;
  children: ReactNode;
};

export function TrackedLink({
  event,
  eventProperties,
  webhookEndpoint,
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

        if (webhookEndpoint && typeof window !== "undefined") {
          try {
            const { email, name, sessionId } = readClientContact();
            const payload = {
              event,
              email: email ?? null,
              name: name ?? null,
              user_id: email ?? null,
              session_id: sessionId ?? null,
              url: window.location.href,
              timestamp: new Date().toISOString(),
              ...eventProperties,
            };
            // Fire-and-forget. keepalive ensures the request continues even if
            // the user is navigated away in the same tab.
            void fetch(webhookEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
              keepalive: true,
            }).catch((err) => {
              console.error("Webhook dispatch failed", err);
            });
          } catch (err) {
            console.error("Webhook dispatch error", err);
          }
        }

        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
