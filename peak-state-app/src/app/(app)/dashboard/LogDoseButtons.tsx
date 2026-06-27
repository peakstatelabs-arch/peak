"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Dose = { id: string; taken: boolean; label: string };

export function LogDoseButtons({ doses }: { doses: Dose[] }) {
  const router = useRouter();
  const supabase = createClient();
  // Optimistically-marked IDs. Hide them from the pending list instantly
  // so the button disappears the moment the user taps, even before the
  // DB write + router.refresh round-trip completes. Prevents the
  // "tap twice because nothing happened" perception on mobile.
  const [justMarked, setJustMarked] = useState<Set<string>>(new Set());

  const pending = doses.filter((d) => !d.taken && !justMarked.has(d.id));

  async function markTaken(id: string) {
    // Optimistic update FIRST.
    setJustMarked((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    // Then the actual write + refresh.
    const { error } = await supabase
      .from("peptide_doses")
      .update({ taken: true, taken_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      // Roll back so they can retry.
      setJustMarked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }
    router.refresh();
  }

  if (pending.length === 0) {
    return (
      <div className="text-center text-sm text-fg-muted">
        All taken. See you tomorrow.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pending.map((d) => (
        <button
          key={d.id}
          onClick={() => markTaken(d.id)}
          className="btn-primary w-full"
        >
          ✓ Mark {d.label} taken
        </button>
      ))}
    </div>
  );
}
