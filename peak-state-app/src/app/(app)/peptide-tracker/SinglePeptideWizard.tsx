"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSingleSchedule, type DoseRow } from "@/lib/schedule";
import { requestNotificationPermission, notificationsSupported } from "@/lib/notifications";
import type { ProfilePrefs } from "./Client";

type Choice = "single-reta" | "single-cjc" | "single-bpc" | "single-ghk";

type Config = {
  label: string;
  peptide_name: string;
  defaultDose: number;
  defaultFrequency: Frequency;
  defaultTime: "morning" | "evening";
  frequencyOptions: { value: Frequency; label: string }[];
  note?: string;
};

type Frequency =
  | "daily"
  | "every-other-day"
  | "twice-weekly"
  | "thrice-weekly"
  | "five-on-two-off"
  | "weekly";

const CONFIGS: Record<Choice, Config> = {
  "single-reta": {
    label: "Retatrutide",
    peptide_name: "Retatrutide",
    defaultDose: 2.0,
    defaultFrequency: "weekly",
    defaultTime: "morning",
    frequencyOptions: [{ value: "weekly", label: "Once weekly (Monday)" }],
    note: "Locked to weekly Monday morning dosing.",
  },
  "single-cjc": {
    label: "CJC-1295 + Ipamorelin",
    peptide_name: "CJC-1295 + Ipamorelin",
    defaultDose: 0.3,
    defaultFrequency: "five-on-two-off",
    defaultTime: "evening",
    frequencyOptions: [
      { value: "five-on-two-off", label: "Mon–Fri evening (5 on / 2 off)" },
      { value: "daily", label: "Daily evening" },
    ],
    note: "Take fasted: 90 min after last meal, before next meal.",
  },
  "single-bpc": {
    label: "BPC-157 + TB-500",
    peptide_name: "BPC-157 + TB-500",
    defaultDose: 2.0,
    defaultFrequency: "twice-weekly",
    defaultTime: "evening",
    frequencyOptions: [
      { value: "twice-weekly", label: "2× weekly (Mon + Thu)" },
      { value: "thrice-weekly", label: "3× weekly (Mon + Wed + Fri)" },
      { value: "daily", label: "Daily" },
    ],
  },
  "single-ghk": {
    label: "GHK-Cu",
    peptide_name: "GHK-Cu",
    defaultDose: 2.0,
    defaultFrequency: "daily",
    defaultTime: "evening",
    frequencyOptions: [
      { value: "daily", label: "Daily evening" },
      { value: "five-on-two-off", label: "Mon–Fri evening" },
      { value: "thrice-weekly", label: "3× weekly (Mon + Wed + Fri)" },
    ],
    note: "Evening before bed. Avoid mixing with vitamin C at injection time.",
  },
};

export function SinglePeptideWizard({
  choice,
  profile,
  onSaved,
  onCancel,
}: {
  choice: Choice;
  profile: ProfilePrefs;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const supabase = createClient();
  const config = CONFIGS[choice];
  const [dose, setDose] = useState(config.defaultDose);
  const [frequency, setFrequency] = useState<Frequency>(config.defaultFrequency);
  const [time, setTime] = useState<"morning" | "evening">(config.defaultTime);
  const [weeks, setWeeks] = useState(12);
  const [startDate, setStartDate] = useState(todayISO());
  const [morningTime, setMorningTime] = useState(profile.morning_time);
  const [eveningTime, setEveningTime] = useState(profile.evening_time);
  const [enableReminders, setEnableReminders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo<DoseRow[]>(
    () =>
      generateSingleSchedule({
        peptide_name: config.peptide_name,
        dose_mg: dose,
        frequency,
        time_of_day: time,
        startDate: new Date(startDate + "T00:00:00"),
        weeks,
      }),
    [config.peptide_name, dose, frequency, time, startDate, weeks]
  );

  async function save() {
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    // If they opted in, ask for notification permission now (user gesture).
    let notificationsOn = false;
    if (enableReminders) {
      const perm = await requestNotificationPermission();
      notificationsOn = perm === "granted";
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const profileUpdate: Record<string, unknown> = {
      morning_time: morningTime,
      evening_time: eveningTime,
      timezone: tz,
    };
    // Only flip reminders ON here; never auto-disable (the Reminders panel
    // is the single off-switch so we don't clobber other active protocols).
    if (notificationsOn) profileUpdate.notifications_enabled = true;
    await supabase.from("profiles").update(profileUpdate).eq("id", user.id);

    const startISO = startDate;
    const endISO = new Date(new Date(startDate + "T00:00:00").getTime() + weeks * 7 * 86400000)
      .toISOString().slice(0, 10);

    const { error: pErr } = await supabase.from("peptide_protocols").insert({
      user_id: user.id,
      name: `${config.label} · ${dose} mg ${frequencyLabel(frequency)}`,
      peptide_name: config.peptide_name,
      dose_mg: dose,
      frequency,
      time_of_day: time,
      start_date: startISO,
      end_date: endISO,
      active: true,
      protocol_type: "single",
      stacks: null,
      bpc_track: null,
    });
    if (pErr) { setError(pErr.message); setSaving(false); return; }

    // Clear ALL future unlogged doses for this peptide so starting a new
    // protocol gives a clean slate (no orphans from prior tests).
    const todayISO = new Date().toISOString().slice(0, 10);
    await supabase
      .from("peptide_doses")
      .delete()
      .eq("user_id", user.id)
      .gte("scheduled_for", todayISO)
      .eq("taken", false)
      .eq("peptide_name", config.peptide_name);

    const batch = 200;
    for (let i = 0; i < rows.length; i += batch) {
      const slice = rows.slice(i, i + batch).map((r) => ({
        user_id: user.id,
        peptide_name: r.peptide_name,
        dose_mg: r.dose_mg,
        scheduled_for: r.scheduled_for,
        time_of_day: r.time_of_day,
        taken: false,
        notes: r.notes,
      }));
      const { error: dErr } = await supabase.from("peptide_doses").insert(slice);
      if (dErr) { setError(dErr.message); setSaving(false); return; }
    }

    setSaving(false);
    onSaved();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{config.label}</h2>
        <button onClick={onCancel} className="btn-ghost text-sm">← Back</button>
      </div>

      <div className="card space-y-4">
        {config.note && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-fg-muted">
            {config.note}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Dose per administration (mg)</label>
            <input
              type="number"
              step="0.05"
              className="input"
              value={dose}
              onChange={(e) => setDose(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Frequency</label>
            <select
              className="input"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
            >
              {config.frequencyOptions.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Time of day</label>
            <select
              className="input"
              value={time}
              onChange={(e) => setTime(e.target.value as "morning" | "evening")}
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
          <div>
            <label className="label">Duration (weeks)</label>
            <input
              type="number"
              className="input"
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="label">Start date</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              {time === "morning" ? "Morning dose time" : "Evening dose time"}
            </label>
            <input
              type="time"
              className="input"
              value={time === "morning" ? morningTime : eveningTime}
              onChange={(e) =>
                time === "morning"
                  ? setMorningTime(e.target.value)
                  : setEveningTime(e.target.value)
              }
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-lg border border-border bg-bg-elev p-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[rgb(var(--accent))]"
            checked={enableReminders}
            onChange={(e) => setEnableReminders(e.target.checked)}
          />
          <span className="text-sm">
            <span className="font-medium">Remind me for every dose</span>
            <span className="block text-xs text-fg-muted mt-0.5">
              Turns on browser notifications for all doses at the time above.
              You can turn them all off anytime from the Reminders panel.
              {!notificationsSupported() && " (Your browser doesn't support notifications.)"}
            </span>
          </span>
        </label>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Schedule preview</h3>
          <span className="text-xs text-fg-subtle">{rows.length} doses over {weeks} weeks</span>
        </div>
        {rows.length === 0 ? (
          <p className="text-sm text-fg-muted">No doses match. Adjust frequency or duration.</p>
        ) : (
          <ul className="divide-y divide-border max-h-72 overflow-y-auto">
            {rows.slice(0, 15).map((r, i) => (
              <li key={i} className="py-2 flex items-center justify-between text-sm">
                <span className="text-fg-muted">{r.scheduled_for}</span>
                <span className="font-medium">{r.dose_mg} mg · {r.time_of_day}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="card border-danger/30 bg-danger/10 text-danger text-sm">{error}</div>}

      <div className="flex gap-2">
        <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
        <button onClick={save} disabled={saving || rows.length === 0} className="btn-primary flex-1">
          {saving ? "Saving…" : `Save & schedule ${rows.length} dose${rows.length === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}

function frequencyLabel(f: Frequency): string {
  switch (f) {
    case "daily": return "daily";
    case "every-other-day": return "every other day";
    case "twice-weekly": return "2×/wk";
    case "thrice-weekly": return "3×/wk";
    case "five-on-two-off": return "Mon–Fri";
    case "weekly": return "weekly";
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
