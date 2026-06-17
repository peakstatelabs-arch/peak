// Power Cut stack protocols — mirrored from peakstate.shop/dosing-calculator.
// Keep this file in sync with /app/dosing-calculator/dosingProtocols.ts on the marketing site.

export interface WeeklyDose {
  week: number;
  dose: string; // "0.5 mg" or "OFF"
  isOff?: boolean;
  cycleLabel?: string;
}

export interface BPCOption {
  name: string;
  frequency: string;
  subtitle: string;
  description: string;
  details: string[];
}

export interface StackProtocol {
  stacks: number;
  totalWeeks: number;
  overview: { title: string; phases: { label: string }[]; note?: string };
  reta: { title: string; totalMaterial: string; schedule: WeeklyDose[] };
  cjc: { title: string; totalMaterial: string; frequency: string; schedule: WeeklyDose[] };
  bpc: {
    title: string;
    totalMaterial: string;
    foundation: BPCOption;
    performance: BPCOption;
  };
}

export function parseMg(d: string): number {
  const m = d.match(/([\d.]+)/);
  return m ? Number(m[1]) : 0;
}

export const STACK_PROTOCOLS: StackProtocol[] = [
  {
    stacks: 1,
    totalWeeks: 12,
    overview: {
      title: "1 Stack — 12-Week System",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset phase (Reta continues; CJC + BPC off)" },
      ],
    },
    reta: {
      title: "Retatrutide — 12-week titration",
      totalMaterial: "40 mg",
      schedule: [
        { week: 1, dose: "0.5 mg" }, { week: 2, dose: "1.0 mg" }, { week: 3, dose: "1.5 mg" },
        { week: 4, dose: "2.0 mg" }, { week: 5, dose: "2.5 mg" }, { week: 6, dose: "3.0 mg" },
        { week: 7, dose: "3.5 mg" }, { week: 8, dose: "4.0 mg" }, { week: 9, dose: "4.5 mg" },
        { week: 10, dose: "5.5 mg" }, { week: 11, dose: "6.0 mg" }, { week: 12, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 + Ipamorelin",
      totalMaterial: "20 mg",
      frequency: "Monday–Friday evening (fasted)",
      schedule: [
        { week: 1, dose: "0.30 mg" }, { week: 2, dose: "0.30 mg" }, { week: 3, dose: "0.30 mg" },
        { week: 4, dose: "0.30 mg" }, { week: 5, dose: "0.40 mg" }, { week: 6, dose: "0.40 mg" },
        { week: 7, dose: "0.50 mg" }, { week: 8, dose: "0.50 mg" }, { week: 9, dose: "0.50 mg" },
        { week: 10, dose: "0.50 mg" }, { week: 11, dose: "OFF", isOff: true }, { week: 12, dose: "OFF", isOff: true },
      ],
    },
    bpc: {
      title: "BPC-157 + TB-500",
      totalMaterial: "40 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2× weekly (Mon + Thu evening)",
        subtitle: "Designed for simplicity and consistency.",
        description: "Effective recovery, minimal injections.",
        details: ["2.0 mg per injection", "Mon + Thu evening", "Weeks 1-10 ON, 11-12 OFF"],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3× weekly (Mon + Wed + Fri evening)",
        subtitle: "Increased frequency for maximum recovery signaling.",
        description: "For clients chasing maximum results.",
        details: ["1.3 mg per injection", "Mon + Wed + Fri evening", "Weeks 1-10 ON, 11-12 OFF"],
      },
    },
  },

  {
    stacks: 2,
    totalWeeks: 24,
    overview: {
      title: "2 Stacks — 24-Week System",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset (Reta continues)" },
        { label: "Weeks 13-22: Full protocol resumes" },
        { label: "Weeks 23-24: Reta only" },
      ],
      note: "Designed to preserve sensitivity and maximize long-term results.",
    },
    reta: {
      title: "Retatrutide — 24-week titration",
      totalMaterial: "80 mg",
      schedule: [
        { week: 1, dose: "0.5 mg" }, { week: 2, dose: "1.0 mg" }, { week: 3, dose: "1.5 mg" },
        { week: 4, dose: "2.0 mg" }, { week: 5, dose: "2.5 mg" }, { week: 6, dose: "2.5 mg" },
        { week: 7, dose: "2.5 mg" }, { week: 8, dose: "2.5 mg" }, { week: 9, dose: "2.5 mg" },
        { week: 10, dose: "2.5 mg" }, { week: 11, dose: "2.5 mg" }, { week: 12, dose: "2.5 mg" },
        { week: 13, dose: "2.5 mg" }, { week: 14, dose: "3.0 mg" }, { week: 15, dose: "3.0 mg" },
        { week: 16, dose: "3.5 mg" }, { week: 17, dose: "4.0 mg" }, { week: 18, dose: "4.5 mg" },
        { week: 19, dose: "5.0 mg" }, { week: 20, dose: "5.5 mg" }, { week: 21, dose: "6.0 mg" },
        { week: 22, dose: "6.0 mg" }, { week: 23, dose: "6.0 mg" }, { week: 24, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 + Ipamorelin",
      totalMaterial: "40 mg",
      frequency: "Monday–Friday evening (fasted)",
      schedule: [
        { week: 1, dose: "0.30 mg" }, { week: 2, dose: "0.30 mg" }, { week: 3, dose: "0.35 mg" },
        { week: 4, dose: "0.35 mg" }, { week: 5, dose: "0.40 mg" }, { week: 6, dose: "0.40 mg" },
        { week: 7, dose: "0.45 mg" }, { week: 8, dose: "0.45 mg" }, { week: 9, dose: "0.50 mg" },
        { week: 10, dose: "0.50 mg" }, { week: 11, dose: "OFF", isOff: true }, { week: 12, dose: "OFF", isOff: true },
        { week: 13, dose: "0.25 mg" }, { week: 14, dose: "0.25 mg" }, { week: 15, dose: "0.30 mg" },
        { week: 16, dose: "0.30 mg" }, { week: 17, dose: "0.30 mg" }, { week: 18, dose: "0.35 mg" },
        { week: 19, dose: "0.40 mg" }, { week: 20, dose: "0.50 mg" }, { week: 21, dose: "0.60 mg" },
        { week: 22, dose: "0.75 mg" }, { week: 23, dose: "OFF", isOff: true }, { week: 24, dose: "OFF", isOff: true },
      ],
    },
    bpc: {
      title: "BPC-157 + TB-500",
      totalMaterial: "80 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2× weekly (Mon + Thu evening)",
        subtitle: "Simplicity and consistency.",
        description: "Best for low-friction protocols.",
        details: ["2.0 mg per injection", "Mon + Thu evening", "Weeks 1-10 + 13-22 ON, 11-12 + 23-24 OFF"],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3× weekly (Mon + Wed + Fri evening)",
        subtitle: "Maximum recovery signaling.",
        description: "For dedicated clients.",
        details: ["1.3 mg per injection", "Mon + Wed + Fri evening", "Weeks 1-10 + 13-22 ON, 11-12 + 23-24 OFF"],
      },
    },
  },

  {
    stacks: 3,
    totalWeeks: 36,
    overview: {
      title: "3 Stacks — 36-Week System",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset" },
        { label: "Weeks 13-22: Full protocol resumes" },
        { label: "Weeks 23-24: Reset" },
        { label: "Weeks 25-34: Full protocol resumes" },
        { label: "Weeks 35-36: Reta only" },
      ],
      note: "Designed to preserve sensitivity and maximize long-term results.",
    },
    reta: {
      title: "Retatrutide — 36-week titration",
      totalMaterial: "120 mg",
      schedule: [
        ...Array.from({ length: 23 }, (_, i) => ({ week: i + 1, dose: i === 0 ? "0.5 mg" : i === 1 ? "1.0 mg" : i === 2 ? "1.5 mg" : i === 3 ? "2.0 mg" : "2.5 mg" })),
        { week: 24, dose: "3.0 mg" }, { week: 25, dose: "3.5 mg" }, { week: 26, dose: "4.0 mg" },
        { week: 27, dose: "4.5 mg" }, { week: 28, dose: "5.0 mg" }, { week: 29, dose: "5.5 mg" },
        { week: 30, dose: "6.0 mg" }, { week: 31, dose: "6.0 mg" }, { week: 32, dose: "6.0 mg" },
        { week: 33, dose: "6.0 mg" }, { week: 34, dose: "6.0 mg" }, { week: 35, dose: "6.0 mg" },
        { week: 36, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 + Ipamorelin",
      totalMaterial: "60 mg",
      frequency: "Monday–Friday evening (fasted)",
      schedule: [
        { week: 1, dose: "0.25 mg" }, { week: 2, dose: "0.25 mg" }, { week: 3, dose: "0.30 mg" },
        { week: 4, dose: "0.30 mg" }, { week: 5, dose: "0.30 mg" }, { week: 6, dose: "0.30 mg" },
        { week: 7, dose: "0.30 mg" }, { week: 8, dose: "0.35 mg" }, { week: 9, dose: "0.35 mg" },
        { week: 10, dose: "0.40 mg" }, { week: 11, dose: "OFF", isOff: true }, { week: 12, dose: "OFF", isOff: true },
        { week: 13, dose: "0.30 mg" }, { week: 14, dose: "0.30 mg" }, { week: 15, dose: "0.35 mg" },
        { week: 16, dose: "0.35 mg" }, { week: 17, dose: "0.35 mg" }, { week: 18, dose: "0.40 mg" },
        { week: 19, dose: "0.40 mg" }, { week: 20, dose: "0.45 mg" }, { week: 21, dose: "0.50 mg" },
        { week: 22, dose: "0.50 mg" }, { week: 23, dose: "OFF", isOff: true }, { week: 24, dose: "OFF", isOff: true },
        { week: 25, dose: "0.30 mg" }, { week: 26, dose: "0.35 mg" }, { week: 27, dose: "0.40 mg" },
        { week: 28, dose: "0.45 mg" }, { week: 29, dose: "0.50 mg" }, { week: 30, dose: "0.50 mg" },
        { week: 31, dose: "0.60 mg" }, { week: 32, dose: "0.60 mg" }, { week: 33, dose: "0.60 mg" },
        { week: 34, dose: "0.70 mg" }, { week: 35, dose: "OFF", isOff: true }, { week: 36, dose: "OFF", isOff: true },
      ],
    },
    bpc: {
      title: "BPC-157 + TB-500",
      totalMaterial: "120 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2× weekly (Mon + Thu evening)",
        subtitle: "Simplicity and consistency.",
        description: "Best for low-friction protocols.",
        details: ["2.0 mg per injection", "Mon + Thu evening", "ON weeks 1-10, 13-22, 25-34"],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3× weekly (Mon + Wed + Fri evening)",
        subtitle: "Maximum recovery signaling.",
        description: "For dedicated clients.",
        details: ["1.3 mg per injection", "Mon + Wed + Fri evening", "ON weeks 1-10, 13-22, 25-34"],
      },
    },
  },
];

export function getStackProtocol(stacks: number): StackProtocol | undefined {
  return STACK_PROTOCOLS.find((p) => p.stacks === stacks);
}
