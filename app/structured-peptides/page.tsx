import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { EmailCapture } from "@/app/components/EmailCapture";

export const metadata: Metadata = {
  title: "Structured Peptides — Research-Grade Peptide Protocols | Peak State Labs",
  description:
    "Join the waitlist for Structured Peptides: research-grade peptide protocols designed around clear, week-by-week structure. Educational reference for laboratory use only.",
  alternates: { canonical: "/structured-peptides" },
};

const pillars = [
  {
    title: "Structured Protocols",
    body:
      "Every peptide is paired with a clear, week-by-week reference protocol — not a vague suggestion. Dose, timing, duration, and stack interactions are documented up front.",
  },
  {
    title: "Independent Lab Testing",
    body:
      "Each batch ships with a third-party certificate of analysis. Identity, purity, and endotoxin results are linked from the product page.",
  },
  {
    title: "Educational First",
    body:
      "Mechanism, pharmacokinetics, and reported research dosing for every compound — written for researchers, not for hype.",
  },
];

const faqs = [
  {
    q: "What is Structured Peptides?",
    a: "An upcoming line of research-grade peptides organized around documented, week-by-week protocols. Each compound ships with mechanism notes, reported research dosing, reconstitution guidance, and a third-party certificate of analysis.",
  },
  {
    q: "When does it launch?",
    a: "We are notifying the waitlist first as inventory and lab testing complete. Join below to be on that list.",
  },
  {
    q: "Is this for human use?",
    a: "No. Everything on this site is for laboratory research and educational reference only. Not a drug, supplement, or treatment. Not for human consumption.",
  },
  {
    q: "Who is behind this?",
    a: "Structured Peptides is a Peak State Labs project. You can review existing research overviews on peakstate.shop.",
  },
];

export default function StructuredPeptidesPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Structured Peptides"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">Structured Peptides</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--primary)]/70">
            <a
              href="#pillars"
              className="font-medium hover:text-[var(--primary)] transition-colors"
            >
              Approach
            </a>
            <a
              href="#faq"
              className="font-medium hover:text-[var(--primary)] transition-colors"
            >
              FAQ
            </a>
          </nav>
          <a
            href="#waitlist"
            className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            Join Waitlist
          </a>
        </Container>
      </header>

      <main>
        <Section className="relative overflow-hidden gradient-hero !py-16 sm:!py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>WAITLIST OPEN</span>
              </div>
              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Structured Peptides.
                <span className="block text-2xl sm:text-3xl text-[var(--primary)]/60 font-semibold mt-3">
                  Research-grade compounds. Documented protocols. No guessing.
                </span>
              </h1>
              <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-2xl">
                Most peptide vendors hand you a vial and a paragraph. We hand
                you a vial and a protocol — week by week, with dose, timing,
                stack interactions, and the lab certificate that backs the
                batch. Join the waitlist for early access.
              </p>

              <div id="waitlist" className="mt-10 max-w-xl">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Structured Peptides — Waitlist signup"
                  bodyHint="Please add me to the Structured Peptides waitlist:"
                />
              </div>

              <p className="mt-5 text-xs text-[var(--primary)]/50 max-w-xl">
                For laboratory research and educational reference only. Not a
                drug, supplement, or treatment. Not for human consumption.
              </p>
            </div>
          </Container>
        </Section>

        <Section id="pillars" className="!py-16 sm:!py-20">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm font-bold tracking-wider text-[var(--accent-dark)] uppercase">
                Our Approach
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                Structure is the product.
              </h2>
              <p className="mt-4 text-[var(--primary)]/70">
                Three principles guide every compound we list.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 text-[var(--primary)]/70 text-sm leading-relaxed">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="bg-[var(--muted)] !py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Get notified when we launch.
              </h2>
              <p className="mt-4 text-[var(--primary)]/70">
                Waitlist members get first access to new batches, early
                protocol drafts, and lab results before public release.
              </p>
              <div className="mt-8 max-w-xl mx-auto">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Structured Peptides — Waitlist signup"
                  bodyHint="Please add me to the Structured Peptides waitlist:"
                />
              </div>
            </div>
          </Container>
        </Section>

        <Section id="faq" className="!py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Frequently asked.
              </h2>
              <div className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {faqs.map((f) => (
                  <div key={f.q} className="py-6">
                    <h3 className="font-semibold text-lg">{f.q}</h3>
                    <p className="mt-2 text-[var(--primary)]/70">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-[var(--border)] py-10 text-sm text-[var(--primary)]/60">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Peak State Labs.</p>
          <p className="text-xs">
            For laboratory research only. Not for human consumption.
          </p>
        </Container>
      </footer>
    </div>
  );
}
