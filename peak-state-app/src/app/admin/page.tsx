import Link from "next/link";
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
  const emailById = new Map<string, string>(users.map((u) => [u.id, u.email ?? ""]));

  return (
    <>
      <PageHeader title="Clients" description="Create accounts and review who's onboarded." />

      <section className="card mb-6">
        <h3 className="font-semibold mb-3">Create new client</h3>
        <CreateClientForm />
      </section>

      <section>
        <h3 className="font-semibold mb-3">All clients ({profiles?.length ?? 0})</h3>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-3">
          {(profiles ?? []).map((p) => {
            const name =
              [p.first_name, p.last_name].filter(Boolean).join(" ") ||
              emailById.get(p.id) ||
              "—";
            return (
              <Link
                key={p.id}
                href={p.role === "client" ? `/admin/clients/${p.id}` : "#"}
                className="card block active:bg-bg-elev/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{name}</div>
                    <div className="text-xs text-fg-subtle truncate">
                      {emailById.get(p.id) ?? "—"}
                    </div>
                  </div>
                  {p.must_change_password ? (
                    <span className="chip">Pending</span>
                  ) : (
                    <span className="chip-accent">Onboarded</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-fg-subtle">
                  {p.role} · joined {new Date(p.created_at).toLocaleDateString()}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-fg-subtle text-xs uppercase tracking-wide bg-bg-elev/40">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-3 py-3">Email</th>
                  <th className="text-left px-3 py-3">Role</th>
                  <th className="text-left px-3 py-3">First login</th>
                  <th className="text-left px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles?.map((p) => {
                  const name =
                    [p.first_name, p.last_name].filter(Boolean).join(" ") || "—";
                  return (
                    <tr key={p.id} className="border-t border-border hover:bg-bg-elev/30">
                      <td className="px-4 py-3">
                        {p.role === "client" ? (
                          <Link
                            href={`/admin/clients/${p.id}`}
                            className="font-medium hover:text-accent"
                          >
                            {name}
                          </Link>
                        ) : (
                          <span className="font-medium">{name}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-fg-muted">{emailById.get(p.id) ?? "—"}</td>
                      <td className="px-3 py-3">{p.role}</td>
                      <td className="px-3 py-3">
                        {p.must_change_password ? (
                          <span className="chip">Pending</span>
                        ) : (
                          <span className="chip-accent">Done</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-fg-muted">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
