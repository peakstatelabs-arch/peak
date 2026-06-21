"use client";

import { useTheme, type Mode } from "./ThemeProvider";

const OPTIONS: { mode: Mode; label: string; icon: React.ReactNode }[] = [
  { mode: "light",  label: "Light",  icon: <SunIcon  /> },
  { mode: "dark",   label: "Dark",   icon: <MoonIcon /> },
  { mode: "system", label: "System", icon: <AutoIcon /> },
];

export function ThemeSegmented({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();
  return (
    <div
      role="radiogroup"
      aria-label="Appearance"
      className="inline-flex w-full max-w-sm rounded-full border border-border bg-bg-elev p-1"
    >
      {OPTIONS.map((opt) => {
        const active = mode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setMode(opt.mode)}
            className={
              "flex-1 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors " +
              (active
                ? "bg-accent text-accent-fg shadow-sm"
                : "text-fg-muted hover:text-fg")
            }
          >
            <span className="h-4 w-4">{opt.icon}</span>
            {!compact && opt.label}
          </button>
        );
      })}
    </div>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

function SunIcon() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Svg>
  );
}

function MoonIcon() {
  return (
    <Svg>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </Svg>
  );
}

function AutoIcon() {
  // Half-and-half disc — universal "auto/system" icon.
  return (
    <Svg>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M12 3a9 9 0 0 0 0 18" fill="currentColor" stroke="none" />
    </Svg>
  );
}
