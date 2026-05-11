"use client";

import { useEffect, useState } from "react";

export function OfflineBoundary() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="fixed bottom-20 lg:bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full border border-border bg-bg-card px-4 py-2 text-xs text-fg-muted shadow-lg">
      You're offline — showing the last data we have.
    </div>
  );
}
