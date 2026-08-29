"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { saveClientContact } from "@/app/lib/clientContact";

type Tab = "create" | "signin";

const SHOP_URL = "https://peakstate.shop";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.67-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.67 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function ResearchAccessForm() {
  const [tab, setTab] = useState<Tab>("create");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInName, setSignInName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signInAgreed, setSignInAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
  }

  function handleGoogle() {
    try {
      posthog.capture("research_access_signup", { method: "google" });
    } catch (err) {
      console.error("PostHog capture failed:", err);
    }
    window.location.href = SHOP_URL;
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
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Research access"
        className="grid grid-cols-2 gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)] p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "signin"}
          onClick={() => switchTab("signin")}
          className={`h-11 rounded-full text-sm font-bold transition-all ${
            tab === "signin"
              ? "bg-white text-[var(--primary)] border-2 border-[var(--primary)] shadow-sm"
              : "text-[var(--primary)]/70 hover:text-[var(--primary)]"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "create"}
          onClick={() => switchTab("create")}
          className={`h-11 rounded-full text-sm font-bold transition-all ${
            tab === "create"
              ? "bg-white text-[var(--primary)] border-2 border-[var(--primary)] shadow-sm"
              : "text-[var(--primary)]/70 hover:text-[var(--primary)]"
          }`}
        >
          Create account
        </button>
      </div>

      {/* Continue with Google */}
      <button
        type="button"
        onClick={handleGoogle}
        className="mt-6 inline-flex w-full h-12 items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-white text-base font-bold text-[var(--primary)] transition-colors hover:bg-[var(--muted)]"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="mt-3 text-center text-xs text-[var(--primary)]/50 leading-relaxed">
        By continuing with Google, you confirm the research-use access terms.
      </p>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/40">
          or
        </span>
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

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
              Email or Username
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

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary inline-flex w-full h-14 items-center justify-center rounded-2xl px-6 text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSignInSubmit} className="space-y-5">
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
              Email or Username
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

          <div>
            <label htmlFor="signin-password" className={labelClass}>
              Password
            </label>
            <input
              id="signin-password"
              name="signin-password"
              type="password"
              autoComplete="current-password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
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
        </form>
      )}
    </div>
  );
}
