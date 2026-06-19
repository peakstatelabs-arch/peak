"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dose, ProfilePrefs } from "./Client";

export function NotificationSetup({
  profile,
  onSaved,
}: {
  profile: ProfilePrefs;
  onSaved: () => void;
  doses: Dose[]; // kept for backwards-compat; not used now that the server cron drives reminders
}) {
  const supabase = createClient();
  const [morningTime, setMorningTime] = useState(profile.morning_time);
  const [eveningTime, setEveningTime] = useState(profile.evening_time);
  const [enabled, setEnabled] = useState(profile.notifications_enabled);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }, []);

  async function enable() {
    setSaving(true);
    setMsg(null);
    try {
      if (typeof Notification === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        setMsg("This browser doesn't support push notifications. Try Safari on iOS 16.4+, Chrome on Android, or any desktop browser.");
        return;
      }

      let perm = Notification.permission;
      if (perm !== "granted") perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setMsg("Permission denied. Enable notifications in your browser settings to receive reminders.");
        setEnabled(false);
        await persistEnabled(false);
        return;
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        setMsg("Push isn't configured yet. The app developer needs to add VAPID keys.");
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

      // Send to server
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
        setMsg(j.error ?? "Couldn't register this device.");
        return;
      }

      setEnabled(true);
      await persistEnabled(true);
      setMsg("Reminders enabled. We'll notify you at your dose times — even when the app is closed.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Couldn't enable reminders.");
    } finally {
      setSaving(false);
    }
  }

  async function disable() {
    setSaving(true);
    setMsg(null);
    try {
      // Best-effort unsubscribe locally
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch("/portal/api/push/unsubscribe", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        } else {
          await fetch("/portal/api/push/unsubscribe", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
        }
      } catch {}
      setEnabled(false);
      await persistEnabled(false);
      setMsg("Reminders turned off on this device.");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTesting(true);
    setMsg(null);
    try {
      const res = await fetch("/portal/api/push/test", { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.error ?? "Couldn't send test."); return; }
      setMsg(`Test sent to ${json.sent} device${json.sent === 1 ? "" : "s"}. Check your phone or system tray.`);
    } finally {
      setTesting(false);
    }
  }

  async function saveTimes() {
    setSaving(true);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { error } = await supabase
      .from("profiles")
      .update({ morning_time: morningTime, evening_time: eveningTime, timezone: tz })
      .eq("id", user.id);
    setSaving(false);
    if (error) { setMsg("Couldn't save: " + error.message); return; }
    setMsg("Times saved.");
    onSaved();
  }

  async function persistEnabled(on: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await supabase
      .from("profiles")
      .update({
        notifications_enabled: on,
        morning_time: morningTime,
        evening_time: eveningTime,
        timezone: tz,
      })
      .eq("id", user.id);
    onSaved();
  }

  const liveOn = enabled && permission === "granted";

  return (
    <section className="card">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <h2 className="font-semibold">Reminders</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Master switch for all dose reminders. Push notifications fire even when the app is closed.
          </p>
        </div>
        <span className={`chip ${liveOn ? "chip-accent" : ""}`}>{liveOn ? "On" : "Off"}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="label">Morning dose time</label>
          <input type="time" className="input" value={morningTime} onChange={(e) => setMorningTime(e.target.value)} />
          <p className="text-xs text-fg-subtle mt-1">For Retatrutide and any morning singles.</p>
        </div>
        <div>
          <label className="label">Evening dose time</label>
          <input type="time" className="input" value={eveningTime} onChange={(e) => setEveningTime(e.target.value)} />
          <p className="text-xs text-fg-subtle mt-1">For CJC, BPC, GHK-Cu — keep fasted.</p>
        </div>
      </div>

      {msg && (
        <div className="rounded-lg border border-border bg-bg-elev px-3 py-2 text-sm text-fg-muted mb-3">
          {msg}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={saveTimes} disabled={saving} className="btn-secondary text-sm">
          {saving ? "Saving…" : "Save times"}
        </button>
        {liveOn ? (
          <>
            <button onClick={sendTest} disabled={testing} className="btn-ghost text-sm">
              {testing ? "Sending…" : "Send a test"}
            </button>
            <button onClick={disable} disabled={saving} className="btn-ghost text-sm text-danger">
              Turn off
            </button>
          </>
        ) : (
          <button onClick={enable} disabled={saving} className="btn-primary text-sm">
            {saving ? "Enabling…" : "Enable reminders"}
          </button>
        )}
      </div>

      <p className="text-xs text-fg-subtle mt-4 leading-relaxed">
        For best results on iPhone, add this portal to your home screen
        (Share → Add to Home Screen) before enabling. iOS Safari requires the
        PWA install for push notifications.
      </p>
    </section>
  );
}

/** Convert URL-safe base64 VAPID public key to a Uint8Array (browser requirement). */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
