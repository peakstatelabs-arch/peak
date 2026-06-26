"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MODULES, type ModuleSlug } from "@/lib/modules";
import { dispatchModulesChanged } from "@/components/Nav";

export function ModuleToggles({ initial }: { initial: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const highlight = sp.get("enable");
  const supabase = createClient();
  const [enabled, setEnabled] = useState<Set<string>>(new Set(initial));
  const [pending, setPending] = useState<Set<string>>(new Set());

  async function toggle(slug: ModuleSlug) {
    const next = new Set(enabled);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);

    setEnabled(next);
    setPending((p) => new Set(p).add(slug));

    // Optimistic: tell the Sidebar/BottomTabBar to update IMMEDIATELY without
    // waiting on the server round-trip + layout re-render. router.refresh()
    // below still happens so the next request reads the new server state.
    dispatchModulesChanged(Array.from(next));

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ enabled_modules: Array.from(next) })
      .eq("id", user.id);

    setPending((p) => {
      const c = new Set(p);
      c.delete(slug);
      return c;
    });

    router.refresh();
  }

  return (
    <ul className="space-y-2">
      {MODULES.map((m) => {
        const on = enabled.has(m.slug);
        const busy = pending.has(m.slug);
        const highlighted = highlight === m.slug && !on;
        return (
          <li
            key={m.slug}
            className={
              "flex items-start gap-3 rounded-lg border p-3 transition-colors " +
              (highlighted
                ? "border-accent bg-accent/10"
                : "border-border bg-bg-elev/40")
            }
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium">{m.label}</div>
              <p className="text-xs text-fg-muted mt-0.5">{m.blurb}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={on}
              disabled={busy}
              onClick={() => toggle(m.slug)}
              className={
                "relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors mt-0.5 " +
                (on ? "bg-accent" : "bg-bg-elev border border-border")
              }
            >
              <span
                className={
                  "inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform " +
                  (on ? "translate-x-6" : "translate-x-1")
                }
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
