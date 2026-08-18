"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { readClientContact, safeFirstName } from "@/app/lib/clientContact";
import {
  PRIMARY_GOALS,
  SECONDARY_GOALS,
  buildRecommendation,
  type AgeRange,
  type Experience,
  type Goal,
  type QuizAnswers,
  type StartPreference,
  type Struggle,
  type Timeline,
} from "./quizConfig";
import { QuizResults } from "./QuizResults";

type Draft = Partial<QuizAnswers>;

const TOTAL_STEPS = 8;

// Persist quiz progress within the tab session so leaving the page (e.g.
// clicking through to /singles) and hitting browser Back restores the exact
// place they were — mid-quiz or on their results — instead of restarting.
const QUIZ_STATE_KEY = "peak.quiz.state.v1";

type PersistedState = {
  step: number;
  draft: Draft;
  answers: QuizAnswers | null;
  weightInput: string;
  frustrationKey: string | null;
  frustrationOther: string;
};

// Readable names for the per-step drop-off funnel (quiz_step_viewed).
const STEP_NAMES: Record<number, string> = {
  1: "primary_goal",
  2: "secondary_goals",
  3: "experience",
  4: "stats",
  5: "timeline",
  6: "struggle",
  7: "frustration",
  8: "start_preference",
};

// How long the "analyzing your answers" beat holds before results show.
const ANALYZE_MS = 1500;

const FRUSTRATIONS: { key: string; label: string }[] = [
  { key: "effort", label: "Putting in the effort and not seeing it show" },
  { key: "metabolism", label: "Feeling like my own body is working against me" },
  { key: "money", label: "Wasting time and money on things that don't deliver" },
  { key: "other", label: "Something else" },
];

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
      {subtitle && <p className="mt-2 text-[var(--primary)]/60">{subtitle}</p>}

      <div className="mt-6 space-y-3">{children}</div>
    </div>
  );
}

/* ─────────────────────────── Analyzing interstitial ────────────────────── */

function AnalyzingScreen() {
  const steps = [
    "Reading your answers",
    "Pinpointing what's holding you back",
    "Matching your protocol",
  ];
  return (
    <div className="flex min-h-screen flex-col bg-white text-[var(--primary)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.png" alt="Peak State Labs" className="h-7 w-7 rounded-lg" />
            <span>Peak State Labs</span>
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">
            Building your personalized protocol…
          </h1>
          <p className="mt-2 text-[var(--primary)]/60">
            Give us a second — we&apos;re reading every answer.
          </p>
          <ul className="mx-auto mt-8 max-w-xs space-y-3 text-left">
            {steps.map((s, i) => (
              <li
                key={s}
                className="flex items-center gap-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 400}ms` }}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20">
                  <svg className="h-3.5 w-3.5 text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-semibold text-[var(--primary)]/80">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

/* ──────────────────────────────── Experience ───────────────────────────── */

export function QuizExperience() {
  // step 0 = intro/hook lander; steps 1..8 = the eight functional questions.
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [frustrationKey, setFrustrationKey] = useState<string | null>(null);
  const [frustrationOther, setFrustrationOther] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const contactRef = useRef<{ email?: string; name?: string }>({});
  const startedRef = useRef(false);
  const viewedStepsRef = useRef<Set<number>>(new Set());

  // Rehydrate once from sessionStorage. First paint matches the server (intro,
  // no answers) to avoid a hydration mismatch; we then swap in saved state.
  useEffect(() => {
    contactRef.current = readClientContact();
    /* eslint-disable react-hooks/set-state-in-effect -- one-shot rehydration so browser Back restores progress */
    try {
      const raw =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem(QUIZ_STATE_KEY)
          : null;
      if (raw) {
        const s = JSON.parse(raw) as Partial<PersistedState>;
        if (typeof s.step === "number") setStep(s.step);
        if (s.draft && typeof s.draft === "object") setDraft(s.draft as Draft);
        if (s.answers) setAnswers(s.answers as QuizAnswers);
        if (typeof s.weightInput === "string") setWeightInput(s.weightInput);
        setFrustrationKey(
          typeof s.frustrationKey === "string" ? s.frustrationKey : null,
        );
        if (typeof s.frustrationOther === "string")
          setFrustrationOther(s.frustrationOther);
        // Don't re-fire quiz_started for a session already in progress.
        if ((typeof s.step === "number" && s.step > 0) || s.answers) {
          startedRef.current = true;
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist progress after hydration (guarded so we never overwrite saved
  // state with the initial empty state before it's been read).
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      const payload: PersistedState = {
        step,
        draft,
        answers,
        weightInput,
        frustrationKey,
        frustrationOther,
      };
      window.sessionStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(payload));
    } catch {
      /* storage unavailable (private mode, quota) — quiz still works */
    }
  }, [hydrated, step, draft, answers, weightInput, frustrationKey, frustrationOther]);

  // Per-step drop-off funnel: fire once per question the first time it's shown
  // (not while showing results, and not re-firing restored steps).
  useEffect(() => {
    if (!hydrated || answers || step < 1) return;
    if (viewedStepsRef.current.has(step)) return;
    viewedStepsRef.current.add(step);
    try {
      posthog.capture("quiz_step_viewed", { step, step_name: STEP_NAMES[step] });
    } catch {
      /* analytics never blocks */
    }
  }, [hydrated, step, answers]);

  function begin() {
    if (!startedRef.current) {
      startedRef.current = true;
      try {
        posthog.capture("quiz_started");
      } catch {
        /* analytics never blocks */
      }
    }
    setStep(1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function next() {
    setStep((s) => s + 1);
  }

  // Single-select answer that auto-advances.
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
      primaryGoal: final.primaryGoal ?? "fat-loss",
      secondaryGoals: final.secondaryGoals ?? [],
      experience: final.experience ?? "new",
      age: final.age ?? "30-39",
      weight: final.weight ?? 175,
      timeline: final.timeline ?? "10-weeks",
      struggle: final.struggle ?? "fat",
      frustration: final.frustration ?? "",
      startPreference: final.startPreference ?? "unsure",
    };
    // Brief "analyzing" beat so the diagnostic feels earned, then reveal.
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnswers(complete);
      setAnalyzing(false);
    }, ANALYZE_MS);
    const rec = buildRecommendation(complete);
    try {
      posthog.capture("quiz_completed", {
        primary_goal: complete.primaryGoal,
        secondary_goals: complete.secondaryGoals.join(","),
        experience: complete.experience,
        age: complete.age,
        weight: complete.weight,
        timeline: complete.timeline,
        struggle: complete.struggle,
        frustration: complete.frustration,
        start_preference: complete.startPreference,
        recommendation_kind: rec.kind,
        recommended_primary: rec.primary?.slug ?? null,
        recommended_tier: rec.kind === "stack" ? rec.recommendedTier : null,
        archetype: rec.archetype.key,
      });
    } catch {
      /* analytics never blocks */
    }
  }

  function restart() {
    try {
      window.sessionStorage.removeItem(QUIZ_STATE_KEY);
    } catch {
      /* ignore */
    }
    setAnswers(null);
    setDraft({});
    setWeightInput("");
    setFrustrationKey(null);
    setFrustrationOther("");
    setStep(0);
  }

  /* ── Analyzing beat (between the last answer and the results) ── */
  if (analyzing) {
    return <AnalyzingScreen />;
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

  const firstName = safeFirstName(contactRef.current.name);

  /* ── Intro / hook lander ── */
  if (step === 0) {
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

        <main className="relative overflow-hidden gradient-hero">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
              <span>60-SECOND DIAGNOSTIC</span>
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {firstName ? `${firstName}, discover ` : "Discover "}the hidden reason
              your body won&apos;t change
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-[var(--primary)]/70">
              Answer 8 quick questions and we&apos;ll pinpoint exactly what&apos;s
              been holding you back — and the precise protocol built to fix it.
            </p>
            <button
              type="button"
              onClick={begin}
              className="btn-primary mt-8 inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold"
            >
              Start the diagnostic
            </button>
            <p className="mt-4 text-sm text-[var(--primary)]/50">
              Takes under a minute · Free · No obligation
            </p>
          </div>
        </main>
      </div>
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
        {/* Q1 — positive: what they want (primary goal) */}
        {step === 1 && (
          <QuestionShell
            step={1}
            eyebrow="Let's start with the good part"
            title="What I want most right now is…"
            subtitle="Pick the one that matters most — we'll ask about the rest next."
            onBack={goBack}
          >
            {PRIMARY_GOALS.map((g) => (
              <OptionButton
                key={g.key}
                emoji={g.emoji}
                label={g.want}
                selected={draft.primaryGoal === g.key}
                onClick={() => choose("primaryGoal", g.key)}
              />
            ))}
          </QuestionShell>
        )}

        {/* Q2 — positive: secondary goals */}
        {step === 2 && (
          <QuestionShell
            step={2}
            eyebrow="While we're at it"
            title="I'd also love to improve…"
            subtitle="Optional — select any that apply. This sharpens what we suggest."
            onBack={goBack}
          >
            {SECONDARY_GOALS.filter((g) => g.key !== draft.primaryGoal).map((g) => (
              <OptionButton
                key={g.key}
                emoji={g.emoji}
                label={g.label}
                blurb={g.blurb}
                selected={(draft.secondaryGoals ?? []).includes(g.key)}
                onClick={() => toggleSecondary(g.key)}
              />
            ))}
            <button
              type="button"
              onClick={next}
              className="btn-primary mt-3 inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold"
            >
              Continue
            </button>
          </QuestionShell>
        )}

        {/* Q3 — neutral: experience */}
        {step === 3 && (
          <QuestionShell
            step={3}
            eyebrow="Where you're at"
            title="When it comes to peptides, I…"
            subtitle="No wrong answer — this decides how much guidance we build in."
            onBack={goBack}
          >
            {(
              [
                ["new", "Am just starting to explore them", "First time — I'll want guidance"],
                ["some", "Have run a protocol or two", "I've got some experience"],
                ["experienced", "Know my way around a stack", "I'm comfortable dialing my own"],
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

        {/* Q4 — neutral: age + weight (with a reason for asking) */}
        {step === 4 && (
          <QuestionShell
            step={4}
            eyebrow="Your stats"
            title="So we can dial your exact dosing…"
            subtitle="We use this to tailor your dose and cycle length. It stays private."
            onBack={goBack}
          >
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <p className="text-sm font-bold text-[var(--primary)]">This year, I&apos;m…</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["21-29", "30-39", "40-49", "50+"] as AgeRange[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, age: val }))}
                    className={`h-12 rounded-xl border text-sm font-bold transition-all ${
                      draft.age === val
                        ? "border-[var(--accent)] bg-[var(--accent)]/[0.1] text-[var(--primary)]"
                        : "border-[var(--border)] bg-white text-[var(--primary)]/70 hover:border-[var(--accent)]/60"
                    }`}
                  >
                    {val === "50+" ? "50 or older" : val}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <label htmlFor="quiz-weight" className="block text-sm font-bold text-[var(--primary)]">
                …and I currently weigh about (lbs)
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
                !draft.age ||
                weightInput.trim() === "" ||
                Number(weightInput) < 90 ||
                Number(weightInput) > 500
              }
              onClick={() => {
                setDraft((d) => ({ ...d, weight: Number(weightInput) }));
                next();
              }}
              className="btn-primary mt-1 inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </QuestionShell>
        )}

        {/* Q5 — neutral→: timeline */}
        {step === 5 && (
          <QuestionShell
            step={5}
            eyebrow="Your timeline"
            title="I want to see real change…"
            onBack={goBack}
          >
            {(
              [
                ["event", "Before a specific event", "A vacation, wedding or date in 1–3 months"],
                ["10-weeks", "Over the next 10 weeks", "I'm ready to run a full cycle now"],
                ["long-term", "Steadily, for the long haul", "No rush — I want lasting change"],
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

        {/* Q6 — problem bridge: what their body is doing */}
        {step === 6 && (
          <QuestionShell
            step={6}
            eyebrow="Let's get honest"
            title="Lately, my body…"
            subtitle="Be straight with us — this is how we find the real blocker."
            onBack={goBack}
          >
            {(
              [
                ["fat", "Holds onto fat no matter what I do"],
                ["recovery", "Recovers slower than it used to"],
                ["aging", "Doesn't respond the way it did in my 20s"],
              ] as [Struggle, string][]
            ).map(([val, label]) => (
              <OptionButton
                key={val}
                label={label}
                selected={draft.struggle === val}
                onClick={() => choose("struggle", val)}
              />
            ))}
          </QuestionShell>
        )}

        {/* Q7 — problem ownership: what frustrates them (+ an "out") */}
        {step === 7 && (
          <QuestionShell
            step={7}
            eyebrow="The honest truth"
            title="What frustrates me most is…"
            subtitle="We ask so we know exactly what to help you overcome."
            onBack={goBack}
          >
            {FRUSTRATIONS.map((f) => (
              <OptionButton
                key={f.key}
                label={f.label}
                selected={frustrationKey === f.key}
                onClick={() => {
                  setFrustrationKey(f.key);
                  if (f.key !== "other") {
                    setDraft((d) => ({ ...d, frustration: f.label }));
                    next();
                  }
                }}
              />
            ))}
            {frustrationKey === "other" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={frustrationOther}
                  onChange={(e) => setFrustrationOther(e.target.value)}
                  placeholder="In your own words…"
                  className="h-14 w-full rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-base text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDraft((d) => ({
                      ...d,
                      frustration: frustrationOther.trim() || "Something else",
                    }));
                    next();
                  }}
                  className="btn-primary inline-flex h-14 w-full items-center justify-center rounded-2xl px-6 text-lg font-semibold"
                >
                  Continue
                </button>
              </div>
            )}
          </QuestionShell>
        )}

        {/* Q8 — pressure-release: what they'd like instead (routing) */}
        {step === 8 && (
          <QuestionShell
            step={8}
            eyebrow="Last one"
            title="So — what would you like instead?"
            subtitle="Choose the outcome you actually want. We'll build the plan around it."
            onBack={goBack}
          >
            {(
              [
                ["protocol", "The complete transformation", "Give me the full, structured protocol"],
                ["single", "A focused start", "The single biggest lever for my goal"],
                ["unsure", "The fastest result", "Just tell me what's best for me"],
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
