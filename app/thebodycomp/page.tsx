import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { ProteinCalculator } from "./ProteinCalculator";
import { MetabolicTypeQuiz } from "./MetabolicTypeQuiz";

export const metadata: Metadata = {
  title: "The Body Composition Blueprint™ — Peak State Labs",
  description:
    "The exact framework we use to help people approach fat loss, lean muscle growth, GLP-1s, peptide research, nutrition, training, recovery, and body recomposition with confidence.",
};

const CHAPTERS = [
  { id: "welcome", label: "Welcome" },
  { id: "roadmap", label: "Roadmap" },
  { id: "glp1s", label: "GLP-1s" },
  { id: "glp1-comparison", label: "Compare GLP-1s" },
  { id: "peptides", label: "Peptides" },
  { id: "muscle-glp1", label: "Lean Muscle" },
  { id: "metabolic-typing", label: "Metabolic Types" },
  { id: "protein", label: "Protein" },
  { id: "four-levers", label: "Four Levers" },
  { id: "supplements", label: "Supplements" },
  { id: "sleep", label: "Sleep" },
  { id: "30-days", label: "First 30 Days" },
  { id: "next", label: "What's Next" },
  { id: "calculator", label: "Calculator" },
  { id: "quiz", label: "Type Quiz" },
];

export default function BlueprintPage() {
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
            href="https://cal.com/peakstatelabs/the-body-composition-blueprint-strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            Book A Call
          </a>
        </Container>
      </header>

      {/* Hero */}
      <Section className="relative overflow-hidden gradient-hero !py-16 sm:!py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>
        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
              <span>THE BLUEPRINT</span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              The Body Composition Blueprint
              <span className="text-[0.5em] align-super">™</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 leading-relaxed">
              The exact framework we use to help people approach fat loss, lean
              muscle growth, GLP-1s, peptide research, nutrition, training,
              recovery, and body recomposition with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#welcome"
                className="btn-primary inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold"
              >
                Start Reading
              </a>
              <a
                href="#quiz"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-white px-6 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
              >
                Take The Quiz
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Sticky Chapter Nav */}
      <div className="sticky top-16 z-40 border-y border-[var(--border)] bg-white/95 backdrop-blur">
        <Container>
          <nav className="flex gap-1 overflow-x-auto py-3 -mx-2 px-2 scrollbar-hide">
            {CHAPTERS.map((c, idx) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--muted)]/60 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]/80 hover:bg-[var(--accent)]/15 hover:border-[var(--accent)]/40 hover:text-[var(--primary)] transition-colors whitespace-nowrap"
              >
                <span className="text-[var(--accent-dark)] tabular-nums">
                  {idx + 1}
                </span>
                {c.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      <main>
        <WelcomeSection />
        <RoadmapSection />
        <GLP1Section />
        <GLP1ComparisonSection />
        <PeptidesSection />
        <MuscleGLP1Section />
        <MetabolicTypingSection />
        <ProteinSection />
        <FourLeversSection />
        <SupplementsSection />
        <SleepSection />
        <ThirtyDaysSection />
        <NextSection />
        <ProteinCalculatorSection />
        <QuizSection />
        <MetabolicNutritionSection />
        <FinalCTASection />
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

/* ============================================================
 * Reusable building blocks
 * ============================================================ */

function ChapterHeader({
  num,
  eyebrow,
  title,
  lede,
}: {
  num: number;
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent-dark)]">
        <span className="tabular-nums">CHAPTER {num}</span>
        <span className="text-[var(--accent-dark)]/50">·</span>
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
        {title}
      </h2>
      {lede ? (
        <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-bcb max-w-2xl mx-auto text-[var(--primary)]/85 leading-relaxed text-base sm:text-[17px] space-y-4">
      {children}
    </div>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-12 mb-5 max-w-2xl mx-auto text-2xl sm:text-3xl font-bold tracking-tight text-[var(--primary)] text-center">
      {children}
    </h3>
  );
}

function CalloutPanel({
  title,
  children,
  variant = "muted",
}: {
  title?: string;
  children: React.ReactNode;
  variant?: "muted" | "accent" | "navy";
}) {
  const base = "max-w-3xl mx-auto rounded-2xl p-6 sm:p-8 my-8";
  const styles = {
    muted: `${base} bg-[var(--muted)]/70 border border-[var(--border)]`,
    accent: `${base} bg-[var(--accent)]/10 border border-[var(--accent)]/30`,
    navy: `${base} bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white shadow-xl`,
  };
  return (
    <div className={styles[variant]}>
      {title ? (
        <h4
          className={`text-base font-bold mb-3 ${
            variant === "navy" ? "text-[var(--accent)]" : "text-[var(--primary)]"
          }`}
        >
          {title}
        </h4>
      ) : null}
      <div
        className={`leading-relaxed space-y-3 ${
          variant === "navy" ? "text-white/90" : "text-[var(--primary)]/80"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CheckList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <svg
            className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent-dark)]"
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
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function KeyTakeaways({
  items,
}: {
  items: { title: string; body?: React.ReactNode }[];
}) {
  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-7 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">
            Key Takeaways
          </p>
          <div className="mt-6 space-y-5">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-[var(--accent)]/25 flex items-center justify-center text-[var(--accent)] font-bold text-sm tabular-nums">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-white">{item.title}</p>
                  {item.body ? (
                    <p className="mt-1 text-white/80 leading-relaxed text-sm sm:text-base">
                      {item.body}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Chapter 1 — Welcome
 * ============================================================ */

function WelcomeSection() {
  return (
    <Section id="welcome" className="bg-white">
      <Container>
        <ChapterHeader
          num={1}
          eyebrow="WELCOME"
          title="Welcome To The Blueprint"
        />
        <Prose>
          <p>
            If you&rsquo;re reading this, there&rsquo;s a good chance
            you&rsquo;ve spent more time researching body composition than you
            care to admit.
          </p>
          <p>You&rsquo;ve watched the YouTube videos.</p>
          <p>You&rsquo;ve listened to the podcasts.</p>
          <p>You&rsquo;ve saved the TikToks.</p>
          <p>
            You&rsquo;ve read Reddit threads at midnight trying to figure out
            whether one person&rsquo;s experience applies to you.
          </p>
          <p>
            At some point, most people realize they don&rsquo;t have an
            information problem.
          </p>
          <p>They have a clarity problem.</p>
          <p>Because the challenge isn&rsquo;t finding advice.</p>
          <p>
            The challenge is figuring out what actually matters, what
            doesn&rsquo;t, and how all the pieces fit together into a plan you
            can trust.
          </p>
          <p>That&rsquo;s why I created this Blueprint.</p>
          <p>Not to give you more information.</p>
          <p>To help you organize it.</p>
        </Prose>

        <SubHeading>The Real Goal</SubHeading>
        <Prose>
          <p>Most people say they want to lose weight.</p>
          <p>Some say they want to build muscle.</p>
          <p>
            Others say they want to improve their metabolism, get leaner, look
            better, or finally feel comfortable in their own skin again.
          </p>
          <p>
            What I&rsquo;ve found over the years is that almost nobody actually
            wants those things by themselves.
          </p>
          <p>What they want is what those things create.</p>
          <p>They want to walk into a room and feel confident.</p>
          <p>
            They want to look in the mirror and feel proud of what they see.
          </p>
          <p>They want more energy.</p>
          <p>Better focus.</p>
          <p>More freedom around food.</p>
          <p>
            They want to stop thinking about their body all day and start living
            their life again.
          </p>
          <p>Body composition is simply the vehicle.</p>
          <p>
            The destination is confidence, vitality, strength, and self-respect.
          </p>
        </Prose>

        <SubHeading>Why Most People Stay Stuck</SubHeading>
        <Prose>
          <p>The fitness industry has created an unusual problem.</p>
          <p>There&rsquo;s more information available today than ever before.</p>
          <p>Yet most people are more confused than ever.</p>
          <p>One expert says to cut carbs.</p>
          <p>Another says carbs don&rsquo;t matter.</p>
          <p>One person says fasted cardio is essential.</p>
          <p>Another says it&rsquo;s useless.</p>
          <p>One person recommends a GLP-1.</p>
          <p>Another says not to touch one.</p>
          <p>One person swears by a peptide.</p>
          <p>Another says supplements are all you need.</p>
          <p>
            Eventually people stop moving forward because every decision feels
            uncertain.
          </p>
          <p>They aren&rsquo;t lacking motivation.</p>
          <p>They&rsquo;re overwhelmed by conflicting information.</p>
          <p>
            And when everything feels important, it&rsquo;s hard to know where to
            start.
          </p>
        </Prose>

        <SubHeading>The Four Levers Of Body Composition</SubHeading>
        <Prose>
          <p>Everything in this Blueprint is built around a simple idea:</p>
          <p className="font-semibold text-[var(--primary)]">
            Successful body composition is not the result of one thing. It&rsquo;s
            the result of four things working together.
          </p>
        </Prose>

        <FourLeversDiagram />

        <Prose>
          <p>
            Most people spend all their time trying to optimize one lever while
            ignoring the others.
          </p>
          <p>The goal isn&rsquo;t perfection.</p>
          <p>The goal is alignment.</p>
          <p>
            When these four levers begin working together, progress becomes
            dramatically easier.
          </p>
        </Prose>

        <SubHeading>Where GLP-1s And Peptides Fit In</SubHeading>
        <Prose>
          <p>
            One of the biggest misconceptions in the health space is that
            peptides create transformation.
          </p>
          <p>They don&rsquo;t.</p>
          <p>They create opportunity.</p>
          <p>A GLP-1 cannot build discipline for you.</p>
          <p>A peptide cannot make decisions for you.</p>
          <p>
            Neither can replace movement, nutrition, sleep, or consistency.
          </p>
          <p>
            What they can do is improve the environment in which those decisions
            are made.
          </p>
          <p>For some people, that means less food noise.</p>
          <p>For others, improved recovery.</p>
          <p>
            For others, better adherence to a plan they already knew they should
            be following.
          </p>
          <p>When used intelligently, they can make the process easier.</p>
          <p>They do not eliminate the process.</p>
          <p>
            That&rsquo;s an important distinction you&rsquo;ll see throughout
            this Blueprint.
          </p>
        </Prose>

        <SubHeading>How To Use This Guide</SubHeading>
        <Prose>
          <p>You do not need to read this cover to cover in one sitting.</p>
          <p>In fact, I would encourage you not to.</p>
          <p>Start with the Body Composition Roadmap.</p>
          <p>
            That chapter will give you the framework that ties everything else
            together.
          </p>
          <p>
            From there, move through the sections that feel most relevant to
            where you are today.
          </p>
          <p>Some chapters will answer questions you&rsquo;ve had for years.</p>
          <p>Others may not feel immediately important.</p>
          <p>That&rsquo;s okay.</p>
          <p>The goal isn&rsquo;t to memorize information.</p>
          <p>
            The goal is to develop a clearer understanding of what moves the
            needle and what doesn&rsquo;t.
          </p>
          <p>
            By the time you finish this Blueprint, you should feel something most
            people never experience when it comes to their health:
          </p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-4">
            Clarity.
          </p>
          <p>You&rsquo;ll understand the major variables.</p>
          <p>You&rsquo;ll understand how they fit together.</p>
          <p>
            And you&rsquo;ll have a practical framework you can return to
            whenever you feel stuck.
          </p>
          <p>That&rsquo;s where real confidence comes from.</p>
          <p>Not knowing everything.</p>
          <p>Knowing what matters next.</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center mt-6">
            Let&rsquo;s begin.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}

function FourLeversDiagram() {
  const levers = [
    {
      n: "1",
      label: "Nutrition",
      body: "Raw materials your body needs to change.",
    },
    {
      n: "2",
      label: "Training",
      body: "Tells your body what to keep.",
    },
    {
      n: "3",
      label: "Recovery",
      body: "Where adaptation actually happens.",
    },
    {
      n: "4",
      label: "Biology",
      body: "Hunger, satiety, energy regulation.",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto my-10 grid sm:grid-cols-2 gap-4">
      {levers.map((l) => (
        <div
          key={l.n}
          className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 flex items-start gap-4 shadow-sm"
        >
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg flex items-center justify-center shadow-sm">
            {l.n}
          </div>
          <div>
            <p className="font-bold text-[var(--primary)] text-lg">
              {l.label}
            </p>
            <p className="mt-1.5 text-sm text-[var(--primary)]/70 leading-relaxed">
              {l.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Chapter 2 — The Body Composition Roadmap
 * ============================================================ */

function RoadmapSection() {
  return (
    <Section id="roadmap" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={2}
          eyebrow="THE ROADMAP"
          title="The Body Composition Roadmap"
        />
        <Prose>
          <p>
            Most people approach body composition the same way they approach a
            road trip without a map.
          </p>
          <p>They know where they want to go.</p>
          <p>They just don&rsquo;t know how to get there.</p>
          <p>So they start driving.</p>
          <p>A new workout program.</p>
          <p>A different diet.</p>
          <p>A supplement.</p>
          <p>A fasting protocol.</p>
          <p>A GLP-1.</p>
          <p>A peptide.</p>
          <p>Then another.</p>
          <p>Then another.</p>
          <p>Months go by.</p>
          <p>Sometimes years.</p>
          <p>
            And despite putting in effort, they never feel fully confident
            they&rsquo;re moving in the right direction.
          </p>
          <p>
            What I&rsquo;ve learned after working with thousands of people is
            that body composition becomes dramatically simpler when you
            understand one thing:
          </p>
          <p className="font-semibold text-[var(--primary)]">
            There are only a handful of variables that matter.
          </p>
          <p>Everything else is noise.</p>
        </Prose>

        <SubHeading>The Four Levers Of Body Composition</SubHeading>
        <Prose>
          <p>
            Every successful transformation I&rsquo;ve ever seen can be traced
            back to four core levers.
          </p>
          <p>Not forty.</p>
          <p>Four.</p>
        </Prose>

        <div className="max-w-3xl mx-auto mt-10 space-y-5">
          {[
            {
              n: "1",
              title: "Nutrition",
              body: "Nutrition determines whether your body has the raw materials it needs to change. Protein. Calories. Food quality. Meal structure. Appetite management. You can have the best training program in the world, but if nutrition is consistently working against your goals, progress becomes an uphill battle.",
            },
            {
              n: "2",
              title: "Training",
              body: "Training tells your body what to keep. If your goal is to look leaner, stronger, and more athletic, your body needs a reason to preserve muscle tissue. That signal comes from resistance training. Muscle is metabolically expensive. Without a reason to keep it, your body will gladly let some of it go during periods of fat loss. Training protects against that.",
            },
            {
              n: "3",
              title: "Recovery",
              body: "Most people underestimate recovery because they can't see it. They can see workouts. They can see meals. They can't see sleep quality. They can't see nervous system fatigue. They can't see recovery capacity.",
              after: (
                <>
                  <p className="mt-3 font-semibold text-[var(--primary)]">
                    Yet recovery influences everything:
                  </p>
                  <BulletList
                    items={[
                      "Energy",
                      "Hunger",
                      "Cravings",
                      "Hormones",
                      "Decision making",
                      "Training performance",
                      "Muscle retention",
                    ]}
                  />
                  <p className="mt-3">You don&rsquo;t get stronger from training.</p>
                  <p>You get stronger from recovering from training.</p>
                </>
              ),
            },
            {
              n: "4",
              title: "Biology",
              body: "This is the lever most people spend the least amount of time thinking about.",
              after: (
                <>
                  <p className="mt-3 font-semibold text-[var(--primary)]">
                    Biology influences:
                  </p>
                  <BulletList
                    items={[
                      "Appetite",
                      "Satiety",
                      "Food noise",
                      "Blood sugar regulation",
                      "Inflammation",
                      "Energy levels",
                      "Nutrient partitioning",
                    ]}
                  />
                  <p className="mt-3">
                    This is where GLP-1s and peptides often enter the
                    conversation.
                  </p>
                  <p>Not because they&rsquo;re magic.</p>
                  <p>
                    Because they can improve the biological environment that
                    supports the other three levers.
                  </p>
                  <p>
                    A person constantly battling hunger is playing a different
                    game than someone who isn&rsquo;t.
                  </p>
                  <p>
                    A person recovering efficiently is playing a different game
                    than someone who isn&rsquo;t.
                  </p>
                  <p className="font-semibold text-[var(--primary)]">
                    Biology matters. A lot.
                  </p>
                </>
              ),
            },
          ].map((l) => (
            <div
              key={l.n}
              className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-xl flex items-center justify-center shadow-sm">
                  {l.n}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                    Lever {l.n}
                  </p>
                  <h4 className="mt-1 text-2xl font-bold text-[var(--primary)]">
                    {l.title}
                  </h4>
                </div>
              </div>
              <div className="mt-5 text-[var(--primary)]/80 leading-relaxed space-y-3">
                <p>{l.body}</p>
                {l.after}
              </div>
            </div>
          ))}
        </div>

        <SubHeading>Why Most Plans Fail</SubHeading>
        <Prose>
          <p>Most plans fail because they only address one lever.</p>
          <p>Someone starts eating less.</p>
          <p>Nutrition improves.</p>
          <p>Training remains inconsistent.</p>
          <p>Sleep remains poor.</p>
          <p>Recovery suffers.</p>
          <p>Progress stalls.</p>
          <p>Someone starts a new workout program.</p>
          <p>Training improves.</p>
          <p>Nutrition remains chaotic.</p>
          <p>Recovery remains poor.</p>
          <p>Progress stalls.</p>
          <p>Someone starts a GLP-1.</p>
          <p>Biology improves.</p>
          <p>Training remains absent.</p>
          <p>Protein intake remains low.</p>
          <p>Progress slows.</p>
          <p className="font-semibold text-[var(--primary)]">
            The body responds best when all four levers begin moving in the same
            direction.
          </p>
          <p>Not perfectly.</p>
          <p>Just consistently.</p>
        </Prose>

        <SubHeading>The Body Composition Pyramid</SubHeading>
        <Prose>
          <p>
            When people think about body composition, they often start at the
            top of the pyramid.
          </p>
          <p>They focus on details.</p>
          <p>Supplement timing.</p>
          <p>Fat burners.</p>
          <p>Injection protocols.</p>
          <p>Advanced optimization.</p>
          <p>The foundation is usually ignored.</p>
          <p>The reality looks more like this:</p>
        </Prose>

        <BodyCompositionPyramid />

        <Prose>
          <p>
            Most people attempt to solve Level 5 problems while Level 1 is still
            unstable.
          </p>
          <p>That&rsquo;s like upgrading the tires on a car without an engine.</p>
        </Prose>

        <SubHeading>The Three Phases Of Transformation</SubHeading>
        <Prose>
          <p>
            Nearly every successful body composition journey follows the same
            pattern.
          </p>
        </Prose>

        <ThreePhasesTimeline />

        <SubHeading>The Real Goal</SubHeading>
        <Prose>
          <p>
            Many people begin this journey believing they need more discipline.
          </p>
          <p>More willpower.</p>
          <p>More motivation.</p>
          <p>What they usually need is more structure.</p>
          <p>Because structure reduces decision fatigue.</p>
          <p>Structure creates consistency.</p>
          <p>Consistency creates momentum.</p>
          <p>Momentum creates confidence.</p>
          <p>Confidence creates long-term change.</p>
          <p>
            The goal of this Blueprint is not to turn you into a fitness expert.
          </p>
          <p>
            The goal is to help you understand the handful of variables that
            matter most and give you a framework you can trust.
          </p>
          <p>Everything that follows in this guide builds on this roadmap.</p>
          <p>The nutrition chapters.</p>
          <p>The GLP-1 chapters.</p>
          <p>The peptide chapters.</p>
          <p>The training chapters.</p>
          <p>The recovery chapters.</p>
          <p>
            They&rsquo;re all different ways of strengthening one of the four
            levers.
          </p>
          <p>
            As you move through the rest of the Blueprint, keep returning to
            this framework.
          </p>
          <p>Whenever progress feels confusing, ask yourself:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-4">
            Which lever needs attention?
          </p>
          <p>Most of the time, the answer becomes surprisingly clear.</p>
          <p>And clarity is where progress begins.</p>
        </Prose>
      </Container>
    </Section>
  );
}

function BodyCompositionPyramid() {
  const levels = [
    {
      n: 5,
      label: "Optimization",
      body: "Supplements. Peptides. Advanced strategies. Fine-tuning.",
      width: "w-1/4",
    },
    {
      n: 4,
      label: "Recovery",
      body: "Are you recovering well enough to repeat the process?",
      width: "w-2/5",
    },
    {
      n: 3,
      label: "Training",
      body: "Are you giving your body a reason to retain muscle?",
      width: "w-1/2",
    },
    {
      n: 2,
      label: "Nutrition",
      body: "Are calories and protein reasonably aligned?",
      width: "w-3/4",
    },
    {
      n: 1,
      label: "Adherence",
      body: "Can you consistently follow the plan?",
      width: "w-full",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto my-10 space-y-2">
      {levels.map((l) => (
        <div key={l.n} className="flex justify-center">
          <div
            className={`${l.width} max-w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white px-5 py-4 sm:px-7 sm:py-5 shadow-sm flex items-center justify-between gap-4`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--accent)]/30 text-[var(--accent)] font-bold text-sm flex items-center justify-center">
                {l.n}
              </span>
              <div className="min-w-0">
                <p className="font-bold text-sm sm:text-base truncate">
                  {l.label}
                </p>
                <p className="text-xs text-white/75 truncate hidden sm:block">
                  {l.body}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-[var(--primary)]/50 font-semibold tracking-wider uppercase mt-3">
        Foundation up
      </p>
    </div>
  );
}

function ThreePhasesTimeline() {
  const phases = [
    {
      n: "1",
      label: "Stabilization",
      body: "The goal here isn't rapid transformation. The goal is creating stability. Improving consistency. Establishing structure. Reducing chaos. Creating predictable habits. This phase often produces immediate momentum because people stop constantly changing directions.",
    },
    {
      n: "2",
      label: "Recomposition",
      body: "Once consistency exists, the body becomes far more responsive. Fat loss begins accelerating. Muscle retention improves. Energy improves. Recovery improves. The process starts feeling easier. This is where many people finally experience visible changes in the mirror.",
    },
    {
      n: "3",
      label: "Integration",
      body: "This is where results become sustainable. The goal shifts from creating change to maintaining change. The habits become familiar. The systems become automatic. You stop relying on motivation because your environment and routines are doing most of the work. This phase receives very little attention in the fitness industry. It's also the phase that determines whether results last.",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto my-10">
      <div className="hidden md:flex items-stretch gap-3">
        {phases.map((p, i) => (
          <div key={p.n} className="flex-1 flex flex-col">
            <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-5 h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-base flex items-center justify-center">
                  {p.n}
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                  Phase {p.n}
                </p>
              </div>
              <h4 className="text-xl font-bold text-[var(--primary)]">
                {p.label}
              </h4>
              <p className="mt-3 text-sm text-[var(--primary)]/70 leading-relaxed">
                {p.body}
              </p>
            </div>
            {i < phases.length - 1 ? (
              <div className="hidden md:block mt-2 text-center text-[var(--accent-dark)] text-2xl">
                →
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="md:hidden space-y-4">
        {phases.map((p) => (
          <div
            key={p.n}
            className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-base flex items-center justify-center">
                {p.n}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                  Phase {p.n}
                </p>
                <h4 className="text-lg font-bold text-[var(--primary)] leading-tight">
                  {p.label}
                </h4>
              </div>
            </div>
            <p className="text-sm text-[var(--primary)]/70 leading-relaxed">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Chapter 3 — Understanding GLP-1s
 * ============================================================ */

function GLP1Section() {
  return (
    <Section id="glp1s" className="bg-white">
      <Container>
        <ChapterHeader
          num={3}
          eyebrow="UNDERSTANDING GLP-1s"
          title="Why They Work — And Why Most People Misunderstand Them"
        />
        <Prose>
          <p>
            Few topics in health have generated more attention over the last few
            years than GLP-1 medications.
          </p>
          <p>
            Depending on who you ask, they&rsquo;re either one of the most
            important breakthroughs in obesity treatment or they&rsquo;re the
            reason society has become lazy.
          </p>
          <p>The reality is far less dramatic.</p>
          <p>
            Like most things in health, the truth lives somewhere in the middle.
          </p>
          <p>
            The goal of this chapter isn&rsquo;t to convince you to use a GLP-1.
          </p>
          <p>The goal is to help you understand what they actually do.</p>
          <p>
            Because once you understand the mechanism, many of the
            misconceptions disappear.
          </p>
        </Prose>

        <SubHeading>The Problem Most People Are Trying To Solve</SubHeading>
        <Prose>
          <p>Before we talk about GLP-1s, we need to talk about hunger.</p>
          <p>Most people assume hunger is simply a matter of willpower.</p>
          <p>They believe lean people are somehow more disciplined.</p>
          <p>More motivated.</p>
          <p>More committed.</p>
          <p>What they don&rsquo;t realize is that hunger is largely biological.</p>
          <p>
            The person who effortlessly leaves food on their plate and the
            person who thinks about food all day are often playing completely
            different games.
          </p>
          <p>
            One of the biggest discoveries in obesity research over the last few
            decades is that body weight is influenced by powerful biological
            systems designed to keep us alive.
          </p>
          <p>Your body doesn&rsquo;t know you&rsquo;re trying to fit into smaller jeans.</p>
          <p>Your body thinks it&rsquo;s trying to survive.</p>
          <p>
            That matters because survival systems tend to be extremely persuasive.
          </p>
        </Prose>

        <SubHeading>What Is GLP-1?</SubHeading>
        <Prose>
          <p>GLP-1 stands for:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            Glucagon-Like Peptide-1
          </p>
          <p>Fortunately, you don&rsquo;t need to remember that.</p>
          <p>What matters is understanding its job.</p>
          <p>GLP-1 is a hormone your body naturally produces after you eat.</p>
          <p>
            Think of it as one of your body&rsquo;s &ldquo;I&rsquo;ve had enough
            food&rdquo; signals.
          </p>
          <p>After a meal, GLP-1 helps:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <CheckList
            items={[
              "Increase feelings of fullness",
              "Reduce appetite",
              "Slow stomach emptying",
              "Improve blood sugar regulation",
              "Reduce food-seeking behavior",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>In other words, it helps create the feeling of satisfaction.</p>
          <p>
            The feeling many people lose touch with after years of dieting,
            overeating, stress, poor sleep, and highly processed foods.
          </p>
        </Prose>

        <SubHeading>The Food Noise Problem</SubHeading>
        <Prose>
          <p>
            One of the most common experiences reported by GLP-1 users has very
            little to do with weight loss.
          </p>
          <p>They describe something often called:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            Food Noise
          </p>
          <p>Food noise isn&rsquo;t physical hunger.</p>
          <p>It&rsquo;s the constant mental conversation around food.</p>
          <p>What should I eat?</p>
          <p>When should I eat?</p>
          <p>What snack should I have?</p>
          <p>What&rsquo;s for dinner?</p>
          <p>Maybe just one more bite.</p>
          <p>Maybe one more handful.</p>
          <p>Maybe tomorrow I&rsquo;ll start over.</p>
          <p>For some people, that conversation never stops.</p>
          <p>Many individuals who start a GLP-1 experience something surprising:</p>
          <p className="font-semibold text-[var(--primary)]">
            The conversation gets quieter.
          </p>
          <p>Not because they suddenly became more disciplined.</p>
          <p>Because the biological signal driving that conversation changed.</p>
          <p>
            For the first time, they experience what many naturally lean people
            experience every day.
          </p>
          <p>Food becomes less emotionally demanding.</p>
        </Prose>

        <SubHeading>Why GLP-1s Produce Weight Loss</SubHeading>
        <Prose>
          <p>The internet loves complicated explanations.</p>
          <p>The truth is relatively simple.</p>
          <p>
            GLP-1s help many people eat fewer calories without feeling like
            they&rsquo;re constantly fighting themselves.
          </p>
          <p>That&rsquo;s it.</p>
          <p>That doesn&rsquo;t mean they&rsquo;re ineffective.</p>
          <p>Quite the opposite.</p>
          <p>Reducing calorie intake is still the primary driver of fat loss.</p>
          <p>The challenge has always been adherence.</p>
          <p>Most people know how to eat fewer calories.</p>
          <p>
            The difficult part is continuing to do it when hunger increases.
          </p>
          <p>
            GLP-1s often improve adherence because they reduce the biological
            resistance people experience when attempting to maintain a calorie
            deficit.
          </p>
        </Prose>

        <SubHeading>Why Some People Lose Muscle</SubHeading>
        <Prose>
          <p>This is where many people get into trouble.</p>
          <p>Weight loss and fat loss are not the same thing.</p>
          <p>When body weight decreases, some of that loss may come from:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Body fat", "Water", "Glycogen", "Muscle tissue"]}
          />
        </CalloutPanel>
        <Prose>
          <p>The goal isn&rsquo;t simply losing weight.</p>
          <p>The goal is improving body composition.</p>
          <p>
            Many people begin a GLP-1 and immediately start eating dramatically
            less food.
          </p>
          <p>Protein drops.</p>
          <p>Training disappears.</p>
          <p>Recovery suffers.</p>
          <p>
            Months later they&rsquo;ve lost weight, but they don&rsquo;t
            necessarily look, feel, or perform better.
          </p>
          <p>This isn&rsquo;t a GLP-1 problem.</p>
          <p>It&rsquo;s a strategy problem.</p>
          <p>Your body still needs:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <CheckList
            items={[
              "Adequate protein",
              "Resistance training",
              "Recovery",
              "Movement",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>Without those inputs, muscle retention becomes much more difficult.</p>
        </Prose>

        <SubHeading>Why GLP-1s Are Not Magic</SubHeading>
        <Prose>
          <p>The internet tends to swing between extremes.</p>
          <p>One group believes GLP-1s solve everything.</p>
          <p>Another believes they solve nothing.</p>
          <p>Neither perspective is particularly useful.</p>
          <p>GLP-1s do not:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Build muscle",
              "Create healthy habits",
              "Improve sleep",
              "Teach nutrition",
              "Eliminate emotional eating patterns",
              "Replace movement",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>What they often do is create space.</p>
          <p>Space between impulse and action.</p>
          <p>Space between cravings and decisions.</p>
          <p>Space between intention and execution.</p>
          <p>For many people, that space becomes incredibly valuable.</p>
          <p>
            Because it allows them to finally implement the habits they already
            knew they should be following.
          </p>
        </Prose>

        <SubHeading>The Most Successful GLP-1 Users</SubHeading>
        <Prose>
          <p>
            After observing hundreds of successful transformations, a pattern
            begins to emerge.
          </p>
          <p>
            The people who achieve the best outcomes don&rsquo;t view GLP-1s as
            the solution.
          </p>
          <p>They view them as a tool.</p>
          <p>A tool that supports:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <CheckList
            items={[
              "Better nutrition",
              "Better protein intake",
              "Better training consistency",
              "Better recovery habits",
              "Better long-term adherence",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The medication helps create the environment.</p>
          <p>Their daily actions create the outcome.</p>
          <p>When both work together, progress becomes significantly easier.</p>
        </Prose>

        <SubHeading>The Peak State Approach</SubHeading>
        <Prose>
          <p>At Peak State Labs, we don&rsquo;t view GLP-1s as weight-loss drugs.</p>
          <p>We view them as biological tools.</p>
          <p>
            Tools that can make one of the four body composition levers easier
            to manage.
          </p>
          <p>Remember the framework from the previous chapter:</p>
          <ol className="list-decimal pl-6 space-y-1 my-3 font-semibold text-[var(--primary)]">
            <li>Nutrition</li>
            <li>Training</li>
            <li>Recovery</li>
            <li>Biology</li>
          </ol>
          <p>GLP-1s primarily influence biology.</p>
          <p>
            The mistake many people make is expecting improvements in biology
            to automatically fix everything else.
          </p>
          <p>
            The greatest results occur when all four levers begin moving in the
            same direction.
          </p>
          <p>That&rsquo;s where real transformation happens.</p>
          <p>Not because one variable changed.</p>
          <p>Because the entire system became aligned.</p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Hunger is heavily influenced by biology.",
              body: "It is not simply a willpower problem.",
            },
            {
              title: "GLP-1s improve satiety and reduce food noise.",
              body: "This often makes adherence easier.",
            },
            {
              title: "Weight loss and fat loss are not the same thing.",
              body: "Muscle retention matters.",
            },
            {
              title: "Protein and resistance training remain essential.",
              body: "A GLP-1 cannot replace them.",
            },
            {
              title: "GLP-1s work best as part of a larger system.",
              body: "The most successful people use them to support better decisions, not replace them.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

/* ============================================================
 * Chapter 4 — The GLP-1 Comparison Guide
 * ============================================================ */

function GLP1ComparisonSection() {
  return (
    <Section id="glp1-comparison" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={4}
          eyebrow="THE COMPARISON"
          title="Semaglutide vs Tirzepatide vs Retatrutide"
        />
        <Prose>
          <p>
            Once people understand what GLP-1s do, the next question is almost
            always the same:
          </p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            &ldquo;Which one is best?&rdquo;
          </p>
          <p>The answer depends entirely on the person.</p>
          <p>
            The internet often treats Semaglutide, Tirzepatide, and Retatrutide
            like competing sports teams.
          </p>
          <p>
            People become emotionally attached to one and dismiss the others.
          </p>
          <p>
            A better way to think about them is as different tools designed to
            influence the same biological systems in slightly different ways.
          </p>
          <p>Each has strengths.</p>
          <p>Each has limitations.</p>
          <p>
            And each may be appropriate depending on an individual&rsquo;s
            goals, budget, tolerance, and experience.
          </p>
          <p>
            Before we compare them individually, let&rsquo;s look at the bigger
            picture.
          </p>
        </Prose>

        <SubHeading>Understanding The Receptors</SubHeading>
        <Prose>
          <p>
            One of the easiest ways to understand these compounds is to think
            about them in terms of the biological &ldquo;switches&rdquo; they
            activate.
          </p>
        </Prose>

        <ReceptorsDiagram />

        <Prose>
          <p>
            This becomes important because each medication activates a different
            combination of these pathways.
          </p>
        </Prose>

        {/* Compound deep-dives */}
        <CompoundCard
          name="Semaglutide"
          activates="GLP-1"
          brands={["Ozempic®", "Wegovy®"]}
          simplest="Semaglutide helped introduce GLP-1s to the mainstream. For many people, it was the first experience of reduced food noise, increased satiety, and sustainable weight loss. It remains one of the most widely used options available today."
          strengths={[
            {
              t: "Excellent Appetite Control",
              b: "Many users experience significant reductions in hunger and cravings.",
            },
            {
              t: "Extensive Real-World Experience",
              b: "Semaglutide has been studied extensively and used by millions of individuals.",
            },
            {
              t: "Proven Weight Loss Results",
              b: "For many people, Semaglutide produces meaningful improvements in body weight and body composition.",
            },
          ]}
          limitations={[
            {
              t: "Strong Appetite Suppression",
              b: "Some individuals find appetite suppression so significant that maintaining adequate protein intake becomes challenging.",
            },
            {
              t: "Gastrointestinal Side Effects",
              b: "Nausea, constipation, and digestive discomfort can occur, particularly during dose increases.",
            },
            {
              t: "Single Mechanism",
              b: "Semaglutide activates only the GLP-1 pathway. This isn't necessarily bad. It simply means newer compounds have expanded on the original concept.",
            },
          ]}
          bestFor={[
            "Want a proven GLP-1 option",
            "Primarily need appetite control",
            "Prefer a simpler approach",
            "Are newer to the category",
          ]}
        />

        <CompoundCard
          name="Tirzepatide"
          activates="GLP-1 + GIP"
          brands={["Mounjaro®", "Zepbound®"]}
          simplest="If Semaglutide opened the door, Tirzepatide pushed it much wider. By combining GLP-1 and GIP activity, Tirzepatide introduced a second mechanism that appears to improve metabolic outcomes for many individuals. This is why many people experience greater weight loss with Tirzepatide compared to Semaglutide."
          strengths={[
            {
              t: "Powerful Appetite Regulation",
              b: "Food noise reduction is often significant.",
            },
            {
              t: "Strong Weight Loss Outcomes",
              b: "Many individuals experience greater body weight reduction compared to earlier GLP-1 therapies.",
            },
            {
              t: "Improved Metabolic Effects",
              b: "The addition of GIP may contribute to improved glucose regulation and metabolic flexibility.",
            },
            {
              t: "Balanced Experience",
              b: "Many users report a combination of strong appetite control without feeling completely disconnected from food.",
            },
          ]}
          limitations={[
            {
              t: "Cost",
              b: "Depending on access and insurance coverage, Tirzepatide may be more expensive.",
            },
            {
              t: "Side Effects",
              b: "Gastrointestinal symptoms can still occur.",
            },
            {
              t: "Not Necessarily Better For Everyone",
              b: "Individual response varies. Some people respond exceptionally well to Semaglutide. Others respond better to Tirzepatide. Biology is rarely one-size-fits-all.",
            },
          ]}
          bestFor={[
            "Want aggressive fat loss support",
            "Have experience with GLP-1s",
            "Need more than appetite suppression alone",
            "Are focused on body composition improvements",
          ]}
        />

        <CompoundCard
          name="Retatrutide"
          activates="GLP-1 + GIP + Glucagon"
          brands={[]}
          simplest="Retatrutide builds upon the foundation established by both Semaglutide and Tirzepatide. In addition to GLP-1 and GIP activity, it also activates the glucagon receptor. This additional pathway appears to influence energy expenditure in ways not previously seen with earlier compounds. Because of this, Retatrutide has generated significant attention within the health and body composition community."
          strengths={[
            {
              t: "Comprehensive Mechanism",
              b: "Retatrutide activates all three major pathways currently being discussed in obesity medicine.",
            },
            {
              t: "Appetite Regulation",
              b: "Strong satiety support similar to what many users expect from GLP-1 therapies.",
            },
            {
              t: "Potential Energy Expenditure Benefits",
              b: "This is where much of the excitement originates. The glucagon component may support increased energy expenditure in certain individuals.",
            },
            {
              t: "Significant Body Composition Potential",
              b: "Many researchers view Retatrutide as one of the most promising developments in the category.",
            },
          ]}
          limitations={[
            {
              t: "Newer Compound",
              b: "Compared to Semaglutide and Tirzepatide, there is less real-world experience available.",
            },
            {
              t: "Titration Matters",
              b: "Because of its potency, gradual dose progression becomes particularly important.",
            },
            {
              t: "Individual Variability",
              b: "Just because a compound is newer does not automatically make it the right choice for every person.",
            },
          ]}
          bestFor={[
            "Want the most comprehensive mechanism currently available",
            "Are highly focused on body composition",
            "Have already developed healthy nutrition and training habits",
            "Understand the importance of gradual progression",
          ]}
        />

        <SubHeading>Side-By-Side Comparison</SubHeading>
        <ComparisonTable />

        <SubHeading>Which One Should You Choose?</SubHeading>
        <Prose>
          <p>Most people ask this question too early.</p>
          <p>The better question is:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            What problem am I trying to solve?
          </p>
          <p>
            If hunger and food noise are the primary challenge, several options
            may work extremely well.
          </p>
          <p>If body composition is the priority, the conversation changes.</p>
          <p>
            If metabolic health is the primary concern, the answer may change
            again.
          </p>
          <p>The best compound is not always the strongest compound.</p>
          <p>
            The best compound is the one that helps you consistently execute the
            fundamentals discussed in Chapter 2.
          </p>
          <p>Remember the four levers:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Nutrition", "Training", "Recovery", "Biology"]}
          />
        </CalloutPanel>
        <Prose>
          <p>These compounds influence biology.</p>
          <p>They do not replace the other three.</p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Semaglutide",
              body: "A proven GLP-1 option focused primarily on appetite regulation and satiety.",
            },
            {
              title: "Tirzepatide",
              body: "Combines GLP-1 and GIP activity to provide broader metabolic support and often greater weight-loss outcomes.",
            },
            {
              title: "Retatrutide",
              body: "Adds glucagon activity, creating the most comprehensive mechanism currently being discussed within body composition circles.",
            },
            {
              title: "Most Important",
              body: "No compound can replace adequate protein, resistance training, recovery, and consistency. The greatest transformations occur when biology supports the process rather than attempting to replace it.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

function ReceptorsDiagram() {
  const receptors = [
    {
      key: "GLP-1",
      title: "GLP-1",
      sub: "The primary appetite and satiety signal.",
      bullets: ["Fullness", "Hunger", "Food noise", "Blood sugar regulation"],
    },
    {
      key: "GIP",
      title: "GIP",
      sub: "Works alongside GLP-1.",
      bullets: [
        "Insulin sensitivity",
        "Energy utilization",
        "Appetite regulation",
        "Metabolic flexibility",
      ],
    },
    {
      key: "Glucagon",
      title: "Glucagon",
      sub: "The newest addition to the conversation.",
      bullets: [
        "Energy expenditure",
        "Fat mobilization",
        "Metabolic activity",
      ],
    },
  ];
  return (
    <div className="max-w-3xl mx-auto my-10 grid md:grid-cols-3 gap-4">
      {receptors.map((r) => (
        <div
          key={r.key}
          className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/20 px-3 py-1 text-xs font-bold text-[var(--accent-dark)] uppercase tracking-wider">
            {r.title}
          </div>
          <p className="mt-3 text-sm font-semibold text-[var(--primary)]">
            {r.sub}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--primary)]/50">
            Influences
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--primary)]/75">
            {r.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full bg-[var(--accent-dark)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CompoundCard({
  name,
  activates,
  brands,
  simplest,
  strengths,
  limitations,
  bestFor,
}: {
  name: string;
  activates: string;
  brands: string[];
  simplest: string;
  strengths: { t: string; b: string }[];
  limitations: { t: string; b: string }[];
  bestFor: string[];
}) {
  return (
    <div className="max-w-3xl mx-auto my-12">
      <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-7 sm:p-9">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              What It Activates · {activates}
            </p>
            <h3 className="mt-2 text-3xl sm:text-4xl font-bold">{name}</h3>
            {brands.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {brands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold"
                  >
                    {b}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-2">
              The Simplest Explanation
            </p>
            <p className="text-[var(--primary)]/80 leading-relaxed">
              {simplest}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-3">
              Strengths
            </p>
            <div className="space-y-3">
              {strengths.map((s) => (
                <div key={s.t} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--accent)]/25 text-[var(--accent-dark)] font-bold text-[10px]">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-[var(--primary)]">{s.t}</p>
                    <p className="text-sm text-[var(--primary)]/70 leading-relaxed mt-1">
                      {s.b}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-3">
              Potential Limitations
            </p>
            <div className="space-y-3">
              {limitations.map((s) => (
                <div key={s.t} className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--muted-dark)] text-[var(--primary)]/70 font-bold text-[10px]">
                    !
                  </span>
                  <div>
                    <p className="font-bold text-[var(--primary)]">{s.t}</p>
                    <p className="text-sm text-[var(--primary)]/70 leading-relaxed mt-1">
                      {s.b}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-3">
              Best For — Individuals Who:
            </p>
            <ul className="space-y-2">
              {bestFor.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-[var(--primary)]/80"
                >
                  <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { feat: "Receptors Activated", s: "GLP-1", t: "GLP-1 + GIP", r: "GLP-1 + GIP + Glucagon" },
    { feat: "Appetite Control", s: "Excellent", t: "Excellent", r: "Excellent" },
    { feat: "Food Noise Reduction", s: "High", t: "Very High", r: "Very High" },
    { feat: "Metabolic Support", s: "High", t: "Very High", r: "Very High" },
    { feat: "Energy Expenditure Support", s: "Low", t: "Moderate", r: "Highest" },
    { feat: "Research History", s: "Longest", t: "Extensive", r: "Emerging" },
    { feat: "Complexity", s: "Lowest", t: "Moderate", r: "Highest" },
    { feat: "Best For", s: "Appetite Control", t: "Fat Loss & Body Composition", r: "Advanced Body Composition Goals" },
  ];
  return (
    <div className="max-w-4xl mx-auto my-10 rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm bg-white">
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
              <th className="text-left p-4 text-xs font-bold uppercase tracking-widest">
                Feature
              </th>
              <th className="text-left p-4 text-sm font-bold">Semaglutide</th>
              <th className="text-left p-4 text-sm font-bold">Tirzepatide</th>
              <th className="text-left p-4 text-sm font-bold">Retatrutide</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.feat}
                className={i % 2 === 0 ? "bg-[var(--muted)]/40" : "bg-white"}
              >
                <td className="p-4 text-sm font-bold text-[var(--primary)]">
                  {r.feat}
                </td>
                <td className="p-4 text-sm text-[var(--primary)]/80">{r.s}</td>
                <td className="p-4 text-sm text-[var(--primary)]/80">{r.t}</td>
                <td className="p-4 text-sm text-[var(--primary)]/80">{r.r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden divide-y divide-[var(--border)]">
        {(["Semaglutide", "Tirzepatide", "Retatrutide"] as const).map(
          (col, colIdx) => (
            <div key={col} className="p-5">
              <h4 className="font-bold text-lg text-[var(--primary)] mb-3">
                {col}
              </h4>
              <dl className="space-y-2">
                {rows.map((r) => (
                  <div
                    key={r.feat}
                    className="grid grid-cols-2 gap-3 text-sm py-1"
                  >
                    <dt className="text-[var(--primary)]/60 font-medium">
                      {r.feat}
                    </dt>
                    <dd className="text-[var(--primary)] font-semibold">
                      {colIdx === 0 ? r.s : colIdx === 1 ? r.t : r.r}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Chapter 5 — Understanding Peptides
 * ============================================================ */

function PeptidesSection() {
  return (
    <Section id="peptides" className="bg-white">
      <Container>
        <ChapterHeader
          num={5}
          eyebrow="UNDERSTANDING PEPTIDES"
          title="Recovery, Growth Hormone, and Regenerative Peptides Explained Simply"
        />
        <Prose>
          <p>
            At this point, you&rsquo;ve probably heard the word
            &ldquo;peptide&rdquo; hundreds of times.
          </p>
          <p>It&rsquo;s everywhere.</p>
          <p>Podcasts.</p>
          <p>YouTube.</p>
          <p>Social media.</p>
          <p>Fitness communities.</p>
          <p>Health forums.</p>
          <p>
            The problem is that most explanations make peptides sound far more
            complicated than they actually are.
          </p>
          <p>This chapter is designed to simplify the conversation.</p>
          <p>
            By the end, you should understand the major peptide categories, what
            they do, and where they fit into a body composition strategy.
          </p>
          <p>You do not need a biology degree.</p>
          <p>You simply need a framework.</p>
        </Prose>

        <SubHeading>What Is A Peptide?</SubHeading>
        <Prose>
          <p>A peptide is simply a short chain of amino acids.</p>
          <p>Amino acids are the building blocks of protein.</p>
          <p>Your body naturally uses peptides as signaling molecules.</p>
          <p>Think of them as messages.</p>
          <p>A peptide delivers a message.</p>
          <p>Your body receives that message and responds accordingly.</p>
          <p>Some peptides influence hunger.</p>
          <p>Some influence recovery.</p>
          <p>Some influence growth hormone production.</p>
          <p>Some influence tissue repair.</p>
          <p>Some influence skin quality.</p>
          <p>The peptide itself isn&rsquo;t the outcome.</p>
          <p>The peptide is the signal that helps create the outcome.</p>
        </Prose>

        <SubHeading>The Three Major Categories</SubHeading>
        <Prose>
          <p>For simplicity, we&rsquo;ll focus on three broad categories:</p>
        </Prose>

        <PeptideCategoryGrid />

        <Prose>
          <p>
            Once you understand these categories, the individual peptides become
            much easier to understand.
          </p>
        </Prose>

        <SubHeading>Recovery Peptides</SubHeading>
        <Prose>
          <p>
            Recovery peptides are often used when the goal is supporting
            healing, recovery, and tissue repair.
          </p>
          <p>This category has become especially popular among:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Athletes",
              "Lifters",
              "Active adults",
              "Individuals recovering from injuries",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The two most commonly discussed recovery peptides are:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-2">
            BPC-157
          </p>
          <p className="text-center my-2">and</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-2">
            TB-500
          </p>
        </Prose>

        <SubHeading>BPC-157</SubHeading>
        <Prose>
          <p>BPC stands for:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Body Protection Compound.
          </p>
          <p>BPC-157 has gained attention for its potential role in supporting:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Recovery",
              "Tissue repair",
              "Tendon health",
              "Ligament health",
              "Gastrointestinal health",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Many individuals become interested in BPC after dealing with chronic
            aches, nagging injuries, or recovery challenges that seem slow to
            improve.
          </p>
          <p>A simple way to think about BPC:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            It is often discussed as a recovery-support peptide.
          </p>
        </Prose>

        <SubHeading>TB-500</SubHeading>
        <Prose>
          <p>
            TB-500 is another peptide commonly associated with recovery and
            tissue repair.
          </p>
          <p>Many people view it as complementary to BPC-157.</p>
          <p>
            While BPC often receives attention for localized recovery support,
            TB-500 is frequently discussed in the context of broader systemic
            recovery.
          </p>
          <p>People often explore TB-500 when the goal is:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Improving recovery capacity",
              "Supporting movement quality",
              "Maintaining training consistency",
            ]}
          />
        </CalloutPanel>

        <SubHeading>Why Recovery Matters</SubHeading>
        <Prose>
          <p>Remember the Four Levers from Chapter 2.</p>
          <p>Recovery is one of them.</p>
          <p>Many people focus entirely on training while ignoring recovery.</p>
          <p>The reality is that adaptation happens during recovery.</p>
          <p>Not during the workout itself.</p>
          <p>
            Recovery peptides are often explored as tools that may support this
            process.
          </p>
        </Prose>

        <SubHeading>Growth Hormone Peptides</SubHeading>
        <Prose>
          <p>This category creates more confusion than almost any other.</p>
          <p>
            Many people hear &ldquo;growth hormone&rdquo; and immediately
            imagine extreme physiques or professional bodybuilders.
          </p>
          <p>The reality is much less dramatic.</p>
          <p>
            Growth hormone is a naturally occurring hormone your body already
            produces.
          </p>
          <p>It plays a role in:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Recovery",
              "Sleep",
              "Body composition",
              "Muscle maintenance",
              "Tissue repair",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Certain peptides are designed to support your body&rsquo;s natural
            growth hormone signaling.
          </p>
          <p>The most common examples include:</p>
          <p className="text-center font-bold text-[var(--primary)] my-2">
            CJC-1295
          </p>
          <p className="text-center font-bold text-[var(--primary)] my-2">
            Ipamorelin
          </p>
          <p className="text-center font-bold text-[var(--primary)] my-2">
            Tesamorelin
          </p>
        </Prose>

        <SubHeading>CJC-1295</SubHeading>
        <Prose>
          <p>
            CJC-1295 helps stimulate the release of growth hormone from the
            pituitary gland.
          </p>
          <p>
            Think of it as increasing the signal that tells your body to release
            growth hormone.
          </p>
          <p>
            Many individuals explore CJC as part of a broader recovery and body
            composition strategy.
          </p>
        </Prose>

        <SubHeading>Ipamorelin</SubHeading>
        <Prose>
          <p>Ipamorelin works through a different pathway than CJC.</p>
          <p>
            Instead of replacing growth hormone, it helps encourage the
            body&rsquo;s natural release.
          </p>
          <p>This is one reason CJC and Ipamorelin are often discussed together.</p>
          <p>They support similar goals through different mechanisms.</p>
        </Prose>

        <SubHeading>Why CJC + Ipamorelin Are Commonly Paired</SubHeading>
        <Prose>
          <p>
            Many people compare the combination to having two people pushing the
            same swing from different sides.
          </p>
          <p>Both contribute to the same overall objective.</p>
          <p>Supporting natural growth hormone signaling.</p>
          <p>Potential benefits often discussed include:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Recovery support",
              "Improved sleep quality",
              "Body composition support",
              "Muscle retention support",
            ]}
          />
        </CalloutPanel>

        <SubHeading>Tesamorelin</SubHeading>
        <Prose>
          <p>
            Tesamorelin belongs to the same broader growth hormone category but
            has developed a reputation for its potential body composition
            applications.
          </p>
          <p>
            Many individuals become interested in Tesamorelin when their goals
            involve:
          </p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Midsection fat reduction",
              "Body recomposition",
              "Metabolic health",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            While all growth hormone peptides share similarities, each has
            unique characteristics.
          </p>
        </Prose>

        <SubHeading>Regenerative Peptides</SubHeading>
        <Prose>
          <p>The third category focuses on regeneration and tissue quality.</p>
          <p>One of the most popular examples is:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            GHK-Cu
          </p>
        </Prose>

        <SubHeading>What Is GHK-Cu?</SubHeading>
        <Prose>
          <p>GHK-Cu is a naturally occurring copper peptide.</p>
          <p>It has gained significant attention for its potential role in:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Skin quality",
              "Hair health",
              "Tissue regeneration",
              "Recovery",
              "Healthy aging",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Many people first discover GHK through discussions around skin and
            cosmetic benefits.
          </p>
          <p>
            However, interest has expanded significantly as research into
            regenerative medicine has grown.
          </p>
        </Prose>

        <SubHeading>Why People Use GHK-Cu</SubHeading>
        <Prose>
          <p>Many individuals become interested in GHK-Cu because they want to support:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Healthier skin",
              "Improved appearance",
              "Recovery processes",
              "Long-term tissue quality",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Unlike some peptides that are primarily associated with body
            composition, GHK often attracts people interested in overall
            vitality and aging well.
          </p>
        </Prose>

        <SubHeading>Where Peptides Fit Into The Roadmap</SubHeading>
        <Prose>
          <p>This is the most important part of the chapter.</p>
          <p>
            Many people discover peptides and immediately assume they are the
            missing piece.
          </p>
          <p>Sometimes they are helpful.</p>
          <p>Sometimes they are not.</p>
          <p>The answer depends on the foundation.</p>
          <p>A peptide cannot replace:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Protein intake",
              "Resistance training",
              "Recovery",
              "Sleep",
              "Consistency",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>It can only support them.</p>
          <p>This is why we continually return to the Four Levers.</p>
          <p>Nutrition</p>
          <p>Training</p>
          <p>Recovery</p>
          <p>Biology</p>
          <p>Peptides influence one or more of these levers.</p>
          <p>They do not replace them.</p>
          <p>
            The strongest body composition outcomes occur when the fundamentals
            are already moving in the right direction.
          </p>
        </Prose>

        <SubHeading>A Simpler Way To Think About It</SubHeading>
        <Prose>
          <p>If you&rsquo;re feeling overwhelmed by all the names, use this framework:</p>
        </Prose>
        <CalloutPanel variant="muted" title="Recovery Peptides">
          <p>Help support recovery.</p>
          <p className="font-semibold mt-2">Examples:</p>
          <BulletList items={["BPC-157", "TB-500"]} />
        </CalloutPanel>
        <CalloutPanel variant="muted" title="Growth Hormone Peptides">
          <p>Support natural growth hormone signaling.</p>
          <p className="font-semibold mt-2">Examples:</p>
          <BulletList items={["CJC-1295", "Ipamorelin", "Tesamorelin"]} />
        </CalloutPanel>
        <CalloutPanel variant="muted" title="Regenerative Peptides">
          <p>Support tissue quality and regeneration.</p>
          <p className="font-semibold mt-2">Examples:</p>
          <BulletList items={["GHK-Cu"]} />
        </CalloutPanel>
        <Prose>
          <p>That&rsquo;s all you need to remember.</p>
          <p>Everything else is detail.</p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Peptides Are Signals",
              body: "They help communicate messages that influence biological processes.",
            },
            {
              title: "Recovery Peptides",
              body: "Often explored for recovery and tissue repair support.",
            },
            {
              title: "Growth Hormone Peptides",
              body: "Support the body's natural growth hormone pathways.",
            },
            {
              title: "Regenerative Peptides",
              body: "Often associated with skin, tissue, and healthy aging support.",
            },
            {
              title: "Most Important",
              body: "Peptides work best when they support a strong foundation. Nutrition. Training. Recovery. Consistency. Those remain the primary drivers of long-term body composition success.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

function PeptideCategoryGrid() {
  const cats = [
    {
      label: "Recovery Peptides",
      body: "Support healing and recovery processes.",
      examples: ["BPC-157", "TB-500"],
      icon: (
        <path d="M4.5 12.75l6 6 9-13.5" />
      ),
    },
    {
      label: "Growth Hormone Peptides",
      body: "Support the body's natural growth hormone signaling.",
      examples: ["CJC-1295", "Ipamorelin", "Tesamorelin"],
      icon: <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
    },
    {
      label: "Regenerative Peptides",
      body: "Support tissue quality, skin health, and cellular repair.",
      examples: ["GHK-Cu"],
      icon: (
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      ),
    },
  ];
  return (
    <div className="max-w-4xl mx-auto my-10 grid md:grid-cols-3 gap-5">
      {cats.map((c) => (
        <div
          key={c.label}
          className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent)]/15 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[var(--accent-dark)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {c.icon}
            </svg>
          </div>
          <h4 className="mt-4 text-lg font-bold text-[var(--primary)]">
            {c.label}
          </h4>
          <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
            {c.body}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {c.examples.map((e) => (
              <span
                key={e}
                className="text-[11px] font-semibold tracking-wide uppercase rounded-full bg-[var(--muted)] px-2 py-1 text-[var(--primary)]/70 border border-[var(--border)]"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
 * Chapter 6 — Building Lean Muscle While Using GLP-1s
 * ============================================================ */

function MuscleGLP1Section() {
  return (
    <Section id="muscle-glp1" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={6}
          eyebrow="MUSCLE PRESERVATION"
          title="Building Lean Muscle While Using GLP-1s"
        />
        <Prose>
          <p>
            One of the biggest misconceptions about body composition is the
            belief that losing weight automatically improves how your body looks.
          </p>
          <p>Sometimes it does.</p>
          <p>Sometimes it doesn&rsquo;t.</p>
          <p>Most people don&rsquo;t actually want to weigh less.</p>
          <p>They want to look leaner.</p>
          <p>Stronger.</p>
          <p>More athletic.</p>
          <p>More confident.</p>
          <p>They want their clothes to fit differently.</p>
          <p>They want to feel comfortable in photos.</p>
          <p>
            They want to look in the mirror and recognize the person staring
            back at them.
          </p>
          <p>That&rsquo;s why muscle matters.</p>
          <p>Because muscle is what gives the body shape.</p>
          <p>
            A person can lose 30 pounds and still feel disappointed with their
            appearance if too much muscle disappears along the way.
          </p>
          <p>The goal isn&rsquo;t simply weight loss.</p>
          <p>The goal is body recomposition.</p>
          <p>
            Reducing body fat while preserving as much lean tissue as possible.
          </p>
        </Prose>

        <SubHeading>Why Muscle Loss Happens</SubHeading>
        <Prose>
          <p>When most people begin a fat loss phase, they focus on one thing:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Eating less.
          </p>
          <p>
            And while a calorie deficit is necessary for fat loss, it creates a
            challenge.
          </p>
          <p>
            Your body doesn&rsquo;t know you&rsquo;re trying to improve your
            physique.
          </p>
          <p>It only knows energy availability has decreased.</p>
          <p>In response, it begins adapting.</p>
          <p>Some of those adaptations are helpful.</p>
          <p>Some are not.</p>
          <p>Without the right signals, your body may reduce:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Body fat", "Water", "Glycogen", "Muscle tissue"]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            This is why two people can lose the exact same amount of weight and
            end up looking completely different.
          </p>
          <p>One loses primarily fat.</p>
          <p>The other loses fat and muscle.</p>
          <p>The scale reports the same number.</p>
          <p>The mirror tells a different story.</p>
        </Prose>

        <SubHeading>The Three Signals That Preserve Muscle</SubHeading>
        <Prose>
          <p>Fortunately, preserving muscle isn&rsquo;t complicated.</p>
          <p>
            It comes down to sending your body three very clear messages.
          </p>
        </Prose>

        <ThreeSignalsGrid />

        <SubHeading>Signal #1: Resistance Training</SubHeading>
        <Prose>
          <p>Muscle exists because your body believes it&rsquo;s useful.</p>
          <p>
            The moment your body decides it no longer needs that muscle,
            maintaining it becomes less important.
          </p>
          <p>Resistance training solves this problem.</p>
          <p>Every workout sends a message:</p>
          <p className="font-semibold text-[var(--primary)] text-center my-2">
            &ldquo;This tissue is still necessary.&rdquo;
          </p>
          <p>Your body responds accordingly.</p>
          <p>
            This is why resistance training remains one of the most important
            activities during any fat loss phase.
          </p>
          <p>Not because it burns massive calories.</p>
          <p>Because it protects muscle.</p>
        </Prose>

        <SubHeading>The Goal Is Not To Destroy Yourself</SubHeading>
        <Prose>
          <p>Many people assume they need six intense workouts per week.</p>
          <p>They don&rsquo;t.</p>
          <p>Consistency beats intensity.</p>
          <p>For most people:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            3-4 strength sessions weekly
          </p>
          <p>is more than enough.</p>
          <p>Focus on:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Squats",
              "Deadlifts",
              "Rows",
              "Presses",
              "Pull-downs",
              "Lunges",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>Simple movements.</p>
          <p>Performed consistently.</p>
          <p>Over time.</p>
        </Prose>

        <SubHeading>Signal #2: Protein</SubHeading>
        <Prose>
          <p>
            Protein is the raw material your body uses to maintain and build
            muscle tissue.
          </p>
          <p>
            Without adequate protein, preserving muscle becomes significantly
            harder.
          </p>
          <p>This becomes especially important when using GLP-1s.</p>
          <p>Because appetite often decreases.</p>
          <p>People eat less.</p>
          <p>Sometimes much less.</p>
          <p>
            The problem is that protein intake often falls right alongside
            calorie intake.
          </p>
          <p>
            This creates one of the most common mistakes seen among GLP-1 users.
          </p>
          <p>Weight decreases.</p>
          <p>Protein decreases.</p>
          <p>Muscle decreases.</p>
          <p>The person becomes smaller but not necessarily leaner.</p>
        </Prose>

        <SubHeading>Your Daily Protein Target</SubHeading>
        <Prose>
          <p>A simple rule:</p>
          <p className="font-semibold text-[var(--primary)]">Aim for approximately:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            0.8-1.0 grams of protein per pound of goal body weight
          </p>
          <p>Examples:</p>
        </Prose>
        <ProteinTargetCards />
        <Prose>
          <p>This doesn&rsquo;t need to be perfect.</p>
          <p>The goal is consistency.</p>
          <p>Not perfection.</p>
        </Prose>

        <SubHeading>The Protein Priority Rule</SubHeading>
        <Prose>
          <p>When appetite is low, prioritize protein first.</p>
          <p>Before worrying about:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Carbs", "Fats", "Supplements", "Meal timing"]}
          />
        </CalloutPanel>
        <Prose>
          <p>Ask:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Have I hit my protein goal?
          </p>
          <p>
            That single question solves a surprising number of body composition
            problems.
          </p>
        </Prose>

        <SubHeading>Signal #3: Recovery</SubHeading>
        <Prose>
          <p>Many people underestimate recovery because they can&rsquo;t see it.</p>
          <p>They focus on workouts.</p>
          <p>They focus on meals.</p>
          <p>Recovery gets ignored.</p>
          <p>Yet recovery is where adaptation occurs.</p>
          <p>Poor recovery often leads to:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Increased hunger",
              "Increased cravings",
              "Reduced performance",
              "Reduced muscle retention",
              "Poor decision-making",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Your body cannot perform at a high level if recovery remains
            chronically neglected.
          </p>
        </Prose>

        <SubHeading>Sleep: The Hidden Variable</SubHeading>
        <Prose>
          <p>
            If there is one habit that quietly influences nearly everything,
            it&rsquo;s sleep.
          </p>
          <p>Poor sleep impacts:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Hunger hormones",
              "Appetite regulation",
              "Recovery capacity",
              "Energy levels",
              "Training performance",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Many people attempt to solve sleep-related problems with more
            supplements, more caffeine, or more motivation.
          </p>
          <p>Sleep remains one of the highest-return investments available.</p>
          <p>Aim for:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            7-9 hours nightly
          </p>
          <p>as often as realistically possible.</p>
        </Prose>

        <SubHeading>Why GLP-1s Can Actually Help Muscle Building</SubHeading>
        <Prose>
          <p>This surprises many people.</p>
          <p>Most discussions focus entirely on muscle loss.</p>
          <p>
            Yet there are situations where GLP-1s can indirectly support
            muscle-building efforts.
          </p>
          <p>Here&rsquo;s why.</p>
          <p>Many people spend years trapped in a cycle of:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Overeating",
              "Under-eating",
              "Starting over",
              "Falling off track",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The inconsistency prevents progress.</p>
          <p>When food noise decreases, adherence often improves.</p>
          <p>When adherence improves, people begin:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Training consistently",
              "Hitting protein targets",
              "Sleeping better",
              "Following a plan",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The medication didn&rsquo;t build the muscle.</p>
          <p>
            The improved consistency created the environment where muscle growth
            became possible.
          </p>
        </Prose>

        <SubHeading>The Biggest Mistakes To Avoid</SubHeading>

        <div className="max-w-3xl mx-auto my-8 space-y-4">
          {[
            {
              n: 1,
              t: "Treating a GLP-1 as the entire plan.",
              b: "It's one tool. Not the entire strategy.",
            },
            {
              n: 2,
              t: "Ignoring protein.",
              b: "This is arguably the most common mistake.",
            },
            {
              n: 3,
              t: "Skipping resistance training.",
              b: "Walking is excellent. Walking is not a substitute for resistance training.",
            },
            {
              n: 4,
              t: "Chasing scale weight.",
              b: "Body composition matters more than body weight. The mirror often tells a more useful story than the scale.",
            },
            {
              n: 5,
              t: "Trying to lose weight as fast as possible.",
              b: "Faster is not always better. The goal is creating a body you can maintain. Not winning a race.",
            },
          ].map((m) => (
            <div
              key={m.n}
              className="rounded-2xl bg-white border border-[var(--border)] shadow-sm p-5 flex items-start gap-4"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-red-50 border border-red-200 text-red-600 font-bold text-base flex items-center justify-center">
                #{m.n}
              </span>
              <div>
                <p className="font-bold text-[var(--primary)]">{m.t}</p>
                <p className="mt-1 text-sm text-[var(--primary)]/70 leading-relaxed">
                  {m.b}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>The Body Composition Formula</SubHeading>
        <Prose>
          <p>If you remember nothing else from this chapter, remember this:</p>
        </Prose>

        <FormulaCard
          parts={["Resistance Training", "Adequate Protein", "Quality Recovery", "Consistency"]}
          result="The highest probability of preserving muscle during fat loss."
          footer={["The formula isn't exciting.", "It isn't trendy.", "It works."]}
        />

        <KeyTakeaways
          items={[
            {
              title: "Muscle Gives The Body Shape",
              body: "The goal is not simply becoming lighter. The goal is improving body composition.",
            },
            {
              title: "Resistance Training Protects Muscle",
              body: "Aim for 3-4 strength sessions each week.",
            },
            {
              title: "Protein Matters",
              body: "A good target is approximately 0.8-1.0 grams per pound of goal body weight.",
            },
            {
              title: "Recovery Is Essential",
              body: "Sleep influences nearly every aspect of body composition.",
            },
            {
              title: "GLP-1s Are A Tool",
              body: "They often improve adherence by reducing food noise and making consistency easier.",
            },
            {
              title: "Most Important",
              body: "The people who achieve the best results rarely rely on a single strategy. They build a system: Training. Protein. Recovery. Consistency. Those fundamentals continue working long after any medication or protocol ends.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

function ThreeSignalsGrid() {
  return (
    <div className="max-w-3xl mx-auto my-8 grid sm:grid-cols-3 gap-4">
      {[
        { n: 1, label: "This Muscle Is Still Needed" },
        { n: 2, label: "Building Materials Are Available" },
        { n: 3, label: "Recovery Resources Exist" },
      ].map((s) => (
        <div
          key={s.n}
          className="rounded-2xl bg-white border border-[var(--border)] p-5 text-center shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
            Signal #{s.n}
          </p>
          <p className="mt-3 font-bold text-[var(--primary)] leading-snug">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProteinTargetCards() {
  const examples = [
    { weight: "150 lbs", range: "120-150g daily" },
    { weight: "200 lbs", range: "160-200g daily" },
    { weight: "250 lbs", range: "200-250g daily" },
  ];
  return (
    <div className="max-w-3xl mx-auto my-6 grid sm:grid-cols-3 gap-3">
      {examples.map((e) => (
        <div
          key={e.weight}
          className="rounded-2xl bg-white border border-[var(--border)] p-5 text-center shadow-sm"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]/50">
            Goal Weight
          </p>
          <p className="mt-1 text-xl font-bold text-[var(--primary)] tabular-nums">
            {e.weight}
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
            Protein Target
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--primary)] tabular-nums">
            {e.range}
          </p>
        </div>
      ))}
    </div>
  );
}

function FormulaCard({
  parts,
  result,
  footer,
}: {
  parts: string[];
  result: string;
  footer: string[];
}) {
  return (
    <div className="max-w-3xl mx-auto my-10 rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-8 sm:p-10 relative overflow-hidden shadow-xl">
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="relative text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {parts.map((p, i) => (
            <span key={p} className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
                {p}
              </span>
              {i < parts.length - 1 ? (
                <span className="text-[var(--accent)] text-xl font-bold">+</span>
              ) : null}
            </span>
          ))}
        </div>
        <p className="mt-5 text-[var(--accent)] text-3xl font-bold">=</p>
        <p className="mt-3 text-lg font-bold text-white leading-relaxed max-w-2xl mx-auto">
          {result}
        </p>
        <div className="mt-6 space-y-1 text-sm text-white/70">
          {footer.map((f) => (
            <p key={f}>{f}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Chapter 7 — Metabolic Typing
 * ============================================================ */

function MetabolicTypingSection() {
  return (
    <Section id="metabolic-typing" className="bg-white">
      <Container>
        <ChapterHeader
          num={7}
          eyebrow="METABOLIC TYPING"
          title="Why The Best Diet For Your Friend Might Be The Worst Diet For You"
        />
        <Prose>
          <p>
            One of the most frustrating experiences in health and fitness is
            watching someone get incredible results from a nutrition plan that
            makes you feel terrible.
          </p>
          <p>Your friend goes low-carb and feels amazing.</p>
          <p>You try it and feel exhausted.</p>
          <p>Someone else thrives on oatmeal, fruit, potatoes, and rice.</p>
          <p>You follow the same approach and feel hungry all day.</p>
          <p>Most people assume one of two things:</p>
          <p>Either the diet works.</p>
          <p>Or it doesn&rsquo;t.</p>
          <p>In reality, the answer is usually more nuanced.</p>
          <p>Different people often process food differently.</p>
          <p>
            Different bodies respond differently to protein, carbohydrates, and
            fats.
          </p>
          <p>This is where Metabolic Typing becomes useful.</p>
          <p>Not because it tells you exactly what to eat forever.</p>
          <p>
            Because it helps you begin paying attention to how your body
            actually functions.
          </p>
        </Prose>

        <SubHeading>The Goal Is Self-Awareness</SubHeading>
        <Prose>
          <p>Before we go further, let&rsquo;s establish something important.</p>
          <p>Metabolic Typing is not a religion.</p>
          <p>It&rsquo;s not a rigid set of rules.</p>
          <p>It&rsquo;s not a diet you must follow perfectly.</p>
          <p>It&rsquo;s simply a framework for understanding your body&rsquo;s natural tendencies.</p>
          <p>The purpose is to help you answer questions like:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Why do certain meals leave me energized while others leave me tired?",
              "Why do I feel satisfied after some foods but not others?",
              "Why can two people eat the exact same meal and have completely different experiences?",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The more awareness you develop, the easier nutrition becomes.</p>
        </Prose>

        <SubHeading>The Three Metabolic Types</SubHeading>
        <Prose>
          <p>For simplicity, we categorize people into three broad metabolic types:</p>
        </Prose>

        <MetabolicTypesGrid />

        <Prose>
          <p>Most people will naturally lean toward one of these categories.</p>
          <p>Some people sit directly between them.</p>
          <p>Others shift over time as their health improves.</p>
          <p>Remember:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            These are tendencies. Not permanent labels.
          </p>
        </Prose>

        <SubHeading>Polar Types</SubHeading>
        <Prose>
          <p>
            Polar Types generally feel best with a higher proportion of protein
            and healthy fats.
          </p>
          <p>
            According to the original Metabolic Typing framework, Polar Types
            often report:
          </p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Strong appetites",
              "Good digestion of protein and fats",
              "Better energy with higher-protein meals",
              "Better sleep when protein and fat are included later in the day",
              "Greater tendency toward muscle and strength development",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Many Polar Types describe themselves as people who could happily eat
            steak, eggs, salmon, burgers, or heavier meals every day.
          </p>
          <p>
            When they consume too many carbohydrates without adequate protein
            and fat, they often experience:
          </p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Energy crashes",
              "Increased hunger",
              "Brain fog",
              "Poor concentration",
              "Unstable energy levels",
            ]}
          />
        </CalloutPanel>

        <SubHeading>Suggested Polar Macronutrient Split</SubHeading>
        <Prose>
          <p>The original framework recommends approximately:</p>
        </Prose>
        <MacroSplitVisualization
          label="Polar Type"
          macros={{ protein: 45, carbs: 35, fat: 20 }}
        />
        <Prose>
          <p>Again, perfection isn&rsquo;t the goal.</p>
          <p>The goal is direction.</p>
        </Prose>

        <SubHeading>Equatorial Types</SubHeading>
        <Prose>
          <p>Equatorial Types tend to sit on the opposite end of the spectrum.</p>
          <p>
            These individuals frequently perform better with a larger proportion
            of quality carbohydrates.
          </p>
          <p>Many Equatorial Types naturally gravitate toward:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Fruit", "Potatoes", "Rice", "Vegetables", "Whole grains"]}
          />
        </CalloutPanel>
        <Prose>
          <p>They often prefer lighter proteins such as:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Chicken breast", "Turkey breast", "White fish"]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            The original framework suggests that Equatorial Types generally
            metabolize carbohydrates more efficiently and may not feel their
            best on extremely high-fat, high-protein approaches.
          </p>
          <p>Many also notice they naturally prefer fewer meals throughout the day.</p>
        </Prose>

        <SubHeading>Suggested Equatorial Macronutrient Split</SubHeading>
        <Prose>
          <p>The original recommendation is approximately:</p>
        </Prose>
        <MacroSplitVisualization
          label="Equatorial Type"
          macros={{ protein: 20, carbs: 70, fat: 10 }}
        />
        <Prose>
          <p>
            For many active individuals today, this can be adjusted slightly
            higher in protein while still preserving the overall philosophy.
          </p>
        </Prose>

        <SubHeading>Variable Types</SubHeading>
        <Prose>
          <p>Variable Types sit somewhere in the middle.</p>
          <p>They&rsquo;re often the easiest to feed.</p>
          <p>They can perform well with a more balanced nutritional approach.</p>
          <p>
            According to the framework, Variable Types may shift between Polar
            and Equatorial tendencies depending on:
          </p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Activity level",
              "Stress",
              "Recovery",
              "Environment",
              "Training demands",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            A Variable Type might thrive on higher carbohydrates during a
            demanding training phase and naturally crave more protein and fats
            during periods of lower activity.
          </p>
          <p>This flexibility is often a strength.</p>
        </Prose>

        <SubHeading>Suggested Variable Macronutrient Split</SubHeading>
        <Prose>
          <p>The original recommendation is approximately:</p>
        </Prose>
        <MacroSplitVisualization
          label="Variable Type"
          macros={{ protein: 40, carbs: 50, fat: 10 }}
        />
        <Prose>
          <p>Many people naturally land somewhere close to this range.</p>
        </Prose>

        <SubHeading>How To Determine Your Type</SubHeading>
        <Prose>
          <p>Included with this Blueprint is the Metabolic Type Quiz.</p>
          <p>The quiz evaluates:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Hunger patterns",
              "Sleep quality",
              "Food preferences",
              "Recovery patterns",
              "Energy responses",
              "Natural cravings",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>After completing the assessment, you&rsquo;ll receive a starting point for experimentation.</p>
          <p>The key word is:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Starting Point
          </p>
          <p>The goal isn&rsquo;t to blindly follow the result.</p>
          <p>The goal is to begin observing your own responses.</p>
        </Prose>

        <div className="max-w-2xl mx-auto my-8 text-center">
          <a
            href="#quiz"
            className="btn-accent inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold"
          >
            Take The Quiz Now →
          </a>
        </div>

        <SubHeading>Why This Matters For Body Composition</SubHeading>
        <Prose>
          <p>Most people spend years fighting their biology.</p>
          <p>They force themselves into nutrition plans they hate.</p>
          <p>They try to eat foods they don&rsquo;t enjoy.</p>
          <p>They spend all day hungry.</p>
          <p>Then they wonder why they can&rsquo;t stay consistent.</p>
          <p>
            Consistency becomes much easier when your nutrition plan aligns
            with your natural tendencies.
          </p>
          <p>The best nutrition strategy is rarely the one that looks perfect on paper.</p>
          <p>It&rsquo;s the one you can realistically follow for months and years.</p>
        </Prose>

        <SubHeading>A Simple Experiment</SubHeading>
        <Prose>
          <p>For the next two weeks, start paying attention to a few things:</p>
          <p className="font-semibold text-[var(--primary)] mt-3">After meals, ask yourself:</p>
          <p>How is my energy?</p>
          <p>How is my focus?</p>
          <p>How is my hunger?</p>
          <p>How is my mood?</p>
          <p>How long until I want to eat again?</p>
          <p>
            These questions will often teach you more than any calorie
            calculator ever will.
          </p>
        </Prose>

        <SubHeading>The Most Important Rule</SubHeading>
        <Prose>
          <p>There is no food that is permanently off limits.</p>
          <p>
            This is one of the most important principles from the original
            Metabolic Typing system.
          </p>
          <p>The recommendations are not designed to create restriction.</p>
          <p>They&rsquo;re designed to create awareness.</p>
          <p>As your health improves, your responses may change.</p>
          <p>Your metabolic type may even shift over time.</p>
          <p>The goal isn&rsquo;t finding the perfect diet.</p>
          <p>The goal is developing a better relationship with your own biology.</p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Different People Often Thrive On Different Nutrition Strategies",
              body: "The same diet can produce dramatically different results in different individuals.",
            },
            {
              title: "Metabolic Typing Creates Awareness",
              body: "It helps explain why certain foods energize you while others leave you feeling sluggish.",
            },
            {
              title: "There Are Three Primary Types",
              body: "Polar, Variable, Equatorial.",
            },
            {
              title: "The Quiz Is A Starting Point",
              body: "Use it as a guide, not a rigid set of rules.",
            },
            {
              title: "Consistency Matters Most",
              body: "The best nutrition plan is the one you can realistically follow while feeling energized, satisfied, and healthy.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

function MetabolicTypesGrid() {
  const types = [
    {
      name: "Polar Type",
      tag: "Higher protein & fat",
      desc: "Strong appetite, builds muscle relatively easily, energy crashes on too many carbs alone.",
    },
    {
      name: "Variable Type",
      tag: "Balanced flexibility",
      desc: "Adapts well to multiple approaches, shifts with stress, activity, and recovery demands.",
    },
    {
      name: "Equatorial Type",
      tag: "Higher carbs, lighter proteins",
      desc: "Thrives on fruit, rice, oats, vegetables; can comfortably go longer between meals.",
    },
  ];
  return (
    <div className="max-w-4xl mx-auto my-10 grid md:grid-cols-3 gap-4">
      {types.map((t) => (
        <div
          key={t.name}
          className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 px-3 py-1 text-xs font-bold text-[var(--accent-dark)] uppercase tracking-wider">
            {t.tag}
          </div>
          <h4 className="mt-4 text-xl font-bold text-[var(--primary)]">{t.name}</h4>
          <p className="mt-3 text-sm text-[var(--primary)]/70 leading-relaxed">
            {t.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

function MacroSplitVisualization({
  label,
  macros,
}: {
  label: string;
  macros: { protein: number; carbs: number; fat: number };
}) {
  const total = macros.protein + macros.carbs + macros.fat;
  return (
    <div className="max-w-2xl mx-auto my-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm p-5">
      <p className="text-center text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-4">
        {label} Starting Split
      </p>
      <div className="flex h-12 rounded-xl overflow-hidden border border-[var(--border)]">
        <div
          className="bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold"
          style={{ width: `${(macros.protein / total) * 100}%` }}
        >
          {macros.protein}%
        </div>
        <div
          className="bg-[var(--accent-dark)] flex items-center justify-center text-white text-sm font-bold"
          style={{ width: `${(macros.carbs / total) * 100}%` }}
        >
          {macros.carbs}%
        </div>
        <div
          className="bg-[var(--accent-light)] flex items-center justify-center text-[var(--primary)] text-sm font-bold"
          style={{ width: `${(macros.fat / total) * 100}%` }}
        >
          {macros.fat}%
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[var(--primary)]/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--primary)]" /> Protein
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--accent-dark)]" /> Carbohydrates
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--accent-light)]" /> Fat
        </span>
      </div>
    </div>
  );
}

/* ============================================================
 * Chapter 8 — Protein
 * ============================================================ */

function ProteinSection() {
  return (
    <Section id="protein" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={8}
          eyebrow="PROTEIN"
          title="The Most Important Number You're Probably Ignoring"
        />
        <Prose>
          <p>
            If I could only track one nutrition variable with someone trying to
            lose fat, improve body composition, and preserve muscle, it would be
            protein.
          </p>
          <p>Not calories.</p>
          <p>Not carbs.</p>
          <p>Not meal timing.</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Protein.
          </p>
          <p>Most people dramatically underestimate how important it is.</p>
          <p>
            And for people using GLP-1s, the consequences of getting it wrong
            become even bigger.
          </p>
        </Prose>

        <SubHeading>Why Protein Matters</SubHeading>
        <Prose>
          <p>Your body is constantly breaking down and rebuilding tissue.</p>
          <p>Muscle tissue.</p>
          <p>Connective tissue.</p>
          <p>Enzymes.</p>
          <p>Hormones.</p>
          <p>Recovery systems.</p>
          <p>Protein provides the raw materials that make all of this possible.</p>
          <p>
            Without enough protein, your body becomes much less efficient at
            repairing, recovering, and maintaining lean tissue.
          </p>
          <p>
            When body fat decreases, your body doesn&rsquo;t automatically know
            that you&rsquo;d prefer to lose fat instead of muscle.
          </p>
          <p>Your body simply responds to the environment you create.</p>
          <p>
            Adequate protein is one of the strongest signals you can provide
            that says:
          </p>
          <p className="text-lg font-bold text-[var(--primary)] text-center my-3">
            &ldquo;Keep the muscle. Use the stored energy.&rdquo;
          </p>
        </Prose>

        <SubHeading>The Hidden Risk of Rapid Weight Loss</SubHeading>
        <Prose>
          <p>Many people celebrate seeing the scale move quickly.</p>
          <p>And sometimes that&rsquo;s appropriate.</p>
          <p>
            But losing weight and improving body composition are not always the
            same thing.
          </p>
          <p>A person can lose 20 pounds and still be disappointed with how they look.</p>
          <p>Why?</p>
          <p>Because the quality of the weight lost matters.</p>
          <p>The goal is not simply becoming lighter.</p>
          <p>The goal is becoming leaner.</p>
          <p>
            That requires preserving as much muscle as possible while reducing
            body fat.
          </p>
          <p>Protein plays a massive role in making that happen.</p>
        </Prose>

        <SubHeading>Why GLP-1 Users Need More Protein Than They Think</SubHeading>
        <Prose>
          <p>One of the biggest benefits of GLP-1 medications is appetite control.</p>
          <p>Unfortunately, that benefit can sometimes create a new problem.</p>
          <p>People simply stop eating enough.</p>
          <p>They skip meals.</p>
          <p>Their daily calories drop dramatically.</p>
          <p>Their protein intake collapses.</p>
          <p>
            A person who was eating 150 grams of protein before starting a GLP-1
            may suddenly find themselves eating 60 or 70 grams per day without
            realizing it.
          </p>
          <p>Over time, this can lead to:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Reduced recovery",
              "Loss of lean muscle tissue",
              "Lower training performance",
              "Increased fatigue",
              "Worse body composition outcomes",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The medication is helping control appetite.</p>
          <p>
            Your job is making sure nutrition quality stays high while appetite
            is lower.
          </p>
        </Prose>

        <SubHeading>Protein Helps With More Than Muscle</SubHeading>
        <Prose>
          <p>Most people think of protein as a muscle-building nutrient.</p>
          <p>It does much more than that.</p>
          <p>Adequate protein intake can help support:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Satiety",
              "Recovery",
              "Stable energy",
              "Blood sugar regulation",
              "Training performance",
              "Lean muscle retention",
              "Long-term body composition success",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Many people notice they feel better, recover faster, and experience
            fewer cravings once they consistently hit their protein target.
          </p>
        </Prose>

        <SubHeading>How Much Protein Do You Actually Need?</SubHeading>
        <Prose>
          <p>There are countless formulas online.</p>
          <p>Some are overly complicated.</p>
          <p>
            For most people focused on body composition, a simple approach works
            extremely well.
          </p>
          <p>Aim for:</p>
          <p className="text-2xl font-bold text-[var(--primary)] text-center my-3">
            0.8–1.0 grams of protein per pound of goal body weight
          </p>
          <p>Examples:</p>
        </Prose>

        <div className="max-w-3xl mx-auto my-6 grid sm:grid-cols-3 gap-3">
          {[
            { goal: "150 lbs", target: "120–150 g/day" },
            { goal: "180 lbs", target: "145–180 g/day" },
            { goal: "200 lbs", target: "160–200 g/day" },
          ].map((row) => (
            <div
              key={row.goal}
              className="rounded-2xl bg-white border border-[var(--border)] p-5 text-center shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]/50">
                Goal Weight
              </p>
              <p className="mt-1 text-xl font-bold text-[var(--primary)] tabular-nums">
                {row.goal}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                Daily Target
              </p>
              <p className="mt-1 text-base font-semibold text-[var(--primary)] tabular-nums">
                {row.target}
              </p>
            </div>
          ))}
        </div>

        <Prose>
          <p>You do not need to hit the number perfectly every day.</p>
          <p>Consistency matters far more than perfection.</p>
        </Prose>

        <SubHeading>What If You Aren&rsquo;t Hungry?</SubHeading>
        <Prose>
          <p>This is one of the most common questions from GLP-1 users.</p>
          <p>The answer is simple:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Prioritize protein first.
          </p>
          <p>Before snacks.</p>
          <p>Before treats.</p>
          <p>Before convenience foods.</p>
          <p>Before &ldquo;whatever sounds good.&rdquo;</p>
          <p>Build meals around protein.</p>
          <p>
            Many people find it easier to spread protein throughout the day
            rather than trying to consume large amounts at once.
          </p>
          <p>Examples include:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Greek yogurt",
              "Eggs",
              "Chicken",
              "Turkey",
              "Lean beef",
              "Fish",
              "Cottage cheese",
              "Protein shakes",
              "Protein-rich snacks",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Small amounts consumed consistently often work better than forcing
            huge meals.
          </p>
        </Prose>

        <SubHeading>The Goal Isn&rsquo;t Perfection</SubHeading>
        <Prose>
          <p>You do not need a food scale attached to your hand.</p>
          <p>You do not need to obsess over every gram.</p>
          <p>You do not need to eat like a professional bodybuilder.</p>
          <p>
            You simply need to understand that protein is one of the
            highest-return investments you can make for your body composition
            goals.
          </p>
          <p>Most people spend months looking for advanced strategies.</p>
          <p>Meanwhile, their protein intake is inconsistent every single day.</p>
          <p>Master the fundamentals first.</p>
          <p>They create the majority of the results.</p>
        </Prose>

        <SubHeading>Your Next Step</SubHeading>
        <Prose>
          <p>
            Use the Protein Calculator included inside this Blueprint to
            determine your personal protein target.
          </p>
          <p>Write the number down.</p>
          <p>Keep it somewhere visible.</p>
          <p>Then focus on hitting that target consistently for the next 30 days.</p>
          <p>
            You may be surprised how much progress comes from improving a
            single variable.
          </p>
        </Prose>

        <div className="max-w-2xl mx-auto my-8 text-center">
          <a
            href="#calculator"
            className="btn-accent inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold"
          >
            Calculate Your Target →
          </a>
        </div>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Chapter 9 — The Four Levers (round 2)
 * ============================================================ */

function FourLeversSection() {
  return (
    <Section id="four-levers" className="bg-white">
      <Container>
        <ChapterHeader
          num={9}
          eyebrow="THE SYSTEM"
          title="The Four Levers Of Body Composition"
        />
        <Prose>
          <p>Most people don&rsquo;t fail because they&rsquo;re lazy.</p>
          <p>They fail because they&rsquo;re trying to solve five different problems at the same time.</p>
          <p>They want to lose fat.</p>
          <p>Build muscle.</p>
          <p>Improve energy.</p>
          <p>Fix their nutrition.</p>
          <p>Optimize supplements.</p>
          <p>Improve recovery.</p>
          <p>Learn peptides.</p>
          <p>Create a workout plan.</p>
          <p>Track progress.</p>
          <p>And they attempt to do all of it immediately.</p>
          <p>A few weeks later they feel overwhelmed.</p>
          <p>Then they stop.</p>
          <p>The goal of this chapter is simple:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Show you the few variables that matter most.
          </p>
          <p>Because body composition is far less complicated than the internet makes it seem.</p>
        </Prose>

        <SubHeading>The Four Levers That Drive Nearly Every Transformation</SubHeading>
        <Prose>
          <p>After working with thousands of people over the years, I&rsquo;ve noticed something interesting.</p>
          <p>The people who succeed usually focus on the same four things.</p>
          <p>The people who struggle usually focus on everything else.</p>
          <p>Those four levers are:</p>
        </Prose>

        <div className="max-w-3xl mx-auto my-8 grid sm:grid-cols-2 gap-4">
          {[
            { n: 1, label: "Nutrition" },
            { n: 2, label: "Movement" },
            { n: 3, label: "Recovery" },
            { n: 4, label: "Consistency" },
          ].map((l) => (
            <div
              key={l.n}
              className="rounded-2xl bg-white border border-[var(--border)] shadow-sm p-5 flex items-center gap-4"
            >
              <span className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg flex items-center justify-center">
                {l.n}
              </span>
              <p className="text-xl font-bold text-[var(--primary)]">{l.label}</p>
            </div>
          ))}
        </div>

        <Prose>
          <p>Everything else is secondary.</p>
          <p>Supplements can help.</p>
          <p>Peptides can help.</p>
          <p>Advanced protocols can help.</p>
          <p>But these four variables create the foundation.</p>
        </Prose>

        <SubHeading>Lever 1: Nutrition</SubHeading>
        <Prose>
          <p>Nutrition determines whether your body has the raw materials required to change.</p>
          <p>This includes:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Adequate protein",
              "Appropriate calorie intake",
              "Food quality",
              "Consistency",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>You do not need a perfect diet.</p>
          <p>You need a repeatable one.</p>
          <p>
            Most people dramatically underestimate how powerful simple
            nutritional consistency becomes when repeated over months.
          </p>
          <p>The best nutrition plan is the one you can realistically follow.</p>
        </Prose>

        <SubHeading>Lever 2: Movement</SubHeading>
        <Prose>
          <p>Movement creates demand.</p>
          <p>Your body responds to demand.</p>
          <p>When you consistently challenge your body, it adapts.</p>
          <p>When movement disappears, adaptation disappears.</p>
          <p>For body composition purposes, focus on:</p>
          <p className="font-bold text-[var(--primary)] mt-4">Daily Movement</p>
          <p>Walking is one of the most underrated fat loss tools available.</p>
          <p>It improves recovery.</p>
          <p>Supports energy expenditure.</p>
          <p>Helps regulate appetite.</p>
          <p>Creates very little fatigue.</p>
          <p>For most people:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            8,000–12,000 steps per day is an excellent target.
          </p>
          <p className="font-bold text-[var(--primary)] mt-4">Resistance Training</p>
          <p>Resistance training gives your body a reason to preserve muscle.</p>
          <p>This becomes even more important during periods of fat loss.</p>
          <p>You do not need complicated workouts.</p>
          <p>You need progressive effort.</p>
          <p>Consistency beats complexity every time.</p>
        </Prose>

        <SubHeading>Lever 3: Recovery</SubHeading>
        <Prose>
          <p>Most people only think about training.</p>
          <p>Very few think about recovery.</p>
          <p>Your body doesn&rsquo;t improve during workouts.</p>
          <p>It improves after them.</p>
          <p>Recovery includes:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Sleep",
              "Stress management",
              "Hydration",
              "Recovery nutrition",
              "Proper workload management",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>Poor recovery often looks like:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Increased cravings",
              "Low energy",
              "Poor workout performance",
              "Slower fat loss",
              "Reduced motivation",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>Many people try to solve recovery problems with more discipline.</p>
          <p>What they actually need is more recovery.</p>
        </Prose>

        <SubHeading>Lever 4: Consistency</SubHeading>
        <Prose>
          <p>This is where everything happens.</p>
          <p>Most people overestimate what can happen in two weeks.</p>
          <p>Most people underestimate what can happen in six months.</p>
          <p>Body composition is largely a consistency game.</p>
          <p>The people who create incredible results are rarely doing dramatically different things.</p>
          <p>They&rsquo;re simply doing the right things for longer.</p>
          <p>
            A simple plan followed consistently will outperform an advanced
            plan followed inconsistently almost every time.
          </p>
        </Prose>

        <SubHeading>Where GLP-1s Fit Into The System</SubHeading>
        <Prose>
          <p>Many people view GLP-1s as the strategy.</p>
          <p>They&rsquo;re not.</p>
          <p>They&rsquo;re a tool.</p>
          <p>A very effective tool.</p>
          <p>But still a tool.</p>
          <p>
            Their primary benefit is that they help create an environment where
            consistency becomes easier.
          </p>
          <p>Food noise decreases.</p>
          <p>Appetite becomes easier to manage.</p>
          <p>Adherence improves.</p>
          <p>Decision-making becomes simpler.</p>
          <p>This allows people to execute the fundamentals more consistently.</p>
          <p>The fundamentals are still doing the heavy lifting.</p>
        </Prose>

        <SubHeading>Where Peptides Fit Into The System</SubHeading>
        <Prose>
          <p>Recovery peptides.</p>
          <p>Growth hormone secretagogues.</p>
          <p>Regenerative compounds.</p>
          <p>These can all support specific outcomes.</p>
          <p>They can help support recovery.</p>
          <p>Improve adherence.</p>
          <p>Accelerate healing.</p>
          <p>Support body composition goals.</p>
          <p>But they work best when layered on top of strong fundamentals.</p>
          <p>Think of them as amplifiers.</p>
          <p>The stronger the foundation, the more useful the amplifier becomes.</p>
        </Prose>

        <SubHeading>The Simplest Body Composition Plan Possible</SubHeading>
        <Prose>
          <p>If you feel overwhelmed by information, start here:</p>
        </Prose>

        <div className="max-w-3xl mx-auto my-8 grid sm:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <p className="relative text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              Daily
            </p>
            <ul className="relative mt-4 space-y-3 text-white/90">
              {[
                "Hit your protein target",
                "Walk 8,000–12,000 steps",
                "Drink enough water",
                "Sleep 7–9 hours",
              ].map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
              Weekly
            </p>
            <ul className="mt-4 space-y-3 text-[var(--primary)]/85">
              {[
                "Complete 3–4 resistance training sessions",
                "Track body weight",
                "Review adherence",
                "Adjust only if necessary",
              ].map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent-dark)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Prose>
          <p className="font-semibold text-[var(--primary)] text-center">That&rsquo;s it.</p>
          <p>You don&rsquo;t need twenty variables.</p>
          <p>You need a handful of variables repeated consistently.</p>
        </Prose>

        <SubHeading>Progress Happens In Phases</SubHeading>
        <Prose>
          <p>One of the biggest mistakes people make is expecting visible change every single week.</p>
          <p>Real transformation often happens in phases.</p>
          <p>Weeks where nothing seems to happen.</p>
          <p>Then suddenly progress becomes obvious.</p>
          <p>Trust the process long enough to allow adaptation to occur.</p>
          <p>Your body is responding even when the mirror feels slow.</p>
        </Prose>

        <SubHeading>The Goal</SubHeading>
        <Prose>
          <p>The goal isn&rsquo;t becoming perfect.</p>
          <p>The goal isn&rsquo;t following the most advanced protocol.</p>
          <p>The goal isn&rsquo;t finding the next trick.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The goal is building a system you trust.
          </p>
          <p>A system that removes guesswork.</p>
          <p>A system you can repeat.</p>
          <p>A system that creates results without requiring constant motivation.</p>
          <p>Because when the system becomes simple, consistency becomes easier.</p>
          <p>And when consistency becomes easier, body composition becomes predictable.</p>
        </Prose>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Chapter 10 — Supplements
 * ============================================================ */

function SupplementsSection() {
  return (
    <Section id="supplements" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={10}
          eyebrow="SUPPLEMENTS"
          title="What Actually Matters (And What Doesn't)"
        />
        <Prose>
          <p>Walk into any supplement store and you&rsquo;ll immediately notice a problem.</p>
          <p>Thousands of products.</p>
          <p>Hundreds of claims.</p>
          <p>Fat burners.</p>
          <p>Metabolism boosters.</p>
          <p>Testosterone enhancers.</p>
          <p>Recovery formulas.</p>
          <p>Performance blends.</p>
          <p>Sleep stacks.</p>
          <p>Hormone support.</p>
          <p>Gut support.</p>
          <p>Energy support.</p>
          <p>The list never ends.</p>
          <p>The supplement industry has become incredibly good at convincing people they need more.</p>
          <p>More pills.</p>
          <p>More powders.</p>
          <p>More products.</p>
          <p>More complexity.</p>
          <p>The reality is much simpler.</p>
          <p>Most people don&rsquo;t have a supplement problem.</p>
          <p>They have a fundamentals problem.</p>
          <p>Supplements should support a strong foundation.</p>
          <p>They should never become a substitute for one.</p>
          <p>
            That&rsquo;s why this chapter focuses on the handful of supplements
            that consistently provide the highest return on investment.
          </p>
        </Prose>

        <SubHeading>The Supplement Pyramid</SubHeading>
        <Prose>
          <p>Before discussing individual supplements, let&rsquo;s establish a simple framework.</p>
          <p>Imagine a pyramid.</p>
        </Prose>

        <SupplementPyramid />

        <Prose>
          <p>
            Only after those variables are reasonably consistent should
            supplements enter the conversation.
          </p>
          <p>Many people attempt to solve foundational problems with supplementation.</p>
          <p>Unfortunately, no supplement can consistently compensate for:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Poor nutrition",
              "Inadequate protein",
              "Lack of training",
              "Chronic sleep deprivation",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The foundation always comes first.</p>
        </Prose>

        <SubHeading>Tier 1 Supplements</SubHeading>
        <Prose>
          <p>
            If I were forced to build a supplement stack from scratch, these are
            the products I would consider first.
          </p>
          <p>Not because they&rsquo;re exciting.</p>
          <p>Because they work.</p>
        </Prose>

        <SupplementCard
          name="Protein Powder"
          purpose="Convenience. Not necessity."
          body={[
            "Protein powder is simply a convenient way to help reach your daily protein target. Nothing more. Nothing less.",
            "Many people view protein powder as a muscle-building supplement.",
            "It's better viewed as a nutritional tool.",
            "If you can hit your protein goals through whole foods alone, that's perfectly fine.",
            "Most people find a quality protein powder makes consistency much easier.",
            "Especially during periods of fat loss or when appetite is reduced.",
          ]}
        />

        <SupplementCard
          name="Creatine Monohydrate"
          purpose="If there were a 'best bang for your buck' supplement, creatine would be a strong contender."
          benefits={[
            "Strength support",
            "Performance support",
            "Muscle retention support",
            "Recovery support",
          ]}
          body={[
            "Creatine has been studied extensively for decades.",
            "It's simple. Affordable. Effective.",
            "For most healthy adults, it's one of the easiest recommendations to make.",
          ]}
          dose="3-5 grams daily. Consistency matters more than timing."
        />

        <SupplementCard
          name="Electrolytes"
          purpose="Most people think they need more energy. Many simply need better hydration."
          benefits={[
            "Fluid balance",
            "Muscle function",
            "Performance",
            "Recovery",
          ]}
          body={[
            "This becomes particularly important for individuals who exercise regularly, sweat heavily, consume less food, or use GLP-1s.",
            "Many people notice improvements in energy, performance, and overall well-being simply from improving hydration.",
          ]}
        />

        <SupplementCard
          name="Magnesium"
          purpose="Magnesium is involved in hundreds of biological processes."
          benefits={[
            "Recovery support",
            "Sleep quality support",
            "Stress management support",
            "Muscle function support",
          ]}
          body={[
            "Yet many people consume less than ideal amounts.",
            "Many people find magnesium particularly useful when included as part of an evening routine.",
          ]}
        />

        <SupplementCard
          name="Fish Oil"
          purpose="Fish oil remains one of the most commonly used supplements in the health space."
          benefits={[
            "Cardiovascular support",
            "General wellness support",
            "Recovery support",
          ]}
          body={[
            "If you regularly consume fatty fish, supplemental fish oil may be less important.",
            "If you rarely consume fish, it can be a useful addition.",
          ]}
        />

        <SupplementCard
          name="Vitamin D"
          purpose="Vitamin D deserves a brief mention because many people spend a large percentage of their day indoors."
          body={[
            "Vitamin D plays a role in numerous biological functions.",
            "The best approach is often testing rather than guessing.",
            "Work with a qualified healthcare provider if you're concerned about your levels.",
          ]}
        />

        <SubHeading>The Supplements People Overestimate</SubHeading>
        <Prose>
          <p>This section usually surprises people.</p>
          <p>Many supplements are marketed as if they&rsquo;re transformational.</p>
          <p>Most are not.</p>
          <p>That doesn&rsquo;t mean they&rsquo;re useless.</p>
          <p>It simply means their impact is often much smaller than people expect.</p>
          <p>Examples include:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Fat burners",
              "Detox products",
              "Metabolism boosters",
              "Extreme pre-workouts",
              "Proprietary blends",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>Many of these products produce far more marketing than results.</p>
        </Prose>

        <SubHeading>The Fat Burner Trap</SubHeading>
        <Prose>
          <p>Every year people spend enormous amounts of money chasing shortcuts.</p>
          <p>Fat burners remain one of the most common examples.</p>
          <p>Most people would receive dramatically better results from:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "More protein",
              "Better sleep",
              "More steps",
              "Consistent resistance training",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            Those habits influence body composition far more than most
            fat-burning supplements ever will.
          </p>
        </Prose>

        <SubHeading>The 80/20 Rule Of Supplementation</SubHeading>
        <Prose>
          <p>If you&rsquo;re feeling overwhelmed, remember this:</p>
          <p>Roughly 80% of your results will come from:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Nutrition", "Protein", "Training", "Recovery"]}
          />
        </CalloutPanel>
        <Prose>
          <p>The remaining 20% may come from optimization.</p>
          <p>Supplements belong in the optimization category.</p>
          <p>They&rsquo;re often helpful.</p>
          <p>They&rsquo;re rarely the primary reason someone succeeds.</p>
        </Prose>

        <SubHeading>The Peak State Starter Stack</SubHeading>
        <Prose>
          <p>If you&rsquo;re looking for a simple starting point, begin here:</p>
        </Prose>

        <div className="max-w-3xl mx-auto my-8 grid sm:grid-cols-2 gap-5">
          <div className="rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-6 sm:p-7 shadow-xl relative overflow-hidden">
            <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <p className="relative text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
              Daily
            </p>
            <ul className="relative mt-4 space-y-3 text-white/90">
              {[
                "Protein Powder (if needed)",
                "Creatine Monohydrate",
                "Electrolytes",
                "Magnesium",
              ].map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
              Optional
            </p>
            <ul className="mt-4 space-y-3 text-[var(--primary)]/85">
              {["Fish Oil", "Vitamin D (if appropriate)"].map((d) => (
                <li key={d} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--accent-dark)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Prose>
          <p className="font-semibold text-[var(--primary)] text-center">That&rsquo;s it.</p>
          <p>No giant supplement cabinet.</p>
          <p>No complicated schedule.</p>
          <p>No twenty-step protocol.</p>
          <p>Just a handful of tools that support the fundamentals.</p>
        </Prose>

        <SubHeading>A Better Question To Ask</SubHeading>
        <Prose>
          <p>Most people ask:</p>
          <p className="text-lg font-bold text-[var(--primary)] text-center my-2">
            &ldquo;What supplements should I take?&rdquo;
          </p>
          <p>A better question is:</p>
          <p className="text-lg font-bold text-[var(--primary)] text-center my-2">
            &ldquo;What problem am I trying to solve?&rdquo;
          </p>
          <p>If protein intake is low, solve that problem.</p>
          <p>If recovery is poor, solve that problem.</p>
          <p>If hydration is poor, solve that problem.</p>
          <p>
            The most effective supplement plans are usually built around
            specific needs rather than trends.
          </p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Supplements Should Support A Strong Foundation",
              body: "They are not a replacement for nutrition, training, or recovery.",
            },
            {
              title: "Protein Powder Is A Convenience Tool",
              body: "Its purpose is helping you consistently hit your protein target.",
            },
            {
              title: "Creatine Provides Exceptional Value",
              body: "Simple, affordable, and well researched.",
            },
            {
              title: "Hydration Matters More Than Most People Realize",
              body: "Electrolytes can be a powerful addition for active individuals.",
            },
            {
              title: "Keep It Simple",
              body: "The majority of your results will come from the fundamentals. Supplements can help. They work best when they're supporting an already solid plan.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

function SupplementPyramid() {
  const levels = [
    { label: "Recovery", width: "w-1/3" },
    { label: "Training", width: "w-1/2" },
    { label: "Protein", width: "w-2/3" },
    { label: "Nutrition", width: "w-full" },
  ];
  return (
    <div className="max-w-2xl mx-auto my-10 space-y-2">
      <div className="flex justify-center">
        <div className="w-1/4 rounded-2xl bg-[var(--accent)]/20 border border-[var(--accent)]/40 text-[var(--accent-dark)] font-bold text-center py-3 px-4 text-sm">
          Optimization
        </div>
      </div>
      {levels.map((l) => (
        <div key={l.label} className="flex justify-center">
          <div
            className={`${l.width} max-w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-bold py-3 px-5 text-center text-sm sm:text-base`}
          >
            {l.label}
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-[var(--primary)]/50 font-semibold tracking-wider uppercase mt-3">
        Foundation up
      </p>
    </div>
  );
}

function SupplementCard({
  name,
  purpose,
  benefits,
  body,
  dose,
}: {
  name: string;
  purpose: string;
  benefits?: string[];
  body: string[];
  dose?: string;
}) {
  return (
    <div className="max-w-3xl mx-auto my-6 rounded-2xl bg-white border border-[var(--border)] shadow-sm p-6 sm:p-7">
      <h4 className="text-2xl font-bold text-[var(--primary)]">{name}</h4>
      <p className="mt-3 text-sm italic text-[var(--primary)]/65 leading-relaxed">
        {purpose}
      </p>
      {benefits ? (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-2">
            Potential Benefits
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
            {benefits.map((b) => (
              <li
                key={b}
                className="flex items-start gap-2 text-sm text-[var(--primary)]/80"
              >
                <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-dark)]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-4 space-y-2 text-sm text-[var(--primary)]/80 leading-relaxed">
        {body.map((b, i) => (
          <p key={i}>{b}</p>
        ))}
      </div>
      {dose ? (
        <div className="mt-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-3 text-sm">
          <span className="font-bold text-[var(--accent-dark)]">
            Suggested Intake:
          </span>{" "}
          <span className="text-[var(--primary)]/80">{dose}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
 * Chapter 11 — Sleep Optimization
 * ============================================================ */

function SleepSection() {
  return (
    <Section id="sleep" className="bg-white">
      <Container>
        <ChapterHeader
          num={11}
          eyebrow="SLEEP"
          title="The Most Underrated Body Composition Tool"
        />
        <Prose>
          <p>Most people spend far more time thinking about food than they do sleep.</p>
          <p>They&rsquo;ll spend hours researching diets.</p>
          <p>Comparing supplements.</p>
          <p>Watching workout videos.</p>
          <p>Debating carbohydrates.</p>
          <p>Calculating calories.</p>
          <p>Yet they&rsquo;ll sleep five hours, wake up exhausted, and wonder why progress feels difficult.</p>
          <p>The reality is that sleep quietly influences almost every aspect of body composition.</p>
          <p>Your hunger.</p>
          <p>Your cravings.</p>
          <p>Your recovery.</p>
          <p>Your energy.</p>
          <p>Your training performance.</p>
          <p>Your decision-making.</p>
          <p>Your consistency.</p>
          <p>Many people are trying to solve sleep-related problems with more discipline.</p>
          <p>What they actually need is better recovery.</p>
        </Prose>

        <SubHeading>Why Sleep Matters</SubHeading>
        <Prose>
          <p>Think about the last time you had a poor night&rsquo;s sleep.</p>
          <p>Maybe it was four or five hours.</p>
          <p>Maybe you woke up repeatedly.</p>
          <p>Maybe your sleep quality was simply poor.</p>
          <p>The next day probably felt different.</p>
          <p>You were more tired.</p>
          <p>More irritable.</p>
          <p>Less patient.</p>
          <p>More likely to crave highly rewarding foods.</p>
          <p>Less interested in exercise.</p>
          <p>Less interested in cooking.</p>
          <p>More interested in convenience.</p>
          <p>That wasn&rsquo;t a lack of discipline.</p>
          <p>That was biology.</p>
          <p>Your body responds differently when recovery is compromised.</p>
        </Prose>

        <SubHeading>The Hidden Cost Of Poor Sleep</SubHeading>
        <Prose>
          <p>Most people think poor sleep simply makes them tired.</p>
          <p>The effects run much deeper.</p>
          <p>Poor sleep often leads to:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Increased hunger",
              "Increased cravings",
              "Reduced recovery",
              "Lower training performance",
              "Reduced motivation",
              "More emotional eating",
              "Less consistent decision-making",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>In other words:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Poor sleep makes nearly every body composition habit harder.
          </p>
        </Prose>

        <SubHeading>Sleep And Appetite</SubHeading>
        <Prose>
          <p>One of the biggest surprises for many people is how strongly sleep influences hunger.</p>
          <p>When recovery suffers, appetite often changes.</p>
          <p>Many people notice:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "More cravings",
              "More snacking",
              "Stronger urges for highly processed foods",
              "Less satisfaction from meals",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>This becomes especially important during fat loss.</p>
          <p>Because adherence matters.</p>
          <p>The easier it is to follow your plan, the more likely you are to stay consistent.</p>
          <p>Sleep helps create that environment.</p>
        </Prose>

        <SubHeading>Recovery Happens While You Sleep</SubHeading>
        <Prose>
          <p>Most people think results happen in the gym.</p>
          <p>The gym provides the stimulus.</p>
          <p>Recovery creates the adaptation.</p>
          <p>During sleep, your body performs countless recovery processes that support:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Muscle retention",
              "Tissue repair",
              "Hormonal regulation",
              "Nervous system recovery",
              "Cognitive function",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>You do not become stronger while lifting.</p>
          <p>You become stronger while recovering from lifting.</p>
        </Prose>

        <SubHeading>The Sleep Performance Connection</SubHeading>
        <Prose>
          <p>Imagine two people following the exact same plan.</p>
          <p>Same calories.</p>
          <p>Same protein.</p>
          <p>Same workouts.</p>
          <p>One sleeps 8 hours consistently.</p>
          <p>The other averages 5-6 hours.</p>
          <p>Who do you think will recover better?</p>
          <p>Who will have more energy?</p>
          <p>Who will make better food decisions?</p>
          <p>Who will perform better in the gym?</p>
          <p>Sleep doesn&rsquo;t guarantee results.</p>
          <p>But it dramatically improves the environment where results occur.</p>
        </Prose>

        <SubHeading>The Five Highest-Return Sleep Habits</SubHeading>
        <Prose>
          <p>Most sleep advice becomes unnecessarily complicated.</p>
          <p>Let&rsquo;s focus on the habits that create the biggest return.</p>
        </Prose>

        <div className="max-w-3xl mx-auto my-8 space-y-4">
          {[
            {
              n: 1,
              t: "Wake Up At The Same Time",
              b: "Most people focus on bedtime. Wake-up time is often more important. Your body likes consistency. A regular wake-up time helps reinforce your natural sleep-wake rhythm. Perfection isn't required. Consistency helps.",
            },
            {
              n: 2,
              t: "Get Morning Sunlight",
              b: "This is one of the simplest habits available. Within the first hour of waking: Spend 10-15 minutes outside. Natural sunlight helps reinforce your circadian rhythm and sends a strong signal to your brain that the day has started. This often improves sleep quality later that evening.",
            },
            {
              n: 3,
              t: "Respect Caffeine",
              b: "Most people underestimate how long caffeine remains active. The afternoon coffee often becomes the reason they're lying awake later. A simple rule: Try to avoid caffeine within 8-10 hours of bedtime. You don't necessarily need less caffeine. You may simply need better timing.",
            },
            {
              n: 4,
              t: "Create A Sleep-Friendly Environment",
              b: "Your bedroom should make sleep easier. A few simple adjustments can make a meaningful difference: keep the room cool, make it dark, reduce unnecessary noise, limit distractions. Your environment should support the behavior you want.",
            },
            {
              n: 5,
              t: "Build A Shutdown Routine",
              b: "Most people spend their entire day moving. Then expect their brain to instantly switch off. The brain often responds better when given a signal. This could be reading, stretching, journaling, light mobility work, taking magnesium, or turning off bright screens. The activity matters less than the consistency. The goal is teaching your brain that sleep is approaching.",
            },
          ].map((h) => (
            <div
              key={h.n}
              className="rounded-2xl bg-white border border-[var(--border)] shadow-sm p-5 sm:p-6 flex items-start gap-4"
            >
              <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg flex items-center justify-center">
                {h.n}
              </span>
              <div>
                <h4 className="text-lg font-bold text-[var(--primary)]">{h.t}</h4>
                <p className="mt-2 text-sm text-[var(--primary)]/70 leading-relaxed">
                  {h.b}
                </p>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>The Recovery Scorecard</SubHeading>
        <Prose>
          <p>If you want a simple way to evaluate your sleep habits, ask yourself:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <CheckList
            items={[
              "Did I get morning sunlight?",
              "Did I limit late caffeine?",
              "Did I maintain a consistent wake-up time?",
              "Did I create a sleep-friendly environment?",
              "Did I get approximately 7-9 hours of sleep?",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>You don&rsquo;t need perfection.</p>
          <p>You need awareness.</p>
        </Prose>

        <SubHeading>The Sleep Mistake Most People Make</SubHeading>
        <Prose>
          <p>Most people wait until they&rsquo;re exhausted before prioritizing sleep.</p>
          <p>They treat sleep as something they&rsquo;ll improve later.</p>
          <p>After the diet.</p>
          <p>After the busy season.</p>
          <p>After the project.</p>
          <p>After life calms down.</p>
          <p>The problem is that recovery influences everything happening right now.</p>
          <p>The sooner sleep improves, the easier many other habits become.</p>
        </Prose>

        <SubHeading>Think Of Sleep As A Force Multiplier</SubHeading>
        <Prose>
          <p>Protein matters.</p>
          <p>Training matters.</p>
          <p>Movement matters.</p>
          <p>Hydration matters.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Sleep makes all of them work better.
          </p>
          <p>It doesn&rsquo;t replace the fundamentals.</p>
          <p>It amplifies them.</p>
          <p>That&rsquo;s why sleep deserves a place among the most important body composition habits.</p>
          <p>Not because it&rsquo;s exciting.</p>
          <p>Because it quietly influences everything else.</p>
        </Prose>

        <KeyTakeaways
          items={[
            {
              title: "Sleep Impacts More Than Energy",
              body: "It influences hunger, cravings, recovery, training performance, and consistency.",
            },
            {
              title: "Recovery Drives Adaptation",
              body: "The gym provides the stimulus. Recovery creates the result.",
            },
            {
              title: "Sleep Makes Adherence Easier",
              body: "Better recovery often leads to better decisions.",
            },
            {
              title: "Focus On The Fundamentals",
              body: "Consistent wake-up time, morning sunlight, better caffeine timing, a sleep-friendly environment, and a simple evening routine.",
            },
            {
              title: "Most Important",
              body: "Many people are looking for the next breakthrough while ignoring one of the most powerful tools already available to them. Sleep may not be flashy. It may not be exciting. But few habits create a greater return on investment.",
            },
          ]}
        />
      </Container>
    </Section>
  );
}

/* ============================================================
 * Chapter 12 — Your First 30 Days
 * ============================================================ */

function ThirtyDaysSection() {
  return (
    <Section id="30-days" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={12}
          eyebrow="PUTTING IT ALL TOGETHER"
          title="Your First 30 Days"
        />
        <Prose>
          <p>At this point, you&rsquo;ve learned a lot.</p>
          <p>You&rsquo;ve learned how body composition works.</p>
          <p>You&rsquo;ve learned about GLP-1s.</p>
          <p>You&rsquo;ve learned about peptides.</p>
          <p>You&rsquo;ve learned about protein, recovery, sleep, metabolic typing, and supplementation.</p>
          <p>The temptation right now is to do everything at once.</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            Don&rsquo;t.
          </p>
          <p>Most people don&rsquo;t fail because they lack information.</p>
          <p>They fail because they try to implement too much information too quickly.</p>
          <p>The goal of this chapter is to help you avoid that mistake.</p>
          <p>Because transformation rarely comes from doing twenty things at the same time.</p>
          <p>It usually comes from doing a handful of important things consistently.</p>
        </Prose>

        <SubHeading>The Biggest Mistake People Make</SubHeading>
        <Prose>
          <p>Let&rsquo;s imagine two people.</p>
          <p>The first person reads this Blueprint and decides:</p>
          <p className="text-lg font-bold text-[var(--primary)] text-center my-2">
            &ldquo;I&rsquo;m changing everything.&rdquo;
          </p>
          <p>New diet.</p>
          <p>New workout program.</p>
          <p>New supplements.</p>
          <p>New sleep routine.</p>
          <p>New meal plan.</p>
          <p>New tracking system.</p>
          <p>Three days later they&rsquo;re exhausted.</p>
          <p>Two weeks later they&rsquo;re overwhelmed.</p>
          <p>A month later they&rsquo;re back where they started.</p>
          <p>The second person takes a different approach.</p>
          <p>They focus on a few important habits.</p>
          <p>They repeat them consistently.</p>
          <p>They build momentum.</p>
          <p>Three months later their life looks completely different.</p>
          <p>The difference wasn&rsquo;t information.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The difference was implementation.
          </p>
        </Prose>

        <SubHeading>Your Goal For The Next 30 Days</SubHeading>
        <Prose>
          <p>Your goal is not perfection.</p>
          <p>Your goal is consistency.</p>
          <p>For the next month, focus on mastering the fundamentals.</p>
          <p>That&rsquo;s it.</p>
          <p>You don&rsquo;t need to earn the right to do the basics.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The basics are the strategy.
          </p>
        </Prose>

        <div className="max-w-3xl mx-auto my-10 space-y-5">
          {[
            {
              n: 1,
              t: "Determine Your Protein Target",
              body: "Use the Protein Calculator included with this Blueprint. Write your target down. Put it somewhere visible. Then spend the next month focusing on consistency rather than perfection. Remember: You don't need to hit your target perfectly every day. You simply want to move in the right direction.",
            },
            {
              n: 2,
              t: "Establish A Walking Habit",
              body: "Walking remains one of the most underrated body composition tools available. It's simple. Accessible. Sustainable. And surprisingly effective. Aim for 8,000-12,000 steps daily. Don't obsess over the exact number. The goal is movement. Consistency matters more than precision.",
            },
            {
              n: 3,
              t: "Lift Weights 3-4 Times Per Week",
              body: "You do not need the perfect program. You need a repeatable one. Focus on squats, presses, rows, pull-downs, lunges, hinges. Simple movements. Repeated consistently. Over time. The goal isn't destroying yourself. The goal is sending your body a signal to preserve and build lean tissue.",
            },
            {
              n: 4,
              t: "Improve Sleep",
              body: "If your sleep is inconsistent, start small. Choose one improvement. Not five. One. Examples: earlier bedtime, morning sunlight, less caffeine in the afternoon, consistent wake-up time. Small changes performed consistently create larger changes than dramatic improvements that disappear after a week.",
            },
            {
              n: 5,
              t: "Simplify Nutrition",
              body: "Most people make nutrition harder than it needs to be. Start with: protein, whole foods, hydration, consistency. You don't need to argue about every dietary philosophy online. You need a strategy you can follow.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-6 sm:p-7"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg flex items-center justify-center">
                  {s.n}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)]">
                    Step {s.n}
                  </p>
                  <h4 className="mt-1 text-xl font-bold text-[var(--primary)]">
                    {s.t}
                  </h4>
                </div>
              </div>
              <p className="mt-4 text-[var(--primary)]/80 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <SubHeading>What If You&rsquo;re Using A GLP-1?</SubHeading>
        <Prose>
          <p>The same principles apply.</p>
          <p>The medication is a tool.</p>
          <p>Your habits remain the foundation.</p>
          <p>Prioritize:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={["Protein", "Resistance training", "Recovery", "Hydration"]}
          />
        </CalloutPanel>
        <Prose>
          <p>
            The people who achieve the best body composition outcomes while
            using GLP-1s tend to focus on preserving muscle rather than simply
            losing weight.
          </p>
          <p>Keep that distinction in mind.</p>
        </Prose>

        <SubHeading>What If You&rsquo;re Interested In Peptides?</SubHeading>
        <Prose>
          <p>The same principle applies.</p>
          <p>Peptides can support the process.</p>
          <p>They do not replace the process.</p>
          <p>
            The strongest outcomes occur when peptides are layered onto a
            strong foundation rather than used as a substitute for one.
          </p>
          <p>Remember:</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Tools work best when they&rsquo;re supporting a system.
          </p>
        </Prose>

        <SubHeading>The Progress Checklist</SubHeading>
        <Prose>
          <p>Each week, ask yourself:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <CheckList
            items={[
              "Did I hit my protein target most days?",
              "Did I walk consistently?",
              "Did I complete my workouts?",
              "Did I prioritize sleep?",
              "Did I stay reasonably consistent?",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>If the answer is yes, you&rsquo;re moving in the right direction.</p>
          <p>You do not need perfect weeks to create meaningful change.</p>
        </Prose>

        <SubHeading>What Success Actually Looks Like</SubHeading>
        <Prose>
          <p>Most people expect transformation to feel dramatic.</p>
          <p>In reality, it often feels surprisingly boring.</p>
          <p>A little more consistency.</p>
          <p>A little more energy.</p>
          <p>A few better decisions.</p>
          <p>A few better workouts.</p>
          <p>A little more confidence.</p>
          <p>The changes compound.</p>
          <p>Weeks become months.</p>
          <p>Months become years.</p>
          <p>And eventually you become the type of person who no longer has to constantly start over.</p>
          <p className="font-semibold text-[var(--primary)] text-center">That&rsquo;s the real goal.</p>
          <p>Not temporary motivation.</p>
          <p>Not temporary results.</p>
          <p>A lifestyle that supports the person you want to become.</p>
        </Prose>

        <SubHeading>When You Feel Stuck</SubHeading>
        <Prose>
          <p>There will be weeks when progress feels slow.</p>
          <p>That&rsquo;s normal.</p>
          <p>When that happens, return to the Four Levers:</p>
          <p className="font-bold text-[var(--primary)] text-center my-3">
            Nutrition · Movement · Recovery · Consistency
          </p>
          <p>Most plateaus can be traced back to one of them.</p>
          <p>You don&rsquo;t need a new strategy every time progress slows.</p>
          <p>Often you simply need more time.</p>
        </Prose>

        <SubHeading>One Final Thought</SubHeading>
        <Prose>
          <p>If there&rsquo;s one thing I hope you take away from this Blueprint, it&rsquo;s this:</p>
          <p className="text-xl font-bold text-[var(--primary)] text-center my-3">
            You do not need more information. You need a plan you trust long
            enough to follow.
          </p>
          <p>Most people spend years bouncing between strategies.</p>
          <p>Trying to find the perfect approach.</p>
          <p>The truth is that nearly every successful transformation is built on the same foundation:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Adequate protein",
              "Consistent movement",
              "Resistance training",
              "Quality recovery",
              "Patience",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>The fundamentals continue working long after motivation fades.</p>
          <p>They continue working long after the excitement wears off.</p>
          <p>They continue working because they are rooted in principles rather than trends.</p>
          <p className="font-bold text-[var(--primary)] text-center my-3">
            Start simple. Stay consistent. Trust the process.
          </p>
          <p>Your future self will thank you for it.</p>
        </Prose>

        <SubHeading>Your Next Step</SubHeading>
        <Prose>
          <p>Choose one action from this Blueprint and implement it today.</p>
          <p>Not next week.</p>
          <p>Not next month.</p>
          <p className="font-semibold text-[var(--primary)] text-center">Today.</p>
          <p>Because knowledge creates potential.</p>
          <p>Action creates results.</p>
          <p>And the best time to begin is now.</p>
          <p>Thank you for being part of the Peak State community.</p>
          <p>We&rsquo;re rooting for you.</p>
        </Prose>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Chapter 13 — What Happens Next
 * ============================================================ */

function NextSection() {
  return (
    <Section id="next" className="bg-white">
      <Container>
        <ChapterHeader
          num={13}
          eyebrow="WHAT HAPPENS NEXT"
          title="From Information To Implementation"
        />
        <Prose>
          <p>If you&rsquo;ve made it this far, you&rsquo;ve probably noticed something.</p>
          <p>Body composition is a lot simpler than the internet makes it seem.</p>
          <p>The challenge isn&rsquo;t that there isn&rsquo;t enough information available.</p>
          <p>The challenge is that there&rsquo;s too much.</p>
          <p>One person says to cut carbs.</p>
          <p>Another says carbs don&rsquo;t matter.</p>
          <p>One person says you need more cardio.</p>
          <p>Another says cardio kills gains.</p>
          <p>One person says Semaglutide.</p>
          <p>Another says Tirzepatide.</p>
          <p>Another says Retatrutide.</p>
          <p>It&rsquo;s easy to spend months collecting information without ever building a plan.</p>
          <p>That&rsquo;s why this guide exists.</p>
          <p>Not to give you more information.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            To help you organize it.
          </p>
          <p>At this point, you don&rsquo;t need to memorize every chapter.</p>
          <p>You don&rsquo;t need to implement everything at once.</p>
          <p>You simply need to take what you&rsquo;ve learned and turn it into action.</p>
        </Prose>

        <SubHeading>Your Next Steps</SubHeading>
        <Prose>
          <p>Start by identifying your metabolic type.</p>
          <p>Calculate your protein target.</p>
          <p>Determine your training schedule.</p>
          <p>Establish your daily movement goal.</p>
          <p>Choose one or two habits that will create the biggest impact over the next 30 days.</p>
          <p>Then follow that plan long enough to collect meaningful feedback.</p>
          <p>
            Most people change directions before they have enough data to know
            whether something is working.
          </p>
          <p>Give your body time to respond.</p>
          <p>Give yourself time to learn.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            Consistency creates clarity.
          </p>
        </Prose>

        <SubHeading>A Few Things To Remember</SubHeading>
        <Prose>
          <p>Your body is always adapting.</p>
          <p>Progress won&rsquo;t always show up on the scale.</p>
          <p>Some weeks you&rsquo;ll notice changes in energy.</p>
          <p>Some weeks you&rsquo;ll notice changes in appetite.</p>
          <p>Some weeks you&rsquo;ll notice changes in strength.</p>
          <p>Some weeks you&rsquo;ll notice changes in how your clothes fit.</p>
          <p>Pay attention to all of it.</p>
          <p>Body composition is more than a number.</p>
          <p>The goal isn&rsquo;t simply to weigh less.</p>
          <p>
            The goal is to become stronger, healthier, more capable, and more
            confident in the process.
          </p>
        </Prose>

        <SubHeading>When You&rsquo;re Ready For More Support</SubHeading>
        <Prose>
          <p>Many people use this guide on its own and get tremendous value from it.</p>
          <p>Others eventually decide they want additional structure, accountability, education, or support.</p>
          <p>If that becomes you, we&rsquo;re here.</p>
          <p>
            Whether you&rsquo;re exploring GLP-1s, learning about peptides,
            trying to build lean muscle, or simply looking for a more organized
            approach to body composition, our goal is always the same:
          </p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Help people stop guessing.",
              "Help people build a plan.",
              "Help people stay consistent long enough to see what they're capable of.",
            ]}
          />
        </CalloutPanel>

        <SubHeading>Need Help Applying This?</SubHeading>
        <Prose>
          <p>One of the biggest challenges with body composition isn&rsquo;t finding information.</p>
          <p>It&rsquo;s knowing which information applies to you.</p>
          <p>Questions come up.</p>
          <p>You wonder whether you&rsquo;re on the right track.</p>
          <p>You second-guess your approach.</p>
          <p>You spend hours trying to figure out what to do next.</p>
          <p>
            If you&rsquo;d like help simplifying the process, you&rsquo;re
            welcome to book a complimentary{" "}
            <span className="font-semibold text-[var(--primary)]">
              15-minute Body Composition Review.
            </span>
          </p>
          <p>We&rsquo;ll discuss:</p>
        </Prose>
        <CalloutPanel variant="muted">
          <BulletList
            items={[
              "Your goals",
              "Your biggest obstacles",
              "The areas that deserve your attention first",
              "Your next best steps",
            ]}
          />
        </CalloutPanel>
        <Prose>
          <p>No pressure.</p>
          <p>No obligation.</p>
          <p>Just an opportunity to get clarity and direction.</p>
        </Prose>

        <div className="max-w-2xl mx-auto my-10 text-center">
          <a
            href="https://cal.com/peakstatelabs/the-body-composition-blueprint-strategy-call"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
          >
            Book Your Complimentary Review
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <SubHeading>Final Thought</SubHeading>
        <Prose>
          <p>The best body composition plan is rarely the most complicated one.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            It&rsquo;s the one you&rsquo;ll actually follow.
          </p>
          <p>Start where you are.</p>
          <p>Use what you&rsquo;ve learned.</p>
          <p>Make adjustments as you gather feedback.</p>
          <p>Keep moving forward.</p>
          <p>
            Small actions repeated consistently have a way of creating outcomes
            that once felt impossible.
          </p>
          <p>We&rsquo;ll be rooting for you.</p>
        </Prose>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Appendix A — Protein Calculator
 * ============================================================ */

function ProteinCalculatorSection() {
  return (
    <Section id="calculator" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={14}
          eyebrow="APPENDIX A · PROTEIN CALCULATOR"
          title="Find Your Daily Protein Target"
          lede="One of the simplest ways to improve body composition is ensuring you're consuming adequate protein. Use the calculator below to determine your daily protein target, then keep that number somewhere visible."
        />

        <div className="max-w-4xl mx-auto">
          <ProteinCalculator />
        </div>

        <SubHeading>Quick Reference Chart</SubHeading>
        <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-[var(--border)] bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest">
                  Goal Weight
                </th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-widest">
                  Daily Protein Target
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["120 lbs", "95-120g"],
                ["140 lbs", "110-140g"],
                ["160 lbs", "130-160g"],
                ["180 lbs", "145-180g"],
                ["200 lbs", "160-200g"],
                ["220 lbs", "175-220g"],
                ["240 lbs", "190-240g"],
                ["260 lbs", "210-260g"],
              ].map(([w, p], i) => (
                <tr
                  key={w}
                  className={i % 2 === 0 ? "bg-[var(--muted)]/40" : "bg-white"}
                >
                  <td className="p-4 text-sm font-bold text-[var(--primary)] tabular-nums">
                    {w}
                  </td>
                  <td className="p-4 text-sm text-[var(--primary)]/80 tabular-nums font-semibold">
                    {p}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-sm italic text-[var(--primary)]/60 max-w-md mx-auto leading-relaxed">
          Consistency matters more than perfection. Aim to hit your range most
          days rather than chasing an exact number.
        </p>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Appendix E — Metabolic Type Quiz
 * ============================================================ */

function QuizSection() {
  return (
    <Section id="quiz" className="bg-white">
      <Container>
        <ChapterHeader
          num={15}
          eyebrow="APPENDIX E · METABOLIC TYPE ASSESSMENT™"
          title="The Peak State Metabolic Type Assessment™"
          lede="The goal of this assessment is not to put you into a box. The goal is to help you understand your natural tendencies so you can stop fighting your biology and start working with it. Answer based on your actual experience — not what you've read online."
        />

        <div className="max-w-4xl mx-auto">
          <MetabolicTypeQuiz />
        </div>

        <SubHeading>The Most Important Rule</SubHeading>
        <Prose>
          <p>There is no food that is permanently off limits.</p>
          <p>This assessment is not designed to create restriction.</p>
          <p>It is designed to create awareness.</p>
          <p>Use it as a guide.</p>
          <p>Experiment.</p>
          <p>Pay attention.</p>
          <p>Then let your own experience become the teacher.</p>
          <p>The best nutrition plan is not the one that looks perfect on paper.</p>
          <p>
            It&rsquo;s the one that helps you feel, perform, and recover at your
            best.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}

/* ============================================================
 * Appendix F — Metabolic Type Nutrition Plans
 * ============================================================ */

function MetabolicNutritionSection() {
  return (
    <Section id="nutrition-plans" className="bg-[var(--muted)]">
      <Container>
        <ChapterHeader
          num={16}
          eyebrow="APPENDIX F · NUTRITION PLANS"
          title="Metabolic Type Nutrition Plans"
          lede="One of the biggest mistakes people make after taking the Metabolic Type Assessment is treating their result like a rigid diet. That's not the purpose. Your metabolic type is a starting point — a lens that helps you understand how your body tends to respond to food."
        />
        <Prose>
          <p>
            Use the recommendations in this appendix as a guide. Experiment with
            them. Pay attention to your energy, hunger, recovery, sleep quality,
            mental clarity, workout performance, and body composition.
          </p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The goal isn&rsquo;t perfection. The goal is awareness.
          </p>
        </Prose>

        <NutritionPlanCard
          type="Polar"
          characteristics={[
            "Love food and have a strong appetite",
            "Feel better eating protein and fats",
            "Crash after consuming large amounts of carbohydrates by themselves",
            "Gain body fat quickly when carbohydrates are too high",
            "Feel better eating smaller meals more frequently",
            "Wake up hungry",
            "Experience stable energy when protein intake is high",
          ]}
          characteristicsLede="Many Polar types spend years trying low-fat diets because they're told they're healthier. Then they wonder why they're hungry all the time. Your body often prefers a different fuel mix."
          macros={{ protein: 45, carbs: 35, fat: 20 }}
          foods={[
            {
              cat: "Proteins",
              list: [
                "Dark chicken meat",
                "Dark turkey meat",
                "Beef",
                "Lamb",
                "Pork",
                "Veal",
                "Organ meats",
                "Wild game",
                "Eggs",
              ],
            },
            {
              cat: "Seafood",
              list: [
                "Salmon",
                "Sardines",
                "Herring",
                "Mackerel",
                "Mussels",
                "Oysters",
                "Shrimp",
                "Crab",
                "Lobster",
                "Scallops",
              ],
            },
            {
              cat: "Carbohydrates",
              list: [
                "Rice",
                "Oats",
                "Buckwheat",
                "Quinoa",
                "Sweet potatoes",
                "Potatoes",
                "Squash",
                "Fruit",
              ],
            },
            {
              cat: "Fats",
              list: [
                "Avocado",
                "Olive oil",
                "Almond oil",
                "Nuts",
                "Seeds",
                "Butter",
                "Ghee",
              ],
            },
          ]}
          sampleDay={[
            { meal: "Breakfast", items: ["4 eggs", "2 slices bacon", "Berries"] },
            { meal: "Lunch", items: ["8 oz salmon", "Large salad", "Olive oil dressing"] },
            { meal: "Snack", items: ["Greek yogurt", "Handful of almonds"] },
            { meal: "Dinner", items: ["Steak", "Asparagus", "Sweet potato"] },
          ]}
          mistakes={[
            "Eating carbohydrates by themselves",
            "Skipping protein at breakfast",
            "Trying to survive on salads",
            "Following extremely low-fat diets",
            "Drinking sugary beverages throughout the day",
          ]}
        />

        <NutritionPlanCard
          type="Equatorial"
          characteristics={[
            "Prefer lighter meals",
            "Feel energized by carbohydrates",
            "Naturally gravitate toward endurance activities",
            "Can comfortably go longer between meals",
            "Feel sluggish after very high-fat meals",
            "Prefer lighter protein sources",
          ]}
          characteristicsLede="Many Equatorial types struggle because they force themselves into ultra-high-protein, high-fat nutrition plans that don't align with how they naturally function."
          macros={{ protein: 20, carbs: 70, fat: 10 }}
          foods={[
            {
              cat: "Proteins",
              list: [
                "Chicken breast",
                "Turkey breast",
                "Lean pork",
                "Lean fish",
                "Cottage cheese",
                "Yogurt",
                "Eggs",
              ],
            },
            {
              cat: "Seafood",
              list: ["Cod", "Haddock", "Halibut", "Trout", "Sole", "Tuna"],
            },
            {
              cat: "Carbohydrates",
              list: [
                "Rice",
                "Oats",
                "Sweet potatoes",
                "Potatoes",
                "Fruit",
                "Whole grains",
                "Vegetables",
              ],
            },
            {
              cat: "Fats",
              list: ["Olive oil", "Nuts", "Seeds", "Avocado"],
              note: "Use more sparingly than Polar types.",
            },
          ]}
          sampleDay={[
            { meal: "Breakfast", items: ["Oatmeal", "Banana", "Greek yogurt"] },
            { meal: "Lunch", items: ["Chicken breast", "Rice", "Vegetables"] },
            { meal: "Snack", items: ["Fruit", "Low-fat yogurt"] },
            { meal: "Dinner", items: ["White fish", "Sweet potato", "Vegetables"] },
          ]}
          mistakes={[
            "Following ketogenic diets",
            "Overeating fats",
            "Avoiding carbohydrates",
            "Trying to force large protein intake at every meal",
            "Under-fueling activity levels",
          ]}
        />

        <NutritionPlanCard
          type="Variable"
          characteristics={[
            "Feel good on multiple nutrition approaches",
            "Adapt quickly",
            "Notice shifts based on activity level",
            "Can move toward Polar tendencies during stressful periods",
            "Can move toward Equatorial tendencies during endurance-focused periods",
          ]}
          characteristicsLede="The biggest advantage of being a Variable Type is flexibility. The biggest challenge is paying attention."
          macros={{ protein: 40, carbs: 50, fat: 10 }}
          foods={[
            {
              cat: "Balanced Meals",
              list: [
                "Protein at every meal",
                "Carbohydrates that match your activity",
                "Vegetables across the day",
                "A moderate amount of fat",
              ],
              note: "Start with balance, then monitor hunger, energy, recovery, sleep, and body composition. Adjust from there.",
            },
          ]}
          sampleDay={[
            { meal: "Breakfast", items: ["Eggs", "Oatmeal", "Fruit"] },
            { meal: "Lunch", items: ["Chicken breast", "Rice", "Vegetables"] },
            { meal: "Snack", items: ["Protein shake", "Fruit"] },
            { meal: "Dinner", items: ["Lean beef", "Potatoes", "Vegetables"] },
          ]}
          mistakes={[
            "Assuming you must follow one approach forever rather than adjusting based on feedback",
          ]}
        />

        <SubHeading>The Peak State Method</SubHeading>
        <Prose>
          <p>The purpose of metabolic typing isn&rsquo;t to create food rules.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The purpose is to build self-awareness.
          </p>
          <p>Most people spend years following nutrition plans designed for somebody else.</p>
          <p>This framework helps you start paying attention to how your own body responds.</p>
          <p>
            If your energy improves, hunger stabilizes, recovery improves,
            workouts feel stronger, and body composition begins moving in the
            right direction...
          </p>
          <p className="font-semibold text-[var(--primary)] text-center">
            You&rsquo;re moving in the right direction.
          </p>
          <p>If not, adjust.</p>
          <p>The body always gives feedback.</p>
          <p>Your job is learning how to listen.</p>
        </Prose>

        <SubHeading>Retest Every 60–90 Days</SubHeading>
        <Prose>
          <p>As your health improves, your metabolic type can shift.</p>
          <p>Many people become more flexible over time.</p>
          <p>Retest every few months and continue refining your approach.</p>
          <p>The goal is not identifying your type once.</p>
          <p className="font-semibold text-[var(--primary)] text-center">
            The goal is developing a deeper understanding of your body for the
            rest of your life.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}

function NutritionPlanCard({
  type,
  characteristics,
  characteristicsLede,
  macros,
  foods,
  sampleDay,
  mistakes,
}: {
  type: string;
  characteristics: string[];
  characteristicsLede: string;
  macros: { protein: number; carbs: number; fat: number };
  foods: { cat: string; list: string[]; note?: string }[];
  sampleDay: { meal: string; items: string[] }[];
  mistakes: string[];
}) {
  return (
    <div className="max-w-4xl mx-auto my-10 rounded-3xl bg-white border border-[var(--border)] shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-7 sm:p-9">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[var(--accent)]/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            Nutrition Plan
          </p>
          <h3 className="mt-2 text-3xl sm:text-4xl font-bold">{type} Type</h3>
        </div>
      </div>
      <div className="p-6 sm:p-8 space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-3">
            Typical {type} Type Characteristics
          </p>
          <p className="italic text-[var(--primary)]/65 mb-4 leading-relaxed">
            {characteristicsLede}
          </p>
          <CheckList items={characteristics} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-3">
            Starting Macronutrient Split
          </p>
          <MacroSplitVisualization label="" macros={macros} />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-4">
            Recommended Food Sources
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {foods.map((f) => (
              <div
                key={f.cat}
                className="rounded-2xl bg-[var(--muted)]/70 border border-[var(--border)] p-4"
              >
                <p className="font-bold text-[var(--primary)] mb-2">{f.cat}</p>
                {f.note ? (
                  <p className="text-xs italic text-[var(--primary)]/60 mb-2">
                    {f.note}
                  </p>
                ) : null}
                <ul className="space-y-1 text-sm text-[var(--primary)]/80">
                  {f.list.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="flex-shrink-0 mt-2 w-1 h-1 rounded-full bg-[var(--accent-dark)]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-dark)] mb-4">
            Sample {type} Type Day
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sampleDay.map((m) => (
              <div
                key={m.meal}
                className="rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-4"
              >
                <p className="font-bold text-[var(--primary)] text-sm">
                  {m.meal}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-[var(--primary)]/75">
                  {m.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-red-700 mb-3">
            Common {type} Type Mistakes
          </p>
          <ul className="space-y-2">
            {mistakes.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2 text-sm text-red-900/80"
              >
                <span className="flex-shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Final CTA
 * ============================================================ */

function FinalCTASection() {
  return (
    <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white p-8 sm:p-12 shadow-2xl">
            <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs sm:text-sm font-bold tracking-wider text-[var(--accent)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>READY FOR HELP?</span>
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
                Want help applying this to your life?
              </h2>
              <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed">
                Book a complimentary 15-minute Body Composition Strategy Call.
                We&rsquo;ll talk through your goals, answer your questions, and
                help you identify the next best step.
              </p>
              <a
                href="https://cal.com/peakstatelabs/the-body-composition-blueprint-strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent inline-flex h-14 items-center justify-center rounded-2xl px-10 text-lg font-semibold mt-8"
              >
                Book Your Free Call
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="mt-4 text-sm text-white/60">
                Free 15-minute call. No pressure. No obligation.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
