"use client";

import { useState, useMemo } from "react";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

interface EmailSubscriptionProps {
  headline?: string;
  subheadline?: string;
  buttonText?: string;
  successMessage?: string;
}

export function EmailSubscription({
  headline = "Stay Updated",
  subheadline = "Get notified about new drops, exclusive offers, and product updates.",
  buttonText = "Subscribe",
  successMessage = "Thanks for subscribing! We'll keep you updated.",
}: EmailSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);

  const trimmed = email.trim();
  const valid = useMemo(() => (trimmed.length ? isValidEmail(trimmed) : false), [trimmed]);
  const showError = touched && trimmed.length > 0 && !valid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!valid) return;

    // Store email in localStorage for later retrieval
    const storedEmails = JSON.parse(localStorage.getItem("subscribedEmails") || "[]");
    if (!storedEmails.includes(trimmed)) {
      storedEmails.push(trimmed);
      localStorage.setItem("subscribedEmails", JSON.stringify(storedEmails));
    }

    setSubscribedEmails(storedEmails);
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className="w-full max-w-xl mx-auto text-center">
        <div className="p-6 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[var(--accent-dark)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-[var(--primary)]">{successMessage}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 text-sm text-[var(--primary)]/60 hover:text-[var(--primary)] underline"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto text-center">
      <h3 className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">{headline}</h3>
      <p className="mt-3 text-[var(--primary)]/70">{subheadline}</p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="sr-only" htmlFor="subscribe-email">
              Email
            </label>
            <input
              id="subscribe-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(true)}
              className="h-14 w-full rounded-xl border border-[var(--border)] bg-white px-5 text-base text-[var(--primary)] shadow-sm outline-none placeholder:text-[var(--primary)]/40 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!trimmed.length}
            className="h-14 shrink-0 rounded-xl bg-[var(--primary)] px-8 text-base font-semibold text-white shadow-sm transition hover:bg-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buttonText}
          </button>
        </div>
        {showError && (
          <p className="mt-2 text-sm text-red-600 text-left">
            Please enter a valid email address.
          </p>
        )}
        <p className="mt-3 text-xs text-[var(--primary)]/50">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
