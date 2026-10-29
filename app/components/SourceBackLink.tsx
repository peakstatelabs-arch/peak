"use client";

import { useSyncExternalStore } from "react";
import { RECOVERY_STACK_NAME } from "@/app/singles/cart/stackItems";

// Product pages link to /singles and /purity-tests as ?from=<page>, so the
// header can send shoppers back where they came from. Anything else goes to
// POWER CUT.
const BACK_TARGETS: Record<string, { href: string; label: string }> = {
  getcjc: { href: "/getcjc", label: "Back to CJC-1295 + Ipamorelin" },
  getreta: { href: "/getreta", label: "Back to Retatrutide" },
  getrecovery: { href: "/getrecovery", label: `Back to ${RECOVERY_STACK_NAME}` },
};
const DEFAULT_TARGET = { href: "/", label: "Back to POWER CUT™" };

// The page is prerendered, so read the query on the client only (the server
// render shows the default) — no hydration mismatch.
const subscribeNoop = () => () => {};
function readFrom(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("from");
  } catch {
    return null;
  }
}

export function SourceBackLink() {
  const from = useSyncExternalStore(subscribeNoop, readFrom, () => null);
  const target = (from && BACK_TARGETS[from]) || DEFAULT_TARGET;
  return (
    <a
      href={target.href}
      className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
    >
      ← {target.label}
    </a>
  );
}
