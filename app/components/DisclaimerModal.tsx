"use client";

import { useState, useEffect, useCallback } from "react";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAgeSeconds};SameSite=Lax`;
}

const ONE_DAY = 60 * 60 * 24;

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (getCookie("disclaimer_ack")) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    // Already acknowledged within the last 24 hours
    if (getCookie("disclaimer_ack")) return;

    // Timer trigger — 9 seconds
    const timer = setTimeout(show, 9000);

    // Scroll trigger — 20% of page
    function onScroll() {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= 0.2) show();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [show]);

  function dismiss() {
    setCookie("disclaimer_ack", "1", ONE_DAY);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--primary)]/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-8 animate-scale-in">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/15">
          <svg
            className="h-7 w-7 text-[var(--accent-dark)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 3h6M10 3v6.5L5.5 18.5a1 1 0 0 0 .87 1.5h11.26a1 1 0 0 0 .87-1.5L14 9.5V3" />
          </svg>
        </div>

        {/* Content */}
        <h2 className="text-center text-xl font-bold text-[var(--primary)]">
          Research Use Notice
        </h2>
        <p className="mt-4 text-center text-sm leading-relaxed text-[var(--primary)]/70">
          Peak State Labs provides compounds intended for laboratory research
          and educational purposes only. These materials are not approved for
          human consumption. By continuing, you acknowledge this information.
        </p>

        {/* Button */}
        <button
          onClick={dismiss}
          className="btn-primary mt-6 w-full h-12 rounded-2xl text-base font-semibold"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
