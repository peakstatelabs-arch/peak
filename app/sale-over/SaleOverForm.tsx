"use client";

import { useState } from "react";
import { SALE_OVER_CONSENT_TEXT } from "@/app/lib/saleOverCopy";

export function SaleOverForm() {
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/sale-over-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          dob,
          consent: agreed,
          page: window.location.pathname,
          source: "sale-over",
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-3xl border border-[var(--accent)]/40 bg-white/5 p-6 text-center">
        <p className="text-2xl font-black">You&rsquo;re on the list. 🎉</p>
        <p className="mt-2 text-white/70">
          We&rsquo;ll text you first when the members-only sale opens.
        </p>
      </div>
    );
  }

  const input =
    "mt-1.5 w-full h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-base text-white placeholder:text-white/40 outline-none focus:border-[var(--accent)]";
  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
      <label className="block text-sm font-bold">
        Mobile number
        <input
          className={input}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="block text-sm font-bold">
        Date of birth
        <input className={input} type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
      </label>
      <label className="flex items-start gap-2.5 text-xs text-white/70">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
        />
        {SALE_OVER_CONSENT_TEXT}
      </label>
      {error && <p className="text-sm font-semibold text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl bg-[var(--accent)] py-3.5 text-base font-extrabold text-[#0b0f1a] disabled:opacity-60"
      >
        {status === "sending" ? "Saving…" : "Text me first →"}
      </button>
    </form>
  );
}
