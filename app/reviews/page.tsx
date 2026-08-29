import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { highlightStats } from "@/content/reviews";
import { GatedShopLink } from "@/app/components/GatedShopLink";
import { ReviewsGallery } from "./ReviewsGallery";

export const metadata: Metadata = {
  title: "POWER CUT™ Reviews — Real Client Results | Peak State Labs",
  description:
    "Unfiltered check-ins from the Peak State Labs community: real fat loss, lower body fat, quieter food noise, better sleep and lean muscle on the POWER CUT™ 10-week protocol.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "POWER CUT™ Reviews — Real Client Results",
    description:
      "Unfiltered check-ins from real POWER CUT™ clients — fat loss, quieter food noise, better sleep and lean muscle.",
    url: "/reviews",
    type: "website",
  },
};

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="var(--accent)"
          aria-hidden
        >
          <path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21 8 14 2 9.4h7.6L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <GatedShopLink className="flex items-center gap-2 text-lg font-bold">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </GatedShopLink>
          <GatedShopLink className="text-sm font-semibold text-[var(--primary)]/70 transition-colors hover:text-[var(--primary)]">
            Explore POWER CUT™ &rarr;
          </GatedShopLink>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !py-14 sm:!py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>REAL CLIENT RESULTS</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight animate-fade-in-up sm:text-5xl lg:text-6xl">
                POWER CUT
                <span className="align-super text-[0.5em]">™</span> Reviews
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--primary)]/75 animate-fade-in-up stagger-1 sm:text-xl">
                Unfiltered weekly check-ins from real members of the Peak State
                Labs community &mdash; the fat loss, the quieter food noise, the
                better sleep, and the mindset shift, in their own words.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-2 animate-fade-in-up stagger-2 sm:flex-row sm:gap-3">
                <Stars />
                <span className="text-sm font-medium text-[var(--primary)]/60">
                  Real, verified check-ins from the POWER CUT™ community
                </span>
              </div>
            </div>
          </Container>
        </Section>

        {/* Highlight stats band */}
        <section className="border-y border-[var(--border)] gradient-primary">
          <Container className="py-10 sm:py-12">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {highlightStats.map((s) => (
                <div key={s.value} className="text-center text-white">
                  <div className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                    {s.value}
                  </div>
                  <div className="mx-auto mt-2 max-w-[16ch] text-xs font-medium text-white/80 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Reviews gallery */}
        <Section className="!pt-14 sm:!pt-20">
          <Container>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Members Are Saying
              </h2>
              <p className="mt-4 text-[var(--primary)]/70">
                Filter by what matters most to you. Tap{" "}
                <span className="font-semibold text-[var(--primary)]">
                  &ldquo;View original screenshot&rdquo;
                </span>{" "}
                on any card to see the real message.
              </p>
            </div>

            <ReviewsGallery />
          </Container>
        </Section>

        {/* Closing / back to product */}
        <Section className="bg-[var(--muted)] !py-14 sm:!py-16">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to write your own check-in?
              </h2>
              <p className="mt-4 text-[var(--primary)]/70">
                See the full 10-week protocol, what&rsquo;s included, and how to
                get started.
              </p>
              <GatedShopLink className="btn-primary mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold">
                Explore POWER CUT&trade;
              </GatedShopLink>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-white">
        <Container className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <GatedShopLink className="flex items-center gap-2 font-bold">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-6 w-6 rounded-lg"
            />
            <span>{siteCopy.brand.name}</span>
          </GatedShopLink>
          <p className="max-w-md text-xs text-[var(--primary)]/50">
            Individual results vary and are not guaranteed. For laboratory
            research only. Not for human consumption.
          </p>
        </Container>
      </footer>
    </div>
  );
}
