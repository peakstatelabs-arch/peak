import { Container } from "@/app/components/Container";
import { SaleBar } from "@/app/components/SaleUrgency";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";
import type { SaleStatus } from "@/app/lib/useSaleStatus";
import { LogoMenu } from "./LogoMenu";

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
        <LogoMenu href="/blackfriday">
          <img src="/logo.png" alt="Peak State Labs Logo" className="h-7 w-7 rounded-lg" />
          <span className="hidden sm:inline">Peak State Labs</span>
        </LogoMenu>
        <div className="flex items-center gap-4 sm:gap-6">
          <a
            href="/buildyourstack"
            className="inline-flex h-10 items-center rounded-xl bg-[var(--accent)] px-4 text-sm font-extrabold text-[#0b0f1a] shadow-lg hover:opacity-90"
          >
            Build your stack →
          </a>
          {showCart ? <ViewCartButton variant="header" /> : null}
        </div>
      </Container>
    </header>
  );
}
