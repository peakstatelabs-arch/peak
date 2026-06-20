"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProtocolPicker, type PickerChoice } from "./ProtocolPicker";
import { PowerCutWizard } from "./PowerCutWizard";
import { SinglePeptideWizard } from "./SinglePeptideWizard";
import { DoseCalendar } from "./DoseCalendar";
import { TodayDoses } from "./TodayDoses";
import { NotificationSetup } from "./NotificationSetup";

type Protocol = {
  id: string;
  name: string;
  peptide_name: string;
  dose_mg: number;
  frequency: string;
  time_of_day: string | null;
  start_date: string;
  end_date: string | null;
  active: boolean;
  protocol_type: string | null;
  stacks: number | null;
  bpc_track: string | null;
};

export type Dose = {
  id: string;
  peptide_name: string;
  dose_mg: number;
  scheduled_for: string;
  time_of_day: string | null;
  taken: boolean;
  taken_at: string | null;
  notes: string | null;
};

export type ProfilePrefs = {
  morning_time: string;
  evening_time: string;
  notifications_enabled: boolean;
  timezone: string | null;
};

export function PeptideTrackerClient({
  protocols,
  doses,
  profile,
}: {
  protocols: Protocol[];
  doses: Dose[];
  profile: ProfilePrefs;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"overview" | "picker" | PickerChoice>("overview");

  function refresh() {
    router.refresh();
  }

  function done() {
    setMode("overview");
    refresh();
  }

  if (mode === "picker") {
    return (
      <ProtocolPicker
        onPick={(c) => setMode(c)}
        onCancel={() => setMode("overview")}
      />
    );
  }
  if (mode === "power-cut-foundation" || mode === "power-cut-performance") {
    return (
      <PowerCutWizard
        track={mode === "power-cut-foundation" ? "foundation" : "performance"}
        profile={profile}
        onSaved={done}
        onCancel={() => setMode("picker")}
      />
    );
  }
  if (mode === "single-reta" || mode === "single-cjc" || mode === "single-bpc" || mode === "single-ghk") {
    return (
      <SinglePeptideWizard
        choice={mode}
        profile={profile}
        onSaved={done}
        onCancel={() => setMode("picker")}
      />
    );
  }

  // overview
  return (
    <div className="space-y-6">
      <TodayDoses doses={doses} onChanged={refresh} />

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Active protocols</h2>
          <button onClick={() => setMode("picker")} className="btn-primary text-sm">
            + Add protocol
          </button>
        </div>
        {protocols.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-fg-muted mb-4">
              No protocols yet. Pick one to get started.
            </p>
            <button onClick={() => setMode("picker")} className="btn-primary">
              Choose a protocol
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {groupProtocols(protocols).map((group) =>
              group.kind === "stack" ? (
                <StackCard key={group.key} stack={group} onChanged={refresh} />
              ) : (
                <ProtocolRow key={group.protocol.id} protocol={group.protocol} onChanged={refresh} />
              )
            )}
          </ul>
        )}
      </section>

      <DoseCalendar doses={doses} onChanged={refresh} profile={profile} />

      <NotificationSetup profile={profile} onSaved={refresh} doses={doses} />
    </div>
  );
}

type ProtocolGroup =
  | { kind: "single"; protocol: Protocol }
  | {
      kind: "stack";
      key: string;
      name: string;
      track: string | null;
      stacks: number | null;
      protocols: Protocol[];
      active: boolean;
    };

function groupProtocols(protocols: Protocol[]): ProtocolGroup[] {
  const groups = new Map<string, Protocol[]>();
  const singles: Protocol[] = [];
  const order: string[] = [];

  for (const p of protocols) {
    if (p.protocol_type?.startsWith("power_cut")) {
      // Stack key intentionally excludes `name` because the wizard appends
      // " · <compound>" to each child row's name (so names differ across
      // rows of the same stack). Track + stacks + start_date is what
      // actually identifies one stack assignment.
      const key = `${p.protocol_type}::${p.bpc_track ?? ""}::${p.stacks ?? ""}::${p.start_date}`;
      if (!groups.has(key)) {
        groups.set(key, []);
        order.push(key);
      }
      groups.get(key)!.push(p);
    } else {
      singles.push(p);
      order.push(`single::${p.id}`);
    }
  }

  return order
    .map((key): ProtocolGroup | null => {
      if (key.startsWith("single::")) {
        const id = key.slice("single::".length);
        const single = singles.find((s) => s.id === id);
        return single ? { kind: "single", protocol: single } : null;
      }
      const items = groups.get(key);
      if (!items || items.length === 0) return null;
      // Stack only really makes sense at 2+ compounds; if a stack key has 1
      // member fall back to rendering as a single row.
      if (items.length < 2) return { kind: "single", protocol: items[0] };
      const first = items[0];
      // Strip " · <compound>" suffix the wizard appends to each child name.
      const stackName = first.name.split(" · ")[0];
      return {
        kind: "stack",
        key,
        name: stackName,
        track: first.bpc_track,
        stacks: first.stacks,
        protocols: items,
        active: items.every((p) => p.active),
      };
    })
    .filter((g): g is ProtocolGroup => g !== null);
}

function StackCard({ stack, onChanged }: { stack: Extract<ProtocolGroup, { kind: "stack" }>; onChanged: () => void }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const ids = stack.protocols.map((p) => p.id);

  async function setActive(active: boolean) {
    setBusy(true);
    await supabase.from("peptide_protocols").update({ active }).in("id", ids);
    setBusy(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Remove "${stack.name}" and all its scheduled doses?`)) return;
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    // Delete all future, untaken doses tied to any protocol in the stack.
    await supabase
      .from("peptide_doses")
      .delete()
      .in("protocol_id", ids)
      .gte("scheduled_for", today)
      .eq("taken", false);
    await supabase.from("peptide_protocols").delete().in("id", ids);
    setBusy(false);
    onChanged();
  }

  const trackLabel = stack.track
    ? stack.track.charAt(0).toUpperCase() + stack.track.slice(1) + " track"
    : null;

  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex items-start gap-2 min-w-0 text-left flex-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 mt-1 text-fg-muted flex-shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <div className="min-w-0">
            <div className="font-medium truncate">{stack.name}</div>
            <div className="text-xs text-fg-muted mt-0.5">
              {stack.protocols.length} compounds
              {trackLabel ? ` · ${trackLabel}` : ""}
              {stack.stacks ? ` · ${stack.stacks} stack${stack.stacks !== 1 ? "s" : ""}` : ""}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`chip ${stack.active ? "chip-accent" : ""}`}>
            {stack.active ? "Active" : "Paused"}
          </span>
          <button
            onClick={() => setActive(!stack.active)}
            disabled={busy}
            className="btn-ghost text-xs"
          >
            {stack.active ? "Pause" : "Resume"}
          </button>
          <button onClick={remove} disabled={busy} className="btn-ghost text-xs text-danger">
            ✕
          </button>
        </div>
      </div>
      {expanded && (
        <ul className="mt-3 ml-6 space-y-1.5 border-l border-border pl-3">
          {stack.protocols.map((p) => (
            <li key={p.id} className="text-xs text-fg-muted">
              <span className="font-medium text-fg">{p.peptide_name}</span>
              <span className="text-fg-subtle"> · {p.frequency}</span>
              {p.time_of_day ? <span className="text-fg-subtle"> · {p.time_of_day}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function ProtocolRow({ protocol, onChanged }: { protocol: Protocol; onChanged: () => void }) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function setActive(active: boolean) {
    setBusy(true);
    await supabase.from("peptide_protocols").update({ active }).eq("id", protocol.id);
    setBusy(false);
    onChanged();
  }

  async function remove() {
    if (!confirm(`Remove "${protocol.name}" and its scheduled doses?`)) return;
    setBusy(true);
    // delete scheduled (untaken) future doses for this protocol
    const today = new Date().toISOString().slice(0, 10);
    await supabase
      .from("peptide_doses")
      .delete()
      .eq("user_id", (await supabase.auth.getUser()).data.user!.id)
      .gte("scheduled_for", today)
      .eq("taken", false)
      .eq("peptide_name", protocol.peptide_name);
    await supabase.from("peptide_protocols").delete().eq("id", protocol.id);
    setBusy(false);
    onChanged();
  }

  return (
    <li className="py-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{protocol.name}</div>
        <div className="text-xs text-fg-muted mt-0.5">
          {protocol.peptide_name} · {protocol.dose_mg} mg · {protocol.frequency}
          {protocol.time_of_day ? ` · ${protocol.time_of_day}` : ""}
        </div>
        {protocol.protocol_type?.startsWith("power_cut") && (
          <div className="text-xs text-fg-subtle mt-0.5">
            {protocol.stacks} stack{protocol.stacks !== 1 ? "s" : ""} · {protocol.bpc_track ?? ""} track
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={`chip ${protocol.active ? "chip-accent" : ""}`}>
          {protocol.active ? "Active" : "Paused"}
        </span>
        <button
          onClick={() => setActive(!protocol.active)}
          disabled={busy}
          className="btn-ghost text-xs"
        >
          {protocol.active ? "Pause" : "Resume"}
        </button>
        <button onClick={remove} disabled={busy} className="btn-ghost text-xs text-danger">
          ✕
        </button>
      </div>
    </li>
  );
}
