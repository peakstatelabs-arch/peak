import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: "You're In — The Body Composition Blueprint™",
  description:
    "Your Body Composition Blueprint is on its way to your inbox. Here's what to do next.",
};

export default function BodyCompThankYouPage() {
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
        <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>PURCHASE CONFIRMED</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                You&rsquo;re In.
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/75 animate-fade-in-up stagger-1">
                The Body Composition Blueprint
                <span className="text-[0.6em] align-super">™</span> is on its
                way to your inbox.
              </p>

              <p className="mt-6 text-base sm:text-lg text-[var(--primary)]/70 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-2">
                Over the next hour, you&rsquo;re going to have more clarity
                around fat loss, muscle retention, nutrition, training,
                recovery, and body composition than most people gain from
                months of scrolling online.
              </p>
            </div>
          </Container>
        </Section>

        {/* Section 1 — Here's What To Do Next */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Here&rsquo;s What To Do Next
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {[
                  {
                    n: "1",
                    title: "Check your inbox.",
                    body: (
                      <>
                        Your Blueprint should arrive within the next few
                        minutes.
                        <br className="hidden sm:block" />
                        If you don&rsquo;t see it, check Promotions or Spam.
                      </>
                    ),
                  },
                  {
                    n: "2",
                    title: "Start with the Body Composition Roadmap.",
                    body: "Everything else will make more sense once you understand the framework.",
                  },
                  {
                    n: "3",
                    title: "Don't try to consume everything in one sitting.",
                    body: (
                      <>
                        The goal isn&rsquo;t to learn more information.
                        <br className="hidden sm:block" />
                        The goal is to build a plan.
                      </>
                    ),
                  },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="rounded-2xl bg-white border border-[var(--border)] shadow-sm p-5 sm:p-6 flex items-start gap-4 sm:gap-5"
                  >
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg sm:text-xl flex items-center justify-center shadow-sm">
                      {step.n}
                    </div>
                    <div className="min-w-0 pt-0.5 sm:pt-1">
                      <h3 className="text-lg sm:text-xl font-bold text-[var(--primary)] leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[var(--primary)]/70 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Section 2 — A Quick Thought */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>A QUICK THOUGHT</span>
                </div>
              </div>

              <div className="relative rounded-3xl border border-[var(--border)] bg-[var(--muted)]/70 p-7 sm:p-10 space-y-5 text-[var(--primary)]/80 leading-relaxed text-base sm:text-lg">
                <p>
                  Most people don&rsquo;t fail because they&rsquo;re missing
                  information.
                  <br className="hidden sm:block" />
                  They fail because they never stay with one process long
                  enough to see it work.
                </p>
                <p>
                  The Blueprint is designed to help you simplify everything
                  you&rsquo;ve been hearing and organize it into a framework
                  you can actually follow.
                </p>
                <p className="text-[var(--primary)] font-semibold">
                  Take your time.
                </p>
                <p className="text-[var(--primary)] font-semibold">
                  Focus on understanding before optimization.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Section 3 — Have Questions? */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-8 sm:p-12 shadow-2xl">
                <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[var(--accent)]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                <div className="relative text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Have Questions?
                  </h2>

                  <div className="mt-6 space-y-4 text-base sm:text-lg text-white/85 leading-relaxed max-w-2xl mx-auto">
                    <p>
                      Every body composition journey looks a little different.
                    </p>
                    <p>Some people are focused on fat loss.</p>
                    <p>
                      Some want to preserve muscle while using a GLP-1.
                    </p>
                    <p>Some are trying to figure out where to start.</p>
                  </div>

                  <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                    <p>
                      If you&rsquo;d like help creating a plan, book a
                      complimentary{" "}
                      <span className="font-bold text-[var(--accent)]">
                        15-minute Body Composition Strategy Call
                      </span>
                      .
                    </p>
                    <p className="mt-3">
                      We&rsquo;ll talk through your goals, answer your
                      questions, and help you identify the next best step.
                    </p>
                  </div>

                  <a
                    href="https://cal.com/peakstatelabs/the-body-composition-blueprint-strategy-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold mt-10"
                  >
                    Book Your Free Call
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>

                  <p className="mt-4 text-sm text-white/60">
                    Free 15-minute call. No obligation.
                  </p>
                </div>
              </div>
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
