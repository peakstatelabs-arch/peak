"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getStackProtocol } from "@/lib/protocols";
import {
  generatePowerCutSchedule,
  generateSingleSchedule,
  type DoseRow,
} from "@/lib/schedule";
import { EnableRemindersButton } from "@/app/welcome/EnableRemindersButton";

type Path = "choose" | "power-cut" | "singles";
type Track = "foundation" | "performance";
type SingleSlug = "reta" | "cjc" | "bpc" | "ghk";

const DAY_MS = 86400000;

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay() === 0 ? 7 : d.getDay();
  const offset = day === 1 ? 7 : 8 - day; // always *next* Monday, never today
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const TRACK_META: Record<Track, { label: string; frequency: string; blurb: string }> = {
  foundation: {
    label: "Foundation",
    frequency: "BPC 2× weekly",
    blurb:
      "Designed for simplicity and consistency. Best for those who want effective recovery with minimal injections and low friction.",
  },
  performance: {
    label: "Performance",
    frequency: "BPC 3× weekly",
    blurb:
      "Increased frequency for enhanced recovery signaling. Ideal for those looking to maximize results and don't mind a slightly higher level of commitment.",
  },
};

type SingleConfig = {
  slug: SingleSlug;
  label: string;
  blurb: string;
  peptide_name: string;
  dose_mg: number;
  frequency: "weekly" | "five-on-two-off" | "twice-weekly" | "thrice-weekly" | "daily";
  time_of_day: "morning" | "evening";
};

const SINGLES: SingleConfig[] = [
  {
    slug: "reta",
    label: "Retatrutide",
    blurb: "Once weekly · Monday AM",
    peptide_name: "Retatrutide",
    dose_mg: 2.0,
    frequency: "weekly",
    time_of_day: "morning",
  },
  {
    slug: "cjc",
    label: "CJC-1295 + Ipamorelin",
    blurb: "Mon–Fri PM, fasted",
    peptide_name: "CJC-1295 + Ipamorelin",
    dose_mg: 0.3,
    frequency: "five-on-two-off",
    time_of_day: "evening",
  },
  {
    slug: "bpc",
    label: "BPC-157 + TB-500",
    blurb: "2× or 3× weekly · evening",
    peptide_name: "BPC-157 + TB-500",
    dose_mg: 2.0,
    frequency: "twice-weekly", // foundation default; overridden if user picks performance
    time_of_day: "evening",
  },
  {
    slug: "ghk",
    label: "GHK-Cu",
    blurb: "Daily · evening",
    peptide_name: "GHK-Cu",
    dose_mg: 2.0,
    frequency: "daily",
    time_of_day: "evening",
  },
];

export function ProtocolWizard({
  firstName,
  morningTime,
  eveningTime,
  existingGoalWeight,
}: {
  firstName: string | null;
  morningTime: string;
  eveningTime: string;
  existingGoalWeight: number | null;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [path, setPath] = useState<Path>("choose");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // POWER CUT inputs
  const [track, setTrack] = useState<Track>("foundation");
  const [stacks, setStacks] = useState(1);
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<string>(existingGoalWeight?.toString() ?? "");
  const [currentBF, setCurrentBF] = useState<string>("");
  const [goalBF, setGoalBF] = useState<string>("");
  const [powerCutStart, setPowerCutStart] = useState(nextMondayISO());

  // Singles inputs
  const [selectedSingles, setSelectedSingles] = useState<Set<SingleSlug>>(new Set());
  const [bpcVariant, setBpcVariant] = useState<Track>("foundation");
  const [singlesStart, setSinglesStart] = useState(todayISO());

  function toggleSingle(slug: SingleSlug) {
    setSelectedSingles((s) => {
      const next = new Set(s);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function savePowerCut() {
    setBusy(true);
    setError(null);
    try {
      const cw = currentWeight ? Number(currentWeight) : null;
      const gw = goalWeight ? Number(goalWeight) : null;
      if (!cw || !gw) {
        setError("Current and goal weight are required.");
        setBusy(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not signed in."); setBusy(false); return; }

      const protocol = getStackProtocol(stacks);
      if (!protocol) { setError("Invalid stack count."); setBusy(false); return; }

      // Profile updates: goal weight + stash metadata
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await supabase
        .from("profiles")
        .update({
          goal_weight_lb: gw,
          timezone: tz,
          morning_time: morningTime,
          evening_time: eveningTime,
        })
        .eq("id", user.id);

      // Optionally also log a baseline weight + body fat
      const today = todayISO();
      await supabase
        .from("body_weight_logs")
        .upsert({ user_id: user.id, weight_lb: cw, logged_for: today }, { onConflict: "user_id,logged_for" });
      if (currentBF) {
        await supabase
          .from("body_measurements")
          .insert({ user_id: user.id, logged_for: today, body_fat_pct: Number(currentBF) });
      }

      const protocolType = `power_cut_${track}`;
      const name = `POWER CUT™ — ${track === "foundation" ? "Foundation" : "Performance"} (${stacks} stack${stacks > 1 ? "s" : ""})`;
      const endDate = new Date(new Date(powerCutStart + "T00:00:00").getTime() + protocol.totalWeeks * 7 * DAY_MS)
        .toISOString().slice(0, 10);

      const peptideNames = ["Retatrutide", "CJC-1295 + Ipamorelin", "BPC-157 + TB-500"];
      const inserts = peptideNames.map((peptide_name) => ({
        user_id: user.id,
        name: `${name} · ${peptide_name}`,
        peptide_name,
        dose_mg: 0,
        frequency: peptide_name === "Retatrutide" ? "weekly" : peptide_name === "CJC-1295 + Ipamorelin" ? "five-on-two-off" : track === "foundation" ? "twice-weekly" : "thrice-weekly",
        time_of_day: peptide_name === "Retatrutide" ? "morning" : "evening",
        start_date: powerCutStart,
        end_date: endDate,
        active: true,
        protocol_type: protocolType,
        stacks,
        bpc_track: track,
      }));
      const { error: pErr } = await supabase.from("peptide_protocols").insert(inserts);
      if (pErr) { setError("Couldn't save protocol: " + pErr.message); setBusy(false); return; }

      // Generate doses
      const rows = generatePowerCutSchedule({
        protocol,
        bpc: track,
        startDate: new Date(powerCutStart + "T00:00:00"),
      });
      const dErr = await insertDoses(supabase, user.id, rows);
      if (dErr) { setError(dErr); setBusy(false); return; }

      setSaved(true);
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
      setBusy(false);
    }
  }

  async function saveSingles() {
    setBusy(true);
    setError(null);
    try {
      if (selectedSingles.size === 0) {
        setError("Pick at least one vial.");
        setBusy(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("Not signed in."); setBusy(false); return; }

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await supabase
        .from("profiles")
        .update({ timezone: tz, morning_time: morningTime, evening_time: eveningTime })
        .eq("id", user.id);

      const startDateObj = new Date(singlesStart + "T00:00:00");
      const endDate = new Date(startDateObj.getTime() + 12 * 7 * DAY_MS).toISOString().slice(0, 10);

      // Build protocol + dose inserts for every selected vial
      const protocolInserts: Record<string, unknown>[] = [];
      const doseRows: DoseRow[] = [];

      for (const slug of selectedSingles) {
        const cfg = SINGLES.find((s) => s.slug === slug)!;
        const freq =
          slug === "bpc" && bpcVariant === "performance"
            ? "thrice-weekly"
            : cfg.frequency;

        protocolInserts.push({
          user_id: user.id,
          name: cfg.label,
          peptide_name: cfg.peptide_name,
          dose_mg: cfg.dose_mg,
          frequency: freq,
          time_of_day: cfg.time_of_day,
          start_date: singlesStart,
          end_date: endDate,
          active: true,
          protocol_type: `single_${slug}`,
          stacks: null,
          bpc_track: slug === "bpc" ? bpcVariant : null,
        });

        const rows = generateSingleSchedule({
          peptide_name: cfg.peptide_name,
          dose_mg: cfg.dose_mg,
          frequency: freq,
          time_of_day: cfg.time_of_day,
          startDate: startDateObj,
          weeks: 12,
        });
        doseRows.push(...rows);
      }

      const { error: pErr } = await supabase.from("peptide_protocols").insert(protocolInserts);
      if (pErr) { setError("Couldn't save protocols: " + pErr.message); setBusy(false); return; }

      const dErr = await insertDoses(supabase, user.id, doseRows);
      if (dErr) { setError(dErr); setBusy(false); return; }

      setSaved(true);
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save.");
      setBusy(false);
    }
  }

  /* ── Saved screen: reminders + finish ────────────────────────────── */
  if (saved) {
    return (
      <div className="card text-center">
        <div className="text-3xl mb-2">✓</div>
        <h2 className="font-display text-xl font-semibold">You're locked in.</h2>
        <p className="text-sm text-fg-muted mt-2">
          Your schedule + calendar are ready. One last thing — turn on reminders so we ping you
          before every dose.
        </p>
        <div className="mt-6">
          <EnableRemindersButton />
          <button
            type="button"
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
            className="block mt-3 mx-auto text-sm text-fg-subtle hover:text-fg"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 1: top-level choice ────────────────────────────────────── */
  if (path === "choose") {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {firstName ? `Hey ${firstName}.` : "Let's set up your protocol."}
          </h2>
          <p className="mt-2 text-fg-muted text-sm">
            Pick what you're starting with. You can tweak any of this later.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setPath("power-cut")}
            className="card text-left hover:border-accent transition"
          >
            <h3 className="font-display text-lg font-semibold">POWER CUT™ Stack</h3>
            <p className="text-sm text-fg-muted mt-1">
              Our signature stack of Retatrutide, CJC/Ipa, and BPC/TB.
            </p>
            <div className="mt-3 text-xs text-accent font-medium">Configure →</div>
          </button>

          <button
            type="button"
            onClick={() => setPath("singles")}
            className="card text-left hover:border-accent transition"
          >
            <h3 className="font-display text-lg font-semibold">Single Vials</h3>
            <p className="text-sm text-fg-muted mt-1">
              Pick one or more individual peptides — Retatrutide, CJC/Ipa, BPC/TB, or GHK-Cu.
            </p>
            <div className="mt-3 text-xs text-accent font-medium">Configure →</div>
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 2: POWER CUT details ───────────────────────────────────── */
  if (path === "power-cut") {
    const weightLoss = currentWeight && goalWeight ? Number(currentWeight) - Number(goalWeight) : null;
    return (
      <div className="space-y-5">
        <button onClick={() => setPath("choose")} className="text-sm text-fg-muted hover:text-fg">
          ← Back
        </button>

        <div className="card space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold">POWER CUT™ Stack</h2>
            <p className="text-sm text-fg-muted mt-1">
              We'll generate your full week-by-week schedule. Adjust later anytime.
            </p>
          </div>

          {/* Foundation vs Performance */}
          <div>
            <label className="label">Track</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {(["foundation", "performance"] as const).map((t) => {
                const meta = TRACK_META[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTrack(t)}
                    className={
                      "rounded-lg border px-3 py-3 text-left text-sm " +
                      (track === t
                        ? "border-accent bg-accent/10 text-fg"
                        : "border-border bg-bg-elev text-fg-muted hover:text-fg")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium">{meta.label}</div>
                      <div className="text-xs text-fg-subtle">{meta.frequency}</div>
                    </div>
                    <div className="text-xs text-fg-muted mt-1 leading-snug">
                      {meta.blurb}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stacks */}
          <div>
            <label className="label">How many stacks</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStacks(n)}
                  className={
                    "rounded-lg border px-3 py-3 text-sm " +
                    (stacks === n
                      ? "border-accent bg-accent/10 text-fg font-medium"
                      : "border-border bg-bg-elev text-fg-muted hover:text-fg")
                  }
                >
                  {n} stack{n > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Current weight (lb)</label>
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="195"
              />
            </div>
            <div>
              <label className="label">Goal weight (lb)</label>
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={goalWeight}
                onChange={(e) => setGoalWeight(e.target.value)}
                placeholder="170"
              />
            </div>
          </div>

          {/* Body fat (optional) */}
          <div>
            <label className="label">Body fat % <span className="text-fg-subtle">(optional)</span></label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={currentBF}
                onChange={(e) => setCurrentBF(e.target.value)}
                placeholder="Current"
              />
              <input
                type="number"
                inputMode="decimal"
                className="input"
                value={goalBF}
                onChange={(e) => setGoalBF(e.target.value)}
                placeholder="Goal"
              />
            </div>
          </div>

          {/* Start date */}
          <div>
            <label className="label">Start date</label>
            <input
              type="date"
              className="input"
              value={powerCutStart}
              onChange={(e) => setPowerCutStart(e.target.value)}
              min={todayISO()}
            />
            <p className="text-xs text-fg-subtle mt-1">Defaults to next Monday so doses land cleanly on weekdays.</p>
          </div>

          {weightLoss !== null && weightLoss > 0 && (
            <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 text-sm">
              Targeting <span className="font-semibold">{weightLoss.toFixed(1)} lb</span> over the
              full {getStackProtocol(stacks)?.totalWeeks ?? 24}-week protocol.
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <button onClick={savePowerCut} disabled={busy} className="btn-primary w-full text-base py-3">
            {busy ? "Locking it in…" : "Lock it in"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 2: Singles ─────────────────────────────────────────────── */
  return (
    <div className="space-y-5">
      <button onClick={() => setPath("choose")} className="text-sm text-fg-muted hover:text-fg">
        ← Back
      </button>

      <div className="card space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">Single Vials</h2>
          <p className="text-sm text-fg-muted mt-1">
            Tap each vial you're taking. We'll preset the dosing for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SINGLES.map((s) => {
            const on = selectedSingles.has(s.slug);
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => toggleSingle(s.slug)}
                className={
                  "rounded-lg border px-4 py-3 text-left transition " +
                  (on
                    ? "border-accent bg-accent/10"
                    : "border-border bg-bg-elev hover:text-fg")
                }
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.label}</div>
                  <span
                    className={
                      "h-5 w-5 rounded-full border flex items-center justify-center " +
                      (on ? "bg-accent border-accent text-accent-fg" : "border-border")
                    }
                  >
                    {on && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </span>
                </div>
                <div className="text-xs text-fg-subtle mt-0.5">{s.blurb}</div>
              </button>
            );
          })}
        </div>

        {selectedSingles.has("bpc") && (
          <div>
            <label className="label">BPC-157 + TB-500 frequency</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {(["foundation", "performance"] as const).map((t) => {
                const meta = TRACK_META[t];
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBpcVariant(t)}
                    className={
                      "rounded-lg border px-3 py-3 text-left text-sm " +
                      (bpcVariant === t
                        ? "border-accent bg-accent/10 text-fg"
                        : "border-border bg-bg-elev text-fg-muted hover:text-fg")
                    }
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium">{meta.label}</div>
                      <div className="text-xs text-fg-subtle">
                        {t === "foundation" ? "2× weekly" : "3× weekly"}
                      </div>
                    </div>
                    <div className="text-xs text-fg-muted mt-1 leading-snug">{meta.blurb}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="label">Start date</label>
          <input
            type="date"
            className="input"
            value={singlesStart}
            onChange={(e) => setSinglesStart(e.target.value)}
            min={todayISO()}
          />
        </div>

        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          onClick={saveSingles}
          disabled={busy || selectedSingles.size === 0}
          className="btn-primary w-full text-base py-3"
        >
          {busy ? "Locking it in…" : `Lock in ${selectedSingles.size || "your"} protocol${selectedSingles.size === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}

async function insertDoses(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  rows: DoseRow[]
): Promise<string | null> {
  // Wipe future unlogged doses so a fresh setup gives a clean calendar.
  const today = todayISO();
  await supabase
    .from("peptide_doses")
    .delete()
    .eq("user_id", userId)
    .gte("scheduled_for", today)
    .eq("taken", false);

  const batch = 200;
  for (let i = 0; i < rows.length; i += batch) {
    const slice = rows.slice(i, i + batch).map((r) => ({
      user_id: userId,
      peptide_name: r.peptide_name,
      dose_mg: r.dose_mg,
      scheduled_for: r.scheduled_for,
      time_of_day: r.time_of_day,
      taken: false,
      notes: r.notes,
    }));
    const { error } = await supabase.from("peptide_doses").insert(slice);
    if (error) return `Couldn't save doses: ${error.message}`;
  }
  return null;
}
