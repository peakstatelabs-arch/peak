/* ============================================================
 * The 20-Pound Reta Roadmap — phase model + "you are here" math.
 * ============================================================ */

export type Phase = {
  /** Section anchor id. */
  id: string;
  /** 1–5. */
  num: number;
  /** "0–5 lb". */
  range: string;
  /** Short label for compact UI. */
  short: string;
  title: string;
  /** "The 20-Pound Map" summary lines. */
  summary: string[];
  /** One-page roadmap "Focus on" bullets. */
  focus: string[];
  /** One-page roadmap headline (sometimes worded differently from title). */
  pageTitle: string;
  /** The single question for the phase. */
  question: string;
};

export const PHASES: Phase[] = [
  {
    id: "phase-1",
    num: 1,
    range: "0–5 lb",
    short: "Build",
    title: "Build the Base",
    summary: [
      "Learn how your body is responding.",
      "Create structure.",
      "Establish your baseline.",
      "Avoid the temptation to optimize everything immediately.",
    ],
    pageTitle: "Build the Base",
    focus: [
      "baseline measurements",
      "protein",
      "resistance training",
      "movement",
      "recovery",
      "learning your body’s response",
    ],
    question: "Can I repeat this?",
  },
  {
    id: "phase-2",
    num: 2,
    range: "5–10 lb",
    short: "Protect",
    title: "Protect the Body You’re Building",
    summary: [
      "The scale is moving.",
      "Now make sure you’re losing weight intelligently.",
      "Protect muscle. Keep training.",
      "Pay attention to energy and recovery.",
    ],
    pageTitle: "Protect Muscle",
    focus: [
      "maintaining protein",
      "maintaining strength",
      "productive training",
      "adequate nutrition despite lower appetite",
      "recovery",
    ],
    question: "Am I becoming leaner while staying strong?",
  },
  {
    id: "phase-3",
    num: 3,
    range: "10–15 lb",
    short: "Diagnose",
    title: "Diagnose Before You Adjust",
    summary: [
      "Your body has changed.",
      "Progress may stop looking perfectly linear.",
      "This is where patience and good data become extremely valuable.",
    ],
    pageTitle: "Diagnose Before Adjusting",
    focus: [
      "trends instead of individual weigh-ins",
      "plateau checklist",
      "movement",
      "adherence",
      "sleep",
      "training performance",
    ],
    question: "Is something actually wrong, or am I reacting to noise?",
  },
  {
    id: "phase-4",
    num: 4,
    range: "15–20 lb",
    short: "Finish",
    title: "Finish Without Panicking",
    summary: [
      "The finish line can make people impatient.",
      "This phase is about resisting the urge to throw everything at the wall.",
      "Keep the fundamentals strong.",
      "Let the process finish.",
    ],
    pageTitle: "Finish Patiently",
    focus: [
      "tightening fundamentals",
      "resisting unnecessary aggression",
      "preserving muscle",
      "reassessing your goal",
      "patience",
    ],
    question: "What actually needs to change?",
  },
  {
    id: "phase-5",
    num: 5,
    range: "After 20",
    short: "Keep",
    title: "Learn to Keep It",
    summary: [
      "Losing weight was never supposed to be the permanent lifestyle.",
      "Eventually the objective changes.",
      "The new goal becomes living comfortably in the body you created.",
    ],
    pageTitle: "Make It Normal",
    focus: [
      "maintenance range",
      "strength",
      "sustainable nutrition",
      "movement",
      "living your life",
    ],
    question: "Can I keep this without feeling like I’m permanently dieting?",
  },
];

/** What the reader told us about where they are. */
export type Position = {
  mode: "phase" | "weights" | null;
  /** 0–4 when mode === "phase". */
  phase: number | null;
  start: number | null;
  current: number | null;
};

export const EMPTY_POSITION: Position = {
  mode: null,
  phase: null,
  start: null,
  current: null,
};

export function phaseFromPounds(lost: number) {
  if (lost < 5) return 0;
  if (lost < 10) return 1;
  if (lost < 15) return 2;
  if (lost < 20) return 3;
  return 4;
}

export type Located = {
  /** 0–4 phase index. */
  phase: number;
  /** Pounds lost, when weights are known. */
  lost: number | null;
  /**
   * Marker position along the 5-segment track, 0..5. Segments 0–3 are the
   * four 5-lb phases; segment 4 is maintenance.
   */
  pos: number;
};

export function locate(p: Position): Located | null {
  if (p.mode === "weights" && validWeight(p.start) && validWeight(p.current)) {
    const lost = Math.max(0, round1(p.start! - p.current!));
    const phase = phaseFromPounds(lost);
    const pos = lost >= 20 ? 4.5 : lost / 5;
    return { phase, lost, pos };
  }
  if (p.mode === "phase" && p.phase !== null && p.phase >= 0 && p.phase <= 4) {
    return { phase: p.phase, lost: null, pos: p.phase + 0.5 };
  }
  return null;
}

export function validWeight(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n) && n >= 60 && n <= 800;
}

export function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export function fmtLb(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(1);
}
