"use client";

import { useEffect } from "react";

/**
 * Run `callback` when the browser restores this page from its back/forward
 * cache (e.g. the shopper taps Back after we sent them elsewhere). The page
 * comes back exactly as it was left, so a button locked in its "loading…"
 * state would stay stuck without this.
 */
export function useOnPageRestore(callback: () => void): void {
  useEffect(() => {
    function onPageShow(e: PageTransitionEvent) {
      if (e.persisted) callback();
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [callback]);
}
