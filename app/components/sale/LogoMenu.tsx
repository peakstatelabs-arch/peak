"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSaleStatus } from "@/app/lib/useSaleStatus";

/**
 * The header logo. During the sale, tapping it opens a small menu: shop the
 * sale stacks or the sale singles. Outside the sale it behaves as before
 * (a link when `href` is given, plain otherwise).
 */
export function LogoMenu({
  children,
  href,
  className = "flex items-center gap-2 font-bold text-lg",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const sale = useSaleStatus();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!sale.live) {
    return href ? (
      <a href={href} className={className}>
        {children}
      </a>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  const item =
    "flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/10";
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {children}
        <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-[60] mt-2 w-64 rounded-2xl border border-white/10 bg-[#0f1626] p-2 shadow-2xl"
        >
          <a role="menuitem" href="/blackfriday?quiz=1" className={item}>
            <span>
              <span className="block">Find My Stack</span>
              <span className="block text-xs font-medium text-white/60">2 quick questions, 20 seconds</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a role="menuitem" href="/stacks" className={item}>
            <span>
              <span className="block">Shop Sale Stacks</span>
              <span className="block text-xs font-medium text-white/60">Up to 60% off</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a role="menuitem" href="/buildyourstack" className={item}>
            <span>
              <span className="block">Shop Sale Singles</span>
              <span className="block text-xs font-medium text-white/60">Up to 40% off any vial</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}
