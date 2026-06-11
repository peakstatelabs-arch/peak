"use client";

import { useState } from "react";

export function ProteinCalculator() {
  const [weight, setWeight] = useState(180);

  const low = Math.round(weight * 0.8);
  const high = Math.round(weight * 1.0);

  return (
    <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-6 sm:p-8">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Input */}
        <div>
          <label
            htmlFor="goal-weight"
            className="block text-sm font-bold text-[var(--primary)] uppercase tracking-wider"
          >
            Your Goal Weight
          </label>
          <p className="mt-1 text-sm text-[var(--primary)]/60">
            Enter the weight you&rsquo;re working toward.
          </p>

          <div className="mt-5 flex items-end gap-3">
            <input
              id="goal-weight"
              type="number"
              min={80}
              max={400}
              value={weight}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (!Number.isNaN(v)) setWeight(Math.max(80, Math.min(400, v)));
              }}
              className="w-32 h-14 rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 text-2xl font-bold text-[var(--primary)] outline-none transition-colors focus:border-[var(--accent)] focus:bg-white tabular-nums"
            />
            <span className="text-base font-semibold text-[var(--primary)]/70 pb-3">
              lbs
            </span>
          </div>

          <input
            type="range"
            min={100}
            max={300}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-6 w-full"
            aria-label="Goal weight slider"
          />
          <div className="mt-2 flex justify-between text-xs text-[var(--primary)]/50 font-medium">
            <span>100 lbs</span>
            <span>300 lbs</span>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--accent)]/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              Your Daily Protein Range
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold tabular-nums">
                {low}
              </span>
              <span className="text-2xl font-bold text-white/70">–</span>
              <span className="text-4xl sm:text-5xl font-extrabold tabular-nums">
                {high}
              </span>
              <span className="text-lg font-semibold text-white/85 ml-1">
                g
              </span>
            </div>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Aim to hit this range most days. Consistency matters more than
              perfection — you don&rsquo;t need to hit it exactly every day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
