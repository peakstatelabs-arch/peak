import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireModule } from "@/lib/modules";
import { backfillStreakMilestones, challengeForWeek, type Challenge } from "@/lib/community";
import { weekKey } from "@/lib/utils";
import { CommunityClient } from "./Client";

export const metadata = { title: "Community — Peak State Labs" };
export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  await requireModule("community");
  return (
    <>
      <PageHeader title="Community" description="Quiet accountability. Share wins, cheer the crew on." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

const DAY_MS = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Self-healing streak milestones for this user
  await backfillStreakMilestones(supabase, user.id);

  const wk = weekKey();
  const challenge = challengeForWeek(wk);

  const [
    { data: posts },
    { data: members },
    { data: reactionRows },
    progress,
  ] = await Promise.all([
    supabase
      .from("community_milestones")
      .select("id, user_id, kind, title, body, photo_path, source, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("community_members").select("user_id, public_name, streak_days"),
    supabase
      .from("community_reactions")
      .select("milestone_id, user_id, emoji"),
    computeChallengeProgress(challenge, wk),
  ]);

  // Pull comments for the loaded posts in one round trip
  const postIds = (posts ?? []).map((p) => p.id);
  const { data: comments } = postIds.length
    ? await supabase
        .from("community_comments")
        .select("id, milestone_id, user_id, body, created_at")
        .in("milestone_id", postIds)
        .order("created_at", { ascending: true })
    : { data: [] };

  // public_url helper for any photo paths
  const photoUrlByPath = new Map<string, string>();
  for (const p of posts ?? []) {
    if (p.photo_path) {
      const { data } = supabase.storage.from("community-posts").getPublicUrl(p.photo_path);
      if (data?.publicUrl) photoUrlByPath.set(p.photo_path, data.publicUrl);
    }
  }

  return (
    <CommunityClient
      currentUserId={user.id}
      posts={posts ?? []}
      members={members ?? []}
      reactions={reactionRows ?? []}
      comments={comments ?? []}
      photoUrls={Object.fromEntries(photoUrlByPath)}
      challenge={challenge}
      challengeProgress={progress}
      weekKey={wk}
    />
  );
}

async function computeChallengeProgress(
  challenge: Challenge,
  wk: string
): Promise<{ hits: number; total: number }> {
  const admin = createAdminClient();
  const now = new Date();
  const dayIdx = now.getUTCDay() === 0 ? 7 : now.getUTCDay(); // 1..7 Mon..Sun
  const weekStart = new Date(now.getTime() - (dayIdx - 1) * DAY_MS);
  weekStart.setUTCHours(0, 0, 0, 0);
  const startIso = iso(weekStart);
  const todayIso = iso(now);

  const { data: members } = await admin.from("profiles").select("id").eq("role", "client");
  const userIds = (members ?? []).map((m) => m.id);
  const total = userIds.length;
  if (total === 0) return { hits: 0, total: 0 };

  let hits = 0;
  switch (challenge.metric) {
    case "perfect_dose_week": {
      const { data: doses } = await admin
        .from("peptide_doses")
        .select("user_id, taken")
        .in("user_id", userIds)
        .gte("scheduled_for", startIso)
        .lte("scheduled_for", todayIso);
      const stats = new Map<string, { total: number; done: number }>();
      for (const d of doses ?? []) {
        const e = stats.get(d.user_id) ?? { total: 0, done: 0 };
        e.total += 1;
        if (d.taken) e.done += 1;
        stats.set(d.user_id, e);
      }
      for (const [, s] of stats) {
        if (s.total > 0 && s.done === s.total) hits += 1;
      }
      break;
    }
    case "workouts_done": {
      const { data: ws } = await admin
        .from("workout_sessions")
        .select("user_id, completed")
        .in("user_id", userIds)
        .gte("scheduled_for", startIso)
        .lte("scheduled_for", todayIso);
      const stats = new Map<string, number>();
      for (const w of ws ?? []) if (w.completed) stats.set(w.user_id, (stats.get(w.user_id) ?? 0) + 1);
      for (const [, n] of stats) if (n >= challenge.goal) hits += 1;
      break;
    }
    case "checkin_submitted": {
      const { data: cs } = await admin
        .from("weekly_checkins")
        .select("user_id, week_key")
        .in("user_id", userIds)
        .eq("week_key", wk);
      hits = new Set((cs ?? []).map((c) => c.user_id)).size;
      break;
    }
    case "meal_log_days": {
      const { data: meals } = await admin
        .from("meal_logs")
        .select("user_id, logged_for")
        .in("user_id", userIds)
        .gte("logged_for", startIso)
        .lte("logged_for", todayIso);
      const dayCount = new Map<string, Set<string>>();
      for (const m of meals ?? []) {
        const set = dayCount.get(m.user_id) ?? new Set<string>();
        set.add(m.logged_for);
        dayCount.set(m.user_id, set);
      }
      for (const [, set] of dayCount) if (set.size >= challenge.goal) hits += 1;
      break;
    }
  }

  return { hits, total };
}
