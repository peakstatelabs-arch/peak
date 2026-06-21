"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Dose = { id: string; taken: boolean; label: string };

export function LogDoseButtons({ doses }: { doses: Dose[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState<string | null>(null);

  const pending = doses.filter((d) => !d.taken);

  async function markTaken(id: string) {
    setBusy(id);
    await supabase
      .from("peptide_doses")
      .update({ taken: true, taken_at: new Date().toISOString() })
      .eq("id", id);
    setBusy(null);
    router.refresh();
  }

  if (pending.length === 0) {
    return (
      <div className="text-center text-sm text-fg-muted">
        All taken. See you tomorrow.
      </div>
    );
  }

  if (pending.length === 1) {
    return (
      <button
        onClick={() => markTaken(pending[0].id)}
        disabled={busy !== null}
        className="btn-primary w-full text-base py-4"
      >
        {busy ? "Logging…" : "✓ Mark as taken"}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {pending.map((d) => (
        <button
          key={d.id}
          onClick={() => markTaken(d.id)}
          disabled={busy !== null}
          className="btn-primary w-full"
        >
          {busy === d.id ? "Logging…" : `✓ Mark ${d.label} taken`}
        </button>
      ))}
    </div>
  );
}
