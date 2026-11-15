"use client";

import type { ReactNode } from "react";

/* ============================================================
 * Layout + text primitives and inline icons for the roadmap.
 * ============================================================ */

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Wrap({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={cx(
        "mx-auto w-full px-4 sm:px-6",
        narrow ? "max-w-3xl" : "max-w-5xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Each reading section; scroll margin clears header + sticky tracker. */
export function Block({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cx("scroll-mt-[136px] py-14 sm:py-20", className)}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold tracking-wider text-[var(--primary)] uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-dark)]" />
      {children}
    </div>
  );
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cx(
        "text-3xl sm:text-4xl font-bold tracking-tight text-balance text-[var(--primary)]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cx(
        "text-xl sm:text-2xl font-bold tracking-tight text-balance text-[var(--primary)]",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function P({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        "text-base sm:text-lg leading-relaxed text-[var(--primary)]/80",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="text-lg sm:text-xl leading-relaxed text-[var(--primary)]/85 text-pretty">
      {children}
    </p>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Big pull-quote style statement. */
export function Statement({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "soft";
}) {
  return (
    <div
      className={cx(
        "rounded-2xl px-6 py-6 sm:px-8 sm:py-7 text-xl sm:text-2xl font-bold leading-snug text-balance",
        tone === "primary"
          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg"
          : "border-l-4 border-[var(--accent-dark)] bg-[var(--muted)] text-[var(--primary)]",
      )}
    >
      {children}
    </div>
  );
}

export function Callout({
  title,
  children,
  tone = "info",
}: {
  title?: ReactNode;
  children: ReactNode;
  tone?: "info" | "warn";
}) {
  const warn = tone === "warn";
  return (
    <div
      className={cx(
        "rounded-2xl border p-5 sm:p-6",
        warn
          ? "border-amber-300 bg-amber-50 text-amber-950"
          : "border-[var(--border)] bg-[var(--muted)] text-[var(--primary)]",
      )}
    >
      {title && (
        <div className="mb-2 flex items-center gap-2 font-bold">
          {warn ? (
            <IconAlert className="h-5 w-5 text-amber-600" />
          ) : (
            <IconInfo className="h-5 w-5 text-[var(--accent-dark)]" />
          )}
          {title}
        </div>
      )}
      <div className={cx("leading-relaxed", warn ? "text-amber-950/90" : "text-[var(--primary)]/80")}>
        {children}
      </div>
    </div>
  );
}

export function Dots({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={cx("space-y-2", className)}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-base sm:text-lg leading-relaxed text-[var(--primary)]/80">
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-dark)]" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items, strike }: { items: string[]; strike?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className={cx(
            "rounded-full border px-3 py-1.5 text-sm font-medium",
            strike
              ? "border-red-200 bg-red-50 text-red-900/70 line-through decoration-red-400/70"
              : "border-[var(--border)] bg-[var(--muted)] text-[var(--primary)]",
          )}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

/* ---------------- icons ---------------- */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const IconX = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
export const IconArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Svg>
);
export const IconChevron = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);
export const IconAlert = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l9.5 17h-19L12 3z" />
    <path d="M12 10v4M12 17.5v.01" />
  </Svg>
);
export const IconInfo = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.5v.01" />
  </Svg>
);
export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const IconScale = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M8.5 9a5 5 0 017 0l-2.5 3" />
  </Svg>
);
export const IconRuler = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 16.5L16.5 3 21 7.5 7.5 21z" />
    <path d="M7 12.5l2 2M10 9.5l2 2M13 6.5l2 2" />
  </Svg>
);
export const IconCamera = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </Svg>
);
export const IconDumbbell = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
  </Svg>
);
export const IconBolt = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 2.5L4.5 14H12l-1 7.5L19.5 10H12z" />
  </Svg>
);
export const IconBowl = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 11h17a8.5 8.5 0 01-17 0z" />
    <path d="M9 7.5c0-1.5 1-2 1-3.5M14 7.5c0-1.5 1-2 1-3.5" />
  </Svg>
);
export const IconMoon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
  </Svg>
);
export const IconWalk = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="13" cy="4.5" r="1.8" />
    <path d="M10 21l2.5-6.5L15 17v4M8 11l3-3.5 3 2.5 3 1M12.5 14.5L11 8" />
  </Svg>
);
export const IconReset = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 101.6-4.8" />
    <path d="M4 4v4h4" />
  </Svg>
);
export const IconTrash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" />
  </Svg>
);
