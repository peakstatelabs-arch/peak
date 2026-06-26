"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Dose } from "./Client";

const RETA = "Retatrutide";
const MIN_MG = 0.25;
const MAX_MG = 8;
const STEP_MG = 0.25;

type Protocol = {
  peptide_name: string;
  protocol_type: string | null;
  active: boolean;
};

export function RetaDoseCard({
  protocols,
  doses,
  onChanged,
}: {
  protocols: Protocol[];
  doses: Dose[];
  onChanged: () => void;
}) {
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const hasReta = protocols.some((p) => p.active && p.peptide_name === RETA);
  if (!hasReta) return null;

  const isPowerCut = protocols.some(
    (p) => p.active && p.peptide_name === RETA && p.protocol_type?.startsWith("power_cut")
  );

  const today = new Date().toISOString().slice(0, 10);
  const futureReta = doses
    .filter((d) => d.peptide_name === RETA && d.scheduled_for >= today && !d.taken)
    .sort((a, b) => a.scheduled_for.localeCompare(b.scheduled_for));

  const currentDose = futureReta[0]?.dose_mg ?? null;
  const remainingWeeks = futureReta.length;

  function startEdit() {
    setEditing(true);
    setError(null);
    setMsg(null);
    setValue(currentDose !== null ? String(currentDose) : "");
  }
  function cancel() {
    setEditing(false);
    setError(null);
    setValue("");
  }

  async function save() {
    const num = Number(value);
    if (!Number.isFinite(num) || num < MIN_MG || num > MAX_MG) {
      setError(`Pick a value between ${MIN_MG} mg and ${MAX_MG} mg.`);
      return;
    }
    setBusy(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setBusy(false);
      return;
    }
    const { error: upErr } = await supabase
      .from("peptide_doses")
      .update({ dose_mg: num })
      .eq("user_id", user.id)
      .eq("peptide_name", RETA)
      .gte("scheduled_for", today)
      .eq("taken", false);
    if (upErr) {
      setError(`Couldn't save: ${upErr.message}`);
      setBusy(false);
      return;
    }
    setBusy(false);
    setEditing(false);
    setMsg(`Updated ${remainingWeeks} upcoming dose${remainingWeeks === 1 ? "" : "s"} to ${num} mg.`);
    onChanged();
  }

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Retatrutide weekly dose</h2>
          <p className="text-xs text-fg-muted mt-0.5">
            {currentDose !== null
              ? `Current: ${currentDose} mg/week`
              : "No upcoming Reta doses scheduled."}
            {remainingWeeks > 0 && ` · ${remainingWeeks} week${remainingWeeks === 1 ? "" : "s"} remaining`}
          </p>
        </div>
        {!editing && currentDose !== null && (
          <button onClick={startEdit} className="btn-secondary text-sm">
            Edit
          </button>
        )}
      </div>

      {editing && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="label">New weekly dose (mg)</label>
            <input
              type="number"
              min={MIN_MG}
              max={MAX_MG}
              step={STEP_MG}
              inputMode="decimal"
              className="input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </div>
          {isPowerCut && (
            <p className="text-xs text-fg-subtle leading-snug">
              POWER CUT's built-in titration will be replaced. Every remaining Reta dose in
              your stack will be set to this value.
            </p>
          )}
          {error && (
            <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger font-medium">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={save} disabled={busy} className="btn-primary flex-1">
              {busy ? "Saving…" : "Save"}
            </button>
            <button onClick={cancel} disabled={busy} className="btn-ghost">
              Cancel
            </button>
          </div>
        </div>
      )}

      {!editing && msg && (
        <div className="mt-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {msg}
        </div>
      )}
    </section>
  );
}
