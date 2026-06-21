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
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex items-start gap-3">
        <div className="text-sm leading-relaxed">
          <strong className="font-semibold">Install for the full experience.</strong>{" "}
          Tap <span className="font-medium">Share → Add to Home Screen</span>, then open Peak State
          from the home screen icon. Required for push reminders on iPhone.
        </div>
        <button
          onClick={dismiss}
          className="btn-secondary text-xs px-3 py-1.5 whitespace-nowrap"
          aria-label="Dismiss"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
