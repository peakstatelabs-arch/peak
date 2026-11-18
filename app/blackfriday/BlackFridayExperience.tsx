"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { SALE_NAME } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import { SaleCountdown } from "@/app/components/SaleUrgency";
import {
  ADDONS,
  EXTRA_OPTIONS,
  GOALS,
  PC_ADDON_STORAGE_KEY,
  SIZE_QUESTION,
  STACKS,
  quizResultHref,
  resolveQuiz,
  type AddonKey,
  type Goal,
  type QuizResult,
} from "@/app/lib/bfStacks";
import { useMembersGate } from "@/app/components/sale/MembersGate";

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    // never block the quiz
  }
}

export function BlackFridayExperience({
  initialSale,
  startQuiz,
}: {
  initialSale: SaleStatus;
  startQuiz: boolean;
}) {
  const sale = useSaleStatus(initialSale);
  const saleName = SALE_NAME[sale.phase];
  type Step = "intro" | "q1" | "q2" | "result";
  const [step, setStepState] = useState<Step>(startQuiz ? "q1" : "intro");
  // Each quiz step is a browser history entry, so the phone's back button
  // goes back one question instead of leaving the page.
  const setStep = (next: Step) => {
    setStepState(next);
    if (next === "q1" || next === "q2") {
      try {
        // Keep Next.js's own history state so its router doesn't reload.
        window.history.pushState({ ...(window.history.state ?? {}), bfStep: next }, "");
      } catch {
        // ignore
      }
    }
  };
  useEffect(() => {
    try {
      window.history.replaceState(
        { ...(window.history.state ?? {}), bfStep: startQuiz ? "q1" : "intro" },
        "",
      );
    } catch {
      // ignore
    }
    const onPop = (e: PopStateEvent) => {
      const st = (e.state as { bfStep?: Step } | null)?.bfStep;
      setStepState(st === "q1" || st === "q2" ? st : "intro");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [startQuiz]);
  const goBack = () => window.history.back();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const { guard, modal } = useMembersGate("bf_quiz");

  useEffect(() => {
    if (step !== "intro") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function start() {
    track("bf_quiz_started");
    setStep("q1");
  }

  function pickGoal(g: Goal) {
    setGoal(g);
    setSize(null);
    track("bf_quiz_goal", { goal: g });
    if (!SIZE_QUESTION[g]) setStep("q2");
  }

  function pickSize(i: number) {
    setSize(i + 1);
    track("bf_quiz_size", { goal, size: i + 1 });
    setStep("q2");
  }

  function finish(extra: AddonKey | null) {
    if (!goal) return;
    const r = resolveQuiz(goal, size, extra);
    track("bf_quiz_completed", {
      goal,
      size,
      extra,
      result: r.kind === "powercut" ? "powercut" : r.slug,
    });
    // Members-only: visitors who skipped the sign-up create an account first.
    guard(() => {
      if (r.kind === "powercut") {
        try {
          if (r.addon) window.localStorage.setItem(PC_ADDON_STORAGE_KEY, r.addon);
          else window.localStorage.removeItem(PC_ADDON_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      setResult(r);
      setStep("result");
      window.location.assign(quizResultHref(r));
    });
  }

  const shell = "mx-auto w-full max-w-2xl px-4";
  const option =
    "w-full rounded-2xl border-2 border-white/15 bg-white/5 px-5 py-4 text-left text-white transition-all hover:border-[var(--accent)] hover:bg-white/10";

  return (
    <div data-bf-landing className="relative overflow-hidden bg-[#0b0f1a] text-white min-h-[calc(100vh-7rem)]">
      {modal}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-15%] h-96 w-96 rounded-full bg-[var(--primary-light)]/30 blur-3xl" />
      </div>

      {step === "intro" && (
        <div className="relative">
          <div className="mx-auto max-w-5xl px-4 pt-12 pb-10 sm:pt-20 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#0b0f1a]">
              <span className="h-2 w-2 rounded-full bg-[#0b0f1a] animate-pulse-slow" />
              {saleName} sale is live
            </p>
            <h1 className="mt-6 text-balance text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
              Up to 60% off
              <span className="block text-[var(--accent)]">stacks.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-white/75">
              The biggest sale we&rsquo;ve ever run. Answer two quick
              questions and we&rsquo;ll build the exact stack for your goal —
              at up to 60% off.
            </p>
            <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm sm:text-base font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              {saleName} pricing ends in{" "}
              <SaleCountdown className="text-white" />
            </div>

            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3">
              <button
                type="button"
                onClick={start}
                className="h-16 whitespace-nowrap rounded-2xl bg-[var(--accent)] px-3 sm:px-8 text-[clamp(13px,4.1vw,16px)] sm:text-xl font-black uppercase tracking-normal sm:tracking-wide text-[#0b0f1a] shadow-2xl ring-4 ring-[var(--accent)]/30 transition-transform hover:scale-[1.02]"
              >
                Unlock my Black Friday stack →
              </button>
              <p className="-mt-1 text-center text-sm font-semibold text-white/70">
                2 quick questions · up to 60% off
              </p>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full page load so middleware serves the sale page */}
              <a
                href="/?regular=1"
                onClick={() => track("bf_continue_regular_site")}
                className="h-14 inline-flex items-center justify-center rounded-2xl border-2 border-white/20 px-6 text-base font-bold text-white/85 transition-colors hover:border-white/50 hover:text-white"
              >
                I know what I want — continue to the regular site
              </a>
            </div>
            <p className="mt-4 text-sm text-white/50">
              Takes 20 seconds · Free shipping · 1-on-1 coaching included
            </p>
          </div>

          <div className="mx-auto max-w-5xl px-4 pb-16">
            <img
              src="/bf/bf-hero-tight.webp"
              alt="Peak State Labs research peptide stacks"
              className="mx-auto -mt-2 mb-8 w-full max-w-2xl drop-shadow-2xl"
            />
            <p className="text-center text-xs font-extrabold uppercase tracking-[0.2em] text-white/60">
              How the savings stack up
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {[
                { v: "1 vial", p: "20%" },
                { v: "2 vials", p: "30%" },
                { v: "3 vials", p: "35%" },
                { v: "4+ vials", p: "40%" },
              ].map((t) => (
                <div
                  key={t.v}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60">{t.v}</p>
                  <p className="mt-1 text-3xl font-black text-[var(--accent)]">
                    {t.p} <span className="text-base font-extrabold">off</span>
                  </p>
                </div>
              ))}
              <a
                href="/powercutsale?tier=1"
                className="col-span-2 rounded-2xl bg-[var(--accent)] px-3 py-4 text-center text-[#0b0f1a] transition-transform hover:scale-[1.02] sm:col-span-4"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider">POWER CUT&trade;</p>
                <p className="mt-1 text-3xl font-black">
                  <span className="text-base font-extrabold">Up to </span>60%{" "}
                  <span className="text-base font-extrabold">off</span>
                </p>
                <p className="text-[11px] font-bold">See the deal →</p>
              </a>
            </div>
            <p className="mt-4 text-center text-sm text-white/60">
              Every vial counts — mix any products and stacks. The discount
              applies to your whole order, automatically.
            </p>
          </div>
        </div>
      )}

      {step === "q1" && (
        <div className={`relative ${shell} py-10 sm:py-16`}>
          <BackLink onClick={goBack} />
          <Progress n={1} />
          <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">
            What I want most right now is&hellip;
          </h2>
          <div className="mt-6 space-y-3">
            {GOALS.map((g) => {
              const active = goal === g.key;
              const sq = SIZE_QUESTION[g.key];
              return (
                <div key={g.key}>
                  <button
                    type="button"
                    onClick={() => pickGoal(g.key)}
                    className={`${option} ${active ? "!border-[var(--accent)] !bg-white/10" : ""}`}
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                      <span>
                        <span className="block text-lg font-extrabold">{g.label}</span>
                        <span className="block text-sm text-white/60">{g.blurb}</span>
                      </span>
                    </span>
                  </button>
                  {active && sq && (
                    <div className="mt-3 rounded-2xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-4">
                      <p className="text-base font-extrabold">{sq.q}</p>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {sq.options.map((o, i) => (
                          <button
                            key={o}
                            type="button"
                            onClick={() => pickSize(i)}
                            className={`rounded-xl border-2 px-2 py-3 text-sm font-bold transition-colors ${
                              size === i + 1
                                ? "border-[var(--accent)] bg-[var(--accent)] text-[#0b0f1a]"
                                : "border-white/20 bg-white/5 text-white hover:border-[var(--accent)]"
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
        </div>
      )}

      {step === "q2" && goal && (
        <div className={`relative ${shell} py-10 sm:py-16`}>
          <BackLink onClick={goBack} />
          <Progress n={2} />
          <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">
            I&rsquo;d also love to improve&hellip;
          </h2>
          <div className="mt-6 space-y-3">
            {EXTRA_OPTIONS[goal].map((k) => (
              <button key={k} type="button" onClick={() => finish(k)} className={option}>
                <span className="flex items-center gap-4">
                  <span className="text-2xl" aria-hidden="true">{ADDONS[k].emoji}</span>
                  <span className="text-lg font-extrabold">{ADDONS[k].label}</span>
                </span>
              </button>
            ))}
            <button type="button" onClick={() => finish(null)} className={`${option} !border-dashed`}>
              <span className="text-lg font-bold text-white/80">
                Nothing else — just my main goal
              </span>
            </button>
          </div>
          
        </div>
      )}

      {step === "result" && result && (
        <div className={`relative ${shell} py-24 text-center`}>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[var(--accent)]" />
          <p className="mt-6 text-2xl font-black">
            Building your{" "}
            {result.kind === "powercut" ? "POWER CUT\u2122" : STACKS[result.slug].name}{" "}
            stack&hellip;
          </p>
        </div>
      )}
    </div>
  );
}

function Progress({ n }: { n: 1 | 2 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
        Question {n} of 2
      </span>
      <div className="h-1.5 flex-1 rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: n === 1 ? "50%" : "100%" }}
        />
      </div>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-sm font-bold text-white/85 hover:border-white/40 hover:text-white"
    >
      ← Back
    </button>
  );
}
