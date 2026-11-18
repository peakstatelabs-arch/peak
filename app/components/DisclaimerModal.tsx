"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  DISCLAIMER_COOKIE,
  DISCLAIMER_STORAGE_KEY,
  acknowledgeDisclaimer,
} from "@/app/lib/disclaimer";
import { useSaleStatus } from "@/app/lib/useSaleStatus";

/** Acknowledged before (cookie, or localStorage if the cookie was cleared). */
function acknowledged(): boolean {
  if (getCookie(DISCLAIMER_COOKIE)) return true;
  try {
    return window.localStorage.getItem(DISCLAIMER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const SUPPRESSED_PATHS = ["/thankyou", "/structured-peptides", "/bridge", "/research-access", "/reta-access", "/signup", "/powercut", "/creator", "/creator/apply", "/creator/success", "/privacy", "/sms-terms", "/freeretaguide"];

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PATHS.includes(pathname ?? "");

  const dark = useSaleStatus().live;
  const show = useCallback(() => {
    if (acknowledged()) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (suppressed) return;
    // Already acknowledged — it only ever shows once.
    if (acknowledged()) return;

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
  }, [show, suppressed]);

  if (suppressed) return null;

  function dismiss() {
    acknowledgeDisclaimer();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm ${dark ? "bg-black/70" : "bg-[var(--primary)]/60"}`} />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-8 animate-scale-in ${dark ? "bg-[#0f1626] border border-white/10" : "bg-white border border-[var(--border)]"}`}>
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
        <h2 className={`text-center text-xl font-bold ${dark ? "text-white" : "text-[var(--primary)]"}`}>
          Research Use Notice
        </h2>
        <p className={`mt-4 text-center text-sm leading-relaxed ${dark ? "text-white/70" : "text-[var(--primary)]/70"}`}>
          Peak State Labs provides compounds intended for laboratory research
          and educational purposes only. These materials are not approved for
          human consumption. By continuing, you acknowledge this information.
        </p>

        {/* Button */}
        <button
          onClick={dismiss}
          className={`mt-6 w-full h-12 rounded-2xl text-base font-semibold ${dark ? "bg-[var(--accent)] text-[#0b0f1a] hover:opacity-90" : "btn-primary"}`}
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
