"use client";

import Link from "next/link";

const RETA = "Retatrutide";

type Protocol = {
  peptide_name: string;
  active: boolean;
};

export function RetaDoseCard({
  protocols,
}: {
  protocols: Protocol[];
}) {
  const hasReta = protocols.some((p) => p.active && p.peptide_name === RETA);
  if (!hasReta) return null;

  return (
    <Link
      href="/peptide-tracker/reta-schedule"
      className="card flex items-center justify-between gap-3 hover:border-accent/40 transition group"
    >
      <div>
        <h2 className="font-semibold">Retatrutide schedule</h2>
        <p className="text-xs text-fg-muted mt-0.5">
          Edit any week's dose.
        </p>
      </div>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-fg-muted group-hover:text-accent transition shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}
