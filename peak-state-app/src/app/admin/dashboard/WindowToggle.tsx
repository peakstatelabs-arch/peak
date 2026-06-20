"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { WindowDays } from "@/lib/admin/compliance";

const OPTIONS: WindowDays[] = [7, 14, 30];

export function WindowToggle({ current }: { current: WindowDays }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setWindow(days: WindowDays) {
    const next = new URLSearchParams(sp);
    if (days === 7) next.delete("w");
    else next.set("w", String(days));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="inline-flex rounded-lg border border-border bg-bg-elev p-0.5 text-xs">
      {OPTIONS.map((d) => {
        const active = d === current;
        return (
          <button
            key={d}
            onClick={() => setWindow(d)}
            className={
              "px-3 py-1.5 rounded-md font-medium transition " +
              (active
                ? "bg-accent text-accent-fg"
                : "text-fg-muted hover:text-fg")
            }
          >
            {d}d
          </button>
        );
      })}
    </div>
  );
}
