"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STACK_PROTOCOLS, getStackProtocol, type StackProtocol } from "@/lib/protocols";
import { generatePowerCutSchedule, type DoseRow } from "@/lib/schedule";
import { requestNotificationPermission, notificationsSupported } from "@/lib/notifications";
import { todayInZone, localDateISO } from "@/lib/utils";
import type { ProfilePrefs } from "./Client";

export function PowerCutWizard({
  track,
  profile,
  onSaved,
  onCancel,
}: {
  track: "foundation" | "performance";
  profile: ProfilePrefs;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const supabase = createClient();
  const [step, setStep] = useState<"calc" | "review">("calc");
  const [stacks, setStacks] = useState(1);
  const [currentWeight, setCurrentWeight] = useState(195);
  const [goalWeight, setGoalWeight] = useState(170);
  const [currentBF, setCurrentBF] = useState(22);
  const [goalBF, setGoalBF] = useState(15);
  const [startDate, setStartDate] = useState(nextMondayISO());
  const [morningTime, setMorningTime] = useState(profile.morning_time);
  const [eveningTime, setEveningTime] = useState(profile.evening_time);
  const [enableReminders, setEnableReminders] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const protocol = useMemo(() => getStackProtocol(stacks)!, [stacks]);
  const trackInfo = track === "foundation" ? protocol.bpc.foundation : protocol.bpc.performance;

  const weightLoss = Math.max(0, currentWeight - goalWeight);

  const previewRows: DoseRow[] = useMemo(() => {
    return generatePowerCutSchedule({
      protocol,
      bpc: track,
      startDate: new Date(startDate + "T00:00:00"),
    });
  }, [protocol, track, startDate]);

  const trackLabel = track === "foundation" ? "Foundation (2× weekly)" : "Performance (3× weekly)";

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

    // Save preferred dosing times + reminder opt-in
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

    const protocolType = `power_cut_${track}`;
    const name = `POWER CUT™ — ${track === "foundation" ? "Foundation" : "Performance"} (${stacks} stack${stacks > 1 ? "s" : ""})`;
    const endDate = new Date(new Date(startDate + "T00:00:00").getTime() + protocol.totalWeeks * 7 * 86400000)
      .toISOString().slice(0, 10);

    // Insert one parent protocol row per peptide
    const peptideNames = ["Retatrutide", "CJC-1295 + Ipamorelin", "BPC-157 + TB-500"];
    const inserts = peptideNames.map((peptide_name) => ({
      user_id: user.id,
      name: `${name} · ${peptide_name}`,
      peptide_name,
      dose_mg: 0,
      frequency: peptide_name === "Retatrutide" ? "weekly" : peptide_name === "CJC-1295 + Ipamorelin" ? "five-on-two-off" : track === "foundation" ? "twice-weekly" : "thrice-weekly",
      time_of_day: peptide_name === "Retatrutide" ? "morning" : "evening",
      start_date: startDate,
      end_date: endDate,
      active: true,
      protocol_type: protocolType,
      stacks,
      bpc_track: track,
    }));
    const { error: pErr } = await supabase.from("peptide_protocols").insert(inserts);
    if (pErr) { setError("Couldn't save protocol: " + pErr.message); setSaving(false); return; }

    // Clear ALL future unlogged doses for these peptides so starting a new
    // protocol gives a clean slate (doesn't only scope to the new window —
    // that left orphans from prior protocols hanging around).
    const todayISO = todayInZone(profile.timezone);
    await supabase
      .from("peptide_doses")
      .delete()
      .eq("user_id", user.id)
      .gte("scheduled_for", todayISO)
      .eq("taken", false)
      .in("peptide_name", peptideNames);

    // Insert dose rows (batched)
    const batch = 200;
    for (let i = 0; i < previewRows.length; i += batch) {
      const slice = previewRows.slice(i, i + batch).map((r) => ({
        user_id: user.id,
        peptide_name: r.peptide_name,
        dose_mg: r.dose_mg,
        scheduled_for: r.scheduled_for,
        time_of_day: r.time_of_day,
        taken: false,
        notes: r.notes,
      }));
      const { error: dErr } = await supabase.from("peptide_doses").insert(slice);
      if (dErr) { setError("Couldn't save doses: " + dErr.message); setSaving(false); return; }
    }

    setSaving(false);
    onSaved();
  }

  if (step === "calc") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            POWER CUT™ — {track === "foundation" ? "Foundation" : "Performance"}
          </h2>
          <button onClick={onCancel} className="btn-ghost text-sm">← Back</button>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-1">Personalize your protocol</h3>
          <p className="text-sm text-fg-muted mb-4">
            Pick how many stacks, enter your stats. We'll generate the full week-by-week dosing schedule.
          </p>

          <div className="mb-5">
            <label className="label">How many stacks</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStacks(n)}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    stacks === n
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-bg-elev text-fg-muted hover:text-fg"
                  }`}
                >
                  {n} stack{n > 1 ? "s" : ""}
                  <div className="text-[10px] text-fg-subtle mt-0.5">
                    {getStackProtocol(n)!.totalWeeks} weeks
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <Num label="Current weight (lb)" v={currentWeight} on={setCurrentWeight} />
            <Num label="Goal weight (lb)" v={goalWeight} on={setGoalWeight} />
            <Num label="Current body fat %" v={currentBF} on={setCurrentBF} />
            <Num label="Goal body fat %" v={goalBF} on={setGoalBF} />
          </div>

          <div className="rounded-lg bg-bg-elev border border-border p-3 mb-5 text-sm">
            <div className="flex justify-between">
              <span className="text-fg-muted">Target loss</span>
              <span className="font-display text-lg text-accent font-semibold">
                {weightLoss.toFixed(1)} lb
              </span>
            </div>
            <div className="text-xs text-fg-subtle mt-1">
              Over {protocol.totalWeeks} weeks · ~{(weightLoss / (protocol.totalWeeks || 1)).toFixed(2)} lb/week
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="label">Start date</label>
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <p className="text-xs text-fg-subtle mt-1">
                Schedule starts the {dayName(new Date(startDate + "T00:00:00"))} of this week's Reta dose.
              </p>
            </div>
            <div></div>
            <div>
              <label className="label">Morning dose time (Reta)</label>
              <input type="time" className="input" value={morningTime} onChange={(e) => setMorningTime(e.target.value)} />
            </div>
            <div>
              <label className="label">Evening dose time (CJC + BPC)</label>
              <input type="time" className="input" value={eveningTime} onChange={(e) => setEveningTime(e.target.value)} />
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-bg-elev p-3 mb-5 cursor-pointer">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[rgb(var(--accent))]"
              checked={enableReminders}
              onChange={(e) => setEnableReminders(e.target.checked)}
            />
            <span className="text-sm">
              <span className="font-medium">Remind me for every dose</span>
              <span className="block text-xs text-fg-muted mt-0.5">
                Turns on browser notifications for all doses in this protocol at the times above.
                You can turn them all off anytime from the Reminders panel.
                {!notificationsSupported() && " (Your browser doesn't support notifications.)"}
              </span>
            </span>
          </label>

          <button onClick={() => setStep("review")} className="btn-primary w-full">
            Review my schedule →
          </button>
        </div>
      </div>
    );
  }

  // review step
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Review schedule</h2>
        <button onClick={() => setStep("calc")} className="btn-ghost text-sm">← Edit</button>
      </div>

      <SchedulePreview protocol={protocol} trackLabel={trackLabel} />

      <DosePreviewList rows={previewRows.slice(0, 21)} totalCount={previewRows.length} />

      <div className="card flex items-center gap-3 text-sm">
        <span
          className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
            enableReminders ? "bg-accent" : "bg-fg-subtle"
          }`}
        />
        <span className="text-fg-muted">
          {enableReminders
            ? `Reminders ON — you'll be notified at ${formatClock(morningTime)} and ${formatClock(eveningTime)}.`
            : "Reminders off. You can enable them later from the Reminders panel."}
        </span>
      </div>

      {error && <div className="card border-danger/30 bg-danger/10 text-danger text-sm">{error}</div>}

      <div className="flex gap-2">
        <button onClick={() => setStep("calc")} className="btn-secondary flex-1">Back</button>
        <button onClick={save} disabled={saving} className="btn-primary flex-1">
          {saving ? "Saving…" : `Save protocol & schedule ${previewRows.length} doses`}
        </button>
      </div>
    </div>
  );
}

function SchedulePreview({ protocol, trackLabel }: { protocol: StackProtocol; trackLabel: string }) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">{protocol.overview.title}</h3>
      <ul className="space-y-1.5 text-sm text-fg-muted">
        {protocol.overview.phases.map((p, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>{p.label}</span>
          </li>
        ))}
      </ul>
      {protocol.overview.note && (
        <p className="text-xs text-fg-subtle mt-3 italic">{protocol.overview.note}</p>
      )}

      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        <Mini title="Reta" body="Mondays AM" detail={protocol.reta.totalMaterial} />
        <Mini title="CJC + Ipa" body="Mon–Fri PM" detail={protocol.cjc.totalMaterial} />
        <Mini title="BPC + TB-500" body={trackLabel} detail={protocol.bpc.totalMaterial} />
      </div>
    </div>
  );
}

function Mini({ title, body, detail }: { title: string; body: string; detail: string }) {
  return (
    <div className="rounded-lg bg-bg-elev border border-border p-3">
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{title}</div>
      <div className="font-medium text-sm mt-0.5">{body}</div>
      <div className="text-xs text-fg-muted mt-0.5">{detail}</div>
    </div>
  );
}

function DosePreviewList({ rows, totalCount }: { rows: any[]; totalCount: number }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">First doses</h3>
        <span className="text-xs text-fg-subtle">Showing {rows.length} of {totalCount}</span>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r, i) => (
          <li key={i} className="py-2 flex items-center justify-between text-sm">
            <div>
              <div className="font-medium">{r.peptide_name}</div>
              <div className="text-xs text-fg-subtle">{r.notes ?? ""}</div>
            </div>
            <div className="text-right">
              <div className="font-display text-sm">{r.dose_mg} mg</div>
              <div className="text-xs text-fg-subtle">{r.scheduled_for} · {r.time_of_day}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Num({ label, v, on }: { label: string; v: number; on: (n: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        value={v}
        onChange={(e) => on(Number(e.target.value))}
      />
    </div>
  );
}

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const diff = (8 - day) % 7; // next Monday (>= 1 day away if today is Mon)
  d.setDate(d.getDate() + (diff === 0 ? 7 : diff));
  return localDateISO(d);
}

function dayName(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

function formatClock(t: string): string {
  const [hStr, mStr] = t.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}
