import type { Metadata } from "next";
import Link from "next/link";
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
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-16">
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
                Access {siteCopy.brand.name}
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed">
                Create an account or sign in to continue browsing product
                information, lab-backed resources, and research-use materials.
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
        <Section className="bg-white !py-6 sm:!py-10">
          <Container>
            <div className="max-w-md mx-auto">
              {/* Verified reviews badge */}
              <Link
                href="/reviews"
                className="group block rounded-3xl border border-[var(--border)] bg-[var(--muted)] p-6 text-center shadow-sm transition-all hover:border-[var(--accent)] hover:shadow-md"
              >
                <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] px-4 py-2 text-white">
                  <img
                    src="/logo.png"
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 rounded"
                  />
                  <span className="text-sm font-bold tracking-tight">
                    Verified Reviews
                  </span>
                </div>
                <div
                  className="mt-3 text-lg tracking-widest text-[var(--accent-dark)]"
                  aria-hidden="true"
                >
                  ★★★★★
                </div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold tracking-tight text-[var(--primary)]">
                    4.9
                  </span>
                  <span className="text-lg font-bold text-[var(--primary)]/50">
                    / 5
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[var(--primary)]/70">
                  30+ verified client check-ins
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)] group-hover:underline">
                  Read the reviews →
                </p>
              </Link>

              {/* Account form */}
              <div className="mt-6 p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm">
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
