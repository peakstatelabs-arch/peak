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

export default function ResearchAccessPage() {
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
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>RESEARCH ACCESS</span>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-10 w-10 rounded-lg"
                />
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
                  {siteCopy.brand.name}
                </h1>
              </div>

              <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70">
                Create a research account to continue browsing product
                information.
              </p>
            </div>
          </Container>
        </Section>

        {/* Account Creation Form */}
        <Section className="bg-white !py-6 sm:!py-10">
          <Container>
            <div className="max-w-md mx-auto">
              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-white shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight text-center">
                  Create an account
                </h2>
                <p className="mt-2 text-sm text-[var(--primary)]/60 text-center">
                  Password will be emailed to you.
                </p>

                <ResearchAccessForm />
              </div>

              <p className="mt-6 text-center text-sm text-[var(--primary)]/70 leading-relaxed">
                Due to regulatory changes in this industry, we now require an
                account login to access product information and continue
                browsing.
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
