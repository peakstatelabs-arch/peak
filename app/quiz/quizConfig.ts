// Quiz data model + recommendation engine for the /quiz split-test funnel.
//
// This module is pure (no React, no side effects) so the recommendation
// logic can be reasoned about and unit-tested in isolation. The quiz UI
// (QuizExperience.tsx) collects `QuizAnswers`; `buildRecommendation` turns
// those answers into a `Recommendation` the results page renders.
//
// Products reuse the exact Stripe Price IDs / pricing the singles catalog
// already sells (see app/singles/cart/priceCatalog.ts and app/singles/page.tsx)
// so add-to-cart + checkout work through the existing on-site cart. The POWER
// CUT stack is sold via the hosted Stripe payment links in content/siteCopy.ts.

import {
  SINGLES_PRICE_IDS,
  type SinglesProductSlug,
} from "@/app/singles/cart/priceCatalog";

/* ────────────────────────────── Answer model ───────────────────────────── */

export type Gender = "male" | "female" | "unspecified";
export type AgeRange = "21-29" | "30-39" | "40-49" | "50+";
export type Goal =
  | "fat-loss"
  | "muscle"
  | "recovery"
  | "antiaging"
  | "transformation";
export type Experience = "new" | "some" | "experienced";
export type Timeline = "10-weeks" | "event" | "long-term";
export type StartPreference = "protocol" | "single" | "unsure";

export interface QuizAnswers {
  gender: Gender;
  age: AgeRange;
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  experience: Experience;
  weight: number;
  timeline: Timeline;
  startPreference: StartPreference;
}

/* ─────────────────────────── Goal presentation ─────────────────────────── */

export interface GoalMeta {
  key: Goal;
  emoji: string;
  label: string;
  blurb: string;
}

// Primary-goal options (includes the broad "transformation" pick).
export const PRIMARY_GOALS: GoalMeta[] = [
  {
    key: "fat-loss",
    emoji: "🔥",
    label: "Lose fat",
    blurb: "Strip stubborn body fat and lean out",
  },
  {
    key: "muscle",
    emoji: "💪",
    label: "Build lean muscle",
    blurb: "Add lean mass, strength and better sleep",
  },
  {
    key: "recovery",
    emoji: "🧠",
    label: "Recover & heal",
    blurb: "Bounce back from training, joints and injuries",
  },
  {
    key: "antiaging",
    emoji: "✨",
    label: "Look younger",
    blurb: "Skin, hair and visible tissue renewal",
  },
  {
    key: "transformation",
    emoji: "⚡",
    label: "Total transformation",
    blurb: "Fat loss + muscle + recovery, all at once",
  },
];

// Secondary goals never include "transformation" (it isn't an add-on).
export const SECONDARY_GOALS: GoalMeta[] = PRIMARY_GOALS.filter(
  (g) => g.key !== "transformation",
);

export function goalMeta(key: Goal): GoalMeta {
  return PRIMARY_GOALS.find((g) => g.key === key) ?? PRIMARY_GOALS[0];
}

/* ───────────────────────────── Product catalog ─────────────────────────── */

export interface QuizProduct {
  slug: SinglesProductSlug;
  priceId: string;
  name: string;
  dose: string;
  price: string;
  priceCents: number;
  image: string;
  tagline: string;
  blurb: string;
}

export const SINGLES: Record<SinglesProductSlug, QuizProduct> = {
  retatrutide: {
    slug: "retatrutide",
    priceId: SINGLES_PRICE_IDS.retatrutide,
    name: "Retatrutide",
    dose: "20mg",
    price: "$215",
    priceCents: 21500,
    image: "/reta-product.png",
    tagline: "The Engine",
    blurb:
      "GLP-1 / GIP / Glucagon triple agonist. Kills food noise, raises metabolic output, and drives stored fat oxidation.",
  },
  "cjc-ipamorelin": {
    slug: "cjc-ipamorelin",
    priceId: SINGLES_PRICE_IDS["cjc-ipamorelin"],
    name: "CJC-1295 + Ipamorelin",
    dose: "10mg blend",
    price: "$105",
    priceCents: 10500,
    image: "/cjc-ipa-product.png",
    tagline: "The Architect",
    blurb:
      "Amplifies your natural growth-hormone pulse. Builds lean muscle, deepens sleep, and protects gains in a deficit.",
  },
  "bpc-tb500": {
    slug: "bpc-tb500",
    priceId: SINGLES_PRICE_IDS["bpc-tb500"],
    name: "BPC-157 + TB-500",
    dose: "20mg blend",
    price: "$145",
    priceCents: 14500,
    image: "/bpc-tb-product.png",
    tagline: "The Shield",
    blurb:
      "Local + systemic repair. Accelerates connective-tissue recovery, calms inflammation, and protects joints and tendons.",
  },
  "ghk-cu": {
    slug: "ghk-cu",
    priceId: SINGLES_PRICE_IDS["ghk-cu"],
    name: "GHK-Cu",
    dose: "50mg",
    price: "$85",
    priceCents: 8500,
    image: "/GHKCU.png",
    tagline: "The Restorer",
    blurb:
      "Copper-peptide signaling for skin quality, hair vitality and visible tissue renewal as you transform.",
  },
};

// Which single vial each concrete goal maps to. "transformation" has no single
// vial — it resolves to the stack (or the Engine if the user wants to start small).
const GOAL_TO_SLUG: Record<Goal, SinglesProductSlug | null> = {
  "fat-loss": "retatrutide",
  muscle: "cjc-ipamorelin",
  recovery: "bpc-tb500",
  antiaging: "ghk-cu",
  transformation: null,
};

// Vials contained inside the POWER CUT stack (so we never suggest them as
// "add-ons" to someone already buying the full protocol).
const STACK_SLUGS: SinglesProductSlug[] = [
  "retatrutide",
  "cjc-ipamorelin",
  "bpc-tb500",
];

/* ─────────────────────────── Recommendation model ──────────────────────── */

export type StackTierId = "single" | "double" | "triple";

export interface AddOn {
  product: QuizProduct;
  reason: string;
}

export interface Recommendation {
  kind: "stack" | "single";
  /** Present when kind === "single". */
  primary?: QuizProduct;
  /** Present when kind === "stack" — the cycle tier we pre-select. */
  recommendedTier: StackTierId;
  /** "Why this is right for you" bullets, generated from the answers. */
  reasons: string[];
  /** Contextual single-vial upsells drawn from secondary goals. */
  addOns: AddOn[];
  /** One-line, goal-specific expectation shown as the "projection". */
  projection: string;
}

/* ────────────────────────── Recommendation engine ──────────────────────── */

function wantsStack(a: QuizAnswers): boolean {
  // An explicit "just a vial or two" always wins — never override the user.
  if (a.startPreference === "single") return false;

  // The broad goal is the stack by definition.
  if (a.primaryGoal === "transformation") return true;

  // Explicit "full protocol" preference on a stack-friendly goal → stack.
  if (
    a.startPreference === "protocol" &&
    (a.primaryGoal === "fat-loss" || a.primaryGoal === "muscle")
  ) {
    return true;
  }

  // Fat loss paired with a muscle/recovery ambition is what POWER CUT is for.
  if (
    a.primaryGoal === "fat-loss" &&
    a.secondaryGoals.some((g) => g === "muscle" || g === "recovery")
  ) {
    return true;
  }

  return false;
}

function recommendedTier(a: QuizAnswers): StackTierId {
  // Longer horizons and heavier starting weights benefit from more than one
  // 10-week cycle — nudge (but never force) them toward the 2-cycle tier.
  if (a.timeline === "long-term") return "double";
  if (a.weight >= 230) return "double";
  return "single";
}

function reasonForGoal(g: Goal): string {
  switch (g) {
    case "fat-loss":
      return "Adds the metabolic engine to accelerate fat loss.";
    case "muscle":
      return "Layers in growth-hormone support for lean muscle and sleep.";
    case "recovery":
      return "Protects joints and speeds recovery through the cut.";
    case "antiaging":
      return "Supports skin, hair and visible renewal as you lean out.";
    default:
      return "Rounds out your protocol.";
  }
}

function buildAddOns(
  a: QuizAnswers,
  kind: "stack" | "single",
  primary?: QuizProduct,
): AddOn[] {
  const used = new Set<SinglesProductSlug>();
  if (kind === "single" && primary) used.add(primary.slug);
  if (kind === "stack") STACK_SLUGS.forEach((s) => used.add(s));

  const out: AddOn[] = [];
  for (const g of a.secondaryGoals) {
    const slug = GOAL_TO_SLUG[g];
    if (slug && !used.has(slug)) {
      out.push({ product: SINGLES[slug], reason: reasonForGoal(g) });
      used.add(slug);
    }
  }

  // Always give them at least one high-value, sensible add-on to consider.
  if (out.length === 0) {
    if (!used.has("ghk-cu")) {
      out.push({
        product: SINGLES["ghk-cu"],
        reason:
          "Finish the transformation — skin, hair and visible renewal as the fat comes off.",
      });
      used.add("ghk-cu");
    } else if (!used.has("bpc-tb500")) {
      out.push({
        product: SINGLES["bpc-tb500"],
        reason: "Protect your joints and recover faster through the protocol.",
      });
      used.add("bpc-tb500");
    }
  }

  return out.slice(0, 2);
}

function buildProjection(a: QuizAnswers, kind: "stack" | "single"): string {
  const goal = kind === "stack" ? "transformation" : a.primaryGoal;
  switch (goal) {
    case "fat-loss":
    case "transformation":
      return "Clients in your range routinely report ~1.5–2 lbs of fat loss per week — roughly 15–20 lbs over a single 10-week cycle.";
    case "muscle":
      return "Expect deeper, more restorative sleep within ~2 weeks and visible recovery and lean-mass gains by weeks 4–6.";
    case "recovery":
      return "Most report meaningful relief in nagging joints and faster training recovery within the first 2–3 weeks.";
    case "antiaging":
      return "Skin tone, texture and hair vitality typically improve visibly across an 8–12 week run.";
    default:
      return "Your coach dials the exact protocol to your body on day one.";
  }
}

function buildReasons(
  a: QuizAnswers,
  kind: "stack" | "single",
  primary?: QuizProduct,
): string[] {
  const reasons: string[] = [];
  const gm = goalMeta(a.primaryGoal);

  if (kind === "stack") {
    reasons.push(
      `You told us your focus is “${gm.label.toLowerCase()}” — the POWER CUT™ protocol synchronizes fat loss, lean muscle and recovery in one 10-week system.`,
    );
  } else if (primary) {
    reasons.push(
      `Your #1 goal is “${gm.label.toLowerCase()},” and ${primary.name} (${primary.tagline}) is the single most direct lever for it.`,
    );
  }

  if (a.experience === "new") {
    reasons.push(
      "Because you're new to peptides, every order includes 1-on-1 coaching and custom dosing — you'll never be guessing.",
    );
  } else {
    reasons.push(
      "You'll get custom dosing tailored to your stats plus 1-on-1 coaching to optimize every phase.",
    );
  }

  if (a.timeline === "event") {
    reasons.push(
      "With a hard deadline coming up, this is the fastest structured path to a visible change in time.",
    );
  } else if (a.timeline === "long-term") {
    reasons.push(
      "Since you're playing the long game, we've pre-selected the cycle length that compounds best over time.",
    );
  }

  return reasons;
}

export function buildRecommendation(a: QuizAnswers): Recommendation {
  const stack = wantsStack(a);

  if (stack) {
    return {
      kind: "stack",
      recommendedTier: recommendedTier(a),
      reasons: buildReasons(a, "stack"),
      addOns: buildAddOns(a, "stack"),
      projection: buildProjection(a, "stack"),
    };
  }

  const slug = GOAL_TO_SLUG[a.primaryGoal] ?? "retatrutide";
  const primary = SINGLES[slug];
  return {
    kind: "single",
    primary,
    recommendedTier: "single",
    reasons: buildReasons(a, "single", primary),
    addOns: buildAddOns(a, "single", primary),
    projection: buildProjection(a, "single"),
  };
}

/* ───────────────────────── Testimonial selection ──────────────────────── */

// Map a goal to the review categories most relevant to it (see content/reviews.ts).
export function reviewCategoriesForGoal(
  goal: Goal,
): ("fat-loss" | "food-noise" | "energy" | "mindset" | "strength")[] {
  switch (goal) {
    case "fat-loss":
      return ["fat-loss", "food-noise"];
    case "muscle":
      return ["strength", "energy"];
    case "recovery":
      return ["strength", "energy"];
    case "antiaging":
      return ["mindset", "fat-loss"];
    case "transformation":
    default:
      return ["fat-loss", "strength"];
  }
}
