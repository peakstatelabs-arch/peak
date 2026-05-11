"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

type Weight = { id: string; weight_lb: number; logged_for: string; notes: string | null };
type Measurement = { id: string; logged_for: string; waist_in: number | null; chest_in: number | null; hip_in: number | null; arm_in: number | null; thigh_in: number | null; body_fat_pct: number | null; notes: string | null };

export function BodyTrackerClient({
  weights,
  measurements,
  goalWeight,
}: {
  weights: Weight[];
  measurements: Measurement[];
  goalWeight: number | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState(goalWeight?.toString() ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function logWeight(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("body_weight_logs").upsert({
      user_id: user!.id,
      weight_lb: Number(weight),
      logged_for: todayISO(),
    }, { onConflict: "user_id,logged_for" });
    setSaving(false);
    if (error) { setError("Couldn't save. Try again."); return; }
    setSuccess("Logged.");
    setWeight("");
    router.refresh();
  }

  async function saveGoal() {
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("profiles").update({ goal_weight_lb: goal ? Number(goal) : null }).eq("id", user!.id);
    setSuccess("Goal updated.");
    router.refresh();
  }

  const chart = [...weights].reverse().map((w) => ({ d: w.logged_for, w: w.weight_lb }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <form onSubmit={logWeight} className="card md:col-span-2">
          <h3 className="font-semibold mb-3">Today's weigh-in</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              className="input flex-1"
              placeholder="Weight (lb)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? "…" : "Log"}
            </button>
          </div>
          {success && <p className="text-success text-sm mt-2">{success}</p>}
          {error && <p className="text-danger text-sm mt-2">{error}</p>}
        </form>

        <div className="card">
          <h3 className="font-semibold mb-3">Goal weight</h3>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.5"
              className="input flex-1"
              placeholder="lb"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <button onClick={saveGoal} className="btn-secondary">Save</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Trend</h3>
        {chart.length < 2 ? (
          <p className="text-sm text-fg-muted">Log at least two weigh-ins to see the trend.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={chart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
                <YAxis tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "rgb(var(--bg-card))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} />
                {goalWeight && <ReferenceLine y={goalWeight} stroke="rgb(var(--accent))" strokeDasharray="4 4" label={{ value: "goal", fill: "rgb(var(--accent))", fontSize: 10 }} />}
                <Line type="monotone" dataKey="w" stroke="rgb(var(--accent))" strokeWidth={2} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <MeasurementsCard initial={measurements} />

      <div className="card">
        <h3 className="font-semibold mb-3">History</h3>
        {weights.length === 0 ? (
          <p className="text-sm text-fg-muted">No weigh-ins logged yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {weights.slice(0, 20).map((w) => (
              <li key={w.id} className="flex justify-between py-2 text-sm">
                <span className="text-fg-muted">{w.logged_for}</span>
                <span className="font-medium">{w.weight_lb} lb</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MeasurementsCard({ initial }: { initial: Measurement[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [waist, setWaist] = useState("");
  const [chest, setChest] = useState("");
  const [hip, setHip] = useState("");
  const [arm, setArm] = useState("");
  const [thigh, setThigh] = useState("");
  const [bf, setBf] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("body_measurements").insert({
      user_id: user!.id,
      logged_for: todayISO(),
      waist_in: waist ? Number(waist) : null,
      chest_in: chest ? Number(chest) : null,
      hip_in: hip ? Number(hip) : null,
      arm_in: arm ? Number(arm) : null,
      thigh_in: thigh ? Number(thigh) : null,
      body_fat_pct: bf ? Number(bf) : null,
    });
    setSaving(false);
    setOpen(false);
    setWaist(""); setChest(""); setHip(""); setArm(""); setThigh(""); setBf("");
    router.refresh();
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Measurements</h3>
        <button onClick={() => setOpen((v) => !v)} className="btn-secondary text-xs">
          {open ? "Cancel" : "+ Log measurements"}
        </button>
      </div>
      {open && (
        <form onSubmit={save} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          <Num label="Waist (in)" v={waist} on={setWaist} />
          <Num label="Chest (in)" v={chest} on={setChest} />
          <Num label="Hip (in)" v={hip} on={setHip} />
          <Num label="Arm (in)" v={arm} on={setArm} />
          <Num label="Thigh (in)" v={thigh} on={setThigh} />
          <Num label="Body fat %" v={bf} on={setBf} />
          <div className="col-span-full">
            <button disabled={saving} className="btn-primary w-full">{saving ? "Saving…" : "Save measurements"}</button>
          </div>
        </form>
      )}
      {initial.length === 0 ? (
        <p className="text-sm text-fg-muted">No measurements logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-fg-subtle text-xs uppercase tracking-wide">
              <tr><th className="text-left py-2">Date</th><th>Waist</th><th>Chest</th><th>Hip</th><th>Arm</th><th>Thigh</th><th>BF%</th></tr>
            </thead>
            <tbody>
              {initial.slice(0, 8).map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="py-2 text-fg-muted">{m.logged_for}</td>
                  <td className="text-center">{m.waist_in ?? "—"}</td>
                  <td className="text-center">{m.chest_in ?? "—"}</td>
                  <td className="text-center">{m.hip_in ?? "—"}</td>
                  <td className="text-center">{m.arm_in ?? "—"}</td>
                  <td className="text-center">{m.thigh_in ?? "—"}</td>
                  <td className="text-center">{m.body_fat_pct ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Num({ label, v, on }: { label: string; v: string; on: (s: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" step="0.1" className="input" value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}
