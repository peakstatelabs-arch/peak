"use client";

import { useState, useSyncExternalStore } from "react";
import posthog from "posthog-js";
import { readClientContact, safeFirstName } from "@/app/lib/clientContact";
import { TrackedLink } from "@/app/components/TrackedLink";
import { RECOVERY_STACK_NAME } from "@/app/getrecovery/recoveryStack";

type Goal = "powercut" | "fat-loss" | "muscle" | "recovery";

// One question, one tap: each answer routes straight to the page built for it.
const OPTIONS: {
  key: Goal;
  emoji: string;
  label: string;
  product: string;
  href: string;
}[] = [
  {
    key: "powercut",
    emoji: "⚡",
    label: "Burn Fat + Build Muscle + Recover Faster",
    product: "POWER CUT™ Stack",
    href: "/",
  },
  {
    key: "fat-loss",
    emoji: "🔥",
    label: "Fat Loss + Reduce Inflammation",
    product: "Retatrutide",
    href: "/getreta",
  },
  {
    key: "muscle",
    emoji: "💪",
    label: "Build Lean Muscle",
    product: "CJC-1295 + Ipamorelin",
    href: "/getcjc",
  },
  {
    key: "recovery",
    emoji: "✨",
    label: "Recover Faster + Anti-Aging",
    product: `${RECOVERY_STACK_NAME} Recovery Stack`,
    href: "/getrecovery",
  },
];

// The saved name lives in the browser, so render without it on the server and
// read it on the client — no hydration mismatch.
const subscribeNoop = () => () => {};
function readFirstName(): string | null {
  try {
    return safeFirstName(readClientContact().name) ?? null;
  } catch {
    return null;
  }
}

export function WelcomeQuiz() {
  const firstName = useSyncExternalStore(subscribeNoop, readFirstName, () => null);
  const [selected, setSelected] = useState<Goal | null>(null);

  function choose(option: (typeof OPTIONS)[number]) {
    if (selected) return;
    setSelected(option.key);
    try {
      posthog.capture(
        "welcome_quiz_answered",
        { goal: option.key, destination: option.href },
        { send_instantly: true },
      );
    } catch {
      // Never let analytics block the redirect.
    }
    // Brief beat so the tap visibly registers before the page changes.
    window.setTimeout(() => window.location.assign(option.href), 250);
  }

  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.png" alt="Peak State Labs" className="h-7 w-7 rounded-lg" />
            <span>Peak State Labs</span>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden gradient-hero px-4 py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <p className="text-sm font-semibold text-[var(--primary)]/60">
            {firstName ? `You're in, ${firstName}. ` : "You're in. "}
            One quick question so we can show you the right thing.
          </p>

          <p className="mt-6 text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
            Let&apos;s start with the good part
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--primary)]">
            What I want most right now is…
          </h1>

          <div className="mt-6 space-y-3">
            {OPTIONS.map((o) => {
              const isSelected = selected === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => choose(o)}
                  disabled={selected !== null && !isSelected}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all disabled:opacity-50 ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--accent)]/[0.08] ring-1 ring-[var(--accent)]/40"
                      : "border-[var(--border)] bg-white hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/[0.04]"
                  }`}
                >
                  <span className="text-2xl leading-none">{o.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-bold text-[var(--primary)]">
                      {o.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-[var(--primary)]/55">
                      {o.product}
                    </span>
                  </span>
                  <span
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--primary)]"
                        : "border-[var(--border)] text-transparent group-hover:border-[var(--accent)]/60"
                    }`}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center">
            <TrackedLink
              href="/"
              event="welcome_quiz_skipped"
              className="text-sm font-semibold text-[var(--primary)]/55 underline underline-offset-2 hover:text-[var(--primary)]"
            >
              Skip, take me to the shop →
            </TrackedLink>
          </p>
        </div>
      </main>
    </div>
  );
}
