"use client";

interface UrgencyBannerProps {
  lineOne: string;
  lineTwo: string;
  shippingText: string;
}

export function UrgencyBanner({ lineOne, lineTwo, shippingText }: UrgencyBannerProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-4 text-center text-xs sm:text-sm">
      <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
        <span className="font-bold tracking-wide">{lineOne}</span>
        <span className="font-semibold text-white/90">{lineTwo}</span>
      </div>
      <span className="hidden sm:inline text-white/50">|</span>
      <span className="text-white/80">{shippingText}</span>
    </div>
  );
}
