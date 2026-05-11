"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateClientForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function generate() {
    const pool = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
    let out = "";
    for (let i = 0; i < 14; i++) out += pool[Math.floor(Math.random() * pool.length)];
    setTempPassword(out);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/portal/api/admin/create-client", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: tempPassword, firstName, lastName }),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMsg({ type: "err", text: json.error ?? "Failed to create client." });
      return;
    }
    setMsg({ type: "ok", text: `Created ${email}. Share the temporary password securely.` });
    setEmail(""); setFirstName(""); setLastName(""); setTempPassword("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="label">Email</label>
        <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label">Temporary password</label>
        <div className="flex gap-2">
          <input required minLength={10} className="input" value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} />
          <button type="button" onClick={generate} className="btn-secondary text-xs whitespace-nowrap">Generate</button>
        </div>
      </div>
      <div>
        <label className="label">First name</label>
        <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div>
        <label className="label">Last name</label>
        <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      {msg && (
        <div className={`sm:col-span-2 rounded-lg px-3 py-2 text-sm ${msg.type === "ok" ? "bg-success/10 text-success border border-success/30" : "bg-danger/10 text-danger border border-danger/30"}`}>
          {msg.text}
        </div>
      )}
      <div className="sm:col-span-2">
        <button disabled={saving} className="btn-primary w-full">
          {saving ? "Creating…" : "Create client"}
        </button>
      </div>
    </form>
  );
}
