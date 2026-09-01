"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { saveClientContact } from "@/app/lib/clientContact";

type Tab = "create" | "signin";

const SHOP_URL = "https://peakstate.shop";

export function ResearchAccessForm() {
  const [tab, setTab] = useState<Tab>("create");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [signInName, setSignInName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signInAgreed, setSignInAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
  }

  async function handleCreateSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the research-only terms to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = username.trim();

    saveClientContact({ email: cleanEmail, name: cleanName });

    try {
      posthog.identify(cleanEmail, { email: cleanEmail, name: cleanName });
      posthog.capture("research_access_signup", { method: "create" });
    } catch (err) {
      console.error("PostHog identify failed:", err);
    }

    try {
      await fetch("/api/research-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
        }),
      });
    } catch (err) {
      console.error("Failed to record account:", err);
    }

    window.location.href = SHOP_URL;
  }

  function handleSignInSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!signInName.trim() || !signInEmail.trim()) {
      setError("Please enter your name and email to sign in.");
      return;
    }

    if (!signInAgreed) {
      setError("You must agree to the research-only terms to continue.");
      return;
    }

    setError(null);

    const cleanEmail = signInEmail.trim().toLowerCase();
    const cleanName = signInName.trim();
    saveClientContact({ email: cleanEmail, name: cleanName });

    try {
      posthog.identify(cleanEmail, { email: cleanEmail, name: cleanName });
      posthog.capture("research_access_signup", { method: "signin" });
    } catch (err) {
      console.error("PostHog identify failed:", err);
    }

    window.location.href = SHOP_URL;
  }

  const inputClass =
    "mt-2 w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white";
  const labelClass = "block text-sm font-bold text-[var(--primary)]";

  return (
    <div>
      {tab === "create" ? (
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className={labelClass}>
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <h3 className="text-base font-bold text-[var(--primary)]">
              Research Use Only
            </h3>
            <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
              By using this site, you acknowledge that all products and
              information are provided for research purposes only and are not
              intended for human consumption or medical use.
            </p>
            <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
              You must be 21 years of age or older to use this website.
            </p>
            <label className="mt-4 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 flex-shrink-0 rounded border-[var(--border)] accent-[var(--accent-dark)]"
              />
              <span className="text-sm font-bold text-[var(--primary)] leading-snug">
                By creating an account you agree to the research-only terms
                above.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center" role="alert">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary inline-flex w-full h-14 items-center justify-center rounded-2xl px-6 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Getting access..." : "Get Instant Access"}
            </button>
            <p className="mt-3 text-center text-xs text-[var(--primary)]/50 leading-relaxed">
              Free · takes 10 seconds · we never share your email.
            </p>
          </div>

          <p className="text-center text-sm text-[var(--primary)]/70">
            Already have access?{" "}
            <button
              type="button"
              onClick={() => switchTab("signin")}
              className="font-bold text-[var(--accent-dark)] hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSignInSubmit} className="space-y-5">
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight text-[var(--primary)]">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-[var(--primary)]/60">
              Sign in to continue browsing product information.
            </p>
          </div>

          <div>
            <label htmlFor="signin-name" className={labelClass}>
              Name
            </label>
            <input
              id="signin-name"
              name="signin-name"
              type="text"
              autoComplete="name"
              value={signInName}
              onChange={(e) => setSignInName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="signin-email" className={labelClass}>
              Email
            </label>
            <input
              id="signin-email"
              name="signin-email"
              type="email"
              autoComplete="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <h3 className="text-base font-bold text-[var(--primary)]">
              Research Use Only
            </h3>
            <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
              By using this site, you acknowledge that all products and
              information are provided for research purposes only and are not
              intended for human consumption or medical use.
            </p>
            <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
              You must be 21 years of age or older to use this website.
            </p>
            <label className="mt-4 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={signInAgreed}
                onChange={(e) => setSignInAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 flex-shrink-0 rounded border-[var(--border)] accent-[var(--accent-dark)]"
              />
              <span className="text-sm font-bold text-[var(--primary)] leading-snug">
                By signing in you agree to the research-only terms above.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary inline-flex w-full h-14 items-center justify-center rounded-2xl px-6 text-lg font-semibold"
          >
            Sign in
          </button>

          <p className="text-center text-sm text-[var(--primary)]/70">
            Need an account?{" "}
            <button
              type="button"
              onClick={() => switchTab("create")}
              className="font-bold text-[var(--accent-dark)] hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
