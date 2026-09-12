"use client";

import { useState } from "react";
import { RetaBundlePicker } from "./RetaBundlePicker";
import { TIERS } from "./retaBundles";
import { CrossSellStrip } from "@/app/singles/cart/CrossSellStrip";
import { BUYBOX_CROSSSELL_SLUGS } from "@/app/singles/cart/crossSell";

const BULLETS = [
  "GLP-1 / GIP / glucagon triple agonist (LY-3437943)",
  "Third-party COA + 99%+ purity, in every box",
  "1-on-1 coaching + custom dosing included",
  "Discreet, tracked shipping within 24 hrs",
];

export function RetaBuy() {
  const [selected, setSelected] = useState(2); // default: two-vial (most popular)
  const tier = TIERS.find((t) => t.vials === selected) ?? TIERS[0];

  return (
    // Mobile order: heading → picker/CTA → image → bullets, so the offer is
    // visible without scrolling past the image. Desktop: two columns, with the
    // picker as a sticky right rail beside the heading + media.
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
      {/* Heading */}
      <div className="order-1 lg:col-start-1 lg:row-start-1">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
          <span>GET YOURS</span>
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
          Retatrutide, 20mg
        </h2>
        <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
          Lyophilized, lab-tested, and ready to reconstitute. Pick a single vial
          to start, or stock a full cycle so you never pause mid-protocol.
        </p>
      </div>

      {/* Picker + guarantee — mobile: right after the heading; desktop: sticky
          right column spanning both rows. */}
      <div className="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24">
        <RetaBundlePicker selected={selected} onSelect={setSelected} />
        <CrossSellStrip slugs={BUYBOX_CROSSSELL_SLUGS} variant="buybox" />
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

      {/* Image + supply + bullets — mobile: below the offer; desktop: left
          column, under the heading. */}
      <div className="order-3 lg:col-start-1 lg:row-start-2">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-4 sm:p-6">
          <div className="flex items-center justify-center">
            <img
              src={tier.image}
              alt={`Retatrutide 20mg — ${tier.label} (${tier.vials} vial${
                tier.vials > 1 ? "s" : ""
              })`}
              className="h-44 sm:h-56 w-auto object-contain transition-opacity duration-200"
            />
          </div>
          {/* Supply readout tied to the selected image */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-2.5 text-center">
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

        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {BULLETS.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-sm sm:text-base text-[var(--primary)]/80"
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
    </div>
  );
}
