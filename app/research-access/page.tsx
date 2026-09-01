import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { ResearchAccessForm } from "./ResearchAccessForm";

export const metadata: Metadata = {
  title: `Peak State Labs — Research Access`,
  description:
    "Create a research account to access product information. Materials are supplied strictly for laboratory research and non-human use.",
};

const stats: { value: string; label: string }[] = [
  { value: "99%+", label: "Purity Standard" },
  { value: "COA", label: "Third-Party Tested" },
  { value: "6", label: "Research Compounds" },
];

export default function ResearchAccessPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </div>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !pt-10 !pb-4 sm:!pt-16 sm:!pb-5">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-2xl mx-auto text-center">
              {/* Brand lockup */}
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/70 px-5 py-3 shadow-sm animate-fade-in">
                  <img
                    src="/logo.png"
                    alt="Peak State Labs Logo"
                    className="h-8 w-8 rounded-lg"
                  />
                  <span className="text-xl font-bold tracking-tight">
                    {siteCopy.brand.name}
                  </span>
                </div>
              </div>

              {/* Eyebrow */}
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-[0.18em] text-[var(--accent-dark)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                  <span>RESEARCH ACCESS REQUIRED</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] animate-fade-in-up">
                Unlock the {siteCopy.brand.name} catalog
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed">
                Create your free account to view live pricing, third-party COAs,
                and 99%+ purity docs.
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-[var(--border)] bg-white/80 px-3 py-4 sm:px-4 sm:py-5 shadow-sm"
                  >
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--primary)]">
                      {s.value}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--primary)]/60 leading-tight">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Regulatory callout */}
              <div className="mt-6 rounded-2xl border border-[var(--accent)]/40 bg-[var(--muted)] p-5 text-left sm:text-center">
                <p className="text-sm font-bold text-[var(--accent-dark)]">
                  {siteCopy.brand.name}
                </p>
                <p className="mt-2 text-sm text-[var(--primary)]/75 leading-relaxed">
                  Due to regulatory changes in this industry, we require account
                  login before product information can be accessed.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Trust badge + Account form */}
        <Section className="bg-white !pt-4 !pb-6 sm:!pt-5 sm:!pb-10">
          <Container>
            <div className="max-w-md mx-auto">
              {/* Account form */}
              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                {/* Social proof */}
                <div className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-[var(--primary)]/70">
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-[var(--accent-dark)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Join 6,000+ researchers
                </div>

                <ResearchAccessForm />
              </div>

              <p className="mt-6 text-center text-xs text-[var(--primary)]/50 leading-relaxed">
                Materials are supplied strictly for laboratory research and
                non-human use. You must be 21 or older to create an account.
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
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </div>
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
