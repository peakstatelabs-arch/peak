"use client";

import type { ReactNode } from "react";
import { TrackedLink } from "@/app/components/TrackedLink";
import { cn } from "@/app/lib/cn";

/**
 * Small underlined text link + boxed up-right arrow for the sticky header
 * (homepage → /getreta, /getreta → homepage). Opens in a new tab so the page
 * the visitor came from — and its cart — stays open.
 *
 * Words + box flip colors on press (phones) and hover (desktop) so the tap
 * visibly registers.
 */
export function HeaderCrossLink({
  href,
  event,
  source,
  className,
  children,
}: {
  href: string;
  event: string;
  source: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <TrackedLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      event={event}
      eventProperties={{ source }}
      // iOS Safari only applies :active when a touch listener is present.
      onTouchStart={() => {}}
      className={cn(
        "group inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-sm font-bold text-[var(--primary)] transition-colors hover:text-[var(--accent-dark)] active:text-[var(--accent-dark)]",
        className,
      )}
    >
      <span className="underline underline-offset-2">{children}</span>
      <span
        aria-hidden="true"
        className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[5px] bg-[var(--accent)]/30 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white group-active:bg-[var(--primary)] group-active:text-white"
      >
        <svg
          className="h-3 w-3 transition-transform group-hover:translate-x-px group-hover:-translate-y-px"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3.25}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7v8" />
        </svg>
      </span>
    </TrackedLink>
  );
}
