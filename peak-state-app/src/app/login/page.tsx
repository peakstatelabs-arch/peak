import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in — Peak State Labs" };

export default function LoginPage() {
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
          <p className="mt-1 text-sm text-fg-muted">Client portal</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-1">Sign in</h2>
          <p className="text-sm text-fg-muted mb-6">
            Enter the credentials provided by your coach.
          </p>
          <LoginForm />
        </div>

        <p className="mt-8 text-center text-xs text-fg-subtle">
          For research and educational purposes only. Not medical advice.
        </p>
      </div>
    </main>
  );
}
