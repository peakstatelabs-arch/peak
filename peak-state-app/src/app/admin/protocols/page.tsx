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
  const emailById = new Map<string, string>(users.map((u: any) => [u.id, u.email]));

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
      <section className="card">
        <h3 className="font-semibold mb-3">Recent assignments</h3>
        <table className="w-full text-sm">
          <thead className="text-fg-subtle text-xs uppercase tracking-wide">
            <tr><th className="text-left py-2">Client</th><th className="text-left">Name</th><th className="text-left">Peptide</th><th className="text-left">Dose</th><th className="text-left">Freq</th><th className="text-left">Start</th></tr>
          </thead>
          <tbody>
            {protocols?.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="py-2">{clients.find((c) => c.id === p.user_id)?.label.split(" — ")[0] ?? "—"}</td>
                <td>{p.name}</td>
                <td>{p.peptide_name}</td>
                <td>{p.dose_mg} mg</td>
                <td>{p.frequency}</td>
                <td className="text-fg-muted">{p.start_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
