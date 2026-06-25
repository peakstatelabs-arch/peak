"use client";

import { useState } from "react";

export function ChangePasswordForm({ firstLogin = true }: { firstLogin?: boolean }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (pw !== pw2) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);

    let res: Response;
    try {
      res = await fetch("/portal/api/auth/complete-password-change", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
    } catch (e) {
      setError(
        "Network error. Check your connection and try again. " +
          (e instanceof Error ? e.message : "")
      );
      setLoading(false);
      return;
    }

    const json = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok) {
      setError(
        typeof json.error === "string"
          ? json.error
          : "Couldn't update your password. Please try again."
      );
      setLoading(false);
      return;
    }

    // Hard reload — bypasses any Next.js client router cache or RSC cache
    // that might still see the old must_change_password flag, which was
    // causing the silent password-change loop on iPhone Safari.
    const next =
      json.needsReLogin
        ? "/portal/login?changed=1"
        : firstLogin
        ? "/portal/dashboard"
        : "/portal/profile";
    window.location.assign(next);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">New password</label>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="input"
          placeholder="At least 10 characters"
        />
      </div>
      <div>
        <label className="label">Confirm new password</label>
        <input
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="input"
        />
      </div>
      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger font-medium">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Updating…" : "Set password"}
      </button>
    </form>
  );
}
