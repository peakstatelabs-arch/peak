import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PEPTIDES } from "@/lib/peptides";
import { requireModule } from "@/lib/modules-server";

export const metadata = { title: "Dosing Guide — Peak State Labs" };
export const dynamic = "force-dynamic";

export default async function DosingGuide() {
  await requireModule("dosing-guide");
  return (
    <>
      <PageHeader
        title="Dosing Guide"
        description="Reference library. For research and educational purposes only — not medical advice."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {PEPTIDES.map((p) => (
          <Link key={p.slug} href={`/dosing-guide/${p.slug}`} className="card hover:border-accent/40 transition group">
            <div className="flex items-start justify-between">
              <div>
                <span className="chip-accent mb-2">{p.vialMg} mg vial</span>
                <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                <p className="text-xs text-fg-subtle mt-0.5">{p.category}</p>
              </div>
              <span className="text-fg-subtle group-hover:text-accent transition">→</span>
            </div>
            <p className="mt-3 text-sm text-fg-muted line-clamp-2">{p.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <Field label="Dose" value={p.doseRange} />
              <Field label="Frequency" value={p.frequency} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-fg-subtle uppercase tracking-wide text-[10px]">{label}</div>
      <div className="text-fg mt-0.5 line-clamp-2">{value}</div>
    </div>
  );
}
