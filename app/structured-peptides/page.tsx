import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { EmailCapture } from "@/app/components/EmailCapture";

export const metadata: Metadata = {
  title:
    "You've been using peptides. You haven't been using them right. — Free Training",
  description:
    "Free training releasing Friday. The structure behind real peptide results — what almost nobody teaches. One email gets you access the moment it's live.",
  alternates: { canonical: "/structured-peptides" },
};

const stuckPoints = [
  "Appetite suppression isn't fat loss — it's caloric disruption inside a system that's already trying to compensate",
  "GLP-1 rebounds happen for a reason that has nothing to do with willpower or dosing",
  "Recovery is the most important variable in body recomposition and the most consistently ignored",
  "Stacking without understanding interaction dynamics is how you create a body that stops trusting input",
  "Emotional decision-making about compounds produces emotional results",
  "Most people don't lose progress — they never actually built it. They borrowed it.",
];

const modules = [
  {
    n: "01",
    title: "Why peptide users stay stuck in reaction mode",
    body:
      "The cycle that keeps people chasing protocols instead of building physiology.",
  },
  {
    n: "02",
    title: "The real role compounds play in metabolism and recovery",
    body: "What the physiology actually says — not the sales pitch version.",
  },
  {
    n: "03",
    title: "The hidden reason GLP-1 results rebound",
    body: "It's not the drug. It's what the drug was dropped into.",
  },
  {
    n: "04",
    title: "How advanced users think about stacking strategy",
    body:
      "The mental model that separates compounding results from compounding problems.",
  },
  {
    n: "05",
    title: "The structure behind sustainable fat loss and lean muscle",
    body:
      "Why the timeline matters more than the compound and what to build before you reach for either.",
  },
  {
    n: "06",
    title: "How to stop approaching this emotionally",
    body: "The shift that changes every decision you make after this.",
  },
];

const testimonials = [
  {
    quote:
      "First time something explained the rebound in a way that actually made sense. I changed two things and the plateau broke in three weeks.",
    name: "M.T., 34",
  },
  {
    quote:
      "I was dosing correctly and getting nowhere. This reframed the entire thing. Now I understand what I'm actually trying to do.",
    name: "R.K., 41",
  },
  {
    quote:
      "Been in this space for years. This is the first time someone explained structure before compounds. Should have been first.",
    name: "D.A., 38",
  },
];

export default function StructuredPeptidesPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <main>
        <Section className="relative overflow-hidden gradient-hero !py-16 sm:!py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl">
              <p className="text-sm font-bold tracking-[0.2em] text-[var(--accent-dark)] uppercase">
                Free Training — Releasing Friday
              </p>
              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                You&apos;ve been using peptides.
                <span className="block text-[var(--primary)]/50 mt-2">
                  You haven&apos;t been using them right.
                </span>
              </h1>
              <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-2xl leading-relaxed">
                And if you haven&apos;t started yet — that&apos;s actually the
                better position to be in. Most people spend two years
                unlearning the habits this training will help you skip
                entirely. The structure behind real results is the same
                whether you&apos;re on day one or year three. Almost nobody
                teaches it either way.
              </p>

              <p className="mt-6 text-sm text-[var(--primary)]/50 tracking-wide">
                Free access &nbsp;·&nbsp; Releases Friday &nbsp;·&nbsp; One email
              </p>

              <div id="reserve" className="mt-8 max-w-xl">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Reserve my spot — Free peptide training"
                  bodyHint="Reserve my spot for the free training:"
                  buttonLabel="Reserve my spot"
                  helperText={null}
                />
              </div>
            </div>
          </Container>
        </Section>

        <Section className="!py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl">
              <p className="font-bold text-[var(--primary)]">
                Something nobody wants to say out loud:
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                The information problem isn&apos;t that it&apos;s hard to
                find. It&apos;s that there&apos;s too much of it, most of it
                is wrong, and almost all of it skips the part that actually
                determines what happens to your body.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                TikTok clips. Reddit threads. Influencer stacks assembled by
                people who couldn&apos;t explain a feedback loop if their
                lives depended on it. You&apos;ve read enough of it to feel
                informed. You&apos;ve probably tried enough of it to know
                something&apos;s missing.
              </p>
              <p className="mt-6 text-lg italic text-[var(--primary)] leading-relaxed">
                The compound was never the strategy. The compound was a
                variable inside a system you haven&apos;t been taught to see
                yet.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                And once you see it, the way you&apos;ve been approaching
                this will start to look obvious in the wrong direction.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-[var(--muted)] !py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                This is what&apos;s actually happening
              </h2>
              <p className="mt-6 text-[var(--primary)]/75 leading-relaxed">
                Two people. Same compound. Completely different outcomes. One
                builds momentum, the other creates dependency. Neither one
                fully understands why.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                Peptides amplify the environment they&apos;re introduced
                into. That&apos;s the mechanism. Full stop. Which means the
                result you&apos;re getting right now — whatever it is — is a
                direct reflection of the metabolic conditions you created
                before you ever loaded a syringe.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                So when the results plateau, when the rebound hits, when
                recovery falls apart, when motivation bottoms out and the
                body just stops — that&apos;s not a compound problem.
                It&apos;s a structure problem. And nobody&apos;s selling
                structure.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="!py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Why the results don&apos;t stick
              </h2>
              <ul className="mt-8 space-y-4">
                {stuckPoints.map((point) => (
                  <li
                    key={point}
                    className="flex gap-4 text-[var(--primary)]/75 leading-relaxed"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-dark)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        <Section className="bg-[var(--muted)] !py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                What this training actually covers
              </h2>
              <p className="mt-6 text-[var(--primary)]/75 leading-relaxed">
                This isn&apos;t a compound breakdown. That content exists.
                Most of it will waste your time.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                This is the system underneath the result. The part that
                determines whether any given compound does anything useful at
                all — or just accelerates a pattern that was already broken.
              </p>

              <div className="mt-10 grid gap-5">
                {modules.map((m) => (
                  <div
                    key={m.n}
                    className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                        {m.n}
                      </span>
                      <h3 className="text-lg font-bold text-[var(--primary)]">
                        {m.title}
                      </h3>
                    </div>
                    <p className="mt-2 ml-10 text-[var(--primary)]/70 leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        <Section className="!py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Who this is for
              </h2>
              <p className="mt-6 text-[var(--primary)]/75 leading-relaxed">
                People who&apos;ve gotten results and lost them and want to
                understand why.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                People just starting who want to skip the years of
                trial-and-error that isn&apos;t actually necessary.
              </p>
              <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                People who are tired of reading fragmented advice from
                sources that have no accountability for what happens to your
                body afterward.
              </p>
              <p className="mt-6 text-lg italic text-[var(--primary)] leading-relaxed">
                If you already know everything, this isn&apos;t for you. But
                if there&apos;s a gap between what you expected and what you
                got — there&apos;s something here you haven&apos;t seen yet.
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-[var(--muted)] !py-16 sm:!py-20">
          <Container>
            <div className="max-w-3xl space-y-6">
              {testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm"
                >
                  <blockquote className="italic text-[var(--primary)]/80 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-[var(--primary)]/60">
                    — {t.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </Section>

        <Section className="!py-16 sm:!py-24">
          <Container>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The training goes live Friday.
              </h2>
              <p className="mt-6 text-[var(--primary)]/75 leading-relaxed">
                Free to the public first. Whether it stays that way depends
                on what happens after it drops. Enter your email and
                you&apos;ll get access the moment it&apos;s live.
              </p>

              <div className="mt-8 max-w-xl">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Reserve my spot — Free peptide training"
                  bodyHint="Reserve my spot for the free training:"
                  buttonLabel="Reserve my spot"
                  helperText={null}
                />
              </div>

              <p className="mt-5 text-sm text-[var(--primary)]/50 tracking-wide">
                Free access &nbsp;·&nbsp; Releases Friday &nbsp;·&nbsp; No spam
              </p>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-[var(--border)] py-10 text-sm text-[var(--primary)]/60">
        <Container>
          <p>© {new Date().getFullYear()} Peak State Labs.</p>
        </Container>
      </footer>
    </div>
  );
}
