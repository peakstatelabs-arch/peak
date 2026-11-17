"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { formatUsd } from "@/app/lib/money";
import {
  POWERCUT_SALE,
  POWERCUT_VALUE_CENTS,
  SALE_NAME,
  withPromoCode,
} from "@/app/lib/sale";
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

type PcTier = { id: string; name: string; subtitle: string; stripeUrl: string };

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    // never block the quiz
  }
}

export function BlackFridayExperience({
  initialSale,
  powerCutTiers,
  startQuiz,
}: {
  initialSale: SaleStatus;
  powerCutTiers: PcTier[];
  startQuiz: boolean;
}) {
  const sale = useSaleStatus(initialSale);
  const saleName = SALE_NAME[sale.phase];
  const [step, setStep] = useState<"intro" | "q1" | "q2" | "result">(
    startQuiz ? "q1" : "intro",
  );
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
        setResult(r);
        setStep("result");
      } else {
        setResult(r);
        setStep("result");
        window.location.assign(quizResultHref(r));
      }
    });
  }

  const shell = "mx-auto w-full max-w-2xl px-4";
  const option =
    "w-full rounded-2xl border-2 border-white/15 bg-white/5 px-5 py-4 text-left text-white transition-all hover:border-[var(--accent)] hover:bg-white/10";

  return (
    <div className="relative overflow-hidden bg-[#0b0f1a] text-white min-h-[calc(100vh-7rem)]">
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
                className="h-16 rounded-2xl bg-[var(--accent)] px-8 text-xl font-black uppercase tracking-wide text-[#0b0f1a] shadow-2xl ring-4 ring-[var(--accent)]/30 transition-transform hover:scale-[1.02]"
              >
                Build your stack &amp; save →
              </button>
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
              src="/bf/bf-hero.png"
              alt="Peak State Labs research peptide stacks"
              className="mx-auto -mt-2 mb-8 w-full max-w-2xl drop-shadow-2xl"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { v: "2 vials", p: "30% off" },
                { v: "4 vials", p: "35% off" },
                { v: "6+ vials", p: "40% off" },
              ].map((t) => (
                <div
                  key={t.v}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-5 text-center"
                >
                  <p className="text-sm font-bold uppercase tracking-wider text-white/60">{t.v}</p>
                  <p className="mt-1 text-4xl font-black text-[var(--accent)]">{t.p}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-white/60">
              Every vial counts toward your discount — mix any products and
              stacks. POWER CUT&trade; is up to 61% off. A single Retatrutide
              vial is 20% off.
            </p>
          </div>
        </div>
      )}

      {step === "q1" && (
        <div className={`relative ${shell} py-10 sm:py-16`}>
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
          <BackLink onClick={() => setStep("intro")} />
        </div>
      )}

      {step === "q2" && goal && (
        <div className={`relative ${shell} py-10 sm:py-16`}>
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
          <BackLink onClick={() => setStep("q1")} />
        </div>
      )}

      {step === "result" && result?.kind === "stack" && (
        <div className={`relative ${shell} py-24 text-center`}>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[var(--accent)]" />
          <p className="mt-6 text-2xl font-black">
            Building your {STACKS[result.slug].name} stack&hellip;
          </p>
        </div>
      )}

      {step === "result" && result?.kind === "powercut" && (
        <PowerCutResult
          tier={result.tier}
          addon={result.addon}
          tiers={powerCutTiers}
          saleName={saleName}
          live={sale.live}
        />
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
      className="mt-8 text-sm font-semibold text-white/50 hover:text-white"
    >
      ← Back
    </button>
  );
}

const PC_IDS = ["single", "double", "triple"] as const;

function PowerCutResult({
  tier,
  addon,
  tiers,
  saleName,
  live,
}: {
  tier: 1 | 2 | 3;
  addon: AddonKey | null;
  tiers: PcTier[];
  saleName: string;
  live: boolean;
}) {
  const id = PC_IDS[tier - 1];
  const t = tiers.find((x) => x.id === id) ?? tiers[0];
  const ps = POWERCUT_SALE[id];
  const value = POWERCUT_VALUE_CENTS[id];
  const href = live ? withPromoCode(t.stripeUrl, ps.code) : t.stripeUrl;
  const saved = value - ps.saleCents;

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 py-10 sm:py-16">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
        ✓ Built from your answers
      </p>
      <h2 className="mt-3 text-4xl sm:text-5xl font-black tracking-tight">
        Your stack: POWER CUT&trade;
      </h2>
      <p className="mt-3 text-lg text-white/75">
        Burn fat and build lean muscle at the same time — Retatrutide,
        CJC-1295 + Ipamorelin and BPC-157 + TB-500 in one 10-week system.
      </p>
      <div className="mt-6 rounded-3xl border-2 border-[var(--accent)] bg-white/5 p-6">
        <p className="text-sm font-bold uppercase tracking-wider text-white/60">{t.name}</p>
        <p className="mt-1 text-base text-white/80">{t.subtitle}</p>
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
          <span className="text-5xl font-black tabular-nums">{formatUsd(ps.saleCents)}</span>
          <span className="text-lg font-semibold text-white/40 line-through tabular-nums">
            {formatUsd(value)}
          </span>
        </div>
        <p className="mt-2 inline-flex rounded-full bg-emerald-400/20 px-3 py-1 text-sm font-extrabold text-emerald-300">
          You save {formatUsd(saved)} ({Math.round((saved / value) * 100)}% off) · {saleName} price
        </p>
        <a
          href={href}
          data-rewardful
          onClick={() => track("bf_quiz_powercut_checkout", { tier: id })}
          className="mt-6 flex h-16 items-center justify-center rounded-2xl bg-[var(--accent)] px-6 text-xl font-black uppercase tracking-wide text-[#0b0f1a] hover:opacity-90"
        >
          Claim my POWER CUT&trade; →
        </a>
        <p className="mt-2 text-center text-xs text-white/50">
          Code {ps.code} is applied for you at checkout.
        </p>
        {addon && (
          <p className="mt-4 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/80">
            {ADDONS[addon].emoji} Want {ADDONS[addon].label.toLowerCase()} too?
            Right after checkout you can add it to your stack at{" "}
            <strong className="text-[var(--accent)]">40% off</strong>.
          </p>
        )}
      </div>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full page load so middleware serves the sale page */}
      <a
        href="/?pc=1#pricing"
        className="mt-6 inline-block text-sm font-semibold text-white/60 underline underline-offset-4 hover:text-white"
      >
        Compare all POWER CUT&trade; options
      </a>
    </div>
  );
}
