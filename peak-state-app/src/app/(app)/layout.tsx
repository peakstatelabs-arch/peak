import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, MobileTopBar, BottomTabBar } from "@/components/Nav";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { OfflineBoundary } from "@/components/OfflineBoundary";
import { TERMS_VERSION } from "@/lib/legal";

async function computeStreak(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - 60);
  const { data: doses } = await supabase
    .from("peptide_doses")
    .select("scheduled_for, taken")
    .eq("user_id", userId)
    .gte("scheduled_for", since.toISOString().slice(0, 10));

  if (!doses || doses.length === 0) return 0;

  const byDay = new Map<string, { total: number; done: number }>();
  for (const d of doses) {
    const e = byDay.get(d.scheduled_for) ?? { total: 0, done: 0 };
    e.total += 1;
    if (d.taken) e.done += 1;
    byDay.set(d.scheduled_for, e);
  }

  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 60; i++) {
    const key = cursor.toISOString().slice(0, 10);
    const day = byDay.get(key);
    if (day && day.total > 0 && day.done === day.total) {
      streak += 1;
    } else if (day) {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("must_change_password, disclaimer_dismissed, role, first_name, terms_accepted_at, terms_version")
    .eq("id", user.id)
    .single();

  if (profile?.must_change_password) redirect("/change-password");
  if (!profile?.terms_accepted_at || profile.terms_version !== TERMS_VERSION) {
    redirect("/accept-terms");
  }

  const isAdmin = profile?.role === "admin";
  const streak = await computeStreak(supabase, user.id);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar isAdmin={isAdmin} streak={streak} />
        {!profile?.disclaimer_dismissed && <DisclaimerBanner />}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-28 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
        <BottomTabBar isAdmin={isAdmin} />
      </div>
      <OfflineBoundary />
    </div>
  );
}
