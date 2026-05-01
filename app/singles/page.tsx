import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

export const metadata: Metadata = {
  title: `Singles Catalog — ${siteCopy.brand.name}`,
  description:
    "Individual research peptides from Peak State Labs. Retatrutide, CJC-1295 + Ipamorelin, and BPC-157 + TB-500.",
};

type Product = {
  id: string;
  name: string;
  subtitle: string;
  dose: string;
  price: string;
  description: string;
  image?: string;
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
  },
  {
    id: "bpc-tb500",
    name: "BPC-157 + TB-500",
    subtitle: "The Shield",
    dose: "20mg blend",
    price: "$169",
    description:
      "Local + systemic repair. Accelerates connective tissue recovery, reduces inflammatory drag, and supports tendon integrity.",
    image: "/bpc-tb-product.png",
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
          <a
            href="/"
            className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
          >
            ← Back to POWER CUT™
          </a>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col rounded-3xl border border-[var(--border)] bg-[var(--muted)] p-5 sm:p-6 card-hover"
                >
                  <ProductImage product={product} />

                  <div className="mt-5 flex-1 flex flex-col">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-dark)]">
                      {product.subtitle}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-[var(--primary)] tracking-tight">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[var(--primary)]/70">
                      {product.dose}
                    </p>

                    <p className="mt-4 text-[var(--primary)]/70 text-sm leading-relaxed">
                      {product.description}
                    </p>

                    <div className="mt-6 pt-6 border-t border-[var(--border)] flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--primary)]/50">
                          Price
                        </p>
                        <p className="text-3xl font-bold text-[var(--primary)]">
                          {product.price}
                        </p>
                      </div>
                      <a
                        href="/research-access"
                        className="btn-accent inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-extrabold uppercase tracking-wide shadow-lg ring-2 ring-[var(--accent)]/30 transition-transform group-hover:scale-105"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-[var(--primary)]/50">
              For laboratory research only. Not for human consumption.
            </p>
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
    </div>
  );
}
