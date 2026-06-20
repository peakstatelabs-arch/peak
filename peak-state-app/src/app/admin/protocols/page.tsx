import { createAdminClient, createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { AssignProtocolForm } from "./AssignProtocolForm";

export default async function ProtocolsPage() {
  const admin = createAdminClient();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role", "client")
    .order("first_name");

  const { data: { users } = { users: [] } } = await admin.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map<string, string>(users.map((u) => [u.id, u.email ?? ""]));

  const clients = (profiles ?? []).map((p) => ({
    id: p.id,
    label: `${[p.first_name, p.last_name].filter(Boolean).join(" ") || emailById.get(p.id) || "Client"} — ${emailById.get(p.id) ?? ""}`,
  }));

  const { data: protocols } = await admin
    .from("peptide_protocols")
    .select("id, name, peptide_name, dose_mg, frequency, time_of_day, user_id, active, start_date")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <PageHeader title="Assign protocols" description="Push a peptide protocol directly to a client's tracker." />

      <section className="card mb-6">
        <AssignProtocolForm clients={clients} />
      </section>

      <section>
        <h3 className="font-semibold mb-3">Recent assignments</h3>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-3">
          {(!protocols || protocols.length === 0) && (
            <div className="card text-center text-fg-muted">No protocols yet.</div>
          )}
          {protocols?.map((p) => {
            const clientName =
              clients.find((c) => c.id === p.user_id)?.label.split(" — ")[0] ?? "—";
            return (
              <div key={p.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{clientName}</div>
                    <div className="text-xs text-fg-subtle truncate">{p.name}</div>
                  </div>
                  {p.active ? (
                    <span className="chip-accent">Active</span>
                  ) : (
                    <span className="chip">Ended</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <span className="chip">{p.peptide_name}</span>
                  <span className="chip">{p.dose_mg} mg</span>
                  <span className="chip">{p.frequency}</span>
                  {p.time_of_day && <span className="chip">{p.time_of_day}</span>}
                </div>
                <div className="mt-2 text-xs text-fg-subtle">Started {p.start_date}</div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-fg-subtle text-xs uppercase tracking-wide bg-bg-elev/40">
                <tr>
                  <th className="text-left px-4 py-3">Client</th>
                  <th className="text-left px-3 py-3">Name</th>
                  <th className="text-left px-3 py-3">Peptide</th>
                  <th className="text-left px-3 py-3">Dose</th>
                  <th className="text-left px-3 py-3">Freq</th>
                  <th className="text-left px-4 py-3">Start</th>
                </tr>
              </thead>
              <tbody>
                {protocols?.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-bg-elev/30">
                    <td className="px-4 py-3">{clients.find((c) => c.id === p.user_id)?.label.split(" — ")[0] ?? "—"}</td>
                    <td className="px-3 py-3">{p.name}</td>
                    <td className="px-3 py-3">{p.peptide_name}</td>
                    <td className="px-3 py-3">{p.dose_mg} mg</td>
                    <td className="px-3 py-3">{p.frequency}</td>
                    <td className="px-4 py-3 text-fg-muted">{p.start_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
