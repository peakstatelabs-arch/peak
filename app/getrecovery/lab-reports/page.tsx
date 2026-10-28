import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { siteCopy } from "@/content/siteCopy";
import { PURITY_TESTS } from "@/app/purity-tests/data";
import { RECOVERY_STACK_NAME } from "../recoveryStack";

export const metadata: Metadata = {
  title: `${RECOVERY_STACK_NAME} Lab Reports — BPC-157 + TB-500, KPV & GHK-Cu | Peak State Labs`,
  description:
    "Third-party certificates of analysis for every peptide in the FULL REPAIR recovery stack: BPC-157 + TB-500, KPV and GHK-Cu.",
  alternates: { canonical: "/getrecovery/lab-reports" },
};

// The three compounds in the stack, with the purity printed on each COA.
const REPORTS = [
  { slug: "bpc-tb", purity: "99.67%" },
  { slug: "kpv", purity: "99.36%" },
  { slug: "ghkcu", purity: "99.95%" },
].map((r) => ({ ...r, test: PURITY_TESTS[r.slug] }));

export default function RecoveryLabReportsPage() {
  return (
    <div className="min-h-screen bg-[var(--muted)] text-[var(--primary)]">
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
          <a
            href="/getrecovery#buy"
            className="text-sm font-semibold text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
          >
            ← Back To {RECOVERY_STACK_NAME}
          </a>
        </Container>
      </header>

      <main className="py-10 sm:py-14">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)] uppercase">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>Third-Party Tested · ILS Laboratories</span>
              </div>
              <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
                {RECOVERY_STACK_NAME} Lab Reports
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[var(--primary)]/70 max-w-2xl mx-auto leading-relaxed">
                The certificates of analysis for the current lot of each
                peptide in the stack. Tap any page to open it full size.
              </p>

              {/* Jump links */}
              <nav className="mt-6 flex flex-wrap justify-center gap-2">
                {REPORTS.map(({ slug, test }) => (
                  <a
                    key={slug}
                    href={`#${slug}`}
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--primary)] transition-colors hover:border-[var(--accent)]"
                  >
                    {test.name}
                  </a>
                ))}
              </nav>
            </div>

            {REPORTS.map(({ slug, purity, test }) => (
              <section key={slug} id={slug} className="mt-12 scroll-mt-24">
                <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {test.name} {test.amount}
                  </h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold tracking-wider text-emerald-700">
                    PASS · {purity}
                  </span>
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {test.images.map((src, i) => (
                    <a
                      key={src}
                      href={encodeURI(src)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm card-hover"
                    >
                      <div className="p-3 sm:p-4">
                        <img
                          src={encodeURI(src)}
                          alt={`${test.title} — Page ${i + 1}`}
                          className="h-auto w-full rounded-xl"
                          loading={slug === "bpc-tb" && i === 0 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--muted)]/60 px-5 py-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                          Page {i + 1} of {test.images.length}
                        </p>
                        <span className="text-xs font-semibold text-[var(--primary)]/60 group-hover:text-[var(--accent-dark)]">
                          Open full size ↗
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-14 text-center">
              <a
                href="/getrecovery#buy"
                className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
              >
                Get The {RECOVERY_STACK_NAME} Stack →
              </a>
            </div>
          </div>
        </Container>
      </main>

      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-8">
          <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
            {siteCopy.footer.disclaimer}
          </p>
        </Container>
      </footer>
    </div>
  );
}
