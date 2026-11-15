"use client";

import { useMemo, useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { scrollToId, usePosition } from "./Journey";
import { fmtLb, round1, validWeight } from "./model";
import { usePersistent } from "./store";
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconChevron,
  IconTrash,
  cx,
} from "./ui";

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    /* analytics optional */
  }
}

/* ============================================================
 * Simple persistent checklist (Phase 1 checkpoint, Phase 4 basics)
 * ============================================================ */

const NO_IDS: string[] = [];

export function Checklist({
  storeKey,
  title,
  intro,
  items,
  threshold,
  passMessage,
  pendingMessage,
  missingTitle,
}: {
  storeKey: string;
  title: string;
  intro?: ReactNode;
  items: string[];
  /** How many "yes" answers count as "mostly yes". */
  threshold: number;
  passMessage: ReactNode;
  pendingMessage?: ReactNode;
  /** When set, unchecked items are listed under this heading once any are checked. */
  missingTitle?: string;
}) {
  const [checked, setChecked] = usePersistent<string[]>(storeKey, NO_IDS);
  const count = items.filter((_, i) => checked.includes(String(i))).length;
  const passed = count >= threshold;
  const missing = items.filter((_, i) => !checked.includes(String(i)));

  const toggle = (i: number) =>
    setChecked((prev) =>
      prev.includes(String(i)) ? prev.filter((x) => x !== String(i)) : [...prev, String(i)],
    );

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-[var(--primary)]/15 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-4 bg-[var(--primary)] px-5 py-4 text-white sm:px-6">
        <div className="font-bold sm:text-lg">{title}</div>
        <div className="flex-shrink-0 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold tabular-nums">
          {count}/{items.length}
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {intro && <div className="mb-4 text-[var(--primary)]/75">{intro}</div>}
        <ul className="space-y-2">
          {items.map((item, i) => {
            const on = checked.includes(String(i));
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={on}
                  className={cx(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                    on
                      ? "border-[var(--accent-dark)]/50 bg-[var(--accent)]/10"
                      : "border-[var(--border)] hover:bg-[var(--muted)]",
                  )}
                >
                  <span
                    className={cx(
                      "mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                      on ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--border)] bg-white",
                    )}
                  >
                    {on && <IconCheck className="h-4 w-4" />}
                  </span>
                  <span className={cx("text-base", on ? "text-[var(--primary)]" : "text-[var(--primary)]/80")}>
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          className={cx(
            "mt-5 rounded-2xl p-4 text-sm leading-relaxed sm:text-base",
            passed ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--primary)]/80",
          )}
        >
          {passed ? passMessage : pendingMessage ?? `Mostly yes means ${threshold} or more. You’re at ${count}.`}
          {missingTitle && count > 0 && missing.length > 0 && (
            <div className="mt-3">
              <div className="font-semibold">{missingTitle}</div>
              <ul className="mt-1 list-disc pl-5">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * The Plateau Checklist (Phase 3)
 * ============================================================ */

type PlateauItem = {
  id: string;
  title: string;
  detail: ReactNode;
  yes: string;
  no: string;
  /** Which answer flags a weak point. */
  flagOn: "yes" | "no" | null;
  /** Short name of the weak point for the summary. */
  weak?: string;
};

export const PLATEAU_ITEMS: PlateauItem[] = [
  {
    id: "long-enough",
    title: "Has weight actually stalled long enough to matter?",
    detail: <p>Don’t diagnose a plateau from three mornings. Look for a real trend.</p>,
    yes: "Yes, it’s a real trend",
    no: "No, just a few days",
    flagOn: null,
  },
  {
    id: "measurements",
    title: "Are your measurements still changing?",
    detail: (
      <>
        <p>Waist. Photos. Clothing. Body composition measurements, if you have access to reasonably consistent ones.</p>
        <p className="mt-2 font-semibold">The scale is one instrument. Use more than one.</p>
      </>
    ),
    yes: "Yes, still changing",
    no: "No, nothing’s moving",
    flagOn: null,
  },
  {
    id: "food",
    title: "Has your food intake changed?",
    detail: (
      <>
        <p>People often become less precise over time without realizing it. Portions creep. Weekends change. Snacks return. Liquid calories appear.</p>
        <p className="mt-2">This doesn’t require guilt. It requires awareness.</p>
      </>
    ),
    yes: "Yes, it’s crept",
    no: "No, same as before",
    flagOn: "yes",
    weak: "Food intake has crept",
  },
  {
    id: "movement",
    title: "Has daily movement dropped?",
    detail: (
      <>
        <p>When someone eats less and loses weight, they may unconsciously move less. Less pacing. Less standing. Fewer steps. More sitting.</p>
        <p className="mt-2">Your workout may be exactly the same while your total daily movement quietly falls. Compare your current activity to your Phase 1 baseline.</p>
      </>
    ),
    yes: "Yes, it’s dropped",
    no: "No, at my baseline",
    flagOn: "yes",
    weak: "Daily movement dropped",
  },
  {
    id: "training",
    title: "Are you still training productively?",
    detail: (
      <p>Showing up is good. Giving your body a useful training stimulus is better. Are you still challenging your muscles, or have workouts slowly become something you’re simply completing?</p>
    ),
    yes: "Yes, still challenging",
    no: "No, just going through it",
    flagOn: "no",
    weak: "Training isn’t productive",
  },
  {
    id: "protein",
    title: "Is protein still consistent?",
    detail: <p>Low appetite makes this one easy to neglect. Check before assuming something more complicated is wrong.</p>,
    yes: "Yes, consistent",
    no: "No, it’s slipped",
    flagOn: "no",
    weak: "Protein slipped",
  },
  {
    id: "sleep",
    title: "What happened to sleep?",
    detail: (
      <>
        <p>Poor sleep can affect hunger, energy, training, recovery, decision-making, movement, and your ability to follow the plan.</p>
        <p className="mt-2">Sleep is rarely the sexy answer. It’s often part of the correct one.</p>
      </>
    ),
    yes: "It’s fine",
    no: "It got worse",
    flagOn: "no",
    weak: "Sleep got worse",
  },
  {
    id: "variables",
    title: "Are you changing too many variables at once?",
    detail: (
      <>
        <p>People get frustrated, then simultaneously reduce food, add cardio, change training, change supplements, change everything else. Two weeks later something changes, and they have no idea why.</p>
        <p className="mt-2 font-semibold">Change fewer variables. Learn more from each one.</p>
      </>
    ),
    yes: "Yes, several at once",
    no: "No, one at a time",
    flagOn: "yes",
    weak: "Too many variables changing at once",
  },
];

type PlateauAnswers = Record<string, "yes" | "no">;
const NO_ANSWERS: PlateauAnswers = {};

export function usePlateau() {
  const [answers, setAnswers] = usePersistent<PlateauAnswers>("plateau", NO_ANSWERS);
  const answered = PLATEAU_ITEMS.filter((it) => answers[it.id]).length;
  const issues = PLATEAU_ITEMS.filter((it) => it.flagOn && answers[it.id] === it.flagOn).map(
    (it) => it.weak!,
  );
  return {
    answers,
    setAnswers,
    answered,
    complete: answered === PLATEAU_ITEMS.length,
    issues,
  };
}

export function PlateauChecklist() {
  const { answers, setAnswers, answered, complete, issues } = usePlateau();
  const [open, setOpen] = useState<string | null>(PLATEAU_ITEMS[0].id);

  const answer = (idx: number, v: "yes" | "no") => {
    const it = PLATEAU_ITEMS[idx];
    setAnswers((prev) => ({ ...prev, [it.id]: v }));
    const next = PLATEAU_ITEMS.slice(idx + 1).find((x) => !answers[x.id]);
    setOpen(next ? next.id : null);
    if (idx === PLATEAU_ITEMS.length - 1 || !next) track("reta_roadmap_plateau_answered", { answered: answered + 1 });
  };

  let summary: ReactNode;
  if (answers["long-enough"] === "no") {
    summary = (
      <>
        <strong>Not a plateau yet.</strong> A few days at the same body weight is not automatically a plateau. Keep executing and keep collecting data.
      </>
    );
  } else if (answers["measurements"] === "yes") {
    summary = (
      <>
        <strong>Progress is still happening, just not on the scale.</strong> Body weight stayed flat while your other measurements moved. The body does not owe you a perfectly linear graph.
        {issues.length > 0 && <> Still worth tightening: {issues.join(", ").toLowerCase()}.</>}
      </>
    );
  } else if (issues.length > 0) {
    summary = (
      <>
        <strong>Address the obvious thing first: {issues[0].toLowerCase()}.</strong>
        {issues.length > 1 && <> Also flagged: {issues.slice(1).join(", ").toLowerCase()}.</>} Change fewer variables. Learn more from each one.
      </>
    );
  } else if (complete) {
    summary = (
      <>
        <strong>Nothing obvious?</strong> That is where professional guidance becomes useful. When the simple answers don’t explain the pattern, guessing becomes less useful.
      </>
    );
  } else {
    summary = <>Answer each question honestly. Your result builds as you go.</>;
  }

  return (
    <div id="plateau-checklist" className="scroll-mt-[136px] overflow-hidden rounded-3xl border-2 border-[var(--primary)]/15 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-4 bg-[var(--primary)] px-5 py-4 text-white sm:px-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Interactive</div>
          <div className="font-bold sm:text-lg">The Plateau Checklist</div>
        </div>
        <div className="flex-shrink-0 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold tabular-nums">
          {answered}/{PLATEAU_ITEMS.length}
        </div>
      </div>
      <div className="h-1 bg-[var(--muted)]">
        <div
          className="h-full bg-[var(--accent-dark)] transition-all duration-500"
          style={{ width: `${(answered / PLATEAU_ITEMS.length) * 100}%` }}
        />
      </div>

      <ol className="divide-y divide-[var(--border)]">
        {PLATEAU_ITEMS.map((it, i) => {
          const a = answers[it.id];
          const flagged = it.flagOn && a === it.flagOn;
          const isOpen = open === it.id;
          return (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : it.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[var(--muted)]/60 sm:px-6"
              >
                <span
                  className={cx(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    !a && "bg-[var(--muted)] text-[var(--primary)]/60",
                    a && !flagged && "bg-[var(--primary)] text-white",
                    flagged && "bg-amber-400 text-amber-950",
                  )}
                >
                  {a ? flagged ? <IconAlert className="h-4 w-4" /> : <IconCheck className="h-4 w-4" /> : i + 1}
                </span>
                <span className="flex-1 font-semibold text-[var(--primary)]">{it.title}</span>
                {a && (
                  <span className={cx("hidden text-xs font-semibold sm:inline", flagged ? "text-amber-700" : "text-[var(--primary)]/55")}>
                    {a === "yes" ? it.yes : it.no}
                  </span>
                )}
                <IconChevron className={cx("h-5 w-5 flex-shrink-0 text-[var(--primary)]/40 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="animate-fade-in px-5 pb-5 pl-[3.75rem] sm:px-6 sm:pl-[4.25rem]">
                  <div className="text-[var(--primary)]/75 leading-relaxed">{it.detail}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["yes", "no"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => answer(i, v)}
                        aria-pressed={a === v}
                        className={cx(
                          "rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
                          a === v
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                            : "border-[var(--border)] text-[var(--primary)] hover:border-[var(--accent-dark)]",
                        )}
                      >
                        {v === "yes" ? it.yes : it.no}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="border-t border-[var(--border)] bg-[var(--muted)] p-5 text-[var(--primary)] leading-relaxed sm:p-6" aria-live="polite">
        {summary}
        {answered > 0 && (
          <button
            type="button"
            onClick={() => {
              setAnswers(NO_ANSWERS);
              setOpen(PLATEAU_ITEMS[0].id);
            }}
            className="mt-3 block text-sm font-semibold text-[var(--primary)]/55 underline underline-offset-2 hover:text-[var(--primary)]"
          >
            Start the checklist over
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Illustration: daily weigh-ins vs the trend (Phase 3)
 * ============================================================ */

const ILLUSTRATION = (() => {
  // Deterministic, made-up series: steady loss under daily noise, with a
  // flat-looking stretch and then a sudden drop. Not real data.
  const days = 35;
  const pts: number[] = [];
  for (let d = 0; d < days; d++) {
    let base = 186 - d * 0.16;
    if (d >= 16 && d <= 24) base += 0.5 + (d - 16) * 0.13; // water hides progress
    const noise = Math.sin(d * 1.7) * 0.9 + Math.sin(d * 0.63 + 1) * 0.6 + (d % 7 === 1 ? 0.8 : 0);
    pts.push(round1(base + noise));
  }
  const avg = pts.map((_, i) => {
    const w = pts.slice(Math.max(0, i - 6), i + 1);
    return w.reduce((a, b) => a + b, 0) / w.length;
  });
  return { pts, avg };
})();

export function TrendIllustration() {
  const { pts, avg } = ILLUSTRATION;
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 240;
  const pad = { l: 40, r: 64, t: 16, b: 28 };
  const min = Math.floor(Math.min(...pts) - 0.5);
  const max = Math.ceil(Math.max(...pts) + 0.5);
  const x = (i: number) => pad.l + (i / (pts.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + ((max - v) / (max - min)) * (H - pad.t - pad.b);
  const ticks = [min, Math.round((min + max) / 2), max];
  const line = avg.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  return (
    <figure className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-6">
      <figcaption className="mb-1 font-bold text-[var(--primary)]">
        Same five weeks, two stories
      </figcaption>
      <div className="mb-3 flex flex-wrap gap-4 text-xs text-[var(--primary)]/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#009aab" }} /> Daily weigh-in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded" style={{ background: "#155090" }} /> 7-day trend
        </span>
        <span className="text-[var(--primary)]/45">Illustration only, not real data</span>
      </div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="Illustration: daily weigh-ins bounce up and down and even rise for a week, while the 7-day trend keeps falling."
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const px = ((e.clientX - r.left) / r.width) * W;
            const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (pts.length - 1));
            setHover(i >= 0 && i < pts.length ? i : null);
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#cee8eb" strokeWidth={1} />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#155090" fillOpacity={0.55}>
                {t}
              </text>
            </g>
          ))}
          <text x={pad.l} y={H - 6} fontSize={11} fill="#155090" fillOpacity={0.55}>Week 1</text>
          <text x={W - pad.r} y={H - 6} fontSize={11} textAnchor="end" fill="#155090" fillOpacity={0.55}>Week 5</text>
          {/* the "it stopped working" stretch */}
          <rect x={x(16)} y={pad.t} width={x(24) - x(16)} height={H - pad.t - pad.b} fill="#f59e0b" fillOpacity={0.08} />
          <text x={(x(16) + x(24)) / 2} y={pad.t + 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="#92400e">
            “Did it stop working?”
          </text>
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#155090" strokeOpacity={0.25} />
          )}
          {pts.map((v, i) => (
            <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 5.5 : 4} fill="#009aab" stroke="#fff" strokeWidth={2} />
          ))}
          <path d={line} fill="none" stroke="#155090" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          <text x={x(pts.length - 1) + 8} y={y(avg[avg.length - 1]) + 4} fontSize={12} fontWeight={700} fill="#155090">
            Trend
          </text>
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg bg-[var(--primary)] px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{
              left: `${(x(hover) / W) * 100}%`,
              transform: `translateX(${hover > pts.length / 2 ? "-105%" : "5%"})`,
            }}
          >
            <div className="font-semibold">Day {hover + 1}</div>
            <div>Scale: {pts[hover].toFixed(1)}</div>
            <div>Trend: {avg[hover].toFixed(1)}</div>
          </div>
        )}
      </div>
    </figure>
  );
}

/* ============================================================
 * The 20-Pound Scorecard + Weekly Decision Tree
 * ============================================================ */

type Tone = "good" | "neutral" | "weak" | "watch";
type ScoreItem = {
  key: string;
  label: string;
  prompt: string;
  options: { v: string; l: string; tone: Tone }[];
  /** Name of the weak point when a "weak" option is chosen. */
  weak?: string;
};

const SCORE_ITEMS: ScoreItem[] = [
  {
    key: "trend",
    label: "Body-weight trend",
    prompt: "Is the multi-week trend moving in the direction you want?",
    options: [
      { v: "down", l: "Yes, trending down", tone: "good" },
      { v: "flat", l: "Flat", tone: "neutral" },
      { v: "up", l: "Moving up", tone: "neutral" },
      { v: "unsure", l: "Too early to tell", tone: "neutral" },
    ],
  },
  {
    key: "waist",
    label: "Waist",
    prompt: "Is your waist changing?",
    options: [
      { v: "down", l: "Smaller", tone: "good" },
      { v: "same", l: "Same", tone: "neutral" },
      { v: "up", l: "Bigger", tone: "neutral" },
      { v: "skip", l: "Didn’t measure", tone: "neutral" },
    ],
  },
  {
    key: "photos",
    label: "Photos",
    prompt: "What does the mirror show that the scale doesn’t?",
    options: [
      { v: "change", l: "Visible change", tone: "good" },
      { v: "same", l: "No obvious change", tone: "neutral" },
      { v: "skip", l: "Didn’t take any", tone: "neutral" },
    ],
  },
  {
    key: "protein",
    label: "Protein",
    prompt: "Were you reasonably consistent this week?",
    options: [
      { v: "yes", l: "Consistent", tone: "good" },
      { v: "mostly", l: "Mostly", tone: "neutral" },
      { v: "slipped", l: "Slipped", tone: "weak" },
    ],
    weak: "Protein slipped",
  },
  {
    key: "training",
    label: "Strength training",
    prompt: "Did you complete your planned sessions?",
    options: [
      { v: "all", l: "All of them", tone: "good" },
      { v: "some", l: "Some", tone: "neutral" },
      { v: "none", l: "Training disappeared", tone: "weak" },
    ],
    weak: "Training disappeared",
  },
  {
    key: "performance",
    label: "Performance",
    prompt: "Is strength generally stable? Improving? Dropping?",
    options: [
      { v: "up", l: "Improving", tone: "good" },
      { v: "stable", l: "Stable", tone: "good" },
      { v: "down", l: "Dropping", tone: "watch" },
    ],
  },
  {
    key: "movement",
    label: "Daily movement",
    prompt: "Did you maintain your baseline?",
    options: [
      { v: "yes", l: "Kept my baseline", tone: "good" },
      { v: "no", l: "Movement dropped", tone: "weak" },
    ],
    weak: "Movement dropped",
  },
  {
    key: "energy",
    label: "Energy",
    prompt: "How did you feel during normal life?",
    options: [
      { v: "good", l: "Good", tone: "good" },
      { v: "ok", l: "Okay", tone: "neutral" },
      { v: "low", l: "Persistently low", tone: "watch" },
    ],
  },
  {
    key: "appetite",
    label: "Hunger / appetite",
    prompt: "Manageable? Very low? Increasing? Different?",
    options: [
      { v: "ok", l: "Manageable", tone: "good" },
      { v: "verylow", l: "Very low", tone: "watch" },
      { v: "up", l: "Increasing", tone: "neutral" },
      { v: "different", l: "Different", tone: "neutral" },
    ],
  },
  {
    key: "sleep",
    label: "Sleep",
    prompt: "Are you recovering?",
    options: [
      { v: "yes", l: "Recovering well", tone: "good" },
      { v: "meh", l: "So-so", tone: "neutral" },
      { v: "no", l: "Sleep collapsed", tone: "weak" },
    ],
    weak: "Sleep collapsed",
  },
  {
    key: "digestion",
    label: "Digestion",
    prompt: "Any meaningful changes worth paying attention to?",
    options: [
      { v: "no", l: "Nothing notable", tone: "good" },
      { v: "yes", l: "Changes worth watching", tone: "watch" },
    ],
  },
];

const WATCH_NOTES: Record<string, string> = {
  performance: "Strength dropping",
  energy: "Persistently low energy",
  appetite: "Very low appetite (are you eating enough nutritious food?)",
  digestion: "Digestive changes",
};

type Draft = {
  weight: number | null;
  waist: number | null;
  answers: Record<string, string>;
  longEnough: "yes" | "no" | null;
};
const EMPTY_DRAFT: Draft = { weight: null, waist: null, answers: {}, longEnough: null };

type VerdictKey = "keep" | "collect" | "fix" | "plateau" | "pro";
type Entry = {
  id: string;
  date: string;
  weight: number | null;
  waist: number | null;
  answers: Record<string, string>;
  verdict: VerdictKey;
};
const NO_ENTRIES: Entry[] = [];

const VERDICT_LABEL: Record<VerdictKey, string> = {
  keep: "Keep going",
  collect: "Keep collecting data",
  fix: "Fix the obvious thing",
  plateau: "Run the Plateau Checklist",
  pro: "Get professional guidance",
};

function toneOf(item: ScoreItem, v: string | undefined): Tone | null {
  return item.options.find((o) => o.v === v)?.tone ?? null;
}

function decide(d: Draft, plateau: { complete: boolean; issues: string[] }) {
  const a = d.answers;
  if (!a.trend) return null;
  const weak = SCORE_ITEMS.filter((it) => toneOf(it, a[it.key]) === "weak").map((it) => it.weak!);
  const watch = SCORE_ITEMS.filter((it) => toneOf(it, a[it.key]) === "watch").map((it) => WATCH_NOTES[it.key]);
  const progress = a.trend === "down" || a.waist === "down" || a.photos === "change";

  let key: VerdictKey;
  let needsLongEnough = false;
  let points: string[] = [];
  if (progress) key = "keep";
  else if (a.trend === "unsure") key = "collect";
  else {
    needsLongEnough = true;
    if (d.longEnough === null) return { key: null, weak, watch, progress, needsLongEnough, points } as const;
    if (d.longEnough === "no") key = "collect";
    else {
      points = [...weak, ...plateau.issues.filter((x) => !weak.includes(x))];
      if (points.length) key = "fix";
      else if (plateau.complete) key = "pro";
      else key = "plateau";
    }
  }
  return { key, weak, watch, progress, needsLongEnough, points } as const;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit: string;
  value: number | null;
  onChange: (n: number | null) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--primary)]">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder={placeholder}
          value={draft ?? (value === null ? "" : String(value))}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = parseFloat(e.target.value);
            onChange(Number.isFinite(n) && n > 0 ? n : null);
          }}
          onBlur={() => setDraft(null)}
          className="h-11 w-full rounded-xl border-2 border-[var(--border)] bg-white pl-3 pr-10 font-semibold tabular-nums text-[var(--primary)] outline-none placeholder:font-normal placeholder:text-[var(--primary)]/35 focus:border-[var(--accent-dark)]"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--primary)]/50">
          {unit}
        </span>
      </div>
    </label>
  );
}

export function Scorecard() {
  const [draft, setDraft] = usePersistent<Draft>("scorecard-draft", EMPTY_DRAFT);
  const [entries, setEntries] = usePersistent<Entry[]>("scorecard-entries", NO_ENTRIES);
  const { setPosition } = usePosition();
  const plateau = usePlateau();
  const [saved, setSaved] = useState<string | null>(null);

  const result = decide(draft, plateau);
  const answeredCount = SCORE_ITEMS.filter((it) => draft.answers[it.key]).length;
  const last = entries.length ? entries[entries.length - 1] : null;
  const lastWithWeight = [...entries].reverse().find((e) => e.weight !== null);

  const setAnswer = (k: string, v: string) =>
    setDraft((d) => ({ ...d, answers: { ...d.answers, [k]: v } }));

  const save = () => {
    if (!result?.key) return;
    const date = todayKey();
    const entry: Entry = {
      id: `${Date.now().toString(36)}`,
      date,
      weight: draft.weight,
      waist: draft.waist,
      answers: draft.answers,
      verdict: result.key,
    };
    setEntries((prev) => [...prev.filter((e) => e.date !== date), entry].sort((a, b) => a.date.localeCompare(b.date)));
    if (validWeight(draft.weight)) {
      setPosition((p) => (validWeight(p.start) ? { ...p, current: draft.weight, mode: "weights" } : p));
    }
    setDraft(EMPTY_DRAFT);
    setSaved(date);
    track("reta_roadmap_scorecard_saved", { verdict: result.key, weeks: entries.length + 1 });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* ---- the form ---- */}
      <div className="overflow-hidden rounded-3xl border-2 border-[var(--primary)]/15 bg-white shadow-lg">
        <div className="flex items-center justify-between gap-4 bg-[var(--primary)] px-5 py-4 text-white sm:px-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">This week</div>
            <div className="font-bold sm:text-lg">Your weekly check-in</div>
          </div>
          <div className="flex-shrink-0 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold tabular-nums">
            {answeredCount}/{SCORE_ITEMS.length}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Weight (optional)"
              unit="lb"
              placeholder={lastWithWeight?.weight ? String(lastWithWeight.weight) : "e.g. 182.4"}
              value={draft.weight}
              onChange={(n) => setDraft((d) => ({ ...d, weight: n }))}
            />
            <NumberField
              label="Waist (optional)"
              unit="in"
              placeholder="e.g. 36.5"
              value={draft.waist}
              onChange={(n) => setDraft((d) => ({ ...d, waist: n }))}
            />
          </div>
          {lastWithWeight && validWeight(draft.weight) && validWeight(lastWithWeight.weight) && (
            <p className="mt-2 text-sm text-[var(--primary)]/65">
              {(() => {
                const diff = round1(draft.weight! - lastWithWeight.weight!);
                return diff === 0
                  ? `Same as your ${fmtDate(lastWithWeight.date)} check-in.`
                  : `${diff < 0 ? "Down" : "Up"} ${fmtLb(Math.abs(diff))} lb since ${fmtDate(lastWithWeight.date)}. One week is one data point. Read the trend.`;
              })()}
            </p>
          )}

          <div className="mt-6 space-y-5">
            {SCORE_ITEMS.map((it) => (
              <fieldset key={it.key}>
                <legend className="mb-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[var(--primary)]/55">{it.label}</span>
                  <span className="block font-semibold text-[var(--primary)]">{it.prompt}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {it.options.map((o) => {
                    const on = draft.answers[it.key] === o.v;
                    return (
                      <button
                        key={o.v}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setAnswer(it.key, o.v)}
                        className={cx(
                          "rounded-xl border-2 px-3.5 py-2 text-sm font-semibold transition-colors",
                          on && (o.tone === "weak" || o.tone === "watch")
                            ? "border-amber-400 bg-amber-50 text-amber-900"
                            : on
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                              : "border-[var(--border)] text-[var(--primary)]/80 hover:border-[var(--accent-dark)]",
                        )}
                      >
                        {o.l}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            {result?.needsLongEnough && (
              <fieldset className="animate-fade-in rounded-2xl border-2 border-dashed border-[var(--accent-dark)]/60 bg-[var(--muted)] p-4">
                <legend className="px-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]/60">
                  Decision tree
                </legend>
                <div className="mb-2 font-semibold text-[var(--primary)]">
                  Has it been long enough to call this a real trend?
                </div>
                <p className="mb-3 text-sm text-[var(--primary)]/65">Not three mornings. A pattern across several weeks.</p>
                <div className="flex flex-wrap gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={draft.longEnough === v}
                      onClick={() => setDraft((d) => ({ ...d, longEnough: v }))}
                      className={cx(
                        "rounded-xl border-2 px-4 py-2 text-sm font-semibold",
                        draft.longEnough === v
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-[var(--border)] bg-white text-[var(--primary)]",
                      )}
                    >
                      {v === "yes" ? "Yes, it’s a real trend" : "No, it’s only been days"}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        </div>
      </div>

      {/* ---- the verdict + history ---- */}
      <div className="space-y-6 lg:sticky lg:top-[150px]">
        <Verdict result={result} onSave={save} plateauComplete={plateau.complete} />
        {saved && (
          <div className="animate-fade-in rounded-2xl bg-[var(--accent)]/15 px-4 py-3 text-sm font-semibold text-[var(--primary)]">
            Saved your {fmtDate(saved)} check-in. Come back next week.
          </div>
        )}
        <History entries={entries} onDelete={(id) => setEntries((prev) => prev.filter((e) => e.id !== id))} lastDate={last?.date ?? null} />
      </div>
    </div>
  );
}

function Verdict({
  result,
  onSave,
  plateauComplete,
}: {
  result: ReturnType<typeof decide>;
  onSave: () => void;
  plateauComplete: boolean;
}) {
  const path = result?.key ?? null;
  const row1 = !result ? null : result.progress ? "yes" : result.key === "collect" && !result.needsLongEnough ? "unsure" : "no";

  let headline: ReactNode = "Answer the body-weight trend question to start.";
  let body: ReactNode = "Then work down the list. The Decision Tree fills in as you go.";
  if (result && !result.key) {
    headline = "One more question.";
    body = "Has it been long enough to call this a real trend?";
  } else if (path === "keep") {
    headline = "No. Keep going.";
    body = "You have evidence the plan is working. Don’t sabotage it because you’re bored. Sometimes the smartest adjustment is no adjustment.";
  } else if (path === "collect") {
    headline = "Not yet. Keep collecting data.";
    body = "One strange week is normal. A repeatable pattern deserves attention.";
  } else if (path === "fix" && result) {
    headline = `Maybe one thing: ${result.points[0].toLowerCase()}.`;
    body = (
      <>
        Address the obvious thing first.
        {result.points.length > 1 && <> Also noted: {result.points.slice(1).join(", ").toLowerCase()}.</>} Change one variable, then watch what happens.
      </>
    );
  } else if (path === "plateau") {
    headline = "Run the Plateau Checklist.";
    body = "Nothing on your scorecard stands out, so check the eight usual suspects before you change anything.";
  } else if (path === "pro") {
    headline = "Nothing obvious? Get professional guidance.";
    body = "When the simple answers don’t explain the pattern, guessing becomes less useful.";
  }

  const rows: { q: string; yes: string; no: string; state: "yes" | "no" | "pending" | "off" }[] = [
    {
      q: "Is progress happening?",
      yes: "Keep going",
      no: "Check how long",
      state: row1 === "yes" ? "yes" : row1 === "no" ? "no" : row1 === "unsure" ? "no" : "pending",
    },
    {
      q: "Long enough to call it a trend?",
      yes: "Run the Plateau Checklist",
      no: "Keep collecting data",
      state:
        row1 !== "no" && row1 !== "unsure"
          ? "off"
          : row1 === "unsure" || path === "collect"
            ? "no"
            : path
              ? "yes"
              : "pending",
    },
    {
      q: "Found an obvious weak point?",
      yes: "Address it first",
      no: "Professional guidance",
      state:
        path === "fix" ? "yes" : path === "pro" ? "no" : path === "plateau" ? "pending" : "off",
    },
  ];

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-lg" aria-live="polite">
      <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-5 text-white sm:p-6">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
          Do I actually need to change anything this week?
        </div>
        <div className="mt-2 text-xl font-bold leading-snug">{headline}</div>
        <p className="mt-2 text-sm leading-relaxed text-white/85">{body}</p>
        {path === "plateau" && !plateauComplete && (
          <button
            type="button"
            onClick={() => scrollToId("plateau-checklist")}
            className="btn-accent mt-4 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
          >
            Open the Plateau Checklist <IconArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-2 p-4 sm:p-5">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/55">Your weekly decision tree</div>
        {rows.map((r) => (
          <div
            key={r.q}
            className={cx(
              "rounded-xl border p-3 transition-opacity",
              r.state === "off" ? "border-[var(--border)] opacity-35" : "border-[var(--border)]",
            )}
          >
            <div className="text-sm font-semibold text-[var(--primary)]">{r.q}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-semibold">
              <span className={cx("rounded-lg px-2 py-1.5", r.state === "yes" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--primary)]/55")}>
                Yes → {r.yes}
              </span>
              <span className={cx("rounded-lg px-2 py-1.5", r.state === "no" ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--primary)]/55")}>
                No → {r.no}
              </span>
            </div>
          </div>
        ))}

        {result && result.watch.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
            <div className="flex items-center gap-1.5 font-bold">
              <IconAlert className="h-4 w-4 text-amber-600" /> Pay attention
            </div>
            <ul className="mt-1 list-disc pl-5">
              {result.watch.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className="mt-2 text-amber-950/80">
              These don’t automatically mean something is wrong. If they persist, health concerns belong with a qualified healthcare professional.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={!result?.key}
          className="btn-primary mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save this week’s scorecard
        </button>
      </div>
    </div>
  );
}

function History({
  entries,
  onDelete,
  lastDate,
}: {
  entries: Entry[];
  onDelete: (id: string) => void;
  lastDate: string | null;
}) {
  const weights = useMemo(() => entries.filter((e) => validWeight(e.weight)), [entries]);
  const [hover, setHover] = useState<number | null>(null);

  if (!entries.length) {
    return (
      <div className="rounded-3xl border border-dashed border-white/40 bg-white/10 p-5 text-center text-sm text-white/85">
        Your saved weeks show up here, with a weight trend once you’ve logged two.
      </div>
    );
  }

  const W = 340;
  const H = 120;
  const pad = { l: 34, r: 12, t: 12, b: 20 };
  const vals = weights.map((e) => e.weight!);
  const min = Math.floor(Math.min(...vals) - 1);
  const max = Math.ceil(Math.max(...vals) + 1);
  const x = (i: number) => pad.l + (weights.length === 1 ? 0.5 : i / (weights.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + ((max - v) / (max - min || 1)) * (H - pad.t - pad.b);

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <div className="font-bold text-[var(--primary)]">Weekly history</div>
        {lastDate && <div className="text-xs text-[var(--primary)]/55">Last: {fmtDate(lastDate)}</div>}
      </div>

      {weights.length >= 2 && (
        <div className="relative mt-3">
          <div className="mb-1 text-xs text-[var(--primary)]/60">Weight (lb)</div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Weight from ${vals[0]} to ${vals[vals.length - 1]} pounds across ${vals.length} check-ins`}
            onMouseLeave={() => setHover(null)}
          >
            {[min, max].map((t) => (
              <g key={t}>
                <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#cee8eb" />
                <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize={10} fill="#155090" fillOpacity={0.55}>
                  {t}
                </text>
              </g>
            ))}
            <path
              d={weights.map((e, i) => `${i ? "L" : "M"}${x(i)},${y(e.weight!)}`).join("")}
              fill="none"
              stroke="#155090"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {weights.map((e, i) => (
              <g key={e.id} onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)}>
                <circle cx={x(i)} cy={y(e.weight!)} r={14} fill="transparent" />
                <circle cx={x(i)} cy={y(e.weight!)} r={hover === i ? 6 : 4.5} fill="#155090" stroke="#fff" strokeWidth={2} />
              </g>
            ))}
            <text x={pad.l} y={H - 4} fontSize={10} fill="#155090" fillOpacity={0.55}>
              {fmtDate(weights[0].date)}
            </text>
            <text x={W - pad.r} y={H - 4} textAnchor="end" fontSize={10} fill="#155090" fillOpacity={0.55}>
              {fmtDate(weights[weights.length - 1].date)}
            </text>
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute top-4 rounded-lg bg-[var(--primary)] px-2 py-1 text-xs text-white shadow"
              style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > weights.length / 2 ? "-110%" : "10%"})` }}
            >
              {fmtDate(weights[hover].date)}: {weights[hover].weight} lb
            </div>
          )}
        </div>
      )}

      <ul className="mt-3 divide-y divide-[var(--border)] text-sm">
        {[...entries].reverse().map((e) => (
          <li key={e.id} className="flex items-center gap-3 py-2.5">
            <span className="w-14 flex-shrink-0 font-semibold text-[var(--primary)]">{fmtDate(e.date)}</span>
            <span className="w-20 flex-shrink-0 tabular-nums text-[var(--primary)]/70">
              {e.weight ? `${e.weight} lb` : "—"}
            </span>
            <span className="min-w-0 flex-1 truncate text-[var(--primary)]/70">{VERDICT_LABEL[e.verdict]}</span>
            <button
              type="button"
              onClick={() => onDelete(e.id)}
              aria-label={`Delete ${fmtDate(e.date)} check-in`}
              className="rounded p-1 text-[var(--primary)]/35 hover:bg-red-50 hover:text-red-600"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
