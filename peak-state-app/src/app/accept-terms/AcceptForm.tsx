"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AcceptForm({ version }: { version: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!checked) return;
    setBusy(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setBusy(false); return; }

    const { error: upErr } = await supabase
      .from("profiles")
      .update({
        terms_accepted_at: new Date().toISOString(),
        terms_version: version,
      })
      .eq("id", user.id);

    if (upErr) {
      setError("Couldn't save. Try again.");
      setBusy(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-border accent-[rgb(var(--accent))] flex-shrink-0"
        />
        <span className="text-sm text-fg">
          I&apos;m 18 or older and I accept the Terms of Service and Privacy Policy. I understand
          this Service is for self-tracking and education, not medical advice.
        </span>
      </label>
      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}
      <button type="submit" disabled={!checked || busy} className="btn-primary w-full">
        {busy ? "Saving…" : "Accept & continue"}
      </button>
    </form>
  );
}
