"use client";

import { useEffect, useState } from "react";
import { getStacksLeft } from "@/app/lib/easternTime";

interface StacksConfig {
  initial: number;
  minimum: number;
  anchorEasternDate: string;
}

interface UrgencyBannerProps {
  lineOne: string;
  lineTwo: string;
  shippingText: string;
  stacks?: StacksConfig;
}

export function UrgencyBanner({
  lineOne,
  lineTwo,
  shippingText,
  stacks,
}: UrgencyBannerProps) {
  const initialCount = stacks?.initial ?? null;
  const [count, setCount] = useState<number | null>(initialCount);

  useEffect(() => {
    if (!stacks) return;

    const update = () => setCount(getStacksLeft(stacks));
    update();

    // Re-check every minute so the count drops within 60s of the 8 PM ET
    // boundary without having to reload the page.
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [stacks]);

  const renderedLineTwo =
    count != null
      ? lineTwo.replace("{stacks}", String(count))
      : lineTwo.replace("{stacks}", String(initialCount ?? ""));

  return (
    <div className="flex flex-col items-center justify-center text-center gap-0.5 sm:gap-0">
      <span className="font-bold tracking-wide text-base sm:text-sm">
        {lineOne}
      </span>
      <span className="font-semibold text-white/95 text-sm sm:text-sm">
        {renderedLineTwo} <span className="text-white/50">|</span>{" "}
        <span className="text-white/85">{shippingText}</span>
      </span>
    </div>
  );
}
