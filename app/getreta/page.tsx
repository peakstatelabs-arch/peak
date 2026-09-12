import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { reviews } from "@/content/reviews";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";
import { RetaBuy } from "./RetaBuy";
import { RetaDiscountPopup } from "./RetaDiscountPopup";

export const metadata: Metadata = {
  title: "Buy Retatrutide (20mg) — Lab-Tested, Ships in 24h | Peak State Labs",
  description:
    "Retatrutide (LY-3437943) 20mg — the GLP-1 / GIP / glucagon triple agonist. Third-party COA, 99%+ purity, discreet shipping, 1-on-1 coaching included. Single vials and full-cycle bundles.",
  alternates: { canonical: "/getreta" },
};

// COA scans (filenames contain spaces — encode for the URL).
const RETA_COA = [
  { src: "/Reta%20Lab%20Report%202%20Page%201.png", label: "Identity & purity" },
  { src: "/Reta%20Lab%20Report%202%20Page%202.png", label: "Mass spec / HPLC" },
];

// Curated reta-relevant testimonials (fat loss + food noise — retatrutide's
// signature effects). These are Peak State client results; most ran reta as
// the engine of the POWER CUT protocol, which we state plainly below.
const TESTIMONIAL_IDS = [
  "paige-amazed",
  "anon-208",
  "stephanie-wk6",
  "alana-wk1",
  "paige-wk7",
  "greg-wk1",
  "stephanie-wk1",
  "anon-7lbs-b",
];
const testimonials = TESTIMONIAL_IDS.map((id) =>
  reviews.find((r) => r.id === id),
)
  .filter((r): r is NonNullable<typeof r> => Boolean(r))
  // Show each reviewer name only once (keep the first/strongest quote).
  .filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i);

// Transformation photos that exist in /public/reviews.
const transformationPhotos = [
  { src: "/reviews/paige-before-after.jpg", label: "10-week cycle" },
  { src: "/reviews/transform-10wk.jpg", label: "10-week transformation" },
  { src: "/reviews/erin-photo.jpg", label: "2 months in" },
];

// Other single vials — teaser that routes to the full catalog.
const otherSingles = [
  {
    name: "CJC-1295 + Ipamorelin",
    dose: "10mg blend",
    price: "$105",
    image: "/cjc-ipa-product.png",
    note: "Lean muscle, sleep & recovery",
  },
  {
    name: "BPC-157 + TB-500",
    dose: "20mg blend",
    price: "$145",
    image: "/bpc-tb-product.png",
    note: "Joint, tendon & tissue repair",
  },
  {
    name: "GHK-Cu",
    dose: "50mg",
    price: "$85",
    image: "/GHKCU.png",
    note: "Skin, hair & tissue renewal",
  },
  {
    name: "KPV",
    dose: "10mg",
    price: "$65",
    image: "/kpv-product.png",
    note: "Inflammation & gut support",
  },
  {
    name: "NAD+",
    dose: "500mg",
    price: "$135",
    image: "/NAD%20Vial%20Brown.png",
    note: "Cellular energy & recovery",
  },
];

const faqs = [
  {
    q: "Is this real, lab-tested retatrutide?",
    a: "Yes. Every batch is third-party tested for identity and purity (99%+). The current lot's COA is shown above and included with your order — nothing ships without documentation.",
  },
  {
    q: "How is it shipped, and how fast?",
    a: "In-stock vials ship within 24 hours in discreet, temperature-conscious packaging with tracking. The lyophilized (freeze-dried) peptide is stable in transit.",
  },
  {
    q: "How many vials do I need?",
    a: "Research protocols titrate slowly over weeks, so most people run more than a single 20mg vial across a cycle. The two-vial option covers titration into a maintenance dose; the full-cycle option stocks a complete run so you never pause mid-protocol.",
  },
  {
    q: "Do I get dosing help?",
    a: "Every order — even a single vial — includes 1-on-1 coaching and custom dosing guidance dialed in with our calculator and a real coach. You're not left guessing.",
  },
  {
    q: "How is it reconstituted and stored?",
    a: "Reconstitute the lyophilized peptide with bacteriostatic water (add slowly down the side of the vial, swirl — don't shake). Refrigerate at 2–8°C after reconstitution, protect from light, and avoid repeated freeze-thaw. Full handling notes ship with every vial.",
  },
  {
    q: "What's your guarantee?",
    a: "Orders are backed by our satisfaction guarantee. If anything's wrong with your vial, we make it right — reship or refund. Cancel any pre-order before it ships for a full refund.",
  },
];

function StockPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-bold text-emerald-700">
        In Stock • Ships within 24 hrs
      </span>
    </div>
  );
}

function TrustItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]/75">
      <svg
        className="w-4 h-4 flex-shrink-0 text-[var(--accent-dark)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </span>
  );
}

export default function GetRetaPage() {
  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
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
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="/reta"
                className="hidden sm:inline text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
              >
                Research overview
              </a>
              <a
                href="#buy"
                className="hidden sm:inline-flex btn-primary h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
              >
                Get Retatrutide
              </a>
              <ViewCartButton variant="header" />
            </div>
          </Container>
        </header>

        <main>
          {/* ── Hero ─────────────────────────────────────────────── */}
          <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
              <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
            </div>

            <Container className="relative">
              {/* Mobile order: heading → image → button → centered proof.
                  Desktop: text left, image right (unchanged). */}
              <div className="grid gap-y-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
                {/* Heading */}
                <div className="order-1 lg:col-start-1 lg:row-start-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                      <span>RETATRUTIDE • 20MG</span>
                    </div>
                    <StockPill />
                  </div>

                  <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Lose the weight.
                    <span className="block text-[var(--accent-dark)]">
                      Keep the life you actually want.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                    Retatrutide helps quiet food noise, control appetite and
                    support a faster metabolism so getting leaner doesn’t have to
                    consume your entire life.
                  </p>
                </div>

                {/* Product image */}
                <div className="order-2 flex items-center justify-center lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
                  <div className="relative mx-auto w-full max-w-[280px] sm:max-w-md">
                    <img
                      src="/reta-product-transparent-2.png"
                      alt="Retatrutide 20mg research vial"
                      className="w-full drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                    <div className="absolute bottom-4 left-4 rounded-2xl bg-white/90 backdrop-blur border border-[var(--border)] px-4 py-3 shadow-lg">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                        COA Verified
                      </p>
                      <p className="text-sm font-bold text-[var(--primary)]">
                        99%+ purity
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA + proof */}
                <div className="order-3 lg:col-start-1 lg:row-start-2">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="#buy"
                      className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                    >
                      Get Retatrutide
                    </a>
                  </div>

                  {/* Proof strip — centered on mobile, left on desktop */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-[var(--accent-dark)]">
                        {"★★★★★".split("").map((s, i) => (
                          <span key={i} className="text-lg">
                            {s}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-[var(--primary)]/70">
                        70+ verified check-ins
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[var(--primary)]/70">
                      <span className="text-[var(--accent-dark)] font-extrabold">
                        20+ lbs
                      </span>{" "}
                      down in a 10-week cycle
                    </span>
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── Trust bar ────────────────────────────────────────── */}
          <div className="border-y border-[var(--border)] bg-[var(--muted)]">
            <Container className="py-5">
              <div className="mx-auto grid max-w-sm grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8">
                <TrustItem>Third-party COA</TrustItem>
                <TrustItem>99%+ purity</TrustItem>
                <TrustItem>Ships within 24 hrs</TrustItem>
                <TrustItem>1-on-1 coaching</TrustItem>
              </div>
            </Container>
          </div>

          {/* ── Problem / food noise ─────────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                  The reason nothing has stuck
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                  You don’t need more willpower. You need less food noise.
                </h2>
                <p className="mt-6 text-lg text-[var(--primary)]/75 leading-relaxed">
                  You already know what to eat. You know you should stop when
                  you’re full. The hard part is doing it when your brain keeps
                  asking for more. Retatrutide helps turn down the hunger and
                  food noise so eating less feels natural instead of something
                  you have to fight all day.
                </p>
                <div className="mt-8">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold"
                  >
                    Start My Transformation
                  </a>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── What to expect timeline ──────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
                  What a cycle tends to look like
                </h2>
                <p className="mt-4 text-center text-[var(--primary)]/70">
                  Group-level ranges from published trials. Individual response
                  varies — these are not promises.
                </p>
                <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
                  <ul className="space-y-5">
                    {[
                      {
                        week: "Week 1 – 2",
                        body: "Appetite suppression begins as triple-receptor activity ramps up. Mild GI effects can show up during initial adaptation.",
                      },
                      {
                        week: "Week 2 – 4",
                        body: "Cravings and portion sizes drop noticeably. Early body-weight reduction (2 – 5%) starts to appear.",
                      },
                      {
                        week: "Week 4 – 8",
                        body: "Steadier appetite control and continued weight reduction (typically 5 – 10%).",
                      },
                      {
                        week: "Week 8 – 16",
                        body: "Substantial reduction (10 – 18%) with the glucagon arm adding energy expenditure on top.",
                      },
                      {
                        week: "Week 16 – 24+",
                        body: "Major milestones (15 – 22%) with broad metabolic improvements; peak trial efficacy ~24% at the highest dose.",
                      },
                    ].map((row) => (
                      <li key={row.week} className="flex gap-4">
                        <span className="flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                        <div>
                          <p className="font-bold text-[var(--primary)]">
                            {row.week}
                          </p>
                          <p className="mt-1 text-[var(--primary)]/80 leading-relaxed">
                            {row.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── Proof: COA ───────────────────────────────────────── */}
          <Section className="bg-[var(--muted)]">
            <Container>
              <div className="max-w-4xl mx-auto">
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                    Tested, not trusted
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Every batch, third-party verified
                  </h2>
                  <p className="mt-4 text-lg text-[var(--primary)]/70">
                    This is the actual certificate of analysis for the current
                    retatrutide lot — identity confirmed, purity 99%+. A copy
                    ships in every box.
                  </p>
                </div>
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  {RETA_COA.map((c) => (
                    <figure
                      key={c.src}
                      className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-sm"
                    >
                      <img
                        src={c.src}
                        alt={`Retatrutide certificate of analysis — ${c.label}`}
                        className="w-full rounded-xl border border-[var(--border)]"
                        loading="lazy"
                      />
                      <figcaption className="mt-3 text-center text-sm font-semibold text-[var(--primary)]/70">
                        {c.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-[var(--primary)]/55">
                  <a
                    href="/purity-tests/reta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[var(--accent-dark)]"
                  >
                    View all purity tests →
                  </a>
                </p>
              </div>
            </Container>
          </Section>

          {/* ── Proof: testimonials + photos ─────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-5xl mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Real people, real numbers
                  </h2>
                  <p className="mt-4 text-lg text-[var(--primary)]/70 max-w-2xl mx-auto">
                    Check-ins from Peak State clients running retatrutide — most
                    as the engine of the POWER CUT
                    <span className="text-[0.6em] align-super">™</span> protocol.
                    Names shown as first name + last initial for privacy.
                  </p>
                </div>

                {/* Transformation photos */}
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {transformationPhotos.map((p, i) => (
                    <figure
                      key={p.src}
                      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--muted)] ${
                        i >= 2 ? "hidden sm:block" : ""
                      }`}
                    >
                      <img
                        src={p.src}
                        alt={`Client transformation — ${p.label}`}
                        className="w-full h-full object-cover aspect-[3/4]"
                        loading="lazy"
                      />
                      <figcaption className="px-3 py-2 text-center text-xs font-semibold text-[var(--primary)]/60">
                        {p.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>

                {/* Quote cards */}
                <div className="mt-8 grid md:grid-cols-2 gap-5">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)] font-bold">
                          {t.initial}
                        </span>
                        <div>
                          <p className="font-bold text-[var(--primary)]">
                            {t.name}
                          </p>
                          {t.timeframe ? (
                            <p className="text-xs font-medium text-[var(--primary)]/55">
                              {t.timeframe}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-[var(--primary)]/80 leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      {t.stats && t.stats.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {t.stats.map((s) => (
                            <span
                              key={s}
                              className="rounded-full bg-[var(--accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--accent-dark)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <a
                    href="/reviews"
                    className="text-sm font-semibold text-[var(--primary)]/70 underline hover:text-[var(--accent-dark)]"
                  >
                    Read all client reviews →
                  </a>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── Buy ──────────────────────────────────────────────── */}
          <Section id="buy" className="bg-[var(--muted)]">
            <Container>
              <RetaBuy />
            </Container>
          </Section>

          {/* ── Reta vs. the stack (soft upsell) ─────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-5xl mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Reta solo, or the full system?
                  </h2>
                  <p className="mt-4 text-lg text-[var(--primary)]/70 max-w-2xl mx-auto">
                    Most people start with reta. Here&rsquo;s when the full POWER
                    CUT
                    <span className="text-[0.6em] align-super">™</span> stack is
                    the smarter move.
                  </p>
                </div>

                <div className="mt-10 grid md:grid-cols-2 gap-6">
                  {/* Reta */}
                  <div className="flex flex-col rounded-3xl border-2 border-[var(--accent)] bg-[var(--muted)] p-7 shadow-sm">
                    <span className="self-start rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                      Start here
                    </span>
                    <h3 className="mt-4 text-2xl font-bold text-[var(--primary)]">
                      Retatrutide, solo
                    </h3>
                    <p className="mt-1 text-3xl font-extrabold text-[var(--primary)]">
                      $215
                      <span className="text-base font-semibold text-[var(--primary)]/50">
                        {" "}
                        / 20mg vial
                      </span>
                    </p>
                    <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                      One lever, pulled hard: appetite down, burn up. Best if you
                      want the single most powerful fat-loss compound and nothing
                      to overthink.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--primary)]/80">
                      {[
                        "Simplest possible protocol",
                        "Lowest entry cost",
                        "Coaching + dosing still included",
                      ].map((l) => (
                        <li key={l} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent-dark)] flex-shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#buy"
                      className="btn-primary mt-6 inline-flex h-12 items-center justify-center rounded-2xl px-6 text-base font-semibold"
                    >
                      Get Retatrutide
                    </a>
                  </div>

                  {/* Stack */}
                  <div className="flex flex-col rounded-3xl border border-[var(--border)] bg-white p-7 shadow-sm">
                    <span className="self-start rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]/70">
                      Go further
                    </span>
                    <h3 className="mt-4 text-2xl font-bold text-[var(--primary)]">
                      The POWER CUT
                      <span className="text-[0.6em] align-super">™</span> stack
                    </h3>
                    <p className="mt-1 text-3xl font-extrabold text-[var(--primary)]">
                      $599
                      <span className="text-base font-semibold text-[var(--primary)]/50">
                        {" "}
                        / full protocol
                      </span>
                    </p>
                    <p className="mt-4 text-[var(--primary)]/75 leading-relaxed">
                      Reta plus CJC-1295 + Ipamorelin and BPC-157 + TB-500, in a
                      structured 10-week protocol. Best if you want recomposition
                      — hold muscle and recover while you strip fat.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--primary)]/80">
                      {[
                        "Includes 2 reta vials + GH and repair peptides",
                        "Structured week-by-week protocol",
                        "Muscle retention + recovery, not just weight down",
                      ].map((l) => (
                        <li key={l} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)]/40 flex-shrink-0" />
                          {l}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="/"
                      className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-6 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
                    >
                      See the full stack →
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── Other singles teaser ─────────────────────────────── */}
          <Section className="bg-[var(--muted)]">
            <Container>
              <div className="max-w-5xl mx-auto">
                <div className="text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    Add to your protocol
                  </h2>
                  <p className="mt-4 text-lg text-[var(--primary)]/70">
                    The rest of the single-vial catalog — same lab-tested purity,
                    same coaching included.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {otherSingles.map((p) => (
                    <a
                      key={p.name}
                      href="/singles"
                      className="group flex flex-col rounded-2xl border border-[var(--border)] bg-white p-4 card-hover"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-white border border-[var(--border)] flex items-center justify-center">
                        <img
                          src={p.image}
                          alt={`${p.name} vial`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p className="mt-3 text-sm font-bold text-[var(--primary)] leading-tight">
                        {p.name}
                      </p>
                      <p className="text-xs font-medium text-[var(--primary)]/55">
                        {p.dose}
                      </p>
                      <p className="mt-1 text-xs text-[var(--primary)]/60 leading-snug">
                        {p.note}
                      </p>
                      <p className="mt-2 text-lg font-extrabold text-[var(--primary)]">
                        {p.price}
                      </p>
                      <span className="mt-1 text-xs font-semibold text-[var(--accent-dark)] group-hover:underline">
                        View →
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <a
                    href="/singles"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-8 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)]"
                  >
                    Browse the full singles catalog →
                  </a>
                </div>
              </div>
            </Container>
          </Section>

          {/* ── FAQ ──────────────────────────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
                  Questions, answered
                </h2>
                <div className="mt-8 space-y-3">
                  {faqs.map((f) => (
                    <details
                      key={f.q}
                      className="group rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-[var(--primary)]">
                        {f.q}
                        <span className="faq-icon flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent-dark)] transition-transform">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-3 text-[var(--primary)]/80 leading-relaxed">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Container>
          </Section>

          {/* ── Final CTA ────────────────────────────────────────── */}
          <Section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
            <Container>
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                  <span>IN STOCK • SHIPS IN 24 HRS</span>
                </div>
                <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Start your cycle today
                </h2>
                <p className="mt-6 text-lg text-white/80">
                  Lab-tested retatrutide, a real coach in your corner, and a
                  guarantee behind every vial. No login, no hunting for the
                  product — just add to cart.
                </p>
                <div className="mt-8">
                  <a
                    href="#buy"
                    className="btn-accent inline-flex h-16 items-center justify-center rounded-2xl px-12 text-xl font-extrabold uppercase tracking-wide shadow-2xl ring-4 ring-[var(--accent)]/30 animate-pulse-slow"
                  >
                    Get Retatrutide
                  </a>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/70">
                  <span>✓ Third-party COA</span>
                  <span>✓ 99%+ purity</span>
                  <span>✓ Discreet shipping</span>
                  <span>✓ Satisfaction guarantee</span>
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
                    href="/reta"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Research overview
                  </a>
                  <a
                    href="/singles"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Singles catalog
                  </a>
                  <a
                    href="/reviews"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Reviews
                  </a>
                  <a
                    href="/"
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    POWER CUT™
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

        <CartDrawer />
        <RetaDiscountPopup />
      </div>
    </CartProvider>
  );
}
