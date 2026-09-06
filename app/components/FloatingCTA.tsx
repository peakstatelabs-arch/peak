"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

const SUPPRESSED_PATHS = [
  "/thankyou",
  "/instructions",
  "/research-access",
  "/bridge",
  "/transitionguide",
  "/creator",
  "/creator/apply",
  "/creator/success",
];

const CAL_LINK = "peakstatelabs/power-cut-strategy-call";
const CAL_NAMESPACE = "power-cut-strategy-call";
const CAL_CONFIG = {
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
  theme: "dark",
};

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns?: Record<string, CalFn>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

function loadCalScript() {
  if (typeof window === "undefined") return;
  if (window.Cal && window.Cal.ns && window.Cal.ns[CAL_NAMESPACE]) return;

  // Inline of Cal.com's official init snippet
  (function (C: Window, A: string, L: string) {
    const p = function (a: CalFn, ar: IArguments | unknown[]) {
      (a.q = a.q || []).push(ar);
    };
    const d = C.document;
    const existing = C.Cal as CalFn | undefined;
    C.Cal =
      existing ||
      (function (this: unknown) {
        const cal = C.Cal as CalFn;
        // eslint-disable-next-line prefer-rest-params
        const ar = arguments as unknown as IArguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).setAttribute("src", A);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function (this: unknown) {
            // eslint-disable-next-line prefer-rest-params
            p(api as unknown as CalFn, arguments as unknown as IArguments);
          } as unknown as CalFn;
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns![namespace] = cal.ns![namespace] || api;
            p(cal.ns![namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else {
            p(cal, ar);
          }
          return;
        }
        p(cal, ar);
      } as unknown as CalFn);
  })(window, "https://app.cal.com/embed/embed.js", "init");

  window.Cal!("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
  window.Cal!.ns![CAL_NAMESPACE]("ui", {
    theme: "dark",
    cssVarsPerTheme: {
      light: { "cal-brand": "#155090" },
      dark: { "cal-brand": "#FFFFFF" },
    },
    hideEventTypeDetails: true,
    layout: "month_view",
  });
}

export function FloatingCTA() {
  const pathname = usePathname();
  const suppressed = SUPPRESSED_PATHS.includes(pathname ?? "");

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Delay mount so it doesn't affect first paint
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(t);
  }, []);

  // One-time gentle nudge ~10s after mount, only if user hasn't opened it yet
  useEffect(() => {
    if (!mounted || suppressed) return;
    if (sessionStorage.getItem("peakcta_seen")) return;
    const t = setTimeout(() => {
      if (!sessionStorage.getItem("peakcta_seen")) setNudge(true);
      const stop = setTimeout(() => setNudge(false), 4200);
      return () => clearTimeout(stop);
    }, 10000);
    return () => clearTimeout(t);
  }, [mounted, suppressed]);

  // Preload Cal script on first hover/focus or after idle, whichever comes first
  useEffect(() => {
    if (!mounted || suppressed) return;
    let done = false;
    const trigger = () => {
      if (done) return;
      done = true;
      loadCalScript();
    };
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    const w = window as IdleWindow;
    const idle =
      w.requestIdleCallback?.(trigger, { timeout: 4000 }) ??
      (window.setTimeout(trigger, 2500) as unknown as number);
    return () => {
      if (typeof idle === "number") clearTimeout(idle);
    };
  }, [mounted, suppressed]);

  const openModal = useCallback(() => {
    sessionStorage.setItem("peakcta_seen", "1");
    setNudge(false);
    loadCalScript();
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => setOpen(false), []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeModal]);

  if (suppressed || !mounted) return null;

  return (
    <>
      {/* Floating trigger button */}
      <div
        className={`fixed z-[90] right-3 sm:right-5 transition-all duration-300 ${
          open
            ? "opacity-0 pointer-events-none translate-y-2"
            : "opacity-100 translate-y-0"
        }`}
        style={{
          bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        {/* Nudge tooltip */}
        <div
          className={`absolute right-0 bottom-full mb-2 origin-bottom-right transition-all duration-500 sm:duration-300 ${
            nudge
              ? "opacity-90 sm:opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-100 sm:scale-95 translate-y-1 pointer-events-none"
          }`}
        >
          <div className="relative whitespace-nowrap rounded-2xl bg-white border border-[var(--border)] shadow-sm sm:shadow-lg px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-sm font-medium text-[var(--primary)]/80 sm:text-[var(--primary)]">
            Have questions? We can help.
            <span className="absolute -bottom-1 right-6 h-2 w-2 rotate-45 bg-white border-r border-b border-[var(--border)]" />
          </div>
        </div>

        <button
          ref={triggerRef}
          onClick={openModal}
          aria-label="Talk to a Peptide Expert"
          className={`group flex items-center gap-2.5 rounded-full bg-[var(--primary)] text-white pl-3.5 pr-4 sm:pl-4 sm:pr-5 h-12 sm:h-14 shadow-[0_10px_30px_rgba(21,80,144,0.35)] hover:shadow-[0_14px_38px_rgba(21,80,144,0.45)] hover:bg-[var(--primary-light)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ${
            nudge ? "sm:animate-pulse-slow" : ""
          }`}
        >
          <span className="relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--accent)]/25 ring-1 ring-[var(--accent)]/40">
            <span className="absolute inset-0 rounded-full bg-[var(--accent)]/40 opacity-0 sm:opacity-60 sm:animate-ping" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative h-3.5 w-3.5 sm:h-4 sm:w-4 text-[var(--accent)]"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--accent-light)]/90">
              Not sure where to begin?
            </span>
            <span className="text-[13px] sm:text-sm font-semibold">
              <span className="sm:hidden">Talk to an Expert</span>
              <span className="hidden sm:inline">Talk to a Peptide Expert</span>
            </span>
          </span>
        </button>
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[95] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={closeModal}
          className="absolute inset-0 bg-[var(--primary)]/55 backdrop-blur-sm"
        />

        {/* Card — bottom sheet on mobile, anchored card on desktop */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="peakcta-title"
          className={`absolute left-0 right-0 bottom-0 sm:left-auto sm:right-5 sm:bottom-5 sm:top-auto sm:w-[400px] transition-all duration-300 ease-out ${
            open
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-6 opacity-0 sm:scale-95"
          }`}
        >
          <div className="relative mx-auto sm:mx-0 w-full bg-white rounded-t-3xl sm:rounded-3xl border border-[var(--border)] shadow-2xl overflow-hidden">
            {/* Compact header band */}
            <div className="relative gradient-primary px-5 sm:px-6 py-4 text-white">
              <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-[var(--accent)]/30 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-[var(--accent)]/20 blur-2xl" />
              </div>

              <button
                onClick={closeModal}
                aria-label="Close"
                className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="relative inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--accent-light)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                Free 15-min strategy call
              </div>

              <h2
                id="peakcta-title"
                className="relative mt-2 pr-10 text-[19px] sm:text-[20px] font-bold leading-[1.25] tracking-tight"
              >
                Get clarity before you commit
              </h2>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 pt-5 pb-6">
              <p className="text-[15px] leading-relaxed text-[var(--primary)]/80">
                Book a free 15-minute call and get clarity around your goals
                and whether the{" "}
                <span className="font-semibold text-[var(--primary)]">
                  POWER CUT
                </span>{" "}
                system is the right starting point for you.
              </p>

              <button
                data-cal-link={CAL_LINK}
                data-cal-namespace={CAL_NAMESPACE}
                data-cal-config={JSON.stringify(CAL_CONFIG)}
                onClick={() => {
                  sessionStorage.setItem("peakcta_booked_intent", "1");
                }}
                className="btn-primary mt-5 w-full h-12 rounded-2xl text-[15px] font-semibold inline-flex items-center justify-center gap-2"
              >
                Find My Starting Point
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>

              <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-[var(--primary)]/75">
                {[
                  { label: "No pressure" },
                  { label: "Personalized" },
                  { label: "15 minutes" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] py-2 px-1.5 text-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3 text-[var(--accent-dark)] flex-shrink-0"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-center text-[11px] text-[var(--primary)]/55">
                Guidance from our team — no obligation, no follow-up sales
                pressure.
              </p>
            </div>

            <div
              className="h-[env(safe-area-inset-bottom)] sm:hidden"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </>
  );
}
