import type { ProductSlug } from "@/app/lib/bfStacks";

// Latest COA results per compound (same figures as the product pages).
const LAB: Record<ProductSlug, { name: string; dose: string; purity: string; href: string }> = {
  retatrutide: { name: "Retatrutide", dose: "20mg", purity: "99.93% purity (HPLC)", href: "/purity-tests/reta" },
  "cjc-ipamorelin": { name: "CJC-1295/Ipamorelin Blend", dose: "10mg", purity: "99.12% purity (HPLC)", href: "/purity-tests/cjc-ipa" },
  "bpc-tb500": { name: "BPC-157/TB-500 Blend", dose: "20mg", purity: "99.68% purity (HPLC)", href: "/purity-tests/bpc-tb" },
  kpv: { name: "KPV", dose: "10mg", purity: "99.36% purity (HPLC)", href: "/purity-tests/kpv" },
  "ghk-cu": { name: "GHK-Cu", dose: "50mg", purity: "99.94% purity (HPLC)", href: "/purity-tests/ghkcu" },
  nad: { name: "NAD+", dose: "500mg", purity: "99.18% purity (HPLC)", href: "/purity-tests/nad" },
};

/** Green PASS badges for each compound, linking to its lab report. */
export function LabProof({
  slugs,
  intro = "Every lot is third-party tested for identity and purity before it ships.",
}: {
  slugs: ProductSlug[];
  intro?: string;
}) {
  return (
    <section className="bg-[#0f1626] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--accent)]">
          Documentation &amp; purity tests
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Your Safety Is Our #1 Priority
        </h2>
        <p className="mt-4 text-white/70">{intro}</p>
      </div>
      <ul className="mx-auto mt-8 max-w-xl space-y-3">
        {slugs.map((slug) => {
          const r = LAB[slug];
          return (
            <li key={slug}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 transition-colors hover:border-[var(--accent)]"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-white">{r.name}</span>
                  <span className="block text-xs font-medium text-white/55">
                    {r.dose} · {r.purity} · view report →
                  </span>
                </span>
                <span className="flex-shrink-0 rounded-full bg-emerald-400/20 px-2.5 py-1 text-xs font-extrabold tracking-wider text-emerald-300">
                  PASS
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
