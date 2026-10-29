"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import posthog from "posthog-js";
import { siteCopy } from "@/content/siteCopy";
import { Container } from "@/app/components/Container";
import { MEMBERS_BASE, SignupForm, useMemberCount } from "./SignupForm";

export type SignupReview = {
  name: string;
  initial: string;
  quote: string;
  stats: string[];
};

/** Fire-and-forget PostHog capture that never breaks the page. */
function track(event: string, props?: Record<string, string>) {
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must never break the page.
  }
}

const TRUST_POINTS: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "99%+ purity",
    body: "Every compound meets our purity standard.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  },
  {
    title: "Third-party lab tested",
    body: "Independent COA for every batch.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />,
  },
  {
    title: "1-on-1 coaching",
    body: "Included with every order — even a single vial.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />,
  },
];

/**
 * /signup, two-step: the page is just the offer and one "Get Access Now"
 * button; the account form slides up in a sheet when it (or the logo, or the
 * "Members save 10%" pill — what visitors kept tapping) is tapped.
 */
export function SignupLanding({ review }: { review: SignupReview | null }) {
  const [open, setOpen] = useState(false);
  const members = useMemberCount();

  // flushSync so the sheet is interactive before we focus the first field —
  // focusing inside the tap is what lets phones raise the keyboard.
  const openForm = useCallback((placement: string) => {
    track("signup_page_cta_clicked", { placement });
    flushSync(() => setOpen(true));
    document.getElementById("signup-name")?.focus({ preventScroll: true });
  }, []);

  const closeForm = useCallback(() => {
    track("signup_page_sheet_closed");
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForm();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeForm]);

  const ctaClass =
    "btn-primary inline-flex w-full h-16 items-center justify-center gap-2 rounded-2xl px-6 text-lg sm:text-xl font-bold shadow-lg";

  return (
    <>
      {/* Header — the logo opens the form (visitors tap it expecting to get in) */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={() => openForm("header_logo")}
            className="flex items-center gap-2 font-bold text-lg"
            aria-label="Peak State Labs — get access"
          >
            <img src="/logo.png" alt="" className="h-7 w-7 rounded-lg" />
            <span>{siteCopy.brand.name}</span>
          </button>
          <button
            type="button"
            onClick={() => openForm("header_button")}
            className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold"
          >
            Get Access
          </button>
        </Container>
      </header>

      <main>
        {/* ── First screen: offer + one button ─────────────────── */}
        <section className="relative overflow-clip gradient-hero">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>
          <Container className="relative py-12 sm:py-20">
            <div className="max-w-xl mx-auto text-center">
              <button
                type="button"
                onClick={() => openForm("members_pill")}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-[0.18em] text-[var(--accent-dark)]"
              >
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                MEMBERS SAVE 10%
              </button>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
                Get 10% Off Your First Order
              </h1>
              <p className="mt-5 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed text-balance">
                Create your free account and your code appears instantly.
              </p>

              <div className="mt-8">
                <button type="button" onClick={() => openForm("hero")} className={ctaClass}>
                  Get Access Now <span aria-hidden="true">→</span>
                </button>
                <p
                  aria-hidden={members === null}
                  className={`mt-3 text-sm font-semibold text-[var(--primary)]/60 transition-opacity duration-300 ${
                    members === null ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <span className="text-[var(--accent-dark)]">✓</span> Join{" "}
                  {(members ?? MEMBERS_BASE).toLocaleString("en-US")} verified
                  members · Free · 10 seconds
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── For people who scroll before deciding ─────────────── */}
        <section className="bg-white">
          <Container className="py-12 sm:py-16">
            <div className="max-w-xl mx-auto">
              <ul className="space-y-3">
                {TRUST_POINTS.map((t) => (
                  <li
                    key={t.title}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-4 py-4"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-[var(--accent-dark)] shadow-sm">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                        {t.icon}
                      </svg>
                    </span>
                    <span>
                      <span className="block font-bold text-[var(--primary)]">{t.title}</span>
                      <span className="block text-sm text-[var(--primary)]/65">{t.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              {review ? (
                <figure className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)] font-bold">
                      {review.initial}
                    </span>
                    <div>
                      <p className="font-bold text-[var(--primary)]">{review.name}</p>
                      <p className="text-xs font-semibold text-[var(--accent-dark)]">★★★★★</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 text-[var(--primary)]/80 leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  {review.stats.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {review.stats.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-bold text-[var(--accent-dark)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </figure>
              ) : null}

              <div className="mt-8">
                <button type="button" onClick={() => openForm("body")} className={ctaClass}>
                  Get Access Now <span aria-hidden="true">→</span>
                </button>
              </div>

              <p className="mt-8 text-center text-xs text-[var(--primary)]/50 leading-relaxed">
                Materials are supplied strictly for laboratory research and
                non-human use. You must be 21 or older to create an account.
              </p>
            </div>
          </Container>
        </section>
      </main>

      {/* ── The form, in a sheet: bottom sheet on phones, centered on desktop ── */}
      <div
        className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <button
          type="button"
          aria-label="Close"
          tabIndex={-1}
          onClick={closeForm}
          className="absolute inset-0 bg-[var(--primary)]/50 backdrop-blur-sm"
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create your free account"
          className={`relative w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full sm:translate-y-8"
          }`}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur px-5 pt-4 pb-2">
            <span className="mx-auto h-1.5 w-12 rounded-full bg-[var(--border)] sm:hidden" aria-hidden="true" />
            <button
              type="button"
              onClick={closeForm}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-[var(--primary)]/60 hover:bg-[var(--muted)]"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-5">
            <SignupForm bare />
          </div>
        </div>
      </div>
    </>
  );
}
