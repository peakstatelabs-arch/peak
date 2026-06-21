import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { InstallPWABanner } from "@/components/InstallPWABanner";
import { createClient } from "@/lib/supabase/server";
import { TERMS_VERSION } from "@/lib/legal";
import { ProtocolWizard } from "./ProtocolWizard";

export const metadata = { title: "Choose your protocol — Peak State Labs" };
export const dynamic = "force-dynamic";

export default async function OnboardProtocolPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "first_name, must_change_password, terms_accepted_at, terms_version, goal_weight_lb, morning_time, evening_time"
    )
    .eq("id", user.id)
    .single();

  if (profile?.must_change_password) redirect("/change-password");
  if (!profile?.terms_accepted_at || profile.terms_version !== TERMS_VERSION) {
    redirect("/accept-terms");
  }

  // If they already have an active protocol, skip the wizard.
  const { count } = await supabase
    .from("peptide_protocols")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("active", true);
  if ((count ?? 0) > 0) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-bg">
      <InstallPWABanner />
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center mb-8">
          <Logo size={40} />
          <h1 className="mt-3 font-display text-xl font-semibold tracking-tight">
            Peak State <span className="text-accent">Labs</span>
          </h1>
        </div>
        <ProtocolWizard
          firstName={profile?.first_name ?? null}
          morningTime={profile?.morning_time ?? "09:00"}
          eveningTime={profile?.evening_time ?? "20:00"}
          existingGoalWeight={profile?.goal_weight_lb ?? null}
        />
      </div>
    </main>
  );
}
