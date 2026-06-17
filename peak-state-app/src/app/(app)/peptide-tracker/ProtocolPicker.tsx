"use client";

export type PickerChoice =
  | "power-cut-foundation"
  | "power-cut-performance"
  | "single-reta"
  | "single-cjc"
  | "single-bpc"
  | "single-ghk";

type Option = {
  choice: PickerChoice;
  label: string;
  blurb: string;
  badge?: string;
  recommended?: boolean;
};

const OPTIONS: Option[] = [
  {
    choice: "power-cut-foundation",
    label: "POWER CUT™ — Foundation",
    blurb: "Full system: Reta + CJC + BPC (2× weekly). Simplicity and consistency.",
    badge: "Multi-peptide protocol",
    recommended: true,
  },
  {
    choice: "power-cut-performance",
    label: "POWER CUT™ — Performance",
    blurb: "Full system: Reta + CJC + BPC (3× weekly). Maximum recovery signaling.",
    badge: "Multi-peptide protocol",
  },
  {
    choice: "single-reta",
    label: "Retatrutide",
    blurb: "Weekly Monday morning. Configure dose and titration manually.",
    badge: "Single vial",
  },
  {
    choice: "single-cjc",
    label: "CJC-1295 + Ipamorelin",
    blurb: "Mon–Fri evening, fasted. Configure dose manually.",
    badge: "Single vial",
  },
  {
    choice: "single-bpc",
    label: "BPC-157 + TB-500",
    blurb: "2× or 3× weekly. Configure dose and schedule manually.",
    badge: "Single vial",
  },
  {
    choice: "single-ghk",
    label: "GHK-Cu",
    blurb: "Daily or 3–5× weekly, evening before bed.",
    badge: "Single vial",
  },
];

export function ProtocolPicker({
  onPick,
  onCancel,
}: {
  onPick: (choice: PickerChoice) => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Choose a protocol</h2>
        <button onClick={onCancel} className="btn-ghost text-sm">← Back</button>
      </div>
      <p className="text-sm text-fg-muted">
        Stack as many single-vial protocols as you want — they run in parallel.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {OPTIONS.map((o) => (
          <button
            key={o.choice}
            onClick={() => onPick(o.choice)}
            className={`card text-left hover:border-accent/50 transition group ${
              o.recommended ? "border-accent/40 bg-accent/5" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              {o.badge && <span className="chip">{o.badge}</span>}
              {o.recommended && <span className="chip-accent">Recommended</span>}
            </div>
            <h3 className="font-display text-lg font-semibold">{o.label}</h3>
            <p className="text-sm text-fg-muted mt-1">{o.blurb}</p>
            <div className="mt-3 text-xs text-accent font-medium group-hover:underline">
              Configure →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
