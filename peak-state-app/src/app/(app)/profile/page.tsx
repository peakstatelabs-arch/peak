import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { ChangePasswordForm } from "@/app/change-password/ChangePasswordForm";
import { ProfileForm } from "./ProfileForm";
import { ThemeSegmented } from "@/components/ThemeSegmented";

export const metadata = { title: "Profile — Peak State Labs" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name, goal_weight_lb")
    .eq("id", user.id)
    .single();

  return (
    <>
      <PageHeader title="Profile" description="Manage your account." />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card">
          <h3 className="font-semibold mb-3">Account</h3>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-fg-muted">Email</dt><dd>{user.email}</dd></div>
            <div className="flex justify-between"><dt className="text-fg-muted">Member since</dt><dd>{new Date(user.created_at).toLocaleDateString()}</dd></div>
          </dl>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-1">Appearance</h3>
          <p className="text-xs text-fg-subtle mb-3">
            Match your device, or pick a side.
          </p>
          <ThemeSegmented />
        </section>

        <section className="card md:col-span-2">
          <h3 className="font-semibold mb-3">Your info</h3>
          <ProfileForm
            firstName={profile?.first_name ?? ""}
            lastName={profile?.last_name ?? ""}
            goalWeight={profile?.goal_weight_lb ?? null}
          />
        </section>

        <section className="card md:col-span-2">
          <h3 className="font-semibold mb-3">Change password</h3>
          <ChangePasswordForm firstLogin={false} />
        </section>
      </div>
    </>
  );
}
