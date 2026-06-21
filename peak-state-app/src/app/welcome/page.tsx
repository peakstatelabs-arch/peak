import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EnableRemindersButton } from "./EnableRemindersButton";

export const metadata = { title: "Welcome — Peak State Labs" };
export const dynamic = "force-dynamic";

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

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: nextDose }, { data: protocol }] = await Promise.all([
    supabase
      .from("peptide_doses")
      .select("scheduled_for, peptide_name")
      .eq("user_id", user.id)
      .gte("scheduled_for", today)
      .order("scheduled_for")
      .limit(1)
      .maybeSingle(),
    supabase
      .from("peptide_protocols")
      .select("name")
      .eq("user_id", user.id)
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const protocolName = protocol?.name?.split(" · ")[0] ?? null;
  const startDate = nextDose?.scheduled_for ?? null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} />
        </div>
        <div className="card text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}.
          </h1>

          {protocolName && startDate ? (
            <p className="mt-4 text-fg-muted leading-relaxed">
              Your <span className="font-semibold text-fg">{protocolName}</span> protocol starts{" "}
              <span className="font-semibold text-fg">{prettyDate(startDate)}</span>.
              <br />
              We&apos;ll remind you before every dose so nothing slips.
            </p>
          ) : (
            <p className="mt-4 text-fg-muted leading-relaxed">
              You&apos;re in. Your coach will assign your protocol shortly — turn on reminders now
              and you&apos;ll get a ping the moment your first dose is due.
            </p>
          )}

          <div className="mt-7">
            <EnableRemindersButton />
            <Link
              href="/dashboard"
              className="block mt-3 text-sm text-fg-subtle hover:text-fg"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function prettyDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  const label = diff === 0 ? "today" : diff === 1 ? "tomorrow" : "";
  const date = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return label ? `${date} (${label})` : date;
}
