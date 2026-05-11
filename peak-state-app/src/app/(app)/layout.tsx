import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, MobileTopBar, BottomTabBar } from "@/components/Nav";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { OfflineBoundary } from "@/components/OfflineBoundary";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("must_change_password, disclaimer_dismissed, role")
    .eq("id", user.id)
    .single();

  if (profile?.must_change_password) redirect("/change-password");

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileTopBar isAdmin={isAdmin} />
        {!profile?.disclaimer_dismissed && <DisclaimerBanner />}
        <main className="flex-1 px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
        <BottomTabBar />
      </div>
      <OfflineBoundary />
    </div>
  );
}
