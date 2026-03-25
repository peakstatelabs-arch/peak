export interface WeeklyDose {
  week: number;
  dose: string;
  isOff?: boolean;
  cycleLabel?: string; // e.g., "Cycle 1 (Weeks 1-10)"
}

export interface OverviewPhase {
  label: string;
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
  overview: {
    title: string;
    phases: OverviewPhase[];
    note?: string;
  };
  reta: {
    title: string;
    totalMaterial: string;
    schedule: WeeklyDose[];
  };
  cjc: {
    title: string;
    totalMaterial: string;
    frequency: string;
    schedule: WeeklyDose[];
  };
  bpc: {
    title: string;
    totalMaterial: string;
    foundation: BPCOption;
    performance: BPCOption;
  };
}

export const stackProtocols: StackProtocol[] = [
  // ===================== 1 STACK =====================
  {
    stacks: 1,
    totalWeeks: 12,
    overview: {
      title: "1 Stack: 12-Week System Overview",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset phase (Reta continues while BPC and CJC blends are cycled out)" },
      ],
    },
    reta: {
      title: "RETA - 12 WEEK TITRATION",
      totalMaterial: "40 mg",
      schedule: [
        { week: 1, dose: "0.5 mg" },
        { week: 2, dose: "1.0 mg" },
        { week: 3, dose: "1.5 mg" },
        { week: 4, dose: "2.0 mg" },
        { week: 5, dose: "2.5 mg" },
        { week: 6, dose: "3.0 mg" },
        { week: 7, dose: "3.5 mg" },
        { week: 8, dose: "4.0 mg" },
        { week: 9, dose: "4.5 mg" },
        { week: 10, dose: "5.5 mg" },
        { week: 11, dose: "6.0 mg" },
        { week: 12, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 / Ipamorelin Dosing Schedule",
      totalMaterial: "20 mg",
      frequency: "5 days on / 2 days off, taken nightly",
      schedule: [
        { week: 1, dose: "0.30 mg" },
        { week: 2, dose: "0.30 mg" },
        { week: 3, dose: "0.30 mg" },
        { week: 4, dose: "0.30 mg" },
        { week: 5, dose: "0.40 mg" },
        { week: 6, dose: "0.40 mg" },
        { week: 7, dose: "0.50 mg" },
        { week: 8, dose: "0.50 mg" },
        { week: 9, dose: "0.50 mg" },
        { week: 10, dose: "0.50 mg" },
        { week: 11, dose: "OFF", isOff: true },
        { week: 12, dose: "OFF", isOff: true },
      ],
    },
    bpc: {
      title: "BPC-157 / TB-500 Structure",
      totalMaterial: "40 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2x weekly",
        subtitle: "Designed for simplicity and consistency.",
        description: "Best for those who want effective recovery with minimal injections and low friction.",
        details: [
          "Dose per injection: 2.0 mg",
          "Schedule: Monday / Thursday",
          "Weeks 1-10: ON (2.0 mg per injection)",
          "Weeks 11-12: OFF (No dosing)",
        ],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3x weekly",
        subtitle: "Increased frequency for enhanced recovery signaling.",
        description: "Ideal for those looking to maximize results and don't mind a slightly higher level of commitment.",
        details: [
          "Dose per injection: 1.3 mg (Mon) / 1.3 mg (Wed) / 1.3 mg (Fri)",
          "Schedule: Monday / Wednesday / Friday",
          "Weeks 1-10: ON (4.0 mg weekly total)",
          "Weeks 11-12: OFF (No dosing)",
        ],
      },
    },
  },

  // ===================== 2 STACKS =====================
  {
    stacks: 2,
    totalWeeks: 24,
    overview: {
      title: "2 Stacks: 22-Week System Overview",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset phase (Reta continues while BPC and CJC blends are cycled out)" },
        { label: "Weeks 13-22: Full protocol resumes" },
        { label: "Weeks 23-24: Reta only" },
      ],
      note: "Designed to preserve sensitivity and maximize long-term results.",
    },
    reta: {
      title: "RETA - 22 WEEK TITRATION",
      totalMaterial: "80 mg",
      schedule: [
        { week: 1, dose: "0.5 mg" },
        { week: 2, dose: "1.0 mg" },
        { week: 3, dose: "1.5 mg" },
        { week: 4, dose: "2.0 mg" },
        { week: 5, dose: "2.5 mg" },
        { week: 6, dose: "2.5 mg" },
        { week: 7, dose: "2.5 mg" },
        { week: 8, dose: "2.5 mg" },
        { week: 9, dose: "2.5 mg" },
        { week: 10, dose: "2.5 mg" },
        { week: 11, dose: "2.5 mg" },
        { week: 12, dose: "2.5 mg" },
        { week: 13, dose: "2.5 mg" },
        { week: 14, dose: "3.0 mg" },
        { week: 15, dose: "3.0 mg" },
        { week: 16, dose: "3.5 mg" },
        { week: 17, dose: "4.0 mg" },
        { week: 18, dose: "4.5 mg" },
        { week: 19, dose: "5.0 mg" },
        { week: 20, dose: "5.5 mg" },
        { week: 21, dose: "6.0 mg" },
        { week: 22, dose: "6.0 mg" },
        { week: 23, dose: "6.0 mg" },
        { week: 24, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 / Ipamorelin Dosing Schedule",
      totalMaterial: "40 mg",
      frequency: "5 days on / 2 days off, taken nightly",
      schedule: [
        { week: 1, dose: "0.30 mg", cycleLabel: "Cycle 1 (Weeks 1-10)" },
        { week: 2, dose: "0.30 mg" },
        { week: 3, dose: "0.35 mg" },
        { week: 4, dose: "0.35 mg" },
        { week: 5, dose: "0.40 mg" },
        { week: 6, dose: "0.40 mg" },
        { week: 7, dose: "0.45 mg" },
        { week: 8, dose: "0.45 mg" },
        { week: 9, dose: "0.50 mg" },
        { week: 10, dose: "0.50 mg" },
        { week: 11, dose: "OFF", isOff: true, cycleLabel: "Weeks 11-12" },
        { week: 12, dose: "OFF", isOff: true },
        { week: 13, dose: "0.25 mg", cycleLabel: "Cycle 2 (Weeks 13-22)" },
        { week: 14, dose: "0.25 mg" },
        { week: 15, dose: "0.30 mg" },
        { week: 16, dose: "0.30 mg" },
        { week: 17, dose: "0.30 mg" },
        { week: 18, dose: "0.35 mg" },
        { week: 19, dose: "0.40 mg" },
        { week: 20, dose: "0.50 mg" },
        { week: 21, dose: "0.60 mg" },
        { week: 22, dose: "0.75 mg" },
      ],
    },
    bpc: {
      title: "BPC-157 / TB-500 Structure",
      totalMaterial: "80 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2x weekly",
        subtitle: "Designed for simplicity and consistency.",
        description: "Best for those who want effective recovery with minimal injections and low friction.",
        details: [
          "Dose per injection: 2.0 mg",
          "Schedule: Monday / Thursday",
          "Weeks 1-10: ON (2.0 mg per injection)",
          "Weeks 11-12: OFF (No dosing)",
          "Weeks 13-22: ON (2.0 mg per injection)",
          "Weeks 23-24: OFF (No dosing)",
        ],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3x weekly",
        subtitle: "Increased frequency for enhanced recovery signaling.",
        description: "Ideal for those looking to maximize results and don't mind a slightly higher level of commitment.",
        details: [
          "Dose per injection: 1.3 mg (Mon) / 1.3 mg (Wed) / 1.3 mg (Fri)",
          "Schedule: Monday / Wednesday / Friday",
          "Weeks 1-10: ON (4.0 mg weekly total)",
          "Weeks 11-12: OFF (No dosing)",
          "Weeks 13-22: ON (4.0 mg weekly total)",
          "Weeks 23-24: OFF (No dosing)",
        ],
      },
    },
  },

  // ===================== 3 STACKS =====================
  {
    stacks: 3,
    totalWeeks: 36,
    overview: {
      title: "3 Stacks: 36-Week System Overview",
      phases: [
        { label: "Weeks 1-10: Full protocol" },
        { label: "Weeks 11-12: Reset phase (Reta continues while BPC and CJC blends are cycled out)" },
        { label: "Weeks 13-22: Full protocol resumes" },
        { label: "Weeks 23-24: Reset phase (Reta continues while BPC and CJC blends are cycled out)" },
        { label: "Weeks 25-34: Full protocol resumes" },
        { label: "Weeks 35-36: Reta only" },
      ],
      note: "Designed to preserve sensitivity and maximize long-term results.",
    },
    reta: {
      title: "RETA - 36 WEEK TITRATION",
      totalMaterial: "120 mg",
      schedule: [
        { week: 1, dose: "0.5 mg" },
        { week: 2, dose: "1.0 mg" },
        { week: 3, dose: "1.5 mg" },
        { week: 4, dose: "2.0 mg" },
        { week: 5, dose: "2.5 mg" },
        { week: 6, dose: "2.5 mg" },
        { week: 7, dose: "2.5 mg" },
        { week: 8, dose: "2.5 mg" },
        { week: 9, dose: "2.5 mg" },
        { week: 10, dose: "2.5 mg" },
        { week: 11, dose: "2.5 mg" },
        { week: 12, dose: "2.5 mg" },
        { week: 13, dose: "2.5 mg" },
        { week: 14, dose: "2.5 mg" },
        { week: 15, dose: "2.5 mg" },
        { week: 16, dose: "2.5 mg" },
        { week: 17, dose: "2.5 mg" },
        { week: 18, dose: "2.5 mg" },
        { week: 19, dose: "2.5 mg" },
        { week: 20, dose: "2.5 mg" },
        { week: 21, dose: "2.5 mg" },
        { week: 22, dose: "2.5 mg" },
        { week: 23, dose: "2.5 mg" },
        { week: 24, dose: "3.0 mg" },
        { week: 25, dose: "3.5 mg" },
        { week: 26, dose: "4.0 mg" },
        { week: 27, dose: "4.5 mg" },
        { week: 28, dose: "5.0 mg" },
        { week: 29, dose: "5.5 mg" },
        { week: 30, dose: "6.0 mg" },
        { week: 31, dose: "6.0 mg" },
        { week: 32, dose: "6.0 mg" },
        { week: 33, dose: "6.0 mg" },
        { week: 34, dose: "6.0 mg" },
        { week: 35, dose: "6.0 mg" },
        { week: 36, dose: "6.0 mg" },
      ],
    },
    cjc: {
      title: "CJC-1295 / Ipamorelin Protocol",
      totalMaterial: "60 mg",
      frequency: "5 days on / 2 days off, taken nightly",
      schedule: [
        { week: 1, dose: "0.25 mg", cycleLabel: "Cycle 1 (Weeks 1-10)" },
        { week: 2, dose: "0.25 mg" },
        { week: 3, dose: "0.30 mg" },
        { week: 4, dose: "0.30 mg" },
        { week: 5, dose: "0.30 mg" },
        { week: 6, dose: "0.30 mg" },
        { week: 7, dose: "0.30 mg" },
        { week: 8, dose: "0.35 mg" },
        { week: 9, dose: "0.35 mg" },
        { week: 10, dose: "0.40 mg" },
        { week: 11, dose: "OFF", isOff: true, cycleLabel: "Weeks 11-12" },
        { week: 12, dose: "OFF", isOff: true },
        { week: 13, dose: "0.30 mg", cycleLabel: "Cycle 2 (Weeks 13-22)" },
        { week: 14, dose: "0.30 mg" },
        { week: 15, dose: "0.35 mg" },
        { week: 16, dose: "0.35 mg" },
        { week: 17, dose: "0.35 mg" },
        { week: 18, dose: "0.40 mg" },
        { week: 19, dose: "0.40 mg" },
        { week: 20, dose: "0.45 mg" },
        { week: 21, dose: "0.50 mg" },
        { week: 22, dose: "0.50 mg" },
        { week: 23, dose: "OFF", isOff: true, cycleLabel: "Weeks 23-24" },
        { week: 24, dose: "OFF", isOff: true },
        { week: 25, dose: "0.30 mg", cycleLabel: "Cycle 3 (Weeks 25-34)" },
        { week: 26, dose: "0.35 mg" },
        { week: 27, dose: "0.40 mg" },
        { week: 28, dose: "0.45 mg" },
        { week: 29, dose: "0.50 mg" },
        { week: 30, dose: "0.50 mg" },
        { week: 31, dose: "0.60 mg" },
        { week: 32, dose: "0.60 mg" },
        { week: 33, dose: "0.60 mg" },
        { week: 34, dose: "0.70 mg" },
        { week: 35, dose: "OFF", isOff: true, cycleLabel: "Weeks 35-36" },
        { week: 36, dose: "OFF", isOff: true },
      ],
    },
    bpc: {
      title: "BPC-157 / TB-500 Protocol",
      totalMaterial: "120 mg",
      foundation: {
        name: "Foundation Protocol",
        frequency: "2x weekly",
        subtitle: "Designed for simplicity and consistency.",
        description: "Best for those who want effective recovery with minimal injections and low friction.",
        details: [
          "Dose per injection: 2.0 mg",
          "Schedule: Monday / Thursday",
          "Weeks 1-10: ON (2.0 mg per injection)",
          "Weeks 11-12: OFF (No dosing)",
          "Weeks 13-22: ON (2.0 mg per injection)",
          "Weeks 23-24: OFF (No dosing)",
          "Weeks 25-34: ON (2.0 mg per injection)",
          "Weeks 35-36: OFF (No dosing)",
        ],
      },
      performance: {
        name: "Performance Protocol",
        frequency: "3x weekly",
        subtitle: "Increased frequency for enhanced recovery signaling.",
        description: "Ideal for those looking to maximize results and don't mind a slightly higher level of commitment.",
        details: [
          "Dose per injection: 1.3 mg (Mon) / 1.3 mg (Wed) / 1.3 mg (Fri)",
          "Schedule: Monday / Wednesday / Friday",
          "Weeks 1-10: ON (4.0 mg weekly total)",
          "Weeks 11-12: OFF (No dosing)",
          "Weeks 13-22: ON (4.0 mg weekly total)",
          "Weeks 23-24: OFF (No dosing)",
          "Weeks 25-34: ON (4.0 mg weekly total)",
          "Weeks 35-36: OFF (No dosing)",
        ],
      },
    },
  },
];

export function getStackProtocol(stacks: number): StackProtocol | undefined {
  return stackProtocols.find((p) => p.stacks === stacks);
}
