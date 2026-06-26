"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  options: number[];
  onChange: (next: number) => void;
  unit?: string;
  className?: string;
  /**
   * Which side of the trigger the popover anchors to.
   * "right" (default): popover's right edge aligns to the trigger's right edge
   *   — popover extends LEFT from there. Good when the trigger sits near the
   *   right edge of its container (like the Reta schedule editor's rows).
   * "left": popover's left edge aligns to the trigger's left edge — popover
   *   extends RIGHT. Good when the trigger sits near the left edge of a form
   *   (like the onboarding wizard's dose inputs).
   */
  align?: "left" | "right";
};

function formatMg(n: number): string {
  return Number(n.toFixed(2)).toString();
}

export function DosePicker({
  value,
  options,
  onChange,
  unit = "mg",
  className,
  align = "right",
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Auto-scroll the current option into view when the popover opens.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>('[data-selected="true"]');
    if (el) el.scrollIntoView({ block: "center" });
  }, [open]);

  function pick(opt: number) {
    onChange(opt);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className={"relative inline-block " + (className ?? "")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="input w-28 text-right cursor-pointer relative"
        style={{ paddingRight: "2rem" }}
      >
        {formatMg(value)}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-fg-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className={
            "absolute z-50 mt-2 w-32 rounded-xl border border-border bg-bg-card shadow-2xl overflow-hidden " +
            (align === "left" ? "left-0" : "right-0")
          }
        >
          <ul
            ref={listRef}
            className="max-h-64 overflow-y-auto py-1 overscroll-contain"
          >
            {options.map((opt) => {
              const selected = opt === value;
              return (
                <li key={opt}>
                  <button
                    type="button"
                    data-selected={selected}
                    onClick={() => pick(opt)}
                    className={
                      "w-full flex items-center justify-between px-3 py-2 text-sm text-left transition " +
                      (selected
                        ? "bg-accent/15 text-accent font-semibold"
                        : "text-fg hover:bg-bg-elev")
                    }
                  >
                    <span>
                      {formatMg(opt)} {unit}
                    </span>
                    {selected && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
