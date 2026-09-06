import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { ProductToggle } from "./ProductToggle";

const COMMUNITY_URL = "https://www.skool.com/peak-state-labs-7241";
const SUPPORT_EMAIL = "support@peakstate.shop";

export const metadata: Metadata = {
  title: "Setup Instructions — Peak State Labs",
  description:
    "Your Peak State Labs order has arrived. Get set up for success in a few simple steps and join the community for the full instructions.",
};

function StorageIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 3h16v18H4zM4 12h16M9 6v3M9 15v3"
      />
    </svg>
  );
}

const storagePoints = [
  "Store your vials refrigerated.",
  "Keep them away from direct light and heat.",
  "Leave everything sealed until you're ready to begin.",
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </a>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>START HERE</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                Your order has arrived. Let&apos;s get you set up.
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/80 leading-relaxed animate-fade-in-up stagger-1">
                Whether you received the POWER CUT
                <span className="text-[0.5em] align-super">™</span> Stack or
                individual vials, these few steps will set you up for success.
                The
                full, detailed instructions live inside our customer community —
                and joining takes less than a minute.
              </p>

              <div className="mt-8 animate-fade-in-up stagger-2">
                <a
                  href="#setup"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-[var(--accent)]/50 bg-white/60 px-6 text-base font-semibold text-[var(--primary)] hover:bg-white transition-colors"
                >
                  Start your setup &darr;
                </a>
              </div>
            </div>
          </Container>
        </Section>

        {/* Setup — product toggle */}
        <Section id="setup" className="bg-white">
          <Container>
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                First, tell us what you received
              </h2>
              <p className="mt-3 text-base text-[var(--primary)]/70">
                Pick your product below for the right first steps.
              </p>
            </div>
            <ProductToggle />
          </Container>
        </Section>

        {/* Storage basics */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-5 p-6 sm:p-8 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)]/20 text-[var(--accent-dark)]">
                  <StorageIcon className="w-6 h-6" />
                </span>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    How to store your vials
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {storagePoints.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-2 h-2 w-2 rounded-full bg-[var(--accent)]" />
                        <span className="text-base text-[var(--primary)]/80 leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Community CTA */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>THE FULL INSTRUCTIONS LIVE HERE</span>
              </div>

              <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">
                Join the Peak State community
              </h2>

              <p className="mt-4 text-lg text-[var(--primary)]/80 leading-relaxed">
                Everything you need — the complete step-by-step instructions,
                answers to common questions, and support from our team and other
                customers — is waiting inside. This is the single most important
                step to getting the most out of your order.
              </p>

              <div className="mt-8">
                <a
                  href={COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                >
                  Join the Community &rarr;
                </a>
              </div>

              <p className="mt-4 text-sm text-[var(--primary)]/60">
                Free to join · Takes less than a minute
              </p>
            </div>
          </Container>
        </Section>

        {/* Support */}
        <Section className="bg-white !py-14">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                Need a hand?
              </h2>
              <p className="mt-3 text-base text-[var(--primary)]/70 leading-relaxed">
                If anything is unclear or your order arrived with an issue, reach
                out and we&apos;ll help you get sorted.
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-5 inline-flex items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-6 py-3 text-base font-semibold text-[var(--primary)] hover:bg-[var(--muted-dark)] transition-colors"
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-12">
          <div className="text-center pb-8 border-b border-white/10">
            <p className="text-sm text-white/60">
              {siteCopy.footer.productDisclaimer}
            </p>
          </div>
          <div className="py-8 border-b border-white/10">
            <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </a>
            </div>
          </div>
          <div className="pt-8">
            <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
              {siteCopy.footer.disclaimer}
            </p>
            <p className="text-xs text-white/40 text-center mt-6">
              &copy; {new Date().getFullYear()} {siteCopy.footer.copyrightName}.
              All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
