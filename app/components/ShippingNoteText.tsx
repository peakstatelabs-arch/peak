"use client";

import { useEffect, useState } from "react";
import { getEasternShippingState } from "@/app/lib/easternTime";

interface ShippingNoteTextProps {
  preCutoff: string;
  postCutoff: string;
  className?: string;
}

export function ShippingNoteText({
  preCutoff,
  postCutoff,
  className,
}: ShippingNoteTextProps) {
  const [isAfterCutoff, setIsAfterCutoff] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAfterCutoff(getEasternShippingState().isAfterCutoff);

    const interval = setInterval(() => {
      setIsAfterCutoff(getEasternShippingState().isAfterCutoff);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Render preCutoff during SSR/hydration to keep server and client markup in
  // sync; the effect above swaps to the correct text on the first client tick.
  const text = mounted && isAfterCutoff ? postCutoff : preCutoff;

  return <p className={className}>{text}</p>;
}
