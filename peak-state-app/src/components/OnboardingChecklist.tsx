"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type ChecklistData = {
  remindersEnabled: boolean;
  goalWeightSet: boolean;
  metabolicQuizDone: boolean;
  nutritionTargetsSet: boolean;
  firstDoseLogged: boolean;
  firstCheckinDone: boolean;
};

type Item = {
  key: string;
  done: boolean;
  label: string;
  href: string;
  ctaIfDone?: string;
  ctaIfPending?: string;
};

export function OnboardingChecklist({ data }: { data: ChecklistData }) {
  const [pwaInstalled, setPwaInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari exposes a non-standard flag
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setPwaInstalled(Boolean(isStandalone));
  }, []);

  // Wait for client-side check to know about PWA before deciding to render
  if (pwaInstalled === null) return null;

  const items: Item[] = [
    {
      key: "pwa",
      done: pwaInstalled,
      label: "Install the app on your phone",
      href: "/profile",
      ctaIfPending: "How",
    },
    {
      key: "reminders",
      done: data.remindersEnabled,
      label: "Turn on dose reminders",
      href: "/peptide-tracker",
    },
    {
      key: "goal",
      done: data.goalWeightSet,
      label: "Set your goal weight",
      href: "/profile",
    },
    {
      key: "metabolic",
      done: data.metabolicQuizDone,
      label: "Take the metabolic type quiz",
      href: "/nutrition",
    },
    {
      key: "targets",
      done: data.nutritionTargetsSet,
      label: "Dial in your nutrition targets",
      href: "/nutrition",
    },
    {
      key: "dose",
      done: data.firstDoseLogged,
      label: "Log your first dose",
      href: "/peptide-tracker",
    },
    {
      key: "checkin",
      done: data.firstCheckinDone,
      label: "Submit your first weekly check-in",
      href: "/check-in",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const total = items.length;

  // Auto-hide once everything's complete
  if (doneCount === total) return null;

  const pct = Math.round((doneCount / total) * 100);

  return (
    <section className="card bg-gradient-to-br from-accent/15 via-bg-card to-bg-card border-accent/30 mb-6">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wide text-accent font-semibold">
            Get started
          </div>
          <h3 className="font-display font-semibold text-lg mt-0.5">Your first 7 steps</h3>
          <p className="text-sm text-fg-muted mt-1">
            Complete these once and the rest of the portal just works.
          </p>
        </div>
        <span className="chip-accent text-xs flex-shrink-0 tabular-nums">
          {doneCount}/{total}
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden mb-4">
        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className={
                "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors " +
                (item.done
                  ? "text-fg-subtle hover:bg-bg-elev/40"
                  : "text-fg hover:bg-bg-elev/40")
              }
            >
              <CheckCircle done={item.done} />
              <span className={item.done ? "line-through" : ""}>{item.label}</span>
              {!item.done && (
                <span className="ml-auto text-xs text-accent">{item.ctaIfPending ?? "Go →"}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CheckCircle({ done }: { done: boolean }) {
  return done ? (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-accent">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="m7.5 12.5 3 3 6-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0 text-fg-subtle">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
