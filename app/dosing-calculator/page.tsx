import { Suspense } from "react";
import { Section } from "@/app/components/Section";
import { Container } from "@/app/components/Container";
import { DosingCalculator } from "./DosingCalculator";

// Server component that extracts search params
function DosingCalculatorWithParams({
  searchParams,
}: {
  searchParams: Promise<{ protocol?: string }>;
}) {
  return (
    <DosingCalculatorWrapper searchParams={searchParams} />
  );
}

async function DosingCalculatorWrapper({
  searchParams,
}: {
  searchParams: Promise<{ protocol?: string }>;
}) {
  const params = await searchParams;
  return <DosingCalculator initialProtocol={params.protocol} />;
}

export default async function DosingCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ protocol?: string }>;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--muted)] to-white">
      {/* Hero Section */}
      <Section className="pt-12 pb-8 sm:pt-16 sm:pb-12">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[var(--accent)]/20 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              Customer Dosing Portal
            </div>
          </div>
        </Container>
      </Section>

      {/* Calculator Section */}
      <Section className="py-8 sm:py-12">
        <Container>
          <Suspense
            fallback={
              <div className="w-full max-w-4xl mx-auto animate-pulse">
                <div className="h-12 bg-[var(--muted)] rounded-xl mb-8" />
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="h-96 bg-[var(--muted)] rounded-2xl" />
                  <div className="h-96 bg-[var(--muted)] rounded-2xl" />
                </div>
              </div>
            }
          >
            <DosingCalculatorWithParams searchParams={searchParams} />
          </Suspense>
        </Container>
      </Section>

      {/* Disclaimer Section */}
      <Section className="py-8 sm:py-12 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs text-[var(--primary)]/50 leading-relaxed">
              <strong>Disclaimer:</strong> This dosing guide is for informational purposes only and
              should not replace professional medical advice. Always consult with a qualified
              healthcare provider before starting any peptide protocol. Individual results may
              vary based on factors including diet, exercise, and overall health. These products
              are intended for research purposes only.
            </p>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border)]">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--primary)]/60">
            <p>&copy; {new Date().getFullYear()} Peak Performance. All rights reserved.</p>
            <p>Questions? Contact support@peakperformance.com</p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
