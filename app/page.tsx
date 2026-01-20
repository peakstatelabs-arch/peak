import { EmailCapture } from "@/app/components/EmailCapture";
import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { cn } from "@/app/lib/cn";
import { siteCopy } from "@/content/siteCopy";

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              P
            </span>
            <span>{siteCopy.brand.name}</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-black/70 sm:flex">
            {siteCopy.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href={siteCopy.brand.primaryCtaHref}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90"
          >
            {siteCopy.brand.primaryCtaLabel}
          </a>
        </Container>
      </header>

      <main>
        <Section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-28 left-1/2 h-72 w-[56rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-black/5 via-black/10 to-black/5 blur-3xl" />
            <div className="absolute -bottom-40 right-[-20%] h-80 w-80 rounded-full bg-black/5 blur-3xl" />
          </div>

          <Container className="relative">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-black/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-black/60" />
                  <span>{siteCopy.hero.eyebrow}</span>
                </div>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  {siteCopy.hero.headline}
                </h1>
                <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-black/70">
                  {siteCopy.hero.subheadline}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={siteCopy.brand.primaryCtaHref}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-6 text-base font-semibold text-white shadow-sm transition hover:bg-black/90"
                  >
                    {siteCopy.brand.primaryCtaLabel}
                  </a>
                  <a
                    href={siteCopy.brand.secondaryCtaHref}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 bg-white px-6 text-base font-semibold text-black shadow-sm transition hover:border-black/20 hover:bg-black/5"
                  >
                    {siteCopy.brand.secondaryCtaLabel}
                  </a>
                </div>
                <ul className="mt-8 grid gap-3 text-sm text-black/70 sm:grid-cols-2">
                  {siteCopy.hero.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-black">
                        ✓
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-black/10 bg-gradient-to-b from-black/[0.02] to-black/[0.06] p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-black">
                      What you’ll see at launch
                    </p>
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                      v1
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {[
                      {
                        title: "Clean product pages",
                        description:
                          "Specs, documentation, and key details—organized for fast scanning.",
                      },
                      {
                        title: "Clear standards",
                        description:
                          "Packaging, handling, and consistency policies you can read in one place.",
                      },
                      {
                        title: "Fast updates",
                        description:
                          "We ship improvements frequently; the site will evolve quickly.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-black/10 bg-white p-4"
                      >
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-sm text-black/70">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-black/60">
                    Replace this card with product imagery, COA previews, or
                    category tiles.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section id="standards" className="border-t border-black/5 bg-white">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {siteCopy.features.headline}
              </h2>
              <p className="mt-4 text-lg leading-8 text-black/70">
                {siteCopy.features.subheadline}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {siteCopy.features.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                >
                  <p className="text-base font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-black/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-black/10 bg-black p-8 text-white shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">Make the copy yours.</p>
                  <p className="mt-1 text-sm text-white/70">
                    Update all headlines, sections, and disclaimers in one file:{" "}
                    <span className="font-mono text-white/90">
                      content/siteCopy.ts
                    </span>
                  </p>
                </div>
                <a
                  href={siteCopy.brand.primaryCtaHref}
                  className={cn(
                    "inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black",
                    "transition hover:bg-white/90"
                  )}
                >
                  {siteCopy.brand.primaryCtaLabel}
                </a>
              </div>
            </div>
          </Container>
        </Section>

        <Section className="border-t border-black/5 bg-white">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {siteCopy.socialProof.headline}
                </h2>
                <p className="mt-3 text-lg leading-8 text-black/70">
                  {siteCopy.socialProof.subheadline}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {siteCopy.socialProof.testimonials.map((t, idx) => (
                <figure
                  key={`${t.name}-${idx}`}
                  className="rounded-2xl border border-black/10 bg-white p-7 shadow-sm"
                >
                  <blockquote className="text-base leading-8 text-black">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-black/70">
                    <span className="font-semibold text-black">{t.name}</span>{" "}
                    <span className="text-black/40">·</span> {t.title}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </Section>

        <Section id="faq" className="border-t border-black/5 bg-white">
          <Container>
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {siteCopy.faq.headline}
              </h2>
            </div>

            <div className="mt-8 grid gap-3">
              {siteCopy.faq.items.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <span className="text-base font-semibold">{item.q}</span>
                    <span className="text-black/50 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-black/70">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </Container>
        </Section>

        <Section
          id="waitlist"
          className="border-t border-black/5 bg-gradient-to-b from-white to-black/[0.03]"
        >
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {siteCopy.cta.headline}
                </h2>
                <p className="mt-4 text-lg leading-8 text-black/70">
                  {siteCopy.cta.subheadline}
                </p>
                <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 text-sm text-black/70">
                  <p className="font-semibold text-black">Tip</p>
                  <p className="mt-2">
                    Replace <span className="font-mono">support@peak.example</span>{" "}
                    in <span className="font-mono">content/siteCopy.ts</span>{" "}
                    with your real inbox.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                  <EmailCapture
                    emailTo={siteCopy.cta.emailTo}
                    subject={siteCopy.cta.emailSubject}
                    bodyHint={siteCopy.cta.emailBodyHint}
                  />
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-black/10 bg-white">
        <Container className="py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-base font-semibold">{siteCopy.brand.name}</p>
              <p className="mt-2 text-sm text-black/70">
                {siteCopy.brand.tagline}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {siteCopy.footer.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-black/70 transition hover:text-black"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-black/10 bg-black/[0.03] p-6">
            <p className="text-sm font-semibold text-black">
              {siteCopy.footer.disclaimerTitle}
            </p>
            <div className="mt-3 grid gap-2 text-sm text-black/70">
              {siteCopy.footer.disclaimerLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <p className="mt-10 text-xs text-black/60">
            © {new Date().getFullYear()} {siteCopy.footer.copyrightName}. All
            rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
}
