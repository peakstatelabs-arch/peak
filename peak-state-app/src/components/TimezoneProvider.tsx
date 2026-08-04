"use client";

import { createContext, useContext } from "react";
import { todayInZone } from "@/lib/utils";

/**
 * The current user's saved IANA timezone (`profiles.timezone`), provided once
 * by the app layout so any client component can resolve "today" in the user's
 * zone instead of UTC. Null means "fall back to the device zone".
 */
const TimezoneContext = createContext<string | null>(null);

export function TimezoneProvider({
  timezone,
  children,
}: {
  timezone: string | null;
  children: React.ReactNode;
}) {
  return (
    <TimezoneContext.Provider value={timezone}>
      {children}
    </TimezoneContext.Provider>
  );
}

/** The user's saved timezone (or null to mean the device zone). */
export function useTimezone(): string | null {
  return useContext(TimezoneContext);
}

/**
 * "Today" (YYYY-MM-DD) in the user's saved timezone, falling back to the device
 * zone. Client-side replacement for `todayISO()`.
 */
export function useTodayISO(): string {
  return todayInZone(useContext(TimezoneContext));
}
