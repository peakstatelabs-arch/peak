import type { Metadata } from "next";
import Stripe from "stripe";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { SINGLES_PRICE_IDS } from "@/app/singles/cart/priceCatalog";

export const metadata: Metadata = {
  title: "Order Confirmed — Peak State Labs",
  description:
    "Your Peak State Labs singles order is confirmed. Lab-tested peptides shipping to you within 24 hours.",
};

export const dynamic = "force-dynamic";

type OrderLine = {
  name: string;
  quantity: number;
  amountCents: number;
};

type OrderSummary = {
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  shippingName?: string;
  shippingLine1?: string;
  shippingLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPostal?: string;
  shippingCountry?: string;
  email?: string;
};

const ALLOWED_PRICE_IDS = new Set<string>(Object.values(SINGLES_PRICE_IDS));

async function fetchOrder(sessionId: string): Promise<OrderSummary | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items",
        "line_items.data.price",
        "collected_information",
      ],
    });

    if (session.mode !== "payment") return null;
    if (session.payment_status !== "paid" && session.status !== "complete") {
      return null;
    }

    const lineItems = session.line_items?.data ?? [];
    const lines: OrderLine[] = [];
    for (const li of lineItems) {
      const priceId =
        typeof li.price === "string" ? li.price : li.price?.id ?? "";
      // Only render items that came from the singles catalog. Anything else
      // means a session we didn't create — refuse to leak details.
      if (!ALLOWED_PRICE_IDS.has(priceId)) return null;
      lines.push({
        name: li.description ?? "Peak State Labs vial",
        quantity: li.quantity ?? 1,
        amountCents: li.amount_total ?? 0,
      });
    }

    const shipping = session.collected_information?.shipping_details;
    const address = shipping?.address;

    return {
      lines,
      subtotalCents: session.amount_subtotal ?? 0,
      shippingCents:
        (session.total_details?.amount_shipping ?? 0) as number,
      totalCents: session.amount_total ?? 0,
      currency: (session.currency ?? "usd").toUpperCase(),
      shippingName: shipping?.name ?? undefined,
      shippingLine1: address?.line1 ?? undefined,
      shippingLine2: address?.line2 ?? undefined,
      shippingCity: address?.city ?? undefined,
      shippingState: address?.state ?? undefined,
      shippingPostal: address?.postal_code ?? undefined,
      shippingCountry: address?.country ?? undefined,
      email: session.customer_details?.email ?? undefined,
    };
  } catch (err) {
    console.error("singles/thankyou fetchOrder error:", err);
    return null;
  }
}

function formatUsd(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export default async function SinglesThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const order = session_id ? await fetchOrder(session_id) : null;
  const firstName = order?.shippingName?.trim().split(/\s+/)[0];

  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
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
        </Container>
      </header>

      <main>
        {/* Hero */}
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)] animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
                <span>ORDER CONFIRMED</span>
              </div>

              <h1 className="mt-6 text-balance text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up">
                {firstName
                  ? `${firstName}, Your Research Stack Is Locked In.`
                  : "Your Research Stack Is Locked In."}
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-[var(--primary)]/70 animate-fade-in-up stagger-1">
                You&rsquo;ve chosen precision over guesswork. Lab-tested,
                99%+ purity compounds — shipping to you within 24 hours.
              </p>

              {order?.email && (
                <p className="mt-4 text-sm text-[var(--primary)]/60 animate-fade-in-up stagger-2">
                  A confirmation has been sent to{" "}
                  <span className="font-semibold text-[var(--primary)]/80">
                    {order.email}
                  </span>
                  . Tracking will follow when your order ships.
                </p>
              )}
            </div>
          </Container>
        </Section>

        {/* Order Summary */}
        {order && (
          <Section className="bg-white">
            <Container>
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Order Summary
                  </h2>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6 sm:p-8 shadow-sm">
                  <ul className="divide-y divide-[var(--border)]">
                    {order.lines.map((line, i) => (
                      <li
                        key={`${line.name}-${i}`}
                        className="py-4 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[var(--primary)]">
                            {line.name}
                          </p>
                          <p className="text-sm text-[var(--primary)]/60">
                            Qty {line.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-[var(--primary)] whitespace-nowrap">
                          {formatUsd(line.amountCents, order.currency)}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2 text-sm">
                    <div className="flex items-center justify-between text-[var(--primary)]/70">
                      <span>Subtotal</span>
                      <span>
                        {formatUsd(order.subtotalCents, order.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[var(--primary)]/70">
                      <span>Shipping</span>
                      <span>
                        {order.shippingCents > 0
                          ? formatUsd(order.shippingCents, order.currency)
                          : "Free"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-base font-bold text-[var(--primary)]">
                      <span>Total</span>
                      <span>
                        {formatUsd(order.totalCents, order.currency)}
                      </span>
                    </div>
                  </div>

                  {(order.shippingLine1 || order.shippingCity) && (
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]/50">
                        Shipping to
                      </p>
                      <address className="mt-2 not-italic text-sm text-[var(--primary)]/80 leading-relaxed">
                        {order.shippingName && (
                          <>
                            {order.shippingName}
                            <br />
                          </>
                        )}
                        {order.shippingLine1}
                        {order.shippingLine2 ? (
                          <>
                            <br />
                            {order.shippingLine2}
                          </>
                        ) : null}
                        <br />
                        {[
                          order.shippingCity,
                          order.shippingState,
                          order.shippingPostal,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                        {order.shippingCountry
                          ? ` · ${order.shippingCountry}`
                          : ""}
                      </address>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </Section>
        )}

        {/* What Happens Next */}
        <Section className={order ? "bg-[var(--muted)]" : "bg-white"}>
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  What Happens Next
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Your Compounds Ship Within 24 Hours.",
                    body: "Your vials are pulled, packed, and dispatched with tracking. You'll receive a shipping notification the moment they leave the lab.",
                  },
                  {
                    title: "Batch Documentation Follows.",
                    body: "Every Peak State Labs vial ships with lab documentation showing 99%+ purity. Read it. Verify it. Trust the data — not the marketing.",
                  },
                  {
                    title: "Run the Protocol With Precision.",
                    body: "The compound is one variable. Dose, timing, and sequence are the others. Treat them with the same rigor as the vial itself.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className={`p-6 sm:p-8 rounded-2xl bg-white border border-[var(--border)] shadow-sm card-hover animate-fade-in-up stagger-${
                      index + 1
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--primary)] font-bold text-lg">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-bold text-xl text-[var(--primary)]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-base text-[var(--primary)]/80 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Community */}
        <Section className="bg-[var(--primary)] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Run With People Who Know These Compounds.
              </h2>
              <p className="mt-6 text-lg text-white/80 leading-relaxed">
                Inside the private Peak State Labs community you&rsquo;ll
                find dosing wisdom, real protocols, and direct answers
                from operators running these same compounds — plus the
                team that ships them.
              </p>
              <a
                href="https://www.skool.com/peak-state-labs-7241/about"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent inline-flex h-14 items-center justify-center gap-2 rounded-2xl px-8 text-base sm:text-lg font-extrabold uppercase tracking-wide mt-10 shadow-2xl ring-4 ring-[var(--accent)]/30"
              >
                Join the Community
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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

        {/* Soft cross-sell to POWER CUT */}
        <Section className="bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent-dark)]">
                Most Customers Don&rsquo;t Run These Alone
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                A Single Compound Is a Tool. The System Is the Result.
              </h2>
              <p className="mt-6 text-lg text-[var(--primary)]/70 leading-relaxed">
                On its own, each compound plays a role. Combined and
                sequenced correctly — inside the POWER CUT
                <span className="text-[0.6em] align-super">™</span> system
                — the outcomes stack faster and more predictably.
              </p>

              <a
                href="/"
                className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--primary)] px-8 text-base sm:text-lg font-semibold text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-colors"
              >
                See the Full POWER CUT
                <span className="text-[0.7em] align-super">™</span> System
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
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

        {/* Support */}
        <Section className="bg-gradient-to-br from-[var(--muted)] to-[var(--accent)]/10">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Need support?
              </h2>
              <p className="mt-6 text-lg text-[var(--primary)]/80 leading-relaxed">
                Order questions, shipping questions, or anything else —
                we&rsquo;re here.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:3135959239"
                  className="btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-base sm:text-lg font-semibold whitespace-nowrap"
                >
                  Call: 313-595-9239
                </a>
                <a
                  href="mailto:drew@peakstate.shop"
                  className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-[var(--border)] bg-white px-8 text-base sm:text-lg font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)] whitespace-nowrap"
                >
                  Email Support
                </a>
              </div>
              <p className="mt-6 text-sm text-[var(--primary)]/60">
                drew@peakstate.shop
              </p>
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
