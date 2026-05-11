"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PEPTIDES } from "@/lib/peptides";

export function AssignProtocolForm({ clients }: { clients: { id: string; label: string }[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [name, setName] = useState("");
  const [peptide, setPeptide] = useState(PEPTIDES[0].name);
  const [dose, setDose] = useState(0.5);
  const [frequency, setFrequency] = useState("weekly");
  const [time, setTime] = useState("evening");
  const [days, setDays] = useState(28);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    const { error: pErr } = await supabase.from("peptide_protocols").insert({
      user_id: clientId,
      name,
      peptide_name: peptide,
      dose_mg: dose,
      frequency,
      time_of_day: time,
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      active: true,
    });

    if (pErr) { setSaving(false); setMsg({ ok: false, t: pErr.message }); return; }

    const step = frequency === "daily" ? 1 : frequency === "twice-weekly" ? 3 : frequency === "every-other-day" ? 2 : 7;
    const rows: any[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      rows.push({
        user_id: clientId,
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
    setMsg({ ok: true, t: "Protocol assigned." });
    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Client</label>
        <select className="input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label">Protocol name</label>
        <input required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Reta titration — month 1" />
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
      {msg && <div className={`sm:col-span-2 text-sm ${msg.ok ? "text-success" : "text-danger"}`}>{msg.t}</div>}
      <div className="sm:col-span-2">
        <button disabled={saving} className="btn-primary w-full">{saving ? "Assigning…" : "Assign protocol"}</button>
      </div>
    </form>
  );
}
