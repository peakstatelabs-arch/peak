"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ChangePasswordForm({ firstLogin = true }: { firstLogin?: boolean }) {
  const router = useRouter();
  const supabase = createClient();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (pw.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (pw !== pw2) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    const { error: pwError } = await supabase.auth.updateUser({ password: pw });
    if (pwError) {
      setError("Couldn't update your password. Please try again.");
      setLoading(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", user.id);
    }
    setSuccess("Password updated.");
    setTimeout(() => {
      // Gates in (app)/layout walk first-time users through terms → protocol
      // wizard automatically; non-first-login just goes back to profile.
      router.push(firstLogin ? "/dashboard" : "/profile");
      router.refresh();
    }, 600);
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
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {success}
        </div>
      )}
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Updating…" : "Set password"}
      </button>
    </form>
  );
}
