"use client";

import { useState } from "react";

type Tab = "create" | "signin";

export function ResearchAccessForm() {
  const [tab, setTab] = useState<Tab>("create");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
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

    try {
      await fetch("/api/research-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username.trim(),
          email: email.trim(),
        }),
      });
    } catch (err) {
      console.error("Failed to record account:", err);
    }

    window.location.href = "https://peakstate.shop";
  }

  function handleSignInSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!signInEmail.trim()) {
      setError("Please enter your email to sign in.");
      return;
    }

    if (!signInAgreed) {
      setError("You must agree to the research-only terms to continue.");
      return;
    }

    setError(null);
    window.location.href = "https://peakstate.shop";
  }

  return (
    <div className="mt-6">
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
          Create an account
        </button>
      </div>

      {tab === "create" ? (
        <form onSubmit={handleCreateSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-bold text-[var(--primary)]"
            >
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-[var(--primary)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white"
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
                By creating an account you agree to the research-only
                terms above.
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
        <form onSubmit={handleSignInSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-bold text-[var(--primary)]"
            >
              Email
            </label>
            <input
              id="signin-email"
              name="signin-email"
              type="email"
              autoComplete="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="mt-2 w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white"
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
