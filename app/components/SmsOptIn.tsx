"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import {
  SMS_CHECKBOX_TEXT,
  SMS_CONSENT_TEXT,
  SMS_MIN_AGE,
  SMS_UNDERAGE_TEXT,
  ageFromDob,
  type SmsOptInSource,
} from "@/app/lib/smsOptInCopy";

type Status = "idle" | "submitting" | "done";

/** Today's date in the visitor's own timezone, as YYYY-MM-DD. */
function localToday(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

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
  const [agreed, setAgreed] = useState(false);
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Age gate: the consent checkbox and button stay locked until a valid date
  // of birth shows the customer is 18+.
  // Set on the client only, so server and browser render the same markup.
  const [today, setToday] = useState("");
  useEffect(() => setToday(localToday()), []);
  const age = dob && today ? ageFromDob(dob, today) : null;
  const ageVerified = age !== null && age >= SMS_MIN_AGE;
  const underage = age !== null && age < SMS_MIN_AGE;

  // Keep the "You're in" state across refreshes of the same order page.
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey)) {
        setAgreed(true);
        setStatus("done");
      }
    } catch {
      // Storage blocked — fine, the button just shows again.
    }
  }, [storageKey]);

  async function optIn(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "idle" || !agreed || !ageVerified) return;
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
          consentChecked: agreed,
          dateOfBirth: dob,
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
            {!done && (
              <div className="w-full max-w-sm text-left">
                <label
                  htmlFor={`sms-dob-${source}`}
                  className="block text-sm font-semibold text-[var(--primary)]"
                >
                  Date of birth
                </label>
                <input
                  id={`sms-dob-${source}`}
                  type="date"
                  name="date_of_birth"
                  autoComplete="bday"
                  required
                  min="1900-01-01"
                  max={today || undefined}
                  value={dob}
                  disabled={status !== "idle"}
                  onChange={(e) => {
                    setDob(e.target.value);
                    const next = ageFromDob(e.target.value, today);
                    if (next === null || next < SMS_MIN_AGE) setAgreed(false);
                  }}
                  aria-describedby={underage ? `sms-dob-msg-${source}` : undefined}
                  className="mt-1 h-14 w-full rounded-2xl border-2 border-[var(--border)] bg-white px-5 text-base text-[var(--primary)] outline-none focus:border-[var(--accent)]"
                />
                {underage && (
                  <p
                    id={`sms-dob-msg-${source}`}
                    role="alert"
                    className="mt-2 text-sm text-red-600 font-medium"
                  >
                    {SMS_UNDERAGE_TEXT}
                  </p>
                )}
              </div>
            )}
            <label
              className={`flex w-full max-w-sm items-start gap-3 text-left text-sm text-[var(--primary)]/80 leading-snug ${
                ageVerified || done ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
            >
              <input
                type="checkbox"
                name="sms_consent"
                checked={agreed}
                disabled={status !== "idle" || !ageVerified}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--primary)]"
              />
              <span>{SMS_CHECKBOX_TEXT}</span>
            </label>
            <button
              type="submit"
              disabled={status !== "idle" || !agreed || !ageVerified}
              aria-live="polite"
              className={`inline-flex min-h-14 w-full max-w-sm items-center justify-center gap-2 rounded-2xl px-8 py-3 text-base sm:text-lg ${
                done
                  ? "bg-[var(--primary)] text-white font-bold"
                  : "btn-accent font-extrabold uppercase tracking-wide shadow-lg disabled:opacity-50 disabled:pointer-events-none"
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
