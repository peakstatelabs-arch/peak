import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { formatUsd } from "@/app/lib/money";
import { POWERCUT_SALE, POWERCUT_VALUE_CENTS } from "@/app/lib/sale";
import {
  STACKS,
  STACK_ORDER,
  stackFromPrice,
  type StackSlug,
} from "@/app/lib/bfStacks";

/** "Explore the other stacks" grid + POWER CUT™ + build-your-own. */
export function OtherStacks({
  current,
  title = "Explore Every Black Friday Stack",
}: {
  current?: StackSlug;
  title?: string;
}) {
  const pcPct = Math.round(
    ((POWERCUT_VALUE_CENTS.single - POWERCUT_SALE.single.saleCents) /
      POWERCUT_VALUE_CENTS.single) *
      100,
  );
  const cards = [
    {
      key: "powercut",
      name: "POWER CUT™",
      tagline: "Burn fat and build lean muscle — the full recomposition.",
      href: "/?pc=1#pricing",
      image: "/power-cut-stack.webp",
      from: POWERCUT_SALE.single.saleCents,
      pct: pcPct,
    },
    ...STACK_ORDER.filter((s) => s !== current).map((s) => {
      const st = STACKS[s];
      const p = stackFromPrice(st);
      return {
        key: s,
        name: st.name,
        tagline: st.tagline,
        href: st.path,
        image: st.sizes[0].image,
        from: p.price,
        pct: p.pct,
      };
    }),
  ];

  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent-dark)]">
            Mix &amp; match — every vial counts toward your discount
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <a
              key={c.key}
              href={c.href}
              className="group flex items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--muted)] p-4 transition-colors hover:border-[var(--accent)]"
            >
              <img
                src={c.image}
                alt=""
                aria-hidden="true"
                className="h-20 w-20 flex-shrink-0 rounded-2xl bg-white object-contain"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="text-lg font-extrabold text-[var(--primary)]">{c.name}</p>
                <p className="text-sm text-[var(--primary)]/70 leading-snug">{c.tagline}</p>
                <p className="mt-1.5 text-sm font-bold text-[var(--primary)]">
                  From {formatUsd(c.from)}{" "}
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                    {c.pct}% off
                  </span>
                </p>
              </div>
            </a>
          ))}
          <a
            href="/buildyourstack"
            className="flex items-center justify-center rounded-3xl border-2 border-dashed border-[var(--accent)] p-6 text-center transition-colors hover:bg-[var(--accent)]/10"
          >
            <span>
              <span className="block text-lg font-extrabold text-[var(--primary)]">
                Build your own stack
              </span>
              <span className="mt-1 block text-sm text-[var(--primary)]/70">
                Pick any vials. 2 = 30% off · 4 = 35% · 6+ = 40%
              </span>
            </span>
          </a>
        </div>
      </Container>
    </Section>
  );
}
