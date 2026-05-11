import { createAdminClient, createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CreateClientForm } from "./CreateClientForm";

export default async function AdminClientsPage() {
  const admin = createAdminClient();
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role, must_change_password, created_at")
    .order("created_at", { ascending: false });

  const { data: { users } = { users: [] } } = await admin.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map<string, string>(users.map((u: any) => [u.id, u.email]));

  return (
    <>
      <PageHeader title="Clients" description="Create accounts and review who's onboarded." />

      <section className="card mb-6">
        <h3 className="font-semibold mb-3">Create new client</h3>
        <CreateClientForm />
      </section>

      <section className="card">
        <h3 className="font-semibold mb-3">All clients ({profiles?.length ?? 0})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-fg-subtle text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Role</th>
                <th className="text-left">First login</th>
                <th className="text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {profiles?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="py-2">{[p.first_name, p.last_name].filter(Boolean).join(" ") || "—"}</td>
                  <td className="text-fg-muted">{emailById.get(p.id) ?? "—"}</td>
                  <td>{p.role}</td>
                  <td>{p.must_change_password ? <span className="chip">Pending</span> : <span className="chip-accent">Done</span>}</td>
                  <td className="text-fg-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
