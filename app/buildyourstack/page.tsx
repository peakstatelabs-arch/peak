import type { Metadata } from "next";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { SaleHeader } from "@/app/components/sale/SaleHeader";
import { SaleCountdown } from "@/app/components/SaleUrgency";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import { SALE_NAME } from "@/app/lib/sale";
import { BuildYourStack } from "./BuildYourStack";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build Your Own Stack — Black Friday Sale | Peak State Labs",
  description:
    "Pick any vials and save: 1 vial 20% off, 2 vials 30%, 3 vials 35%, 4+ vials 40%.",
  robots: { index: false },
};

export default async function BuildYourStackPage() {
  const initialSale = await getSaleStatus();
  return (
    <CartProvider>
      <div className="min-h-screen bg-[var(--muted)] text-[var(--primary)]">
        <SaleHeader initialSale={initialSale} />
        <section className="bg-[#0b0f1a] px-4 py-10 sm:py-14 text-center text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--accent)]">
            {SALE_NAME[initialSale.phase]} sale
          </p>
          <h1 className="mt-3 text-4xl sm:text-6xl font-black tracking-tight">
            Build Your Own Stack
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
            Pick any vials you want. The more you stack, the more you save —
            up to 40% off your whole order.
          </p>
          <p className="mt-4 text-sm font-semibold text-white/70">
            Ends in <SaleCountdown className="text-white" />
          </p>
        </section>
        <div className="pt-8">
          <BuildYourStack initialSale={initialSale} />
        </div>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
