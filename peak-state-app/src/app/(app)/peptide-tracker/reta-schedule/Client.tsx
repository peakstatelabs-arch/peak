"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type RetaDoseRow = {
  id: string;
  dose_mg: number;
  scheduled_for: string;
  taken: boolean;
  notes: string | null;
};

const MIN_MG = 0.25;
const MAX_MG = 8;
const STEP_MG = 0.25;

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RetaScheduleEditor({ rows }: { rows: RetaDoseRow[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const today = todayISO();
  const past = rows.filter((r) => r.taken || r.scheduled_for < today);
  const future = rows.filter((r) => !r.taken && r.scheduled_for >= today);

  // Week numbers anchored to the very first dose in the protocol.
  const firstDate = rows[0]?.scheduled_for;
  function weekOf(iso: string): number {
    if (!firstDate) return 1;
    const a = Date.parse(firstDate + "T00:00:00");
    const b = Date.parse(iso + "T00:00:00");
    return Math.floor((b - a) / (7 * 86400000)) + 1;
  }

  const pending = useMemo(() => {
    const out: { id: string; oldMg: number; newMg: number }[] = [];
    for (const [id, raw] of Object.entries(edits)) {
      const row = future.find((r) => r.id === id);
      if (!row) continue;
      const num = Number(raw);
      if (!Number.isFinite(num) || num === row.dose_mg) continue;
      out.push({ id, oldMg: row.dose_mg, newMg: num });
    }
    return out;
  }, [edits, future]);

  function setEdit(id: string, raw: string) {
    setEdits((prev) => ({ ...prev, [id]: raw }));
    setSuccess(null);
  }

  function resetAll() {
    setEdits({});
    setError(null);
    setSuccess(null);
  }

  async function saveAll() {
    setError(null);
    setSuccess(null);
    // Validate all pending edits up front so we don't half-save.
    for (const p of pending) {
      if (p.newMg < MIN_MG || p.newMg > MAX_MG) {
        setError(`Doses must be between ${MIN_MG} mg and ${MAX_MG} mg.`);
        return;
      }
    }
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not signed in.");
      setBusy(false);
      return;
    }
    // One UPDATE per row. Pending list is small (at most ~24 for POWER CUT).
    for (const p of pending) {
      const { error: upErr } = await supabase
        .from("peptide_doses")
        .update({ dose_mg: p.newMg })
        .eq("id", p.id)
        .eq("user_id", user.id);
      if (upErr) {
        setError(`Couldn't save: ${upErr.message}`);
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    setEdits({});
    setSuccess(
      `Updated ${pending.length} week${pending.length === 1 ? "" : "s"}.`
    );
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {future.length > 0 && (
        <section className="card">
          <h2 className="font-semibold mb-3">Upcoming weeks</h2>
          <ul className="divide-y divide-border">
            {future.map((r) => {
              const week = weekOf(r.scheduled_for);
              const raw = edits[r.id] ?? String(r.dose_mg);
              const changed = edits[r.id] !== undefined && Number(raw) !== r.dose_mg;
              return (
                <li key={r.id} className="py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">Week {week}</div>
                    <div className="text-xs text-fg-subtle">
                      {formatDate(r.scheduled_for)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      min={MIN_MG}
                      max={MAX_MG}
                      step={STEP_MG}
                      value={raw}
                      onChange={(e) => setEdit(r.id, e.target.value)}
                      className={
                        "input w-20 text-right " +
                        (changed ? "border-accent" : "")
                      }
                    />
                    <span className="text-xs text-fg-subtle">mg</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section className="card">
          <h2 className="font-semibold mb-3">Past weeks</h2>
          <ul className="divide-y divide-border">
            {past.map((r) => {
              const week = weekOf(r.scheduled_for);
              return (
                <li
                  key={r.id}
                  className="py-2 flex items-center justify-between text-sm text-fg-subtle"
                >
                  <div>
                    <div className={r.taken ? "line-through" : ""}>
                      Week {week}
                    </div>
                    <div className="text-xs">{formatDate(r.scheduled_for)}</div>
                  </div>
                  <div className={r.taken ? "line-through" : ""}>
                    {r.dose_mg} mg
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {(pending.length > 0 || error || success) && (
        <div className="sticky bottom-4 z-10">
          <div className="card border-accent/30 bg-bg-card/95 backdrop-blur">
            {error && (
              <div className="mb-3 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger font-medium">
                {error}
              </div>
            )}
            {success && pending.length === 0 && (
              <div className="mb-3 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                {success}
              </div>
            )}
            {pending.length > 0 && (
              <>
                <p className="text-sm text-fg-muted mb-3">
                  {pending.length} unsaved change{pending.length === 1 ? "" : "s"}.
                </p>
                <div className="flex gap-2">
                  <button onClick={saveAll} disabled={busy} className="btn-primary flex-1">
                    {busy ? "Saving…" : "Save changes"}
                  </button>
                  <button onClick={resetAll} disabled={busy} className="btn-ghost">
                    Discard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
