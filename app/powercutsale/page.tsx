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
import { LabProof } from "@/app/components/sale/LabProof";
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
            <LabProof
              slugs={["retatrutide", "cjc-ipamorelin", "bpc-tb500"]}
              intro="Every lot of all three POWER CUT™ peptides is third-party tested for identity and purity before it ships."
            />
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

function OtherStacksDark() {
  return (
    <div className="bf-dark">
      <OtherStacks hidePowerCut title="Explore The Other Black Friday Stacks" />
    </div>
  );
}
