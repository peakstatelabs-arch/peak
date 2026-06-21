import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { TERMS_VERSION } from "@/lib/legal";
import { AcceptForm } from "./AcceptForm";

export const metadata = { title: "Accept terms — Peak State Labs" };

export default async function AcceptTermsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("terms_accepted_at, terms_version")
    .eq("id", user.id)
    .single();

  // Already accepted the current version? Send them on.
  if (profile?.terms_accepted_at && profile.terms_version === TERMS_VERSION) {
    redirect("/dashboard");
  }

  const isUpdate = Boolean(profile?.terms_accepted_at);

  return (
    <main className="min-h-screen bg-bg px-6 py-12 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <Logo size={48} />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Peak State <span className="text-accent">Labs</span>
          </h1>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {isUpdate ? "We've updated our terms" : "One quick thing before you start"}
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            {isUpdate
              ? "We've updated our Terms of Service and Privacy Policy. Please review and accept to continue."
              : "Take a minute to look over the Terms of Service and Privacy Policy. They're written in plain English — no surprises."}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              href="/terms"
              target="_blank"
              className="btn-secondary text-center"
            >
              Read Terms ↗
            </Link>
            <Link
              href="/privacy"
              target="_blank"
              className="btn-secondary text-center"
            >
              Read Privacy ↗
            </Link>
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <AcceptForm version={TERMS_VERSION} />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-fg-subtle">
          Version {TERMS_VERSION}
        </p>
      </div>
    </main>
  );
}
