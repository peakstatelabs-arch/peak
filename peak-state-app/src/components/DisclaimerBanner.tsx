"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DisclaimerBanner() {
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-bg-card shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h2 id="disclaimer-title" className="font-display text-lg font-semibold">
            Research disclaimer
          </h2>
        </div>
        <p className="text-sm text-fg-muted leading-relaxed">
          All protocols and content within this portal are for{" "}
          <span className="text-fg font-medium">research and educational purposes only</span>.
          Not medical advice. Not for human consumption. Consult a licensed healthcare provider
          before making any health decisions.
        </p>
        <button
          onClick={dismiss}
          disabled={submitting}
          className="btn-primary w-full mt-6 py-3 text-base"
        >
          {submitting ? "…" : "I understand"}
        </button>
      </div>
    </div>
  );
}
