import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: `THE POWER CUT™ PROTOCOL — The 10-Week Catalytic Reset`,
  description:
    "A synchronized biological reset engineered to strip fat, preserve lean muscle, increase recovery, and stabilize energy.",
};

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
        <CheckIcon className="w-3 h-3 text-[var(--accent-dark)]" />
      </span>
      <span>{children}</span>
    </li>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-px w-16 bg-[var(--accent)]/30" />
      <div className="mx-4 h-2 w-2 rounded-full bg-[var(--accent)]/40" />
      <div className="h-px w-16 bg-[var(--accent)]/30" />
    </div>
  );
}

export default function PowerCutProtocol() {
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
          <a
            href="/#pricing"
            className="btn-primary inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            Order Now
          </a>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>THE FULL PROTOCOL</span>
              </div>

              <h1 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                THE POWER CUT<span className="text-[0.5em] align-super">™</span>{" "}
                PROTOCOL
              </h1>

              <p className="mt-4 text-xl sm:text-2xl font-semibold text-[var(--accent-dark)] animate-fade-in-up stagger-1">
                The 10-Week Catalytic Reset
              </p>

              <div className="mt-10 max-w-2xl mx-auto text-left space-y-6 text-lg text-[var(--primary)]/80 animate-fade-in-up stagger-2">
                <p className="text-center font-medium">
                  If you&apos;re reading this, you already know something most people
                  don&apos;t.
                </p>
                <p className="text-center text-2xl font-bold text-[var(--primary)]">
                  Trying harder doesn&apos;t work.
                </p>
                <p className="text-center text-[var(--primary)]/60">
                  More cardio. Lower calories. More &ldquo;discipline.&rdquo;
                </p>
                <p className="text-center text-[var(--primary)]/60">
                  That&apos;s not transformation.
                  <br />
                  That&apos;s friction.
                </p>
                <div className="pt-4 text-center">
                  <p className="font-semibold text-[var(--primary)]">
                    Your body does not respond to effort.
                  </p>
                  <p className="font-semibold text-[var(--primary)]">
                    It responds to <span className="text-[var(--accent-dark)]">signals</span>.
                  </p>
                  <p className="mt-4 text-[var(--primary)]/70 italic">
                    This protocol was engineered to control them.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Objective */}
        <Section className="bg-[var(--primary)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Objective
              </h2>
              <p className="mt-6 text-lg sm:text-xl text-white/80 leading-relaxed">
                Strip fat aggressively. Preserve and enhance lean muscle. Increase
                recovery. Stabilize energy. Eliminate food noise.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {[
                  "Without the crash",
                  "Without looking flat",
                  "Without wrecking your joints",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[var(--accent)]"
                  >
                    <CheckIcon className="w-3 h-3" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur">
                <p className="text-white/70">This is not a supplement stack.</p>
                <p className="mt-2 text-xl font-bold text-[var(--accent)]">
                  It&apos;s a synchronized biological reset.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Architecture */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  The Architecture
                </h2>
                <p className="mt-2 text-lg text-[var(--accent-dark)] font-semibold">
                  10-Week Kit
                </p>
                <p className="mt-4 text-[var(--primary)]/70">
                  This system works because each component solves the weakness of
                  the others.
                </p>
              </div>

              <div className="space-y-8">
                {/* The Engine */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)] card-hover">
                  <div className="flex items-center gap-3 mb-1">
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
                          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--primary)]">
                        The Engine
                      </h3>
                      <p className="text-sm text-[var(--accent-dark)] font-medium">
                        Retatrutide (40mg total)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--primary)]/60 mb-4">
                    GLP-1 / GIP / Glucagon triple agonist
                  </p>
                  <p className="font-semibold text-[var(--primary)] mb-3">
                    What it does:
                  </p>
                  <ul className="space-y-2 text-[var(--primary)]/80">
                    <Bullet>Reduces food noise</Bullet>
                    <Bullet>Increases energy expenditure</Bullet>
                    <Bullet>Stimulates stored fat oxidation</Bullet>
                    <Bullet>Raises metabolic output</Bullet>
                  </ul>
                  <div className="mt-5 p-4 rounded-xl bg-white border border-[var(--border)]">
                    <p className="text-sm text-[var(--primary)]/70">
                      This breaks the &ldquo;metabolic lock.&rdquo; But on its own? You risk
                      looking flat. You risk muscle loss. You risk feeling depleted.
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                      Which is why it isn&apos;t run alone.
                    </p>
                  </div>
                </div>

                {/* The Architect */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)] card-hover">
                  <div className="flex items-center gap-3 mb-1">
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
                          d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--primary)]">
                        The Architect
                      </h3>
                      <p className="text-sm text-[var(--accent-dark)] font-medium">
                        CJC-1295 + Ipamorelin (20mg total)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--primary)]/60 mb-4">
                    Growth Hormone pulse amplification
                  </p>
                  <p className="font-semibold text-[var(--primary)] mb-3">
                    What it does:
                  </p>
                  <ul className="space-y-2 text-[var(--primary)]/80">
                    <Bullet>Builds lean muscle</Bullet>
                    <Bullet>Improves sleep depth</Bullet>
                    <Bullet>Supports recovery</Bullet>
                    <Bullet>Maintains muscle fullness during deficit</Bullet>
                  </ul>
                  <div className="mt-5 p-4 rounded-xl bg-white border border-[var(--border)]">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      Retatrutide burns. The Architect builds.
                    </p>
                  </div>
                </div>

                {/* The Shield */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)] card-hover">
                  <div className="flex items-center gap-3 mb-1">
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
                          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                        />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--primary)]">
                        The Shield
                      </h3>
                      <p className="text-sm text-[var(--accent-dark)] font-medium">
                        BPC-157 + TB-500 (40mg total)
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--primary)]/60 mb-4">
                    Local + systemic repair
                  </p>
                  <p className="font-semibold text-[var(--primary)] mb-3">
                    What it does:
                  </p>
                  <ul className="space-y-2 text-[var(--primary)]/80">
                    <Bullet>Accelerates connective tissue recovery</Bullet>
                    <Bullet>Reduces inflammatory drag</Bullet>
                    <Bullet>Supports tendon &amp; ligament integrity</Bullet>
                    <Bullet>Improves training resilience</Bullet>
                  </ul>
                  <div className="mt-5 p-4 rounded-xl bg-white border border-[var(--border)]">
                    <p className="text-sm text-[var(--primary)]/70">
                      When bodyweight drops fast, the frame gets stressed.
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                      The Shield prevents breakdown while the Engine works.
                    </p>
                  </div>
                </div>
              </div>

              {/* Synergy statement */}
              <div className="mt-10 text-center">
                <p className="text-[var(--primary)]/70">
                  Alone, these peptides function.
                </p>
                <p className="text-[var(--primary)]/70">
                  Stacked correctly, they <span className="font-bold text-[var(--primary)]">compound</span>.
                </p>
                <p className="mt-3 text-lg font-bold text-[var(--accent-dark)]">
                  This is synergy over volume.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Dosing Framework */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Dosing Framework
                </h2>
                <p className="mt-2 text-lg text-[var(--accent-dark)] font-semibold">
                  How the System Is Titrated
                </p>
              </div>

              <div className="space-y-6 text-[var(--primary)]/80">
                <p>
                  This protocol is not run with aggressive dosing from day one.
                  The goal is <span className="font-semibold text-[var(--primary)]">signal control</span>, not shock.
                </p>
                <p>
                  Peptides work best when introduced gradually so the body can adapt
                  to the signaling shift.
                </p>
                <div className="p-5 rounded-2xl bg-white border border-[var(--border)]">
                  <p className="font-bold text-[var(--primary)] text-center">
                    Start conservative. Increase gradually. Let biology respond.
                  </p>
                </div>
              </div>

              <SectionDivider />

              {/* Retatrutide dosing */}
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border)]">
                <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
                  Retatrutide (The Engine)
                </h3>
                <div className="space-y-4 text-[var(--primary)]/80">
                  <p>
                    Retatrutide is introduced with a weekly titration approach.
                    Early weeks focus on appetite regulation and metabolic signaling.
                    Later weeks increase the dose slightly to enhance fat oxidation
                    and energy expenditure.
                  </p>
                  <p>
                    Most people begin with a very small weekly dose and slowly increase
                    over the first several weeks. This dramatically reduces side effects
                    while allowing the metabolism to adjust.
                  </p>
                  <p className="italic text-[var(--primary)]/60">
                    Think of it like adjusting the thermostat of your metabolism —
                    not flipping a switch.
                  </p>
                </div>
              </div>

              {/* CJC/Ipam dosing */}
              <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border)]">
                <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
                  CJC-1295 + Ipamorelin (The Architect)
                </h3>
                <div className="space-y-4 text-[var(--primary)]/80">
                  <p>
                    CJC/Ipam works through growth hormone pulses, which is why it is
                    taken at night on an empty stomach. Most people run one nightly
                    pulse during the protocol.
                  </p>
                  <p>
                    Some advanced users add a second pulse earlier in the day, but one
                    nightly pulse is sufficient for the majority of people.
                  </p>
                  <p className="font-semibold text-[var(--primary)]">
                    Consistency matters more than volume. This compound works through
                    rhythm and repetition.
                  </p>
                </div>
              </div>

              {/* BPC/TB dosing */}
              <div className="mt-6 p-6 sm:p-8 rounded-3xl bg-white border border-[var(--border)]">
                <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
                  BPC-157 + TB-500 (The Shield)
                </h3>
                <div className="space-y-4 text-[var(--primary)]/80">
                  <p>
                    This blend supports structural repair and connective tissue
                    recovery. Most people administer it 2–3 times per week.
                  </p>
                  <p>
                    Higher training loads or existing injuries may benefit from
                    slightly more frequent administration early in the protocol.
                  </p>
                  <p className="font-semibold text-[var(--primary)]">
                    The goal here is simple: Maintain structural resilience while
                    the metabolic reset is occurring.
                  </p>
                </div>
              </div>

              <SectionDivider />

              {/* Why Dosing Precision Matters */}
              <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
                <h3 className="text-xl font-bold mb-4">
                  Why Dosing Precision Matters
                </h3>
                <div className="space-y-4 text-white/80">
                  <p className="font-bold text-white text-lg">
                    More is not better.
                  </p>
                  <p>
                    Peptides work through receptor signaling, which means excessively
                    high doses can actually reduce responsiveness over time.
                  </p>
                  <p>
                    This protocol was designed to deliver the{" "}
                    <span className="font-semibold text-[var(--accent)]">
                      minimum effective signal
                    </span>{" "}
                    required to create change. That&apos;s why dosing is individualized.
                  </p>
                </div>
              </div>

              {/* Calculator CTA */}
              <div className="mt-8 text-center p-8 rounded-3xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                <h3 className="text-2xl font-bold text-[var(--primary)]">
                  Use the Precision Calculator
                </h3>
                <p className="mt-4 text-[var(--primary)]/70 max-w-xl mx-auto">
                  Because vial concentrations, bodyweight, and experience levels
                  vary, we built a calculator that determines exact dosing for you.
                </p>
                <div className="mt-4 text-sm text-[var(--primary)]/60 space-y-1">
                  <p>It converts:</p>
                  <p className="font-medium text-[var(--primary)]/80">
                    Vial concentration &bull; Bodyweight &bull; Weekly schedule
                  </p>
                  <p>Into exact injection units and timing.</p>
                </div>
                <a
                  href="/dosing-calculator"
                  className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold mt-6"
                >
                  Peak State Labs Dosing Calculator
                </a>
                <p className="mt-4 text-sm text-[var(--primary)]/60">
                  Use it before beginning the protocol.
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                  Precision is the difference between guessing… and engineering.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Execution */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  The Execution
                </h2>
                <p className="mt-2 text-lg text-[var(--accent-dark)] font-semibold">
                  How It&apos;s Run
                </p>
                <p className="mt-4 text-[var(--primary)]/70">
                  Precision matters more than enthusiasm.
                </p>
              </div>

              <div className="space-y-8">
                {/* The Monday Ritual */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                      </svg>
                    </span>
                    <h3 className="text-xl font-bold text-[var(--primary)]">
                      The Monday Ritual
                    </h3>
                  </div>
                  <p className="text-[var(--primary)]/70 mb-4">
                    Every Monday morning:
                  </p>
                  <ul className="space-y-2 text-[var(--primary)]/80">
                    <Bullet>
                      Retatrutide (weekly dose — determined using the dosing
                      calculator)
                    </Bullet>
                    <Bullet>First BPC/TB administration</Bullet>
                  </ul>
                  <p className="mt-4 text-sm text-[var(--primary)]/60">
                    This synchronizes metabolism and structural repair.
                  </p>
                  <p className="mt-3 font-bold text-[var(--primary)]">
                    No skipping. No floating schedule. Biology responds to rhythm.
                  </p>
                </div>

                {/* Nightly Growth Pulse */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-xl font-bold text-[var(--primary)]">
                      Nightly Growth Pulse
                    </h3>
                  </div>
                  <p className="text-[var(--primary)]/80">
                    CJC/Ipam administered at night. Minimum 2 hours after your last
                    meal.
                  </p>
                  <div className="mt-4 p-4 rounded-xl bg-white border border-[var(--border)]">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      Insulin blocks growth hormone signaling. Injecting too close to
                      food means you waste the pulse.
                    </p>
                    <p className="mt-2 text-sm text-[var(--primary)]/70">
                      Simple rule. Follow it.
                    </p>
                  </div>
                </div>

                {/* Hydration Command */}
                <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-xl font-bold text-[var(--primary)]">
                      Hydration Command
                    </h3>
                  </div>
                  <p className="text-lg font-bold text-[var(--primary)]">
                    3–4 liters of water daily. Electrolytes strongly encouraged.
                  </p>
                  <p className="mt-3 text-[var(--primary)]/70">
                    Retatrutide increases metabolic waste turnover. Hydration supports
                    that shift.
                  </p>
                  <p className="mt-2 font-semibold text-[var(--primary)]">
                    Under-hydrate, and you feel it.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* What Typically Happens */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  What Typically Happens
                </h2>
                <p className="mt-2 text-lg text-[var(--accent-dark)] font-semibold">
                  When Run Correctly
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    weeks: "Week 1–2",
                    items: [
                      "Reduced food noise",
                      "Subtle inflammation drop",
                      "Improved sleep depth",
                    ],
                  },
                  {
                    weeks: "Week 3–4",
                    items: [
                      "Appetite stabilizes",
                      "Clothes fit differently",
                      "Recovery improves",
                    ],
                  },
                  {
                    weeks: "Week 5–8",
                    items: [
                      "Visible recomposition",
                      "Lean tissue becomes more apparent",
                      "Energy stabilizes",
                    ],
                  },
                  {
                    weeks: "Week 9–10+",
                    items: [
                      "Hardening phase",
                      "Noticeable definition",
                      "Improved mobility and resilience",
                    ],
                  },
                ].map((phase, index) => (
                  <div
                    key={phase.weeks}
                    className="relative pl-8 sm:pl-0 sm:grid sm:grid-cols-[140px_1fr] gap-8 items-start"
                  >
                    <div className="absolute left-0 top-0 sm:hidden w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-white shadow" />
                    {index < 3 && (
                      <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-[var(--accent)]/30 sm:hidden" />
                    )}
                    <div className="hidden sm:flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[var(--accent)] border-4 border-white shadow" />
                      {index < 3 && (
                        <div className="w-0.5 flex-1 bg-[var(--accent)]/30 my-2" />
                      )}
                      <span className="text-xs font-semibold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-full whitespace-nowrap">
                        {phase.weeks}
                      </span>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover">
                      <h3 className="font-bold text-lg text-[var(--primary)] mb-3">
                        {phase.weeks}
                      </h3>
                      <ul className="space-y-2 text-[var(--primary)]/80">
                        {phase.items.map((item) => (
                          <Bullet key={item}>{item}</Bullet>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-[var(--primary)]/70">These are patterns.</p>
                <p className="font-bold text-[var(--primary)]">
                  Not hype. Patterns.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Fueling Laws */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Fueling Laws
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-[var(--muted)] border border-[var(--border)]">
                <p className="text-[var(--primary)]/70">
                  Peptides are the foremen.
                </p>
                <p className="text-lg font-bold text-[var(--primary)] mt-2">
                  Protein is the raw material.
                </p>
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white text-center">
                  <p className="text-2xl font-bold">
                    Minimum: 1 gram per pound of bodyweight
                  </p>
                  <p className="mt-2 text-white/80">This is non-negotiable.</p>
                </div>
                <p className="mt-6 text-[var(--primary)]/70">
                  Carb and fat balance depends on your metabolic type. But protein
                  stays fixed.
                </p>
                <p className="mt-2 font-semibold text-[var(--primary)]">
                  Under-eat it and the architecture suffers.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Training Signal */}
        <Section className="bg-[var(--primary)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Training Signal
                </h2>
              </div>

              <div className="space-y-6 text-white/80">
                <p>
                  Without resistance training, your body may down-regulate lean tissue
                  during deficit.
                </p>
                <p className="font-semibold text-white text-lg">
                  Strength training tells your system: &ldquo;Keep this.&rdquo;
                </p>
              </div>

              <div className="mt-8 grid sm:grid-cols-3 gap-4">
                {[
                  { phase: "Phase 1", name: "Structural Reset" },
                  { phase: "Phase 2", name: "Hypertrophy Overhaul" },
                  { phase: "Phase 3", name: "Peak Hardening" },
                ].map((item) => (
                  <div
                    key={item.phase}
                    className="p-5 rounded-2xl bg-white/10 backdrop-blur text-center"
                  >
                    <p className="text-sm text-[var(--accent)] font-semibold">
                      {item.phase}
                    </p>
                    <p className="mt-1 font-bold text-white">{item.name}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur text-center">
                <p className="text-white/70">
                  Fat loss without muscle signal creates a smaller version of you.
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--accent)]">
                  Fat loss with muscle signal creates a sharper version.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Side Effects */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Side Effects
                </h2>
                <p className="mt-2 text-lg text-[var(--primary)]/60">
                  Adult Conversation
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--muted)]">
                <p className="font-semibold text-[var(--primary)] mb-4">
                  Common early sensations:
                </p>
                <ul className="space-y-3 text-[var(--primary)]/80">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    </span>
                    <span>Mild nausea during titration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    </span>
                    <span>Temporary flushing after CJC/Ipam</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    </span>
                    <span>Slight water retention from GH pulse</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <p className="text-[var(--primary)]/70">
                    Most are transient. If something persists, dose adjusts.
                  </p>
                  <p className="mt-2 font-semibold text-[var(--primary)]">
                    This is precision work — not blind escalation.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Read This Carefully */}
        <Section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Read This Carefully
              </h2>
              <div className="mt-8 space-y-4 text-lg text-white/80">
                <p>This is not for dabblers.</p>
                <p>Not for people who want to &ldquo;try something.&rdquo;</p>
                <p className="text-white font-semibold">
                  This is for people willing to execute a 10-week biological reset
                  exactly as designed.
                </p>
              </div>
              <div className="mt-10 p-6 rounded-2xl bg-white/10 backdrop-blur">
                <p className="text-white/70">
                  If you&apos;re looking for motivation — this isn&apos;t it.
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--accent)]">
                  If you&apos;re ready to run the system correctly — keep reading.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Cost of Waiting */}
        <Section className="bg-[var(--muted)]">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Cost of Waiting
              </h2>
              <div className="mt-8 space-y-4 text-lg text-[var(--primary)]/80">
                <p>
                  Every month you delay, your metabolic set-point reinforces itself.
                </p>
                <p className="font-semibold text-[var(--primary)]">
                  Fat cells do not respond to intention. They respond to signaling.
                </p>
                <p>
                  The longer you operate under weak signals, the more your biology
                  adapts to them.
                </p>
              </div>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                  <p className="font-bold text-[var(--accent-dark)]">
                    Precision compounds momentum.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-red-50 border border-red-200">
                  <p className="font-bold text-red-500">
                    Indecision compounds stagnation.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* If You Run This Correctly */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  If You Run This Correctly, Expect:
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Noticeable appetite control by Week 3",
                  "Visible recomposition by Week 5",
                  "Improved recovery within 14 days",
                  "Reduced joint irritation during deficit",
                  "Stable energy instead of crash cycles",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)]"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center">
                      <CheckIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
                    </span>
                    <span className="text-[var(--primary)]/80 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-[var(--primary)]/70">This isn&apos;t random.</p>
                <p className="text-xl font-bold text-[var(--accent-dark)]">
                  It&apos;s engineered.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* The Decision */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Decision
              </h2>
              <div className="mt-8 text-lg text-[var(--primary)]/70">
                <p>You have two options:</p>
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl border border-[var(--border)] bg-white">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
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
                  </div>
                  <p className="text-[var(--primary)]/70">
                    Continue trying to out-discipline biology.
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="font-bold">Or use it.</p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-[var(--primary)]/70 max-w-xl mx-auto">
                  If you&apos;re ready to run the full 10-week POWER CUT™ stack
                  exactly as outlined above, access the complete kit here:
                </p>
                <a
                  href="/#pricing"
                  className="btn-primary inline-flex h-16 items-center justify-center rounded-2xl px-12 text-xl font-bold mt-8"
                >
                  ORDER NOW
                </a>
              </div>

              <div className="mt-12 space-y-3 text-sm text-[var(--primary)]/50">
                <p>No gimmicks. Just the system.</p>
                <p>
                  Research compounds. Educational use only. Individual responsibility
                  required.
                </p>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-white border border-[var(--border)]">
                <p className="text-[var(--primary)]/70">
                  You&apos;ve seen the architecture.
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--primary)]">
                  Now decide whether you build with it.
                </p>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </a>
              <nav className="flex flex-wrap justify-center gap-6 text-sm">
                <a
                  href="/"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="/#pricing"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="/dosing-calculator"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Dosing Calculator
                </a>
                <a
                  href="/#faq"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </nav>
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
