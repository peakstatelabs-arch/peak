interface PricingCardProps {
  name: string;
  subtitle: string;
  description: string;
  features: string[];
  estimatedValue: string;
  price: string;
  installment: string;
  savings: string;
  ctaLabel: string;
  ctaSubtext: string;
  preorderNote: string;
  refundNote: string;
  popular?: boolean;
}

export function PricingCard({
  name,
  subtitle,
  description,
  features,
  estimatedValue,
  price,
  installment,
  savings,
  ctaLabel,
  ctaSubtext,
  preorderNote,
  refundNote,
  popular,
}: PricingCardProps) {
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
            <span className="text-3xl font-bold text-[var(--primary)]">
              {price}
            </span>
          </div>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            or 4 interest-free payments of <span className="font-semibold text-[var(--primary)]">{installment}</span>
          </p>

          {/* CTA Button */}
          <button
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              popular
                ? "btn-accent"
                : "btn-primary"
            }`}
          >
            <span className="text-base">{ctaLabel}</span>
            <span className="block text-xs font-normal mt-1 opacity-90">{ctaSubtext}</span>
          </button>

          {/* Preorder Note */}
          <p className="text-center text-xs font-semibold text-[var(--accent-dark)] mt-4 uppercase tracking-wide">
            {preorderNote}
          </p>
          <p className="text-center text-xs text-[var(--primary)]/50 mt-2">
            {refundNote}
          </p>
        </div>
      </div>
    </div>
  );
}
