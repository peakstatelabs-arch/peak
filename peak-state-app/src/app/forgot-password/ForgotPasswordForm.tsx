"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const redirectTo = `${window.location.origin}/portal/auth/callback?next=/reset-password`;
    const { error: rErr } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (rErr) {
      setError("Couldn't send the reset email. Double-check the address and try again.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-fg">
        <p className="font-medium">Check your inbox.</p>
        <p className="text-fg-muted mt-1">
          If an account exists for <span className="font-mono">{email}</span>, you&apos;ll get a
          reset link within a minute. The link is good for 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="you@example.com"
        />
      </div>
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
