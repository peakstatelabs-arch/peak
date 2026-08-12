"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { readClientContact } from "@/app/lib/clientContact";
import {
  PRIMARY_GOALS,
  SECONDARY_GOALS,
  buildRecommendation,
  type AgeRange,
  type Experience,
  type Gender,
  type Goal,
  type QuizAnswers,
  type StartPreference,
  type Timeline,
} from "./quizConfig";
import { QuizResults } from "./QuizResults";

type Draft = Partial<QuizAnswers>;

const TOTAL_STEPS = 8;

/* ────────────────────────── Reusable option button ─────────────────────── */

function OptionButton({
  emoji,
  label,
  blurb,
  selected,
  onClick,
}: {
  emoji?: string;
  label: string;
  blurb?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
        selected
          ? "border-[var(--accent)] bg-[var(--accent)]/[0.08] ring-1 ring-[var(--accent)]/40"
          : "border-[var(--border)] bg-white hover:border-[var(--accent)]/60 hover:bg-[var(--accent)]/[0.04]"
      }`}
    >
      {emoji && <span className="text-2xl leading-none">{emoji}</span>}
      <span className="flex-1">
        <span className="block font-bold text-[var(--primary)]">{label}</span>
        {blurb && (
          <span className="mt-0.5 block text-sm text-[var(--primary)]/60">
            {blurb}
          </span>
        )}
      </span>
      <span
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
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
}

function QuestionShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  onBack,
}: {
  step: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onBack?: () => void;
}) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);
  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--primary)]/50">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="inline-flex items-center gap-1 disabled:invisible hover:text-[var(--primary)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span>
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--primary)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[var(--primary)]/60">{subtitle}</p>
      )}

      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}

/* ──────────────────────────────── Experience ───────────────────────────── */

export function QuizExperience() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const contactRef = useRef<{ email?: string; name?: string }>({});
  const startedRef = useRef(false);

  useEffect(() => {
    contactRef.current = readClientContact();
    if (!startedRef.current) {
      startedRef.current = true;
      try {
        posthog.capture("quiz_started");
      } catch {
        /* analytics never blocks */
      }
    }
  }, []);

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function next() {
    setStep((s) => s + 1);
  }

  // Sets a single-select answer and auto-advances.
  function choose<K extends keyof QuizAnswers>(key: K, value: QuizAnswers[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    next();
  }

  function toggleSecondary(goal: Goal) {
    setDraft((d) => {
      const cur = d.secondaryGoals ?? [];
      const has = cur.includes(goal);
      return {
        ...d,
        secondaryGoals: has ? cur.filter((g) => g !== goal) : [...cur, goal],
      };
    });
  }

  function finish(final: Draft) {
    const complete: QuizAnswers = {
      gender: final.gender ?? "unspecified",
      age: final.age ?? "30-39",
      primaryGoal: final.primaryGoal ?? "fat-loss",
      secondaryGoals: final.secondaryGoals ?? [],
      experience: final.experience ?? "new",
      weight: final.weight ?? 175,
      timeline: final.timeline ?? "10-weeks",
      startPreference: final.startPreference ?? "unsure",
    };
    setAnswers(complete);
    const rec = buildRecommendation(complete);
    try {
      posthog.capture("quiz_completed", {
        ...complete,
        secondary_goals: complete.secondaryGoals.join(","),
        recommendation_kind: rec.kind,
        recommended_primary: rec.primary?.slug ?? null,
        recommended_tier: rec.kind === "stack" ? rec.recommendedTier : null,
      });
    } catch {
      /* analytics never blocks */
    }
  }

  function restart() {
    setAnswers(null);
    setDraft({});
    setWeightInput("");
    setStep(0);
  }

  /* ── Results phase ── */
  if (answers) {
    return (
      <QuizResults
        answers={answers}
        recommendation={buildRecommendation(answers)}
        name={contactRef.current.name}
        onRestart={restart}
      />
    );
  }

  /* ── Quiz phase ── */
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

      <main className="px-4 py-10 sm:py-16">
        {step === 0 && (
          <QuestionShell
            step={1}
            eyebrow="Let's personalize your protocol"
            title="First — who are we building this for?"
            subtitle="This tailors your dosing guidance and what we show you."
          >
            {(
              [
                ["male", "Male"],
                ["female", "Female"],
                ["unspecified", "Prefer not to say"],
              ] as [Gender, string][]
            ).map(([val, label]) => (
              <OptionButton
                key={val}
                label={label}
                selected={draft.gender === val}
                onClick={() => choose("gender", val)}
              />
            ))}
          </QuestionShell>
        )}

        {step === 1 && (
          <QuestionShell
            step={2}
            eyebrow="About you"
            title="What's your age range?"
            onBack={goBack}
          >
            {(["21-29", "30-39", "40-49", "50+"] as AgeRange[]).map((val) => (
              <OptionButton
                key={val}
                label={val === "50+" ? "50 or older" : `${val}`}
                selected={draft.age === val}
                onClick={() => choose("age", val)}
              />
            ))}
          </QuestionShell>
        )}

        {step === 2 && (
          <QuestionShell
            step={3}
            eyebrow="Your goal"
            title="What's your #1 goal right now?"
            subtitle="Pick the one that matters most — we'll ask about the rest next."
            onBack={goBack}
          >
            {PRIMARY_GOALS.map((g) => (
              <OptionButton
                key={g.key}
                emoji={g.emoji}
                label={g.label}
                blurb={g.blurb}
                selected={draft.primaryGoal === g.key}
                onClick={() => choose("primaryGoal", g.key)}
              />
            ))}
          </QuestionShell>
        )}

        {step === 3 && (
          <QuestionShell
            step={4}
            eyebrow="Your goal"
            title="Anything else you want to improve?"
            subtitle="Optional — select any that apply. These sharpen your add-on suggestions."
            onBack={goBack}
          >
            {SECONDARY_GOALS.filter((g) => g.key !== draft.primaryGoal).map(
              (g) => (
                <OptionButton
                  key={g.key}
                  emoji={g.emoji}
                  label={g.label}
                  blurb={g.blurb}
                  selected={(draft.secondaryGoals ?? []).includes(g.key)}
                  onClick={() => toggleSecondary(g.key)}
                />
              ),
            )}
            <button
              type="button"
              onClick={next}
              className="btn-primary mt-3 inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold"
            >
              Continue
            </button>
          </QuestionShell>
        )}

        {step === 4 && (
          <QuestionShell
            step={5}
            eyebrow="Experience"
            title="How experienced are you with peptides?"
            subtitle="There are no wrong answers — this changes how much hand-holding we build in."
            onBack={goBack}
          >
            {(
              [
                ["new", "New to peptides", "First time — I'll want guidance"],
                ["some", "Some experience", "I've run a protocol or two"],
                ["experienced", "Very experienced", "I know my way around a stack"],
              ] as [Experience, string, string][]
            ).map(([val, label, blurb]) => (
              <OptionButton
                key={val}
                label={label}
                blurb={blurb}
                selected={draft.experience === val}
                onClick={() => choose("experience", val)}
              />
            ))}
          </QuestionShell>
        )}

        {step === 5 && (
          <QuestionShell
            step={6}
            eyebrow="Your stats"
            title="What's your current weight?"
            subtitle="We use this to tailor your dosing guidance and cycle length. This stays private."
            onBack={goBack}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <label
                htmlFor="quiz-weight"
                className="block text-sm font-bold text-[var(--primary)]"
              >
                Current weight (lbs)
              </label>
              <input
                id="quiz-weight"
                type="number"
                inputMode="numeric"
                min={90}
                max={500}
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 185"
                className="mt-2 h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-lg text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white"
              />
            </div>
            <button
              type="button"
              disabled={
                weightInput.trim() === "" ||
                Number(weightInput) < 90 ||
                Number(weightInput) > 500
              }
              onClick={() => {
                setDraft((d) => ({ ...d, weight: Number(weightInput) }));
                next();
              }}
              className="btn-primary mt-3 inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft((d) => ({ ...d, weight: 175 }));
                next();
              }}
              className="mx-auto block text-sm font-semibold text-[var(--primary)]/50 underline underline-offset-4 hover:text-[var(--primary)]"
            >
              Skip this
            </button>
          </QuestionShell>
        )}

        {step === 6 && (
          <QuestionShell
            step={7}
            eyebrow="Timeline"
            title="When do you want to see results?"
            onBack={goBack}
          >
            {(
              [
                ["event", "I have a deadline", "A vacation, wedding or event in 1–3 months"],
                ["10-weeks", "The next 10 weeks", "I'm ready to run a full cycle now"],
                ["long-term", "Long-term", "No rush — I want lasting change"],
              ] as [Timeline, string, string][]
            ).map(([val, label, blurb]) => (
              <OptionButton
                key={val}
                label={label}
                blurb={blurb}
                selected={draft.timeline === val}
                onClick={() => choose("timeline", val)}
              />
            ))}
          </QuestionShell>
        )}

        {step === 7 && (
          <QuestionShell
            step={8}
            eyebrow="Almost there"
            title="How do you want to start?"
            subtitle="We'll match your recommendation to this."
            onBack={goBack}
          >
            {(
              [
                ["protocol", "The full protocol", "Give me the complete, structured system"],
                ["single", "Just a vial or two", "I want to start small and simple"],
                ["unsure", "Not sure — recommend for me", "Tell me what's best for my goal"],
              ] as [StartPreference, string, string][]
            ).map(([val, label, blurb]) => (
              <OptionButton
                key={val}
                label={label}
                blurb={blurb}
                selected={draft.startPreference === val}
                onClick={() => {
                  const merged = { ...draft, startPreference: val };
                  setDraft(merged);
                  finish(merged);
                }}
              />
            ))}
          </QuestionShell>
        )}
      </main>
    </div>
  );
}
