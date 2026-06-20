import Link from "next/link";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import {
  computeClientRows,
  sortRows,
  parseWindow,
  formatRelative,
  type ClientRow,
  type PillarKey,
} from "@/lib/admin/compliance";
import { WindowToggle } from "./WindowToggle";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const sp = await searchParams;
  const windowDays = parseWindow(sp.w);

  const admin = createAdminClient();
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role, active_program, active_program_started, nutrition_targets")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  const { data: { users } = { users: [] } } = await admin.auth.admin.listUsers({ perPage: 200 });
  const emailById = new Map<string, string>(users.map((u) => [u.id, u.email ?? ""]));

  const rows = await computeClientRows(admin, {
    profiles: (profiles ?? []).map((p) => ({
      id: p.id,
      first_name: p.first_name,
      last_name: p.last_name,
      active_program: p.active_program,
      active_program_started: p.active_program_started,
      nutrition_targets: p.nutrition_targets,
    })),
    emailById,
    windowDays,
  });

  const sorted = sortRows(rows);
  const flaggedCount = sorted.filter((r) => r.flags.length > 0).length;
  const summary = summarize(sorted);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold tracking-tight">
            Coaching dashboard
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Compliance and red flags across all {sorted.length} client{sorted.length === 1 ? "" : "s"}.
          </p>
        </div>
        <WindowToggle current={windowDays} />
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard label="Clients" value={String(sorted.length)} />
        <SummaryCard label="Flagged" value={String(flaggedCount)} tone={flaggedCount > 0 ? "danger" : "neutral"} />
        <SummaryCard label="Avg compliance" value={summary.avgPct === null ? "—" : `${summary.avgPct}%`} />
        <SummaryCard label="Active today" value={String(summary.activeToday)} />
      </section>

      {/* Mobile: stacked cards */}
      <section className="md:hidden space-y-3">
        {sorted.length === 0 && (
          <div className="card text-center text-fg-muted">No clients yet.</div>
        )}
        {sorted.map((row) => (
          <MobileCard key={row.id} row={row} />
        ))}
      </section>

      {/* Desktop: table */}
      <section className="hidden md:block card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-fg-subtle text-xs uppercase tracking-wide bg-bg-elev/40">
              <tr>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-3 py-3">On</th>
                <th className="text-right px-3 py-3">Overall</th>
                <PillarHead label="Peptide" />
                <PillarHead label="Workout" />
                <PillarHead label="Nutrition" />
                <PillarHead label="Check-in" />
                <th className="text-left px-3 py-3">Last activity</th>
                <th className="text-left px-4 py-3">Flags</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-fg-muted">
                    No clients yet.
                  </td>
                </tr>
              )}
              {sorted.map((row) => (
                <Row key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-4 text-xs text-fg-subtle">
        Pillars auto-activate when a client engages with that area (peptide protocol assigned, workout
        program or sessions, nutrition targets or meal logs). Inactive pillars are greyed and don&apos;t
        count toward the overall %.
      </p>
    </>
  );
}

function summarize(rows: ClientRow[]) {
  const withPct = rows.filter((r) => r.overallPct !== null);
  const avgPct = withPct.length
    ? Math.round(withPct.reduce((a, r) => a + (r.overallPct as number), 0) / withPct.length)
    : null;
  const dayMs = 86400000;
  const now = Date.now();
  const activeToday = rows.filter(
    (r) => r.lastActivity && now - Date.parse(r.lastActivity) < dayMs
  ).length;
  return { avgPct, activeToday };
}

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "danger";
}) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div
        className={
          "mt-1 text-2xl font-display font-semibold " +
          (tone === "danger" ? "text-danger" : "text-fg")
        }
      >
        {value}
      </div>
    </div>
  );
}

function PillarHead({ label }: { label: string }) {
  return <th className="text-right px-2 py-3 hidden md:table-cell">{label}</th>;
}

function MobileCard({ row }: { row: ClientRow }) {
  const name =
    [row.firstName, row.lastName].filter(Boolean).join(" ") || row.email || "—";
  return (
    <Link
      href={`/admin/clients/${row.id}`}
      className="card block active:bg-bg-elev/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="font-semibold truncate">{name}</div>
          <div className="text-xs text-fg-subtle truncate">{row.email}</div>
        </div>
        <OverallChip pct={row.overallPct} />
      </div>

      {(row.peptideProtocolName || row.programSlug) && (
        <div className="text-xs text-fg-muted mb-3 truncate">
          {row.peptideProtocolName ?? "—"}
          {row.programSlug && (
            <span className="text-fg-subtle">
              {" · "}
              {row.programSlug}
              {row.programWeek ? ` · Wk ${row.programWeek}` : ""}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 mb-3">
        <MiniPillar label="Pep" stat={row.pillars.peptide} />
        <MiniPillar label="Wrk" stat={row.pillars.workout} />
        <MiniPillar label="Nut" stat={row.pillars.nutrition} />
        <MiniPillar label="Chk" stat={row.pillars.checkin} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-fg-subtle">{formatRelative(row.lastActivity)}</span>
        {row.flags.length > 0 ? (
          <div className="flex flex-wrap justify-end gap-1">
            {row.flags.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center rounded-full bg-danger/10 border border-danger/30 text-danger px-2 py-0.5 text-[11px] font-medium"
              >
                {f.label}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-accent">✓ No flags</span>
        )}
      </div>
    </Link>
  );
}

function MiniPillar({
  label,
  stat,
}: {
  label: string;
  stat: { active: boolean; pct: number | null };
}) {
  if (!stat.active) {
    return (
      <div className="rounded-lg border border-border bg-bg-elev/40 px-2 py-1.5 text-center opacity-50">
        <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
        <div className="text-xs text-fg-subtle">—</div>
      </div>
    );
  }
  const tone =
    stat.pct === null ? "text-fg-subtle"
    : stat.pct >= 80 ? "text-accent"
    : stat.pct >= 60 ? "text-fg"
    : "text-danger";
  return (
    <div className="rounded-lg border border-border bg-bg-elev/40 px-2 py-1.5 text-center">
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`text-sm font-semibold ${tone}`}>
        {stat.pct === null ? "—" : `${stat.pct}%`}
      </div>
    </div>
  );
}

function Row({ row }: { row: ClientRow }) {
  const name = [row.firstName, row.lastName].filter(Boolean).join(" ") || row.email || "—";
  return (
    <tr className="border-t border-border hover:bg-bg-elev/30">
      <td className="px-4 py-3">
        <Link href={`/admin/clients/${row.id}`} className="font-medium hover:text-accent">
          {name}
        </Link>
        <div className="text-xs text-fg-subtle">{row.email}</div>
      </td>
      <td className="px-3 py-3 text-fg-muted">
        <div className="text-xs">{row.peptideProtocolName || "—"}</div>
        {row.programSlug && (
          <div className="text-xs text-fg-subtle">
            {row.programSlug}
            {row.programWeek ? ` · Wk ${row.programWeek}` : ""}
          </div>
        )}
      </td>
      <td className="px-3 py-3 text-right">
        <OverallChip pct={row.overallPct} />
      </td>
      <PillarCell stat={row.pillars.peptide} />
      <PillarCell stat={row.pillars.workout} />
      <PillarCell stat={row.pillars.nutrition} />
      <PillarCell stat={row.pillars.checkin} />
      <td className="px-3 py-3 text-fg-muted text-xs">{formatRelative(row.lastActivity)}</td>
      <td className="px-4 py-3">
        {row.flags.length === 0 ? (
          <span className="text-xs text-fg-subtle">—</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {row.flags.map((f) => (
              <span
                key={f.key}
                className="inline-flex items-center gap-1 rounded-full bg-danger/10 border border-danger/30 text-danger px-2 py-0.5 text-xs font-medium"
              >
                {f.label}
              </span>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

function OverallChip({ pct }: { pct: number | null }) {
  if (pct === null) return <span className="text-fg-subtle text-xs">—</span>;
  const tone =
    pct >= 80 ? "bg-accent/15 text-accent border-accent/30"
    : pct >= 60 ? "bg-bg-elev text-fg border-border"
    : "bg-danger/10 text-danger border-danger/30";
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {pct}%
    </span>
  );
}

function PillarCell({ stat }: { stat: { active: boolean; pct: number | null; completed: number; scheduled: number; key: PillarKey } }) {
  if (!stat.active) {
    return (
      <td className="px-2 py-3 text-right text-fg-subtle text-xs hidden md:table-cell">—</td>
    );
  }
  if (stat.pct === null) {
    return (
      <td className="px-2 py-3 text-right text-fg-subtle text-xs hidden md:table-cell">
        0 / 0
      </td>
    );
  }
  const tone =
    stat.pct >= 80 ? "text-accent"
    : stat.pct >= 60 ? "text-fg"
    : "text-danger";
  return (
    <td className={`px-2 py-3 text-right text-xs hidden md:table-cell ${tone}`}>
      <div className="font-semibold">{stat.pct}%</div>
      <div className="text-fg-subtle">{stat.completed}/{stat.scheduled}</div>
    </td>
  );
}
