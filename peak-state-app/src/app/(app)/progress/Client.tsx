"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Legend } from "recharts";

type Weight = { logged_for: string; weight_lb: number };
type Dose = { scheduled_for: string; taken: boolean };
type CheckIn = { created_at: string; energy: number | null; sleep: number | null; mood: number | null };

export function ProgressClient({ weights, doses, checkins }: { weights: Weight[]; doses: Dose[]; checkins: CheckIn[] }) {
  if (weights.length === 0 && doses.length === 0 && checkins.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-fg-muted">Once you start logging, charts will populate here.</p>
      </div>
    );
  }

  const byDay = new Map<string, { total: number; done: number }>();
  for (const d of doses) {
    const e = byDay.get(d.scheduled_for) ?? { total: 0, done: 0 };
    e.total += 1;
    if (d.taken) e.done += 1;
    byDay.set(d.scheduled_for, e);
  }

  const combined = weights.map((w) => {
    const c = byDay.get(w.logged_for);
    return {
      d: w.logged_for,
      weight: w.weight_lb,
      compliance: c ? Math.round((c.done / c.total) * 100) : null,
    };
  });

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="font-semibold mb-3">Weight × compliance</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <ComposedChart data={combined} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
              <Tooltip contentStyle={{ background: "rgb(var(--bg-card))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="right" dataKey="compliance" name="Compliance %" fill="rgb(var(--accent))" opacity={0.3} />
              <Line yAxisId="left" type="monotone" dataKey="weight" name="Weight (lb)" stroke="rgb(var(--accent))" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {checkins.length > 1 && (
        <div className="card">
          <h3 className="font-semibold mb-3">Check-in trend</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={checkins.map((c) => ({ d: c.created_at.slice(0, 10), Energy: c.energy, Sleep: c.sleep, Mood: c.mood }))} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "rgb(var(--fg-subtle))" }} />
                <Tooltip contentStyle={{ background: "rgb(var(--bg-card))", border: "1px solid rgb(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="Energy" stroke="rgb(var(--accent))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Sleep" stroke="rgb(var(--fg))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Mood" stroke="rgb(var(--fg-muted))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
