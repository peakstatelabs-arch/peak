import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { BundleBuyBox } from "@/app/components/productPage/BundleBuyBox";
import {
  CoaSection,
  FaqSection,
  FinalCta,
  HeroProof,
  ProductFooter,
  ProductHeader,
  StockPill,
  TestimonialsSection,
  TimelineSection,
  TrustBar,
  pickReviews,
} from "@/app/components/productPage/ProductPageParts";
import { RECOVERY_STACK_NAME, RECOVERY_TIERS } from "./recoveryStack";

export const metadata: Metadata = {
  title: `${RECOVERY_STACK_NAME} Recovery Stack — BPC-157 + TB-500, KPV & GHK-Cu | Peak State Labs`,
  description:
    "BPC-157 + TB-500, KPV and GHK-Cu in one recovery and anti-aging stack — joints and tissue, inflammation and gut, skin and hair. Third-party COA, 99%+ purity, 1-on-1 coaching included.",
  alternates: { canonical: "/getrecovery" },
};

// No stack-specific reviews yet: these are POWER CUT clients (which includes
// BPC-157 + TB-500) talking about joints, recovery, sleep and feeling better.
const testimonials = pickReviews([
  "stephanie-wk1",
  "anon-great",
  "anon-wk2",
  "dougie-painkillers",
  "stephanie-wk6",
  "paige-wk3a",
]);

const pillars = [
  {
    name: "BPC-157 + TB-500",
    dose: "20mg blend",
    role: "The Shield",
    image: "/BPC%20Tb%20Product%20Image%20Transparent%202.png",
    body: "Local + systemic repair for joints, tendons and connective tissue. Helps calm the inflammatory drag that keeps old injuries nagging.",
  },
  {
    name: "KPV",
    dose: "10mg",
    role: "The Regulator",
    image: "/kpv-product-transparent.png",
    body: "Anti-inflammatory signaling that supports gut and skin health and a balanced immune response — recovery from the inside out.",
  },
  {
    name: "GHK-Cu",
    dose: "50mg",
    role: "The Restorer",
    image: "/GHKCU.png",
    body: "Copper peptide signaling for skin quality, tissue restoration and hair vitality — the visible side of aging well.",
  },
];

const faqs = [
  {
    q: `What's in the ${RECOVERY_STACK_NAME} stack?`,
    a: "One stack is one vial each of BPC-157 + TB-500 (20mg), KPV (10mg) and GHK-Cu (50mg). The two-stack option is two of each.",
  },
  {
    q: "How long does a stack last?",
    a: "One stack lasts about 5 weeks on a standard research schedule. Two stacks cover a full 10-week cycle without a reorder.",
  },
  {
    q: "Why these three together?",
    a: "They work on different layers of recovery: BPC-157 + TB-500 on joints and tissue, KPV on inflammation and the gut, GHK-Cu on skin and hair. Together they cover more ground than any one alone.",
  },
  {
    q: "Is my member discount applied?",
    a: "The two-stack gets 10% off automatically at checkout — no code needed. On a single stack, enter your member code at checkout for the same 10%.",
  },
  {
    q: "Do I get dosing help?",
    a: "Every order includes 1-on-1 coaching and custom dosing guidance dialed in with our calculator and a real coach — including how to run all three together.",
  },
  {
    q: "How is it shipped, and how fast?",
    a: "In-stock vials ship within 24 hours in discreet, temperature-conscious packaging with tracking. The lyophilized (freeze-dried) peptides are stable in transit.",
  },
  {
    q: "How are they reconstituted and stored?",
    a: "Reconstitute each lyophilized peptide with bacteriostatic water (add slowly down the side of the vial, swirl — don't shake). Refrigerate at 2–8°C after reconstitution, protect from light, and avoid repeated freeze-thaw. Full handling notes ship with every vial.",
  },
  {
    q: "What's your guarantee?",
    a: "Orders are backed by our satisfaction guarantee. If anything's wrong with a vial, we make it right — reship or refund.",
  },
];

export default function GetRecoveryPage() {
  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
        <ProductHeader page="getrecovery" ctaLabel="Get The Stack" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────── */}
          <Section className="relative overflow-hidden gradient-hero !py-12 sm:!py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
              <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
            </div>

            <Container className="relative">
              <div className="grid gap-y-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
                <div className="order-1 lg:col-start-1 lg:row-start-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                      <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                      <span>{RECOVERY_STACK_NAME} • RECOVERY STACK</span>
                    </div>
                    <StockPill />
                  </div>

                  <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Bounce Back Faster.
                    <span className="block text-[var(--accent-dark)]">
                      Age On Your Own Terms.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                    Three Repair Peptides In One Stack — For The Joints That
                    Ache, The Gut That&rsquo;s Off, And The Skin That Shows It.
                    Recover Like You Used To, And Look Like It.
                  </p>
                </div>

                <div className="order-2 flex items-center justify-center lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
                  <div className="relative mx-auto w-full max-w-[280px] sm:max-w-sm">
                    <img
                      src="/recovery-stack-hero-trimmed.png"
                      alt={`${RECOVERY_STACK_NAME} recovery stack — BPC-157 + TB-500, KPV and GHK-Cu research vials`}
                      className="w-full drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--accent)]/10 blur-3xl rounded-full scale-90" />
                    <div className="absolute -bottom-2 left-0 rounded-2xl bg-white/90 backdrop-blur border border-[var(--border)] px-4 py-3 shadow-lg">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                        COA Verified
                      </p>
                      <p className="text-sm font-bold text-[var(--primary)]">
                        99%+ purity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="order-3 lg:col-start-1 lg:row-start-2">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                  >
                    Get The {RECOVERY_STACK_NAME} Stack
                  </a>
                  <HeroProof>
                    <span className="text-[var(--accent-dark)] font-extrabold">
                      3 peptides
                    </span>{" "}
                    · one 5-week stack
                  </HeroProof>
                </div>
              </div>
            </Container>
          </Section>

          <TrustBar />

          {/* ── What's inside ────────────────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-5xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                  <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                    Three peptides, three jobs
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    Recovery Isn&rsquo;t One Problem. So It Isn&rsquo;t One Peptide.
                  </h2>
                  <p className="mt-6 text-lg text-[var(--primary)]/75 leading-relaxed">
                    Slow recovery shows up in your joints, your gut and your skin
                    at the same time. {RECOVERY_STACK_NAME} covers all three.
                  </p>
                </div>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {pillars.map((p) => (
                    <div
                      key={p.name}
                      className="flex flex-col items-center rounded-3xl border border-[var(--border)] bg-[var(--muted)] p-6 text-center"
                    >
                      <img
                        src={p.image}
                        alt=""
                        aria-hidden="true"
                        className="h-28 w-auto object-contain"
                        loading="lazy"
                      />
                      <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">
                        {p.role}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-[var(--primary)]">
                        {p.name}
                      </h3>
                      <p className="text-sm font-medium text-[var(--primary)]/55">
                        {p.dose}
                      </p>
                      <p className="mt-3 text-sm text-[var(--primary)]/75 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold"
                  >
                    Start Recovering
                  </a>
                </div>
              </div>
            </Container>
          </Section>

          <TimelineSection
            title="What A Cycle Tends To Look Like"
            note="Commonly reported patterns from clients and research protocols. Individual response varies — these are not promises."
            rows={[
              {
                week: "Week 1 – 2",
                body: "Joints feel less stiff and day-to-day aches start to quiet down.",
              },
              {
                week: "Week 2 – 5",
                body: "Faster bounce-back between workouts, steadier digestion, and a calmer inflammatory baseline.",
              },
              {
                week: "Week 5 – 10",
                body: "Nagging tendon and joint issues continue to improve; skin quality and hair vitality start to show.",
              },
            ]}
          />

          <CoaSection
            intro="Every lot of all three peptides is third-party tested for identity and purity before it ships — and copies of the certificates come in every box."
            results={[
              { product: "BPC-157 + TB-500", dose: "20mg blend", purity: "99.67%" },
              { product: "KPV", dose: "10mg", purity: "99.36%" },
              { product: "GHK-Cu", dose: "50mg", purity: "99.95%" },
            ]}
            href="/getrecovery/lab-reports"
          />

          <TestimonialsSection
            intro={
              <>
                Check-ins from Peak State clients on how they feel — joints,
                sleep and recovery — while running BPC-157 + TB-500 inside the
                POWER CUT
                <span className="text-[0.6em] align-super">™</span> protocol.
                Names shown as first name + last initial for privacy.
              </>
            }
            testimonials={testimonials}
          />

          {/* ── Buy ──────────────────────────────────────────────── */}
          <Section id="buy" className="bg-[var(--muted)]">
            <Container>
              <BundleBuyBox
                funnel="getrecovery"
                title={`The ${RECOVERY_STACK_NAME} Stack`}
                description="BPC-157 + TB-500, KPV and GHK-Cu — lab-tested and ready to reconstitute. One stack lasts about 5 weeks; two cover a full 10-week cycle."
                tiers={RECOVERY_TIERS}
                defaultTierId="2"
                crossSellSlugs={["cjc-ipamorelin"]}
                imageAlt={`${RECOVERY_STACK_NAME} recovery stack`}
              />
            </Container>
          </Section>

          <FaqSection faqs={faqs} />

          <FinalCta
            title="Start Recovering Today"
            body="Three lab-tested repair peptides, a real coach in your corner, and a guarantee behind every vial. Just add to cart."
            ctaLabel="Get The Stack"
          />
        </main>

        <ProductFooter
          links={[
            { href: "/bpcblend", label: "BPC-157 + TB-500 research" },
            { href: "/singles", label: "Singles catalog" },
            { href: "/reviews", label: "Reviews" },
            { href: "/", label: "POWER CUT™" },
          ]}
        />

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
