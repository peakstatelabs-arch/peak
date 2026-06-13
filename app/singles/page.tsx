import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { CartScripts } from "./CartScripts";

export const metadata: Metadata = {
  title: `Singles Catalog — ${siteCopy.brand.name}`,
  description:
    "Individual research peptides from Peak State Labs. Retatrutide, CJC-1295 + Ipamorelin, and BPC-157 + TB-500.",
};

export const revalidate = 3600;

const STOCK_EPOCH_MS = Date.UTC(2026, 4, 1);

function currentStock(
  startStock: number,
  opts?: { step?: number; anchorMs?: number; minimum?: number },
): number {
  const step = opts?.step ?? 1;
  const anchorMs = opts?.anchorMs ?? STOCK_EPOCH_MS;
  const minimum = opts?.minimum ?? 1;
  const range = startStock - minimum;
  if (range <= 0 || step <= 0) return startStock;
  const stepsPerCycle = Math.floor(range / step) + 1;
  const days = Math.floor((Date.now() - anchorMs) / 86_400_000);
  const offset = ((days % stepsPerCycle) + stepsPerCycle) % stepsPerCycle;
  return startStock - offset * step;
}

type Product = {
  id: string;
  name: string;
  subtitle: string;
  dose: string;
  price: string;
  description: string;
  image?: string;
  cartId: string;
  startStock: number;
  /** Per-tick drop. Defaults to 1. */
  stockStep?: number;
  /** UTC midnight anchor for the stock cycle. Defaults to STOCK_EPOCH_MS. */
  stockAnchorMs?: number;
  /** Floor of the cycle. The count walks down to this and then resets to startStock. Defaults to 1. */
  stockMinimum?: number;
  /** When true, render a Pre-Order badge instead of the in-stock counter and a placeholder button until a cartId is wired up. */
  preorder?: boolean;
  /** Human-readable ship date shown on the pre-order badge. */
  shipsBy?: string;
};

const products: Product[] = [
  {
    id: "retatrutide",
    name: "Retatrutide",
    subtitle: "The Engine",
    dose: "20mg",
    price: "$215",
    description:
      "GLP-1 / GIP / Glucagon triple agonist. Reduces food noise, raises metabolic output, and stimulates stored fat oxidation.",
    image: "/reta-product.png",
    cartId: "3GQWA553XEXNU",
    startStock: 21,
    stockStep: 2,
    stockMinimum: 3,
    stockAnchorMs: Date.UTC(2026, 4, 30),
    preorder: false,
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    subtitle: "The Architect",
    dose: "10mg blend",
    price: "$105",
    description:
      "Growth hormone pulse amplification. Builds lean muscle, improves sleep depth, and supports recovery during deficit.",
    image: "/cjc-ipa-product.png",
    cartId: "SPCE9E3H3VVX2",
    startStock: 18,
    stockStep: 2,
    stockMinimum: 3,
    stockAnchorMs: Date.UTC(2026, 4, 30),
    preorder: false,
  },
  {
    id: "bpc-tb500",
    name: "BPC-157 + TB-500",
    subtitle: "The Shield",
    dose: "20mg blend",
    price: "$145",
    description:
      "Local + systemic repair. Accelerates connective tissue recovery, reduces inflammatory drag, supports tendon integrity.",
    image: "/bpc-tb-product.png",
    cartId: "B62P3JVPTD6CA",
    startStock: 22,
    stockStep: 2,
    stockMinimum: 3,
    stockAnchorMs: Date.UTC(2026, 4, 30),
    preorder: true,
    shipsBy: "6/22",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "The Restorer",
    dose: "50mg",
    price: "$85",
    description:
      "Copper peptide signaling support. Helps with skin quality, tissue restoration, and hair vitality. Designed to support visible regeneration and biological renewal.",
    image: "/GHKCU.png",
    cartId: "MRUXNK54XGUQ6",
    startStock: 17,
    stockStep: 2,
    stockMinimum: 3,
    stockAnchorMs: Date.UTC(2026, 4, 30),
    preorder: false,
  },
];

function ProductImage({ product }: { product: Product }) {
  if (product.image) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center">
        <img
          src={product.image}
          alt={`${product.name} ${product.dose} vial`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }
  return <PlaceholderImage label={product.name} />;
}

function PlaceholderImage({ label }: { label: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--muted)] via-[var(--muted-dark)] to-[var(--accent-light)] border border-[var(--border)] flex items-center justify-center">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[var(--accent)]/40 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[var(--primary)]/20 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center text-center px-6">
        <svg
          className="w-16 h-16 text-[var(--primary)]/30 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]/50">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function SinglesCatalog() {
  return (
    <div id="top" className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </a>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="/"
              className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
            >
              ← Back to POWER CUT™
            </a>
            <div className="paypal-cart-slot">
              <paypal-cart-button data-id="pp-view-cart-header"></paypal-cart-button>
            </div>
          </div>
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>SINGLES CATALOG</span>
              </div>

              <h1 className="mt-8 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                Individual Research Compounds
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 animate-fade-in-up stagger-1">
                The same lab-tested peptides found inside the POWER CUT
                <span className="text-[0.6em] align-super">™</span> system —
                available as standalone vials for research use.
              </p>
            </div>
          </Container>
        </Section>

        {/* Product Grid */}
        <Section className="bg-white">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--muted)] p-5 sm:p-6 card-hover"
                >
                  <ProductImage product={product} />

                  <div className="mt-5 flex-1 flex flex-col">
                    <span className="self-start inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-1.5 text-sm font-extrabold uppercase tracking-widest text-[var(--accent)] shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      {product.subtitle}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold text-[var(--primary)] tracking-tight">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[var(--primary)]/70">
                      {product.dose}
                    </p>

                    <p className="mt-4 text-[var(--primary)]/70 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    {product.preorder ? (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/40 px-3 py-2.5">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent-dark)]" />
                        </span>
                        <p className="text-sm font-bold text-[var(--accent-dark)]">
                          Pre-Order{" "}
                          <span className="text-[var(--accent-dark)]/50">•</span>{" "}
                          Only{" "}
                          <span className="font-extrabold">
                            {currentStock(product.startStock, {
                              step: product.stockStep,
                              anchorMs: product.stockAnchorMs,
                              minimum: product.stockMinimum,
                            })}
                          </span>{" "}
                          vials remaining
                          {product.shipsBy ? (
                            <>
                              {" "}
                              <span className="text-[var(--accent-dark)]/50">
                                •
                              </span>{" "}
                              Ships{" "}
                              <span className="font-extrabold">
                                {product.shipsBy}
                              </span>
                            </>
                          ) : null}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2.5">
                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        </span>
                        <p className="text-sm font-bold text-emerald-700">
                          In Stock{" "}
                          <span className="text-emerald-700/50">•</span> Only{" "}
                          <span className="font-extrabold">
                            {currentStock(product.startStock, {
                              step: product.stockStep,
                              anchorMs: product.stockAnchorMs,
                              minimum: product.stockMinimum,
                            })}
                          </span>{" "}
                          left{" "}
                          <span className="text-emerald-700/50">•</span> Ships
                          within 24 hrs
                        </p>
                      </div>
                    )}

                    <div className="mt-5 pt-5 border-t border-[var(--border)]">
                      <div className="flex items-end justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]/50">
                            Price
                          </p>
                          <p className="text-3xl font-bold text-[var(--primary)]">
                            {product.price}
                          </p>
                        </div>
                      </div>
                      {product.cartId ? (
                        <div className="paypal-add-to-cart-host">
                          <paypal-add-to-cart-button
                            data-id={product.cartId}
                          ></paypal-add-to-cart-button>
                        </div>
                      ) : (
                        // Placeholder rendered until the PayPal cart ID is wired up.
                        // Swap the parent ternary by setting `cartId` on the product
                        // and the existing PayPal flow takes over automatically.
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="w-full inline-flex items-center justify-center rounded-xl bg-[var(--primary)]/90 text-white text-base font-semibold py-3.5 px-6 cursor-not-allowed opacity-90"
                        >
                          Pre-Order — Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center gap-4">
              <div className="paypal-cart-slot paypal-cart-slot-inline">
                <paypal-cart-button data-id="pp-view-cart-floating"></paypal-cart-button>
              </div>
              <p className="text-center text-sm text-[var(--primary)]/50">
                For laboratory research only. Not for human consumption.
              </p>
            </div>
          </Container>
        </Section>

        {/* System CTA */}
        <Section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Most people don&rsquo;t run this alone.
              </h2>

              <div className="mt-8 space-y-4 text-lg text-white/80">
                <p>
                  This compound is typically used as part of a structured
                  system.
                </p>
                <p>On its own, it plays a role.</p>
                <p>
                  When combined correctly, things shift faster — and more
                  predictably.
                </p>
              </div>

              <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur border border-white/10">
                <p className="text-white/90 text-lg leading-relaxed">
                  The full{" "}
                  <span className="font-bold text-[var(--accent)]">
                    POWER CUT
                    <span className="text-[0.6em] align-super">™</span>
                  </span>{" "}
                  system includes this plus the complementary components,
                  already structured together.
                </p>
              </div>

              <a
                href="/"
                className="btn-accent inline-flex h-auto sm:h-20 items-center justify-center gap-2 sm:gap-3 rounded-2xl px-5 sm:px-14 py-4 sm:py-0 text-sm sm:text-2xl font-extrabold uppercase tracking-normal sm:tracking-wide leading-tight mt-10 shadow-2xl ring-4 ring-[var(--accent)]/30 animate-pulse-slow text-center max-w-full"
              >
                View Full System
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-6 sm:h-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </Container>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white">
        <Container className="py-12">
          <div className="text-center pb-8 border-b border-white/10">
            <p className="text-sm text-white/60">
              {siteCopy.footer.productDisclaimer}
            </p>
          </div>
          <div className="py-8 border-b border-white/10">
            <div className="flex items-center justify-center">
              <a href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </a>
            </div>
          </div>
          <div className="pt-8">
            <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
              {siteCopy.footer.disclaimer}
            </p>
            <p className="text-xs text-white/40 text-center mt-6">
              &copy; {new Date().getFullYear()} {siteCopy.footer.copyrightName}.
              All rights reserved.
            </p>
          </div>
        </Container>
      </footer>

      <CartScripts />
    </div>
  );
}
