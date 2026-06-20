import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";
import { BottomTabBar } from "@/components/Nav";
import { AdminTopNav } from "./AdminTopNav";

export const metadata = { title: "Admin — Peak State Labs" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60 safe-top">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
            <Logo size={28} />
            <span className="font-display font-semibold tracking-tight truncate">
              Admin
            </span>
          </Link>
          <AdminTopNav />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-5 md:py-8 pb-28 md:pb-8">
        {children}
      </main>
      <BottomTabBar isAdmin />
    </div>
  );
}
