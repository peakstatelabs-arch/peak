"use client";

import { useMemo } from "react";
import type { Challenge } from "@/lib/community";
import { Composer } from "./Composer";
import { PostCard } from "./PostCard";
import { ChallengeBanner } from "./ChallengeBanner";

export type Post = {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string | null;
  photo_path: string | null;
  source: string | null;
  created_at: string;
};

export type Member = { user_id: string; public_name: string; streak_days: number };
export type Reaction = { milestone_id: string; user_id: string; emoji: string };
export type Comment = { id: string; milestone_id: string; user_id: string; body: string; created_at: string };

export function CommunityClient({
  currentUserId,
  posts,
  members,
  reactions,
  comments,
  photoUrls,
  challenge,
  challengeProgress,
  weekKey,
}: {
  currentUserId: string;
  posts: Post[];
  members: Member[];
  reactions: Reaction[];
  comments: Comment[];
  photoUrls: Record<string, string>;
  challenge: Challenge;
  challengeProgress: { hits: number; total: number };
  weekKey: string;
}) {
  const nameFor = useMemo(() => {
    const map = new Map(members.map((m) => [m.user_id, m.public_name]));
    return (uid: string) => map.get(uid) ?? "A member";
  }, [members]);

  const reactionsByPost = useMemo(() => {
    const map = new Map<string, Reaction[]>();
    for (const r of reactions) {
      const arr = map.get(r.milestone_id) ?? [];
      arr.push(r);
      map.set(r.milestone_id, arr);
    }
    return map;
  }, [reactions]);

  const commentsByPost = useMemo(() => {
    const map = new Map<string, Comment[]>();
    for (const c of comments) {
      const arr = map.get(c.milestone_id) ?? [];
      arr.push(c);
      map.set(c.milestone_id, arr);
    }
    return map;
  }, [comments]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <ChallengeBanner
          challenge={challenge}
          hits={challengeProgress.hits}
          total={challengeProgress.total}
          weekKey={weekKey}
        />

        <Composer />

        <section className="card">
          <h3 className="font-semibold mb-3">Feed</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-fg-muted">Nothing yet. Share a win to get the crew rolling.</p>
          ) : (
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <PostCard
                    post={p}
                    authorName={nameFor(p.user_id)}
                    photoUrl={p.photo_path ? photoUrls[p.photo_path] ?? null : null}
                    currentUserId={currentUserId}
                    reactions={reactionsByPost.get(p.id) ?? []}
                    comments={commentsByPost.get(p.id) ?? []}
                    nameFor={nameFor}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card lg:sticky lg:top-4 self-start">
        <h3 className="font-semibold mb-3">Streak leaderboard</h3>
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
                    <span className="text-fg-subtle text-xs w-5 tabular-nums">#{i + 1}</span>
                    <span className={m.user_id === currentUserId ? "font-semibold text-accent" : ""}>
                      {m.public_name}
                    </span>
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
