"use client";

import { useState } from "react";
import { RetaBundlePicker } from "./RetaBundlePicker";
import { TIERS } from "./retaBundles";

export function RetaBuy() {
  const [selected, setSelected] = useState(2); // default: two-vial (most popular)
  const tier = TIERS.find((t) => t.vials === selected) ?? TIERS[0];

  return (
    <div className="grid lg:grid-cols-2 gap-10 items-start">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
          <span>GET YOURS</span>
        </div>
        <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
          Retatrutide, 20mg
        </h2>
        <p className="mt-4 text-lg text-[var(--primary)]/75 leading-relaxed">
          Lyophilized, lab-tested, and ready to reconstitute. Pick a single vial
          to start, or stock a full cycle so you never pause mid-protocol.
        </p>

        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-6">
          <div className="flex items-center justify-center">
            <img
              src={tier.image}
              alt={`Retatrutide 20mg — ${tier.label} (${tier.vials} vial${
                tier.vials > 1 ? "s" : ""
              })`}
              className="h-56 w-auto object-contain transition-opacity duration-200"
            />
          </div>
          {/* Supply readout tied to the selected image */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-center">
            <svg
              className="w-5 h-5 flex-shrink-0 text-[var(--accent-dark)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold text-[var(--primary)]/80">
              {tier.vials} × 20mg vial{tier.vials > 1 ? "s" : ""} —{" "}
              <span className="font-extrabold text-[var(--accent-dark)]">
                lasts ~{tier.supply}
              </span>
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5">
          {[
            "GLP-1 / GIP / glucagon triple agonist (LY-3437943)",
            "Third-party COA + 99%+ purity, in every box",
            "1-on-1 coaching + custom dosing included",
            "Discreet, tracked shipping within 24 hrs",
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-[var(--primary)]/80"
            >
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent-dark)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:sticky lg:top-24">
        <RetaBundlePicker selected={selected} onSelect={setSelected} />
        <p className="mt-4 flex items-start justify-center gap-1.5 text-center text-xs text-[var(--primary)]/55 leading-relaxed">
          <svg
            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--primary)]/45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Backed by our satisfaction guarantee — reship or refund if
          anything&rsquo;s wrong. Secure checkout via Stripe.
        </p>
      </div>
    </div>
  );
}
