"use client";

import { useMemo } from "react";
import { siteCopy } from "@/content/siteCopy";
import { reviews, type Review } from "@/content/reviews";
import { AddToCartButton } from "@/app/singles/cart/AddToCartButton";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";
import { PricingCard } from "@/app/components/PricingCard";
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

/* ────────────────────────── What's in the stack ────────────────────────── */
//
// Bug fix: a stack recommendation must show what's actually in the box. Pulls
// the vial breakdown from siteCopy.contents and the value framing from
// siteCopy.comparison — the same source the homepage uses — so it never drifts.

function StackContents() {
  const vials = siteCopy.contents.items;
  const pc = siteCopy.comparison.powercut;
  const diyTotal = siteCopy.comparison.diy.total;
  const included = [
    "Ongoing 1-on-1 coaching (nutrition & training)",
    "Custom dosing guidance, tailored to you",
    "Private community & support",
    "Research Cycle Calculator access",
    "Batch documentation (purity tests)",
    "Free shipping",
  ];

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-[var(--primary)]">
        What&apos;s inside your POWER CUT™ stack
      </h3>
      <p className="mt-1 text-sm text-[var(--primary)]/60">
        Every 10-week cycle includes all three research peptides — plus the
        coaching and tools to run them right.
      </p>

      {/* Vials */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {vials.map((v) => (
          <div
            key={v.name}
            className="flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-white p-4"
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
              <img src={v.image} alt={v.name} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[var(--primary)] leading-tight">{v.name}</p>
              <p className="text-sm text-[var(--primary)]/60">{v.amount}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Also included + value */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-[var(--border)] bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)]">
            Also included with every cycle
          </p>
          <ul className="mt-3 space-y-2.5">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20">
                  <CheckIcon className="h-3 w-3 text-[var(--accent-dark)]" />
                </span>
                <span className="text-sm text-[var(--primary)]/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-[var(--accent)]/30 bg-[var(--accent)]/[0.06] p-6">
          <p className="text-sm font-bold uppercase tracking-wide text-[var(--accent-dark)]">
            The math
          </p>
          <div className="mt-3 space-y-1.5 text-[var(--primary)]/80">
            <div className="flex items-center justify-between">
              <span>Bought separately</span>
              <span className="font-semibold line-through text-[var(--primary)]/50">
                {diyTotal}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Your POWER CUT™ price</span>
              <span className="text-xl font-extrabold text-[var(--primary)]">
                {pc.price}
              </span>
            </div>
          </div>
          <p className="mt-3 inline-flex w-fit items-center rounded-full bg-[var(--accent)] px-3 py-1 text-sm font-extrabold text-[var(--primary)]">
            You save {pc.savings}
          </p>
          <p className="mt-4 text-sm text-[var(--primary)]/70 leading-relaxed">
            Bundled and sequenced so the three peptides compound instead of
            competing — the whole reason the stack outperforms buying vials à la
            carte.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── Stack cycle selector ──────────────────────── */

function StackOffer({
  recommendedTier,
  eventProps,
}: {
  recommendedTier: StackTierId;
  eventProps: Record<string, string | number | boolean | null | undefined>;
}) {
  const tiers = siteCopy.pricing.tiers;
  // Recommended tier first so it reads as the default choice.
  const ordered = [...tiers].sort((a, b) =>
    a.id === recommendedTier ? -1 : b.id === recommendedTier ? 1 : 0,
  );

  return (
    <div className="grid gap-6 sm:grid-cols-3 pt-4">
      {ordered.map((tier) => {
        const recommended = tier.id === recommendedTier;
        return (
          <PricingCard
            key={tier.id}
            id={tier.id}
            name={tier.name}
            subtitle={tier.subtitle}
            description={tier.description}
            features={tier.features}
            estimatedValue={tier.estimatedValue}
            price={tier.price}
            perStackPrice={"perStackPrice" in tier ? tier.perStackPrice : undefined}
            installment={tier.installment}
            savings={tier.savings}
            ctaLabel={tier.ctaLabel}
            ctaSubtext={tier.ctaSubtext}
            stripeUrl={tier.stripeUrl}
            preorderNote={tier.preorderNote}
            refundNote={tier.refundNote}
            shipsBy={siteCopy.pricing.shipsBy || undefined}
            highlighted={recommended}
            badgeLabel={recommended ? "BEST FOR YOU" : null}
            ctaEventProperties={eventProps}
          />
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
  const arch = recommendation.archetype;

  // Extra context stamped onto the stack CTA's tracked event so quiz-sourced
  // POWER CUT checkouts are attributable in the existing funnels.
  const stackEventProps = {
    source: "quiz",
    quiz_archetype: arch.key,
    primary_goal: answers.primaryGoal,
  };

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
            <span>YOUR DIAGNOSTIC RESULT</span>
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {firstName ? `${firstName}, we read every answer` : "We read every answer"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[var(--primary)]/70">
            Here&apos;s what&apos;s really going on with your{" "}
            <span className="font-semibold text-[var(--primary)]">
              {gm.emoji} {gm.label.toLowerCase()}
            </span>{" "}
            — and the exact protocol built to fix it.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 pb-24">
        {/* ── Diagnostic reveal: comfort → archetype → bad news → mechanism ── */}
        <div className="-mt-8 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-xl">
          <p className="text-[var(--primary)]/75 leading-relaxed">{arch.comfort}</p>

          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-[var(--primary)]/50">
              Your profile
            </p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-[var(--primary)]">
              {firstName ? `${firstName}, you're ` : "You're "}
              {arch.label}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-lg font-bold text-[var(--primary)]">{arch.badNews}</p>
            <p className="mt-3 text-[var(--primary)]/80 leading-relaxed">
              {arch.mechanism}
            </p>
          </div>
        </div>

        {/* ── The flip: good news → the recommendation ── */}
        <div className="mt-10 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)]/15 px-3 py-1.5 text-sm font-extrabold uppercase tracking-wide text-[var(--accent-dark)]">
            Here&apos;s the good news
          </span>
          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>
        <p className="mt-4 text-lg text-[var(--primary)]/80 leading-relaxed">
          {arch.goodNews}
        </p>

        {/* Primary recommendation card */}
        <div className="mt-6 rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-xl">
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

                {/* Inclusions strip — so single results don't feel bare. */}
                <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[var(--primary)]/50">
                    Every order includes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                    {[
                      "1-on-1 coaching",
                      "Custom dosing",
                      "Free shipping",
                    ].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]/80"
                      >
                        <CheckIcon className="h-3.5 w-3.5 text-[var(--accent-dark)]" />
                        {item}
                      </span>
                    ))}
                  </div>
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

        {/* What's in the stack (stack recommendations only) */}
        {isStack && <StackContents />}

        {/* Stack cycle selector (stack recommendations only) */}
        {isStack && (
          <section className="mt-12">
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
                eventProps={stackEventProps}
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
