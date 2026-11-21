// Black Friday stacks + the "build your stack" quiz logic. Pure data and
// functions (no React), shared by the sale landing page, the quiz, the stack
// pages, /buildyourstack and the POWER CUT™ thank-you add-on offer.

import { SINGLES, type QuizProduct } from "@/app/quiz/quizConfig";
import type { SinglesProductSlug } from "@/app/singles/cart/priceCatalog";
import { pctOff, salePctForLines } from "./sale";

export type ProductSlug = SinglesProductSlug;

/** Cart-ready product data (mirrors the /singles catalog + Stripe prices). */
export function product(slug: ProductSlug): QuizProduct {
  return SINGLES[slug];
}

/** Transparent / clean product shots for "what's inside" cards. */
export const PRODUCT_CUTOUT: Record<ProductSlug, string> = {
  retatrutide: "/reta-product-transparent-2.png",
  "cjc-ipamorelin": "/CJC%20Ipa%20Product%20Image%20Transparent%202.png",
  "bpc-tb500": "/BPC%20Tb%20Product%20Image%20Transparent%202.png",
  "ghk-cu": "/GHKCU.png",
  kpv: "/kpv-product-transparent.png",
  nad: "/bf/nad-cutout.webp",
};

export const SHORT_NAME: Record<ProductSlug, string> = {
  retatrutide: "Retatrutide",
  "cjc-ipamorelin": "CJC-1295/Ipamorelin Blend",
  "bpc-tb500": "BPC-157/TB-500 Blend",
  "ghk-cu": "GHK-Cu",
  kpv: "KPV",
  nad: "NAD+",
};

// ── Stacks ──────────────────────────────────────────────────────────────────
export type StackSlug =
  | "shred"
  | "build"
  | "radiance"
  | "limitless"
  | "foreverstrong"
  | "limitlessplus";

export type StackSize = {
  sets: number;
  label: string;
  supply: string;
  image: string;
};

export type StackDef = {
  slug: StackSlug;
  name: string;
  path: string;
  /** One-line promise used on cards and the quiz. */
  tagline: string;
  /** One vial of each per "set" (a 1× stack). */
  items: ProductSlug[];
  sizes: StackSize[];
  defaultSets: number;
  hero: string;
  /** Header photo per stack size (transparent); falls back to `hero`. */
  heroBySets?: Partial<Record<number, string>>;
  /** Size shown in the header/cards when no quiz size is given (default 1). */
  defaultHeroSets?: number;
  headline: [string, string];
  sub: string;
  roles: Partial<Record<ProductSlug, { role: string; body: string }>>;
  timeline: { week: string; body: string }[];
};

const P = (n: number, slug: string) => `/bf/${slug}-${n}.webp`;

export const STACKS: Record<StackSlug, StackDef> = {
  shred: {
    slug: "shred",
    name: "SHRED",
    path: "/shred",
    tagline: "Burn stubborn fat. Kill the food noise.",
    items: ["retatrutide"],
    sizes: [
      { sets: 1, label: "1 Vial", supply: "6–8 weeks", image: "/bf/shred-1-hero.webp" },
      { sets: 2, label: "2 Vials", supply: "12–16 weeks", image: "/bf/shred-2-hero.webp" },
      { sets: 3, label: "3 Vials", supply: "18–24 weeks", image: "/bf/shred-3-hero-v2.webp" },
    ],
    defaultSets: 2,
    hero: "/bf/shred-1-hero.webp",
    defaultHeroSets: 2,
    heroBySets: {
      1: "/bf/shred-1-hero.webp",
      2: "/bf/shred-2-hero.webp",
      3: "/bf/shred-3-hero-v2.webp",
    },
    headline: ["Melt The Fat.", "Silence The Food Noise."],
    sub: "The triple-agonist that turns appetite down and burn up — at the lowest price we've ever offered. Stock up for the whole cut.",
    roles: {
      retatrutide: {
        role: "The Engine",
        body: "GLP-1 / GIP / Glucagon triple agonist. Quiets food noise, raises metabolic output and drives stored-fat oxidation.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Food noise fades. Portions shrink without a fight." },
      { week: "Week 3 – 6", body: "The scale moves steadily; clothes start fitting differently." },
      { week: "Week 6 +", body: "Visible definition as stubborn fat keeps coming off." },
    ],
  },
  build: {
    slug: "build",
    name: "BUILD",
    path: "/build",
    tagline: "Add lean muscle. Recover like you're 25.",
    items: ["bpc-tb500", "cjc-ipamorelin"],
    sizes: [
      { sets: 1, label: "1× Stack", supply: "5 weeks", image: P(1, "build") },
      { sets: 2, label: "2× Stack", supply: "10 weeks", image: P(2, "build") },
      { sets: 3, label: "3× Stack", supply: "15 weeks", image: P(3, "build") },
    ],
    defaultSets: 2,
    hero: "/bf/build-hero-tight.webp",
    heroBySets: {
      2: "/bf/build-2-tight.webp",
      3: "/bf/build-3-tight.webp",
    },
    headline: ["Build Lean Muscle.", "Recover Faster Than Ever."],
    sub: "Amplify your natural growth-hormone pulse and bulletproof your joints — so you can train harder, more often, and actually keep the gains.",
    roles: {
      "cjc-ipamorelin": {
        role: "The Architect",
        body: "Amplifies your natural GH pulse for lean muscle, deeper sleep and better body composition.",
      },
      "bpc-tb500": {
        role: "The Shield",
        body: "Local + systemic repair for joints, tendons and connective tissue so you can keep training hard.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Deeper sleep and less soreness between sessions." },
      { week: "Week 3 – 6", body: "Better pumps, faster bounce-back and joints that stop nagging." },
      { week: "Week 6 +", body: "Leaner, fuller look as recovery lets you train harder, more often." },
    ],
  },
  radiance: {
    slug: "radiance",
    name: "RADIANCE",
    path: "/radiance",
    tagline: "Glowing skin. A calm, healthy gut.",
    items: ["bpc-tb500", "kpv", "ghk-cu"],
    sizes: [
      { sets: 1, label: "1× Stack", supply: "5 weeks", image: "/recovery-stack-hero.png" },
      { sets: 2, label: "2× Stack", supply: "10 weeks", image: P(2, "radiance") },
      { sets: 3, label: "3× Stack", supply: "15 weeks", image: P(3, "radiance") },
    ],
    defaultSets: 2,
    hero: "/recovery-stack-hero.png",
    heroBySets: {
      2: "/bf/radiance-2-tight.webp",
      3: "/bf/radiance-3-tight.webp",
    },
    headline: ["Glow From The Inside Out.", "Skin, Gut & Recovery."],
    sub: "Three repair peptides for radiant, firmer-looking skin, a calmer gut and a body that bounces back. The glow-up stack — at our biggest discount ever.",
    roles: {
      "ghk-cu": {
        role: "The Glow",
        body: "Copper-peptide signaling for skin quality, firmness, hair vitality and visible renewal.",
      },
      kpv: {
        role: "The Calm",
        body: "Anti-inflammatory signaling that supports a healthy gut lining, clearer skin and a balanced immune response.",
      },
      "bpc-tb500": {
        role: "The Repair",
        body: "Gut and tissue repair from the inside out — the foundation the glow is built on.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Digestion settles and bloating calms down." },
      { week: "Week 3 – 5", body: "Skin looks clearer and more even; recovery feels easier." },
      { week: "Week 5 – 10", body: "Firmer, brighter-looking skin and healthier-looking hair." },
    ],
  },
  limitless: {
    slug: "limitless",
    name: "LIMITLESS",
    path: "/limitless",
    tagline: "All-day energy. Laser focus.",
    items: ["nad", "bpc-tb500"],
    sizes: [
      { sets: 1, label: "1× Stack", supply: "5 weeks", image: P(1, "limitless") },
      { sets: 2, label: "2× Stack", supply: "10 weeks", image: P(2, "limitless") },
      { sets: 3, label: "3× Stack", supply: "15 weeks", image: P(3, "limitless") },
    ],
    defaultSets: 2,
    hero: "/bf/limitless-hero-tight.webp",
    heroBySets: {
      2: "/bf/limitless-2-tight.webp",
      3: "/bf/limitless-3-tight.webp",
    },
    headline: ["Limitless Energy.", "Laser-Sharp Focus."],
    sub: "Refuel your cells at the source and recover like a machine. Ditch the afternoon crash and the brain fog for good.",
    roles: {
      nad: {
        role: "The Catalyst",
        body: "Cellular energy at the source — fuels mitochondria, mental clarity and healthy aging.",
      },
      "bpc-tb500": {
        role: "The Shield",
        body: "Systemic repair that keeps the body recovering so the energy goes where you want it.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Steadier energy and fewer afternoon crashes." },
      { week: "Week 3 – 5", body: "Sharper focus and faster recovery from long days." },
      { week: "Week 5 – 10", body: "Sustained drive that feels like your baseline, not a buzz." },
    ],
  },
  foreverstrong: {
    slug: "foreverstrong",
    name: "FOREVER STRONG",
    path: "/foreverstrong",
    tagline: "Lean muscle, bulletproof joints, a healthy gut.",
    items: ["bpc-tb500", "cjc-ipamorelin", "kpv"],
    sizes: [
      { sets: 1, label: "1× Stack", supply: "5 weeks", image: P(1, "foreverstrong") },
      { sets: 2, label: "2× Stack", supply: "10 weeks", image: P(2, "foreverstrong") },
      { sets: 3, label: "3× Stack", supply: "15 weeks", image: "/bf/foreverstrong-3-v2.webp" },
    ],
    defaultSets: 2,
    hero: "/bf/foreverstrong-hero-tight.webp",
    heroBySets: {
      2: "/bf/foreverstrong-2-tight.webp",
      3: "/bf/foreverstrong-3-v2-tight.webp",
    },
    headline: ["Get Strong.", "Stay Strong. Forever."],
    sub: "Build lean muscle, bulletproof your joints and fix your gut from the inside out. The longevity stack for people who plan to stay strong for decades.",
    roles: {
      "cjc-ipamorelin": {
        role: "The Architect",
        body: "Amplifies your natural GH pulse for lean muscle, deeper sleep and better body composition.",
      },
      "bpc-tb500": {
        role: "The Shield",
        body: "Joint, tendon and gut repair so you can keep training — and keep feeling good.",
      },
      kpv: {
        role: "The Regulator",
        body: "Calms inflammation and supports a healthy gut lining for recovery from the inside out.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Deeper sleep, calmer digestion, less soreness." },
      { week: "Week 3 – 6", body: "Joints quiet down and recovery between sessions speeds up." },
      { week: "Week 6 +", body: "Leaner, stronger and more resilient — the compounding kicks in." },
    ],
  },
  limitlessplus: {
    slug: "limitlessplus",
    name: "LIMITLESS+",
    path: "/limitlessplus",
    tagline: "Limitless energy plus a healthy, calm gut.",
    items: ["nad", "bpc-tb500", "kpv"],
    sizes: [
      { sets: 1, label: "1× Stack", supply: "5 weeks", image: P(1, "limitlessplus") },
      { sets: 2, label: "2× Stack", supply: "10 weeks", image: P(2, "limitlessplus") },
      { sets: 3, label: "3× Stack", supply: "15 weeks", image: P(3, "limitlessplus") },
    ],
    defaultSets: 2,
    hero: "/bf/limitlessplus-hero-tight.webp",
    heroBySets: {
      2: "/bf/limitlessplus-2-tight.webp",
      3: "/bf/limitlessplus-3-tight.webp",
    },
    headline: ["Limitless Energy.", "A Gut That Keeps Up."],
    sub: "Cellular energy, sharp focus and a calm, healthy gut — because you can't feel limitless when your gut is holding you back.",
    roles: {
      nad: {
        role: "The Catalyst",
        body: "Cellular energy at the source — fuels mitochondria, mental clarity and healthy aging.",
      },
      "bpc-tb500": {
        role: "The Repair",
        body: "Gut and tissue repair that keeps your system running clean.",
      },
      kpv: {
        role: "The Calm",
        body: "Anti-inflammatory gut support for less bloat and steadier energy.",
      },
    },
    timeline: [
      { week: "Week 1 – 2", body: "Steadier energy, calmer digestion, less bloat." },
      { week: "Week 3 – 5", body: "Sharper focus and fewer crashes as the gut settles." },
      { week: "Week 5 – 10", body: "Sustained energy that feels like your new normal." },
    ],
  },
};

export const STACK_ORDER: StackSlug[] = [
  "shred",
  "build",
  "radiance",
  "limitless",
  "foreverstrong",
  "limitlessplus",
];

// ── Add-ons (quiz question 2) ───────────────────────────────────────────────
export type AddonKey = "lean" | "muscle" | "skin" | "gut" | "energy";

export const ADDONS: Record<
  AddonKey,
  { label: string; tag: string; products: ProductSlug[]; emoji: string }
> = {
  lean: { label: "Getting leaner and more defined", tag: "LEAN", products: ["retatrutide"], emoji: "🔥" },
  muscle: { label: "Strength and muscle tone", tag: "MUSCLE TONE", products: ["cjc-ipamorelin"], emoji: "💪" },
  skin: { label: "Radiant, glowing skin", tag: "GLOW", products: ["ghk-cu"], emoji: "✨" },
  gut: { label: "Gut health and recovery", tag: "GUT & RECOVERY", products: ["kpv", "bpc-tb500"], emoji: "🌿" },
  energy: { label: "Energy, focus and drive", tag: "ENERGY", products: ["nad"], emoji: "⚡" },
};


/**
 * How long `vials` of a product last: 1 vial = 5 weeks for everything except
 * Retatrutide (6–8 weeks per vial).
 */
export function supplyFor(slug: ProductSlug, vials: number): string {
  return slug === "retatrutide"
    ? `${6 * vials}–${8 * vials} weeks`
    : `${5 * vials} weeks`;
}

export function isAddonKey(v: unknown): v is AddonKey {
  return typeof v === "string" && v in ADDONS;
}

/** The add-on's products that aren't already in the stack. */
export function addonProducts(addon: AddonKey, items: ProductSlug[]): ProductSlug[] {
  return ADDONS[addon].products.filter((p) => !items.includes(p));
}

// ── Pricing helpers ─────────────────────────────────────────────────────────
export type Line = { slug: ProductSlug; quantity: number };

export function linesFor(items: ProductSlug[], sets: number, extra: ProductSlug[] = []): Line[] {
  return [...items, ...extra].map((slug) => ({ slug, quantity: sets }));
}

export function priceLines(lines: Line[], saleLive = true) {
  const full = lines.reduce((n, l) => n + product(l.slug).priceCents * l.quantity, 0);
  const pct = saleLive
    ? salePctForLines(lines.map((l) => ({ priceId: product(l.slug).priceId, quantity: l.quantity })))
    : 0;
  const price = pctOff(full, pct);
  return { full, price, saves: full - price, pct, vials: lines.reduce((n, l) => n + l.quantity, 0) };
}

/** Cheapest size of a stack, for "from $X" lines. */
export function stackFromPrice(stack: StackDef) {
  return priceLines(linesFor(stack.items, stack.sizes[0].sets));
}

// ── Quiz ────────────────────────────────────────────────────────────────────
export type Goal = "fat" | "muscle" | "both" | "glow" | "energy";

export const GOALS: { key: Goal; label: string; emoji: string; blurb: string }[] = [
  { key: "fat", label: "Burn fat", emoji: "🔥", blurb: "Lose stubborn fat and kill the food noise" },
  { key: "muscle", label: "Build lean muscle", emoji: "💪", blurb: "Add lean mass and recover faster" },
  { key: "both", label: "Burn fat and build lean muscle", emoji: "⚡", blurb: "The full recomposition" },
  { key: "glow", label: "Radiant skin and a healthy gut", emoji: "✨", blurb: "Glow from the inside out" },
  { key: "energy", label: "Limitless energy and focus", emoji: "🧠", blurb: "All-day energy, zero brain fog" },
];

/** Follow-up "how much" options shown on the same screen (1/2/3 stacks). */
export const SIZE_QUESTION: Partial<Record<Goal, { q: string; options: string[] }>> = {
  fat: { q: "How much do you want to lose?", options: ["Up to 10 lbs", "11–20 lbs", "21+ lbs"] },
  muscle: { q: "How much lean muscle do you want to build?", options: ["Up to 5 lbs", "6–9 lbs", "10+ lbs"] },
  both: { q: "How much fat do you want to lose?", options: ["Up to 18 lbs", "19–36 lbs", "37+ lbs"] },
};

/** Question 2 options for each goal (things the core stack doesn't cover). */
export const EXTRA_OPTIONS: Record<Goal, AddonKey[]> = {
  fat: ["muscle", "skin", "gut", "energy"],
  muscle: ["lean", "skin", "gut", "energy"],
  both: ["skin", "gut", "energy"],
  glow: ["lean", "muscle", "energy"],
  energy: ["lean", "muscle", "skin", "gut"],
};

export type QuizResult =
  | { kind: "powercut"; tier: 1 | 2 | 3; addon: AddonKey | null }
  | { kind: "stack"; slug: StackSlug; sets: number | null; addon: AddonKey | null };

export function resolveQuiz(goal: Goal, size: number | null, extra: AddonKey | null): QuizResult {
  const tier = (Math.min(3, Math.max(1, size ?? 1)) as 1 | 2 | 3);
  switch (goal) {
    case "fat":
      if (extra === "muscle") return { kind: "powercut", tier, addon: null };
      return { kind: "stack", slug: "shred", sets: tier, addon: extra };
    case "muscle":
      if (extra === "lean") return { kind: "powercut", tier, addon: null };
      if (extra === "gut") return { kind: "stack", slug: "foreverstrong", sets: tier, addon: null };
      return { kind: "stack", slug: "build", sets: tier, addon: extra };
    case "both":
      return { kind: "powercut", tier, addon: extra };
    case "glow":
      return { kind: "stack", slug: "radiance", sets: null, addon: extra };
    case "energy":
      if (extra === "gut") return { kind: "stack", slug: "limitlessplus", sets: null, addon: null };
      return { kind: "stack", slug: "limitless", sets: null, addon: extra };
  }
}

/** Where a quiz result lands. */
export function quizResultHref(r: QuizResult): string {
  if (r.kind === "powercut") {
    const q = new URLSearchParams({ quiz: "1", tier: String(r.tier) });
    if (r.addon) q.set("addon", r.addon);
    return `/powercutsale?${q.toString()}`;
  }
  const q = new URLSearchParams({ quiz: "1" });
  if (r.sets) q.set("sets", String(r.sets));
  if (r.addon) q.set("addon", r.addon);
  return `${STACKS[r.slug].path}?${q.toString()}`;
}

// ── POWER CUT™ add-on offer (thank-you page) ────────────────────────────────
/** Remembered so the POWER CUT thank-you page can lead with their pick. */
export const PC_ADDON_STORAGE_KEY = "ps_pc_addon";
export const PC_ADDON_PICKS: { slug: ProductSlug; label: string }[] = [
  { slug: "ghk-cu", label: "Radiant skin" },
  { slug: "nad", label: "Energy & focus" },
  { slug: "kpv", label: "Gut health" },
];

// ── Members-only gate (research-access visitors who skipped sign-up) ────────
export const BF_GATE_STORAGE_KEY = "ps_bf_gate";
