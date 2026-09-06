"use client";

import { useState } from "react";

type ProductKey = "stack" | "singles";

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const PRODUCTS: Record<
  ProductKey,
  {
    buttonLabel: string;
    inBox: string;
    steps: { title: string; body: string }[];
  }
> = {
  stack: {
    buttonLabel: "I got the POWER CUT™ Stack",
    inBox:
      "Your complete POWER CUT™ set of research vials, sealed and ready for storage.",
    steps: [
      {
        title: "Refrigerate everything right away",
        body: "Place all of your vials in the fridge. Keep them sealed and away from light and heat until you're ready to begin.",
      },
      {
        title: "Keep your vials organized",
        body: "Your Stack contains several vials. Keep them together and labeled so you always know what you're looking at.",
      },
      {
        title: "Join the community for your full protocol",
        body: "The complete, step-by-step 10-week POWER CUT™ protocol lives inside our customer community. That's where you'll find everything you need to run the Stack with confidence.",
      },
    ],
  },
  singles: {
    buttonLabel: "I ordered individual vials",
    inBox:
      "Your individual research vials, sealed and ready for storage. You may have one or several — whether they're the same vial or a mix, the steps below apply to all of them.",
    steps: [
      {
        title: "Refrigerate them right away",
        body: "Place your vial (or vials) in the fridge. Keep them sealed and away from light and heat until you're ready to begin.",
      },
      {
        title: "Keep them labeled",
        body: "If you have more than one, keep your vials together and labeled so you always know which is which.",
      },
      {
        title: "Join the community for the details",
        body: "The detailed guidance for your vials lives inside our customer community — the best place to get specifics and ask questions.",
      },
    ],
  },
};

export function ProductToggle() {
  const [active, setActive] = useState<ProductKey>("stack");
  const product = PRODUCTS[active];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toggle */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        {(Object.keys(PRODUCTS) as ProductKey[]).map((key) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              aria-pressed={isActive}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
                isActive
                  ? "bg-[var(--accent)] text-[var(--primary)] shadow-md"
                  : "bg-[var(--muted)] text-[var(--primary)]/70 border border-[var(--border)] hover:bg-[var(--muted-dark)]"
              }`}
            >
              {isActive && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--accent)]">
                  <CheckIcon className="w-3 h-3" />
                </span>
              )}
              {PRODUCTS[key].buttonLabel}
            </button>
          );
        })}
      </div>

      {/* What's in your box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] shadow-sm mb-6">
        <p className="text-sm font-bold tracking-wider uppercase text-[var(--accent-dark)]">
          What&apos;s in your box
        </p>
        <p className="mt-2 text-lg text-[var(--primary)]/80 leading-relaxed">
          {product.inBox}
        </p>
      </div>

      {/* First steps */}
      <div className="space-y-4">
        {product.steps.map((step, index) => (
          <div
            key={step.title}
            className="p-6 sm:p-8 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover"
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-lg">
                {index + 1}
              </span>
              <div>
                <h3 className="font-bold text-xl text-[var(--primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-[var(--primary)]/80 leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
