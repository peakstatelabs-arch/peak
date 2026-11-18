import type { Metadata } from "next";
import { CartProvider } from "@/app/singles/cart/CartContext";
import { CartDrawer } from "@/app/singles/cart/CartDrawer";
import { SaleHeader } from "@/app/components/sale/SaleHeader";
import { OtherStacks } from "@/app/components/sale/OtherStacks";
import { getSaleStatus } from "@/app/lib/salePhaseServer";
import { siteCopy } from "@/content/siteCopy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Black Friday Stacks — Up To 60% Off | Peak State Labs",
  robots: { index: false },
};

// Every sale stack on one page (the logo menu's "Shop Sale Stacks").
export default async function StacksPage() {
  const initialSale = await getSaleStatus();
  return (
    <CartProvider>
      <div className="bf-dark min-h-screen bg-[#0b0f1a]">
        <SaleHeader initialSale={initialSale} />
        <OtherStacks title="Every Black Friday Stack" />
        <footer className="px-4 pb-10 text-center text-xs text-white/40">
          {siteCopy.footer.disclaimer}
        </footer>
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
