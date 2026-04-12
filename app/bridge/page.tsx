import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: `THE POWER CUT™ — A Structured System Built Around 3 Core Mechanisms`,
  description:
    "A structured approach to system design. Support metabolic function, maintain lean tissue, enhance recovery capacity, and promote stable energy and appetite signaling.",
};

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
        <CheckIcon className="w-3 h-3 text-[var(--accent-dark)]" />
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function BridgePage() {
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
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>SYSTEM OVERVIEW</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
                This is a structured system built around{" "}
                <span className="text-[var(--accent-dark)]">3 core mechanisms</span>.
              </h1>

              {/* Product Image */}
              <div className="mt-8 relative flex items-center justify-center animate-drop-in">
                <div className="relative">
                  <img
                    src="/product.png"
                    alt="POWER CUT Peptide Kit"
                    className="w-full max-w-sm sm:max-w-md drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Objective */}
        <Section className="bg-[var(--primary)] text-white !py-10 sm:!py-14">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Objective
              </h2>

              <ul className="mt-10 space-y-4 text-lg sm:text-xl text-white/90 text-left max-w-xl mx-auto">
                <Bullet>Support metabolic function</Bullet>
                <Bullet>Maintain lean tissue</Bullet>
                <Bullet>Enhance recovery capacity</Bullet>
                <Bullet>Promote stable energy and appetite signaling</Bullet>
              </ul>

              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {[
                  "Without extremes",
                  "Without unnecessary complexity",
                  "Without guesswork",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[var(--accent)]"
                  >
                    <CheckIcon className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur">
                <p className="text-white/70">This is not a supplement stack.</p>
                <p className="mt-2 text-xl font-bold text-[var(--accent)]">
                  It&apos;s a structured approach to system design.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="bg-white !py-10 sm:!py-14">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg text-[var(--primary)]/70">
                Want the complete architecture?
              </p>
              <a
                href="https://peakstate.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex h-16 items-center justify-center rounded-2xl px-10 text-lg sm:text-xl font-bold mt-6"
              >
                View full breakdown
              </a>
              <p className="mt-6 text-xs text-[var(--primary)]/50">
                You&apos;ll be taken to peakstate.shop for the full protocol details.
              </p>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </a>
              <nav className="flex flex-wrap justify-center gap-6 text-sm">
                <a
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="/#pricing"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/dosing-calculator"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Dosing Calculator
                </a>
                <a
                  href="/#faq"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </nav>
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
