import type { Metadata } from "next";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { SaleHeader } from "@/app/components/sale/SaleHeader";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import { siteCopy } from "@/content/siteCopy";
import { BlackFridayExperience } from "./BlackFridayExperience";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Black Friday Sale — Up To 60% Off Stacks | Peak State Labs",
  description:
    "Our biggest sale ever. Answer two quick questions and we'll build your stack — up to 60% off.",
};

// The sale homepage. During the sale, middleware serves this at "/" (unless
// the visitor chose the regular site) and keeps it hidden before/after.
export default async function BlackFridayPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const initialSale = await getSaleStatus();
  const sp = await searchParams;
  const powerCutTiers = siteCopy.pricing.tiers.map((t) => ({
    id: t.id,
    name: t.name,
    subtitle: t.subtitle,
    stripeUrl: t.stripeUrl,
  }));
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0b0f1a]">
        <SaleHeader initialSale={initialSale} />
        <BlackFridayExperience
          initialSale={initialSale}
          powerCutTiers={powerCutTiers}
          startQuiz={sp.quiz === "1"}
        />
        <footer className="bg-[#0b0f1a] px-4 pb-10 text-center text-xs text-white/40">
          {siteCopy.footer.disclaimer}
        </footer>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
