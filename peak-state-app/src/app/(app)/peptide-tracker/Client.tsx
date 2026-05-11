"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PEPTIDES } from "@/lib/peptides";
import { todayISO } from "@/lib/utils";

type Protocol = {
  id: string;
  name: string;
  peptide_name: string;
  dose_mg: number;
  frequency: string;
  time_of_day: string | null;
  start_date: string;
  end_date: string | null;
  active: boolean;
};

type Dose = {
  id: string;
  peptide_name: string;
  dose_mg: number;
  scheduled_for: string;
  time_of_day: string | null;
  taken: boolean;
  taken_at: string | null;
  notes: string | null;
};

export function PeptideTrackerClient({ protocols, doses }: { protocols: Protocol[]; doses: Dose[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [pending, start] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleDose(d: Dose) {
    const next = !d.taken;
    const { error } = await supabase
      .from("peptide_doses")
      .update({ taken: next, taken_at: next ? new Date().toISOString() : null })
      .eq("id", d.id);
    if (error) {
      setError("Couldn't update that dose. Try again.");
      return;
    }
    start(() => router.refresh());
  }

  const grouped = doses.reduce<Record<string, Dose[]>>((acc, d) => {
    (acc[d.scheduled_for] = acc[d.scheduled_for] || []).push(d);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {error && (
        <div className="card border-danger/30 bg-danger/10 text-danger text-sm">{error}</div>
      )}

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Active protocols</h2>
          <button onClick={() => setShowAdd((v) => !v)} className="btn-secondary text-xs">
            {showAdd ? "Cancel" : "+ New protocol"}
          </button>
        </div>
        {showAdd && <NewProtocolForm onCreated={() => { setShowAdd(false); router.refresh(); }} />}
        {protocols.length === 0 && !showAdd ? (
          <p className="text-sm text-fg-muted">No protocols yet. Start by adding one above.</p>
        ) : (
          <ul className="divide-y divide-border mt-2">
            {protocols.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-fg-muted mt-0.5">
                    {p.peptide_name} · {p.dose_mg} mg · {p.frequency}
                    {p.time_of_day ? ` · ${p.time_of_day}` : ""}
                  </div>
                </div>
                <span className={`chip ${p.active ? "chip-accent" : ""}`}>
                  {p.active ? "Active" : "Paused"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="font-semibold mb-3">Recent doses</h2>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-sm text-fg-muted">
            No doses scheduled. Add a protocol — daily doses will populate automatically when you log them.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([day, list]) => (
              <div key={day}>
                <div className="text-xs uppercase tracking-wide text-fg-subtle mb-2">{day}</div>
                <ul className="space-y-1.5">
                  {list.map((d) => (
                    <li key={d.id}>
                      <button
                        onClick={() => toggleDose(d)}
                        disabled={pending}
                        className="w-full flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elev px-3 py-2.5 hover:border-accent/40 text-left transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-4 w-4 rounded-full border-2 ${d.taken ? "border-accent bg-accent" : "border-border"}`} />
                          <div>
                            <div className="text-sm font-medium">{d.peptide_name}</div>
                            <div className="text-xs text-fg-subtle">{d.dose_mg} mg{d.time_of_day ? ` · ${d.time_of_day}` : ""}</div>
                          </div>
                        </div>
                        <span className="text-xs text-fg-muted">{d.taken ? "Logged" : "Tap to log"}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function NewProtocolForm({ onCreated }: { onCreated: () => void }) {
  const supabase = createClient();
  const [name, setName] = useState("");
  const [peptide, setPeptide] = useState(PEPTIDES[0].name);
  const [dose, setDose] = useState(0.5);
  const [frequency, setFrequency] = useState("weekly");
  const [time, setTime] = useState("evening");
  const [days, setDays] = useState(28);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    const { error: pErr } = await supabase.from("peptide_protocols").insert({
      user_id: user.id,
      name,
      peptide_name: peptide,
      dose_mg: dose,
      frequency,
      time_of_day: time,
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      active: true,
    });
    if (pErr) { setError("Couldn't save protocol."); setSaving(false); return; }

    // generate dose rows
    const rows: any[] = [];
    const step = frequency === "daily" ? 1 : frequency === "twice-weekly" ? 3 : frequency === "every-other-day" ? 2 : 7;
    const cursor = new Date(start);
    while (cursor <= end) {
      rows.push({
        user_id: user.id,
        peptide_name: peptide,
        dose_mg: dose,
        scheduled_for: cursor.toISOString().slice(0, 10),
        time_of_day: time,
        taken: false,
      });
      cursor.setDate(cursor.getDate() + step);
    }
    if (rows.length) await supabase.from("peptide_doses").insert(rows);

    setSaving(false);
    onCreated();
  }

  return (
    <form onSubmit={save} className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border bg-bg-elev p-4 mb-4">
      <div className="sm:col-span-2">
        <label className="label">Protocol name</label>
        <input className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Reta titration — month 1" />
      </div>
      <div>
        <label className="label">Peptide</label>
        <select className="input" value={peptide} onChange={(e) => setPeptide(e.target.value)}>
          {PEPTIDES.map((p) => <option key={p.slug}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Dose (mg)</label>
        <input type="number" step="0.05" className="input" value={dose} onChange={(e) => setDose(Number(e.target.value))} />
      </div>
      <div>
        <label className="label">Frequency</label>
        <select className="input" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="every-other-day">Every other day</option>
          <option value="twice-weekly">Twice weekly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <div>
        <label className="label">Time</label>
        <select className="input" value={time} onChange={(e) => setTime(e.target.value)}>
          <option value="morning">Morning</option>
          <option value="midday">Midday</option>
          <option value="evening">Evening</option>
          <option value="bedtime">Bedtime</option>
        </select>
      </div>
      <div>
        <label className="label">Duration (days)</label>
        <input type="number" className="input" value={days} onChange={(e) => setDays(Number(e.target.value))} />
      </div>
      {error && <div className="sm:col-span-2 text-sm text-danger">{error}</div>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Saving…" : "Create protocol"}
        </button>
      </div>
    </form>
  );
}
