"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dose, ProfilePrefs } from "./Client";

export function NotificationSetup({
  profile,
  onSaved,
  doses,
}: {
  profile: ProfilePrefs;
  onSaved: () => void;
  doses: Dose[];
}) {
  const supabase = createClient();
  const [morningTime, setMorningTime] = useState(profile.morning_time);
  const [eveningTime, setEveningTime] = useState(profile.evening_time);
  const [enabled, setEnabled] = useState(profile.notifications_enabled);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const scheduledRef = useRef<number[]>([]);

  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }, []);

  // Schedule today's notifications while page is open.
  useEffect(() => {
    if (!enabled || permission !== "granted") return;
    for (const id of scheduledRef.current) clearTimeout(id);
    scheduledRef.current = [];

    const today = new Date().toISOString().slice(0, 10);
    const todays = doses.filter((d) => d.scheduled_for === today && !d.taken);
    for (const d of todays) {
      const timeStr = d.time_of_day === "morning" ? morningTime : eveningTime;
      const [h, m] = timeStr.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      const delay = target.getTime() - Date.now();
      if (delay > 0 && delay < 12 * 3600 * 1000) {
        const id = window.setTimeout(() => fireNotification(d), delay);
        scheduledRef.current.push(id);
      }
    }
    return () => {
      for (const id of scheduledRef.current) clearTimeout(id);
    };
  }, [enabled, permission, doses, morningTime, eveningTime]);

  async function requestPermissionAndSave() {
    setSaving(true);
    setMsg(null);
    let perm = permission;
    if (perm !== "granted") {
      if (typeof Notification === "undefined") {
        setMsg("This browser doesn't support notifications.");
        setSaving(false);
        return;
      }
      perm = await Notification.requestPermission();
      setPermission(perm);
    }
    if (perm !== "granted") {
      setMsg("Permission denied. Enable in your browser settings to receive reminders.");
      setEnabled(false);
      await persist(false);
      setSaving(false);
      return;
    }
    setEnabled(true);
    await persist(true);
    setMsg("Notifications enabled. We'll remind you at your set times.");
    setSaving(false);
  }

  async function disable() {
    setSaving(true);
    setEnabled(false);
    await persist(false);
    setMsg("Notifications turned off.");
    setSaving(false);
  }

  async function saveTimes() {
    setSaving(true);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const { error } = await supabase
      .from("profiles")
      .update({
        morning_time: morningTime,
        evening_time: eveningTime,
        timezone: tz,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) { setMsg("Couldn't save: " + error.message); return; }
    setMsg("Times saved.");
    onSaved();
  }

  async function persist(on: boolean) {
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

  return (
    <section className="card">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <h2 className="font-semibold">Reminders</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            Master switch for all dose reminders. Change your times here, or turn every
            reminder on or off at once.
          </p>
        </div>
        <span
          className={`chip ${enabled && permission === "granted" ? "chip-accent" : ""}`}
        >
          {enabled && permission === "granted" ? "On" : "Off"}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="label">Morning dose time</label>
          <input
            type="time"
            className="input"
            value={morningTime}
            onChange={(e) => setMorningTime(e.target.value)}
          />
          <p className="text-xs text-fg-subtle mt-1">For Retatrutide and any morning singles.</p>
        </div>
        <div>
          <label className="label">Evening dose time</label>
          <input
            type="time"
            className="input"
            value={eveningTime}
            onChange={(e) => setEveningTime(e.target.value)}
          />
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
        {enabled && permission === "granted" ? (
          <>
            <button
              onClick={() => fireNotification(null, "Reminder test from Peak State Labs")}
              className="btn-ghost text-sm"
            >
              Send a test
            </button>
            <button onClick={disable} disabled={saving} className="btn-ghost text-sm text-danger">
              Turn off
            </button>
          </>
        ) : (
          <button onClick={requestPermissionAndSave} disabled={saving} className="btn-primary text-sm">
            {saving ? "…" : "Enable reminders"}
          </button>
        )}
      </div>

      <p className="text-xs text-fg-subtle mt-4 leading-relaxed">
        Reminders fire while the portal is installed and the app or your browser is running.
        Add this to your home screen for the best experience.
      </p>
    </section>
  );
}

function fireNotification(d: Dose | null, customBody?: string) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const title = d ? `Time for ${d.peptide_name}` : "Peak State Labs";
  const body =
    customBody ??
    (d ? `${d.dose_mg} mg · ${d.time_of_day ?? "now"}${d.notes ? ` — ${d.notes}` : ""}` : "");
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) =>
        reg.showNotification(title, {
          body,
          icon: "/portal/icons/icon-192.png",
          badge: "/portal/icons/icon-192.png",
          tag: d?.id ?? "psl-test",
        })
      );
    } else {
      new Notification(title, { body, icon: "/portal/icons/icon-192.png" });
    }
  } catch {
    // ignore
  }
}
