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

function MetaLine() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-[var(--primary)]/55 tracking-wide">
      <span>Free access</span>
      <span className="h-1 w-1 rounded-full bg-[var(--primary)]/30" />
      <span>Releases Friday</span>
      <span className="h-1 w-1 rounded-full bg-[var(--primary)]/30" />
      <span>One email</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
  );
}

export default function StructuredPeptidesPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      <main>
        {/* HERO */}
        <Section className="relative overflow-hidden gradient-hero !py-20 sm:!py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--accent)]/15 blur-3xl animate-float" />
            <div className="absolute top-1/2 left-[-15%] h-[24rem] w-[24rem] rounded-full bg-[var(--accent)]/10 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-1/3 h-72 w-72 rounded-full bg-[var(--primary)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-5 py-2 text-xs sm:text-sm font-bold tracking-[0.18em] text-[var(--accent-dark)] uppercase animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>Free Training — Releasing Friday</span>
              </div>

              <h1 className="mt-8 text-balance text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in-up">
                You&apos;ve been using peptides.
                <span className="block mt-3 bg-gradient-to-r from-[var(--primary)]/40 via-[var(--primary)]/55 to-[var(--primary)]/40 bg-clip-text text-transparent">
                  You haven&apos;t been using them right.
                </span>
              </h1>

              <p className="mt-8 text-lg sm:text-xl text-[var(--primary)]/75 max-w-2xl leading-relaxed animate-fade-in-up stagger-2">
                And if you haven&apos;t started yet — that&apos;s actually the
                better position to be in. Most people spend two years
                unlearning the habits this training will help you skip
                entirely. The structure behind real results is the same
                whether you&apos;re on day one or year three. Almost nobody
                teaches it either way.
              </p>

              <div className="mt-10 w-full max-w-xl animate-fade-in-up stagger-3">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Reserve my spot — Free peptide training"
                  bodyHint="Reserve my spot for the free training:"
                  buttonLabel="Reserve my spot"
                  helperText={null}
                />
              </div>

              <div className="mt-6 animate-fade-in stagger-4">
                <MetaLine />
              </div>
            </div>
          </Container>
        </Section>

        {/* QUIET TRUTH */}
        <Section className="!py-20 sm:!py-28">
          <Container>
            <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
              <p className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[var(--accent-dark)]">
                Something nobody wants to say out loud
              </p>
              <Divider />
              <p className="mt-8 text-lg sm:text-xl text-[var(--primary)]/80 leading-relaxed">
                The information problem isn&apos;t that it&apos;s hard to
                find. It&apos;s that there&apos;s too much of it, most of it
                is wrong, and almost all of it skips the part that actually
                determines what happens to your body.
              </p>
              <p className="mt-6 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed">
                TikTok clips. Reddit threads. Influencer stacks assembled by
                people who couldn&apos;t explain a feedback loop if their
                lives depended on it. You&apos;ve read enough of it to feel
                informed. You&apos;ve probably tried enough of it to know
                something&apos;s missing.
              </p>

              <div className="mt-12 w-full">
                <div className="relative mx-auto max-w-2xl rounded-3xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--muted)] to-white px-8 py-10 shadow-sm">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-bold tracking-widest uppercase text-[var(--primary)]">
                    The shift
                  </span>
                  <p className="text-xl sm:text-2xl italic font-medium text-[var(--primary)] leading-snug">
                    The compound was never the strategy. The compound was a
                    variable inside a system you haven&apos;t been taught to
                    see yet.
                  </p>
                </div>
              </div>

              <p className="mt-10 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed">
                And once you see it, the way you&apos;ve been approaching
                this will start to look obvious in the wrong direction.
              </p>
            </div>
          </Container>
        </Section>

        {/* WHAT'S ACTUALLY HAPPENING */}
        <Section className="relative overflow-hidden bg-[var(--muted)] !py-20 sm:!py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-[var(--accent)]/10 blur-3xl" />
          </div>
          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                This is what&apos;s actually happening
              </h2>
              <Divider />
              <p className="mt-8 text-lg text-[var(--primary)]/80 leading-relaxed">
                Two people. Same compound. Completely different outcomes.
                One builds momentum, the other creates dependency. Neither
                one fully understands why.
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-2 w-full">
                <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-green-50 text-green-700 font-bold mx-auto">
                    A
                  </div>
                  <p className="mt-4 text-center font-semibold">
                    Builds momentum
                  </p>
                  <p className="mt-2 text-center text-sm text-[var(--primary)]/65 leading-relaxed">
                    The compound landed in a structured environment. The
                    body cooperated.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-rose-50 text-rose-700 font-bold mx-auto">
                    B
                  </div>
                  <p className="mt-4 text-center font-semibold">
                    Creates dependency
                  </p>
                  <p className="mt-2 text-center text-sm text-[var(--primary)]/65 leading-relaxed">
                    Same compound, no structure. The body learned to lean
                    on it.
                  </p>
                </div>
              </div>

              <p className="mt-10 text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
                Peptides amplify the environment they&apos;re introduced
                into. That&apos;s the mechanism. Full stop. Which means the
                result you&apos;re getting right now — whatever it is — is
                a direct reflection of the metabolic conditions you created
                before you ever loaded a syringe.
              </p>
              <p className="mt-6 text-base sm:text-lg text-[var(--primary)]/75 leading-relaxed">
                So when the results plateau, when the rebound hits, when
                recovery falls apart, when motivation bottoms out and the
                body just stops — that&apos;s not a compound problem.
                It&apos;s a structure problem. And nobody&apos;s selling
                structure.
              </p>
            </div>
          </Container>
        </Section>

        {/* WHY THE RESULTS DON'T STICK */}
        <Section className="!py-20 sm:!py-28">
          <Container>
            <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Why the results don&apos;t stick
              </h2>
              <Divider />

              <ul className="mt-12 grid gap-4 sm:grid-cols-2 w-full">
                {stuckPoints.map((point, i) => (
                  <li
                    key={point}
                    className="group relative rounded-2xl border border-[var(--border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 font-bold text-[var(--accent-dark)] transition group-hover:bg-[var(--accent)] group-hover:text-[var(--primary)]">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-4 text-[var(--primary)]/80 leading-relaxed">
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>

        {/* WHAT THIS TRAINING COVERS */}
        <Section className="relative overflow-hidden bg-gradient-to-b from-[var(--muted)] via-[var(--muted)] to-white !py-20 sm:!py-28">
          <Container className="relative">
            <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
              <p className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[var(--accent-dark)]">
                Inside the training
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                What this training actually covers
              </h2>
              <Divider />

              <p className="mt-8 text-lg text-[var(--primary)]/80 leading-relaxed max-w-2xl">
                This isn&apos;t a compound breakdown. That content exists.
                Most of it will waste your time.
              </p>
              <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70 leading-relaxed max-w-2xl">
                This is the system underneath the result. The part that
                determines whether any given compound does anything useful at
                all — or just accelerates a pattern that was already broken.
              </p>

              <div className="mt-14 grid gap-6 sm:grid-cols-2 w-full">
                {modules.map((m) => (
                  <div
                    key={m.n}
                    className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-xl"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-6 right-4 text-7xl font-black tracking-tighter text-[var(--accent)]/15 group-hover:text-[var(--accent)]/30 transition"
                    >
                      {m.n}
                    </div>
                    <span className="relative inline-block text-xs font-bold tracking-widest uppercase text-[var(--accent-dark)]">
                      Module {m.n}
                    </span>
                    <h3 className="relative mt-3 text-xl font-bold leading-snug text-[var(--primary)]">
                      {m.title}
                    </h3>
                    <p className="relative mt-3 text-[var(--primary)]/70 leading-relaxed">
                      {m.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* WHO THIS IS FOR */}
        <Section className="!py-20 sm:!py-28">
          <Container>
            <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Who this is for
              </h2>
              <Divider />

              <div className="mt-12 grid gap-6 sm:grid-cols-3 w-full">
                {[
                  "People who've gotten results and lost them and want to understand why.",
                  "People just starting who want to skip the years of trial-and-error that isn't actually necessary.",
                  "People who are tired of reading fragmented advice from sources that have no accountability for what happens to your body afterward.",
                ].map((line, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm text-center"
                  >
                    <div className="mx-auto h-1.5 w-10 rounded-full bg-[var(--accent)]" />
                    <p className="mt-5 text-[var(--primary)]/80 leading-relaxed">
                      {line}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-12 max-w-2xl rounded-3xl border border-[var(--accent)]/40 bg-gradient-to-br from-[var(--muted)] to-white px-8 py-8">
                <p className="text-xl sm:text-2xl italic font-medium text-[var(--primary)] leading-snug">
                  If you already know everything, this isn&apos;t for you.
                  But if there&apos;s a gap between what you expected and
                  what you got — there&apos;s something here you haven&apos;t
                  seen yet.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* TESTIMONIALS */}
        <Section className="bg-[var(--muted)] !py-20 sm:!py-28">
          <Container>
            <div className="mx-auto max-w-5xl flex flex-col items-center text-center">
              <p className="text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-[var(--accent-dark)]">
                What people are saying
              </p>
              <Divider />

              <div className="mt-12 grid gap-6 md:grid-cols-3 w-full">
                {testimonials.map((t) => (
                  <figure
                    key={t.name}
                    className="flex h-full flex-col items-center justify-between rounded-2xl border border-[var(--border)] bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div
                      aria-hidden
                      className="text-5xl leading-none text-[var(--accent)]"
                    >
                      &ldquo;
                    </div>
                    <blockquote className="mt-2 italic text-[var(--primary)]/85 leading-relaxed">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-5 text-sm font-semibold tracking-wide text-[var(--primary)]/60">
                      — {t.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* FINAL CTA */}
        <Section className="relative overflow-hidden !py-24 sm:!py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-[var(--muted)] to-white" />
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[50rem] rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl animate-float" />
          </div>

          <Container className="relative">
            <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-white/70 backdrop-blur px-5 py-2 text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>Friday Drop</span>
              </div>

              <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                The training goes live{" "}
                <span className="bg-gradient-to-r from-[var(--accent-dark)] to-[var(--primary)] bg-clip-text text-transparent">
                  Friday.
                </span>
              </h2>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/75 leading-relaxed max-w-2xl">
                Free to the public first. Whether it stays that way depends
                on what happens after it drops. Enter your email and
                you&apos;ll get access the moment it&apos;s live.
              </p>

              <div className="mt-10 w-full max-w-xl">
                <EmailCapture
                  emailTo="peakstatelabs@gmail.com"
                  subject="Reserve my spot — Free peptide training"
                  bodyHint="Reserve my spot for the free training:"
                  buttonLabel="Reserve my spot"
                  helperText={null}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-[var(--primary)]/55 tracking-wide">
                <span>Free access</span>
                <span className="h-1 w-1 rounded-full bg-[var(--primary)]/30" />
                <span>Releases Friday</span>
                <span className="h-1 w-1 rounded-full bg-[var(--primary)]/30" />
                <span>No spam</span>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-[var(--border)] py-10 text-sm text-[var(--primary)]/60">
        <Container>
          <p className="text-center">
            © {new Date().getFullYear()} Peak State Labs.
          </p>
        </Container>
      </footer>
    </div>
  );
}
