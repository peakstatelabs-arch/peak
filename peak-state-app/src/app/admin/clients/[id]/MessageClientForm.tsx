"use client";

import { useState } from "react";

export function MessageClientForm({
  clientId,
  clientName,
  deviceCount,
}: {
  clientId: string;
  clientName: string;
  deviceCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const disabled = deviceCount === 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      const r = await fetch("/portal/api/admin/message-client", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId: clientId, title: title.trim(), body: body.trim() }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed to send.");
      setStatus(`Sent to ${j.sent} device${j.sent === 1 ? "" : "s"}.`);
      setTitle("");
      setBody("");
      setTimeout(() => {
        setOpen(false);
        setStatus(null);
      }, 1500);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={disabled}
        title={disabled ? "Client hasn't enabled push notifications" : ""}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "No devices" : "Message client"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => !busy && setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="card w-full max-w-md"
          >
            <h3 className="font-semibold mb-1">Send push to {clientName}</h3>
            <p className="text-xs text-fg-subtle mb-4">
              Will arrive on {deviceCount} device{deviceCount === 1 ? "" : "s"}.
            </p>

            <label className="label" htmlFor="msg-title">Title</label>
            <input
              id="msg-title"
              className="input mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              required
              autoFocus
            />

            <label className="label" htmlFor="msg-body">Body</label>
            <textarea
              id="msg-body"
              className="input mb-4 min-h-[100px] resize-y"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={240}
              required
            />

            {status && (
              <p className="text-sm mb-3 text-fg-muted">{status}</p>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-ghost"
                disabled={busy}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
