export type PeptideRef = {
  slug: string;
  name: string;
  vialMg: number;
  category: string;
  doseRange: string;
  frequency: string;
  timing: string;
  description: string;
  cautions: string;
};

export const PEPTIDES: PeptideRef[] = [
  {
    slug: "retatrutide",
    name: "Retatrutide",
    vialMg: 20,
    category: "GLP-1 / GIP / Glucagon triple agonist",
    doseRange: "Titrates from 0.5 mg → 6.0 mg weekly.",
    frequency: "Once weekly subcutaneous.",
    timing: "Monday morning. Consistency week-to-week matters more than time of day.",
    description:
      "Investigational triple-receptor agonist studied for body composition and metabolic effects. Titration is critical to manage GI tolerance.",
    cautions:
      "Common GI effects (nausea, reflux). Not for human consumption. Research use only.",
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin",
    vialMg: 10,
    category: "GHRH analog + GHRP blend",
    doseRange: "Typical: 0.25–0.75 mg per administration.",
    frequency: "Monday–Friday, evening, fasted.",
    timing: "Empty stomach: 90 min after last meal AND before next meal.",
    description:
      "Pairs a GHRH analog (CJC-1295) with a selective GHRP (Ipamorelin) studied for pulsatile growth hormone release without prolactin/cortisol spikes.",
    cautions: "Insulin sensitivity changes possible. Not for human consumption.",
  },
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500",
    vialMg: 20,
    category: "Recovery / repair peptide blend",
    doseRange: "1.3–2.0 mg per injection.",
    frequency: "2–3× weekly evening, paired with CJC blend.",
    timing: "Evening, alongside CJC dose.",
    description:
      "Synergistic blend studied for soft-tissue repair, connective tissue support, and recovery.",
    cautions: "Long-term human safety data limited. Research use only.",
  },
  {
    slug: "ghk-cu",
    name: "GHK-Cu",
    vialMg: 50,
    category: "Copper peptide — skin / hair / longevity",
    doseRange: "1–3 mg per administration.",
    frequency: "Daily or 3–5× weekly, often evening.",
    timing: "Evening, before bed.",
    description:
      "Copper-binding tripeptide studied for skin repair, hair follicle support, and tissue remodeling.",
    cautions: "Avoid combining with vitamin C at injection time. Not for human consumption.",
  },
];

export function findPeptide(slug: string) {
  return PEPTIDES.find((p) => p.slug === slug);
}
