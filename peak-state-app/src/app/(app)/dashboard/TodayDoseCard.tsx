"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Dose = {
  id: string;
  peptide_name: string;
  dose_mg: number;
  time_of_day: string | null;
  taken: boolean;
};

/**
 * Combined renderer for today's doses + their action buttons. Owns the
 * optimistic state so the strikethrough on the list AND the disappearance
 * of the button below happen in the SAME frame on tap. Splitting these
 * across a server component (the list) and a client component (the
 * buttons) caused the previous bug where the button vanished but the
 * dose name stayed un-struck until the server re-render landed.
 */
export function TodayDoseCard({ doses }: { doses: Dose[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [justMarked, setJustMarked] = useState<Set<string>>(new Set());

  function isTaken(d: Dose): boolean {
    return d.taken || justMarked.has(d.id);
  }

  const allDone = doses.length > 0 && doses.every((d) => isTaken(d));
  const pending = doses.filter((d) => !isTaken(d));

  async function markTaken(id: string) {
    setJustMarked((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const { error } = await supabase
      .from("peptide_doses")
      .update({ taken: true, taken_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      setJustMarked((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      return;
    }
    router.refresh();
  }

  return (
    <section className="card">
      <div className="text-xs uppercase tracking-wide text-fg-subtle mb-1">
        {allDone ? "All done today" : "Today"}
      </div>
      <h2 className="font-display text-xl font-semibold">
        {allDone
          ? "Nicely done."
          : doses.length === 1
          ? `${doses[0].peptide_name} · ${doses[0].dose_mg} mg`
          : `${doses.length} doses scheduled`}
      </h2>
      <ul className="mt-4 space-y-2">
        {doses.map((d) => {
          const taken = isTaken(d);
          return (
            <li key={d.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className={"font-medium " + (taken ? "line-through text-fg-subtle" : "")}>
                  {d.peptide_name} · {d.dose_mg} mg
                </div>
                <div className="text-xs text-fg-subtle">
                  {d.time_of_day === "morning"
                    ? "Morning"
                    : d.time_of_day === "evening"
                    ? "Evening"
                    : (d.time_of_day ?? "")}
                </div>
              </div>
              {taken && (
                <span className="text-xs text-accent font-semibold whitespace-nowrap">
                  ✓ Taken
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {pending.length > 0 ? (
        <div className="mt-5 space-y-2">
          {pending.map((d) => (
            <button
              key={d.id}
              onClick={() => markTaken(d.id)}
              className="btn-primary w-full"
            >
              ✓ Mark {d.peptide_name} taken
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-5 text-center text-sm text-fg-muted">
          All taken. See you tomorrow.
        </div>
      )}
    </section>
  );
}
