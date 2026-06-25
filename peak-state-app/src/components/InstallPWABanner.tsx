"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "pwa-install-banner-dismissed";

export function InstallPWABanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(DISMISS_KEY)) return;

    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    if (!isIOS) return;

    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    setShow(true);
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage blocked (rare). Hide for this session anyway.
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="border-b border-accent/40 bg-accent/15 text-fg">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-3">
        <div className="text-sm leading-snug flex-1 min-w-0">
          {/* Short copy on mobile so the banner stays 2 lines max. */}
          <span className="lg:hidden">
            <strong className="font-semibold">Install for push reminders.</strong>{" "}
            Share → Add to Home Screen.
          </span>
          <span className="hidden lg:inline">
            <strong className="font-semibold">Install for the full experience.</strong>{" "}
            Tap <span className="font-medium">Share → Add to Home Screen</span>, then open Peak State
            from the home screen icon. Required for push reminders on iPhone.
          </span>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="shrink-0 h-7 w-7 lg:hidden rounded-md text-fg-muted hover:text-fg hover:bg-bg-elev flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <button
          onClick={dismiss}
          className="hidden lg:inline-flex btn-secondary text-xs px-3 py-1.5 whitespace-nowrap"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
