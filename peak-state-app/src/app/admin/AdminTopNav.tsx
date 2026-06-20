"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Clients", exact: true },
  { href: "/admin/protocols", label: "Protocols" },
  { href: "/admin/check-ins", label: "Check-ins" },
];

export function AdminTopNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const activeLabel =
    ADMIN_LINKS.find((l) =>
      l.exact ? pathname === l.href : pathname?.startsWith(l.href)
    )?.label ?? "Admin";

  return (
    <>
      {/* Desktop: full pill row */}
      <nav className="hidden md:flex items-center gap-4 text-sm">
        {ADMIN_LINKS.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname?.startsWith(l.href) ?? false;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "transition-colors",
                active ? "text-fg font-medium" : "text-fg-muted hover:text-fg"
              )}
            >
              {l.label}
            </Link>
          );
        })}
        <Link href="/dashboard" className="text-fg-muted hover:text-fg">← Client view</Link>
      </nav>

      {/* Mobile: hamburger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Admin menu"
        aria-expanded={open}
        className="md:hidden flex items-center gap-2 rounded-lg border border-border bg-bg-elev px-3 py-1.5 text-sm"
      >
        <span className="font-medium">{activeLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <path d={open ? "m6 9 6 6 6-6 0 0" : "m6 9 6 6 6-6"} />
        </svg>
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-14 right-3 w-56 rounded-xl border border-border bg-bg-elev shadow-xl overflow-hidden"
          >
            <ul className="py-1">
              {ADMIN_LINKS.map((l) => {
                const active = l.exact
                  ? pathname === l.href
                  : pathname?.startsWith(l.href) ?? false;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm",
                        active ? "bg-accent/10 text-accent font-medium" : "text-fg hover:bg-bg"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-border">
                <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-fg-muted hover:bg-bg">
                  ← Client view
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
