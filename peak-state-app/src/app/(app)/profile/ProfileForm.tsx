"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  firstName,
  lastName,
  goalWeight,
}: {
  firstName: string;
  lastName: string;
  goalWeight: number | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [fn, setFn] = useState(firstName);
  const [ln, setLn] = useState(lastName);
  const [gw, setGw] = useState(goalWeight?.toString() ?? "");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: fn || null,
        last_name: ln || null,
        goal_weight_lb: gw ? Number(gw) : null,
      })
      .eq("id", user!.id);
    setSaving(false);
    if (error) setMsg({ type: "err", text: "Couldn't save. Try again." });
    else { setMsg({ type: "ok", text: "Saved." }); router.refresh(); }
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">First name</label>
          <input className="input" value={fn} onChange={(e) => setFn(e.target.value)} />
        </div>
        <div>
          <label className="label">Last name</label>
          <input className="input" value={ln} onChange={(e) => setLn(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label">Goal weight (lb)</label>
        <input type="number" step="0.5" className="input" value={gw} onChange={(e) => setGw(e.target.value)} />
      </div>
      {msg && (
        <div className={`text-sm ${msg.type === "ok" ? "text-success" : "text-danger"}`}>{msg.text}</div>
      )}
      <button disabled={saving} className="btn-primary w-full">{saving ? "Saving…" : "Save"}</button>
    </form>
  );
}
