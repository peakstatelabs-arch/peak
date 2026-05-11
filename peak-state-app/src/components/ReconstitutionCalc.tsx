"use client";

import { useMemo, useState } from "react";

export function ReconstitutionCalc({ defaultVialMg = 10 }: { defaultVialMg?: number }) {
  const [vialMg, setVialMg] = useState(defaultVialMg);
  const [bacWaterMl, setBacWaterMl] = useState(2);
  const [doseMcg, setDoseMcg] = useState(250);
  const [syringeUnits, setSyringeUnits] = useState(100);

  const result = useMemo(() => {
    if (!vialMg || !bacWaterMl || !doseMcg) return null;
    const mcgPerMl = (vialMg * 1000) / bacWaterMl;
    const mlForDose = doseMcg / mcgPerMl;
    const unitsForDose = mlForDose * syringeUnits;
    return {
      mcgPerMl: Math.round(mcgPerMl),
      mlForDose: +mlForDose.toFixed(3),
      unitsForDose: +unitsForDose.toFixed(1),
    };
  }, [vialMg, bacWaterMl, doseMcg, syringeUnits]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Vial size (mg)" value={vialMg} onChange={setVialMg} step={0.5} />
        <Field label="BAC water (mL)" value={bacWaterMl} onChange={setBacWaterMl} step={0.1} />
        <Field label="Target dose (mcg)" value={doseMcg} onChange={setDoseMcg} step={10} />
        <Field label="Syringe (units/mL)" value={syringeUnits} onChange={setSyringeUnits} step={10} />
      </div>
      {result && (
        <div className="rounded-lg bg-bg-elev border border-border p-4 space-y-1.5 text-sm">
          <Row label="Concentration" value={`${result.mcgPerMl} mcg/mL`} />
          <Row label="Volume per dose" value={`${result.mlForDose} mL`} />
          <Row label="Syringe units" value={`${result.unitsForDose} units`} highlight />
        </div>
      )}
      <p className="text-xs text-fg-subtle">
        Research-purposes calculation only. Verify with your peptide lab's reconstitution chart.
      </p>
    </div>
  );
}

function Field({ label, value, onChange, step }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        className="input"
        value={value}
        step={step}
        min={0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg-muted">{label}</span>
      <span className={highlight ? "font-display text-lg text-accent font-semibold" : "font-medium"}>{value}</span>
    </div>
  );
}
