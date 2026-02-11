"use client";

import { useState, useEffect } from "react";

interface UrgencyBannerProps {
  batchText: string;
  baseCount: number;
  baseDate: string;
  shippingText: string;
}

export function UrgencyBanner({ batchText, baseCount, baseDate, shippingText }: UrgencyBannerProps) {
  const [stacksRemaining, setStacksRemaining] = useState<number | null>(null);

  useEffect(() => {
    const base = new Date(baseDate + "T00:00:00");
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));
    setStacksRemaining(Math.max(1, baseCount - diffDays));
  }, [baseCount, baseDate]);

  if (stacksRemaining === null) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-sm">
        <span className="font-semibold">{batchText}</span>
        <span className="hidden sm:inline text-white/50">|</span>
        <span className="text-white/80">{shippingText}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-sm">
      <span className="font-semibold">
        {batchText} Only {stacksRemaining} Stack{stacksRemaining !== 1 ? "s" : ""} Remaining.
      </span>
      <span className="hidden sm:inline text-white/50">|</span>
      <span className="text-white/80">{shippingText}</span>
    </div>
  );
}
