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
            {protocols.map((p) => (
              <ProtocolRow key={p.id} protocol={p} onChanged={refresh} />
            ))}
          </ul>
        )}
      </section>

      <DoseCalendar doses={doses} onChanged={refresh} profile={profile} />

      <NotificationSetup profile={profile} onSaved={refresh} doses={doses} />
    </div>
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
