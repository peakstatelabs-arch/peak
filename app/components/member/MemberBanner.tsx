"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { MemberSignupModal } from "./MemberSignupModal";
import {
  dismissMemberBanner,
  shouldShowMemberBanner,
  shouldShowMemberBannerOnServer,
  subscribeMemberState,
} from "./memberState";

/** Fire-and-forget PostHog capture that never breaks the page. */
function track(event: string, props?: Record<string, string>) {
  try {
    posthog.capture(event, props);
  } catch (err) {
    console.error("PostHog capture failed:", err);
  }
}

/**
 * Slim "Members save 10%" strip for visitors without an account. Tapping it
 * opens the signup popup on the same page (click-only — it never opens by
 * itself). Hidden for members and for 7 days after ✕.
 */
export function MemberBanner({
  page,
  leadSource,
}: {
  /** Where the banner lives, for analytics ("homepage" | "getreta"). */
  page: string;
  /** Zapier lead source for signups; omit to use the API default. */
  leadSource?: string;
}) {
  // Server + first render: hidden (the server can't know who's visiting).
  const visible = useSyncExternalStore(
    subscribeMemberState,
    shouldShowMemberBanner,
    shouldShowMemberBannerOnServer
  );
  const [open, setOpen] = useState(false);
  const closePopup = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (visible) track("member_banner_shown", { page });
  }, [visible, page]);

  return (
    <>
      {visible && (
        <div className="animate-fade-in border-b border-[var(--accent)]/30 bg-[var(--accent)]/15 text-[var(--primary)]">
          <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 sm:px-4">
            {/* Balances the ✕ on the right so the message sits truly centered */}
            <span className="w-8 flex-shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={() => {
                track("member_banner_click", { page });
                setOpen(true);
              }}
              className="flex min-h-10 flex-1 items-center justify-center gap-2 py-2 text-center text-[13px] sm:text-sm leading-snug"
            >
              <svg
                className="hidden h-4 w-4 flex-shrink-0 text-[var(--accent-dark)] sm:block"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M17.7 10.3 10.3 2.9A1 1 0 0 0 9.6 2.6H4a1.4 1.4 0 0 0-1.4 1.4v5.6c0 .3.1.5.3.7l7.4 7.4a1.4 1.4 0 0 0 2 0l5.4-5.4a1.4 1.4 0 0 0 0-2ZM6.5 7.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <span className="font-semibold">Members save 10%</span>
                <span className="text-[var(--primary)]/60"> — </span>
                <span className="whitespace-nowrap font-bold underline underline-offset-2">
                  Create free account →
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                track("member_banner_dismiss", { page });
                dismissMemberBanner();
              }}
              aria-label="Dismiss"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[var(--primary)]/50 transition-colors hover:bg-white/60 hover:text-[var(--primary)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.3 5.3a1 1 0 0 0-1.4 1.4L8.6 10l-3.7 3.3a1 1 0 1 0 1.4 1.4L10 11.4l3.7 3.3a1 1 0 0 0 1.4-1.4L11.4 10l3.7-3.3a1 1 0 0 0-1.4-1.4L10 8.6 6.3 5.3Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Kept mounted outside the banner so the success screen survives the
          banner hiding once the visitor becomes a member. */}
      <MemberSignupModal
        open={open}
        onClose={closePopup}
        page={page}
        leadSource={leadSource}
      />
    </>
  );
}
