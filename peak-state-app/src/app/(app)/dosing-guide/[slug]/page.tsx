import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PEPTIDES, findPeptide, type PeptideProtocol } from "@/lib/peptides";
import { ReconstitutionCalc } from "@/components/ReconstitutionCalc";

export function generateStaticParams() {
  return PEPTIDES.map((p) => ({ slug: p.slug }));
}

export default async function PeptideDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = findPeptide(slug);
  if (!p) notFound();

  return (
    <>
      <Link href="/dosing-guide" className="text-sm text-fg-muted hover:text-fg">← Dosing Guide</Link>
      <PageHeader title={p.name} description={p.category} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-4">
          <span className="chip-accent">{p.vialMg} mg vial</span>
          <p className="text-sm text-fg-muted leading-relaxed">{p.description}</p>
          <Row label="Dose range" value={p.doseRange} />
          <Row label="Frequency" value={p.frequency} />
          <Row label="Timing" value={p.timing} />
          <Row label="Cautions" value={p.cautions} accent="danger" />
        </div>
        <div className="card">
          <h3 className="font-semibold mb-3">Reconstitution calculator</h3>
          <ReconstitutionCalc defaultVialMg={p.vialMg} />
        </div>
      </div>

      {p.extended && (
        <section className="mt-6 space-y-4">
          {p.extended.question && (
            <div className="card">
              <h3 className="font-display text-lg font-semibold mb-2">{p.extended.question}</h3>
              {p.extended.intro && (
                <p className="text-sm text-fg-muted leading-relaxed">{p.extended.intro}</p>
              )}
            </div>
          )}

          {p.extended.protocols && p.extended.protocols.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {p.extended.protocols.map((proto, i) => (
                <ProtocolCard key={i} protocol={proto} />
              ))}
            </div>
          )}

          {p.extended.rationale && p.extended.rationale.length > 0 && (
            <div className="card">
              <h3 className="font-semibold mb-3">Why the stack changes the dose</h3>
              <ul className="space-y-2.5 text-sm text-fg-muted leading-relaxed">
                {p.extended.rationale.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-accent mt-1">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </>
  );
}

function ProtocolCard({ protocol }: { protocol: PeptideProtocol }) {
  return (
    <div className="card">
      <span className="chip-accent mb-3">{protocol.dose}</span>
      <h4 className="font-display text-base font-semibold mt-1">{protocol.name}</h4>
      {protocol.subtitle && (
        <p className="text-sm text-fg-muted mt-1.5 leading-relaxed">{protocol.subtitle}</p>
      )}
      {protocol.focus && protocol.focus.length > 0 && (
        <div className="mt-4 border-t border-border pt-3">
          {protocol.focusLabel && (
            <div className="text-xs uppercase tracking-wide text-fg-subtle mb-2">
              {protocol.focusLabel}
            </div>
          )}
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            {protocol.focus.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: "danger" }) {
  return (
    <div className="border-t border-border pt-3">
      <div className="text-xs uppercase tracking-wide text-fg-subtle">{label}</div>
      <div className={`mt-1 text-sm ${accent === "danger" ? "text-danger" : "text-fg"}`}>{value}</div>
    </div>
  );
}
