"use client";

interface UrgencyBannerProps {
  lineOne: string;
  lineTwo: string;
  shippingText: string;
}

export function UrgencyBanner({ lineOne, lineTwo, shippingText }: UrgencyBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center text-xs sm:text-sm">
      <span className="font-bold tracking-wide">{lineOne}</span>
      <span className="font-semibold text-white/90">
        {lineTwo} <span className="text-white/50">|</span> <span className="text-white/80">{shippingText}</span>
      </span>
    </div>
  );
}
