"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

function arrayBufferToBase64(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function EnableRemindersButton() {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function enable() {
    setBusy(true);
    setError(null);
    try {
      if (
        typeof Notification === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        setError(
          "This browser doesn't support push. Add this app to your home screen first."
        );
        return;
      }

      let perm = Notification.permission;
      if (perm !== "granted") perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setError("Permission denied. You can turn this on later from the Tracker.");
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setError("Push isn't configured yet.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as unknown as BufferSource,
        });
      }

      const res = await fetch("/portal/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(sub.getKey("p256dh")),
            auth: arrayBufferToBase64(sub.getKey("auth")),
          },
          userAgent: navigator.userAgent,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Couldn't register this device.");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        await supabase
          .from("profiles")
          .update({ notifications_enabled: true, timezone: tz })
          .eq("id", user.id);
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={enable}
        disabled={busy}
        className="btn-primary w-full"
      >
        {busy ? "Setting up…" : "Turn on reminders"}
      </button>
      {error && (
        <p className="mt-3 text-sm text-fg-muted text-center">{error}</p>
      )}
    </>
  );
}
