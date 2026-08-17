import { TrackedLink } from "./TrackedLink";

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
  /**
   * Force the highlighted (gradient + shadow) styling independent of
   * `popular`. Defaults to `popular` so existing call sites are unchanged.
   */
  highlighted?: boolean;
  /**
   * Override the badge text. `undefined` keeps the default behavior (a
   * "MOST POPULAR" badge when `popular`); an explicit `null` forces no badge;
   * a string renders that badge (e.g. "BEST FOR YOU" from the quiz).
   */
  badgeLabel?: string | null;
  /** Extra analytics properties merged into the CTA's tracked event. */
  ctaEventProperties?: Record<string, string | number | boolean | null | undefined>;
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
  highlighted,
  badgeLabel,
  ctaEventProperties,
}: PricingCardProps) {
  const isHighlighted = highlighted ?? popular;
  const badge =
    badgeLabel === undefined ? (popular ? "MOST POPULAR" : null) : badgeLabel;
  return (
    <div
      className={`relative rounded-3xl p-1 ${
        isHighlighted
          ? "bg-gradient-to-b from-[var(--accent)] to-[var(--accent-dark)]"
          : ""
      }`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--primary)] text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          {badge}
        </div>
      )}
      <div
        className={`h-full rounded-[1.4rem] bg-white p-6 sm:p-8 flex flex-col ${
          isHighlighted ? "shadow-2xl" : "border border-[var(--border)] shadow-sm"
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
            <span className="text-3xl font-bold text-[var(--primary)]">
              {price}
            </span>
          </div>
          {perStackPrice && (
            <p className="mt-2 inline-flex items-center rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-bold text-[var(--accent-dark)]">
              {perStackPrice}
            </p>
          )}
          <p className="text-sm text-[var(--primary)]/60 mt-2">
            or 4 interest-free payments of <span className="font-semibold text-[var(--primary)]">{installment}</span>
          </p>

          {/* CTA Button */}
          <TrackedLink
            href={stripeUrl}
            data-rewardful
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-base text-center transition-all duration-300 block ${
              isHighlighted
                ? "btn-accent"
                : "btn-primary"
            }`}
            event="add_to_cart_click"
            eventProperties={{
              funnel: "powercut",
              product: "POWER CUT™ Stack",
              tier: name,
              tier_id: id,
              price,
              installment,
              popular: !!popular,
              ...ctaEventProperties,
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
