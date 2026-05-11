"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { todayISO, weekKey } from "@/lib/utils";

export function CheckInForm() {
  const router = useRouter();
  const supabase = createClient();
  const [weight, setWeight] = useState("");
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [mood, setMood] = useState(7);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    const { error: ciErr } = await supabase.from("weekly_checkins").insert({
      user_id: user.id,
      week_key: weekKey(),
      weight_lb: weight ? Number(weight) : null,
      energy,
      sleep,
      mood,
      notes: notes || null,
    });
    if (ciErr) { setError("Couldn't save. Try again."); setSaving(false); return; }

    if (weight) {
      await supabase.from("body_weight_logs").upsert({
        user_id: user.id,
        weight_lb: Number(weight),
        logged_for: todayISO(),
      }, { onConflict: "user_id,logged_for" });
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 800);
  }

  return (
    <form onSubmit={submit} className="card space-y-5">
      <div>
        <label className="label">Current weight (lb)</label>
        <input type="number" step="0.1" className="input" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Optional" />
      </div>
      <Slider label="Energy" value={energy} onChange={setEnergy} />
      <Slider label="Sleep quality" value={sleep} onChange={setSleep} />
      <Slider label="Mood" value={mood} onChange={setMood} />
      <div>
        <label className="label">Notes</label>
        <textarea
          className="input min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything notable this week? Side effects, wins, concerns…"
        />
      </div>
      {error && <p className="text-danger text-sm">{error}</p>}
      {success && <p className="text-success text-sm">Saved. Thanks for checking in.</p>}
      <button disabled={saving} className="btn-primary w-full">
        {saving ? "Submitting…" : "Submit check-in"}
      </button>
    </form>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-fg-muted">{label}</label>
        <span className="font-display text-lg font-semibold text-accent">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[rgb(var(--accent))]"
      />
    </div>
  );
}
