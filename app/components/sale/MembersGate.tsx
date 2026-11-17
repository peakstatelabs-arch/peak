"use client";

import { useCallback, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { readClientContact, saveClientContact } from "@/app/lib/clientContact";
import { acknowledgeDisclaimer } from "@/app/lib/disclaimer";
import { BF_GATE_STORAGE_KEY } from "@/app/lib/bfStacks";

/** True when this visitor skipped the /research-access sign-up and has no account yet. */
export function needsMembership(): boolean {
  try {
    if (window.localStorage.getItem(BF_GATE_STORAGE_KEY) !== "1") return false;
  } catch {
    return false;
  }
  return !readClientContact().email;
}

/** Called by the /research-access skip link. */
export function markGateRequired(): void {
  try {
    window.localStorage.setItem(BF_GATE_STORAGE_KEY, "1");
  } catch {
    // Storage blocked — they just won't be gated.
  }
}

/**
 * Members-only gate. `guard(fn)` runs fn straight away for everyone except
 * visitors who skipped the /research-access sign-up; they see the sign-up
 * modal first, and fn runs once they've created their account.
 */
export function useMembersGate(source: string): {
  guard: (fn: () => void) => void;
  modal: ReactNode;
} {
  const [pending, setPending] = useState<(() => void) | null>(null);

  const guard = useCallback((fn: () => void) => {
    if (needsMembership()) setPending(() => fn);
    else fn();
  }, []);

  const modal = pending ? (
    <MembersGateModal
      source={source}
      onClose={() => setPending(null)}
      onJoined={() => {
        const fn = pending;
        setPending(null);
        fn();
      }}
    />
  ) : null;

  return { guard, modal };
}

function MembersGateModal({
  source,
  onClose,
  onJoined,
}: {
  source: string;
  onClose: () => void;
  onJoined: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter your name and a valid email.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the research-only terms to continue.");
      return;
    }
    setError(null);
    setSubmitting(true);
    saveClientContact({ email: cleanEmail, name: cleanName });
    acknowledgeDisclaimer();
    try {
      posthog.identify(cleanEmail, { email: cleanEmail, name: cleanName });
      posthog.capture("bf_members_gate_signup", { source });
    } catch {
      // Analytics never blocks the sale.
    }
    try {
      await fetch("/api/research-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, source: "bf-members-gate" }),
      });
    } catch (err) {
      console.error("Failed to record account:", err);
    }
    try {
      window.localStorage.removeItem(BF_GATE_STORAGE_KEY);
    } catch {
      // ignore
    }
    setSubmitting(false);
    onJoined();
  }

  const input =
    "mt-1.5 w-full h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white placeholder:text-white/40 outline-none focus:border-[var(--accent)]";

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Members-only sale"
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#0b0f1a] p-6 sm:p-8 text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-2 text-white/60 hover:text-white"
        >
          ✕
        </button>
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
          Members-only sale
        </p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold leading-tight">
          Your stack is ready. Unlock your sale pricing.
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Up to 60% off is reserved for members. Create your free account in
          30 seconds to claim it.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block text-sm font-bold">
            Name
            <input
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              placeholder="First name"
            />
          </label>
          <label className="block text-sm font-bold">
            Email
            <input
              className={input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex items-start gap-2.5 text-xs text-white/70">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
            />
            I confirm all materials are for laboratory research only and not
            for human consumption.
          </label>
          {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-base font-extrabold text-[#0b0f1a] hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Unlocking…" : "Unlock sale pricing →"}
          </button>
        </form>
      </div>
    </div>
  );
}
