"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/utils";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

type Weight = { id: string; weight_lb: number; logged_for: string; notes: string | null };
type BfEntry = { id: string; logged_for: string; body_fat_pct: number };

export function BodyTrackerClient({
  weights,
  bfEntries,
  goalWeight,
  goalBf,
  bfEnabled,
}: {
  weights: Weight[];
  bfEntries: BfEntry[];
  goalWeight: number | null;
  goalBf: number | null;
  bfEnabled: boolean;
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

      <BodyFatCard
        entries={bfEntries}
        goalBf={goalBf}
        enabled={bfEnabled}
      />

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

function BodyFatCard({
  entries,
  goalBf,
  enabled,
}: {
  entries: BfEntry[];
  goalBf: number | null;
  enabled: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [on, setOn] = useState(enabled);
  const [goal, setGoal] = useState(goalBf?.toString() ?? "");
  const [bf, setBf] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function toggle() {
    const next = !on;
    setOn(next);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from("profiles")
      .update({ bf_tracking_enabled: next })
      .eq("id", user!.id);
    router.refresh();
  }

  async function saveGoal() {
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ goal_bf_pct: goal ? Number(goal) : null })
      .eq("id", user!.id);
    if (error) { setErr("Couldn't save goal."); return; }
    setMsg("Goal updated.");
    router.refresh();
  }

  async function logBf(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    const today = todayISO();
    // One BF entry per day — replace today's if it exists, otherwise insert.
    const { data: existing } = await supabase
      .from("body_measurements")
      .select("id")
      .eq("user_id", user!.id)
      .eq("logged_for", today)
      .maybeSingle();
    const value = Number(bf);
    const { error } = existing
      ? await supabase
          .from("body_measurements")
          .update({ body_fat_pct: value })
          .eq("id", existing.id)
      : await supabase
          .from("body_measurements")
          .insert({ user_id: user!.id, logged_for: today, body_fat_pct: value });
    setSaving(false);
    if (error) { setErr("Couldn't save. Try again."); return; }
    setMsg("Logged.");
    setBf("");
    router.refresh();
  }

  const chart = [...entries].reverse().map((e) => ({ d: e.logged_for, b: e.body_fat_pct }));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Body fat</h3>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={toggle}
          className={
            "relative inline-flex h-6 w-11 items-center rounded-full transition " +
            (on ? "bg-accent" : "bg-border")
          }
        >
          <span
            className={
              "inline-block h-5 w-5 transform rounded-full bg-white transition " +
              (on ? "translate-x-5" : "translate-x-0.5")
            }
          />
        </button>
      </div>

      {!on ? (
        <p className="text-sm text-fg-muted">
          Body fat tracking is off. Flip the switch to set a goal and log weekly.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Goal body fat %</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  className="input flex-1"
                  placeholder="e.g. 15"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
                <button onClick={saveGoal} className="btn-secondary">Save</button>
              </div>
            </div>
            <form onSubmit={logBf}>
              <label className="label">Log this week</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  className="input flex-1"
                  placeholder="Body fat %"
                  value={bf}
                  onChange={(e) => setBf(e.target.value)}
                  required
                />
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? "…" : "Log"}
                </button>
              </div>
            </form>
          </div>

          {msg && <p className="text-success text-sm">{msg}</p>}
          {err && <p className="text-danger text-sm">{err}</p>}

          <div>
            <h4 className="text-sm font-medium text-fg-muted mb-2">Trend</h4>
            {chart.length < 2 ? (
              <p className="text-sm text-fg-muted">Log at least two entries to see the trend.</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer>
                  <LineChart data={chart} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <XAxis dataKey="d" tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip contentStyle={{ background: "rgb(var(--bg-card))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    {goalBf && <ReferenceLine y={goalBf} stroke="rgb(var(--accent))" strokeDasharray="4 4" label={{ value: "goal", fill: "rgb(var(--accent))", fontSize: 10 }} />}
                    <Line type="monotone" dataKey="b" stroke="rgb(var(--accent))" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium text-fg-muted mb-2">History</h4>
            {entries.length === 0 ? (
              <p className="text-sm text-fg-muted">No body fat entries yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {entries.slice(0, 12).map((e) => (
                  <li key={e.id} className="flex justify-between py-2 text-sm">
                    <span className="text-fg-muted">{e.logged_for}</span>
                    <span className="font-medium">{e.body_fat_pct}%</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
