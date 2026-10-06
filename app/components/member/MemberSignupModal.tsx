"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { saveClientContact } from "@/app/lib/clientContact";
import { acknowledgeDisclaimer } from "@/app/lib/disclaimer";
import { MEMBER_DISCOUNT_CODE } from "@/app/research-access/constants";
import { notifyMemberChange } from "./memberState";

type View = "create" | "signin" | "success";

/** Fire-and-forget PostHog capture that never breaks the form. */
function track(event: string, props?: Record<string, string>) {
  try {
    posthog.capture(event, props);
  } catch (err) {
    console.error("PostHog capture failed:", err);
  }
}

export function MemberSignupModal({
  open,
  onClose,
  page,
  leadSource,
}: {
  open: boolean;
  onClose: () => void;
  /** Where the popup lives, for analytics ("homepage" | "getreta"). */
  page: string;
  /**
   * Zapier lead source. Omit to use the API default ("research-access-form"),
   * exactly like /research-access does.
   */
  leadSource?: string;
}) {
  const [view, setView] = useState<View>("create");
  const [signedUpVia, setSignedUpVia] = useState<"create" | "signin">("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (view !== "success") track("member_popup_closed", { page, view });
    onClose();
  }, [view, page, onClose]);

  // Lock page scroll behind the popup while it's open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Move focus into the dialog when it opens or switches views.
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open, view]);

  // Escape closes it.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  function switchView(next: "create" | "signin") {
    setView(next);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const method = view === "signin" ? "signin" : "create";

    if (!name.trim() || !email.trim()) {
      track("member_popup_blocked", { page, method, reason: "missing_fields" });
      setError("Please fill in your name and email.");
      return;
    }
    if (!agreed) {
      track("member_popup_blocked", { page, method, reason: "terms_unchecked" });
      setError("You must agree to the research-only terms to continue.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    saveClientContact({ email: cleanEmail, name: cleanName });
    // They just agreed to the research-only terms, so skip the notice popup.
    acknowledgeDisclaimer();

    try {
      posthog.identify(cleanEmail, { email: cleanEmail, name: cleanName });
    } catch (err) {
      console.error("PostHog identify failed:", err);
    }
    track("member_popup_signup", { page, method });

    // Same API + payload as the access pages, so the "account created" Zap
    // fires identically. Only new accounts trigger it — never sign-ins.
    if (method === "create") {
      try {
        await fetch("/api/research-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            ...(leadSource ? { source: leadSource } : {}),
          }),
        });
      } catch (err) {
        console.error("Failed to record account:", err);
      }
    }

    setSubmitting(false);
    setSignedUpVia(method);
    setView("success");
    notifyMemberChange(); // hides the banner behind the popup
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(MEMBER_DISCOUNT_CODE);
      setCopied(true);
      track("member_popup_code_copied", { page, method: signedUpVia });
    } catch {
      // Clipboard unavailable — the code stays visible to copy by hand.
    }
  }

  const inputClass =
    "mt-2 w-full h-12 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white";
  const labelClass = "block text-sm font-bold text-[var(--primary)]";

  return (
    <div className="fixed inset-0 z-[97]">
      {/* Backdrop — tap outside to close */}
      <div
        className="absolute inset-0 bg-[var(--primary)]/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel: bottom sheet on phones, centered card on larger screens */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-popup-title"
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-6 text-[var(--primary)] shadow-2xl outline-none sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--primary)]/60 transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 5.3a1 1 0 0 0-1.4 1.4L8.6 10l-3.7 3.3a1 1 0 1 0 1.4 1.4L10 11.4l3.7 3.3a1 1 0 0 0 1.4-1.4L11.4 10l3.7-3.3a1 1 0 0 0-1.4-1.4L10 8.6 6.3 5.3Z" />
          </svg>
        </button>

        {view === "success" ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/15">
              <svg className="h-7 w-7 text-[var(--accent-dark)]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 id="member-popup-title" className="mt-4 text-2xl font-bold tracking-tight">
              You&rsquo;re in!
            </h2>
            <p className="mt-2 text-sm text-[var(--primary)]/70">
              Here&rsquo;s your 10% member discount code:
            </p>

            <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[var(--muted)] py-3 pl-5 pr-3">
              <span className="min-w-0 font-mono text-xl sm:text-2xl font-bold tracking-[0.15em]">
                {MEMBER_DISCOUNT_CODE}
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="h-10 w-24 flex-shrink-0 rounded-xl bg-white text-sm font-bold shadow-sm ring-1 ring-[var(--border)] transition-colors hover:bg-[var(--accent)]/10"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <p className="mt-3 text-xs text-[var(--primary)]/60 leading-relaxed">
              Enter it at checkout for 10% off your order.
              {signedUpVia === "create" && <> We&rsquo;ve also sent it to {email.trim().toLowerCase()}.</>}
            </p>

            <button
              type="button"
              onClick={() => {
                track("member_popup_continue", { page, method: signedUpVia });
                onClose();
              }}
              className="btn-primary mt-6 inline-flex w-full min-h-14 items-center justify-center rounded-2xl px-6 py-3 text-lg font-semibold"
            >
              Start shopping <span aria-hidden="true" className="ml-2">→</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="pr-8">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--accent-dark)]">
                MEMBERS SAVE 10%
              </p>
              <h2 id="member-popup-title" className="mt-1 text-2xl font-bold tracking-tight">
                {view === "signin" ? "Welcome back" : "Get 10% off your order"}
              </h2>
              <p className="mt-1 text-sm text-[var(--primary)]/60">
                {view === "signin"
                  ? "Sign in to unlock your 10% member discount."
                  : "Create your free account and get your code instantly."}
              </p>
            </div>

            <div>
              <label htmlFor="member-name" className={labelClass}>
                Name
              </label>
              <input
                id="member-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="member-email" className={labelClass}>
                Email
              </label>
              <input
                id="member-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className={inputClass}
              />
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
              <h3 className="text-sm font-bold">Research Use Only</h3>
              <p className="mt-1.5 text-xs text-[var(--primary)]/70 leading-relaxed">
                By using this site, you acknowledge that all products and
                information are provided for research purposes only and are not
                intended for human consumption or medical use. You must be 21
                years of age or older to use this website.
              </p>
              <label className="mt-3 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setError(null);
                  }}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[var(--border)] accent-[var(--accent-dark)]"
                />
                <span className="text-sm font-bold leading-snug">
                  {view === "signin"
                    ? "By signing in you agree to the research-only terms above."
                    : "By creating an account you agree to the research-only terms above."}
                </span>
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center" role="alert">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex w-full min-h-14 items-center justify-center rounded-2xl px-4 py-3 text-base sm:text-lg font-semibold leading-tight disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {view === "signin"
                  ? "Sign in"
                  : submitting
                    ? "Creating account..."
                    : "Create Account & Get 10% Off"}
              </button>
              {view === "create" && (
                <p className="mt-3 text-center text-xs text-[var(--primary)]/50 leading-relaxed">
                  Free · takes 10 seconds · we never share your email.
                </p>
              )}
            </div>

            <p className="text-center text-sm text-[var(--primary)]/70">
              {view === "signin" ? "New here? " : "Already a member? "}
              <button
                type="button"
                onClick={() => switchView(view === "signin" ? "create" : "signin")}
                className="font-bold text-[var(--accent-dark)] hover:underline"
              >
                {view === "signin" ? "Create a free account" : "Sign in"}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
