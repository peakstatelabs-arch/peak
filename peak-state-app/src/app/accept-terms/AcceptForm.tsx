"use client";

import { useState } from "react";

export function AcceptForm({ version }: { version: string }) {
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!checked) return;
    setBusy(true);
    setError(null);

    let res: Response;
    try {
      res = await fetch("/portal/api/auth/accept-terms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ version }),
      });
    } catch (e) {
      setError(
        "Network error. Check your connection and try again. " +
          (e instanceof Error ? e.message : "")
      );
      setBusy(false);
      return;
    }

    const json = await res.json().catch(() => ({} as Record<string, unknown>));
    if (!res.ok) {
      setError(
        typeof json.error === "string"
          ? json.error
          : "Couldn't save terms acceptance. Please try again."
      );
      setBusy(false);
      return;
    }

    // Hard reload so any cached RSC layout decision is busted — same
    // approach as the password-change form for the same reason.
    window.location.assign("/portal/dashboard");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-border accent-[rgb(var(--accent))] flex-shrink-0"
        />
        <span className="text-sm text-fg">
          I&apos;m 18 or older and I accept the Terms of Service and Privacy Policy. I understand
          this Service is for self-tracking and education, not medical advice.
        </span>
      </label>
      {error && (
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger font-medium">
          {error}
        </div>
      )}
      <button type="submit" disabled={!checked || busy} className="btn-primary w-full">
        {busy ? "Saving…" : "Accept & continue"}
      </button>
    </form>
  );
}
