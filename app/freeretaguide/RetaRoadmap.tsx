"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { HeroJourney, PHASE_COLORS, PhaseHeader, PhaseSelector, StickyTracker, scrollToId, usePosition } from "./Journey";
import { PHASES } from "./model";
import { resetAll } from "./store";
import { Checklist, PlateauChecklist, Scorecard, TrendIllustration } from "./Tools";
import {
  Block,
  Callout,
  Card,
  Chips,
  Dots,
  Eyebrow,
  H2,
  H3,
  IconArrowDown,
  IconArrowRight,
  IconBolt,
  IconBowl,
  IconCamera,
  IconDumbbell,
  IconMoon,
  IconReset,
  IconRuler,
  IconScale,
  IconX,
  Lead,
  P,
  Statement,
  Wrap,
  cx,
} from "./ui";

/* ============================================================
 * Peak State Labs — The 20-Pound Reta Roadmap (free lead magnet)
 * Content: "Free Reta Guide" doc, reformatted for the web.
 * ============================================================ */

const SHOP_URL = "/getreta";

function shopClick(location: string) {
  try {
    posthog.capture("reta_roadmap_shop_click", { location });
  } catch {
    /* optional */
  }
}

export function RetaRoadmap() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <Header />
      <Hero />
      <StickyTracker />
      <main>
        <WhereAreYou />
        <WhyFourPhases />
        <BeforeWeStart />
        <Phase1 />
        <Phase2 />
        <Phase3 />
        <Phase4 />
        <Tools />
        <WhatNotToDo />
        <Phase5 />
        <OnePage />
        <FinalThought />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- header + hero ---------------- */

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <Wrap className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <img src="/logo.png" alt="Peak State Labs Logo" className="h-7 w-7 rounded-lg" />
          <span className="hidden sm:inline">Peak State Labs</span>
        </Link>
        <a
          href={SHOP_URL}
          onClick={() => shopClick("header")}
          className="btn-accent inline-flex h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
        >
          Shop Reta
        </a>
      </Wrap>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden gradient-hero pb-12 pt-12 sm:pb-16 sm:pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="absolute left-[-10%] top-1/2 h-80 w-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      </div>
      <Wrap className="relative text-center">
        <div className="animate-fade-in">
          <Eyebrow>Free guide</Eyebrow>
        </div>
        <h1 className="animate-fade-in-up mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          The 20-Pound Reta Roadmap
        </h1>
        <p className="animate-fade-in-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--primary)]/70 text-pretty sm:text-xl">
          The 4 phases of losing 20 pounds, and what should change as your body changes.
        </p>
        <HeroJourney />
        <button
          type="button"
          onClick={() => scrollToId("where")}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]/70 hover:text-[var(--primary)]"
        >
          Find your phase <IconArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </Wrap>
    </section>
  );
}

function WhereAreYou() {
  return (
    <section id="where" className="scroll-mt-[136px] bg-gradient-to-b from-[var(--muted)] to-white py-12 sm:py-16">
      <Wrap narrow>
        <PhaseSelector />
      </Wrap>
    </section>
  );
}

/* ---------------- intro ---------------- */

function WhyFourPhases() {
  return (
    <Block id="intro">
      <Wrap narrow>
        <Eyebrow>Start here</Eyebrow>
        <H2 className="mt-4">One goal. Four different bodies.</H2>
        <div className="mt-6 space-y-5">
          <Lead>Most people look at a 20-pound fat-loss goal like this:</Lead>
          <Statement tone="soft">“I’m 20 pounds away.”</Statement>
          <P>
            One number. One destination. One plan. And then they expect that same plan to work exactly the same way
            from pound one to pound twenty.
          </P>
          <P className="font-semibold text-[var(--primary)]">That’s where people get themselves into trouble.</P>
        </div>

        <div className="my-10 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <Card className="text-center">
            <div className="text-4xl font-black text-[var(--accent-dark)] sm:text-5xl">#2</div>
            <div className="mt-1 text-sm text-[var(--primary)]/65">Pound two</div>
          </Card>
          <span className="text-sm font-semibold text-[var(--primary)]/50">≠</span>
          <Card className="text-center">
            <div className="text-4xl font-black text-[var(--primary)] sm:text-5xl">#18</div>
            <div className="mt-1 text-sm text-[var(--primary)]/65">Pound eighteen</div>
          </Card>
          <p className="col-span-3 text-center font-semibold text-[var(--primary)]">
            Pound #2 and pound #18 are happening in two different bodies.
          </p>
        </div>

        <P>By the time you’ve lost 15 pounds, these may all have changed:</P>
        <div className="mt-4">
          <Chips
            items={[
              "Your body weight",
              "Your appetite",
              "Your energy",
              "How training feels",
              "Your recovery",
              "Your calorie needs",
              "Your relationship with food",
            ]}
          />
        </div>

        <div className="mt-10 space-y-4">
          <P>So the smartest way to approach a 20-pound goal is to stop treating it like one giant phase.</P>
          <Statement>Think of it as four separate five-pound phases.</Statement>
          <div className="grid gap-3 sm:grid-cols-3">
            {["Each phase has a job.", "Each phase gives you different information.", "Each phase asks slightly different questions."].map(
              (t) => (
                <Card key={t} className="!p-4 font-semibold">
                  {t}
                </Card>
              ),
            )}
          </div>
          <P>That’s what this roadmap is designed to help you understand.</P>
        </div>
      </Wrap>
    </Block>
  );
}

function BeforeWeStart() {
  return (
    <Block id="before" className="bg-[var(--muted)]">
      <Wrap narrow>
        <Eyebrow>Before we start</Eyebrow>
        <H2 className="mt-4">What Reta is, and what it isn’t</H2>
        <div className="mt-6 space-y-5">
          <P>
            Retatrutide, often shortened to “Reta” online, is an investigational triple hormone receptor agonist being
            studied by Eli Lilly. It activates receptors for:
          </P>
          <div className="grid grid-cols-3 gap-3">
            {["GLP-1", "GIP", "Glucagon"].map((r) => (
              <div key={r} className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <div className="text-lg font-bold sm:text-xl">{r}</div>
                <div className="text-xs text-[var(--primary)]/55">receptor</div>
              </div>
            ))}
          </div>
          <P>
            Research into retatrutide has produced substantial weight-loss results in clinical trials, but retatrutide
            is still investigational and has not been approved by the FDA or another regulatory authority for consumer
            use.
          </P>
          <Callout title="This roadmap is educational">
            It is not a prescription, dosing protocol, or substitute for medical care. The purpose is much simpler:{" "}
            <strong className="text-[var(--primary)]">
              to show you what actually matters as someone moves through a meaningful fat-loss journey so you don’t
              make every decision based on what the scale did this morning.
            </strong>
          </Callout>
          <P>
            Because Reta may change the biological environment around fat loss.{" "}
            <strong className="text-[var(--primary)]">It doesn’t change the fundamentals of body composition.</strong>
          </P>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "You still have to give your body a reason to preserve muscle.",
              "You still need adequate nutrition.",
              "You still need movement.",
              "You still need recovery.",
              "And you still need enough patience to collect useful information before changing direction.",
            ].map((t, i) => (
              <div key={t} className={cx("rounded-2xl bg-white p-4 shadow-sm", i === 4 && "sm:col-span-2")}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    </Block>
  );
}

/* ---------------- phase 1 ---------------- */

const TRACKERS = [
  {
    icon: IconScale,
    title: "Body weight",
    body: "Look at the trend rather than one isolated weigh-in. Weight moves with food volume, sodium, hydration, bowel movements, menstrual cycle changes, carbohydrate intake, and countless other variables. One day tells you almost nothing. Several weeks tell you much more.",
  },
  {
    icon: IconRuler,
    title: "Waist measurement",
    body: "Take it under similar conditions each time. You don’t need to measure every morning. Consistency matters more than frequency.",
  },
  {
    icon: IconCamera,
    title: "Progress photos",
    body: "Front. Side. Back. Same lighting if possible, same general clothing. You will often see changes here that the scale doesn’t explain.",
  },
  {
    icon: IconDumbbell,
    title: "Training performance",
    body: "What exercises? What weights? How many reps? Are you getting stronger, holding steady, or getting noticeably weaker? That matters.",
  },
  { icon: IconBolt, title: "Energy", body: "How do you actually feel during the day?" },
  {
    icon: IconBowl,
    title: "Hunger and appetite",
    body: "Is eating easier to manage? Are you still able to eat enough nutritious food?",
  },
  {
    icon: IconMoon,
    title: "Recovery",
    body: "How sore are you? How are you sleeping? Do you feel ready for your next workout?",
  },
];

function Numbered({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <Card className="relative">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-lg font-black text-white">
          {n}
        </span>
        <div className="min-w-0">
          <H3>{title}</H3>
          <div className="mt-3 space-y-3 leading-relaxed text-[var(--primary)]/80">{children}</div>
        </div>
      </div>
    </Card>
  );
}

function Phase1() {
  return (
    <Block id="phase-1">
      <PhaseStripe index={0} />
      <Wrap narrow>
        <PhaseHeader index={0} />
        <div className="space-y-5">
          <Lead>The beginning is exciting. You finally made a decision. You have a plan. You’re paying attention. You’re motivated.</Lead>
          <P>
            And because motivation is high, this is also when people tend to make the{" "}
            <strong className="text-[var(--primary)]">most unnecessary changes.</strong>
          </P>
          <Chips
            strike
            items={[
              "Overhaul the whole diet",
              "Train six days a week",
              "Cardio every morning",
              "Track every bite",
              "Buy ten supplements",
              "Change the sleep schedule",
              "Become a different person by Tuesday",
            ]}
          />
          <P className="font-semibold text-[var(--primary)]">You don’t need that.</P>
          <P>Your first five pounds should teach you something much more useful:</P>
          <Statement>What does a repeatable version of this process actually look like in your life?</Statement>
        </div>

        <div className="mt-14">
          <H3>Your job: build a baseline you can trust</H3>
          <P className="mt-2">Before you worry about optimization, you need to know where you’re starting. Track a few useful things:</P>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TRACKERS.map(({ icon: Icon, title, body }) => (
              <Card key={title} className="!p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]/20 text-[var(--primary)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="font-bold">{title}</div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--primary)]/75 sm:text-base">{body}</p>
              </Card>
            ))}
            <div className="flex items-center rounded-2xl bg-[var(--primary)] p-5 text-white sm:p-6">
              <p className="leading-relaxed">
                You aren’t collecting this because you need another spreadsheet to obsess over. You’re collecting it
                because <strong>good decisions require context.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <H3>Your Phase 1 priorities</H3>
          <div className="mt-6 space-y-4">
            <Numbered n={1} title="Protein first">
              <p>If you only paid attention to one nutrition variable during fat loss, protein would be near the top of the list.</p>
              <p>
                Losing weight and improving body composition are not automatically the same thing. You can lose 20
                pounds and still be disappointed with the result if too much of that weight comes from lean tissue.
              </p>
              <p>
                Adequate protein helps support muscle retention, recovery, and satiety. And when appetite drops
                substantially, protein can become surprisingly easy to under-eat.
              </p>
              <p className="font-semibold text-[var(--primary)]">
                A smaller appetite does not automatically create better nutrition. Sometimes it simply creates less
                nutrition. Your job is to make the food you do eat count.
              </p>
            </Numbered>
            <Numbered n={2} title="Give your body a reason to keep muscle">
              <p>
                That reason is <strong className="text-[var(--primary)]">resistance training.</strong> Your body adapts
                to what you ask it to do. If you keep asking your muscles to produce force, your body has a reason to
                maintain that tissue.
              </p>
              <p>
                This does not mean you need to train like a bodybuilder. Two to four productive strength-training
                sessions per week can create a meaningful signal. Focus on repeatable movement patterns:
              </p>
              <div className="flex flex-wrap gap-2">
                {["Push", "Pull", "Squat", "Hinge", "Carry"].map((m) => (
                  <span key={m} className="rounded-lg bg-[var(--primary)] px-3 py-1 text-sm font-bold text-white">
                    {m}
                  </span>
                ))}
              </div>
              <p>Progress gradually. You are building a body you want to keep after the scale stops moving.</p>
            </Numbered>
            <Numbered n={3} title="Keep daily movement boringly consistent">
              <p>Walking is underrated because it doesn’t feel dramatic. That’s exactly why it works so well.</p>
              <p>
                You can recover from it. You can do it frequently. It supports daily energy expenditure without turning
                every day into another workout.
              </p>
              <p>
                Your exact step count matters less than creating a consistent baseline. Know roughly what normal looks
                like for you. <strong className="text-[var(--primary)]">That becomes useful later.</strong>
              </p>
            </Numbered>
            <Numbered n={4} title="Don’t judge the entire journey by week one">
              <p>
                Some people see immediate movement. Others don’t. Early scale changes can include shifts in water,
                glycogen, digestion, and food intake.
              </p>
              <p className="font-semibold text-[var(--primary)]">
                Your first few weigh-ins are data. They are not a verdict. Give the trend time to develop.
              </p>
            </Numbered>
          </div>
        </div>

        <div className="mt-14">
          <Checklist
            storeKey="p1-checkpoint"
            title="Phase 1 Checkpoint"
            intro="Before moving mentally into the next phase, ask:"
            threshold={5}
            items={[
              "Am I eating protein consistently?",
              "Am I resistance training?",
              "Is my daily movement reasonably consistent?",
              "Am I sleeping enough to recover?",
              "Do I understand my normal weight fluctuations?",
              "Do I have baseline photos and measurements?",
              "Does this routine fit into my actual life?",
            ]}
            passMessage={
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <strong>Mostly yes. You’ve built something valuable.</strong> Now the goal changes.
                </span>
                <NextPhaseButton id="phase-2" label="On to Phase 2" />
              </div>
            }
            pendingMessage="Tick what’s true today. If those answers are mostly yes, you’ve built something valuable."
          />
        </div>
      </Wrap>
    </Block>
  );
}

function NextPhaseButton({ id, label }: { id: string; label: string }) {
  return (
    <button
      type="button"
      onClick={() => scrollToId(id)}
      className="btn-accent inline-flex h-10 flex-shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
    >
      {label} <IconArrowRight className="h-4 w-4" />
    </button>
  );
}

function PhaseStripe({ index }: { index: number }) {
  return (
    <div
      aria-hidden="true"
      className="-mt-14 mb-14 h-1.5 sm:-mt-20 sm:mb-20"
      style={{ background: PHASE_COLORS[index] }}
    />
  );
}

/* ---------------- phase 2 ---------------- */

function Phase2() {
  return (
    <Block id="phase-2" className="bg-[var(--muted)]/50">
      <PhaseStripe index={1} />
      <Wrap narrow>
        <PhaseHeader index={1} />
        <div className="space-y-5">
          <Lead>This is usually the fun part.</Lead>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "You can see progress.",
              "Clothes fit differently.",
              "Your face looks a little leaner.",
              "The goal suddenly feels real.",
            ].map((t) => (
              <div key={t} className="rounded-2xl bg-white p-4 font-semibold shadow-sm">
                {t}
              </div>
            ))}
          </div>
          <P>And that creates a new danger:</P>
          <Statement>You start trying to make it happen faster.</Statement>
          <P>People see progress and assume more aggression will create more progress.</P>
          <ol className="relative space-y-2 border-l-2 border-dashed border-amber-300 pl-6">
            {["Food drops lower.", "Training gets harder.", "Cardio increases.", "Recovery gets ignored."].map((t) => (
              <li key={t} className="relative font-semibold text-[var(--primary)]">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-amber-400" />
                {t}
              </li>
            ))}
            <li className="relative text-[var(--primary)]/75">
              <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-red-500" />
              And suddenly the process that felt easy begins feeling exhausting.
            </li>
          </ol>
          <Callout title="Your goal during pounds 5–10">
            <strong className="text-[var(--primary)]">
              Keep the weight loss moving while protecting the things you don’t want to lose.
            </strong>{" "}
            Especially muscle.
          </Callout>
        </div>

        <div className="mt-14">
          <H3>The scale can lie by telling the truth</H3>
          <P className="mt-2">Imagine two people each lose 20 pounds.</P>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PersonCard
              who="Person A"
              text="Loses mostly fat while maintaining much of their lean tissue."
              fat={88}
            />
            <PersonCard
              who="Person B"
              text="Loses significantly more lean tissue along the way."
              fat={58}
            />
          </div>
          <div className="mt-6 space-y-4">
            <P>
              The scale says <strong className="text-[var(--primary)]">20 pounds</strong> for both. Same result. The
              mirror may say something completely different. That is why body composition matters.
            </P>
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-2xl border border-[var(--border)] bg-white p-4 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">Your objective isn’t</div>
                <div className="mt-1 text-xl font-bold text-[var(--primary)]/50 line-through">Become lighter.</div>
              </div>
              <IconArrowRight className="mx-auto h-6 w-6 rotate-90 text-[var(--accent-dark)] sm:rotate-0" />
              <div className="rounded-2xl bg-[var(--primary)] p-4 text-center text-white">
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">A better objective</div>
                <div className="mt-1 text-xl font-bold">Become leaner while staying strong.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card>
            <H3>Watch your strength</H3>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              One of the simplest signals available to you is training performance. You don’t need personal records
              every week during fat loss. But if strength starts collapsing across multiple exercises, pay attention.
              Ask why:
            </p>
            <ul className="mt-3 space-y-1.5 text-[var(--primary)]/80">
              {[
                "Has food intake become extremely low?",
                "Has protein dropped?",
                "Has sleep gotten worse?",
                "Are you doing too much training?",
                "Has cardio suddenly doubled?",
                "Are you dehydrated?",
                "Are you simply having one bad workout?",
              ].map((q) => (
                <li key={q} className="flex gap-2">
                  <span className="text-[var(--accent-dark)]">?</span>
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-semibold text-[var(--primary)]">Look for patterns. Don’t catastrophize one session.</p>
          </Card>
          <Card>
            <H3>Don’t let low appetite become low-nutrition living</H3>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              Being less hungry can make fat loss dramatically easier. It can also make it easier to accidentally eat
              very little. And very little food can mean very little:
            </p>
            <div className="mt-3">
              <Chips items={["Protein", "Fiber", "Micronutrients", "Carbs around training", "Overall energy"]} />
            </div>
            <p className="mt-4 leading-relaxed text-[var(--primary)]/80">
              The goal is not to see how little food you can survive on. It’s to create an environment where fat loss
              can occur while your body still has what it needs to function, train, and recover.
            </p>
          </Card>
        </div>

        <div className="mt-14">
          <H3>Your Phase 2 priorities</H3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              ["Protect protein.", "Make it deliberate."],
              ["Keep resistance training.", "Muscle needs a reason to stay."],
              ["Watch performance.", "Trends matter more than individual workouts."],
              ["Keep movement consistent.", "Don’t suddenly double cardio because the scale slowed for four days."],
              ["Pay attention to recovery.", "Fat loss happens inside a living human being. Not a spreadsheet."],
            ].map(([t, b], i) => (
              <Card key={t} className={cx("!p-5", i === 4 && "sm:col-span-2")}>
                <div className="font-bold">{t}</div>
                <div className="mt-1 text-[var(--primary)]/75">{b}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <Callout tone="warn" title="Phase 2 warning signs">
            <p>
              These don’t automatically mean something is wrong. They mean <strong>pay attention.</strong>
            </p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {[
                "Strength consistently declining",
                "Persistent exhaustion",
                "Difficulty completing normal training",
                "Frequent dizziness or weakness",
                "Significant trouble eating enough nutritious food",
                "Recovery getting progressively worse",
                "Rapid changes that concern you",
                "Persistent or severe gastrointestinal symptoms",
              ].map((w) => (
                <li key={w} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                  {w}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">
              Health concerns belong with a qualified healthcare professional. A fat-loss goal is never more important
              than your health.
            </p>
          </Callout>
        </div>
      </Wrap>
    </Block>
  );
}

function PersonCard({ who, text, fat }: { who: string; text: string; fat: number }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <div className="font-bold">{who}</div>
        <div className="text-2xl font-black tabular-nums">−20 lb</div>
      </div>
      <div className="mt-3 flex h-4 overflow-hidden rounded-full" aria-hidden="true">
        <div className="h-full bg-[var(--accent-dark)]" style={{ width: `${fat}%` }} />
        <div className="h-full w-0.5 bg-white" />
        <div
          className="h-full flex-1 bg-[#155090]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,.3) 0 3px, transparent 3px 7px)" }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[var(--primary)]/60">
        <span>Fat</span>
        <span>Lean tissue</span>
      </div>
      <p className="mt-3 text-[var(--primary)]/75">{text}</p>
    </Card>
  );
}

/* ---------------- phase 3 ---------------- */

function Phase3() {
  return (
    <Block id="phase-3">
      <PhaseStripe index={2} />
      <Wrap narrow>
        <PhaseHeader index={2} />
        <div className="space-y-5">
          <Lead>
            You are ten pounds lighter. That matters. You are literally operating in a different body than the one that
            started.
          </Lead>
          <P>And this is often where people experience their first psychologically difficult stretch, because early progress creates an expectation.</P>
          <div className="grid grid-cols-4 gap-2 text-center text-sm font-semibold">
            {["The scale moved.", "Then it moved again.", "Then again.", "And eventually… it doesn’t."].map((t, i) => (
              <div
                key={t}
                className={cx(
                  "rounded-xl p-3",
                  i < 3 ? "bg-[var(--accent)]/20 text-[var(--primary)]" : "bg-[var(--primary)] text-white",
                )}
              >
                {t}
              </div>
            ))}
          </div>
          <P>Three days. Five days. Maybe longer. Suddenly the brain starts looking for a problem:</P>
          <div className="flex flex-wrap gap-2">
            {[
              "Did Reta stop working?",
              "Am I eating too much?",
              "Should I eat less?",
              "Should I do more cardio?",
              "Should I change everything?",
            ].map((q) => (
              <span key={q} className="rounded-2xl rounded-bl-sm bg-[var(--muted)] px-4 py-2 font-semibold italic">
                {q}
              </span>
            ))}
          </div>
          <P>This phase has one rule:</P>
          <Statement>Diagnose before you adjust.</Statement>
        </div>

        <div className="mt-14">
          <H3>First question: is this actually a plateau?</H3>
          <P className="mt-2">
            A few days at the same body weight is not automatically a plateau. Fat loss is happening underneath noisy
            measurements. All of these can hide progress or change scale weight:
          </P>
          <div className="mt-4">
            <Chips items={["Water retention", "Digestion", "Hard training", "Hormonal fluctuations", "Sodium", "Travel", "Stress"]} />
          </div>
          <div className="mt-6">
            <TrendIllustration />
          </div>
          <P className="mt-6">Look at the trend. Then look at your other measurements.</P>
          <Dots
            className="mt-3"
            items={[
              "Maybe body weight stayed flat while your waist dropped.",
              "Maybe the scale barely changed while photos look noticeably different.",
              "Maybe nothing changed for several days and then weight dropped quickly.",
            ]}
          />
          <p className="mt-5 text-lg font-bold text-[var(--primary)]">The body does not owe you a perfectly linear graph.</p>
        </div>

        <div className="mt-14">
          <P className="mb-5">Before you decide your strategy needs a major change, run through this:</P>
          <PlateauChecklist />
        </div>

        <div className="mt-14">
          <H3>The most important skill in Phase 3</H3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]/50">Not</div>
              <div className="mt-1 text-xl font-bold text-[var(--primary)]/50">Passive patience</div>
            </div>
            <div className="rounded-2xl bg-[var(--primary)] p-5 text-white">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">But</div>
              <div className="mt-1 text-xl font-bold">Data-driven patience</div>
            </div>
          </div>
          <P className="mt-5">
            You’re still paying attention. You’re still executing. You’re still looking for patterns. You’re simply
            refusing to react emotionally to every fluctuation.
          </P>
          <P className="mt-3">
            That’s a skill. And it’s one of the biggest differences between someone who finishes a transformation and
            someone who spends years restarting one.
          </P>
        </div>
      </Wrap>
    </Block>
  );
}

/* ---------------- phase 4 ---------------- */

function Phase4() {
  return (
    <Block id="phase-4" className="bg-[var(--muted)]/50">
      <PhaseStripe index={3} />
      <Wrap narrow>
        <PhaseHeader index={3} />
        <div className="space-y-5">
          <Lead>
            Five pounds left. You can see the finish line. And ironically, this can become the most dangerous
            psychological phase.
          </Lead>
          <P>
            Five pounds suddenly feels like it should disappear immediately. You’ve already lost fifteen. You’ve been
            doing this for a while. You’re ready to be done. So patience drops, and the temptation to force progress
            goes up. This is when people start throwing everything at the wall:
          </P>
          <Chips strike items={["More restriction", "More cardio", "More training", "More everything"]} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <div className="text-sm text-[var(--primary)]/60">The last five pounds rarely need</div>
              <div className="text-2xl font-bold text-[var(--primary)]/50 line-through">panic.</div>
            </div>
            <div className="rounded-2xl bg-[var(--primary)] p-5 text-white">
              <div className="text-sm text-white/70">They usually need</div>
              <div className="text-2xl font-bold">precision.</div>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <H3>The body you’re working with has changed</H3>
          <div className="mt-5 flex items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm sm:gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-[var(--primary)]/45 sm:text-5xl">190</div>
              <div className="text-sm text-[var(--primary)]/55">started at</div>
            </div>
            <IconArrowRight className="h-8 w-8 text-[var(--accent-dark)]" />
            <div className="text-center">
              <div className="text-4xl font-black sm:text-5xl">175</div>
              <div className="text-sm text-[var(--primary)]/55">now</div>
            </div>
          </div>
          <P className="mt-5">
            That smaller body generally requires less energy to move through the world. They may also be eating,
            moving, training, and recovering differently. The strategy that created early progress may need
            refinement.
          </P>
          <P className="mt-3">
            That’s normal. It does not automatically mean anything has “stopped working.”{" "}
            <strong className="text-[var(--primary)]">The conditions changed. So you reassess the conditions.</strong>
          </P>
        </div>

        <div className="mt-14">
          <Checklist
            storeKey="p4-basics"
            title="Before you push harder, tighten the basics"
            intro="Tick everything that’s honestly true right now."
            threshold={8}
            items={[
              "Protein is where it should be.",
              "Daily movement is consistent.",
              "Weekends aren’t dramatically different from weekdays.",
              "I’m training productively.",
              "I’m recovering.",
              "I’m sleeping.",
              "I’m measuring progress accurately.",
              "I’m not expecting the final five pounds to move at the same speed as the first five.",
            ]}
            passMessage={
              <>
                <strong>The basics are tight.</strong> Keep executing and let the process finish. If the trend has truly
                stalled for weeks, run the Plateau Checklist before reaching for anything dramatic.
              </>
            }
            pendingMessage="Often the answer isn’t another dramatic intervention. It’s tightening one or two boring things you stopped paying attention to."
            missingTitle="Your one or two boring things to tighten:"
          />
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card>
            <H3>Keep your muscle until the finish line</H3>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              People sometimes treat muscle preservation as an early-stage concern. It matters all the way through.
              Continue resistance training. Continue eating adequate protein.
            </p>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              Nobody works this hard just to become a smaller version of a body they still don’t feel good in. You
              want:
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Shape", "Strength", "Definition", "Capability"].map((t) => (
                <div key={t} className="rounded-xl bg-[var(--muted)] px-3 py-2 text-center font-bold">
                  {t}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-[var(--primary)]">Muscle contributes to all four.</p>
          </Card>
          <Card>
            <H3>Don’t let the goal weight become an obsession</H3>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              You picked <strong>150</strong> six months ago because it sounded right. Then you get to{" "}
              <strong>154</strong> and love how you look. Your strength is good. Your waist has changed dramatically.
              Your clothes fit perfectly. Your energy is great.
            </p>
            <p className="mt-3 text-lg font-bold">Do you actually need four more pounds?</p>
            <p className="mt-1 text-[var(--primary)]/70">Maybe. Maybe not.</p>
            <p className="mt-3 rounded-xl bg-[var(--primary)] p-3 text-sm font-semibold text-white">
              The number is supposed to serve the outcome. The outcome is not supposed to serve the number.
            </p>
            <p className="mt-3 text-sm text-[var(--primary)]/70">Reassess. Your goal can change as you learn more about your body.</p>
          </Card>
        </div>
      </Wrap>
    </Block>
  );
}

/* ---------------- tools ---------------- */

function Tools() {
  return (
    <Block id="tools" className="bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)] text-white">
      <Wrap>
        <div id="scorecard" className="scroll-mt-[160px] max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Use every week
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">The 20-Pound Scorecard</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/85">
            Once per week, check these. Don’t obsess. Just pay attention. Your answers run through the weekly decision
            tree to answer the question that matters most:{" "}
            <strong className="text-white">Do I actually need to change anything this week?</strong>
          </p>
          <p className="mt-2 text-sm text-white/60">Saved only in this browser. Nothing is sent anywhere.</p>
        </div>
        <div className="mt-10 text-[var(--primary)]">
          <Scorecard />
        </div>
      </Wrap>
    </Block>
  );
}

function WhatNotToDo() {
  const items = [
    ["Don’t chase the fastest possible scale drop", "Faster is not automatically better. You care about what the 20 pounds are made of."],
    ["Don’t make the scale your only feedback system", "Weight. Waist. Photos. Training performance. Energy. Clothes. Use the whole picture."],
    ["Don’t change everything after one bad week", "One strange week is normal. A repeatable pattern deserves attention."],
    ["Don’t let appetite suppression replace nutrition", "Eating less and eating well are different skills."],
    ["Don’t abandon strength training to lose fat", "This is precisely when muscle needs a reason to stay."],
    [
      "Don’t assume more is always better",
      "More restriction, more cardio, more training, more interventions: every additional variable has a cost. Use the minimum complexity required to create the desired result.",
    ],
  ];
  return (
    <Block id="avoid">
      <Wrap>
        <div className="max-w-3xl">
          <Eyebrow>Avoid these</Eyebrow>
          <H2 className="mt-4">What not to do</H2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(([t, b]) => (
            <Card key={t}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <IconX className="h-5 w-5" />
              </span>
              <div className="mt-3 text-lg font-bold leading-snug">{t}</div>
              <p className="mt-2 leading-relaxed text-[var(--primary)]/75">{b}</p>
            </Card>
          ))}
        </div>
      </Wrap>
    </Block>
  );
}

/* ---------------- phase 5 ---------------- */

function Phase5() {
  return (
    <Block id="phase-5" className="bg-[var(--muted)]/50">
      <PhaseStripe index={4} />
      <Wrap narrow>
        <Eyebrow>What happens after pound 20?</Eyebrow>
        <div className="mt-5 space-y-4">
          <Lead>
            This might be the most important section in this entire roadmap. Because losing twenty pounds is temporary.
            You cannot spend your entire life trying to lose weight.
          </Lead>
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-center">
              <div className="text-xl font-bold">Creating the body</div>
              <div className="mt-1 text-sm text-[var(--primary)]/60">Looking for change</div>
            </div>
            <IconArrowRight className="mx-auto h-6 w-6 rotate-90 text-[var(--accent-dark)] sm:rotate-0" />
            <div className="rounded-2xl bg-[var(--primary)] p-5 text-center text-white">
              <div className="text-xl font-bold">Living in the body</div>
              <div className="mt-1 text-sm text-white/70">Looking for stability</div>
            </div>
          </div>
          <P>That requires a different mindset, and different feedback.</P>
        </div>

        <div className="mt-14">
          <PhaseHeader index={4} />
          <div className="space-y-5">
            <Lead>That’s a good thing. You don’t need a new transformation every month. You need your new body to begin feeling normal.</Lead>
            <P>Continue the habits that created the result:</P>
            <Chips items={["Protein", "Strength training", "Movement", "Sleep", "Reasonable nutrition", "Regular check-ins"]} />
            <P>
              You may eventually pay less attention to the scale, to tracking, to every meal.{" "}
              <strong className="text-[var(--primary)]">That is often a sign of success.</strong> The structure taught
              you the skills. Now the skills become part of your life.
            </P>
          </div>
        </div>

        <div className="mt-14">
          <H3>Expect a range, not a perfect number</H3>
          <P className="mt-2">
            Maintenance is not <span className="font-semibold line-through">goal weight = 150.0 forever</span>. Human
            bodies fluctuate.
          </P>
          <MaintenanceRange />
          <P className="mt-5">
            Your weight may move several pounds with hydration, food, carbohydrates, sodium, digestion, hormonal
            changes, travel, and training. Maintenance is better thought of as a range.{" "}
            <strong className="text-[var(--primary)]">The goal is to notice meaningful drift before ten pounds quietly return.</strong>
          </P>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card>
            <H3>Keep training</H3>
            <p className="mt-3 leading-relaxed text-[var(--primary)]/80">
              Once active fat loss ends, training can become even more rewarding. You can focus more attention on:
            </p>
            <Dots
              className="mt-3"
              items={["Strength", "Performance", "Building muscle", "Athletic goals", "Feeling capable", "Seeing what your body can do"]}
            />
            <p className="mt-3 font-semibold">The scale no longer needs to be the center of the story.</p>
          </Card>
          <Card className="!border-transparent !bg-[var(--primary)] text-white">
            <h3 className="text-xl font-bold sm:text-2xl">The real 20-pound goal</h3>
            <p className="mt-3 text-white/80">
              You probably started wanting a smaller number. That’s normal. But twenty pounds later, the best outcome
              is bigger than that. You know:
            </p>
            <ul className="mt-3 space-y-1.5 text-white/90">
              {[
                "how to structure your nutrition",
                "why protein matters",
                "the value of resistance training",
                "how to interpret a weird week without panicking",
                "that faster isn’t always better",
                "what your body looks like when it’s functioning well",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-bold">
              And most importantly: you have evidence that you can follow through. That’s the part nobody can take away
              from you.
            </p>
          </Card>
        </div>
      </Wrap>
    </Block>
  );
}

function MaintenanceRange() {
  // Illustrative wobble inside a band.
  const pts = [0.2, -0.5, 0.6, 0.1, -0.7, 0.4, 0.9, -0.2, -0.6, 0.3, 0.7, -0.3, 0.1, -0.8, 0.5, 0.2];
  const W = 600;
  const H = 120;
  const y = (v: number) => H / 2 - v * 34;
  const x = (i: number) => 20 + (i / (pts.length - 1)) * (W - 40);
  return (
    <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Illustration: weight wobbling up and down inside a maintenance range band">
        <rect x={10} y={y(1.25)} width={W - 20} height={y(-1.25) - y(1.25)} rx={10} fill="#78DCE5" fillOpacity={0.18} />
        <line x1={10} x2={W - 10} y1={H / 2} y2={H / 2} stroke="#155090" strokeOpacity={0.25} strokeDasharray="4 5" />
        <path
          d={pts.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("")}
          fill="none"
          stroke="#155090"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {pts.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={4} fill="#155090" stroke="#fff" strokeWidth={2} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-xs text-[var(--primary)]/55">
        <span>Your maintenance range (shaded)</span>
        <span>Illustration</span>
      </div>
    </div>
  );
}

/* ---------------- one-page summary ---------------- */

function OnePage() {
  const { located } = usePosition();
  return (
    <Block id="summary">
      <Wrap>
        <div className="max-w-3xl">
          <Eyebrow>Save this</Eyebrow>
          <H2 className="mt-4">The entire roadmap on one page</H2>
          <P className="mt-3">Come back to it every five pounds. Ask yourself what phase you’re actually in.</P>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PHASES.map((p, i) => {
            const here = located?.phase === i;
            return (
              <div
                key={p.id}
                className={cx(
                  "flex flex-col rounded-2xl border-2 bg-white p-5 transition-shadow",
                  here ? "border-[var(--primary)] shadow-xl" : "border-[var(--border)]",
                )}
              >
                <div className="h-1.5 w-10 rounded-full" style={{ background: PHASE_COLORS[i] }} />
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-[var(--primary)]/55">
                  {i === 4 ? "After 20" : `Pounds ${p.range.replace(" lb", "")}`}
                </div>
                <div className="mt-1 text-lg font-bold leading-tight">{p.pageTitle}</div>
                {here && (
                  <div className="mt-2 inline-flex w-fit rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs font-semibold text-white">
                    You are here
                  </div>
                )}
                <div className="mt-3 text-xs font-semibold text-[var(--primary)]/55">Focus on</div>
                <ul className="mt-1 flex-1 space-y-1 text-sm text-[var(--primary)]/80">
                  {p.focus.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[var(--accent-dark)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-xl bg-[var(--muted)] p-3 text-sm font-semibold italic">{p.question}</div>
              </div>
            );
          })}
        </div>
      </Wrap>
    </Block>
  );
}

/* ---------------- finish ---------------- */

function FinalThought() {
  return (
    <Block id="finish" className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
      <Wrap narrow>
        <Eyebrow>Final thought</Eyebrow>
        <H2 className="mt-4">Twenty pounds sounds like one goal. It isn’t.</H2>
        <div className="mt-6 space-y-4">
          <P>
            It’s dozens of decisions made across a body that keeps changing while you’re making them. That’s why a
            roadmap matters.
          </P>
          <ol className="grid gap-2 sm:grid-cols-5">
            {["Build structure", "Protect muscle", "Learn to diagnose", "Finish patiently", "Enjoy what you built"].map((t, i) => (
              <li key={t} className="rounded-xl bg-white p-3 text-sm font-semibold shadow-sm">
                <span className="mb-1 block h-1 w-6 rounded-full" style={{ background: PHASE_COLORS[i] }} />
                {t}
              </li>
            ))}
          </ol>
          <P>
            You do not need to predict every obstacle. You need a framework that tells you what matters when an
            obstacle shows up. Save this roadmap. Come back to it every five pounds. Then solve the problem that belongs
            to <strong className="text-[var(--primary)]">that phase</strong>.
          </P>
          <P className="font-semibold text-[var(--primary)]">
            That’s how you stop guessing your way through twenty pounds, and start understanding what you’re doing.
          </P>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-8 text-center text-white shadow-2xl sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[var(--accent)]/20 blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to start your roadmap?</h3>
            <p className="mx-auto mt-4 max-w-xl text-white/85">
              You have the map. When you’re ready, get your retatrutide from Peak State Labs.
            </p>
            <a
              href={SHOP_URL}
              onClick={() => shopClick("final")}
              className="btn-accent mt-7 inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-10 text-lg font-semibold"
            >
              Shop Reta <IconArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </Wrap>
    </Block>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <Wrap narrow className="py-12">
        <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-sm leading-relaxed text-white/75 sm:p-6">
          <div className="mb-2 font-bold text-white">Important retatrutide note</div>
          <p>
            Retatrutide remains an investigational medication as of November 2026. It has not been approved by the U.S.
            Food and Drug Administration or any other regulatory authority for consumer use. Clinical research is
            ongoing.
          </p>
          <p className="mt-3">
            This roadmap is provided for general education about fat loss, body composition, nutrition, training, and
            the research surrounding retatrutide. It does not provide individualized medical advice, dosing
            instructions, or a recommendation to use an investigational drug.
          </p>
          <p className="mt-3">
            Questions about weight-management treatment, medication eligibility, side effects, or changes in treatment
            should be discussed with a qualified healthcare professional.
          </p>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-sm text-white/60 sm:flex-row">
          <Link href="/" className="flex items-center gap-2 font-bold text-white">
            <img src="/logo.png" alt="" className="h-6 w-6 rounded-md" />
            Peak State Labs
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear your saved phase, checklists, and scorecard history from this browser?")) resetAll();
            }}
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <IconReset className="h-4 w-4" /> Reset my saved progress
          </button>
        </div>
      </Wrap>
    </footer>
  );
}
