import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "Welcome to the 1% — Peak State Labs",
  description:
    "Your POWER CUT order is confirmed. Here's your transformation timeline and next steps.",
};

export default function ThankYouPage() {
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
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>ORDER CONFIRMED</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                Welcome to the 1%. The Biological Shortcut is Now in Your Hands.
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 animate-fade-in-up stagger-1">
                While the rest of the world &ldquo;tries&rdquo; to burn fat and
                build lean muscle, you are now operating on a structured,
                scientific timeline.
              </p>

              {/* Hero Image */}
              <div className="mt-10 relative flex items-center justify-center animate-drop-in">
                <div className="relative">
                  <img
                    src="/product.png"
                    alt="POWER CUT Peptide Kit"
                    className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Transformation Timeline */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your Transformation Timeline
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "Step 1",
                    title: "Immediate Digital Immersion (Check Your Inbox).",
                    body: (
                      <>
                        You will receive the Power Cut
                        <span className="text-[0.5em] align-super">™</span>{" "}
                        10-Week Workflow within 24 hours. This is your
                        blueprint. Read it as soon as you get it.
                      </>
                    ),
                  },
                  {
                    step: "Step 2",
                    title: "Join the Private Community.",
                    body: (
                      <>
                        Inside our private Power Cut
                        <span className="text-[0.5em] align-super">™</span>{" "}
                        community, you&rsquo;ll find protocol guidance,
                        progress tracking, and direct access to the support
                        ecosystem designed to help you succeed.{" "}
                        <a
                          href="https://www.skool.com/peak-state-labs-7241/about"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent-dark)] font-semibold underline hover:no-underline"
                        >
                          Click here to join now.
                        </a>
                      </>
                    ),
                  },
                  {
                    step: "Step 3",
                    title: "Book Your Success Call.",
                    body: (
                      <>
                        To ensure you get the best possible results from the
                        protocol, we recommend scheduling your first Power Cut
                        <span className="text-[0.5em] align-super">™</span>{" "}
                        coaching call. You can book your call directly inside
                        the community dashboard once you join.
                      </>
                    ),
                  },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className={`p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)] shadow-sm card-hover animate-fade-in-up stagger-${
                      index + 1
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-xl text-[var(--primary)]">
                          {item.step}: {item.title}
                        </h3>
                        <p className="mt-2 text-base text-[var(--primary)]/80 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Workflow is the Master */}
        <Section className="bg-[var(--primary)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">
                The products are the tools, but the Workflow is the master.
              </h2>
              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                Most people fail because they have no sequence and no clarity.
                You now have both. Use this time before your stack arrives to
                prep your nutrition, fix your sleep, and prime your mind for
                the 10-week overhaul ahead.
              </p>
            </div>
          </Container>
        </Section>

        {/* Orders for the Next 48 Hours */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Your Orders for the Next 48 Hours
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[var(--accent-dark)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--primary)]">
                        Download the Protocol
                      </h3>
                      <p className="mt-1 text-base text-[var(--primary)]/80 leading-relaxed">
                        Open the PDF immediately upon receiving it in your
                        inbox. Familiarize yourself with the sequence.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-6 h-6 mt-1 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-[var(--accent-dark)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--primary)]">
                        Commit to the Process
                      </h3>
                      <p className="mt-1 text-base text-[var(--primary)]/80 leading-relaxed">
                        You&rsquo;ve made the investment. Now, show up for the
                        results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Support */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Need support?
              </h2>
              <p className="mt-6 text-lg text-[var(--primary)]/80 leading-relaxed">
                Contact us any time for support.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:3135959239"
                  className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                >
                  Call: 313-595-9239
                </a>
                <a
                  href="mailto:peakstatelabs@gmail.com"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-8 text-base sm:text-lg font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)] whitespace-nowrap"
                >
                  Email Support
                </a>
              </div>
              <p className="mt-6 text-sm text-[var(--primary)]/60">
                peakstatelabs@gmail.com
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
