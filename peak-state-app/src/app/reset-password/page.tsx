import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { ChangePasswordForm } from "@/app/change-password/ChangePasswordForm";

export const metadata = { title: "Set new password — Peak State Labs" };

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // If the reset link expired or someone hit this URL without a session,
  // bounce them to forgot-password to start over.
  if (!user) redirect("/forgot-password");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg">
      <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Logo size={56} />
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            Peak State <span className="text-accent">Labs</span>
          </h1>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-1">Pick a new password</h2>
          <p className="text-sm text-fg-muted mb-6">
            At least 10 characters. You&apos;ll be signed in after you save.
          </p>
          <ChangePasswordForm firstLogin={false} />
        </div>
      </div>
    </main>
  );
}
