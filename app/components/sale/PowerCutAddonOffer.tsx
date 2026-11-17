"use client";

import { useEffect, useState } from "react";
import { formatUsd } from "@/app/lib/money";
import { POWERCUT_ADDON_PCT, SALE_NAME, pctOff } from "@/app/lib/sale";
import { useSaleStatus, type SaleStatus } from "@/app/lib/useSaleStatus";
import {
  ADDONS,
  PC_ADDON_PICKS,
  PC_ADDON_STORAGE_KEY,
  SHORT_NAME,
  isAddonKey,
  product,
  type ProductSlug,
} from "@/app/lib/bfStacks";

// Already inside POWER CUT™, so never offered as an add-on.
const IN_POWERCUT: ProductSlug[] = ["retatrutide", "cjc-ipamorelin", "bpc-tb500"];

/**
 * POWER CUT™ thank-you page, during the sale: "Complete your stack" — add-on
 * vials at the top tier (40% off). Paid through the singles checkout, which
 * verifies this POWER CUT session before applying the discount.
 */
export function PowerCutAddonOffer({
  sessionId,
  initialSale,
}: {
  sessionId: string;
  initialSale: SaleStatus;
}) {
  const sale = useSaleStatus(initialSale);
  const [picks, setPicks] = useState<{ slug: ProductSlug; label: string }[]>(PC_ADDON_PICKS);
  const [qty, setQty] = useState<Partial<Record<ProductSlug, number>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lead with what they picked in the quiz ("I'd also love to improve…").
  useEffect(() => {
    let key: string | null = null;
    try {
      key = window.localStorage.getItem(PC_ADDON_STORAGE_KEY);
    } catch {
      // ignore
    }
    if (!isAddonKey(key)) return;
    const quiz = ADDONS[key].products
      .filter((p) => !IN_POWERCUT.includes(p))
      .map((p) => ({ slug: p, label: `Your pick: ${ADDONS[key].label.toLowerCase()}` }));
    if (quiz.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot read of the quiz pick from localStorage after mount
    setPicks([...quiz, ...PC_ADDON_PICKS.filter((p) => !quiz.some((q) => q.slug === p.slug))]);
    setQty(Object.fromEntries(quiz.map((q) => [q.slug, 1])));
  }, []);

  if (!sale.live) return null;

  const chosen = picks.filter((p) => (qty[p.slug] ?? 0) > 0);
  const full = chosen.reduce((n, p) => n + product(p.slug).priceCents * (qty[p.slug] ?? 0), 0);
  const price = pctOff(full, POWERCUT_ADDON_PCT);

  async function checkout() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          powerCutSessionId: sessionId,
          items: chosen.map((p) => ({
            priceId: product(p.slug).priceId,
            quantity: qty[p.slug] ?? 1,
          })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      try {
        window.localStorage.removeItem(PC_ADDON_STORAGE_KEY);
      } catch {
        // ignore
      }
      window.location.assign(data.url);
    } catch {
      setError("Network error. Please try again in a moment.");
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-[#0b0f1a] px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--accent)]">
          {SALE_NAME[sale.phase]} · POWER CUT&trade; members only
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
          Complete your stack at {POWERCUT_ADDON_PCT}% off
        </h2>
        <p className="mt-2 text-white/70">
          Your POWER CUT&trade; already unlocked our top discount. Add any of
          these to round out your results — ships with your order.
        </p>
        <div className="mt-6 space-y-3">
          {picks.map((p) => {
            const prod = product(p.slug);
            const q = qty[p.slug] ?? 0;
            return (
              <div
                key={p.slug}
                className={`flex items-center gap-4 rounded-2xl border-2 p-3.5 ${q > 0 ? "border-[var(--accent)] bg-white/10" : "border-white/15 bg-white/5"}`}
              >
                <img
                  src={prod.image}
                  alt=""
                  aria-hidden="true"
                  className="h-16 w-16 flex-shrink-0 rounded-xl bg-white object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">{p.label}</p>
                  <p className="font-extrabold">
                    {SHORT_NAME[p.slug]} <span className="font-medium text-white/60">{prod.dose}</span>
                  </p>
                  <p className="text-sm tabular-nums">
                    <span className="mr-1.5 text-white/40 line-through">{prod.price}</span>
                    <span className="font-bold">{formatUsd(pctOff(prod.priceCents, POWERCUT_ADDON_PCT))}</span>
                  </p>
                </div>
                <div className="inline-flex items-center rounded-xl border border-white/20">
                  <button
                    type="button"
                    aria-label={`Fewer ${SHORT_NAME[p.slug]}`}
                    onClick={() => setQty((s) => ({ ...s, [p.slug]: Math.max(0, q - 1) }))}
                    className="h-10 w-10 text-lg font-bold disabled:opacity-30"
                    disabled={q === 0}
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-extrabold tabular-nums">{q}</span>
                  <button
                    type="button"
                    aria-label={`More ${SHORT_NAME[p.slug]}`}
                    onClick={() => setQty((s) => ({ ...s, [p.slug]: Math.min(10, q + 1) }))}
                    className="h-10 w-10 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {error && <p className="mt-4 text-sm font-semibold text-red-400">{error}</p>}
        <button
          type="button"
          onClick={checkout}
          disabled={chosen.length === 0 || submitting}
          className="mt-6 w-full rounded-2xl bg-[var(--accent)] py-4 text-lg font-black text-[#0b0f1a] disabled:opacity-40"
        >
          {submitting
            ? "Redirecting…"
            : chosen.length === 0
              ? "Choose an add-on above"
              : `Add to my stack — ${formatUsd(price)} (save ${formatUsd(full - price)})`}
        </button>
        <p className="mt-2 text-center text-xs text-white/50">
          Secure checkout by Stripe. Your email is filled in for you.
        </p>
      </div>
    </section>
  );
}
