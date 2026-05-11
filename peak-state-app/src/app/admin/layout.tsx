import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/Logo";

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
      <header className="border-b border-border bg-bg-elev/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo size={32} />
            <span className="font-display font-semibold">Admin</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-fg-muted hover:text-fg">Clients</Link>
            <Link href="/admin/protocols" className="text-fg-muted hover:text-fg">Protocols</Link>
            <Link href="/admin/check-ins" className="text-fg-muted hover:text-fg">Check-ins</Link>
            <Link href="/dashboard" className="text-fg-muted hover:text-fg">← Client view</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
