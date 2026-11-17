import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import {
  FaqSection,
  FinalCta,
  HeroProof,
  ProductFooter,
  StockPill,
  TestimonialsSection,
  TimelineSection,
  TrustBar,
  pickReviews,
} from "@/app/components/productPage/ProductPageParts";
import { formatUsd } from "@/app/lib/money";
import { SALE_NAME } from "@/app/lib/sale";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import {
  PRODUCT_CUTOUT,
  SHORT_NAME,
  STACKS,
  isAddonKey,
  supplyFor,
  priceLines,
  linesFor,
  type StackSlug,
} from "@/app/lib/bfStacks";
import { SaleHeader } from "./SaleHeader";
import { StackBuyBox } from "./StackBuyBox";
import { OtherStacks } from "./OtherStacks";
import { SaleCountdown } from "@/app/components/SaleUrgency";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const testimonials = pickReviews([
  "paige-amazed",
  "stephanie-wk1",
  "anon-great",
  "dougie-painkillers",
  "erin-wow",
  "noelle-wk6",
]);

/** Shared template for the Black Friday stack pages (/shred, /build, …). */
export async function StackPage({
  slug,
  searchParams,
}: {
  slug: StackSlug;
  searchParams: SearchParams;
}) {
  const stack = STACKS[slug];
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const setsParam = Number(one(sp.sets));
  const addonParam = one(sp.addon);
  const initialSale = await getSaleStatus();
  const saleName = SALE_NAME[initialSale.phase];

  const heroSets =
    Number.isFinite(setsParam) && stack.sizes.some((s) => s.sets === setsParam)
      ? setsParam
      : stack.defaultSets;
  const heroImage = stack.heroBySets?.[heroSets] ?? stack.hero;
  const best = priceLines(linesFor(stack.items, stack.sizes[stack.sizes.length - 1].sets));
  const from = priceLines(linesFor(stack.items, stack.sizes[0].sets));

  const faqs = [
    {
      q: `What's in the ${stack.name} stack?`,
      a: `A 1× stack is one vial each of ${stack.items.map((i) => SHORT_NAME[i]).join(", ")}. A 2× stack is two of each${stack.sizes.length > 2 ? ", and a 3× stack is three of each" : ""}.`,
    },
    {
      q: `How does the ${saleName} discount work?`,
      a: "Every vial in your cart counts, across any mix of products and stacks: 1 vial is 20% off, 2 vials 30%, 3 vials 35% and 4 or more 40%. It's applied automatically at checkout.",
    },
    {
      q: "Can I combine it with a discount code?",
      a: "No need — the sale price is already far bigger than any code, and it's applied for you.",
    },
    {
      q: "When does the sale end?",
      a: "Monday, November 30 at 11:59 PM Eastern. After that, prices go back to normal.",
    },
    {
      q: "Is coaching still included?",
      a: "Yes. Every order includes 1-on-1 coaching and custom dosing guidance, the same as always.",
    },
  ];

  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
        <SaleHeader initialSale={initialSale} />

        <main>
          {/* ── Hero ─────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#0b0f1a] text-white">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <div className="absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-[var(--primary-light)]/30 blur-3xl" />
            </div>
            <Container className="relative py-12 sm:py-16">
              <div className="grid gap-y-8 lg:grid-cols-2 lg:gap-10 lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#0b0f1a]">
                      {saleName} sale
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                      The {stack.name} stack
                    </span>
                  </div>
                  <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    {stack.headline[0]}
                    <span className="block text-[var(--accent)]">{stack.headline[1]}</span>
                  </h1>
                  <p className="mt-6 text-lg text-white/75 max-w-xl">{stack.sub}</p>
                  <div className="mt-6 inline-flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                    <span className="text-sm font-semibold text-white/60">From</span>
                    <span className="text-3xl font-extrabold tabular-nums">{formatUsd(from.price)}</span>
                    {from.saves > 0 && (
                      <span className="text-sm font-semibold text-white/40 line-through tabular-nums">
                        {formatUsd(from.full)}
                      </span>
                    )}
                    <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-xs font-extrabold text-emerald-300">
                      Save up to {best.pct}%
                    </span>
                  </div>
                  <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <a
                      href="#buy"
                      className="inline-flex h-14 items-center justify-center rounded-2xl bg-[var(--accent)] px-8 text-lg font-extrabold text-[#0b0f1a] shadow-xl hover:opacity-90"
                    >
                      Claim my {stack.name} stack →
                    </a>
                    <span className="text-sm font-semibold text-white/70">
                      Ends in <SaleCountdown className="text-white" />
                    </span>
                  </div>
                </div>
                <div className="relative mx-auto w-full max-w-[320px] sm:max-w-md">
                  <img
                    src={heroImage}
                    alt={`${stack.name} stack — ${stack.items.map((i) => SHORT_NAME[i]).join(", ")}`}
                    className="relative w-full drop-shadow-2xl"
                  />
                  <div className="absolute inset-0 -z-0 rounded-full bg-[var(--accent)]/20 blur-3xl" />
                </div>
              </div>
            </Container>
          </section>

          <TrustBar />

          {/* ── What's inside ────────────────────────────────────── */}
          <Section className="bg-white">
            <Container>
              <div className="max-w-5xl mx-auto">
                <div className="text-center max-w-3xl mx-auto">
                  <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                    What&rsquo;s inside {stack.name}
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
                    {stack.tagline}
                  </h2>
                </div>
                <div
                  className={`mt-10 grid gap-5 ${stack.items.length === 3 ? "md:grid-cols-3" : stack.items.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" : "max-w-md mx-auto"}`}
                >
                  {stack.items.map((i) => {
                    const role = stack.roles[i];
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center rounded-3xl border border-[var(--border)] bg-white p-6 text-center shadow-sm"
                      >
                        <img
                          src={PRODUCT_CUTOUT[i]}
                          alt=""
                          aria-hidden="true"
                          className="h-28 w-auto object-contain"
                          loading="lazy"
                        />
                        {role && (
                          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[var(--accent-dark)]">
                            {role.role}
                          </p>
                        )}
                        <h3 className="mt-1 text-xl font-bold text-[var(--primary)]">{SHORT_NAME[i]}</h3>
                        <p className="text-xs font-semibold text-[var(--primary)]/55">
                          1 vial = {supplyFor(i, 1)} supply
                        </p>
                        {role && (
                          <p className="mt-3 text-sm text-[var(--primary)]/75 leading-relaxed">{role.body}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 flex flex-col items-center gap-2 text-center">
                  <a
                    href="#buy"
                    className="btn-primary inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold"
                  >
                    Get {stack.name} — save up to {best.pct}%
                  </a>
                  <HeroProof>
                    <StockPill />
                  </HeroProof>
                </div>
              </div>
            </Container>
          </Section>

          <TimelineSection
            title="What A Cycle Tends To Look Like"
            note="Commonly reported patterns from clients and research protocols. Individual response varies — these are not promises."
            rows={stack.timeline}
          />

          {/* ── Buy ──────────────────────────────────────────────── */}
          <Section id="buy" className="bg-[var(--muted)]">
            <Container>
              <StackBuyBox
                slug={slug}
                initialSets={Number.isFinite(setsParam) && setsParam > 0 ? setsParam : null}
                addon={isAddonKey(addonParam) ? addonParam : null}
                fromQuiz={one(sp.quiz) === "1"}
                initialSale={initialSale}
              />
            </Container>
          </Section>

          <OtherStacks current={slug} />

          <TestimonialsSection
            intro={
              <>
                Check-ins from Peak State clients. Names shown as first name +
                last initial for privacy.
              </>
            }
            testimonials={testimonials}
          />

          <FaqSection faqs={faqs} />

          <FinalCta
            title={`${saleName} Pricing Won't Come Back`}
            body={`Lock in ${stack.name} at up to ${best.pct}% off before the sale ends. Lab-tested vials, a real coach in your corner, and a guarantee behind every order.`}
            ctaLabel={`Get ${stack.name}`}
          />
        </main>

        <ProductFooter
          links={[
            { href: "/blackfriday", label: `${saleName} sale` },
            { href: "/buildyourstack", label: "Build your own stack" },
            { href: "/singles", label: "Singles catalog" },
            { href: "/reviews", label: "Reviews" },
          ]}
        />

        <CartDrawer />
      </div>
    </CartProvider>
  );
}
