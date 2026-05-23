"use client";

interface UrgencyBannerProps {
  lineOne: string;
  lineTwo: string;
  shippingText: string;
}

export function UrgencyBanner({
  lineOne,
  lineTwo,
  shippingText,
}: UrgencyBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-0.5 sm:gap-0">
      <span className="font-bold tracking-wide text-base sm:text-sm">
        {lineOne}
      </span>
      <span className="font-semibold text-white/95 text-sm sm:text-sm">
        {lineTwo} <span className="text-white/50">|</span>{" "}
        <span className="text-white/85">{shippingText}</span>
      </span>
    </div>
  );
}
