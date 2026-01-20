"use client";

import { useMemo, useState } from "react";

function isValidEmail(value: string) {
  // Lightweight check (no strict RFC).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function EmailCapture({
  emailTo,
  subject,
  bodyHint,
}: {
  emailTo: string;
  subject: string;
  bodyHint: string;
}) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = email.trim();
  const valid = useMemo(() => (trimmed.length ? isValidEmail(trimmed) : false), [
    trimmed,
  ]);
  const showError = touched && trimmed.length > 0 && !valid;

  const mailtoHref = useMemo(() => {
    const body = `${bodyHint} ${trimmed}`.trim();
    const params = new URLSearchParams();
    if (subject) params.set("subject", subject);
    if (body) params.set("body", body);
    return `mailto:${encodeURIComponent(emailTo)}?${params.toString()}`;
  }, [bodyHint, emailTo, subject, trimmed]);

  return (
    <div className="w-full">
      <form
        className="flex w-full flex-col gap-3 sm:flex-row sm:items-start"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (!valid) return;
          window.location.href = mailtoHref;
        }}
      >
        <div className="w-full">
          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black shadow-sm outline-none ring-0 placeholder:text-black/40 focus:border-black/20 focus:shadow md:text-base"
          />
          {showError ? (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid email address.
            </p>
          ) : null}
          <p className="mt-2 text-xs text-black/60">
            Submitting opens your email app. You can swap this for a real form
            provider later.
          </p>
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 md:text-base"
          disabled={!trimmed.length}
        >
          Join waitlist
        </button>
      </form>
    </div>
  );
}

