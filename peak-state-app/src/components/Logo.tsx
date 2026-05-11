import Image from "next/image";

export function Logo({ size = 40, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="https://www.peakstate.shop/logo.png"
        alt="Peak State Labs"
        width={size}
        height={size}
        priority
        className="rounded-md"
      />
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Peak State <span className="text-accent">Labs</span>
        </span>
      )}
    </div>
  );
}
