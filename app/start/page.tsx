import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "Your Journey Begins — Peak State Labs",
  description:
    "Your POWER CUT has arrived. Start here for the reminders and community link that will keep you consistent.",
};

const reminders = [
  {
    title: "Don’t rush the process",
    body: "Small consistent actions compound faster than extreme ones.",
  },
  {
    title: "Use the community",
    body: "Questions, wins, uncertainty, breakthroughs — bring all of it into the community.",
  },
  {
    title: "Stay connected",
    body: "If something feels unclear, reach out. Support is part of the journey.",
  },
];

export default function StartPage() {
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
                Your journey officially begins now.
              </h1>

              <div className="mt-8 space-y-4 text-lg sm:text-xl text-[var(--primary)]/80 leading-relaxed animate-fade-in-up stagger-1">
                <p>You do not need to be perfect.</p>
                <p>You do not need to have everything figured out.</p>
                <p>
                  You simply need to stay connected to the structure long enough
                  for it to work.
                </p>
                <p>
                  POWER CUT
                  <span className="text-[0.5em] align-super">™</span> was
                  designed to help remove guesswork so you can focus on
                  consistency, momentum, and becoming someone you trust again.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Reminders */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Three quick reminders
                </h2>
              </div>

              <div className="space-y-6">
                {reminders.map((item, index) => (
                  <div
                    key={item.title}
                    className={`p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] shadow-sm card-hover animate-fade-in-up stagger-${
                      index + 1
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-xl text-[var(--primary)]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-base text-[var(--primary)]/80 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <a
                href="https://www.skool.com/peak-state-labs-7241"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
              >
                Continue to the Community &rarr;
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
