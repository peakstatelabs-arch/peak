import { Container } from "@/app/components/Container";
import { SaleBar } from "@/app/components/SaleUrgency";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";
import type { SaleStatus } from "@/app/lib/useSaleStatus";

/** Sticky header for the sale pages: sale bar, logo, build-your-own, cart. */
export function SaleHeader({
  initialSale,
  showCart = true,
}: {
  initialSale: SaleStatus;
  showCart?: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <SaleBar initial={initialSale} />
      <Container className="flex h-16 items-center justify-between">
        <a href="/blackfriday" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.png" alt="Peak State Labs Logo" className="h-7 w-7 rounded-lg" />
          <span className="hidden sm:inline">Peak State Labs</span>
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="/buildyourstack"
            className="text-sm font-semibold text-[var(--primary)]/80 underline-offset-4 hover:underline"
          >
            Build your own stack
          </a>
          {showCart ? <ViewCartButton variant="header" /> : null}
        </div>
      </Container>
    </header>
  );
}
