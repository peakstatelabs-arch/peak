// POWER CUT™ homepage sections, shared by the homepage and the Black Friday
// POWER CUT page (/powercutsale). Moved here verbatim from app/page.tsx.

import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { Calculator } from "@/app/components/Calculator";
import { FAQ } from "@/app/components/FAQ";
import { TrackedLink } from "@/app/components/TrackedLink";
import { siteCopy } from "@/content/siteCopy";
import { SALE_NAME } from "@/app/lib/sale";
import { formatUsd } from "@/app/lib/money";
import type { SaleStatus } from "@/app/lib/useSaleStatus";

export function PowerCutSupport() {
  return (
    <>
    {/* Support Included Section */}
    <Section className="bg-[var(--muted)] !py-8 sm:!py-14">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span>SUPPORT INCLUDED</span>
          </div>

          {/* Headline */}
          <h2 className="mt-5 sm:mt-6 text-2xl sm:text-4xl font-bold tracking-tight">
            You&rsquo;re Not Doing This Alone
          </h2>

          {/* Subheadline */}
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[var(--primary)]/70">
            Every customer &mdash; on any order &mdash; gets ongoing 1-on-1
            coaching for nutrition and training, plus custom dosing guidance
            dialed in for their body. Included as standard, never an upsell.
          </p>
        </div>

        {/* Compact horizontal cards on mobile, full vertical cards on md+ */}
        <div className="grid md:grid-cols-3 gap-3 md:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Card 1 — 1-on-1 Guidance */}
          <div className="rounded-2xl md:rounded-3xl bg-white border border-[var(--border)] p-4 md:p-8 shadow-sm card-hover">
            <div className="flex flex-row md:flex-col items-start gap-4 md:gap-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-dark)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
              </div>
              <div className="flex-1 md:mt-5">
                <h3 className="text-base md:text-xl font-bold text-[var(--primary)]">
                  1-on-1 Coaching
                </h3>
                <p className="mt-1.5 md:mt-3 text-sm md:text-base text-[var(--primary)]/70 leading-relaxed">
                  Ongoing coaching for your nutrition and training, with a
                  real person to answer questions so you&rsquo;re never left
                  guessing.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Private Community */}
          <div className="rounded-2xl md:rounded-3xl bg-white border border-[var(--border)] p-4 md:p-8 shadow-sm card-hover">
            <div className="flex flex-row md:flex-col items-start gap-4 md:gap-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-dark)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div className="flex-1 md:mt-5">
                <h3 className="text-base md:text-xl font-bold text-[var(--primary)]">
                  Private Community
                </h3>
                <p className="mt-1.5 md:mt-3 text-sm md:text-base text-[var(--primary)]/70 leading-relaxed">
                  Connect with others inside the POWER CUT
                  <span className="text-[0.6em] align-super">™</span>{" "}
                  community and follow real journeys happening in real
                  time.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Custom Dosing */}
          <div className="rounded-2xl md:rounded-3xl bg-white border border-[var(--border)] p-4 md:p-8 shadow-sm card-hover">
            <div className="flex flex-row md:flex-col items-start gap-4 md:gap-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-[var(--accent-dark)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                  />
                </svg>
              </div>
              <div className="flex-1 md:mt-5">
                <h3 className="text-base md:text-xl font-bold text-[var(--primary)]">
                  Custom Dosing, Dialed In
                </h3>
                <p className="mt-1.5 md:mt-3 text-sm md:text-base text-[var(--primary)]/70 leading-relaxed">
                  Your dose guided by our calculator and reviewed with a
                  coach &mdash; tailored to your body, not a one-size-fits-all
                  chart.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA + reassurance */}
        <div className="text-center mt-8 sm:mt-12">
          <a
            href={siteCopy.brand.primaryCtaHref}
            className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
          <p className="mt-5 sm:mt-6 italic text-sm sm:text-base text-[var(--primary)]/60 max-w-xl mx-auto leading-relaxed">
            Most people don&rsquo;t fail because they lack motivation. They
            fail because they try to figure everything out alone.
          </p>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutCalculator() {
  return (
    <>
    {/* Calculator Section */}
    <Section id="calculator" className="bg-white !py-8 sm:!py-10">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
          {/* Left Column - Text */}
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {siteCopy.calculator.headline}
            </h2>
            <p className="mt-4 text-lg text-[var(--primary)]/70">
              {siteCopy.calculator.subheadline}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-[var(--primary)]/80">Personalized cycle recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-[var(--primary)]/80">Based on your specific goals</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-[var(--primary)]/80">Instant results, no guesswork</span>
              </div>
            </div>

            {/* Companion quiz entry — hand off to the full protocol quiz */}
            <TrackedLink
              href={siteCopy.calculator.quizCtaHref}
              className="group mt-6 flex items-center gap-3 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] p-4 transition-colors hover:bg-[var(--accent)]/[0.12]"
              event="quiz_entry_click"
              eventProperties={{ source: "calculator" }}
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20">
                <svg className="h-4 w-4 text-[var(--accent-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
              <span className="flex-1 text-sm font-semibold text-[var(--primary)]">
                {siteCopy.calculator.quizCtaLabel}
              </span>
              <svg className="h-5 w-5 flex-shrink-0 text-[var(--accent-dark)] transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </TrackedLink>
          </div>

          {/* Right Column - Calculator */}
          <div className="bg-[var(--muted)] rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
            <Calculator />
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutContents() {
  return (
    <>
    {/* Contents Section */}
    <Section id="contents" className="bg-[var(--muted)]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {siteCopy.contents.headline}
          </h2>
          <p className="mt-4 text-lg text-[var(--primary)]/70">
            {siteCopy.contents.subheadline}
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {siteCopy.contents.items.map((item, index) => (
            <div
              key={item.name}
              className={`p-4 rounded-2xl bg-white border border-[var(--border)] shadow-sm text-center card-hover animate-fade-in-up stagger-${
                index + 1
              }`}
            >
              <div className="w-60 h-60 mx-auto mb-2 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="font-bold text-xl text-[var(--primary)]">
                {item.name}
              </h3>
              <p className="text-base text-[var(--accent-dark)] font-medium mt-1">
                {item.amount}
              </p>
              <a
                href={item.url}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[var(--primary)] text-white text-base font-semibold rounded-xl hover:bg-[var(--primary-light)] transition-colors"
              >
                Learn More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#pricing"
            className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutComparison({
  initialSale,
  cmp,
  cmpPriceCents,
}: {
  initialSale: SaleStatus;
  cmp: typeof siteCopy.comparison.powercut;
  cmpPriceCents: number;
}) {
  return (
    <>
    {/* Comparison Section */}
    <Section className="bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {siteCopy.comparison.headline}
          </h2>
          <p className="mt-4 text-lg text-[var(--primary)]/70">
            {siteCopy.comparison.subheadline}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* DIY Column */}
          <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-[var(--primary)]">
                {siteCopy.comparison.diy.title}
              </h3>
            </div>
            <div className="space-y-4">
              {siteCopy.comparison.diy.items.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center py-3 border-b border-[var(--border)]"
                >
                  <span className="text-base text-[var(--primary)]/80">
                    {item.name}
                  </span>
                  <span className="text-base font-bold text-[var(--primary)]">
                    {item.price}
                  </span>
                </div>
              ))}
              {siteCopy.comparison.diy.cons.map((con) => (
                <div key={con} className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-red-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm text-[var(--primary)]/60">
                    {con}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[var(--primary)]">
                  Total Estimated Cost:
                </span>
                <span className="text-2xl font-bold text-red-500">
                  {siteCopy.comparison.diy.total}
                </span>
              </div>
            </div>
          </div>

          {/* POWER CUT Column */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[var(--primary)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <h3 className="text-xl font-bold">
                  {siteCopy.comparison.powercut.title}
                </h3>
              </div>
              <div className="space-y-4">
                {siteCopy.comparison.powercut.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center py-3 border-b border-white/20"
                  >
                    <span className="text-base text-white/90">{item.name}</span>
                    <span className="text-base font-bold text-[var(--accent)]">
                      {item.price}
                    </span>
                  </div>
                ))}
                {siteCopy.comparison.powercut.pros.map((pro) => (
                  <div key={pro} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-[var(--accent)] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-base text-white/90">{pro}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold">
                    {initialSale.live
                      ? `${SALE_NAME[initialSale.phase]} Price:`
                      : "Your Exclusive Price:"}
                  </span>
                  <span className="text-3xl font-bold text-[var(--accent)] tabular-nums">
                    {initialSale.live && (
                      <span className="mr-2 text-lg font-semibold text-white/50 line-through">
                        {formatUsd(cmp.priceCents)}
                      </span>
                    )}
                    {formatUsd(cmpPriceCents)}
                  </span>
                </div>
                <div className="mt-4 w-full bg-[var(--accent)] text-[var(--primary)] py-3 px-6 rounded-xl text-center">
                  <span className="text-lg font-bold uppercase tracking-wide">
                    You save {formatUsd(cmp.valueCents - cmpPriceCents)} (
                    {Math.round(((cmp.valueCents - cmpPriceCents) / cmp.valueCents) * 100)}% off)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutSafety() {
  return (
    <>
    {/* Safety Section */}
    <Section className="bg-white !pt-8 sm:!pt-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg
                className="w-8 h-8 text-[var(--accent-dark)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {siteCopy.safety.headline}
            </h2>
            <p className="mt-2 text-lg text-[var(--accent-dark)] font-medium">
              {siteCopy.safety.subheadline}
            </p>
            <p className="mt-4 text-[var(--primary)]/70">
              {siteCopy.safety.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteCopy.safety.documents.map((doc) => (
              <a
                key={doc.name}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--muted)] text-center card-hover cursor-pointer group block"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 mx-auto flex items-center justify-center mb-3 group-hover:bg-[var(--accent)]/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-[var(--accent-dark)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-[var(--primary)]">
                  {doc.name}
                </p>
                <p className="text-sm text-[var(--accent-dark)] mt-1">
                  {doc.amount}
                </p>
                <p className="text-xs text-[var(--primary)] mt-2 underline">
                  Click to View Purity Test
                </p>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutTimeline() {
  return (
    <>
    {/* Timeline Section */}
    <Section className="bg-[var(--muted)]">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {siteCopy.timeline.headline}
          </h2>
          <p className="mt-4 text-lg text-[var(--primary)]/70">
            {siteCopy.timeline.subheadline}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {siteCopy.timeline.steps.map((step, index) => (
            <div
              key={step.phase}
              className="relative pl-8 sm:pl-0 sm:grid sm:grid-cols-[120px_1fr] gap-8 items-start"
            >
              {/* Timeline dot for mobile */}
              <div className="absolute left-0 top-0 sm:hidden w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-white shadow" />
              {/* Timeline line for mobile */}
              {index < siteCopy.timeline.steps.length - 1 && (
                <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-[var(--accent)]/30 sm:hidden" />
              )}

              {/* Days badge */}
              <div className="hidden sm:flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-white shadow" />
                {index < siteCopy.timeline.steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[var(--accent)]/30 my-2" />
                )}
                <span className="text-xs font-semibold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                  {step.days}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="font-bold text-lg text-[var(--primary)]">
                    {step.phase}
                  </h3>
                  <span className="sm:hidden text-xs font-semibold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
                    {step.days}
                  </span>
                </div>
                <p className="text-sm text-[var(--primary)]/70 mb-3">
                  <span className="font-semibold text-[var(--primary)]">
                    The Action:
                  </span>{" "}
                  {step.action}
                </p>
                <p className="text-sm text-[var(--primary)]/70">
                  <span className="font-semibold text-[var(--primary)]">
                    The Result:
                  </span>{" "}
                  {step.result}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#pricing"
            className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutProblemSolution() {
  return (
    <>
    {/* Problem/Solution Section */}
    <Section className="bg-[var(--primary)] text-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                {siteCopy.problem.headline}
              </h2>
              <p className="mt-4 text-white/70 font-medium">Because:</p>
              <ul className="mt-4 space-y-3">
                {siteCopy.problem.reasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-white/80">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution */}
            <div className="p-8 rounded-3xl bg-white/10 backdrop-blur">
              <h3 className="text-2xl font-bold text-[var(--accent)]">
                {siteCopy.problem.solution.headline}
              </h3>
              <p className="mt-6 text-2xl sm:text-3xl font-bold">
                {siteCopy.problem.solution.tagline}
              </p>
              <a
                href="#pricing"
                className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold mt-8"
              >
                {siteCopy.brand.primaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutFaq() {
  return (
    <>
    {/* FAQ Section */}
    <Section id="faq" className="bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {siteCopy.faq.headline}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <FAQ items={siteCopy.faq.items} />
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutReviews() {
  return (
    <>
    {/* Reviews / Social Proof Section */}
    <Section className="relative overflow-hidden bg-[var(--primary)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-8%] h-80 w-80 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-8%] h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="inline-flex items-center gap-1 text-[var(--accent)]"
            aria-label="Rated 5 out of 5"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21 8 14 2 9.4h7.6L12 2Z" />
              </svg>
            ))}
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Real Results From Real Members
          </h2>
          <p className="mt-5 text-lg text-white/75">
            Unfiltered weekly check-ins from the POWER CUT&trade; community
            &mdash; the fat loss, the quieter food noise, the better sleep,
            and the mindset shift, in their own words.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
          {[
            {
              quote:
                "So far I am down 19 lbs and about 5.5% bf. The results are blowing my mind!",
              stat: "-19 lb · -5.5% BF",
              name: "Paige P.",
              initial: "P",
            },
            {
              quote:
                "ZERO post-meal cravings for something sweet. The food noise was absent for much of the week.",
              stat: "Food noise gone",
              name: "Alana F.",
              initial: "A",
            },
            {
              quote:
                "I'm down 20.8 lbs and 4.8% body fat… and I'm not slowing down! I feel so good.",
              stat: "-20.8 lb · -4.8% BF",
              name: "Verified client",
              initial: "★",
            },
          ].map((r) => (
            <figure
              key={r.name + r.stat}
              className="flex flex-col rounded-2xl bg-white p-6 text-left text-[var(--primary)] shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center gap-0.5 text-[var(--accent-dark)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="m12 2 2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6L5.7 21 8 14 2 9.4h7.6L12 2Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--primary)]/85">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                  {r.initial}
                </span>
                <figcaption className="text-sm font-bold">
                  {r.name}
                </figcaption>
                <span className="ml-auto inline-flex items-center rounded-lg bg-[var(--accent)]/15 px-2 py-1 text-xs font-bold text-[var(--accent-dark)]">
                  {r.stat}
                </span>
              </div>
            </figure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/reviews"
            className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold"
          >
            Read all the reviews &rarr;
          </a>
          <p className="mt-4 text-sm text-white/60">
            30+ verified client check-ins
          </p>
        </div>
      </Container>
    </Section>
    </>
  );
}

export function PowerCutFinalCta() {
  return (
    <>
    {/* Final CTA Section */}
    <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {siteCopy.finalCta.headline}
          </h2>
          <p className="mt-6 text-lg text-[var(--primary)]/70">
            {siteCopy.finalCta.description}
          </p>
          <p className="mt-4 text-[var(--primary)]/60 italic">
            {siteCopy.finalCta.subtext}
          </p>
          <a
            href="#pricing"
            className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold mt-10"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
        </div>
      </Container>
    </Section>
    </>
  );
}
