import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CreatorHeader, CreatorFooter } from "../chrome";

export const metadata: Metadata = {
  title: "Application Received — Peak State Creator Program",
  description:
    "We're reviewing your application to join the Peak State Creator Program.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const TIKTOK_URL = "https://www.tiktok.com/@readysetpeak";

const perks = [
  "40% Creator Discount",
  "20% Affiliate Commissions",
  "Personal Link + Discount Code",
  "Creator Training",
  "Content Ideas + Hooks",
  "Product Education",
  "Direct Creator Support",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 flex-shrink-0 text-[var(--accent-dark)]"
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CreatorSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[var(--primary)]">
      <CreatorHeader />

      <main className="flex-1">
        <Section className="relative overflow-hidden gradient-hero !py-14 sm:!py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-xl text-center">
              {/* Lightning badge */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--accent)]/20 animate-scale-in">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-[var(--accent-dark)]"
                  aria-hidden
                >
                  <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5z" />
                </svg>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>APPLICATION RECEIVED ⚡</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight animate-fade-in-up">
                You&apos;re in the queue.
              </h1>

              <p className="mt-4 text-lg text-[var(--primary)]/75 leading-relaxed animate-fade-in-up">
                We&apos;re reviewing your application to join the Peak State
                Creator Program.
              </p>
            </div>
          </Container>
        </Section>

        {/* What you'll get if approved */}
        <Section className="bg-white !py-12 sm:!py-16">
          <Container>
            <div className="mx-auto max-w-xl">
              <p className="text-center text-lg font-semibold text-[var(--primary)]">
                If approved, you&apos;ll receive everything you need to get
                started, including:
              </p>

              <div className="mt-7 rounded-3xl border border-[var(--border)] gradient-card p-5 sm:p-7">
                <ul className="flex flex-col gap-3">
                  {perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm"
                    >
                      <CheckIcon />
                      <span className="text-[15px] font-semibold">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-8 text-center text-lg text-[var(--primary)]/75 leading-relaxed">
                Keep an eye on your inbox.{" "}
                <span className="font-semibold text-[var(--primary)]">
                  We&apos;ll be in touch soon.
                </span>
              </p>
            </div>
          </Container>
        </Section>

        {/* TikTok CTA */}
        <Section className="relative overflow-hidden gradient-primary text-white !py-14 sm:!py-20">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                While you wait — follow along.
              </h2>
              <p className="mt-4 text-white/85 leading-relaxed">
                See what our creators are posting and get a head start on what
                works.
              </p>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent mt-8 inline-flex h-auto w-full max-w-md items-center justify-center gap-2.5 rounded-2xl px-6 py-4 text-base sm:text-lg font-bold leading-tight"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden
                >
                  <path d="M16.5 3c.3 2.3 1.7 4 4 4.3v2.7c-1.4.1-2.8-.3-4-1v6.1c0 3.6-2.9 6.4-6.4 6.4S3.7 18.7 3.7 15.1c0-3.4 2.7-6.2 6.1-6.3v2.8a3.5 3.5 0 1 0 3.6 3.5V3h3.1z" />
                </svg>
                <span>FOLLOW @READYSETPEAK ON TIKTOK</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </Container>
        </Section>
      </main>

      <CreatorFooter />
    </div>
  );
}
