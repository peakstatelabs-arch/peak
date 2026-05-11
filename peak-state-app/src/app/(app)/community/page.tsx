import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { CardSkeleton } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/server";
import { CommunityClient } from "./Client";

export const metadata = { title: "Community — Peak State Labs" };

export default function CommunityPage() {
  return (
    <>
      <PageHeader title="Community" description="Quiet accountability. Public milestones only — never personal data." />
      <Suspense fallback={<CardSkeleton />}>
        <Loader />
      </Suspense>
    </>
  );
}

async function Loader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: milestones }, { data: members }] = await Promise.all([
    supabase
      .from("community_milestones")
      .select("id, user_id, kind, title, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("community_members").select("user_id, public_name, streak_days"),
  ]);
  return (
    <CommunityClient
      currentUserId={user!.id}
      milestones={milestones ?? []}
      members={members ?? []}
    />
  );
}
