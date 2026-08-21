"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAgeSeconds};SameSite=Lax`;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const SEEN_COOKIE = "powercut_code_seen";
const DELAY_MS = 30000; // fallback trigger (mobile has no exit-intent)
const SCROLL_PCT = 0.6;

export function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"form" | "loading" | "done" | "error">(
    "form",
  );
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [code, setCode] = useState(
    process.env.NEXT_PUBLIC_POWERCUT_CODE || "PEAKSTATE",
  );
  const firedRef = useRef(false);

  const show = useCallback(() => {
    if (firedRef.current) return;
    if (getCookie(SEEN_COOKIE)) return;
    firedRef.current = true;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (getCookie(SEEN_COOKIE)) return;

    const timer = setTimeout(show, DELAY_MS);

    function onScroll() {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= SCROLL_PCT) show();
    }

    // Exit-intent: pointer leaves through the top of the viewport (desktop).
    function onMouseOut(e: MouseEvent) {
      if (!e.relatedTarget && e.clientY <= 0) show();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [show]);

  function dismiss() {
    setCookie(SEEN_COOKIE, "1", THIRTY_DAYS);
    setVisible(false);
  }

  const emailValid = isValidEmail(email);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!emailValid) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/powercut-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }
      if (data.code) setCode(data.code);
      setCookie(SEEN_COOKIE, "1", THIRTY_DAYS);
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--primary)]/60 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-[var(--border)] shadow-2xl p-8 animate-scale-in">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--primary)]/40 transition hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]/70"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {status === "done" ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/15">
              <svg
                className="h-7 w-7 text-[var(--accent-dark)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[var(--primary)]">
              You&rsquo;re in — here&rsquo;s 10% off
            </h2>
            <p className="mt-3 text-sm text-[var(--primary)]/70">
              Use this code at checkout on your first order. We&rsquo;ve also
              sent it to your inbox.
            </p>
            <div className="mt-5 rounded-2xl border-2 border-dashed border-[var(--accent)]/50 bg-[var(--accent)]/10 px-6 py-4">
              <span className="text-2xl font-extrabold tracking-widest text-[var(--accent-dark)]">
                {code}
              </span>
            </div>
            <button
              onClick={dismiss}
              className="btn-primary mt-6 w-full h-12 rounded-2xl text-base font-semibold"
            >
              Keep reading the guide
            </button>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/15">
              <svg
                className="h-7 w-7 text-[var(--accent-dark)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12l2 2 4-4" />
              </svg>
            </div>

            <h2 className="text-center text-xl font-bold text-[var(--primary)]">
              Want 10% off your first order?
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-[var(--primary)]/70">
              Enter your email and we&rsquo;ll send a code for 10% off — plus
              first access to restocks and new protocols. No spam.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <div>
                <label className="sr-only" htmlFor="pc-email">
                  Email
                </label>
                <input
                  id="pc-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-black shadow-sm outline-none placeholder:text-black/40 focus:border-black/20"
                />
                {touched && email.length > 0 && !emailValid ? (
                  <p className="mt-1.5 text-xs text-red-600">
                    Please enter a valid email address.
                  </p>
                ) : null}
              </div>

              {status === "error" && errorMsg ? (
                <p className="text-sm text-red-600">{errorMsg}</p>
              ) : null}

              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full h-12 rounded-2xl text-base font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send my 10% code"}
              </button>
            </form>

            <button
              onClick={dismiss}
              className="mt-3 w-full text-center text-xs text-[var(--primary)]/50 transition hover:text-[var(--primary)]/70"
            >
              No thanks, I&rsquo;ll pay full price
            </button>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-[var(--primary)]/40">
              By submitting you agree to receive marketing emails from Peak State
              Labs. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
