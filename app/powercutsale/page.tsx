import type { Metadata } from "next";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { SaleHeader } from "@/app/components/sale/SaleHeader";
import { OtherStacks } from "@/app/components/sale/OtherStacks";
import { ProductFooter } from "@/app/components/productPage/ProductPageParts";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import { POWERCUT_SALE } from "@/app/lib/sale";
import { isAddonKey } from "@/app/lib/bfStacks";
import { siteCopy } from "@/content/siteCopy";
import { PowerCutPicker } from "@/app/components/powercut/PowerCutPicker";
import {
  PowerCutCalculator,
  PowerCutComparison,
  PowerCutFaq,
  PowerCutFinalCta,
  PowerCutProblemSolution,
  PowerCutReviews,
  PowerCutSupport,
  PowerCutTimeline,
} from "@/app/components/powercut/PowerCutSections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "POWER CUT™ — Black Friday Sale, Up To 61% Off | Peak State Labs",
  description:
    "Retatrutide, CJC-1295/Ipamorelin and BPC-157/TB-500 in one 10-week system, with 1-on-1 coaching. Black Friday pricing.",
  robots: { index: false },
};

// The Black Friday POWER CUT™ page (quiz result for fat loss + muscle).
// Payment stays on the POWER CUT Stripe links with the TRANSFORM codes.
export default async function PowerCutSalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const tierNum = Number(one(sp.tier));
  const tier = (tierNum === 1 || tierNum === 3 ? tierNum : 2) as 1 | 2 | 3;
  const addonParam = one(sp.addon);
  const initialSale = await getSaleStatus();
  const tiers = siteCopy.pricing.tiers.map((t) => ({
    id: t.id,
    name: t.name,
    subtitle: t.subtitle,
    features: t.features,
    stripeUrl: t.stripeUrl,
  }));
  const cmp = siteCopy.comparison.powercut;

  return (
    <CartProvider>
      <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
        <SaleHeader initialSale={initialSale} />
        <main>
          <section className="relative overflow-hidden bg-[#0b0f1a] text-white">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--accent)]/20 blur-3xl" />
              <div className="absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-[var(--primary-light)]/30 blur-3xl" />
            </div>
            <div className="relative">
              <PowerCutPicker
                tiers={tiers}
                tier={tier}
                fromQuiz={one(sp.quiz) === "1"}
                addon={isAddonKey(addonParam) ? addonParam : null}
                initialSale={initialSale}
              />
            </div>
          </section>

          {/* Everything below the offer, re-skinned dark for the sale. */}
          <div className="bf-dark">
            <PowerCutSupport />
            <PowerCutComparison
              initialSale={initialSale}
              cmp={cmp}
              cmpPriceCents={initialSale.live ? POWERCUT_SALE.single.saleCents : cmp.priceCents}
            />
            <PowerCutCalculator showQuizLink={false} />
            <PowerCutTimeline />
            <LabProof />
          </div>
          <div className="bg-[#0b0f1a] [&_section]:!bg-[#0b0f1a] text-white">
            <OtherStacksDark />
          </div>
          <div className="bf-dark">
            <PowerCutProblemSolution />
            <PowerCutReviews />
            <PowerCutFaq />
            <PowerCutFinalCta />
          </div>
        </main>
        <div className="bf-dark">
          <ProductFooter
          links={[
            { href: "/blackfriday", label: "Black Friday sale" },
            { href: "/buildyourstack", label: "Build your own stack" },
            { href: "/singles", label: "Singles catalog" },
            { href: "/reviews", label: "Reviews" },
          ]}
        />
        </div>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

// The three POWER CUT™ compounds' latest COA results (same figures as the
// product pages), as PASS badges.
const LAB_RESULTS = [
  { product: "Retatrutide", dose: "20mg", purity: "99.93%", href: "/purity-tests/reta" },
  { product: "CJC-1295/Ipamorelin Blend", dose: "10mg", purity: "99.12%", href: "/purity-tests/cjc-ipa" },
  { product: "BPC-157/TB-500 Blend", dose: "20mg", purity: "99.68%", href: "/purity-tests/bpc-tb" },
];

function LabProof() {
  return (
    <section className="bg-[#0f1626] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
          Documentation &amp; purity tests
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Your Safety Is Our #1 Priority
        </h2>
        <p className="mt-4 text-white/70">
          Every lot of all three POWER CUT&trade; peptides is third-party tested
          for identity and purity before it ships.
        </p>
      </div>
      <ul className="mx-auto mt-8 max-w-xl space-y-3">
        {LAB_RESULTS.map((r) => (
          <li key={r.product}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition-colors hover:border-[var(--accent)]"
            >
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-white">{r.product}</span>
                <span className="block text-xs font-medium text-white/55">
                  {r.dose} · {r.purity} purity (HPLC) · view report →
                </span>
              </span>
              <span className="flex-shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-extrabold tracking-wider text-emerald-300">
                PASS
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OtherStacksDark() {
  return (
    <div className="bf-dark">
      <OtherStacks hidePowerCut title="Explore The Other Black Friday Stacks" />
    </div>
  );
}
