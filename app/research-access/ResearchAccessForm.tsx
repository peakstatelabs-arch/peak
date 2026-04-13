"use client";

import { useState } from "react";

export function ResearchAccessForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      setError("Please fill in your username and email.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the research-only terms to continue.");
      return;
    }

    setError(null);
    window.location.href = "https://peakstate.shop";
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-bold text-[var(--primary)]"
        >
          Username
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
          By using this site, you acknowledge that all products and information
          are provided for research purposes only and are not intended for human
          consumption or medical use.
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
        className="btn-primary inline-flex w-full h-14 items-center justify-center rounded-2xl px-6 text-lg font-semibold"
      >
        Create account
      </button>
    </form>
  );
}
