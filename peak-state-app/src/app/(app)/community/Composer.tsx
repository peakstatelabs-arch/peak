"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MAX_BODY = 200;
const MAX_PHOTO_MB = 6;
const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

export function Composer() {
  const router = useRouter();
  const supabase = createClient();
  const [body, setBody] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(`Photo too large (max ${MAX_PHOTO_MB} MB).`);
      e.target.value = "";
      return;
    }
    setError(null);
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed && !photoFile) return;

    setBusy(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setBusy(false); return; }

    let photoPath: string | null = null;
    if (photoFile) {
      const ext = (photoFile.name.split(".").pop() || "jpg").toLowerCase();
      photoPath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("community-posts")
        .upload(photoPath, photoFile, { contentType: photoFile.type, upsert: false });
      if (upErr) {
        setError(`Photo upload failed: ${upErr.message}`);
        setBusy(false);
        return;
      }
    }

    const { error: insErr } = await supabase.from("community_milestones").insert({
      user_id: user.id,
      kind: "post",
      title: trimmed ? trimmed.slice(0, 80) : "Shared a photo",
      body: trimmed || null,
      photo_path: photoPath,
      source: "manual",
    });
    if (insErr) {
      setError(`Couldn't post: ${insErr.message}`);
      setBusy(false);
      return;
    }

    setBody("");
    clearPhoto();
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card">
      <h3 className="font-semibold mb-2">Share a win</h3>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value.slice(0, MAX_BODY))}
        placeholder="What went well this week?"
        className="input min-h-[72px] resize-y"
        maxLength={MAX_BODY}
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {photoPreview ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Selected"
                className="h-12 w-12 object-cover rounded-md border border-border"
              />
              <button type="button" onClick={clearPhoto} className="btn-ghost text-xs text-danger">
                Remove
              </button>
            </div>
          ) : (
            <label className="btn-ghost text-xs cursor-pointer">
              <input type="file" accept={ACCEPT} className="hidden" onChange={onPhotoChange} />
              + Photo
            </label>
          )}
          <span className="text-xs text-fg-subtle">{body.length}/{MAX_BODY}</span>
        </div>
        <button
          type="submit"
          disabled={busy || (!body.trim() && !photoFile)}
          className="btn-primary text-sm"
        >
          {busy ? "Posting…" : "Post"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </form>
  );
}
