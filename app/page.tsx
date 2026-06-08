import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Calculator } from "@/app/components/Calculator";
import { FAQ } from "@/app/components/FAQ";
import { PricingCard } from "@/app/components/PricingCard";
import { BenefitsGrid } from "@/app/components/BenefitsGrid";
import { EmailSubscription } from "@/app/components/EmailSubscription";
import { UrgencyBanner } from "@/app/components/UrgencyBanner";
import { TrackedLink } from "@/app/components/TrackedLink";
import { ShippingNoteText } from "@/app/components/ShippingNoteText";
import { siteCopy } from "@/content/siteCopy";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
      {/* Urgency Banner */}
      <div className="bg-[var(--primary)] text-white py-3.5 sm:py-3 px-3 sm:px-4 shadow-md">
        <Container>
          <UrgencyBanner
            lineOne={siteCopy.urgencyBanner.lineOne}
            lineTwo={siteCopy.urgencyBanner.lineTwo}
            shippingText={siteCopy.urgencyBanner.shippingText}
            stacks={siteCopy.urgencyBanner.stacks}
          />
        </Container>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="POWER CUT Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--primary)]/70">
            {siteCopy.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-[var(--primary)] font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={siteCopy.brand.primaryCtaHref}
            className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
        </Container>
      </header>

      <main>
        {/* Hero Section */}
        <Section className="relative overflow-hidden gradient-hero">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            {/* Hero Top: Two-column layout */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column - Text */}
              <div className="text-center lg:text-left">
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                  <span>{siteCopy.hero.eyebrow}</span>
                </div>

                {/* Headline */}
                <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                  <span className="whitespace-nowrap">
                    The POWER CUT<span className="text-[0.5em] align-super">™</span>
                  </span>
                  <br />
                  Protocol
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 max-w-xl lg:mx-0 mx-auto animate-fade-in-up stagger-1">
                  {siteCopy.hero.subheadline}
                </p>

                {/* Star Reviews */}
                <div className="mt-5 flex items-center gap-3 justify-center lg:justify-start animate-fade-in-up stagger-2">
                  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-[var(--accent-dark)] drop-shadow-sm"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.285-3.957z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-[var(--primary)]">
                    70+ 5-Star Reviews
                  </span>
                </div>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-3">
                  <a
                    href={siteCopy.brand.primaryCtaHref}
                    className="btn-primary inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl px-6 sm:px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                  >
                    Start Your Transformation
                  </a>
                  <a
                    href={siteCopy.brand.secondaryCtaHref}
                    className="inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-6 sm:px-8 text-base sm:text-lg font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)] whitespace-nowrap"
                  >
                    {siteCopy.brand.secondaryCtaLabel}
                  </a>
                </div>
              </div>

              {/* Right Column - Product Image */}
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative animate-drop-in">
                  <img
                    src="/product.png"
                    alt="POWER CUT Peptide Kit"
                    className="w-full max-w-md lg:max-w-lg drop-shadow-2xl"
                  />
                  {/* Decorative glow behind image */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <BenefitsGrid benefits={siteCopy.hero.benefits} />

            {/* Secure Note */}
            <div className="mt-12 p-5 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 max-w-2xl mx-auto text-center">
              <ShippingNoteText
                preCutoff={siteCopy.hero.secureNote}
                postCutoff={siteCopy.hero.secureNoteAfterCutoff}
                className="text-sm text-[var(--primary)]/80 leading-relaxed font-semibold"
              />
              <a
                href={siteCopy.brand.primaryCtaHref}
                className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold mt-5"
              >
                {siteCopy.brand.primaryCtaLabel}
              </a>
            </div>

            {/* Countdown Timer - swaps target + label at 3 PM ET, resets at midnight ET */}
            <div className="mt-8 text-center">
              <CountdownTimer
                label={siteCopy.hero.timerLabel}
                labelAfterCutoff={siteCopy.hero.timerLabelAfterCutoff}
              />
            </div>

            {/* Research Disclaimer */}
            <p className="mt-4 text-xs text-[var(--primary)]/50 text-center">
              {siteCopy.hero.researchDisclaimer}
            </p>
          </Container>
        </Section>

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
                Every POWER CUT
                <span className="text-[0.6em] align-super">™</span> member
                receives direct access to personalized guidance and support
                throughout their journey.
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
                      1-on-1 Guidance
                    </h3>
                    <p className="mt-1.5 md:mt-3 text-sm md:text-base text-[var(--primary)]/70 leading-relaxed">
                      Get direct answers whenever questions come up so you
                      never feel stuck or left guessing.
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

              {/* Card 3 — Clear Next Steps */}
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
                        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 md:mt-5">
                    <h3 className="text-base md:text-xl font-bold text-[var(--primary)]">
                      Clear Next Steps
                    </h3>
                    <p className="mt-1.5 md:mt-3 text-sm md:text-base text-[var(--primary)]/70 leading-relaxed">
                      No confusion around where to begin or what comes next.
                      A simple path with support when you need it.
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
              </div>

              {/* Right Column - Calculator */}
              <div className="bg-[var(--muted)] rounded-2xl p-5 sm:p-6 border border-[var(--border)]">
                <Calculator />
              </div>
            </div>
          </Container>
        </Section>

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
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Your Exclusive Price:</span>
                      <span className="text-3xl font-bold text-[var(--accent)]">
                        {siteCopy.comparison.powercut.price}
                      </span>
                    </div>
                    <div className="mt-4 w-full bg-[var(--accent)] text-[var(--primary)] py-3 px-6 rounded-xl text-center">
                      <span className="text-lg font-bold uppercase tracking-wide">
                        VALUE SAVED: {siteCopy.comparison.powercut.savings}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Pricing Section */}
        <Section id="pricing" className="bg-[var(--muted)]">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {siteCopy.pricing.headline}
              </h2>
              <p className="mt-3 text-lg text-[var(--accent-dark)] font-semibold">
                [{siteCopy.pricing.subheadline}]
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {siteCopy.pricing.tiers.map((tier) => (
                <PricingCard key={tier.id} {...tier} />
              ))}
            </div>
          </Container>
        </Section>

        {/* Singles Offer Section - capture leads not ready for the full stack */}
        <Section className="bg-white relative overflow-hidden !pb-8 sm:!pb-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 left-[-10%] h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute bottom-0 right-[-10%] h-72 w-72 rounded-full bg-[var(--accent)]/15 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-8 sm:p-12 text-white shadow-2xl">
                <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[var(--accent)]/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />

                <div className="relative text-center">
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                    <span>NOT READY FOR THE FULL STACK?</span>
                  </div>

                  {/* Headline */}
                  <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
                    Start With A Single Vial
                  </h2>

                  {/* Subheadline */}
                  <p className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
                    Dip your toe in with a single peptide. Same lab-tested 99%+ purity. Same protocol guidance. Zero commitment to the full 10-week system.
                  </p>

                  {/* Product chips */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {[
                      "Retatrutide (Pre-Order)",
                      "CJC-1295 + Ipamorelin (Pre-Order)",
                      "BPC-157 + TB-500 (Pre-Order)",
                      "GHK-Cu (Pre-Order)",
                    ].map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-2 text-sm font-semibold"
                      >
                        <svg
                          className="w-4 h-4 text-[var(--accent)] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {name}
                      </span>
                    ))}
                  </div>

                  {/* Benefits row */}
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Free shipping
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      No minimum order
                    </span>
                  </div>

                  {/* CTA */}
                  <TrackedLink
                    href="/singles"
                    className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold mt-8"
                    event="shop_singles_click"
                    eventProperties={{ source: "singles_offer_section" }}
                  >
                    Shop Single Vials
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </TrackedLink>

                  <p className="mt-4 text-xs text-white/60">
                    Same batch documentation. Same purity tests. Upgrade to a full stack anytime.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Body Composition Blueprint - low-ticket info product */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-5xl mx-auto">
              {/* Section heading (outside the card) */}
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>THE BLUEPRINT</span>
                </div>
                <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">
                  Stop Piecing It Together Yourself
                </h2>
                <p className="mt-4 text-lg text-[var(--primary)]/70">
                  The difference between spinning your wheels for six months
                  and knowing exactly what to do next.
                </p>
              </div>

              {/* Main product card */}
              <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm overflow-hidden">
                {/* Gradient header band — product name + description */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-7 sm:p-10 text-center">
                  <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
                  <div className="relative max-w-3xl mx-auto">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                      The Body Composition Blueprint
                      <span className="text-[0.5em] align-super">™</span>
                    </h3>
                    <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">
                      The exact framework we use to help people approach fat
                      loss, lean muscle growth, GLP-1s, peptide research,
                      nutrition, training, recovery, and body recomposition
                      with confidence.
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-8 lg:p-10">
                  {/* Inside You'll Discover — 2-col grid of mini-cards */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold text-[var(--primary)] text-center sm:text-left">
                      Inside You&rsquo;ll Discover
                    </h4>
                    <div className="mt-5 sm:mt-6 grid sm:grid-cols-2 gap-3 sm:gap-4">
                      {[
                        {
                          title: "The Body Composition Roadmap",
                          body: "Understand the 4 levers that drive nearly every successful transformation.",
                        },
                        {
                          title: "Beginner Peptide Guide",
                          body: "Learn the major peptide categories, how they work, and where each fits into a body composition strategy.",
                        },
                        {
                          title: "GLP-1 Comparison Chart",
                          body: "Understand the differences between Semaglutide, Tirzepatide, and Retatrutide.",
                        },
                        {
                          title: "How To Use GLP-1s While Building Lean Muscle",
                          body: "The biggest mistakes people make when combining fat loss and muscle-building goals.",
                        },
                        {
                          title: "Protein Calculator",
                          body: "Calculate exactly how much protein your body needs to support muscle retention and recovery.",
                        },
                        {
                          title: "Metabolic Typing Guide",
                          body: "Learn how to structure your nutrition based on your unique metabolic profile.",
                        },
                        {
                          title: "Workout Structure Framework",
                          body: "The simple training model we recommend for maximizing body composition results.",
                        },
                        {
                          title: "Sleep Optimization Protocol",
                          body: "The overlooked variable that influences recovery, appetite, and body composition.",
                        },
                        {
                          title: "Supplement Stack Guide",
                          body: "The foundational supplements we use to support training, recovery, and metabolic health.",
                        },
                        {
                          title: "Reconstitution Guide",
                          body: "Learn the fundamentals of peptide preparation and handling.",
                        },
                      ].map((item) => (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/60 p-4 sm:p-5 flex items-start gap-3 transition-colors hover:bg-[var(--muted)]"
                        >
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mt-0.5">
                            <svg
                              className="w-3.5 h-3.5 text-[var(--accent-dark)]"
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
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--primary)] text-[15px] sm:text-base leading-snug">
                              {item.title}
                            </p>
                            <p className="mt-1.5 text-sm text-[var(--primary)]/65 leading-relaxed">
                              {item.body}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bonus Resources — cyan-tinted panel */}
                  <div className="mt-8 sm:mt-10 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-5 sm:p-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[var(--accent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                        Bonus
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-[var(--primary)]">
                        Bonus Resources Included
                      </h4>
                    </div>
                    <div className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {[
                        "Research Cycle Calculator",
                        "Journal & Progress Tracking System",
                        "Body Composition Checklists",
                        "Peak State Reference Materials",
                      ].map((bonus) => (
                        <div key={bonus} className="flex items-center gap-2.5">
                          <svg
                            className="w-4 h-4 text-[var(--accent-dark)] flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm font-semibold text-[var(--primary)]/85">
                            {bonus}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Perfect For — clean 2-col list */}
                  <div className="mt-8 sm:mt-10">
                    <h4 className="text-base sm:text-lg font-bold text-[var(--primary)]">
                      Perfect For People Who Want To:
                    </h4>
                    <ul className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        "Build a clear plan instead of piecing together information from YouTube, Reddit, and TikTok",
                        "Burn fat without sacrificing muscle",
                        "Learn how GLP-1s actually fit into a body composition strategy",
                        "Understand peptides before buying them",
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2.5">
                          <svg
                            className="w-4 h-4 text-[var(--accent-dark)] flex-shrink-0 mt-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm sm:text-base text-[var(--primary)]/80 leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-10 sm:mt-12 flex flex-col items-center text-center">
                    <a
                      href="https://buy.stripe.com/9B64gydgzdkl61rem1afS0c"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                    >
                      Get The Blueprint
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

                    {/* Price — secondary focus */}
                    <p className="mt-5 text-xl sm:text-2xl font-bold text-[var(--primary)]">
                      $47 one-time payment.
                    </p>

                    {/* Credit benefit — tertiary focus */}
                    <p className="mt-2.5 text-center italic text-sm sm:text-base text-[var(--primary)]/60 leading-relaxed">
                      Fully credited toward any future Peak State Labs purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

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

              <div className="grid sm:grid-cols-3 gap-4">
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

        {/* Email Subscription Section */}
        <Section className="bg-white border-t border-[var(--border)]">
          <Container>
            <EmailSubscription
              headline="Not Ready to Commit Yet?"
              subheadline="Subscribe to get notified about future drops, exclusive offers, and answers to your questions. We're here to help."
              buttonText="Keep Me Updated"
              successMessage="You're on the list! We'll be in touch soon."
            />
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-12">
          {/* Product Disclaimer */}
          <div className="text-center pb-8 border-b border-white/10">
            <p className="text-sm text-white/60">
              {siteCopy.footer.productDisclaimer}
            </p>
          </div>

          {/* Main Footer Content */}
          <div className="py-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </div>
              <nav className="flex flex-wrap justify-center gap-6 text-sm">
                {siteCopy.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="/policy"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Return Policy
                </a>
              </nav>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="pt-8">
            <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
              {siteCopy.footer.disclaimer}
            </p>
            <p className="text-xs text-white/40 text-center mt-6">
              © {new Date().getFullYear()} {siteCopy.footer.copyrightName}. All
              rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
