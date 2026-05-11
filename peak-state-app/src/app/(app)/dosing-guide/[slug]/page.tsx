import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PEPTIDES, findPeptide } from "@/lib/peptides";
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
      <PageHeader
        title={p.name}
        description={p.category}
      />
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
    </>
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
