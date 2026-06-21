"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type Mode = Theme | "system";

type Ctx = {
  /** The currently applied theme. */
  theme: Theme;
  /** The user's chosen mode. "system" means "follow the OS". */
  mode: Mode;
  setMode: (m: Mode) => void;
  /** Legacy convenience for callers that just want a flip. */
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "psl-theme";

function osTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [theme, setThemeState] = useState<Theme>("dark");

  // Initial read on mount.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialMode: Mode = stored ?? "system";
    setModeState(initialMode);
    const initialTheme: Theme = stored ?? osTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // When in "system" mode, keep theme in sync with live OS changes.
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const next: Theme = e.matches ? "dark" : "light";
      setThemeState(next);
      applyTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = (m: Mode) => {
    setModeState(m);
    if (m === "system") {
      localStorage.removeItem(STORAGE_KEY);
      const next = osTheme();
      setThemeState(next);
      applyTheme(next);
    } else {
      localStorage.setItem(STORAGE_KEY, m);
      setThemeState(m);
      applyTheme(m);
    }
  };

  const toggle = () => setMode(theme === "dark" ? "light" : "dark");

  return (
    <ThemeCtx.Provider value={{ theme, mode, setMode, toggle }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}
