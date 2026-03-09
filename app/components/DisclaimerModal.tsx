"use client";

import { useState, useEffect, useCallback } from "react";

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => {
    if (sessionStorage.getItem("disclaimer_ack")) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    // Already dismissed this session
    if (sessionStorage.getItem("disclaimer_ack")) return;

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
    sessionStorage.setItem("disclaimer_ack", "1");
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
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.46 1.46a2.25 2.25 0 0 1-1.591.659H8.051a2.25 2.25 0 0 1-1.591-.659L5 14.5m14 0V5.846a2.25 2.25 0 0 0-1.287-2.034l-.006-.003A23.916 23.916 0 0 0 12 3c-1.905 0-3.76.225-5.544.652a2.25 2.25 0 0 0-1.456 2.047V14.5"
            />
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
