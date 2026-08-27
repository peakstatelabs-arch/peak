import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CreatorHeader, CreatorFooter } from "./chrome";

export const metadata: Metadata = {
  title: "Become a Peak State Creator — Peak State Creator Program",
  description:
    "Turn your interest in health, fitness & peptides into content that actually pays. 20% commission, 40% off your orders, creator training and support. Apply now.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const APPLY_HREF = "/creator/apply";
const APPLY_LABEL = "APPLY TO BECOME A PEAK STATE CREATOR";

function ApplyButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={APPLY_HREF}
      className={`btn-primary inline-flex items-center justify-center gap-2 rounded-2xl text-center font-bold leading-tight ${className}`}
    >
      <span>{APPLY_LABEL}</span>
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
  );
}

const benefits: { title: string; body: string }[] = [
  {
    title: "20% commission on every customer you refer",
    body: "With an average Peak State order of $500+, a single referral can mean $100+ in commission.",
  },
  {
    title: "40% off your personal Peak State orders",
    body: "Actually experience the products you're creating content around.",
  },
  {
    title: "Your own affiliate link + discount code",
    body: "Every customer you send our way is automatically tracked back to you.",
  },
  {
    title: "Content ideas, hooks & scripts",
    body: "We'll show you the types of videos that are working and help you turn your own experience into content people actually want to watch.",
  },
  {
    title: "Peptide education",
    body: "Learn how the products work, why people use them and how to talk about them responsibly.",
  },
  {
    title: "Direct creator support",
    body: "You're not getting handed an affiliate link and told “good luck.” We're building creators alongside the brand.",
  },
];

const contentIdeas = [
  "Your own Peak State journey",
  "Weekly progress updates",
  "Fitness & body composition",
  "Recovery & performance",
  "Wellness routines",
  "Educational peptide content",
  "Questions and answers",
  "Day-in-the-life content",
];

const trainingPoints = [
  "Find content ideas people actually care about",
  "Create stronger hooks",
  "Turn your experience into stories",
  "Make educational content interesting",
  "Build trust with your audience",
  "Understand Peak State products",
  "Use your affiliate link effectively",
  "Track what's working",
  "And build a repeatable content system",
];

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CreatorLandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <CreatorHeader />

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>PEAK STATE CREATOR PROGRAM</span>
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                Become a Peak State Creator
              </h1>

              <p className="mt-5 text-xl sm:text-2xl font-semibold text-[var(--primary)]/80 leading-snug animate-fade-in-up">
                Turn your interest in health, fitness &amp; peptides into content
                that actually pays.
              </p>

              <p className="mt-5 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed animate-fade-in-up">
                You don&apos;t need a massive following. You don&apos;t need to be
                a peptide expert. And you definitely don&apos;t need to figure out
                content creation on your own.
              </p>

              <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed animate-fade-in-up">
                The Peak State Creator Program gives you the products, education,
                content support and affiliate infrastructure to start creating
                around one of the fastest-growing conversations in health and
                performance.
              </p>

              <div className="mt-9 flex flex-col items-center animate-fade-in-up">
                <ApplyButton className="h-auto w-full max-w-md px-6 py-4 text-base sm:text-lg" />
                <p className="mt-4 text-sm text-[var(--primary)]/50">
                  Limited spots · No huge following required
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* CREATE. EDUCATE. EARN. — benefits */}
        <Section className="bg-white !py-14 sm:!py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Create. Educate. Earn.
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                As a Peak State Creator you&apos;ll receive:
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="card-hover rounded-3xl border border-[var(--border)] gradient-card p-6 sm:p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)]/20 text-[var(--accent-dark)]">
                    <CheckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[var(--primary)]/70">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* You Don't Need 100,000 Followers */}
        <Section className="gradient-hero !py-14 sm:!py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                You Don&apos;t Need 100,000 Followers.
              </h2>
              <p className="mt-5 text-lg text-[var(--primary)]/75 leading-relaxed">
                Some of the most powerful content comes from normal people
                documenting something they&apos;re genuinely experiencing.
              </p>
              <p className="mt-4 text-lg text-[var(--primary)]/75 leading-relaxed">
                Your first 500 followers matter. Your first 5,000 matter. And if
                you&apos;re starting from zero? That&apos;s okay too.
              </p>
              <p className="mt-4 text-lg font-semibold text-[var(--primary)] leading-relaxed">
                We&apos;re looking for people willing to learn, create
                consistently and bring their own personality to the conversation.
              </p>
            </div>
          </Container>
        </Section>

        {/* What Would You Create? */}
        <Section className="bg-white !py-14 sm:!py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What Would You Create?
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                Your content could include:
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-2">
              {contentIdeas.map((idea) => (
                <div
                  key={idea}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--muted)] px-5 py-4"
                >
                  <CheckIcon className="h-5 w-5 flex-shrink-0 text-[var(--accent-dark)]" />
                  <span className="text-[15px] font-medium">{idea}</span>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-semibold text-[var(--primary)]">
              And we&apos;ll help you figure out what makes sense for YOU.
            </p>

            <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-[var(--border)] gradient-card p-6 text-center">
              <p className="text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
                No weird corporate scripts. No pretending to love something you
                don&apos;t. No requirement to become somebody you&apos;re not.
              </p>
            </div>
          </Container>
        </Section>

        {/* We'll Teach You How To Do It */}
        <Section className="gradient-hero !py-14 sm:!py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                We&apos;ll Teach You How To Do It.
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70">
                Every Peak State Creator gets access to our Creator Training.
                You&apos;ll learn how to:
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-3xl gap-3">
              {trainingPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-5 py-4"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent-dark)]">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span className="text-[15px] font-medium">{point}</span>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-semibold text-[var(--primary)]">
              You bring the phone and the personality. We&apos;ll help with the
              rest.
            </p>
          </Container>
        </Section>

        {/* And Yes... You Get Paid */}
        <Section className="bg-white !py-14 sm:!py-20">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                And Yes&hellip; You Get Paid.
              </h2>
              <p className="mt-4 text-lg text-[var(--primary)]/70 leading-relaxed">
                Peak State Creators earn{" "}
                <span className="font-bold text-[var(--primary)]">20%</span> of
                every qualifying order they refer. If someone places a $500 order
                through your link:
              </p>
            </div>

            <div className="mx-auto mt-9 grid max-w-3xl gap-4 sm:grid-cols-3">
              {[
                { orders: "1 order", amount: "$100" },
                { orders: "5 orders", amount: "$500" },
                { orders: "20 orders", amount: "$2,000" },
              ].map((row) => (
                <div
                  key={row.orders}
                  className="rounded-3xl border border-[var(--border)] gradient-card p-6 text-center"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]/60">
                    {row.orders} @ $500
                  </p>
                  <p className="mt-2 text-4xl font-bold text-[var(--primary)]">
                    {row.amount}
                  </p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-lg font-bold text-[var(--accent-dark)]">
              There&apos;s no commission ceiling.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-[var(--primary)]/60 leading-relaxed">
              How much you actually earn depends entirely on your audience,
              content, consistency and sales. There are no guaranteed earnings.
            </p>
          </Container>
        </Section>

        {/* Want In? — final CTA */}
        <Section className="relative overflow-hidden gradient-primary text-white !py-16 sm:!py-24">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[var(--accent)]/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Want In?
              </h2>
              <p className="mt-5 text-lg text-white/85 leading-relaxed">
                We&apos;re currently opening the Peak State Creator Program to a
                limited group of new creators.
              </p>

              <ul className="mx-auto mt-7 flex max-w-md flex-col gap-3 text-left">
                {[
                  "No huge following required.",
                  "No previous peptide content required.",
                  "No content degree required.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3.5 backdrop-blur-sm"
                  >
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 text-lg text-white/85 leading-relaxed">
                Just an interest in the space and a willingness to create.
              </p>

              <div className="mt-9 flex flex-col items-center">
                <a
                  href={APPLY_HREF}
                  className="btn-accent inline-flex h-auto w-full max-w-md items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base sm:text-lg font-bold leading-tight"
                >
                  <span>{APPLY_LABEL}</span>
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
            </div>
          </Container>
        </Section>
      </main>

      <CreatorFooter />
    </div>
  );
}
