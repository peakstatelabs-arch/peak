import { Logo } from "@/components/Logo";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata = { title: "Reset password — Peak State Labs" };

export default function ForgotPasswordPage() {
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
          <h2 className="text-lg font-semibold mb-1">Reset your password</h2>
          <p className="text-sm text-fg-muted mb-6">
            Enter the email tied to your account. We&apos;ll send you a link to set a new password.
          </p>
          <ForgotPasswordForm />
          <p className="mt-6 text-sm text-fg-muted text-center">
            <Link href="/login" className="text-accent hover:underline">← Back to sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
