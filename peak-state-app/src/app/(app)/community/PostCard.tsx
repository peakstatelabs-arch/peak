"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Post, Reaction, Comment } from "./Client";

const REACTIONS = ["💪", "🔥", "👏", "🙌"];

export function PostCard({
  post,
  authorName,
  photoUrl,
  currentUserId,
  reactions,
  comments,
  nameFor,
}: {
  post: Post;
  authorName: string;
  photoUrl: string | null;
  currentUserId: string;
  reactions: Reaction[];
  comments: Comment[];
  nameFor: (uid: string) => string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [busy, setBusy] = useState(false);

  // Count + my-current-reaction-per-emoji
  const counts = new Map<string, number>();
  const mine = new Set<string>();
  for (const r of reactions) {
    counts.set(r.emoji, (counts.get(r.emoji) ?? 0) + 1);
    if (r.user_id === currentUserId) mine.add(r.emoji);
  }

  async function toggleReact(emoji: string) {
    if (mine.has(emoji)) {
      await supabase
        .from("community_reactions")
        .delete()
        .eq("milestone_id", post.id)
        .eq("user_id", currentUserId)
        .eq("emoji", emoji);
    } else {
      await supabase.from("community_reactions").insert({
        milestone_id: post.id,
        user_id: currentUserId,
        emoji,
      });
    }
    router.refresh();
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = commentBody.trim();
    if (!trimmed) return;
    setBusy(true);
    const { error } = await supabase.from("community_comments").insert({
      milestone_id: post.id,
      user_id: currentUserId,
      body: trimmed,
    });
    setBusy(false);
    if (!error) {
      setCommentBody("");
      router.refresh();
    }
  }

  const isManual = post.source === "manual";

  return (
    <div className="rounded-lg border border-border bg-bg-elev/50 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-sm">
          <span className="font-semibold">{authorName}</span>
          {!isManual && <span className="ml-2 chip-accent text-[10px]">milestone</span>}
        </div>
        <span className="text-xs text-fg-subtle">{formatDate(post.created_at)}</span>
      </div>

      <div className="mt-1 text-sm text-fg">
        {isManual ? (post.body ?? post.title) : post.title}
      </div>

      {photoUrl && (
        <a
          href={photoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block max-w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Post photo"
            className="w-full max-h-96 object-cover rounded-lg border border-border"
          />
        </a>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {REACTIONS.map((emoji) => {
          const n = counts.get(emoji) ?? 0;
          const active = mine.has(emoji);
          return (
            <button
              key={emoji}
              onClick={() => toggleReact(emoji)}
              className={
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition " +
                (active
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-bg-elev border-border text-fg-muted hover:text-fg")
              }
              aria-pressed={active}
              aria-label={`React ${emoji}`}
            >
              <span>{emoji}</span>
              {n > 0 && <span className="text-xs tabular-nums">{n}</span>}
            </button>
          );
        })}
        <button
          onClick={() => setCommentOpen((o) => !o)}
          className="ml-auto text-xs text-fg-muted hover:text-fg"
        >
          💬 {comments.length > 0 ? comments.length : ""}{" "}
          {commentOpen ? "Hide" : "Comment"}
        </button>
      </div>

      {(commentOpen || comments.length > 0) && (
        <div className="mt-3 border-t border-border pt-3 space-y-2">
          {comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-medium">{nameFor(c.user_id)}</span>
              <span className="text-fg-subtle text-xs ml-2">{formatDate(c.created_at)}</span>
              <div className="text-fg-muted">{c.body}</div>
            </div>
          ))}
          {commentOpen && (
            <form onSubmit={submitComment} className="flex gap-2 pt-1">
              <input
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value.slice(0, 280))}
                placeholder="Say something supportive…"
                className="input text-sm"
                maxLength={280}
              />
              <button
                type="submit"
                disabled={busy || !commentBody.trim()}
                className="btn-primary text-xs"
              >
                {busy ? "…" : "Send"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const diffMs = Date.now() - Date.parse(iso);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
