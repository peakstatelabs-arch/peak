import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CountdownTimer } from "@/app/components/CountdownTimer";
import { PricingCard } from "@/app/components/PricingCard";
import { BenefitsGrid } from "@/app/components/BenefitsGrid";
import { UrgencyBanner } from "@/app/components/UrgencyBanner";
import { TrackedLink } from "@/app/components/TrackedLink";
import { HeaderCrossLink } from "@/app/components/HeaderCrossLink";
import { ShippingNoteText } from "@/app/components/ShippingNoteText";
import { siteCopy } from "@/content/siteCopy";
import { MemberBanner } from "@/app/components/member/MemberBanner";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import { POWERCUT_SALE, SALE_NAME } from "@/app/lib/sale";
import { OtherStacks } from "@/app/components/sale/OtherStacks";
import { SaleBanner } from "@/app/components/SalePrice";
import { SaleBar } from "@/app/components/SaleUrgency";
import {
  PowerCutCalculator,
  PowerCutComparison,
  PowerCutContents,
  PowerCutFaq,
  PowerCutFinalCta,
  PowerCutProblemSolution,
  PowerCutReviews,
  PowerCutSafety,
  PowerCutSupport,
  PowerCutTimeline,
} from "@/app/components/powercut/PowerCutSections";

// Rendered per request: the sale state depends on the clock + preview cookie.
export const dynamic = "force-dynamic";

export default async function Home() {
  const initialSale = await getSaleStatus();
  // DIY-vs-stack comparison: one POWER CUT™ stack vs the same vials as singles.
  const cmp = siteCopy.comparison.powercut;
  const cmpPriceCents = initialSale.live
    ? POWERCUT_SALE.single.saleCents
    : cmp.priceCents;
  return (
    <div
      id="top"
      className={`min-h-screen bg-white text-[var(--primary)] ${initialSale.live ? "bf-dark" : ""}`}
    >
      {/* Urgency Banner — replaced by the sale bar while the sale is live */}
      {!initialSale.live && (
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
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        {/* Limited-time sale bar — pinned with the header */}
        <SaleBar href="/buildyourstack" cta="Build your own stack &amp; save" initial={initialSale} />
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
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Shortcut for Reta-aware visitors — text-weight so the hero stays untouched
                and the primary CTA keeps visual priority. Hidden md→lg, where the nav
                already fills the bar; short label on phones so it fits beside the CTA. */}
            <HeaderCrossLink
              href={siteCopy.brand.retaCtaHref}
              event="reta_entry_click"
              source="header"
              className="md:hidden lg:inline-flex"
            >
              <span className="lg:hidden">{siteCopy.brand.retaCtaLabelShort}</span>
              <span className="hidden lg:inline">{siteCopy.brand.retaCtaLabel}</span>
            </HeaderCrossLink>
            <a
              href={siteCopy.brand.primaryCtaHref}
              className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
            >
              {siteCopy.brand.primaryCtaLabel}
            </a>
          </div>
        </Container>

        {/* Members save 10% — non-members only; pinned under the logo bar */}
        <MemberBanner page="homepage" />
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

                {/* Included-with-every-order strip */}
                <div className="mt-5 inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 animate-fade-in-up stagger-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                    Included with every order
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]/80">
                    <svg className="w-4 h-4 text-[var(--accent-dark)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    1-on-1 coaching
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]/80">
                    <svg className="w-4 h-4 text-[var(--accent-dark)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Custom dosing
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
                  <TrackedLink
                    href={siteCopy.brand.quizCtaHref}
                    className="inline-flex h-12 sm:h-14 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-6 sm:px-8 text-base sm:text-lg font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)] whitespace-nowrap"
                    event="quiz_entry_click"
                    eventProperties={{ source: "hero" }}
                  >
                    {siteCopy.brand.quizCtaLabel}
                  </TrackedLink>
                </div>
              </div>

              {/* Right Column - Product Image */}
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative animate-drop-in">
                  <img
                    src="/power-cut-stack.webp"
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

        <PowerCutSupport />

        <PowerCutCalculator />

        <PowerCutContents />

        <PowerCutComparison initialSale={initialSale} cmp={cmp} cmpPriceCents={cmpPriceCents} />

        {/* Pricing Section */}
        <Section id="pricing" className="bg-[var(--muted)] !pb-8 sm:!pb-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {siteCopy.pricing.headline}
              </h2>
              <p className="mt-3 text-lg text-[var(--accent-dark)] font-semibold">
                [{siteCopy.pricing.subheadline}]
              </p>
              <SaleBanner initial={initialSale} className="mt-4" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {siteCopy.pricing.tiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  {...tier}
                  shipsBy={siteCopy.pricing.shipsBy}
                  initialSale={initialSale}
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Singles Offer Section - capture leads not ready for the full stack */}
        <Section className="bg-white relative overflow-hidden !pt-8 sm:!pt-12 !pb-8 sm:!pb-12">
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
                  <div className="mt-8 mx-auto grid max-w-2xl sm:max-w-3xl grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "Retatrutide",
                      "CJC-1295 + Ipamorelin",
                      "BPC-157 + TB-500",
                      "GHK-Cu",
                      "KPV",
                      "NAD+",
                    ].map((name) => (
                      <span
                        key={name}
                        className="flex h-full w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur px-4 py-2.5 text-center text-sm font-semibold text-balance"
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

                  {/* Sale: the vial ladder, front and center */}
                  {initialSale.live && (
                    <div className="mt-8 mx-auto max-w-3xl rounded-2xl border border-[var(--accent)]/50 bg-[#0b0f1a]/60 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
                        {SALE_NAME[initialSale.phase]} sale — every vial is on sale
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[
                          ["1 vial", "20%"],
                          ["2 vials", "30%"],
                          ["3 vials", "35%"],
                          ["4+ vials", "40%"],
                        ].map(([v, p]) => (
                          <div key={v} className="rounded-xl bg-white/5 px-2 py-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">{v}</p>
                            <p className="text-2xl font-black text-[var(--accent)]">
                              {p} <span className="text-sm">off</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-white/70">
                        e.g. one Retatrutide vial: <span className="line-through">$215</span>{" "}
                        <span className="font-extrabold text-white">$172</span> · mix any
                        products, the discount covers your whole order.
                      </p>
                    </div>
                  )}

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
                    {initialSale.live ? "Shop Single Vials — Up To 40% Off" : "Shop Single Vials"}
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

        {/* Sale: every Black Friday stack, right under the singles offer */}
        {initialSale.live && <OtherStacks hidePowerCut title="Explore Every Black Friday Stack" />}

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

        <PowerCutSafety />

        <PowerCutTimeline />

        <PowerCutProblemSolution />

        <PowerCutFaq />

        <PowerCutReviews />

        <PowerCutFinalCta />

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
