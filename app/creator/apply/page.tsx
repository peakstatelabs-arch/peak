"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveClientContact } from "@/app/lib/clientContact";

/* -------------------------------------------------------------------------- */
/*  Application schema — questions & answer choices come straight from the      */
/*  Creator Program copy document. One question shows at a time.                */
/* -------------------------------------------------------------------------- */

type ChoiceStep = {
  id: "followers" | "usingPeptides";
  kind: "choice";
  question: string;
  subtext?: string;
  options: string[];
};

type MultiChoiceStep = {
  id: "contentType";
  kind: "multichoice";
  question: string;
  subtext?: string;
  options: string[];
};

type TextStep = {
  id: "email" | "phone" | "tiktok" | "instagram";
  kind: "text";
  question: string;
  subtext?: string;
  placeholder: string;
  inputType: "email" | "tel" | "text";
  optional?: boolean;
};

type NameStep = {
  id: "name";
  kind: "name";
  question: string;
};

type LongTextStep = {
  id: "why";
  kind: "longtext";
  question: string;
  placeholder: string;
};

type ConsentStep = {
  id: "acknowledged";
  kind: "consent";
  question: string;
  label: string;
};

type Step =
  | ChoiceStep
  | MultiChoiceStep
  | TextStep
  | NameStep
  | LongTextStep
  | ConsentStep;

const STEPS: Step[] = [
  {
    id: "name",
    kind: "name",
    question: "First, what's your name?",
  },
  {
    id: "email",
    kind: "text",
    question: "What's the best email to reach you?",
    subtext: "This is where we'll send your approval and creator details.",
    placeholder: "you@email.com",
    inputType: "email",
  },
  {
    id: "phone",
    kind: "text",
    question: "What's your phone number?",
    subtext:
      "Optional — only if you're open to us texting you about your approval.",
    placeholder: "(555) 555-5555",
    inputType: "tel",
    optional: true,
  },
  {
    id: "tiktok",
    kind: "text",
    question: "What's your TikTok handle?",
    placeholder: "@yourhandle",
    inputType: "text",
  },
  {
    id: "instagram",
    kind: "text",
    question: "What's your Instagram handle?",
    subtext: "Optional.",
    placeholder: "@yourhandle",
    inputType: "text",
    optional: true,
  },
  {
    id: "followers",
    kind: "choice",
    question: "How many followers do you currently have?",
    options: [
      "Just getting started",
      "Under 1K",
      "1K–5K",
      "5K–25K",
      "25K–100K",
      "100K+",
    ],
  },
  {
    id: "contentType",
    kind: "multichoice",
    question: "What kind of content do you currently create?",
    subtext: "Select all that apply.",
    options: [
      "Health & wellness",
      "Fitness",
      "Weight loss / body transformation",
      "Peptides / GLP-1s",
      "Beauty / lifestyle",
      "Other",
    ],
  },
  {
    id: "usingPeptides",
    kind: "choice",
    question: "Are you currently using peptides or GLP-1s?",
    options: ["Yes", "No", "Not currently, but interested"],
  },
  {
    id: "why",
    kind: "longtext",
    question: "Why do you want to become a Peak State Creator?",
    placeholder: "Tell us a little about you…",
  },
  {
    id: "acknowledged",
    kind: "consent",
    question: "One last thing.",
    label:
      "I understand I'll need to follow Peak State's creator/compliance guidelines and disclose the affiliate relationship appropriately.",
  },
];

const TOTAL = STEPS.length;

type Answers = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tiktok: string;
  instagram: string;
  followers: string;
  contentType: string[];
  usingPeptides: string;
  why: string;
  acknowledged: boolean;
};

const EMPTY_ANSWERS: Answers = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  tiktok: "",
  instagram: "",
  followers: "",
  contentType: [],
  usingPeptides: "",
  why: "",
  acknowledged: false,
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/* -------------------------------------------------------------------------- */

export default function CreatorApplyPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState<Answers>(EMPTY_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[current];
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Focus the first input as each text/name/long-text step appears.
  useEffect(() => {
    if (
      step.kind === "text" ||
      step.kind === "name" ||
      step.kind === "longtext"
    ) {
      const t = setTimeout(() => firstFieldRef.current?.focus(), 260);
      return () => clearTimeout(t);
    }
  }, [current, step.kind]);

  const goNext = useCallback(() => {
    setError(null);
    setDirection("forward");
    setCurrent((c) => Math.min(c + 1, TOTAL - 1));
  }, []);

  const goBack = useCallback(() => {
    setError(null);
    setDirection("back");
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  const submit = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Persist contact so downstream events (and PostHog) can attribute back.
      saveClientContact({
        email: answers.email,
        name: `${answers.firstName} ${answers.lastName}`.trim(),
      });

      const res = await fetch("/api/creator-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      router.push("/creator/success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }, [answers, router]);

  // Is the current step complete enough to advance / submit?
  const canAdvance = useMemo(() => {
    switch (step.id) {
      case "name":
        return (
          answers.firstName.trim().length > 0 &&
          answers.lastName.trim().length > 0
        );
      case "email":
        return isValidEmail(answers.email);
      case "phone":
      case "instagram":
        return true; // optional
      case "tiktok":
        return answers.tiktok.trim().length > 0;
      case "followers":
        return answers.followers.length > 0;
      case "contentType":
        return answers.contentType.length > 0;
      case "usingPeptides":
        return answers.usingPeptides.length > 0;
      case "why":
        return answers.why.trim().length > 0;
      case "acknowledged":
        return answers.acknowledged;
      default:
        return false;
    }
  }, [step.id, answers]);

  const isLast = current === TOTAL - 1;

  const handlePrimary = useCallback(() => {
    if (!canAdvance) return;
    if (isLast) {
      void submit();
    } else {
      goNext();
    }
  }, [canAdvance, isLast, submit, goNext]);

  // Single-select choice → set it and auto-advance for that quiz-like feel.
  const selectChoice = useCallback(
    (field: "followers" | "usingPeptides", value: string) => {
      setAnswers((a) => ({ ...a, [field]: value }));
      setError(null);
      setDirection("forward");
      setTimeout(() => setCurrent((c) => Math.min(c + 1, TOTAL - 1)), 240);
    },
    []
  );

  // Multi-select choice → toggle membership; the visitor taps Continue when done.
  const toggleContentType = useCallback((value: string) => {
    setError(null);
    setAnswers((a) => ({
      ...a,
      contentType: a.contentType.includes(value)
        ? a.contentType.filter((v) => v !== value)
        : [...a.contentType, value],
    }));
  }, []);

  const progressPct = Math.round(((current + 1) / TOTAL) * 100);
  const animClass =
    direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left";

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white text-[var(--primary)]">
      {/* Top bar: back, brand, progress */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={goBack}
            disabled={current === 0 || submitting}
            aria-label="Previous question"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--primary)] transition hover:bg-[var(--muted)] disabled:pointer-events-none disabled:opacity-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted-dark)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <span className="flex-shrink-0 text-xs font-semibold tabular-nums text-[var(--primary)]/60">
            {current + 1}/{TOTAL}
          </span>
        </div>
      </header>

      {/* Question body */}
      <main className="flex flex-1 items-start justify-center px-5 pb-40 pt-10 sm:items-center sm:pb-32">
        <div key={current} className={`w-full max-w-lg ${animClass}`}>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--accent-dark)]">
            Question {current + 1}
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {step.question}
          </h1>
          {"subtext" in step && step.subtext ? (
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--primary)]/60">
              {step.subtext}
            </p>
          ) : null}

          <div className="mt-7">
            {/* Name — two fields */}
            {step.kind === "name" ? (
              <div className="flex flex-col gap-3">
                <input
                  ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={answers.firstName}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, firstName: e.target.value }))
                  }
                  className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white px-5 text-lg outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20"
                />
                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={answers.lastName}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, lastName: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handlePrimary();
                  }}
                  className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white px-5 text-lg outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20"
                />
              </div>
            ) : null}

            {/* Single-line text / email / phone */}
            {step.kind === "text" ? (
              <input
                ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                type={step.inputType}
                inputMode={
                  step.inputType === "email"
                    ? "email"
                    : step.inputType === "tel"
                    ? "tel"
                    : "text"
                }
                autoComplete={
                  step.id === "email"
                    ? "email"
                    : step.id === "phone"
                    ? "tel"
                    : "off"
                }
                autoCapitalize={step.inputType === "text" ? "none" : undefined}
                placeholder={step.placeholder}
                value={answers[step.id]}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [step.id]: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePrimary();
                }}
                className="h-14 w-full rounded-2xl border border-[var(--border)] bg-white px-5 text-lg outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20"
              />
            ) : null}

            {/* Long text */}
            {step.kind === "longtext" ? (
              <textarea
                ref={firstFieldRef as React.RefObject<HTMLTextAreaElement>}
                rows={5}
                placeholder={step.placeholder}
                value={answers.why}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, why: e.target.value }))
                }
                className="w-full resize-none rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-lg leading-relaxed outline-none transition focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/20"
              />
            ) : null}

            {/* Single-select choices */}
            {step.kind === "choice" ? (
              <div className="flex flex-col gap-3">
                {step.options.map((option) => {
                  const selected = answers[step.id] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectChoice(step.id, option)}
                      className={`group flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-medium transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] bg-white hover:border-[var(--accent)]/60 hover:bg-[var(--muted)]"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                          selected
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--border)] text-transparent group-hover:border-[var(--accent)]/60"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Multi-select choices */}
            {step.kind === "multichoice" ? (
              <div className="flex flex-col gap-3">
                {step.options.map((option) => {
                  const selected = answers.contentType.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleContentType(option)}
                      className={`group flex items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-lg font-medium transition ${
                        selected
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] bg-white hover:border-[var(--accent)]/60 hover:bg-[var(--muted)]"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                          selected
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                            : "border-[var(--border)] text-transparent group-hover:border-[var(--accent)]/60"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {/* Consent checkbox */}
            {step.kind === "consent" ? (
              <button
                type="button"
                aria-pressed={answers.acknowledged}
                onClick={() =>
                  setAnswers((a) => ({ ...a, acknowledged: !a.acknowledged }))
                }
                className={`flex w-full items-start gap-4 rounded-2xl border-2 px-5 py-5 text-left transition ${
                  answers.acknowledged
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] bg-white hover:border-[var(--accent)]/60"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 transition ${
                    answers.acknowledged
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--border)] text-transparent"
                  }`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[15px] font-medium leading-relaxed text-[var(--primary)]/85">
                  {step.label}
                </span>
              </button>
            ) : null}
          </div>

          {error ? (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </main>

      {/* Sticky action bar — hidden for choice steps (they auto-advance) */}
      {step.kind !== "choice" ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-white/95 backdrop-blur">
          <div
            className="mx-auto w-full max-w-lg px-5 py-4"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            <button
              type="button"
              onClick={handlePrimary}
              disabled={!canAdvance || submitting}
              className="btn-primary inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <span>
                    {isLast ? "APPLY TO BECOME A CREATOR" : "Continue"}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            {step.kind === "text" && step.optional ? (
              <button
                type="button"
                onClick={goNext}
                disabled={submitting}
                className="mt-2 w-full py-2 text-sm font-medium text-[var(--primary)]/50 transition hover:text-[var(--primary)]/80"
              >
                Skip for now
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
