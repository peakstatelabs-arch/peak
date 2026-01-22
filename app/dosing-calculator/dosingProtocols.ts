export interface WeeklyDose {
  weeks: string; // e.g., "1-3" or "4"
  dose: string; // e.g., "0.5 mg" or "250 mcg"
  total: string; // e.g., "1.5 mg"
  frequency?: string; // e.g., "Nightly, 5 on / 2 off"
}

export interface ProtocolTier {
  name: string;
  description: string;
  bodyFatRange: [number, number]; // [min, max] - use Infinity for no upper bound
  weightLossRange: [number, number]; // [min, max] in lbs
  focus: string;
  schedule: WeeklyDose[];
  totalDose: string;
  notes?: string[];
}

export interface PeptideProtocol {
  id: string;
  name: string;
  description: string;
  durations: {
    weeks: number;
    totalMaterial: string;
    tiers: ProtocolTier[];
  }[];
}

export const dosingProtocols: PeptideProtocol[] = [
  {
    id: "reta",
    name: "RETA (Retatrutide)",
    description: "Triple-agonist for aggressive fat loss and metabolic optimization",
    durations: [
      {
        weeks: 10,
        totalMaterial: "40 mg",
        tiers: [
          {
            name: "High-Resistance Reset",
            description: ">25% BF / >40lb Goal",
            bodyFatRange: [25, Infinity],
            weightLossRange: [40, Infinity],
            focus: "Rapidly breaking metabolic inertia while protecting the gut",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4", dose: "2.0 mg", total: "2.0 mg" },
              { weeks: "5", dose: "3.5 mg", total: "3.5 mg" },
              { weeks: "6", dose: "5.0 mg", total: "5.0 mg" },
              { weeks: "7", dose: "6.5 mg", total: "6.5 mg" },
              { weeks: "8", dose: "7.5 mg", total: "7.5 mg" },
              { weeks: "9-10", dose: "7.0 mg", total: "14.0 mg" },
            ],
            totalDose: "40.0 mg",
          },
          {
            name: "Standard Protocol",
            description: "15-25% BF / 15-40lb Goal",
            bodyFatRange: [15, 25],
            weightLossRange: [15, 40],
            focus: "Steady titration for consistent lipolysis and fat oxidation",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4", dose: "1.5 mg", total: "1.5 mg" },
              { weeks: "5", dose: "2.5 mg", total: "2.5 mg" },
              { weeks: "6", dose: "4.0 mg", total: "4.0 mg" },
              { weeks: "7", dose: "6.0 mg", total: "6.0 mg" },
              { weeks: "8", dose: "7.5 mg", total: "7.5 mg" },
              { weeks: "9-10", dose: "8.5 mg", total: "17.0 mg" },
            ],
            totalDose: "40.0 mg",
          },
          {
            name: "Optimization Track",
            description: "<15% BF / <15lb Goal",
            bodyFatRange: [0, 15],
            weightLossRange: [0, 15],
            focus: "Slow on-ramp with a sustained peak to utilize the full kit safely",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4", dose: "1.5 mg", total: "1.5 mg" },
              { weeks: "5", dose: "3.0 mg", total: "3.0 mg" },
              { weeks: "6", dose: "4.5 mg", total: "4.5 mg" },
              { weeks: "7", dose: "6.5 mg", total: "6.5 mg" },
              { weeks: "8-10", dose: "7.6 mg", total: "23.0 mg" },
            ],
            totalDose: "40.0 mg",
            notes: ["Administering ~76 units ensures total kit utilization without nearing the 9.0 mg cap."],
          },
        ],
      },
      {
        weeks: 20,
        totalMaterial: "80 mg",
        tiers: [
          {
            name: "High-Resistance Reset",
            description: ">25% BF / >40lb Goal",
            bodyFatRange: [25, Infinity],
            weightLossRange: [40, Infinity],
            focus: "Extended protocol for significant transformation",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4-8", dose: "3.0 mg", total: "15.0 mg" },
              { weeks: "9-14", dose: "5.5 mg", total: "33.0 mg" },
              { weeks: "15-18", dose: "6.5 mg", total: "26.0 mg" },
              { weeks: "19-20", dose: "2.25 mg (Taper)", total: "4.5 mg" },
            ],
            totalDose: "80.0 mg",
          },
          {
            name: "Standard Protocol",
            description: "15-25% BF / 15-40lb Goal",
            bodyFatRange: [15, 25],
            weightLossRange: [15, 40],
            focus: "Balanced 20-week approach for moderate goals",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4-10", dose: "3.0 mg", total: "21.0 mg" },
              { weeks: "11-16", dose: "5.5 mg", total: "33.0 mg" },
              { weeks: "17-20", dose: "6.1 mg", total: "24.5 mg" },
            ],
            totalDose: "80.0 mg",
          },
        ],
      },
      {
        weeks: 30,
        totalMaterial: "120 mg",
        tiers: [
          {
            name: "High-Resistance Reset",
            description: ">25% BF / >40lb Goal",
            bodyFatRange: [25, Infinity],
            weightLossRange: [40, Infinity],
            focus: "Comprehensive long-term protocol for major transformation",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4-10", dose: "2.5 mg", total: "17.5 mg" },
              { weeks: "11-18", dose: "4.5 mg", total: "36.0 mg" },
              { weeks: "19-25", dose: "6.0 mg", total: "42.0 mg" },
              { weeks: "26-30", dose: "4.6 mg", total: "23.0 mg" },
            ],
            totalDose: "120.0 mg",
          },
          {
            name: "Standard Protocol",
            description: "15-25% BF / 15-40lb Goal",
            bodyFatRange: [15, 25],
            weightLossRange: [15, 40],
            focus: "Extended steady protocol for lasting results",
            schedule: [
              { weeks: "1-3", dose: "0.5 mg", total: "1.5 mg" },
              { weeks: "4-12", dose: "2.0 mg", total: "18.0 mg" },
              { weeks: "13-20", dose: "4.5 mg", total: "36.0 mg" },
              { weeks: "21-27", dose: "6.5 mg", total: "45.5 mg" },
              { weeks: "28-30", dose: "6.3 mg", total: "19.0 mg" },
            ],
            totalDose: "120.0 mg",
          },
        ],
      },
    ],
  },
  {
    id: "cjc-ipa",
    name: "CJC-1295 / IPAMORELIN",
    description: "Growth hormone synergy for muscle preservation and skin elasticity",
    durations: [
      {
        weeks: 10,
        totalMaterial: "25 mg (25,000 mcg)",
        tiers: [
          {
            name: "Full Utilization Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Complete kit utilization by day 70",
            schedule: [
              { weeks: "1-2", dose: "250 mcg", total: "2,500 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "3-4", dose: "300 mcg", total: "3,000 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "5-6", dose: "350 mcg", total: "3,500 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "7-8", dose: "450 mcg", total: "4,500 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "9-10", dose: "650 mcg", total: "6,500 mcg", frequency: "Nightly, 5 on / 2 off" },
            ],
            totalDose: "20,000 mcg",
            notes: ["Remaining ~5,000 mcg can be used for a final 'Peak' push or slight buffer."],
          },
        ],
      },
      {
        weeks: 20,
        totalMaterial: "50 mg (50,000 mcg)",
        tiers: [
          {
            name: "Extended Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Sustained GH optimization over 20 weeks",
            schedule: [
              { weeks: "1-5", dose: "300 mcg", total: "7,500 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "6-15", dose: "500 mcg", total: "25,000 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "16-20", dose: "650 mcg", total: "16,250 mcg", frequency: "Nightly, 5 on / 2 off" },
            ],
            totalDose: "48,750 mcg",
          },
        ],
      },
      {
        weeks: 30,
        totalMaterial: "75 mg (75,000 mcg)",
        tiers: [
          {
            name: "Marathon Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Long-term growth hormone optimization",
            schedule: [
              { weeks: "1-10", dose: "350 mcg", total: "17,500 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "11-20", dose: "500 mcg", total: "25,000 mcg", frequency: "Nightly, 5 on / 2 off" },
              { weeks: "21-30", dose: "650 mcg", total: "32,500 mcg", frequency: "Nightly, 5 on / 2 off" },
            ],
            totalDose: "75,000 mcg",
          },
        ],
      },
    ],
  },
  {
    id: "bpc-tb",
    name: "BPC-157 / TB-500",
    description: "Systemic repair, joint protection, and reducing inflammation",
    durations: [
      {
        weeks: 10,
        totalMaterial: "20 mg",
        tiers: [
          {
            name: "Standard Recovery Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Complete kit utilization for healing and recovery",
            schedule: [
              { weeks: "1-5", dose: "2.0 mg", total: "10.0 mg", frequency: "Twice weekly (Mon/Thu)" },
              { weeks: "6-10", dose: "2.0 mg", total: "10.0 mg", frequency: "Twice weekly (Mon/Thu)" },
            ],
            totalDose: "20.0 mg",
          },
        ],
      },
      {
        weeks: 20,
        totalMaterial: "40 mg",
        tiers: [
          {
            name: "Extended Recovery Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Sustained healing support over 20 weeks",
            schedule: [
              { weeks: "1-20", dose: "2.0 mg", total: "40.0 mg", frequency: "Twice weekly (Mon/Thu)" },
            ],
            totalDose: "40.0 mg",
          },
        ],
      },
      {
        weeks: 30,
        totalMaterial: "60 mg",
        tiers: [
          {
            name: "Comprehensive Recovery Protocol",
            description: "All body types",
            bodyFatRange: [0, Infinity],
            weightLossRange: [0, Infinity],
            focus: "Long-term systemic repair and joint protection",
            schedule: [
              { weeks: "1-30", dose: "2.0 mg", total: "60.0 mg", frequency: "Twice weekly (Mon/Thu)" },
            ],
            totalDose: "60.0 mg",
          },
        ],
      },
    ],
  },
];

export function getProtocolById(id: string): PeptideProtocol | undefined {
  return dosingProtocols.find((p) => p.id === id);
}

export function getMatchingTier(
  protocol: PeptideProtocol,
  weeks: number,
  bodyFat: number,
  weightLoss: number
): ProtocolTier | undefined {
  const duration = protocol.durations.find((d) => d.weeks === weeks);
  if (!duration) return undefined;

  // Find the best matching tier based on body fat and weight loss goals
  // Priority: exact match > closest match
  for (const tier of duration.tiers) {
    const [minBF, maxBF] = tier.bodyFatRange;
    const [minWL, maxWL] = tier.weightLossRange;

    // Check if user falls within this tier's ranges
    const bfMatch = bodyFat >= minBF && bodyFat <= maxBF;
    const wlMatch = weightLoss >= minWL && weightLoss <= maxWL;

    if (bfMatch || wlMatch) {
      return tier;
    }
  }

  // If no exact match, return the first tier (usually the most general one)
  return duration.tiers[duration.tiers.length - 1];
}
