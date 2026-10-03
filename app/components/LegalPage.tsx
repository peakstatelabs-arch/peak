import Link from "next/link";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { siteCopy } from "@/content/siteCopy";

// Business details shown on the legal pages (/privacy, /sms-terms).
export const LEGAL_ENTITY = {
  name: "Peak State Labs LLC",
  address: "5108 Lott Ave, Austin, TX 78721",
  phone: "313-595-9239",
  phoneHref: "tel:3135959239",
  email: "drew@peakstate.shop",
};

/** "Privacy Policy · SMS Terms" row for page footers. */
export function LegalLinks() {
  return (
    <p className="text-xs text-white/60 text-center mt-6 space-x-3">
      <Link href="/privacy" className="underline hover:text-white">
        Privacy Policy
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/sms-terms" className="underline hover:text-white">
        SMS Terms
      </Link>
    </p>
  );
}

/** Support contact block shared by both legal pages. */
export function LegalContact() {
  return (
    <address className="not-italic">
      {LEGAL_ENTITY.name}
      <br />
      {LEGAL_ENTITY.address}
      <br />
      Phone: <a href={LEGAL_ENTITY.phoneHref}>{LEGAL_ENTITY.phone}</a>
      <br />
      Email: <a href={`mailto:${LEGAL_ENTITY.email}`}>{LEGAL_ENTITY.email}</a>
    </address>
  );
}

/** Same header, hero and footer as /policy, with a readable prose card. */
export function LegalPage({
  badge,
  title,
  intro,
  updated,
  children,
}: {
  badge: string;
  title: string;
  intro: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[var(--primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] glass">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <img
              src="/logo.png"
              alt="Peak State Labs Logo"
              className="h-7 w-7 rounded-lg"
            />
            <span className="hidden sm:inline">{siteCopy.brand.name}</span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--primary)]/70 hover:text-[var(--primary)] transition-colors"
          >
            Return Home
          </Link>
        </Container>
      </header>

      <main>
        <Section className="relative overflow-hidden gradient-hero !py-10 sm:!py-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
            <div className="absolute top-1/2 left-[-10%] h-80 w-80 rounded-full bg-[var(--accent)]/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-bold tracking-wider text-[var(--accent-dark)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>{badge}</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {title}
              </h1>

              <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70">
                {intro}
              </p>
            </div>
          </Container>
        </Section>

        <Section className="bg-white !pt-6 sm:!pt-10">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-3xl border border-[var(--border)] bg-white p-6 sm:p-10 shadow-sm space-y-4 text-[var(--primary)]/80 leading-relaxed [&_h2]:pt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--primary)] [&_h2:first-child]:pt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:font-semibold [&_a]:text-[var(--primary)] [&_a]:underline [&_a:hover]:no-underline">
                {children}
              </div>

              <p className="mt-6 text-center text-xs text-[var(--primary)]/50">
                Last updated {updated}.
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
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <img
                  src="/logo.png"
                  alt="Peak State Labs Logo"
                  className="h-7 w-7 rounded-lg"
                />
                <span>{siteCopy.brand.name}</span>
              </Link>
            </div>
          </div>
          <div className="pt-8">
            <p className="text-xs text-white/50 leading-relaxed max-w-4xl mx-auto text-center">
              {siteCopy.footer.disclaimer}
            </p>
            <LegalLinks />
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
