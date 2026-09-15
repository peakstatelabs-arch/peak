export type PeptideProtocol = {
  name: string;
  dose: string;
  subtitle?: string;
  focusLabel?: string;
  focus?: string[];
};

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
  /** Optional reconstitution defaults to pre-fill the calculator on the detail page. */
  reconBacMl?: number;
  reconDoseMg?: number;
  extended?: {
    intro?: string;
    question?: string;
    protocols?: PeptideProtocol[];
    rationale?: string[];
  };
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
    doseRange: "2–3 mg daily (lower when stacked with BPC-157 + TB-500).",
    frequency: "Daily, often evening.",
    timing: "Evening, before bed.",
    description:
      "Copper-binding tripeptide studied for skin repair, hair follicle support, and tissue remodeling.",
    cautions: "Avoid combining with vitamin C at injection time. Not for human consumption.",
    extended: {
      question: "Should you use GHK-Cu by itself, or stack it with BPC-157 + TB-500?",
      intro:
        "Both approaches work. The right one depends on what you're chasing. Pick standalone if regeneration and longevity are the focus. Pick the stack if recovery is the priority.",
      protocols: [
        {
          name: "Option 1 — GHK-Cu standalone",
          dose: "3 mg daily",
          subtitle: "GHK-Cu at the center of the protocol.",
          focusLabel: "Best for",
          focus: [
            "Healthy aging",
            "Skin quality",
            "Hair quality",
            "Regeneration",
            "Collagen support",
            "Long-term wellness",
          ],
        },
        {
          name: "Option 2 — GHK-Cu + BPC-157 + TB-500",
          dose: "2 mg daily",
          subtitle: "A recovery ecosystem. Each peptide carries a different load.",
          focusLabel: "GHK-Cu contributes",
          focus: [
            "Regeneration",
            "Collagen + skin quality",
            "Healthy aging",
            "Tissue remodeling",
          ],
        },
      ],
      rationale: [
        "When you pair GHK-Cu with BPC-157 + TB-500, BPC + TB cover recovery, mobility, training recovery, and soft-tissue support.",
        "Because the regenerative workload is shared across multiple complementary peptides, GHK-Cu is reduced from 3 mg to 2 mg daily in the combo.",
        "Think of it like a team of specialists rather than five quarterbacks — GHK-Cu handles regenerative signaling; BPC + TB handle recovery pathways.",
      ],
    },
  },
  {
    slug: "nad-plus",
    name: "NAD+",
    vialMg: 500,
    category: "NAD+ coenzyme — cellular energy & longevity",
    doseRange: "Reference amount: 25 mg per use (20 doses per 500 mg vial).",
    frequency: "3–5× per week — choose the days that fit your routine.",
    timing:
      "No clinically established best time of day. Pick a schedule you can keep consistent.",
    description:
      "A naturally occurring coenzyme (nicotinamide adenine dinucleotide) central to cellular energy metabolism, mitochondrial function, DNA repair, and sirtuin activity — a major focus of longevity and healthy-aging research. Technically a dinucleotide coenzyme rather than a peptide.",
    cautions:
      "No FDA-approved dose, frequency, or duration exists for wellness or longevity, and human evidence for injectable NAD+ remains limited. Educational reference only — not intended to diagnose, treat, cure, or prevent any disease. Not for human consumption. Research use only.",
    reconBacMl: 5,
    reconDoseMg: 25,
  },
  {
    slug: "kpv",
    name: "KPV",
    vialMg: 10,
    category: "Anti-inflammatory tripeptide — gut, immune & skin",
    doseRange: "Reference amount: 0.30 mg per use (≈33 daily doses per 10 mg vial).",
    frequency: "Once daily, 7 days per week.",
    timing: "Morning or evening — consistency matters more than the exact time.",
    description:
      "A tripeptide (Lysine–Proline–Valine) derived from the α-MSH hormone, studied in preclinical models for inflammatory regulation (NF-κB / MAPK signaling), gut and intestinal health, immune balance, and skin/epithelial support.",
    cautions:
      "Research remains largely preclinical; human efficacy, optimal dosing, and long-term safety have not been established in controlled trials. Not an FDA-approved drug. Educational reference only — not medical advice. Research use only.",
    reconBacMl: 2,
    reconDoseMg: 0.3,
  },
];

export function findPeptide(slug: string) {
  return PEPTIDES.find((p) => p.slug === slug);
}
