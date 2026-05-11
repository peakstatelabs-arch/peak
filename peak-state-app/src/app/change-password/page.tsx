import { Logo } from "@/components/Logo";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata = { title: "Set a new password — Peak State Labs" };

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-bg">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <Logo size={56} />
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            Set a new password
          </h1>
          <p className="mt-1 text-sm text-fg-muted text-center">
            For security, please replace your temporary password before continuing.
          </p>
        </div>
        <div className="card">
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  );
}
