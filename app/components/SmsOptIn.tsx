"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import {
  SMS_CONSENT_TEXT,
  type SmsOptInSource,
} from "@/app/lib/smsOptInCopy";

type Status = "idle" | "submitting" | "done";

/**
 * Post-purchase "support by text" opt-in. When the Stripe checkout already
 * captured a phone (`hasPhone`), it's one tap — the server looks the number up
 * from the session. Otherwise (e.g. PayPal orders) a single phone field shows.
 */
export function SmsOptIn({
  source,
  sessionId,
  hasPhone,
  phoneLast4,
  copy,
}: {
  source: SmsOptInSource;
  sessionId?: string;
  hasPhone: boolean;
  phoneLast4?: string | null;
  copy: string;
}) {
  const storageKey = `peak:sms-optin:${sessionId || source}`;
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Keep the "You're in" state across refreshes of the same order page.
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) setStatus("done");
    } catch {
      // Storage blocked — fine, the button just shows again.
    }
  }, [storageKey]);

  async function optIn(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/sms-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          sessionId,
          phone: hasPhone ? undefined : phone,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      try {
        localStorage.setItem(storageKey, new Date().toISOString());
      } catch {}
      try {
        posthog.capture("sms_support_opt_in", { source });
      } catch {}
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  const done = status === "done";

  return (
    <Section className="bg-white !py-10 sm:!py-14">
      <Container>
        <div className="max-w-2xl mx-auto rounded-2xl border border-[var(--accent)]/40 bg-[var(--muted)] p-6 sm:p-8 text-center shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Want support by text too?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/80 leading-relaxed">
            {copy}
          </p>

          <form onSubmit={optIn} className="mt-6 flex flex-col items-center gap-3">
            {!hasPhone && !done && (
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                required
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 w-full max-w-sm rounded-2xl border-2 border-[var(--border)] bg-white px-5 text-base text-[var(--primary)] outline-none focus:border-[var(--accent)]"
              />
            )}
            <button
              type="submit"
              disabled={status !== "idle"}
              aria-live="polite"
              className={`inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl px-8 py-3 text-base sm:text-lg ${
                done
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "btn-accent font-extrabold uppercase tracking-wide shadow-lg disabled:opacity-70"
              }`}
            >
              {done ? (
                <>
                  <svg
                    className="w-5 h-5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  You&rsquo;re in — we&rsquo;ll text you soon.
                </>
              ) : status === "submitting" ? (
                "Signing you up…"
              ) : (
                "YES — TEXT ME SUPPORT"
              )}
            </button>
            {hasPhone && phoneLast4 && !done && (
              <p className="text-sm text-[var(--primary)]/60">
                We&rsquo;ll text the number on your order ending in {phoneLast4}.
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {error}
              </p>
            )}
          </form>

          <p className="mt-4 text-xs text-[var(--primary)]/50 leading-relaxed max-w-md mx-auto">
            {SMS_CONSENT_TEXT}
          </p>
        </div>
      </Container>
    </Section>
  );
}
