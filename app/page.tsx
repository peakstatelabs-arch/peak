import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { Calculator } from "@/app/components/Calculator";
import { FAQ } from "@/app/components/FAQ";
import { PricingCard } from "@/app/components/PricingCard";
import { BenefitsGrid } from "@/app/components/BenefitsGrid";
import { siteCopy } from "@/content/siteCopy";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
      {/* Urgency Banner */}
      <div className="bg-[var(--primary)] text-white py-3 px-4">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-sm">
            <span className="font-semibold">
              {siteCopy.urgencyBanner.preorderText}
            </span>
            <span className="hidden sm:inline text-white/50">|</span>
            <span className="text-white/80">
              {siteCopy.urgencyBanner.shippingText}
            </span>
          </div>
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
                <h1 className="mt-8 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                  POWER CUT<span className="text-[0.5em] align-super">™</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 max-w-xl lg:mx-0 mx-auto animate-fade-in-up stagger-1">
                  {siteCopy.hero.subheadline}
                </p>

                {/* CTA Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-2">
                  <a
                    href={siteCopy.brand.primaryCtaHref}
                    className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                  >
                    {siteCopy.brand.primaryCtaLabel}
                  </a>
                  <a
                    href={siteCopy.brand.secondaryCtaHref}
                    className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-8 text-lg font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
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
              <p className="text-sm text-[var(--primary)]/80 leading-relaxed">
                {siteCopy.hero.secureNote}
              </p>
              <a
                href={siteCopy.brand.primaryCtaHref}
                className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold mt-5"
              >
                {siteCopy.brand.primaryCtaLabel}
              </a>
            </div>

            {/* Countdown Timer */}
            <div className="mt-8 text-center">
              <CountdownTimer label={siteCopy.hero.timerLabel} />
            </div>

            {/* Research Disclaimer */}
            <p className="mt-4 text-xs text-[var(--primary)]/50 text-center">
              {siteCopy.hero.researchDisclaimer}
            </p>
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[var(--primary)] text-white text-base font-semibold rounded-xl hover:bg-[var(--primary-light)] transition-colors"
                  >
                    Learn More
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {siteCopy.pricing.tiers.map((tier) => (
                <PricingCard key={tier.id} {...tier} />
              ))}
            </div>
          </Container>
        </Section>

        {/* Safety Section */}
        <Section className="bg-white">
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
                    <p className="text-xs text-[var(--primary)]/50 mt-2">
                      View Purity Test
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
