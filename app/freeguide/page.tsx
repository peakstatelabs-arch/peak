import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: `Free POWER CUT™ Guide — Peak State Labs`,
  description:
    "Get instant access to the full POWER CUT™ protocol. No sign-up required — open the free guide.",
};

export default function FreeGuidePage() {
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
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>FREE GUIDE</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
                Your Free POWER CUT™ Guide
              </h1>

              <p className="mt-4 text-lg sm:text-xl text-[var(--primary)]/70 leading-relaxed max-w-2xl mx-auto animate-fade-in-up">
                The complete 10-week protocol — the exact stack, dosing, and
                timing. No sign-up, no email required. Just tap below to open it.
              </p>

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

        {/* Disclaimer + CTA */}
        <Section className="bg-white !py-10 sm:!py-14">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg sm:text-xl text-[var(--primary)]/80 leading-relaxed">
                Materials referenced in this guide are supplied strictly for
                laboratory research and non-human use. By clicking &ldquo;Open
                the Free Guide,&rdquo; you confirm that you are 21 years or older
                and understand these items are not for human consumption.
              </p>

              <a
                href="/powercut"
                className="btn-primary inline-flex h-16 items-center justify-center rounded-2xl px-10 text-lg sm:text-xl font-bold mt-10"
              >
                Open the Free Guide
              </a>

              <p className="mt-6 text-sm text-[var(--primary)]/50">
                Instant access · No email needed
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
