import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "Peak State Labs — Return Policy",
  description:
    "All sales at Peak State Labs are final. Please review our return policy before placing an order.",
};

export default function PolicyPage() {
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
          <a
            href="/"
            className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
          >
            Return Home
          </a>
        </Container>
      </header>

      <main>
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>POLICIES</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Return Policy
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70">
                Please review this policy carefully before placing an order.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-white !pt-6 sm:!pt-10">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm space-y-6 text-[var(--primary)]/80 leading-relaxed">
                <p className="text-lg font-semibold text-[var(--primary)]">
                  Due to the nature of our offerings, all sales are considered
                  final.
                </p>

                <p>
                  Opened, used, or tampered products are not eligible for
                  return, refund, or exchange.
                </p>

                <p>
                  If there is an issue with your order or shipment, please
                  contact us directly so our team can review the situation and
                  work toward an appropriate resolution when applicable.
                </p>

                <div className="space-y-3">
                  <p>Any approved returns must:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>be authorized in advance</li>
                    <li>remain unopened and unused</li>
                    <li>and be returned in original condition</li>
                  </ul>
                </div>

                <p>Unauthorized returns may not be accepted.</p>

                <p>
                  By completing a purchase with {siteCopy.brand.name}, you
                  acknowledge that you have reviewed and agreed to this policy.
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-[var(--primary)]/50">
                This policy was last updated on February 2, 2026.
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
