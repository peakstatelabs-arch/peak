import { Section } from "@/app/components/Section";
import { Container } from "@/app/components/Container";
import { DosingCalculator } from "./DosingCalculator";

export default function DosingCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--muted)] to-white print:bg-white">
      {/* Hero Section */}
      <Section className="pt-12 pb-4 sm:pt-16 sm:pb-6 print:pt-4 print:pb-2">
        <Container>
          <div className="text-center print:hidden">
            <div className="inline-flex items-center gap-2 bg-[var(--accent)]/20 text-[var(--primary)] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
              Customer Dosing Portal
            </div>
          </div>
        </Container>
      </Section>

      {/* Calculator Section */}
      <Section className="py-4 sm:py-8 print:py-2">
        <Container className="print:max-w-none print:px-4">
          <DosingCalculator />
        </Container>
      </Section>

      {/* Disclaimer Section - Hide on print */}
      <Section className="py-8 sm:py-12 bg-white print:hidden">
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

      {/* Footer - Hide on print */}
      <footer className="py-6 border-t border-[var(--border)] print:hidden">
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
