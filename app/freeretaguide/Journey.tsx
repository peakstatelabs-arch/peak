"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import {
  EMPTY_POSITION,
  PHASES,
  fmtLb,
  locate,
  validWeight,
  type Located,
  type Position,
} from "./model";
import { usePersistent } from "./store";
import { IconArrowRight, IconPin, cx } from "./ui";

/** Sequential blues, light → dark, one per phase (maintenance darkest). */
export const PHASE_COLORS = ["#8fe3ea", "#4fc9d4", "#2f9fd0", "#1a6ab8", "#155090"];

export function usePosition() {
  const [position, setPosition] = usePersistent<Position>("position", EMPTY_POSITION);
  return { position, setPosition, located: locate(position) };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function track(event: string, props?: Record<string, unknown>) {
  try {
    posthog.capture(event, props);
  } catch {
    /* analytics optional */
  }
}

/* ============================================================
 * Reading position (scrollspy) — which phase section is on screen.
 * ============================================================ */

const SPY: { id: string; phase: number | null }[] = [
  { id: "phase-1", phase: 0 },
  { id: "phase-2", phase: 1 },
  { id: "phase-3", phase: 2 },
  { id: "phase-4", phase: 3 },
  { id: "tools", phase: null },
  { id: "phase-5", phase: 4 },
  { id: "summary", phase: null },
];

function useReadingPhase() {
  const [reading, setReading] = useState<number | null>(null);
  useEffect(() => {
    let frame = 0;
    const compute = () => {
      frame = 0;
      let current: number | null = null;
      for (const s of SPY) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top - 160 <= 0) current = s.phase;
      }
      setReading(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return reading;
}

/* ============================================================
 * Hero journey: 0 → 5 → 10 → 15 → 20 → keep it
 * ============================================================ */

const NODE_LABELS = ["0", "5", "10", "15", "20"];

export function HeroJourney() {
  const { located } = usePosition();
  const [picked, setPicked] = useState<number | null>(null);
  const selected = picked ?? located?.phase ?? 0;
  const phase = PHASES[selected];

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl">
      <div className="rounded-3xl border border-[var(--border)] bg-white/90 p-4 pt-12 shadow-xl backdrop-blur sm:p-8 sm:pt-14">
        <div className="relative">
          {located && <Marker located={located} big />}

          {/* pounds lost scale */}
          <div className="relative mb-2 h-5 text-xs font-semibold tabular-nums text-[var(--primary)]/60 sm:text-sm">
            {NODE_LABELS.map((l, i) => (
              <span
                key={l}
                className={cx("absolute", i === 0 ? "" : "-translate-x-1/2")}
                style={{ left: `${i * 20}%` }}
              >
                {l}
                {i === 4 && <span className="hidden sm:inline"> lb</span>}
              </span>
            ))}
            <span className="absolute right-0">∞</span>
          </div>

          {/* segments */}
          <div className="grid grid-cols-5 gap-1 sm:gap-1.5" role="tablist" aria-label="Roadmap phases">
            {PHASES.map((p, i) => {
              const active = i === selected;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setPicked(i);
                    track("reta_roadmap_map_click", { phase: p.num });
                  }}
                  className="group flex flex-col items-stretch gap-2 rounded-xl pb-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                  <span
                    className={cx(
                      "block rounded-full transition-all",
                      active ? "h-4 shadow-md" : "h-2.5 opacity-80 group-hover:opacity-100",
                      i === 4 && "bg-[length:10px_10px]",
                    )}
                    style={{
                      backgroundColor: PHASE_COLORS[i],
                      backgroundImage:
                        i === 4
                          ? "repeating-linear-gradient(135deg, rgba(255,255,255,.35) 0 3px, transparent 3px 7px)"
                          : undefined,
                    }}
                  />
                  <span className="px-0.5">
                    <span
                      className={cx(
                        "block text-[10px] font-bold uppercase tracking-wider sm:text-xs",
                        active ? "text-[var(--primary)]" : "text-[var(--primary)]/50",
                      )}
                    >
                      {i === 4 ? "Then" : `Phase ${p.num}`}
                    </span>
                    <span
                      className={cx(
                        "block text-xs font-semibold leading-tight sm:text-sm",
                        active ? "text-[var(--primary)]" : "text-[var(--primary)]/60 group-hover:text-[var(--primary)]",
                      )}
                    >
                      {p.short}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* preview of the selected phase */}
        <div
          key={phase.id}
          className="animate-fade-in mt-5 rounded-2xl bg-[var(--muted)] p-5 text-left sm:p-6"
          role="tabpanel"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/60">
                {phase.num === 5 ? "After pound 20" : `Pounds ${phase.range.replace(" lb", "")}`}
              </div>
              <div className="mt-1 text-xl font-bold text-[var(--primary)] sm:text-2xl">
                {phase.title}
              </div>
              <ul className="mt-2 space-y-0.5 text-sm text-[var(--primary)]/75 sm:text-base">
                {phase.summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => scrollToId(phase.id)}
              className="btn-primary inline-flex h-11 flex-shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold"
            >
              Read {phase.num === 5 ? "Phase 5" : `Phase ${phase.num}`}
              <IconArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Marker({ located, big }: { located: Located; big?: boolean }) {
  const pct = (located.pos / 5) * 100;
  // Keep the bubble inside the card near the edges.
  const align = pct < 12 ? "left" : pct > 88 ? "right" : "center";
  return (
    <div
      className="pointer-events-none absolute z-10 transition-[left] duration-700 ease-out"
      style={{ left: `${pct}%`, top: big ? -44 : -30 }}
      aria-hidden="true"
    >
      <div
        className={cx(
          "flex flex-col",
          align === "left" && "items-start -translate-x-3",
          align === "center" && "-translate-x-1/2 items-center",
          align === "right" && "-translate-x-[calc(100%-12px)] items-end",
        )}
      >
        <span
          className={cx(
            "whitespace-nowrap rounded-full bg-[var(--primary)] font-bold text-white shadow-md",
            big ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[10px]",
          )}
        >
          You are here
          {located.lost !== null && big && ` · ${fmtLb(located.lost)} lb`}
        </span>
        <span
          className={cx(
            "h-2.5 w-2.5 rotate-45 bg-[var(--primary)]",
            big ? "-mt-1.5" : "-mt-1.5 h-2 w-2",
            align === "left" && "ml-2",
            align === "right" && "mr-2",
          )}
        />
      </div>
    </div>
  );
}

/* ============================================================
 * "Which phase are you in?" selector
 * ============================================================ */

function WeightInput({
  label,
  value,
  onChange,
  onCommit,
}: {
  label: string;
  value: number | null;
  onChange: (n: number | null) => void;
  onCommit: () => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value === null ? "" : String(value));
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--primary)]">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={60}
          max={800}
          step="0.1"
          placeholder="e.g. 190"
          value={shown}
          onChange={(e) => {
            setDraft(e.target.value);
            const n = parseFloat(e.target.value);
            onChange(Number.isFinite(n) ? n : null);
          }}
          onBlur={() => {
            setDraft(null);
            onCommit();
          }}
          className="h-12 w-full rounded-xl border-2 border-[var(--border)] bg-white pl-4 pr-10 text-lg font-semibold tabular-nums text-[var(--primary)] outline-none transition-colors placeholder:font-normal placeholder:text-[var(--primary)]/35 focus:border-[var(--accent-dark)]"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[var(--primary)]/50">
          lb
        </span>
      </div>
    </label>
  );
}

export function PhaseSelector() {
  const { position, setPosition, located } = usePosition();

  const pick = (i: number) => {
    setPosition((p) => ({ ...p, mode: "phase", phase: i }));
    track("reta_roadmap_phase_set", { phase: i + 1, source: "picker" });
  };

  const setWeight = (key: "start" | "current", n: number | null) =>
    setPosition((p) => ({ ...p, [key]: n, mode: "weights" }));

  const weightsComplete = validWeight(position.start) && validWeight(position.current);
  const gained =
    weightsComplete && position.current! > position.start! ? position.current! - position.start! : 0;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-lg sm:p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
          Which phase are you in?
        </h2>
        <p className="mt-2 text-[var(--primary)]/70">
          Already down 12 pounds? Skip straight to the part that applies to you.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        {PHASES.map((p, i) => {
          const active = located?.phase === i;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={active}
              className={cx(
                "relative rounded-2xl border-2 p-3 text-left transition-all sm:p-4",
                i === 4 && "col-span-2 sm:col-span-1",
                active
                  ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-lg"
                  : "border-[var(--border)] bg-white text-[var(--primary)] hover:border-[var(--accent-dark)] hover:bg-[var(--muted)]",
              )}
            >
              <span
                className="mb-2 block h-1.5 w-8 rounded-full"
                style={{ backgroundColor: PHASE_COLORS[i] }}
              />
              <span className={cx("block text-xs font-bold uppercase tracking-wider", active ? "text-white/70" : "text-[var(--primary)]/50")}>
                {i === 4 ? "Phase 5" : `Phase ${p.num}`}
              </span>
              <span className="block text-base font-bold leading-tight">{p.range}</span>
              <span className={cx("mt-0.5 block text-xs", active ? "text-white/80" : "text-[var(--primary)]/60")}>
                {p.short}
              </span>
              {active && (
                <IconPin className="absolute right-3 top-3 h-4 w-4 text-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[var(--primary)]/45">
        <span className="h-px flex-1 bg-[var(--border)]" />
        or work it out from your weight
        <span className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <WeightInput
          label="Starting weight"
          value={position.start}
          onChange={(n) => setWeight("start", n)}
          onCommit={() => {
            if (located && position.mode === "weights")
              track("reta_roadmap_phase_set", { phase: located.phase + 1, source: "weights" });
          }}
        />
        <WeightInput
          label="Current weight"
          value={position.current}
          onChange={(n) => setWeight("current", n)}
          onCommit={() => {
            if (located && position.mode === "weights")
              track("reta_roadmap_phase_set", { phase: located.phase + 1, source: "weights" });
          }}
        />
      </div>

      {located && (
        <div className="animate-fade-in mt-6 flex flex-col items-start gap-4 rounded-2xl bg-[var(--muted)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <IconPin className="mt-0.5 h-6 w-6 flex-shrink-0 text-[var(--accent-dark)]" />
            <div>
              <div className="font-bold text-[var(--primary)]">
                {located.lost !== null
                  ? gained > 0
                    ? `You’re ${fmtLb(Math.round(gained * 10) / 10)} lb above your start — begin at Phase 1.`
                    : `You’re down ${fmtLb(located.lost)} lb. That puts you in ${located.phase === 4 ? "Phase 5" : `Phase ${located.phase + 1}`}.`
                  : `You’re in ${located.phase === 4 ? "Phase 5" : `Phase ${located.phase + 1}`}.`}
              </div>
              <div className="text-sm text-[var(--primary)]/70">
                {PHASES[located.phase].title} — <em>{PHASES[located.phase].question}</em>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => scrollToId(PHASES[located.phase].id)}
            className="btn-primary inline-flex h-11 flex-shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-semibold"
          >
            Jump to {located.phase === 4 ? "Phase 5" : `Phase ${located.phase + 1}`}
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {!located && position.mode === "weights" && (position.start !== null || position.current !== null) && !weightsComplete && (
        <p className="mt-4 text-sm text-[var(--primary)]/60">
          Enter both weights (in pounds) to place yourself on the map.
        </p>
      )}

      <p className="mt-5 text-center text-xs text-[var(--primary)]/50">
        Saved only in this browser, so the map remembers you next time. Nothing is sent anywhere.
      </p>
    </div>
  );
}

/* ============================================================
 * Sticky "you are here" tracker
 * ============================================================ */

export function StickyTracker() {
  const { located } = usePosition();
  const reading = useReadingPhase();

  return (
    <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:gap-5 sm:px-6">
        <div className="relative min-w-0 flex-1">
          {located && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0 z-10 -ml-[7px] -mt-[3px] h-3.5 w-3.5 rounded-full border-2 border-white bg-[var(--primary)] shadow transition-[left] duration-700"
              style={{ left: `${(located.pos / 5) * 100}%` }}
              title="You are here"
            />
          )}
          <div className="grid grid-cols-5 gap-1">
            {PHASES.map((p, i) => {
              const isReading = reading === i;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToId(p.id)}
                  className="group flex flex-col gap-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded"
                  aria-label={`Go to ${i === 4 ? "Phase 5" : `Phase ${p.num}`}: ${p.title}`}
                  aria-current={isReading ? "step" : undefined}
                >
                  <span
                    className={cx(
                      "block rounded-full transition-all",
                      isReading ? "h-2.5 ring-2 ring-[var(--primary)]/25" : "h-1.5 opacity-60 group-hover:opacity-100",
                    )}
                    style={{ backgroundColor: PHASE_COLORS[i] }}
                  />
                  <span
                    className={cx(
                      "truncate text-[10px] font-semibold leading-none sm:text-xs",
                      isReading ? "text-[var(--primary)]" : "text-[var(--primary)]/50",
                    )}
                  >
                    <span className="sm:hidden">P{p.num}</span>
                    <span className="hidden sm:inline">
                      {p.num}. {p.short}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToId("scorecard")}
            className="hidden h-9 items-center rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--muted)] md:inline-flex"
          >
            Scorecard
          </button>
          {located ? (
            <button
              type="button"
              onClick={() => scrollToId(PHASES[located.phase].id)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-xs font-semibold text-white"
            >
              <IconPin className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="sm:hidden">P{located.phase + 1}</span>
              <span className="hidden sm:inline">
                My phase{located.lost !== null ? ` · ${fmtLb(located.lost)} lb` : ""}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => scrollToId("where")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 text-xs font-semibold text-white"
            >
              <IconPin className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="hidden sm:inline">Find my phase</span>
              <span className="sm:hidden">Find me</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Phase section header with "you are here" state
 * ============================================================ */

export function PhaseHeader({ index }: { index: number }) {
  const { located } = usePosition();
  const p = PHASES[index];
  const state =
    located === null ? null : located.phase === index ? "here" : located.phase > index ? "behind" : "ahead";

  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white shadow-md"
          style={{ backgroundColor: PHASE_COLORS[index], color: index < 2 ? "#155090" : "#fff" }}
        >
          {p.num}
        </span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/55">
            {index === 4 ? "Phase 5 · Maintenance" : `Phase ${p.num} · Pounds ${p.range.replace(" lb", "")}`}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--primary)] sm:text-4xl">
            {index === 4 ? "Your New Job Is Boring" : p.title}
          </h2>
        </div>
      </div>
      {state && (
        <div
          className={cx(
            "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold",
            state === "here" && "bg-[var(--primary)] text-white",
            state === "behind" && "bg-[var(--muted)] text-[var(--primary)]/70",
            state === "ahead" && "border border-[var(--border)] text-[var(--primary)]/60",
          )}
        >
          {state === "here" && (
            <>
              <IconPin className="h-4 w-4 text-[var(--accent)]" /> You are here
            </>
          )}
          {state === "behind" && "Behind you. Skim the checkpoint to make sure nothing slipped."}
          {state === "ahead" && "Coming up. Read it now so it doesn’t surprise you later."}
        </div>
      )}
    </div>
  );
}
