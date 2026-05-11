import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Welcome — Peak State Labs" };

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, must_change_password")
    .eq("id", user.id)
    .single();

  if (profile?.must_change_password) redirect("/change-password");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg">
      <div className="w-full max-w-xl">
        <div className="flex flex-col items-center mb-10">
          <Logo size={56} />
        </div>
        <div className="card space-y-6">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}.
            </h1>
            <p className="mt-2 text-fg-muted">
              You're set up. Here's a quick tour of what you'll find inside.
            </p>
          </div>
          <ul className="space-y-3 text-sm">
            <Item title="Dashboard" body="Your daily snapshot — dosing schedule, weight, compliance streak." />
            <Item title="Peptide Tracker" body="Build protocols, log doses, see your calendar, get reminders." />
            <Item title="Body Tracker" body="Daily weight, measurements, progress photos, and trend charts." />
            <Item title="Workouts & Nutrition" body="Programs, logger, macros and meal plans tuned to your goals." />
            <Item title="Community" body="See other clients' milestones — accountability, no data sharing." />
          </ul>
          <Link href="/dashboard" className="btn-primary w-full">
            Enter the portal
          </Link>
        </div>
      </div>
    </main>
  );
}

function Item({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-fg-muted">{body}</div>
      </div>
    </li>
  );
}
