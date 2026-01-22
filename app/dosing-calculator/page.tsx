import { Container } from "@/app/components/Container";
import { DosingCalculator } from "./DosingCalculator";

export default function DosingCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[var(--muted)] to-white print:bg-white">
      {/* Calculator Section - Minimal padding */}
      <section className="pt-6 pb-2 sm:pt-8 sm:pb-4 print:py-2">
        <Container className="print:max-w-none print:px-4">
          <DosingCalculator />
        </Container>
      </section>

      {/* Disclaimer Section */}
      <section className="py-3 bg-white print:hidden">
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
      </section>

      {/* Footer - Hide on print */}
      <footer className="py-3 border-t border-[var(--border)] print:hidden">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--primary)]/60">
            <p>&copy; {new Date().getFullYear()} Peak Performance. All rights reserved.</p>
            <p>Questions? Contact support@peakperformance.com</p>
          </div>
        </Container>
      </footer>
    </main>
  );
}
