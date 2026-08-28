// Quiz data model + recommendation engine for the /quiz split-test funnel.
//
// This module is pure (no React, no side effects) so the recommendation and
// archetype logic can be reasoned about and tested in isolation. The quiz UI
// (QuizExperience.tsx) collects `QuizAnswers` through a deliberately sequenced
// set of *functional* questions — positive → neutral → problem → a
// pressure-release choice — designed to build intent, not just identify the
// visitor. `buildRecommendation` turns those answers into a `Recommendation`
// (product pick + a diagnostic archetype) the results page renders.
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

export type Goal =
  | "fat-loss"
  | "muscle"
  | "recovery"
  | "antiaging"
  | "transformation";
export type Experience = "new" | "some" | "experienced";
export type AgeRange = "21-29" | "30-39" | "40-49" | "50+";
export type Timeline = "event" | "10-weeks" | "long-term";
export type Struggle = "fat" | "recovery" | "aging";
export type StartPreference = "protocol" | "single" | "unsure";

export interface QuizAnswers {
  primaryGoal: Goal;
  secondaryGoals: Goal[];
  experience: Experience;
  age: AgeRange;
  weight: number;
  timeline: Timeline;
  /** "Lately, my body…" — the bridge into the problem state; drives archetype. */
  struggle: Struggle;
  /** "What frustrates me most is…" — free text or a preset label. */
  frustration: string;
  /** "What would you like instead?" — the pressure-release routing choice. */
  startPreference: StartPreference;
}

/* ─────────────────────────── Goal presentation ─────────────────────────── */

export interface GoalMeta {
  key: Goal;
  emoji: string;
  /** Short label used in results copy, e.g. "lose fat". */
  label: string;
  /** One-line description for option buttons. */
  blurb: string;
  /** "I want" completion used on the opening (positive) question. */
  want: string;
}

export const PRIMARY_GOALS: GoalMeta[] = [
  {
    key: "fat-loss",
    emoji: "🔥",
    label: "Lose fat",
    blurb: "Strip stubborn body fat and lean out",
    want: "To finally get lean and see real definition",
  },
  {
    key: "muscle",
    emoji: "💪",
    label: "Build lean muscle",
    blurb: "Add lean mass, strength and better sleep",
    want: "To build a strong, athletic body",
  },
  {
    key: "recovery",
    emoji: "🧠",
    label: "Recover & heal",
    blurb: "Bounce back from training, joints and injuries",
    want: "To recover, heal and feel young again",
  },
  {
    key: "antiaging",
    emoji: "✨",
    label: "Look younger",
    blurb: "Skin, hair and visible tissue renewal",
    want: "To look younger — skin, hair and vitality",
  },
  {
    key: "transformation",
    emoji: "⚡",
    label: "Total transformation",
    blurb: "Fat loss + muscle + recovery, all at once",
    want: "To completely transform how I look and feel",
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
  kpv: {
    slug: "kpv",
    priceId: SINGLES_PRICE_IDS.kpv,
    name: "KPV",
    dose: "10mg",
    price: "$65",
    priceCents: 6500,
    image: "/kpv-product.png",
    tagline: "The Regulator",
    blurb:
      "Anti-inflammatory peptide signaling. Helps regulate inflammatory pathways, supports gut and skin health, and promotes a balanced immune response.",
  },
  nad: {
    slug: "nad",
    priceId: SINGLES_PRICE_IDS.nad,
    name: "NAD+",
    dose: "500mg",
    price: "$135",
    priceCents: 13500,
    image: "/NAD Vial Brown.png",
    tagline: "The Catalyst",
    blurb:
      "Cellular energy and metabolic support. Fuels energy production, cellular repair and healthy mitochondrial function for recovery and healthy aging.",
  },
};

const GOAL_TO_SLUG: Record<Goal, SinglesProductSlug | null> = {
  "fat-loss": "retatrutide",
  muscle: "cjc-ipamorelin",
  recovery: "bpc-tb500",
  antiaging: "ghk-cu",
  transformation: null,
};

const STACK_SLUGS: SinglesProductSlug[] = [
  "retatrutide",
  "cjc-ipamorelin",
  "bpc-tb500",
];

/* ──────────────────────────── Diagnostic archetypes ─────────────────────── */
//
// The "reveal" on the results page. Each archetype gives the visitor a named
// type, then explains the honest biological *mechanism* behind their problem —
// no shame, all situation + science — before flipping to the solution. This is
// the bad-news → mechanism → good-news contrast that makes the recommendation
// land. Copy is intentionally editable in one place.

export type ArchetypeKey =
  | "stalled-cutter"
  | "plateaued-builder"
  | "worn-down-athlete"
  | "reset-seeker"
  | "total-transformer";

export interface Archetype {
  key: ArchetypeKey;
  label: string;
  /** Rapport + "you're not alone" comfort line. */
  comfort: string;
  /** The "here's the hard part" bad-news line that continues the problem state. */
  badNews: string;
  /** The honest mechanism — why the problem keeps happening. */
  mechanism: string;
  /** The flip into the solution (leads into the recommendation). */
  goodNews: string;
}

export const ARCHETYPES: Record<ArchetypeKey, Archetype> = {
  "stalled-cutter": {
    key: "stalled-cutter",
    label: "The Stalled Cutter",
    comfort:
      "You're far from alone — this is the single most common pattern we see, and almost everyone who takes this quiz describes it exactly the way you just did.",
    badNews:
      "Here's what almost no one tells you: the harder you've dieted, the more your body has learned to fight you back.",
    mechanism:
      "It isn't willpower. In a deficit your hunger hormones climb, “food noise” gets louder, and your metabolism quietly downshifts to burn less — so the exact effort that used to work stops working. You're not failing the plan; the plan is working against your biology.",
    goodNews:
      "The good news: that loop is breakable. Your protocol is built to quiet food noise and restore your metabolic output — so effort finally shows up on the scale again.",
  },
  "plateaued-builder": {
    key: "plateaued-builder",
    label: "The Plateaued Builder",
    comfort:
      "You're in good company — a lot of people who train hard hit this exact wall and can't figure out why.",
    badNews:
      "Here's the part that's rarely explained: past your mid-20s, the signal telling your body to grow gets quieter every year.",
    mechanism:
      "It isn't your effort. Your natural growth-hormone pulse declines with age and recovery becomes the real ceiling on new muscle — you train hard, but the “build” signal is muted and you recover too slowly to compound it.",
    goodNews:
      "The good news: that signal can be amplified. Your protocol is built to restore your GH pulse and recovery so the work you're already doing actually turns into muscle.",
  },
  "worn-down-athlete": {
    key: "worn-down-athlete",
    label: "The Worn-Down Athlete",
    comfort:
      "You're not alone, and you're not soft — the hardest-training people are usually the ones who feel this first.",
    badNews:
      "Here's what usually gets missed: your recovery debt has been compounding faster than your body can clear it.",
    mechanism:
      "It isn't that you're training wrong. As you age, micro-injuries and inflammation accumulate faster than your body repairs them, so nagging joints and slow recovery pile up and quietly cap everything else you're trying to do.",
    goodNews:
      "The good news: repair can be accelerated. Your protocol is built to speed connective-tissue recovery and clear the inflammatory drag holding you back.",
  },
  "reset-seeker": {
    key: "reset-seeker",
    label: "The Reset Seeker",
    comfort:
      "You're not alone — this is one of the most common things people quietly want and rarely say out loud.",
    badNews:
      "Here's what's really going on under the surface: your body's renewal signals slow down with age.",
    mechanism:
      "It isn't only genetics. Collagen production and copper-peptide signaling decline over time, so skin quality, hair vitality and tissue renewal all lose a step — gradually, then noticeably.",
    goodNews:
      "The good news: those signals can be switched back on. Your protocol is built to support visible renewal from the inside out.",
  },
  "total-transformer": {
    key: "total-transformer",
    label: "The Total Transformer",
    comfort:
      "You're not alone — wanting all of it at once is more common than people admit, and it's completely doable with the right system.",
    badNews:
      "Here's the catch most people run into: chasing fat loss, muscle and recovery separately means they end up fighting each other.",
    mechanism:
      "It isn't a lack of discipline. Dieting kills recovery, hard training stalls fat loss, and aging drops the hormones that drive all three — run in isolation, each goal quietly sabotages the others.",
    goodNews:
      "The good news: synchronized, they compound instead of competing. The POWER CUT™ protocol is built to run fat loss, muscle and recovery as one 10-week system.",
  },
};

function archetypeFor(a: QuizAnswers, kind: "stack" | "single"): Archetype {
  if (kind === "stack" && a.primaryGoal === "transformation") {
    return ARCHETYPES["total-transformer"];
  }
  switch (a.primaryGoal) {
    case "fat-loss":
      return ARCHETYPES["stalled-cutter"];
    case "muscle":
      return ARCHETYPES["plateaued-builder"];
    case "recovery":
      return ARCHETYPES["worn-down-athlete"];
    case "antiaging":
      return ARCHETYPES["reset-seeker"];
    case "transformation":
    default:
      return ARCHETYPES["total-transformer"];
  }
}

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
  /** The diagnostic reveal shown before the solution. */
  archetype: Archetype;
  /** "Why this is right for you" bullets, generated from the answers. */
  reasons: string[];
  /** Contextual single-vial upsells drawn from secondary goals. */
  addOns: AddOn[];
  /** One-line, goal-specific expectation shown as the "projection". */
  projection: string;
  /**
   * For stack recommendations only: the single best-fit vial to offer as a
   * "not ready for the full stack? start here instead" hand-off to /singles.
   * (Stacks and singles use separate Stripe accounts, so a stack buyer can't
   * add a single to the same cart — we send them to the singles funnel.)
   */
  downsellSingle?: QuizProduct;
}

/* ────────────────────────── Recommendation engine ──────────────────────── */

function wantsStack(a: QuizAnswers): boolean {
  // An explicit "focused start" always wins — never override the user.
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

// Contextual single-vial suggestions for KPV + NAD+. These don't map to a quiz
// goal (they're supportive compounds), so they're surfaced from the primary
// goal + age instead: NAD+ for recovery / anti-aging / 40+, KPV for recovery /
// anti-aging (inflammation, gut, skin).
function contextualSingles(
  a: QuizAnswers,
): { slug: SinglesProductSlug; reason: string }[] {
  const out: { slug: SinglesProductSlug; reason: string }[] = [];
  const is40plus = a.age === "40-49" || a.age === "50+";

  if (a.primaryGoal === "recovery") {
    out.push({
      slug: "nad",
      reason: "Fuels the cellular energy and repair that power real recovery.",
    });
  } else if (a.primaryGoal === "antiaging") {
    out.push({
      slug: "nad",
      reason: "Cellular energy and mitochondrial support for healthy aging.",
    });
  } else if (is40plus) {
    out.push({
      slug: "nad",
      reason: "Restores the cellular energy that naturally declines with age.",
    });
  }

  if (a.primaryGoal === "recovery") {
    out.push({
      slug: "kpv",
      reason: "Calms the inflammation that quietly slows your recovery.",
    });
  } else if (a.primaryGoal === "antiaging") {
    out.push({
      slug: "kpv",
      reason: "Supports gut and skin health from the inside out.",
    });
  }

  return out;
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

  // KPV / NAD+ are single-only (they can't share a cart with the stack), so we
  // only surface them for single-vial recommendations, after any secondary-goal
  // add-ons and within the 2-item cap.
  if (kind === "single") {
    for (const c of contextualSingles(a)) {
      if (out.length >= 2) break;
      if (!used.has(c.slug)) {
        out.push({ product: SINGLES[c.slug], reason: c.reason });
        used.add(c.slug);
      }
    }
  }

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

// Personalized fat-loss estimate from their weight + timeline. Uses the same
// ~1.5–2 lbs/week the site already cites, then caps the upper bound at ~15% of
// bodyweight so it never over-promises for lighter clients.
function fatLossRange(weight: number, weeks: number): { lo: number; hi: number } {
  const cap = Math.max(8, Math.round(weight * 0.15));
  const hi = Math.min(Math.round(weeks * 2), cap);
  const lo = Math.min(
    Math.max(Math.round(hi * 0.7), Math.round(weeks * 1.2)),
    hi - 1,
  );
  return { lo, hi };
}

function buildProjection(a: QuizAnswers, kind: "stack" | "single"): string {
  const goal = kind === "stack" ? "transformation" : a.primaryGoal;

  if (goal === "fat-loss" || goal === "transformation") {
    const weeks = a.timeline === "long-term" ? 20 : 10;
    const { lo, hi } = fatLossRange(a.weight, weeks);
    const byPhrase =
      a.timeline === "event"
        ? "before your event"
        : a.timeline === "long-term"
          ? "across your first two 10-week cycles"
          : "over your first 10-week cycle";
    return `Starting around ${a.weight} lbs, at the ~1.5–2 lbs/week clients in your range report, that's roughly ${lo}–${hi} lbs ${byPhrase}.`;
  }

  switch (goal) {
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
      `You told us what you want most is “${gm.want.toLowerCase()}” — the POWER CUT™ protocol synchronizes fat loss, lean muscle and recovery in one 10-week system.`,
    );
  } else if (primary) {
    reasons.push(
      `What you want most is “${gm.want.toLowerCase()},” and ${primary.name} (${primary.tagline}) is the single most direct lever for it.`,
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
      "With a deadline coming up, this is the fastest structured path to a visible change in time.",
    );
  } else if (a.timeline === "long-term") {
    reasons.push(
      "Since you're in it for the long haul, we've pre-selected the cycle length that compounds best over time.",
    );
  }

  return reasons;
}

export function buildRecommendation(a: QuizAnswers): Recommendation {
  const stack = wantsStack(a);

  if (stack) {
    // The vial that best matches their primary goal — Retatrutide (the
    // metabolic engine) for the broad transformation/fat-loss goals.
    const downsellSlug = GOAL_TO_SLUG[a.primaryGoal] ?? "retatrutide";
    return {
      kind: "stack",
      recommendedTier: recommendedTier(a),
      archetype: archetypeFor(a, "stack"),
      reasons: buildReasons(a, "stack"),
      addOns: buildAddOns(a, "stack"),
      projection: buildProjection(a, "stack"),
      downsellSingle: SINGLES[downsellSlug],
    };
  }

  const slug = GOAL_TO_SLUG[a.primaryGoal] ?? "retatrutide";
  const primary = SINGLES[slug];
  return {
    kind: "single",
    primary,
    recommendedTier: "single",
    archetype: archetypeFor(a, "single"),
    reasons: buildReasons(a, "single", primary),
    addOns: buildAddOns(a, "single", primary),
    projection: buildProjection(a, "single"),
  };
}

/* ───────────────────────── Testimonial selection ──────────────────────── */

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
