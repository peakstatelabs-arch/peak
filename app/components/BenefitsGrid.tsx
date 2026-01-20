"use client";

import { FlameIcon, ActivityIcon, MapPinCheckIcon, TargetIcon, FlaskIcon, ZapIcon } from "./icons";

interface Benefit {
  title: string;
  description: string;
}

interface BenefitsGridProps {
  benefits: Benefit[];
}

const BENEFIT_ICONS = [
  FlameIcon,      // Burn 2lbs Every Week
  ActivityIcon,   // Strong, Toned Muscle
  MapPinCheckIcon, // No Guessing
  TargetIcon,     // Expert Coaching
  FlaskIcon,      // Proven Science
  ZapIcon,        // Total Body Reset
];

export function BenefitsGrid({ benefits }: BenefitsGridProps) {
  return (
    <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
      {benefits.map((benefit, index) => {
        const IconComponent = BENEFIT_ICONS[index] || FlameIcon;
        return (
          <div
            key={benefit.title}
            className={`p-5 rounded-2xl border border-[var(--border)] bg-white/80 backdrop-blur card-hover animate-fade-in-up stagger-${
              (index % 6) + 1
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <IconComponent size={20} className="text-[var(--accent-dark)]" />
              </span>
              <div>
                <p className="font-semibold text-[var(--primary)]">
                  {benefit.title}
                </p>
                <p className="text-sm text-[var(--primary)]/60 mt-1">
                  {benefit.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
