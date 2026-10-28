// Shared sections for the /getreta-style product pages (/getcjc,
// /getrecovery). Markup and styling mirror app/getreta/page.tsx so the pages
// read as one family.

import type { ReactNode } from "react";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";
import { reviews, type Review } from "@/content/reviews";
import { MemberBanner } from "@/app/components/member/MemberBanner";
import { HeaderCrossLink } from "@/app/components/HeaderCrossLink";
import { ViewCartButton } from "@/app/singles/cart/ViewCartButton";

/** Look up testimonials by id, showing each reviewer name only once. */
export function pickReviews(ids: string[]): Review[] {
  return ids
    .map((id) => reviews.find((r) => r.id === id))
    .filter((r): r is Review => Boolean(r))
    .filter((r, i, arr) => arr.findIndex((x) => x.name === r.name) === i);
}

export function StockPill() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-bold text-emerald-700">
        In Stock • Ships within 24 hrs
      </span>
    </div>
  );
}

function TrustItem({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]/75">
      <svg
        className="w-4 h-4 flex-shrink-0 text-[var(--accent-dark)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {children}
    </span>
  );
}

export function TrustBar() {
  return (
    <div className="border-y border-[var(--border)] bg-[var(--muted)]">
      <Container className="py-5">
        <div className="mx-auto grid max-w-sm grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8">
          <TrustItem>Third-party COA</TrustItem>
          <TrustItem>99%+ purity</TrustItem>
          <TrustItem>Ships within 24 hrs</TrustItem>
          <TrustItem>1-on-1 coaching</TrustItem>
        </div>
      </Container>
    </div>
  );
}

export function ProductHeader({
  page,
  ctaLabel,
}: {
  /** Analytics name for this page, e.g. "getcjc". */
  page: string;
  ctaLabel: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
      <Container className="flex h-16 items-center justify-between">
        {/* Not a link: keeps the visitor on this page instead of the homepage */}
        <div className="flex items-center gap-2 font-bold text-lg">
          <img
            src="/logo.png"
            alt="Peak State Labs Logo"
            className="h-7 w-7 rounded-lg"
          />
          <span className="hidden sm:inline">{siteCopy.brand.name}</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <HeaderCrossLink
            href="/"
            event="powercut_entry_click"
            source={`${page}_header`}
          >
            Shop POWER CUT&trade;
          </HeaderCrossLink>
          <a
            href="#buy"
            className="hidden sm:inline-flex btn-primary h-10 items-center justify-center rounded-xl px-5 text-sm font-semibold"
          >
            {ctaLabel}
          </a>
          <ViewCartButton variant="header" />
        </div>
      </Container>

      {/* Members save 10% — non-members only; pinned under the logo bar */}
      <MemberBanner page={page} />
    </header>
  );
}

export function HeroProof({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-start">
      <div className="flex items-center gap-1.5">
        <div className="flex text-[var(--accent-dark)]">
          {"★★★★★".split("").map((s, i) => (
            <span key={i} className="text-lg">
              {s}
            </span>
          ))}
        </div>
        <span className="text-sm font-semibold text-[var(--primary)]/70">
          70+ verified check-ins
        </span>
      </div>
      <span className="text-sm font-semibold text-[var(--primary)]/70">
        {children}
      </span>
    </div>
  );
}

export function TimelineSection({
  title,
  note,
  rows,
}: {
  title: string;
  note: string;
  rows: { week: string; body: string }[];
}) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
            {title}
          </h2>
          <p className="mt-4 text-center text-[var(--primary)]/70">{note}</p>
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[var(--muted)] border border-[var(--border)]">
            <ul className="space-y-5">
              {rows.map((row) => (
                <li key={row.week} className="flex gap-4">
                  <span className="flex-shrink-0 mt-1.5 w-2.5 h-2.5 rounded-full bg-[var(--accent)]" />
                  <div>
                    <p className="font-bold text-[var(--primary)]">{row.week}</p>
                    <p className="mt-1 text-[var(--primary)]/80 leading-relaxed">
                      {row.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export type CoaResult = {
  product: string;
  dose: string;
  /** HPLC purity as printed on the current lot's COA, e.g. "99.87%". */
  purity: string;
};

/**
 * Compact lab-proof section: one PASS row per compound, then a button to the
 * full reports (new tab, so the shopper keeps their place on the page).
 */
export function CoaSection({
  intro,
  results,
  href,
  buttonLabel = "View All Lab Reports",
}: {
  intro: string;
  results: CoaResult[];
  href: string;
  buttonLabel?: string;
}) {
  return (
    <Section className="bg-[var(--muted)]">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
              Tested, not trusted
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Every Batch, Third-Party Verified
            </h2>
            <p className="mt-4 text-lg text-[var(--primary)]/70">{intro}</p>
          </div>

          <ul className="mx-auto mt-8 max-w-xl space-y-3">
            {results.map((r) => (
              <li
                key={r.product}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3.5 shadow-sm"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-[var(--primary)]">
                    {r.product}
                  </span>
                  <span className="block text-xs font-medium text-[var(--primary)]/55">
                    {r.dose} · {r.purity} purity (HPLC)
                  </span>
                </span>
                <span className="flex-shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-extrabold tracking-wider text-emerald-700">
                  PASS
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 text-center">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-8 text-base font-semibold"
            >
              {buttonLabel} <span aria-hidden="true">→</span>
            </a>
            <p className="mt-3 text-xs text-[var(--primary)]/55">
              Full certificates of analysis from ILS Laboratories · opens in a
              new tab
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function TestimonialsSection({
  intro,
  testimonials,
}: {
  intro: ReactNode;
  testimonials: Review[];
}) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Real People, Real Check-Ins
            </h2>
            <p className="mt-4 text-lg text-[var(--primary)]/70 max-w-2xl mx-auto">
              {intro}
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)] font-bold">
                    {t.initial}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--primary)]">{t.name}</p>
                    {t.timeframe ? (
                      <p className="text-xs font-medium text-[var(--primary)]/55">
                        {t.timeframe}
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm text-[var(--primary)]/80 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {t.stats && t.stats.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.stats.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[var(--accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--accent-dark)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="/reviews"
              className="text-sm font-semibold text-[var(--primary)]/70 underline hover:text-[var(--accent-dark)]"
            >
              Read All Client Reviews →
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function FaqSection({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
            Questions, Answered
          </h2>
          <div className="mt-8 space-y-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-[var(--primary)]">
                  {f.q}
                  <span className="faq-icon flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent-dark)] transition-transform">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-[var(--primary)]/80 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function FinalCta({
  title,
  body,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaLabel: string;
}) {
  return (
    <Section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent)]">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
            <span>IN STOCK • SHIPS IN 24 HRS</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="mt-6 text-lg text-white/80">{body}</p>
          <div className="mt-8">
            <a
              href="#buy"
              className="btn-accent inline-flex h-16 items-center justify-center rounded-2xl px-12 text-xl font-extrabold uppercase tracking-wide shadow-2xl ring-4 ring-[var(--accent)]/30 animate-pulse-slow"
            >
              {ctaLabel}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-white/70">
            <span>✓ Third-party COA</span>
            <span>✓ 99%+ purity</span>
            <span>✓ Discreet shipping</span>
            <span>✓ Satisfaction guarantee</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function ProductFooter({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <footer className="bg-[var(--primary)] text-white">
      <Container className="py-12">
        <div className="text-center pb-8 border-b border-white/10">
          <p className="text-sm text-white/60">
            {siteCopy.footer.productDisclaimer}
          </p>
        </div>
        <div className="py-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <img
                src="/logo.png"
                alt="Peak State Labs Logo"
                className="h-7 w-7 rounded-lg"
              />
              <span>{siteCopy.brand.name}</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
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
  );
}
