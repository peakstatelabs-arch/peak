import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";

export default async function CheckInsPage() {
  const admin = createAdminClient();
  const { data: checkins } = await admin
    .from("weekly_checkins")
    .select("id, user_id, week_key, weight_lb, energy, sleep, mood, notes, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, first_name, last_name");
  const nameById = new Map<string, string>(
    (profiles ?? []).map((p: any) => [p.id, [p.first_name, p.last_name].filter(Boolean).join(" ") || "Client"])
  );

  return (
    <>
      <PageHeader title="Weekly check-ins" description="All clients, most recent first." />
      <section className="card">
        {!checkins || checkins.length === 0 ? (
          <p className="text-sm text-fg-muted">No check-ins submitted yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {checkins.map((c) => (
              <li key={c.id} className="py-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{nameById.get(c.user_id) ?? "Client"}</span>
                  <span className="text-xs text-fg-subtle">{c.week_key} · {new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-fg-muted">
                  {c.weight_lb && <span className="chip">{c.weight_lb} lb</span>}
                  <span className="chip">Energy {c.energy}/10</span>
                  <span className="chip">Sleep {c.sleep}/10</span>
                  <span className="chip">Mood {c.mood}/10</span>
                </div>
                {c.notes && <p className="mt-2 text-sm text-fg-muted">{c.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
