"use client";

import { TrackedLink } from "./TrackedLink";
import { POWERCUT_SALE, withPromoCode, type SaleStatus } from "@/app/lib/sale";
import { useSaleStatus } from "@/app/lib/useSaleStatus";
import { formatUsd } from "@/app/singles/cart/CartContext";

interface PricingCardProps {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  features: string[];
  estimatedValue: string;
  price: string;
  perStackPrice?: string;
  installment: string;
  savings: string;
  ctaLabel: string;
  ctaSubtext: string;
  stripeUrl: string;
  preorderNote: string;
  refundNote: string;
  /** When set, renders a "Pre-order · Ships {shipsBy}" line under the CTA. */
  shipsBy?: string;
  popular?: boolean;
  /** Server-evaluated sale state, so the first paint matches the server clock. */
  initialSale?: SaleStatus;
}

export function PricingCard({
  id,
  name,
  subtitle,
  description,
  features,
  estimatedValue,
  price,
  perStackPrice,
  installment,
  savings,
  ctaLabel,
  ctaSubtext,
  stripeUrl,
  preorderNote,
  refundNote,
  shipsBy,
  popular,
  initialSale,
}: PricingCardProps) {
  // Temporary sale: only the tiers listed in POWERCUT_SALE are discounted. The
  // discount itself is a Stripe promo code pre-applied on the Payment Link.
  const saleOn = useSaleStatus(initialSale).powerCut;
  const ps = saleOn ? POWERCUT_SALE[id] : undefined;
  const shownPrice = ps ? formatUsd(ps.saleCents) : price;
  const shownInstallment = ps ? ps.installment : installment;
  const shownPerStack =
    ps && id === "double" ? `Only $${(ps.saleCents / 200).toFixed(2)} per stack` : perStackPrice;
  const href = ps ? withPromoCode(stripeUrl, ps.code) : stripeUrl;

  return (
    <div
      className={`relative rounded-3xl p-1 ${
        popular
          ? "bg-gradient-to-b from-[var(--accent)] to-[var(--accent-dark)]"
          : ""
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--primary)] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}
      <div
        className={`h-full rounded-[1.4rem] bg-white p-6 sm:p-8 flex flex-col ${
          popular ? "shadow-2xl" : "border border-[var(--border)] shadow-sm"
        } card-hover`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[var(--primary)]">{name}</h3>
          <p className="text-sm text-[var(--accent-dark)] font-semibold mt-1">
            {subtitle}
          </p>
          <p className="text-[15px] text-[var(--primary)]/70 mt-3 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mt-0.5">
                <svg
                  className="w-3 h-3 text-[var(--accent-dark)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <span className="text-[15px] text-[var(--primary)]/90 font-medium">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="border-t border-[var(--border)] pt-6">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-[var(--primary)]/50 line-through">
              Estimated Value: {estimatedValue}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[var(--primary)]/60">Your Price:</span>
            {ps && (
              <span className="text-lg font-semibold text-[var(--primary)]/40 line-through">
                {price}
              </span>
            )}
            <span className="text-3xl font-bold text-[var(--primary)]">
              {shownPrice}
            </span>
          </div>
          {ps && (
            <div className="mt-3">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                Save {formatUsd(ps.listCents - ps.saleCents)}
              </span>
              <p className="mt-1.5 text-xs text-[var(--primary)]/55">
                Code {ps.code} auto-applied at checkout
              </p>
            </div>
          )}
          {shownPerStack && (
            <p className="mt-2 inline-flex items-center rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-bold text-[var(--accent-dark)]">
              {shownPerStack}
            </p>
          )}
          <p className="text-sm text-[var(--primary)]/60 mt-2">
            or 4 interest-free payments of <span className="font-semibold text-[var(--primary)]">{shownInstallment}</span>
          </p>

          {/* CTA Button */}
          <TrackedLink
            href={href}
            data-rewardful
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-base text-center transition-all duration-300 block ${
              popular
                ? "btn-accent"
                : "btn-primary"
            }`}
            event="add_to_cart_click"
            eventProperties={{
              funnel: "powercut",
              product: "POWER CUT™ Stack",
              tier: name,
              tier_id: id,
              price: shownPrice,
              installment: shownInstallment,
              sale_code: ps?.code,
              popular: !!popular,
            }}
            webhookEndpoint="/api/cart-event"
          >
            {ctaLabel}
          </TrackedLink>

          {shipsBy && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-[var(--accent-dark)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-dark)]" />
              </span>
              Pre-order · Ships {shipsBy}
            </p>
          )}

          {refundNote && (
            <p className="mt-2 flex items-start justify-center gap-1.5 text-center text-xs text-[var(--primary)]/55 leading-relaxed">
              <svg
                className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[var(--primary)]/45"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {refundNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
