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
import { CJC_TIERS } from "./cjcBundles";

export const metadata: Metadata = {
  title: "Buy CJC-1295 + Ipamorelin (10mg) — Lab-Tested, Ships in 24h | Peak State Labs",
  description:
    "CJC-1295 (no DAC) + Ipamorelin 10mg blend — growth hormone pulse support for lean muscle, deeper sleep and recovery. Third-party COA, 99%+ purity, 1-on-1 coaching included.",
  alternates: { canonical: "/getcjc" },
};

// Check-ins from POWER CUT clients (CJC + Ipa is the stack's muscle piece),
// picked for muscle, strength, sleep and recovery.
const testimonials = pickReviews([
  "erin-journey",
  "anon-jacked",
  "paige-wk5",
  "stephanie-wk6",
  "paige-wk3a",
  "anon-wk2",
]);

const faqs = [
  {
    q: "Is this real, lab-tested CJC-1295 + Ipamorelin?",
    a: "Yes. Every batch is third-party tested for identity and purity (99%+). The current lot's COA is shown above and included with your order — nothing ships without documentation.",
  },
  {
    q: "How long does a vial last?",
    a: "One 10mg vial lasts about 5 weeks on a standard research schedule. Two vials cover a full 10-week cycle; three give you 15 weeks without a reorder.",
  },
  {
    q: "Can I run it alongside retatrutide?",
    a: "That's exactly what the POWER CUT™ stack is: retatrutide to drive fat loss, CJC-1295 + Ipamorelin to hold and build lean muscle, and BPC-157 + TB-500 for recovery. If you want both, the stack is the better deal.",
  },
  {
    q: "Do I get dosing help?",
    a: "Every order — even a single vial — includes 1-on-1 coaching and custom dosing guidance dialed in with our calculator and a real coach. You're not left guessing.",
  },
  {
    q: "How is it shipped, and how fast?",
    a: "In-stock vials ship within 24 hours in discreet, temperature-conscious packaging with tracking. The lyophilized (freeze-dried) peptide is stable in transit.",
  },
  {
    q: "How is it reconstituted and stored?",
    a: "Reconstitute the lyophilized peptide with bacteriostatic water (add slowly down the side of the vial, swirl — don't shake). Refrigerate at 2–8°C after reconstitution, protect from light, and avoid repeated freeze-thaw. Full handling notes ship with every vial.",
  },
  {
    q: "What's your guarantee?",
    a: "Orders are backed by our satisfaction guarantee. If anything's wrong with your vial, we make it right — reship or refund.",
  },
];

export default function GetCjcPage() {
  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
        <ProductHeader page="getcjc" ctaLabel="Get CJC + Ipa" />

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
                      <span>CJC-1295 + IPAMORELIN • 10MG</span>
                    </div>
                    <StockPill />
                  </div>

                  <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Build lean muscle.
                    <span className="block text-[var(--accent-dark)]">
                      Wake up actually recovered.
                    </span>
                  </h1>
                  <p className="mt-6 text-lg text-[var(--primary)]/70 max-w-xl">
                    CJC-1295 + Ipamorelin amplifies your body&rsquo;s natural
                    growth hormone pulses — the signal behind deeper sleep,
                    faster recovery and lean muscle that actually shows up.
                  </p>
                </div>

                <div className="order-2 flex items-center justify-center lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
                  <div className="relative mx-auto w-full max-w-[280px] sm:max-w-md">
                    <img
                      src="/CJC%20Ipa%20Product%20Image%20Transparent%202.png"
                      alt="CJC-1295 + Ipamorelin 10mg research vial"
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

                <div className="order-3 lg:col-start-1 lg:row-start-2">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold"
                  >
                    Get CJC-1295 + Ipamorelin
                  </a>
                  <HeroProof>
                    <span className="text-[var(--accent-dark)] font-extrabold">
                      +4.2%
                    </span>{" "}
                    lean muscle reported in a 10-week cycle
                  </HeroProof>
                </div>
              </div>
            </Container>
          </Section>

          <TrustBar />

          {/* ── Problem ──────────────────────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                  Why the gym stopped paying you back
                </p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                  You&rsquo;re not training wrong. You&rsquo;re recovering slow.
                </h2>
                <p className="mt-6 text-lg text-[var(--primary)]/75 leading-relaxed">
                  Muscle is built while you sleep, not while you lift. As growth
                  hormone output drops with age, sleep gets lighter, soreness
                  hangs around longer and the same effort buys you less.
                  CJC-1295 + Ipamorelin helps restore those overnight pulses so
                  the work you&rsquo;re already doing starts to show.
                </p>
                <div className="mt-8">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold"
                  >
                    Start Building
                  </a>
                </div>
              </div>
            </Container>
          </Section>

          <TimelineSection
            title="What a cycle tends to look like"
            note="Commonly reported patterns from clients and research protocols. Individual response varies — these are not promises."
            rows={[
              {
                week: "Week 1 – 2",
                body: "Deeper, more restful sleep is usually the first thing people notice.",
              },
              {
                week: "Week 2 – 4",
                body: "Less lingering soreness and better recovery between sessions.",
              },
              {
                week: "Week 4 – 8",
                body: "Strength and training capacity climb; body composition starts to shift toward lean mass.",
              },
              {
                week: "Week 8 – 10+",
                body: "Visible changes in muscle tone and fullness, with skin and energy improvements often reported alongside.",
              },
            ]}
          />

          <CoaSection
            intro="This is the actual certificate of analysis for the current CJC-1295 + Ipamorelin lot — identity confirmed, purity 99%+. A copy ships in every box."
            reports={[
              {
                product: "CJC-1295 + Ipamorelin",
                href: "/purity-tests/cjc-ipa",
                images: [
                  { src: "/CJC%20Lab%20Report%202%20Page%201.png", label: "Page 1" },
                  { src: "/CJC%20Lab%20Report%202%20Page%202.png", label: "Page 2" },
                ],
              },
            ]}
          />

          <TestimonialsSection
            intro={
              <>
                Check-ins from Peak State clients running CJC-1295 + Ipamorelin
                as the muscle-building piece of the POWER CUT
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
                funnel="getcjc"
                title="CJC-1295 + Ipamorelin, 10mg"
                description="Lyophilized, lab-tested, and ready to reconstitute. Each vial lasts about 5 weeks — stock two for a full 10-week cycle."
                tiers={CJC_TIERS}
                defaultTierId="2"
                crossSellSlugs={["bpc-tb500", "ghk-cu"]}
                imageAlt="CJC-1295 + Ipamorelin 10mg"
              />
            </Container>
          </Section>

          {/* ── Solo vs. the stack (soft upsell) ─────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Want to lose fat while you build?
                </h2>
                <p className="mt-4 text-lg text-[var(--primary)]/70">
                  The POWER CUT
                  <span className="text-[0.6em] align-super">™</span> stack pairs
                  CJC-1295 + Ipamorelin with retatrutide and BPC-157 + TB-500 in a
                  structured 10-week protocol — strip fat and hold the muscle
                  you&rsquo;re building.
                </p>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-6 text-base font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
                >
                  See the full stack →
                </a>
              </div>
            </Container>
          </Section>

          <FaqSection faqs={faqs} />

          <FinalCta
            title="Start building today"
            body="Lab-tested CJC-1295 + Ipamorelin, a real coach in your corner, and a guarantee behind every vial. Just add to cart."
            ctaLabel="Get CJC + Ipa"
          />
        </main>

        <ProductFooter
          links={[
            { href: "/cjcblend", label: "Research overview" },
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
