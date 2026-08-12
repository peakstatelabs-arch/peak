"use client";

import { useMemo } from "react";
import posthog from "posthog-js";
import { siteCopy } from "@/content/siteCopy";
import { reviews, type Review } from "@/content/reviews";
import { AddToCartButton } from "@/app/singles/cart/AddToCartButton";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";
import {
  type QuizAnswers,
  type Recommendation,
  type StackTierId,
  goalMeta,
  reviewCategoriesForGoal,
} from "./quizConfig";

/* ─────────────────────────── Testimonial picker ────────────────────────── */

function pickTestimonials(answers: QuizAnswers, count = 3): Review[] {
  const wanted = new Set(reviewCategoriesForGoal(answers.primaryGoal));
  const withQuote = reviews.filter((r) => r.quote && r.quote.trim().length > 0);
  const matched = withQuote.filter((r) =>
    r.categories.some((c) => wanted.has(c)),
  );
  const rest = withQuote.filter((r) => !matched.includes(r));
  // Prefer goal-matched, then fill from the rest so we always show `count`.
  const ordered = [...matched, ...rest];
  const seen = new Set<string>();
  const out: Review[] = [];
  for (const r of ordered) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
    if (out.length >= count) break;
  }
  return out;
}

/* ────────────────────────────── Small atoms ────────────────────────────── */

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 text-[var(--accent)] ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M9.05 2.927c.3-.921 1.6-.921 1.9 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 00-1.176 0l-3.366 2.446c-.783.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.354 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────── Stack cycle selector ──────────────────────── */

type Tier = (typeof siteCopy.pricing.tiers)[number];

function StackOffer({
  recommendedTier,
  onCheckout,
}: {
  recommendedTier: StackTierId;
  onCheckout: (tier: Tier) => void;
}) {
  const tiers = siteCopy.pricing.tiers;
  const ordered = [...tiers].sort((a, b) =>
    a.id === recommendedTier ? -1 : b.id === recommendedTier ? 1 : 0,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {ordered.map((tier) => {
        const featured = tier.id === recommendedTier;
        return (
          <div
            key={tier.id}
            className={`relative flex flex-col rounded-3xl border p-6 ${
              featured
                ? "border-[var(--accent)] bg-[var(--accent)]/[0.06] shadow-lg ring-1 ring-[var(--accent)]/40"
                : "border-[var(--border)] bg-white"
            }`}
          >
            {featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[var(--primary)]">
                Best for you
              </span>
            )}
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)]">
              {tier.subtitle}
            </p>
            <h4 className="mt-1 text-xl font-bold text-[var(--primary)]">
              {tier.name}
            </h4>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--primary)]">
                {tier.price}
              </span>
              {"perStackPrice" in tier && tier.perStackPrice ? (
                <span className="text-xs font-semibold text-[var(--primary)]/60">
                  {tier.perStackPrice}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-[var(--primary)]/70 leading-relaxed">
              {tier.description}
            </p>
            <button
              type="button"
              onClick={() => onCheckout(tier)}
              className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-base font-bold transition-colors ${
                featured
                  ? "bg-[var(--accent)] text-[var(--primary)] hover:bg-[var(--accent-dark)] hover:text-white"
                  : "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              }`}
            >
              {tier.ctaLabel}
            </button>
            <p className="mt-2 text-center text-xs text-[var(--primary)]/50">
              Secure checkout by Stripe
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────── Add-on card ────────────────────────────── */

function AddOnCard({
  name,
  dose,
  price,
  image,
  reason,
  slug,
  priceId,
  priceCents,
}: {
  name: string;
  dose: string;
  price: string;
  image: string;
  reason: string;
  slug: string;
  priceId: string;
  priceCents: number;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          <img src={image} alt={name} className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-bold text-[var(--primary)]">{name}</p>
            <p className="font-bold text-[var(--primary)]">{price}</p>
          </div>
          <p className="text-xs text-[var(--primary)]/60">{dose}</p>
          <p className="mt-2 text-sm text-[var(--primary)]/70 leading-snug">
            {reason}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <AddToCartButton
          slug={slug}
          priceId={priceId}
          name={name}
          dose={dose}
          unitPriceCents={priceCents}
          image={image}
        />
      </div>
    </div>
  );
}

/* ───────────────────────────────── Results ─────────────────────────────── */

export function QuizResults({
  answers,
  recommendation,
  name,
  onRestart,
}: {
  answers: QuizAnswers;
  recommendation: Recommendation;
  name?: string;
  onRestart: () => void;
}) {
  const testimonials = useMemo(() => pickTestimonials(answers), [answers]);
  const gm = goalMeta(answers.primaryGoal);
  const isStack = recommendation.kind === "stack";
  const firstName = name?.split(/\s+/)[0];

  function checkoutStack(tier: Tier) {
    // The POWER CUT stack is a hosted Stripe payment link (not the on-site
    // cart), so we send the buyer straight there. Log the intent first so it
    // lands in the same PostHog/Zapier funnels the singles cart uses.
    try {
      posthog.capture("quiz_stack_checkout_click", {
        tier: tier.id,
        price: tier.price,
        primary_goal: answers.primaryGoal,
      });
    } catch {
      // Never block checkout on analytics.
    }
    window.location.href = tier.stripeUrl;
  }

  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <img src="/logo.png" alt="Peak State Labs" className="h-7 w-7 rounded-lg" />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </div>
          <ViewCartButton variant="header" />
        </div>
      </header>

      {/* Hero / recommendation */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
            <span>YOUR PERSONALIZED PROTOCOL</span>
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {firstName ? `${firstName}, here's your match` : "Here's your match"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[var(--primary)]/70">
            Based on your goal of{" "}
            <span className="font-semibold text-[var(--primary)]">
              {gm.emoji} {gm.label.toLowerCase()}
            </span>
            , your experience level and your timeline, this is the fastest
            structured path to your result.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        {/* Primary recommendation card */}
        <div className="-mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)]">
            Recommended for you
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-[var(--primary)]">
            {isStack
              ? "The POWER CUT™ Protocol"
              : `${recommendation.primary?.name} — ${recommendation.primary?.tagline}`}
          </h2>

          {!isStack && recommendation.primary && (
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="h-40 w-40 flex-shrink-0 self-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
                <img
                  src={recommendation.primary.image}
                  alt={recommendation.primary.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-[var(--primary)]/75 leading-relaxed">
                  {recommendation.primary.blurb}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-[var(--primary)]">
                    {recommendation.primary.price}
                  </span>
                  <span className="text-sm text-[var(--primary)]/60">
                    {recommendation.primary.dose} · single vial
                  </span>
                </div>
                <div className="mt-4">
                  <AddToCartButton
                    slug={recommendation.primary.slug}
                    priceId={recommendation.primary.priceId}
                    name={recommendation.primary.name}
                    dose={recommendation.primary.dose}
                    unitPriceCents={recommendation.primary.priceCents}
                    image={recommendation.primary.image}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Why this fits */}
          <ul className="mt-6 space-y-3">
            {recommendation.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20">
                  <CheckIcon className="h-3 w-3 text-[var(--accent-dark)]" />
                </span>
                <span className="text-[var(--primary)]/80 leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>

          {/* Projection */}
          <div className="mt-6 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)]">
              What to expect
            </p>
            <p className="mt-1 text-[var(--primary)]/80 leading-relaxed">
              {recommendation.projection}
            </p>
          </div>
        </div>

        {/* Stack cycle selector (stack recommendations only) */}
        {isStack && (
          <section className="mt-10">
            <h3 className="text-xl font-bold text-[var(--primary)]">
              Choose your cycle length
            </h3>
            <p className="mt-1 text-sm text-[var(--primary)]/60">
              We've pre-selected the best fit for your timeline. Every stack
              includes 1-on-1 coaching, custom dosing and free shipping.
            </p>
            <div className="mt-5">
              <StackOffer
                recommendedTier={recommendation.recommendedTier}
                onCheckout={checkoutStack}
              />
            </div>
          </section>
        )}

        {/* Add-ons */}
        {recommendation.addOns.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-bold text-[var(--primary)]">
              {isStack ? "Complete your protocol" : "Frequently added together"}
            </h3>
            <p className="mt-1 text-sm text-[var(--primary)]/60">
              {isStack
                ? "Add-on vials ship alongside your stack and add to your cart separately."
                : "Clients chasing your goals almost always add these."}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {recommendation.addOns.map((a) => (
                <AddOnCard
                  key={a.product.slug}
                  name={a.product.name}
                  dose={a.product.dose}
                  price={a.product.price}
                  image={a.product.image}
                  reason={a.reason}
                  slug={a.product.slug}
                  priceId={a.product.priceId}
                  priceCents={a.product.priceCents}
                />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <section className="mt-14">
            <h3 className="text-xl font-bold text-[var(--primary)]">
              People with your goal, real results
            </h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="flex flex-col rounded-3xl border border-[var(--border)] bg-white p-5"
                >
                  <Stars />
                  <blockquote className="mt-3 flex-1 text-sm text-[var(--primary)]/80 leading-relaxed">
                    “{t.quote}”
                  </blockquote>
                  {t.stats && t.stats.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.stats.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-[var(--accent)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--accent-dark)]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <figcaption className="mt-4 flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                      {t.initial}
                    </span>
                    <span className="text-sm font-semibold text-[var(--primary)]">
                      {t.name}
                      {t.timeframe ? (
                        <span className="font-normal text-[var(--primary)]/50">
                          {" · "}
                          {t.timeframe}
                        </span>
                      ) : null}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Trust / reassurance */}
        <section className="mt-14 rounded-3xl bg-[var(--primary)] p-6 sm:p-8 text-white">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "1-on-1 coaching included",
                body: "A real coach guides your nutrition, training and protocol — included with every order.",
              },
              {
                title: "Custom dosing, tailored to you",
                body: "No guessing. Your dosing is dialed to your stats and goals from day one.",
              },
              {
                title: "Lab-tested purity",
                body: "Every batch is documented and third-party tested. Full purity reports on request.",
              },
            ].map((c) => (
              <div key={c.title}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <CheckIcon className="h-4 w-4 text-[var(--accent)]" />
                </div>
                <p className="mt-3 font-bold">{c.title}</p>
                <p className="mt-1 text-sm text-white/70 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Restart */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onRestart}
            className="text-sm font-semibold text-[var(--primary)]/60 underline underline-offset-4 hover:text-[var(--primary)]"
          >
            Retake the quiz
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-[var(--primary)]/40 leading-relaxed">
          {siteCopy.footer.productDisclaimer}
        </p>
      </main>
    </div>
  );
}
