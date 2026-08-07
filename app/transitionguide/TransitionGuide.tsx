"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/* ============================================================
 * Peak State Labs — Tirzepatide → Retatrutide Transition Guide
 *
 * A single-page guided journey. Content is sourced from the
 * Transition Playbook and rewritten for the web: shorter, scannable,
 * action-first, with deeper physiology tucked behind "Learn why".
 *
 * Interactive systems:
 *  - Scroll-based progress rail + sticky stage navigation (scrollspy)
 *  - Chapter completion states (persisted)
 *  - Completable checklists (persisted in localStorage)
 *  - Progressive disclosure ("Learn why" panels)
 *  - Tirz vs Reta comparison module (no horizontal scroll on mobile)
 *  - The Transition Roadmap centerpiece
 * ============================================================ */

const STORAGE_PREFIX = "tg:";

type Stage = {
  id: string;
  short: string;
  label: string;
};

/** Stage 0 is orientation; stages 1–8 are the guided content. */
const STAGES: Stage[] = [
  { id: "start", short: "Start", label: "Start Here" },
  { id: "decide", short: "Decide", label: "Should You Switch?" },
  { id: "compare", short: "Compare", label: "Tirz vs. Reta" },
  { id: "roadmap", short: "Roadmap", label: "The Roadmap" },
  { id: "expect", short: "Expect", label: "What to Expect" },
  { id: "protect", short: "Protect", label: "Protect Results" },
  { id: "measure", short: "Measure", label: "Is It Working?" },
  { id: "redflags", short: "Watch", label: "Red Flags" },
  { id: "checklist", short: "Checklist", label: "Your Checklist" },
];

/* ============================================================
 * Small icons (inline, no dependencies)
 * ============================================================ */

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function IconChevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function IconArrowLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5M11 19l-7-7 7-7" />
    </svg>
  );
}

function IconAlert({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconInfo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconWhistle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 4v4M6 12H4M8.5 6.5 7 5M18 10a6 6 0 1 1-8.49 5.49L4 14v-2h8a6 6 0 0 1 6-2z" />
    </svg>
  );
}

/* ============================================================
 * Persistence hooks
 * ============================================================ */

const EMPTY_SET: ReadonlySet<string> = new Set();
/** Fires (same-tab) whenever guide progress is written or reset. */
const STORE_EVENT = "tg:store-changed";

function writeSet(key: string, set: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(Array.from(set)),
    );
  } catch {
    /* storage unavailable — degrade to session-only */
  }
  window.dispatchEvent(new Event(STORE_EVENT));
}

/**
 * A localStorage-backed set of string ids, exposed through
 * `useSyncExternalStore` so it hydrates safely (server + first client render
 * both see an empty set) and re-renders whenever the underlying value changes
 * — including a global reset — without cascading effects.
 */
function usePersistentSet(key: string) {
  const fullKey = STORAGE_PREFIX + key;
  // Cache the parsed Set keyed on its raw string so getSnapshot returns a
  // stable reference between renders (required by useSyncExternalStore).
  const cacheRef = useRef<{ raw: string | null; set: Set<string> }>({
    raw: null,
    set: new Set(),
  });

  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener(STORE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(STORE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const getSnapshot = useCallback(() => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(fullKey);
    } catch {
      raw = null;
    }
    if (raw !== cacheRef.current.raw) {
      let parsed: string[] = [];
      try {
        const value = raw ? JSON.parse(raw) : [];
        if (Array.isArray(value)) parsed = value;
      } catch {
        parsed = [];
      }
      cacheRef.current = { raw, set: new Set(parsed) };
    }
    return cacheRef.current.set;
  }, [fullKey]);

  const set = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => EMPTY_SET as Set<string>,
  );

  const toggle = useCallback(
    (id: string) => {
      const next = new Set(getSnapshot());
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeSet(key, next);
    },
    [key, getSnapshot],
  );

  return { set, toggle, has: (id: string) => set.has(id) };
}

/** Clears all guide progress and notifies every persistent instance. */
function resetAllProgress() {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(STORE_EVENT));
}

/* ============================================================
 * Scroll progress + active-stage tracking
 * ============================================================ */

function useJourney() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..1 through the page
  const [maxReached, setMaxReached] = useState(0);

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;

      // Continuous progress across the whole document.
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, pct)));

      // Active stage = last section whose top has passed the sticky offset.
      const offset = 170;
      let current = 0;
      for (let i = 0; i < STAGES.length; i++) {
        const el = document.getElementById(STAGES[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = i;
      }
      // Pin the last stage once the page is essentially at the bottom.
      if (scrollable > 0 && window.scrollY >= scrollable - 4) {
        current = STAGES.length - 1;
      }
      setActiveIndex(current);
      setMaxReached((m) => Math.max(m, current));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { activeIndex, progress, maxReached };
}

function scrollToStage(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ============================================================
 * Layout primitives
 * ============================================================ */

function Container({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mx-auto w-full max-w-5xl px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

function Eyebrow({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "onDark";
}) {
  const styles =
    tone === "onDark"
      ? "border-white/20 bg-white/10 text-[var(--accent-light)]"
      : "border-[var(--accent)]/40 bg-[var(--accent)]/15 text-[var(--accent-dark)]";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${styles} px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em]`}
    >
      {children}
    </span>
  );
}

function StageHeader({
  index,
  eyebrow,
  title,
  lede,
}: {
  index: number;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>
        {index > 0 ? (
          <>
            <span className="tabular-nums">STAGE {index}</span>
            <span className="text-[var(--accent-dark)]/50">·</span>
          </>
        ) : null}
        <span>{eyebrow}</span>
      </Eyebrow>
      <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {lede ? (
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-[var(--primary)]/70 sm:text-lg">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-2xl text-pretty text-lg font-medium leading-relaxed text-[var(--primary)] sm:text-xl">
      {children}
    </p>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto max-w-2xl text-pretty text-[15px] leading-relaxed text-[var(--primary)]/80 sm:text-[17px]">
      {children}
    </p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mx-auto max-w-2xl text-center text-2xl font-bold tracking-tight text-[var(--primary)] sm:text-3xl">
      {children}
    </h3>
  );
}

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm sm:p-7 ${className}`}
    >
      {children}
    </div>
  );
}

/* ============================================================
 * Content primitives
 * ============================================================ */

function CheckRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent-dark)]">
        <IconCheck className="h-3 w-3" />
      </span>
      <span className="text-[15px] leading-relaxed text-[var(--primary)]/85 sm:text-base">
        {children}
      </span>
    </li>
  );
}

function CheckColumn({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <CheckRow key={i}>{item}</CheckRow>
      ))}
    </ul>
  );
}

function DotList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-dark)]" />
          <span className="text-[15px] leading-relaxed text-[var(--primary)]/85 sm:text-base">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CoachNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/25 text-[var(--accent)]">
            <IconWhistle className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              Coach&rsquo;s Note
            </p>
            <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-white/90 sm:text-base">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Callout({
  title,
  icon,
  tone = "muted",
  children,
}: {
  title?: string;
  icon?: React.ReactNode;
  tone?: "muted" | "accent";
  children: React.ReactNode;
}) {
  const styles =
    tone === "accent"
      ? "border-[var(--accent)]/30 bg-[var(--accent)]/10"
      : "border-[var(--border)] bg-[var(--muted)]/70";
  return (
    <div className={`mx-auto max-w-3xl rounded-3xl border p-6 sm:p-7 ${styles}`}>
      {title ? (
        <div className="mb-3 flex items-center gap-2.5">
          {icon ? (
            <span className="text-[var(--accent-dark)]">{icon}</span>
          ) : null}
          <h4 className="text-base font-bold text-[var(--primary)]">{title}</h4>
        </div>
      ) : null}
      <div className="space-y-3 text-[15px] leading-relaxed text-[var(--primary)]/80 sm:text-base">
        {children}
      </div>
    </div>
  );
}

/** Progressive disclosure — accessible, keyboard-operable. */
function LearnWhy({
  label = "Learn why",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const btnId = useId();
  return (
    <div className="mx-auto max-w-2xl">
      <button
        id={btnId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-dark)]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent-dark)]">
          <IconInfo className="h-3.5 w-3.5" />
        </span>
        {open ? "Hide explanation" : label}
        <IconChevron
          className={`h-4 w-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/60 p-5 text-[15px] leading-relaxed text-[var(--primary)]/80">
            <div className="space-y-2.5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Checklist (persisted)
 * ============================================================ */

type ChecklistItem = { id: string; label: string };

function Checklist({
  storageKey,
  title,
  items,
  icon,
}: {
  storageKey: string;
  title?: string;
  items: ChecklistItem[];
  icon?: React.ReactNode;
}) {
  const { has, toggle } = usePersistentSet(storageKey);
  const done = items.filter((i) => has(i.id)).length;
  const total = items.length;
  const complete = done === total;

  return (
    <Card className="!p-0 overflow-hidden">
      {title ? (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {icon ? (
              <span className="text-[var(--accent-dark)]">{icon}</span>
            ) : null}
            <h4 className="text-base font-bold text-[var(--primary)]">
              {title}
            </h4>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums transition-colors ${
              complete
                ? "bg-[var(--accent)]/20 text-[var(--accent-dark)]"
                : "bg-[var(--muted-dark)] text-[var(--primary)]/70"
            }`}
          >
            {complete ? <IconCheck className="h-3 w-3" /> : null}
            {done}/{total}
          </span>
        </div>
      ) : null}
      <ul className="divide-y divide-[var(--border)]">
        {items.map((item) => {
          const checked = has(item.id);
          return (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3.5 px-6 py-4 transition-colors hover:bg-[var(--muted)]/40">
                <span className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(item.id)}
                    className="peer sr-only"
                  />
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[var(--border)] bg-white text-transparent transition-all peer-checked:border-[var(--accent-dark)] peer-checked:bg-[var(--accent-dark)] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent-dark)]"
                    aria-hidden="true"
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span
                  className={`text-[15px] leading-relaxed transition-colors sm:text-base ${
                    checked
                      ? "text-[var(--primary)]/45 line-through decoration-[var(--accent-dark)]/40"
                      : "text-[var(--primary)]/85"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ============================================================
 * Stage footer — Back / Continue controls
 * ============================================================ */

function StageNav({ index }: { index: number }) {
  const prev = index > 0 ? STAGES[index - 1] : null;
  const next = index < STAGES.length - 1 ? STAGES[index + 1] : null;
  return (
    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 pt-4">
      {prev ? (
        <button
          type="button"
          onClick={() => scrollToStage(prev.id)}
          className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary)]/80 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-dark)]"
        >
          <IconArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back:</span> {prev.short}
        </button>
      ) : (
        <span />
      )}
      {next ? (
        <button
          type="button"
          onClick={() => scrollToStage(next.id)}
          className="btn-primary inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          <span className="hidden sm:inline">Continue:</span> {next.label}
          <IconArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

/** Vertical rhythm wrapper for the content inside a stage. */
function StageBody({ children }: { children: React.ReactNode }) {
  return <div className="mt-12 space-y-8 sm:mt-14">{children}</div>;
}

/* ============================================================
 * Sticky header + progress rail + stage nav
 * ============================================================ */

function GuideHeader() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--border)]">
      <Container className="!max-w-6xl">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-lg font-bold">
            <img
              src="/logo.png"
              alt="Peak State Labs"
              className="h-7 w-7 rounded-lg"
              width={28}
              height={28}
            />
            <span className="hidden sm:inline">Peak State Labs</span>
          </a>
          <span className="rounded-full border border-[var(--border)] bg-[var(--muted)]/70 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]/70">
            Transition Guide
          </span>
        </div>
      </Container>
    </header>
  );
}

function ProgressRail({
  activeIndex,
  progress,
  maxReached,
}: {
  activeIndex: number;
  progress: number;
  maxReached: number;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keep the active pill in view within the horizontal scroller.
  useEffect(() => {
    const el = pillRefs.current[activeIndex];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      {/* Continuous progress bar */}
      <div
        className="h-1 w-full bg-[var(--muted-dark)]"
        role="progressbar"
        aria-label="Guide progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full rounded-r-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] transition-[width] duration-150 ease-out"
          style={{ width: `${Math.max(2, progress * 100)}%` }}
        />
      </div>

      <Container className="!max-w-6xl">
        <div className="flex items-center gap-3 py-2.5">
          <span className="hidden flex-shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50 md:inline">
            Step{" "}
            <span className="tabular-nums text-[var(--accent-dark)]">
              {activeIndex + 1}
            </span>
            /{STAGES.length}
          </span>
          <nav
            aria-label="Guide stages"
            ref={railRef}
            className="scrollbar-hide -mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1"
          >
            {STAGES.map((stage, i) => {
              const isActive = i === activeIndex;
              const isDone = i < maxReached || (i < activeIndex);
              return (
                <button
                  key={stage.id}
                  ref={(el) => {
                    pillRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => scrollToStage(stage.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`inline-flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-dark)] ${
                    isActive
                      ? "border-[var(--accent-dark)] bg-[var(--accent-dark)] text-white shadow-sm"
                      : "border-[var(--border)] bg-[var(--muted)]/60 text-[var(--primary)]/75 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/10 hover:text-[var(--primary)]"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] tabular-nums ${
                      isActive
                        ? "bg-white/25 text-white"
                        : isDone
                          ? "bg-[var(--accent)]/25 text-[var(--accent-dark)]"
                          : "bg-white text-[var(--primary)]/50"
                    }`}
                  >
                    {isDone && !isActive ? (
                      <IconCheck className="h-2.5 w-2.5" />
                    ) : (
                      i
                    )}
                  </span>
                  {stage.short}
                </button>
              );
            })}
          </nav>
        </div>
      </Container>
    </div>
  );
}

/* ============================================================
 * STAGE 0 — Start Here (hero + orientation)
 * ============================================================ */

function StartStage() {
  const answers = [
    { q: "Where am I in the process?", a: "A roadmap that shows every stage at a glance." },
    { q: "What do I need to know now?", a: "The one thing that matters at each step — nothing extra." },
    { q: "What should I do next?", a: "Clear, single actions instead of long theory." },
    { q: "What should I watch for?", a: "The signals worth monitoring, and the ones worth ignoring." },
  ];
  return (
    <section id="start" className="scroll-mt-36">
      <div className="relative overflow-hidden gradient-hero pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute left-[-10%] top-1/2 h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
              The Transition Guide
            </Eyebrow>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Tirzepatide{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span>{" "}
              Retatrutide
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg font-semibold text-[var(--primary)]/80 sm:text-xl">
              How to switch with confidence.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--primary)]/70 sm:text-lg">
              You&rsquo;ve decided to make the switch. This guide walks you
              through it one stage at a time — so the process stays controlled,
              measurable, and calm from your last Tirzepatide dose to your first
              weeks on Retatrutide.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => scrollToStage("decide")}
                className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold text-white"
              >
                Start the guide
                <IconArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToStage("roadmap")}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-white px-6 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
              >
                Jump to the roadmap
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative -mt-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {answers.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <p className="flex items-center gap-2 font-bold text-[var(--primary)]">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent-dark)]">
                    <IconCheck className="h-3.5 w-3.5" />
                  </span>
                  {item.q}
                </p>
                <p className="mt-2 pl-8 text-sm leading-relaxed text-[var(--primary)]/70">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Callout
              tone="accent"
              title="How this guide works"
              icon={<IconInfo className="h-5 w-5" />}
            >
              <ul className="space-y-2.5">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent-dark)]">
                    1
                  </span>
                  <span>
                    <strong className="text-[var(--primary)]">
                      Follow the progress bar.
                    </strong>{" "}
                    The rail at the top always shows where you are and what&rsquo;s
                    next.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent-dark)]">
                    2
                  </span>
                  <span>
                    <strong className="text-[var(--primary)]">
                      Expand &ldquo;Learn why&rdquo;
                    </strong>{" "}
                    only when you want the deeper reasoning. The default view is
                    the part you actually need.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent-dark)]">
                    3
                  </span>
                  <span>
                    <strong className="text-[var(--primary)]">
                      Tick your checklists.
                    </strong>{" "}
                    Your progress saves on this device, so you can close the tab
                    and pick up where you left off.
                  </span>
                </li>
              </ul>
            </Callout>
          </div>

          <div className="mt-10">
            <StageNav index={0} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 1 — Should You Switch?
 * ============================================================ */

function DecideStage() {
  const goodReasons = [
    "Meaningful progress has stalled despite consistent execution.",
    "Hunger or food preoccupation has returned enough to interfere with your plan.",
    "Tirzepatide side effects make your current approach hard to sustain.",
    "Your response is still inadequate after the program has been properly reviewed.",
    "A qualified healthcare professional believes another strategy should be considered.",
  ];

  const audit = [
    "Have I been consistent with my treatment?",
    "Has my nutrition changed, or my protein dropped?",
    "Has my calorie intake gradually crept up?",
    "Has my daily movement decreased?",
    "Am I still resistance training consistently?",
    "Has my sleep or recovery changed?",
    "Have stress, travel, or other lifestyle factors shifted?",
    "Are side effects interfering with nutrition, hydration, or daily function?",
  ];

  const trend = [
    "Average weekly weight (not a single morning)",
    "Waist measurement",
    "Progress photos or how clothes fit",
    "Nutrition consistency and protein",
    "Training performance and strength",
    "Hunger and food preoccupation",
    "Sleep and recovery",
  ];

  return (
    <section id="decide" className="scroll-mt-36 bg-white py-16 sm:py-24">
      <Container>
        <StageHeader
          index={1}
          eyebrow="Should You Switch?"
          title="Start with the problem, not the compound"
          lede="A transition makes sense when there's a clear reason behind it. Before you change the tool, make sure the tool is actually the problem."
        />

        <StageBody>
          <Lead>
            The first question isn&rsquo;t &ldquo;which compound?&rdquo; It&rsquo;s
            &ldquo;what problem am I actually trying to solve?&rdquo;
          </Lead>
          <Body>
            Over time, you get used to a medication. Appetite control that once
            felt obvious starts to feel normal. That doesn&rsquo;t mean it stopped
            working — and &ldquo;it doesn&rsquo;t feel as dramatic anymore&rdquo;
            isn&rsquo;t a strong reason to switch on its own.
          </Body>

          <SubHeading>Good reasons to consider a switch</SubHeading>
          <div className="mx-auto max-w-3xl">
            <Card>
              <CheckColumn items={goodReasons} />
            </Card>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-4 rounded-3xl border border-[var(--border)] bg-[var(--muted)]/60 p-6 sm:p-7">
              <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/5 text-[var(--primary)]/40 text-xl font-bold">
                &times;
              </span>
              <div>
                <p className="font-bold text-[var(--primary)]">
                  Not a strong reason by itself
                </p>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--primary)]/75">
                  Someone else&rsquo;s results, a viral before-and-after, or the
                  idea that a newer compound must automatically be better.
                  Your decision comes from your evidence — not comparison or
                  impatience.
                </p>
              </div>
            </div>
          </div>

          <SubHeading>First, make sure you&rsquo;re actually plateaued</SubHeading>
          <Body>
            A few slow days — or even a couple of flat weeks — isn&rsquo;t a
            plateau. Water, sodium, glycogen, digestion, training, travel,
            stress, sleep, and hormones all move the scale without touching body
            fat. Look at the trend instead:
          </Body>
          <Callout title="Review the trend, not the number" icon={<IconInfo className="h-5 w-5" />}>
            <DotList items={trend} />
            <p className="pt-1">
              Weight barely moving while your waist shrinks and strength climbs
              is <strong className="text-[var(--primary)]">not</strong> the same
              as nothing changing while everything else stays consistent.
            </p>
          </Callout>

          <SubHeading>Audit the system before changing the compound</SubHeading>
          <Body>
            A smaller body needs less energy, and habits drift as a fat-loss
            phase drags on. What drove progress months ago may not drive it
            today — and that doesn&rsquo;t automatically mean the compound
            failed. Run through these honestly first:
          </Body>
          <div className="mx-auto max-w-3xl">
            <Card className="bg-[var(--muted)]/40">
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {audit.map((q, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--primary)]/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-dark)]" />
                    {q}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <LearnWhy label="Learn why suppression isn't the scorecard">
            <p>
              Strong fullness, food aversion, and nausea are easy to notice — but
              none of them are required to prove a strategy is working. A useful
              response often feels surprisingly normal:
            </p>
            <p>
              Hunger exists but is manageable. Food takes up less mental space.
              Portions are easier. You can hit your protein and follow your plan.
              Training stays productive and your trends move the right way.
              That&rsquo;s a better definition of success than &ldquo;how strongly
              do I feel it?&rdquo;
            </p>
          </LearnWhy>

          <CoachNote>
            <p>
              Don&rsquo;t switch because you miss the feeling of the medication
              working. Switch because the results show your current strategy
              needs to change.
            </p>
          </CoachNote>

          <Callout tone="accent" title="Before you move forward, you should be able to answer:">
            <DotList
              items={[
                "Why am I considering switching?",
                "What objective evidence says my current approach isn't producing the result I need?",
                "Have I reviewed nutrition, training, activity, recovery, and adherence first?",
                "Am I responding to a real problem — or just to how strongly Tirzepatide feels?",
              ]}
            />
            <p className="pt-1 font-semibold text-[var(--primary)]">
              If you can&rsquo;t define the problem, you can&rsquo;t know whether
              switching solved it.
            </p>
          </Callout>

          <StageNav index={1} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 2 — Tirzepatide vs. Retatrutide
 * ============================================================ */

const COMPARE_ROWS: {
  attr: string;
  tirz: string;
  reta: string;
}[] = [
  {
    attr: "Receptor activity",
    tirz: "GIP + GLP-1",
    reta: "GIP + GLP-1 + glucagon",
  },
  {
    attr: "Current status",
    tirz: "FDA-approved for specific indications",
    reta: "Investigational as of August 2026",
  },
  {
    attr: "Clinical evidence",
    tirz: "Large, established phase 3 evidence base",
    reta: "Promising research, but still developing",
  },
  {
    attr: "Prescribing guidance",
    tirz: "Established dosing, warnings, and contraindications",
    reta: "No FDA-approved label or standard customer-use protocol",
  },
  {
    attr: "Long-term data",
    tirz: "More mature safety and real-world data",
    reta: "Long-term safety and maintenance still under study",
  },
  {
    attr: "Product certainty",
    tirz: "Approved products are made under regulated standards",
    reta: "Products outside legitimate research lack the same assurances",
  },
  {
    attr: "How it may feel",
    tirz: "Can produce strong fullness and appetite suppression",
    reta: "May feel different across appetite, GI, energy, or heart rate",
  },
];

function ComparisonModule() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* Column headers */}
      <div className="mb-2 grid grid-cols-[1fr_1fr] gap-3 px-1 sm:grid-cols-[0.9fr_1fr_1fr]">
        <div className="hidden sm:block" />
        <div className="rounded-xl bg-[var(--primary)] px-3 py-2 text-center text-sm font-bold text-white">
          Tirzepatide
        </div>
        <div className="rounded-xl bg-[var(--accent-dark)] px-3 py-2 text-center text-sm font-bold text-white">
          Retatrutide
        </div>
      </div>

      <div className="space-y-3">
        {COMPARE_ROWS.map((row) => (
          <div
            key={row.attr}
            className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm sm:grid sm:grid-cols-[0.9fr_1fr_1fr] sm:items-center sm:gap-3 sm:p-3"
          >
            <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)] sm:mb-0 sm:px-2 sm:text-xs">
              {row.attr}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <div className="rounded-xl bg-[var(--muted)]/70 p-3 sm:bg-transparent sm:p-2">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]/40 sm:hidden">
                  Tirzepatide
                </p>
                <p className="text-sm leading-snug text-[var(--primary)]/85">
                  {row.tirz}
                </p>
              </div>
              <div className="rounded-xl bg-[var(--accent)]/10 p-3 sm:p-2">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-dark)]/70 sm:hidden">
                  Retatrutide
                </p>
                <p className="text-sm leading-snug text-[var(--primary)]/85">
                  {row.reta}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareStage() {
  const differences = [
    "A different level or pattern of hunger",
    "Different fullness",
    "Different gastrointestinal effects",
    "Different energy or heart-rate effects",
    "A different rate of weight change",
    "More — or less — tolerability than you expected",
  ];
  return (
    <section id="compare" className="scroll-mt-36 bg-[var(--muted)] py-16 sm:py-24">
      <Container>
        <StageHeader
          index={2}
          eyebrow="Tirz vs. Reta"
          title="A different molecule — not a stronger Tirzepatide"
          lede="They overlap, but they're not interchangeable. The clearest way to hold the difference: Tirzepatide comes with more certainty; Retatrutide comes with a different mechanism and more uncertainty."
        />

        <StageBody>
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]/50">
                  Tirzepatide activates
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--primary)]">
                  GIP <span className="text-[var(--primary)]/30">+</span> GLP-1
                </p>
              </div>
              <div className="rounded-3xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-6 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]/70">
                  Retatrutide activates
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--primary)]">
                  GIP <span className="text-[var(--accent-dark)]/40">+</span>{" "}
                  GLP-1{" "}
                  <span className="text-[var(--accent-dark)]/40">+</span>{" "}
                  <span className="text-[var(--accent-dark)]">glucagon</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-center text-[15px] leading-relaxed text-[var(--primary)]/70">
              That third pathway — glucagon — is what makes Retatrutide
              scientifically different. But more receptor activity doesn&rsquo;t
              automatically mean faster fat loss or a better result for you. It
              means a <em>different</em> experience.
            </p>
          </div>

          <SubHeading>The differences that actually matter</SubHeading>
          <ComparisonModule />

          <SubHeading>What you might notice</SubHeading>
          <Body>
            Your Tirzepatide experience doesn&rsquo;t predict how Retatrutide will
            feel. It may be stronger in some ways, weaker in others, or subtler
            than you expect. Possible differences:
          </Body>
          <div className="mx-auto max-w-3xl">
            <Card>
              <DotList items={differences} />
              <p className="mt-4 text-[15px] font-semibold text-[var(--primary)]">
                None of those differences alone prove one compound is better or
                worse for you.
              </p>
            </Card>
          </div>

          <LearnWhy label="Learn why product quality matters more with Reta">
            <p>
              With an FDA-approved product, manufacturing is regulated for
              identity, strength, purity, sterility, and stability. Products
              marketed as Retatrutide outside legitimate clinical research
              don&rsquo;t carry the same assurances.
            </p>
            <p>
              That matters because an unexpected response can have more than one
              explanation — the compound, the amount, administration accuracy,
              storage or degradation, product identity or concentration, your
              individual response, or your nutrition and activity. Unexpected
              results should be investigated, not immediately blamed on your
              metabolism.
            </p>
          </LearnWhy>

          <LearnWhy label="Learn why the evidence gap is real">
            <p>
              Tirzepatide is an established FDA-approved medication with
              standardized prescribing information and a large body of clinical
              and safety evidence. Retatrutide remains investigational as of
              August 2026 — long-term safety, maintenance strategies, comparative
              effectiveness, and optimal escalation are all still being studied.
            </p>
            <p>
              The early research is genuinely impressive. But promising research
              isn&rsquo;t a personal guarantee. Trial averages can&rsquo;t tell
              you how much you&rsquo;ll lose, how fast you&rsquo;ll respond, or
              whether you&rsquo;ll personally do better than you did on
              Tirzepatide.
            </p>
          </LearnWhy>

          <CoachNote>
            <p>
              Don&rsquo;t compare the compounds by which one you feel more
              strongly. Compare them by what happens to your progress, health,
              nutrition, performance, and tolerability over time.
            </p>
          </CoachNote>

          <StageNav index={2} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 3 — The Transition Roadmap (centerpiece)
 * ============================================================ */

const ROADMAP_STEPS: {
  phase: string;
  title: string;
  action: string;
  detail?: string;
  flag?: string;
}[] = [
  {
    phase: "Before the transition",
    title: "Finish Tirzepatide",
    action:
      "Set a clearly defined final dose and injection date. Know your last dose. Know the date. Start there.",
    detail:
      "Don't casually overlap the two to keep momentum going. Both activate GLP-1 and GIP receptors, so stacking them creates overlapping activity with no established benefit.",
  },
  {
    phase: "Before the transition",
    title: "Create appropriate separation",
    action:
      "Let Tirzepatide's effects decline before introducing a compound that shares some of the same receptor activity.",
    flag: "There is no validated universal washout period. Timing is individualized.",
    detail:
      "You may hear suggestions like 2–4 weeks off. The playbook treats that as a practical option seen in individual coaching protocols — not a rule for everyone. Your previous dose, time since your last injection, prior side effects, other medications, and health conditions all shape the right separation for you.",
  },
  {
    phase: "The transition period",
    title: "Keep everything else stable",
    action:
      "Hold protein, calories, hydration, training, movement, and sleep steady. Consistency gives you cleaner feedback.",
    detail:
      "This isn't the time to overhaul your diet, slash calories, add compounds, or experiment with fasting and 'resets.' Some hunger and short-term scale movement after stopping Tirzepatide is normal — don't react by immediately changing the plan.",
  },
  {
    phase: "The transition period",
    title: "Establish your baseline",
    action:
      "Record where you're starting: average weight, waist, hunger, GI symptoms, protein and calories, training, movement, and any health or medication changes.",
    detail:
      "You need enough information to answer one question later: did the transition actually improve things? Without a baseline, normal fluctuation can look like success or failure.",
  },
  {
    phase: "The transition period",
    title: "Address lingering issues",
    action:
      "Resolve or evaluate significant problems from the previous phase before adding a new variable.",
    detail:
      "Pay particular attention to persistent GI symptoms, hydration, bowel function, nutrition, new medical symptoms, and anything affecting glucose regulation. The goal isn't to feel perfect — it's to avoid stacking a new variable on top of signals that need attention.",
  },
  {
    phase: "Introducing Retatrutide",
    title: "Introduce Retatrutide",
    action:
      "Treat it as a brand-new compound, introduced according to your individualized plan.",
    flag: "Don't convert your Tirzepatide dose into a Retatrutide dose. There is no established conversion formula.",
    detail:
      "A milligram of one compound isn't the same biological effect as a milligram of another, and your Tirzepatide experience doesn't tell you exactly how you'll respond. Observe, track, and learn your response.",
  },
  {
    phase: "Early observation",
    title: "Observe the response",
    action:
      "Don't let one injection, one hungry afternoon, or one weigh-in decide your next move. Decide from the trend.",
    detail:
      "Keep it controlled enough that when something changes, you know what changed it. Ongoing evaluation continues well past these first weeks.",
  },
];

const PHASES = [
  "Now",
  "Before the transition",
  "The transition period",
  "Introducing Retatrutide",
  "Early observation",
  "Ongoing evaluation",
];

function RoadmapStage() {
  return (
    <section id="roadmap" className="scroll-mt-36 bg-white py-16 sm:py-24">
      <Container>
        <StageHeader
          index={3}
          eyebrow="The Roadmap"
          title="The transition, one controlled step at a time"
          lede="The cleanest transition changes one major variable at a time. Finish Tirzepatide, create separation, keep everything else stable — then evaluate what actually changes."
        />

        <StageBody>
          {/* Phase band */}
          <div className="mx-auto max-w-4xl">
            <div className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
              {PHASES.map((phase, i) => (
                <div key={phase} className="flex flex-shrink-0 items-center gap-2">
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                      i === 0
                        ? "bg-[var(--primary)] text-white"
                        : "border border-[var(--border)] bg-[var(--muted)]/70 text-[var(--primary)]/70"
                    }`}
                  >
                    {phase}
                  </span>
                  {i < PHASES.length - 1 ? (
                    <span className="text-[var(--accent-dark)]/50">&rarr;</span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical roadmap */}
          <div className="mx-auto max-w-3xl">
            <ol className="relative space-y-4">
              {/* Spine */}
              <span
                className="absolute left-5 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[var(--accent)] via-[var(--accent-dark)] to-[var(--primary)]/30 sm:left-6"
                aria-hidden="true"
              />
              {ROADMAP_STEPS.map((step, i) => (
                <li key={step.title} className="relative pl-14 sm:pl-16">
                  <span
                    className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-sm font-bold text-white shadow-md sm:h-12 sm:w-12 sm:text-base"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                      {step.phase}
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[var(--primary)] sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--primary)]/85 sm:text-base">
                      {step.action}
                    </p>
                    {step.flag ? (
                      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-300/70 bg-amber-50 p-3">
                        <IconAlert className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                        <p className="text-sm font-medium leading-snug text-amber-900">
                          {step.flag}
                        </p>
                      </div>
                    ) : null}
                    {step.detail ? (
                      <LearnWhy label="Learn why">
                        <p>{step.detail}</p>
                      </LearnWhy>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <Callout tone="accent" title="The transition at a glance">
            <p className="text-[15px] leading-relaxed text-[var(--primary)]/85">
              Finish Tirzepatide{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> create
              appropriate separation{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> keep your
              routine stable{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> establish
              your baseline{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> address
              significant lingering issues{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> introduce
              Retatrutide on your individualized plan{" "}
              <span className="text-[var(--accent-dark)]">&rarr;</span> observe the
              response.
            </p>
          </Callout>

          <div className="mx-auto max-w-3xl rounded-2xl border border-amber-300/70 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <IconInfo className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                <strong>There is no universal transition protocol.</strong> Your
                previous dose, tolerance, side effects, health history, other
                medications, and time since your last injection all shape how
                this should be approached. Where timing must be individualized,
                this guide flags it rather than inventing a schedule.
              </p>
            </div>
          </div>

          <StageNav index={3} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 4 — What to Expect
 * ============================================================ */

function ExpectStage() {
  const goodResponse = [
    "Hunger is manageable",
    "Portions are easier to control",
    "Nutrition stays on track",
    "Training remains productive",
    "Weight and waist trend the right way",
    "Side effects stay tolerable",
    "Daily life feels normal",
  ];
  const myths = [
    {
      myth: "“It's not working.”",
      truth: "The first injection isn't the verdict. Neither is the first week.",
    },
    {
      myth: "“I need more.”",
      truth: "One hungry day doesn't mean the dose is wrong.",
    },
    {
      myth: "“Tirzepatide was better.”",
      truth: "A subtler experience isn't proof of a worse result.",
    },
    {
      myth: "“This is way stronger.”",
      truth: "One dramatic day doesn't set the trend either.",
    },
  ];
  return (
    <section id="expect" className="scroll-mt-36 bg-[var(--muted)] py-16 sm:py-24">
      <Container>
        <StageHeader
          index={4}
          eyebrow="What to Expect"
          title="Judge the response by what it produces"
          lede="The transition may not feel the way you expect — and the biggest mistake is deciding too quickly that every difference means something is wrong."
        />

        <StageBody>
          <SubHeading>What a good response actually looks like</SubHeading>
          <Body>
            Complete appetite suppression isn&rsquo;t the target — it can make
            protein, nutrition, training, and recovery harder to maintain.
            Manageable hunger is enough. A productive response usually looks
            calm:
          </Body>
          <div className="mx-auto max-w-3xl">
            <Card>
              <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {goodResponse.map((item, i) => (
                  <CheckRow key={i}>{item}</CheckRow>
                ))}
              </div>
              <p className="mt-5 border-t border-[var(--border)] pt-4 text-center text-lg font-bold text-[var(--primary)]">
                Effective. Tolerable. Sustainable.
              </p>
              <p className="mt-1 text-center text-sm text-[var(--primary)]/60">
                That&rsquo;s the standard. Nausea and food aversion are not proof
                a compound is working better.
              </p>
            </Card>
          </div>

          <SubHeading>Expect the scale to move — and don&rsquo;t react</SubHeading>
          <Body>
            Food intake, glycogen, water, sodium, digestion, constipation,
            training, travel, hydration, and hormones all move the scale without
            changing body fat. Don&rsquo;t let one weigh-in change the plan — use
            weekly trends and waist measurements to see what&rsquo;s really
            happening.
          </Body>

          <SubHeading>Give it time before you conclude anything</SubHeading>
          <Body>
            Your response develops over time, and one isolated day can&rsquo;t
            tell you what the trend will become. Watch for these snap judgments:
          </Body>
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
            {myths.map((m) => (
              <div
                key={m.myth}
                className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-[var(--primary)]/50 line-through decoration-[var(--primary)]/20">
                  {m.myth}
                </p>
                <p className="mt-2 flex items-start gap-2 text-[15px] leading-relaxed text-[var(--primary)]/85">
                  <IconArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[var(--accent-dark)]" />
                  {m.truth}
                </p>
              </div>
            ))}
          </div>

          <CoachNote>
            <p>
              Judge the response by what it produces — not by how dramatic it
              feels.
            </p>
          </CoachNote>

          <StageNav index={4} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 5 — Protect Your Results
 * ============================================================ */

function ProtectStage() {
  const anchors = [
    {
      title: "Prioritize protein",
      body: "When appetite drops, protein quietly falls with it. Don't let 'I'm not hungry' become the reason your nutrition falls apart. Build meals around protein first.",
    },
    {
      title: "Keep the deficit appropriate",
      body: "Faster isn't automatically better. Over-restricting because your appetite allows it makes it harder to hit protein, train, recover, and hold onto muscle.",
    },
    {
      title: "Keep lifting",
      body: "Resistance training is your anchor. Keep it consistent and watch strength, quality, recovery, energy, and soreness. You don't need to train more — just give your body a reason to keep the muscle.",
    },
    {
      title: "Keep moving",
      body: "Fat loss can quietly reduce your daily movement without you noticing. Keep it reasonably consistent instead of relying on the compound or piling on cardio when progress slows.",
    },
  ];
  return (
    <section id="protect" className="scroll-mt-36 bg-white py-16 sm:py-24">
      <Container>
        <StageHeader
          index={5}
          eyebrow="Protect Results"
          title="The compound makes fat loss easier — not automatic"
          lede="It can't protect the quality of your results by itself. If you want to lose fat while keeping lean mass, strength, and performance, the fundamentals still matter."
        />

        <StageBody>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {anchors.map((a, i) => (
              <div
                key={a.title}
                className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-lg font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-[var(--primary)]">
                    {a.title}
                  </h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--primary)]/75">
                  {a.body}
                </p>
              </div>
            ))}
          </div>

          <Callout title="Support the basics" icon={<IconCheck className="h-5 w-5" />}>
            <p className="text-[15px] text-[var(--primary)]/75">
              These aren&rsquo;t extras — they shape how well you train, recover,
              manage side effects, and hold your habits together:
            </p>
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <DotList items={["Hydration", "Nutrient-dense foods you tolerate", "Adequate sleep"]} />
              <DotList items={["Recovery", "Consistent nutrition", "Sustainable daily activity"]} />
            </div>
          </Callout>

          <CoachNote>
            <p>
              Use the compound to make the fundamentals easier to execute — not
              to make them optional.
            </p>
            <p>
              The goal isn&rsquo;t simply to weigh less. It&rsquo;s to build a
              result worth keeping.
            </p>
          </CoachNote>

          <StageNav index={5} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 6 — Is It Working?
 * ============================================================ */

function MeasureStage() {
  const scorecard = [
    {
      title: "Body Composition",
      items: [
        "Weekly average body weight",
        "Waist circumference",
        "Progress photos when useful",
      ],
      note: "Individual weigh-ins fluctuate. Weekly trends show what's actually happening.",
    },
    {
      title: "Appetite",
      items: [
        "Hunger",
        "Food preoccupation",
        "Portion control",
        "Ability to follow your plan",
      ],
      note: "Hunger doesn't need to disappear. If you can eat appropriately and stay consistent, appetite control is doing its job.",
    },
    {
      title: "Nutrition + Performance",
      items: [
        "Protein and calorie intake",
        "Hydration",
        "Strength and training quality",
        "Recovery and daily movement",
      ],
      note: "Losing weight while protein collapses and strength drops is different from losing fat while performance holds.",
    },
    {
      title: "Tolerability",
      items: [
        "Nausea or vomiting",
        "Constipation or abdominal discomfort",
        "Food tolerance",
        "Heart-rate changes and energy",
      ],
      note: "Side effects are part of the evaluation — not proof the compound is working.",
    },
  ];
  const slowSteps = [
    {
      t: "Look at the trend",
      b: "Has progress actually stalled, or are you reacting to a few days?",
    },
    {
      t: "Check execution",
      b: "Calories, protein, movement, training, sleep, hydration, and administration consistency.",
    },
    {
      t: "Check tolerability",
      b: "Constipation, GI symptoms, poor hydration, or low intake can change how you feel and what the scale shows.",
    },
    {
      t: "Look for outside variables",
      b: "Travel, stress, other medications, illness, hormonal changes, or medical factors.",
    },
  ];
  return (
    <section id="measure" className="scroll-mt-36 bg-[var(--muted)] py-16 sm:py-24">
      <Container>
        <StageHeader
          index={6}
          eyebrow="Is It Working?"
          title="Track enough to see the trend"
          lede="Don't evaluate Retatrutide by one number or one sensation. A small set of signals tells you whether the overall strategy is producing the result you want."
        />

        <StageBody>
          <SubHeading>Your progress scorecard</SubHeading>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {scorecard.map((cat) => (
              <div
                key={cat.title}
                className="flex flex-col rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-[var(--primary)]">
                  {cat.title}
                </h3>
                <ul className="mt-4 flex-1 space-y-2">
                  {cat.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--primary)]/80"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-dark)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-[var(--border)] pt-3 text-sm leading-relaxed text-[var(--primary)]/60">
                  {cat.note}
                </p>
              </div>
            ))}
          </div>

          <SubHeading>When progress slows, review the system first</SubHeading>
          <Body>
            Don&rsquo;t immediately assume you need more medication. Increasing
            the dose can increase side effects without a proportional improvement
            in results. Work through this order first:
          </Body>
          <div className="mx-auto max-w-3xl space-y-3">
            {slowSteps.map((s, i) => (
              <div
                key={s.t}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-sm font-bold text-[var(--accent-dark)]">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-[var(--primary)]">{s.t}</p>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-[var(--primary)]/75">
                    {s.b}
                  </p>
                </div>
              </div>
            ))}
            <p className="pt-1 text-center text-[15px] font-semibold text-[var(--primary)]">
              Then — and only then — reassess the strategy.
            </p>
          </div>

          <CoachNote>
            <p>Don&rsquo;t solve a problem until you&rsquo;ve confirmed what it is.</p>
            <p className="text-white/80">
              A slow week doesn&rsquo;t mean the compound stopped working. More
              hunger doesn&rsquo;t mean you need more. A higher weigh-in
              doesn&rsquo;t mean you gained fat. A less dramatic experience
              doesn&rsquo;t mean worse results.
            </p>
          </CoachNote>

          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-7 text-center text-white shadow-xl sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              The standard
            </p>
            <p className="mx-auto mt-3 max-w-lg text-lg font-semibold leading-relaxed">
              Progress moving the right way. Hunger manageable. Nutrition
              adequate. Training productive. Side effects tolerable. The plan
              sustainable.
            </p>
            <p className="mt-4 text-sm text-white/75">
              If those signals align, you don&rsquo;t need the compound to feel
              dramatic. You need it to keep helping you produce the result.
            </p>
          </div>

          <StageNav index={6} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 7 — Red Flags + Common Mistakes
 * ============================================================ */

const MISTAKES: { title: string; fix: string }[] = [
  {
    title: "Overlapping the two compounds",
    fix: "Both share GLP-1 and GIP activity. No protocol shows a benefit from casually stacking them.",
  },
  {
    title: "Copying someone else's washout",
    fix: "No universal timeline accounts for every dose, history, tolerance, medication, and condition.",
  },
  {
    title: "Matching milligrams",
    fix: "They aren't dose-equivalent. Your Tirzepatide dose shouldn't just become your Reta dose.",
  },
  {
    title: "Starting aggressively because you're experienced",
    fix: "Tolerating Tirzepatide well doesn't tell you how you'll tolerate Retatrutide.",
  },
  {
    title: "Chasing appetite suppression",
    fix: "The goal is manageable hunger and sustainable progress — not eliminating the desire to eat.",
  },
  {
    title: "Reacting to individual weigh-ins",
    fix: "Water, glycogen, food volume, constipation, and hormones temporarily move the scale.",
  },
  {
    title: "Changing everything at once",
    fix: "Change compound, calories, training, and supplements together and you can't tell what did what.",
  },
  {
    title: "Auto-escalating when progress slows",
    fix: "More medication doesn't guarantee proportionally better results — and may add side effects.",
  },
  {
    title: "Trying to “reset” your body",
    fix: "The playbook doesn't establish fasts, detoxes, cleanses, or extra peptides as part of the transition.",
  },
];

const MEDICAL_FLAGS = [
  "Persistent vomiting",
  "Severe or worsening abdominal pain",
  "Inability to maintain hydration",
  "Significant heart-rate changes or palpitations",
  "Severe constipation",
  "Symptoms concerning for gallbladder problems",
  "Symptoms concerning for pancreatitis",
  "Signs of inadequate nutrition or malnutrition",
  "Hypoglycemia risk with certain diabetes medications",
  "Worsening of an underlying medical condition",
];

function RedFlagsStage() {
  return (
    <section id="redflags" className="scroll-mt-36 bg-white py-16 sm:py-24">
      <Container>
        <StageHeader
          index={7}
          eyebrow="Red Flags"
          title="What to avoid — and when to get help"
          lede="Most transition problems come from reacting too quickly, changing too many variables, or ignoring signals that deserve attention. Keep it simple enough to tell what's working."
        />

        <StageBody>
          <SubHeading>Common transition mistakes</SubHeading>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {MISTAKES.map((m) => (
              <div
                key={m.title}
                className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/5 text-base font-bold text-[var(--primary)]/40">
                  &times;
                </span>
                <div>
                  <p className="font-bold text-[var(--primary)]">{m.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--primary)]/70">
                    {m.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Medical attention — deliberately distinct caution styling */}
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-amber-300 bg-amber-50">
            <div className="flex items-center gap-3 border-b border-amber-200 bg-amber-100/60 px-6 py-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <IconAlert className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-amber-900">
                When something needs medical attention
              </h3>
            </div>
            <div className="p-6">
              <p className="text-[15px] leading-relaxed text-amber-900/90">
                Not every uncomfortable sensation is an emergency — but some
                symptoms shouldn&rsquo;t be treated as normal transition
                discomfort or something to push through. Seek appropriate medical
                assessment for:
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {MEDICAL_FLAGS.map((flag, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[15px] leading-relaxed text-amber-900"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <CoachNote>
            <p>Good monitoring should make you more informed — not more anxious.</p>
            <p className="text-white/80">
              Know what you can monitor. Know what deserves attention. And when
              something falls outside what you expected, don&rsquo;t try to solve
              every medical question yourself.
            </p>
          </CoachNote>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-bold text-[var(--primary)]">
              Controlled. Measurable. Sustainable.
            </p>
            <p className="mt-2 text-[15px] text-[var(--primary)]/70">
              That&rsquo;s how you keep the transition working for you instead of
              constantly reacting to it.
            </p>
          </div>

          <StageNav index={7} />
        </StageBody>
      </Container>
    </section>
  );
}

/* ============================================================
 * STAGE 8 — Your Checklist
 * ============================================================ */

function ChecklistStage() {
  return (
    <section id="checklist" className="scroll-mt-36 bg-[var(--muted)] py-16 sm:py-24">
      <Container>
        <StageHeader
          index={8}
          eyebrow="Your Checklist"
          title="Your transition checklist"
          lede="Know where you're starting, keep the process controlled, and know what you're watching. Tick these off as you go — your progress saves on this device."
        />

        <StageBody>
          <div className="mx-auto max-w-3xl space-y-5">
            <Checklist
              storageKey="ck-before"
              title="Before the transition"
              icon={<IconArrowRight className="h-5 w-5" />}
              items={[
                { id: "b1", label: "I know my final Tirzepatide dose." },
                { id: "b2", label: "I recorded the date of my final Tirzepatide injection." },
                { id: "b3", label: "I have an individualized transition plan — not someone else's timeline." },
                { id: "b4", label: "I understand the two compounds shouldn't be casually overlapped." },
                { id: "b5", label: "I understand my Tirzepatide dose doesn't convert directly into a Retatrutide dose." },
              ]}
            />
            <Checklist
              storageKey="ck-baseline"
              title="Establish your baseline"
              icon={<IconInfo className="h-5 w-5" />}
              items={[
                { id: "bl1", label: "Weekly average body weight" },
                { id: "bl2", label: "Waist measurement" },
                { id: "bl3", label: "Current hunger and food preoccupation" },
                { id: "bl4", label: "Current GI symptoms and bowel function" },
                { id: "bl5", label: "Protein and calorie intake" },
                { id: "bl6", label: "Training performance and daily movement" },
                { id: "bl7", label: "Relevant medications, conditions, or recent health changes" },
              ]}
            />
            <Checklist
              storageKey="ck-fundamentals"
              title="Keep the fundamentals stable"
              icon={<IconCheck className="h-5 w-5" />}
              items={[
                { id: "f1", label: "Protein and nutrition are consistent." },
                { id: "f2", label: "Hydration is adequate." },
                { id: "f3", label: "Resistance training continues as tolerated." },
                { id: "f4", label: "Daily movement stays reasonably consistent." },
                { id: "f5", label: "Sleep and recovery remain priorities." },
                { id: "f6", label: "I'm avoiding unnecessary changes to diet, training, supplements, or other compounds." },
              ]}
            />
            <Checklist
              storageKey="ck-success"
              title="Know what success looks like"
              icon={<IconCheck className="h-5 w-5" />}
              items={[
                { id: "s1", label: "Weight and/or waist trends are moving the intended direction." },
                { id: "s2", label: "Hunger is manageable." },
                { id: "s3", label: "I can consistently follow my nutrition plan." },
                { id: "s4", label: "I can eat enough protein and nutrients." },
                { id: "s5", label: "Training and recovery remain productive." },
                { id: "s6", label: "Side effects are tolerable." },
                { id: "s7", label: "The overall approach feels sustainable." },
              ]}
            />
            <Checklist
              storageKey="ck-attention"
              title="Know what requires attention"
              icon={<IconAlert className="h-5 w-5" />}
              items={[
                { id: "a1", label: "I know which side effects I can reasonably monitor." },
                { id: "a2", label: "I know which symptoms require medical assessment." },
                { id: "a3", label: "I won't increase, overlap, or change compounds over one hungry day, weigh-in, or slow week." },
                { id: "a4", label: "I'll evaluate trends instead of chasing stronger sensations." },
              ]}
            />
          </div>

          {/* Peak State Standard close */}
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-8 text-white shadow-xl sm:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
              <div className="relative text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                  The Peak State Standard
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Change deliberately.",
                    "Track what matters.",
                    "Protect the fundamentals.",
                    "Respond to data, not urgency.",
                  ].map((line) => (
                    <div
                      key={line}
                      className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left"
                    >
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/25 text-[var(--accent)]">
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-semibold">{line}</span>
                    </div>
                  ))}
                </div>
                <p className="mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-white/80">
                  The compound is one tool inside the system. Use it that way.
                </p>
              </div>
            </div>
          </div>

          <ResetProgress />
        </StageBody>
      </Container>
    </section>
  );
}

function ResetProgress() {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const t = window.setTimeout(() => setConfirming(false), 4000);
    return () => window.clearTimeout(t);
  }, [confirming]);

  return (
    <div className="mx-auto max-w-3xl text-center">
      {confirming ? (
        <div className="inline-flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-[var(--primary)]/70">
            Clear all ticked items and stage progress on this device?
          </span>
          <button
            type="button"
            onClick={() => {
              resetAllProgress();
              setConfirming(false);
            }}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-light)]"
          >
            Yes, reset
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--primary)]/70 transition-colors hover:bg-[var(--muted)]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="text-sm font-semibold text-[var(--primary)]/50 underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--primary)]"
        >
          Reset my progress
        </button>
      )}
    </div>
  );
}

/* ============================================================
 * Footer
 * ============================================================ */

function GuideFooter() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <Container className="!max-w-6xl py-12">
        <div className="flex flex-col items-center gap-4 border-b border-white/10 pb-8 text-center">
          <a href="/" className="flex items-center gap-2 text-lg font-bold">
            <img
              src="/logo.png"
              alt="Peak State Labs"
              className="h-7 w-7 rounded-lg"
              width={28}
              height={28}
            />
            <span>Peak State Labs</span>
          </a>
          <p className="max-w-xl text-sm text-white/60">
            An educational walkthrough for customers moving from Tirzepatide to
            Retatrutide. Change deliberately. Track what matters. Respond to
            data, not urgency.
          </p>
        </div>
        <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-relaxed text-white/50">
          This guide is provided for educational purposes only and is not
          medical advice. It does not diagnose, treat, cure, or prevent any
          condition, and it does not establish dosing, washout, titration, or
          conversion schedules. Retatrutide is investigational as of August
          2026. Individual circumstances vary — decisions about medications,
          timing, and monitoring should be made with a qualified healthcare
          professional. Products referenced by Peak State Labs are sold for
          laboratory research and educational purposes only and are not for
          human consumption.
        </p>
        <p className="mt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Peak State Labs. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

/* ============================================================
 * Root
 * ============================================================ */

export function TransitionGuide() {
  const { activeIndex, progress, maxReached } = useJourney();

  // Skip-link target id, memoized to keep referential stability.
  const mainId = useMemo(() => "transition-guide-main", []);

  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <a
        href={`#${mainId}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to guide
      </a>

      <GuideHeader />
      <ProgressRail
        activeIndex={activeIndex}
        progress={progress}
        maxReached={maxReached}
      />

      <main id={mainId}>
        <StartStage />
        <DecideStage />
        <CompareStage />
        <RoadmapStage />
        <ExpectStage />
        <ProtectStage />
        <MeasureStage />
        <RedFlagsStage />
        <ChecklistStage />
      </main>

      <GuideFooter />
    </div>
  );
}
