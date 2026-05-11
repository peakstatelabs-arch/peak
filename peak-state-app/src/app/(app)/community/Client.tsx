"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Milestone = { id: string; user_id: string; kind: string; title: string; created_at: string };
type Member = { user_id: string; public_name: string; streak_days: number };

const REACTIONS = ["💪", "🔥", "👏", "🙌"];

export function CommunityClient({
  currentUserId,
  milestones,
  members,
}: {
  currentUserId: string;
  milestones: Milestone[];
  members: Member[];
}) {
  const router = useRouter();
  const supabase = createClient();

  async function react(milestoneId: string, emoji: string) {
    await supabase.from("community_reactions").insert({
      milestone_id: milestoneId,
      user_id: currentUserId,
      emoji,
    });
    router.refresh();
  }

  const nameFor = (uid: string) => members.find((m) => m.user_id === uid)?.public_name ?? "A member";

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="card lg:col-span-2">
        <h3 className="font-semibold mb-3">Recent milestones</h3>
        {milestones.length === 0 ? (
          <p className="text-sm text-fg-muted">No milestones yet. Be the first — keep showing up.</p>
        ) : (
          <ul className="space-y-3">
            {milestones.map((m) => (
              <li key={m.id} className="rounded-lg border border-border bg-bg-elev p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{nameFor(m.user_id)}</span>{" "}
                      <span className="text-fg-muted">{m.title}</span>
                    </div>
                    <div className="text-xs text-fg-subtle mt-1">{new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-1">
                    {REACTIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => react(m.id, r)}
                        className="rounded-full px-2 py-1 text-sm hover:bg-bg-card transition"
                        aria-label={`React with ${r}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="font-semibold mb-3">Leaderboard</h3>
        {members.length === 0 ? (
          <p className="text-sm text-fg-muted">More clients coming online.</p>
        ) : (
          <ol className="space-y-2">
            {[...members]
              .sort((a, b) => b.streak_days - a.streak_days)
              .slice(0, 10)
              .map((m, i) => (
                <li key={m.user_id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-fg-subtle text-xs w-5">#{i + 1}</span>
                    <span className={m.user_id === currentUserId ? "font-semibold text-accent" : ""}>{m.public_name}</span>
                  </div>
                  <span className="chip">{m.streak_days}d</span>
                </li>
              ))}
          </ol>
        )}
      </section>
    </div>
  );
}
