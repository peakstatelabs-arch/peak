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
    doseRange: "Research dosing typically titrates from 0.5 mg → 12 mg weekly.",
    frequency: "Once weekly subcutaneous (research models).",
    timing: "Any day; consistency week-to-week matters more than time of day.",
    description:
      "Investigational triple-receptor agonist studied for body composition and metabolic effects. Titration is critical to manage GI tolerance.",
    cautions:
      "Common GI effects (nausea, reflux). Not for human consumption. Research use only.",
  },
  {
    slug: "cjc-1295-ipamorelin",
    name: "CJC-1295 + Ipamorelin Blend",
    vialMg: 10,
    category: "GHRH analog + GHRP",
    doseRange: "Typical research blend: 100–300 mcg combined dose per administration.",
    frequency: "1–2× daily, 5 days on / 2 off in many research protocols.",
    timing: "Empty stomach — best before bed and/or fasted upon waking.",
    description:
      "Pairs a GHRH analog (CJC-1295) with a selective GHRP (Ipamorelin) studied for pulsatile growth hormone release without prolactin/cortisol spikes.",
    cautions: "Insulin sensitivity changes possible. Not for human consumption.",
  },
  {
    slug: "bpc-157-tb-500",
    name: "BPC-157 + TB-500 Blend",
    vialMg: 20,
    category: "Recovery / repair peptide blend",
    doseRange: "Research dosing typically 250–500 mcg per peptide, 1–2× daily.",
    frequency: "Daily for acute repair cycles (4–8 weeks).",
    timing: "Any time. Subcutaneous near injury site is common in research.",
    description:
      "Synergistic blend studied for soft-tissue repair, connective tissue support, and recovery.",
    cautions: "Long-term human safety data limited. Research use only.",
  },
];

export function findPeptide(slug: string) {
  return PEPTIDES.find((p) => p.slug === slug);
}
