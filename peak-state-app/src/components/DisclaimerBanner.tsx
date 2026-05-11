"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DisclaimerBanner() {
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!open) return null;

  async function dismiss() {
    setSubmitting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ disclaimer_dismissed: true, disclaimer_dismissed_at: new Date().toISOString() })
        .eq("id", user.id);
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="border-b border-accent/30 bg-accent/10 text-fg">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-3 flex items-start gap-3">
        <div className="text-sm leading-relaxed">
          <strong className="font-semibold">Research disclaimer.</strong>{" "}
          All protocols and content within this portal are for research and educational purposes only.
          Not medical advice. Not for human consumption. Consult a licensed healthcare provider
          before making any health decisions.
        </div>
        <button
          onClick={dismiss}
          disabled={submitting}
          className="btn-secondary text-xs px-3 py-1.5 whitespace-nowrap"
        >
          {submitting ? "…" : "I understand"}
        </button>
      </div>
    </div>
  );
}
