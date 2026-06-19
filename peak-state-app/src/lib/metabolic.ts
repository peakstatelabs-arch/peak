// Peak State Labs — Metabolic Type system
// Source: Drew DeOrsey Metabolic Type Quiz + Instruction Sheet.

export type MetabolicType = "polar" | "equatorial" | "variable";

export type QuizChoice = "a" | "b" | "both" | "skip";

export type QuizQuestion = {
  id: number;
  prompt: string;
  a: string;
  b: string;
};

export const QUIZ: QuizQuestion[] = [
  { id: 1, prompt: "I sleep best if:", a: "I eat a snack high in protein and fat 1–2 hours before going to sleep.", b: "I eat a snack higher in carbohydrates 3–4 hours before going to sleep." },
  { id: 2, prompt: "I sleep best if:", a: "My dinner is mainly meat with some vegetables or other carbs.", b: "My dinner is mainly vegetables/carbs with a small serving of meat." },
  { id: 3, prompt: "I sleep best and wake up rested:", a: "If I don't eat sweet desserts like cake, candy or cookies.", b: "If I occasionally eat a sweet dessert before bed." },
  { id: 4, prompt: "After vigorous exercise, I feel best consuming:", a: "Higher protein and/or fat, such as a high-protein shake.", b: "Higher carbohydrate (sweeter), such as fruit or fruit juice." },
  { id: 5, prompt: "I keep mental clarity for up to 4 hours after eating:", a: "A meat-based meal with heavier meats (chicken legs, roast beef, salmon) + small carbs.", b: "A carb-based meal (veg, bread, rice) + small portion of light meat." },
  { id: 6, prompt: "If I'm tired and eat sugar/sweets by themselves:", a: "I get a rush, then crash and feel sluggish.", b: "I feel better and my energy is restored until my next meal." },
  { id: 7, prompt: "My attitude toward food:", a: "I love food and live to eat.", b: "I don't fuss over food — I eat to live." },
  { id: 8, prompt: "I often:", a: "Add salt to my foods.", b: "Find foods are too salty for my liking." },
  { id: 9, prompt: "Naturally, I prefer to eat:", a: "Dark meat (chicken/turkey legs and thighs).", b: "Light meat (chicken/turkey breast)." },
  { id: 10, prompt: "Which fish appeals to you most?", a: "Salmon, scallops, shrimp, crab, lobster.", b: "Cod, flounder, haddock, perch." },
  { id: 11, prompt: "With dairy, I feel best after:", a: "Richer, full-fat yogurts, cheeses or desserts.", b: "Lighter, low-fat yogurts, cheeses or desserts." },
  { id: 12, prompt: "With snacking:", a: "I do better snacking between meals / eating smaller meals more often.", b: "I last between meals without snacking." },
  { id: 13, prompt: "I prefer to start my day with:", a: "A large breakfast with protein and fat (eggs with sausage or bacon).", b: "A light breakfast (cereal, fruit, yogurt, bread, maybe eggs)." },
  { id: 14, prompt: "Which best describes you:", a: "I digest food well, like proteins and fats, gain muscle/strength easily.", b: "I'm limber, prefer light meats and lower-fat foods, lean toward endurance." },
];

export type QuizResult = {
  type: MetabolicType;
  countA: number;
  countB: number;
};

export function scoreQuiz(answers: Record<number, QuizChoice>): QuizResult {
  let countA = 0;
  let countB = 0;
  for (const q of QUIZ) {
    const ans = answers[q.id];
    if (ans === "a") countA++;
    else if (ans === "b") countB++;
    else if (ans === "both") { countA++; countB++; }
  }
  let type: MetabolicType;
  if (countA >= countB + 3) type = "polar";
  else if (countB >= countA + 3) type = "equatorial";
  else type = "variable";
  return { type, countA, countB };
}

export type TypeInfo = {
  key: MetabolicType;
  name: string;
  tagline: string;
  split: { protein: number; carbs: number; fat: number }; // percentages summing ~100
  summary: string;
  tips: string[];
  proteins: string[];
  carbs: string[];
  fats: string[];
  accent: string; // tailwind text color
};

export const TYPE_INFO: Record<MetabolicType, TypeInfo> = {
  polar: {
    key: "polar",
    name: "Polar Type",
    tagline: "You live to eat — and you run on protein and fat.",
    split: { protein: 45, carbs: 35, fat: 20 },
    accent: "text-sky-300",
    summary:
      "Polar types burn through carbohydrates quickly and can go hypoglycemic without enough fat and protein. Eat protein and fat at every meal to slow carb digestion — you'll have steadier energy, better sleep, and an easier time staying lean.",
    tips: [
      "Build every meal around a protein from the dark-meat / rich-seafood list.",
      "A protein + fat snack 1–2 hours before bed helps you sleep and wake rested.",
      "Avoid sugar and '-ose' foods alone — always pair carbs with fat and protein.",
      "Be wary of performance bars/drinks; they spike then crash you.",
      "If burning body fat, smaller balanced meals more often tends to work best.",
    ],
    proteins: ["Dark chicken", "Dark turkey", "Beef", "Lamb", "Pork chops", "Bacon", "Duck", "Organ meats", "Salmon", "Mackerel", "Sardines", "Anchovy", "Herring", "Mussels", "Oyster", "Crab", "Lobster", "Shrimp", "Eggs", "Full-fat dairy"],
    carbs: ["Asparagus", "Cauliflower", "Celery", "Mushroom", "Spinach", "Leafy greens", "Artichoke", "Carrot", "Peas", "Squash", "Whole grains (brown rice, quinoa, oats)", "Apple", "Avocado", "Pears", "Banana"],
    fats: ["Butter", "Cream", "Ghee", "Olive oil", "Coconut", "Walnut", "Pecan", "Almond", "Cashew", "Macadamia", "Pumpkin seed", "Sesame"],
  },
  equatorial: {
    key: "equatorial",
    name: "Equatorial Type",
    tagline: "You eat to live — and you thrive on quality carbs.",
    split: { protein: 20, carbs: 70, fat: 10 },
    accent: "text-emerald-300",
    summary:
      "Equatorial types don't efficiently metabolize fats and proteins when eaten alone. Lean on a larger proportion of nutrient-dense carbohydrates (root veg, whole grains) balanced with leaner proteins. You often do well on fewer meals — don't let others pressure you to eat against your instincts.",
    tips: [
      "Anchor meals with nutrient-dense carbs — root vegetables and whole grains.",
      "Choose light meats and lean fish; keep added fats minimal.",
      "No junk carbs — quality whole-food carbohydrates only.",
      "Fewer, larger meals often suit you better than constant snacking.",
      "Use oils, butter and nuts sparingly.",
    ],
    proteins: ["Chicken breast", "Turkey breast", "Lean pork", "Cod", "Flounder", "Haddock", "Halibut", "Perch", "Sole", "Trout", "White tuna", "Low/non-fat dairy", "Cottage cheese", "Kefir", "Eggs", "Lentils", "Dried beans", "Tofu", "Tempeh"],
    carbs: ["Sweet potato", "Yam", "Potato", "Pumpkin", "Beet", "Parsnip", "Rutabaga", "Brown rice", "Quinoa", "Oats", "Barley", "Buckwheat", "Whole/sprouted grain bread", "Broccoli", "Cabbage", "Kale", "All berries", "Apple", "Citrus", "Melon", "Pineapple"],
    fats: ["Olive oil (sparingly)", "Flax oil", "Small amounts of nuts/seeds"],
  },
  variable: {
    key: "variable",
    name: "Variable Type",
    tagline: "You're adaptable — your needs shift with life.",
    split: { protein: 40, carbs: 50, fat: 10 },
    accent: "text-fuchsia-300",
    summary:
      "Variable types oscillate between Polar and Equatorial depending on activity, stress, and season — meal to meal or month to month. Start balanced (roughly half protein/fat, half carbs) and adjust toward whichever plan makes you feel best in the moment.",
    tips: [
      "Start each meal roughly balanced: protein + fat on one side, quality carbs on the other.",
      "Read both the Polar and Equatorial tips — you'll swing between them.",
      "Let energy, sleep, and hunger guide which way you lean that week.",
      "Retest your type every couple of months — it commonly changes as you get healthier.",
    ],
    proteins: ["Chicken (any)", "Turkey", "Lean beef", "Salmon", "Tuna", "Shrimp", "Eggs", "Greek yogurt", "Cottage cheese", "Legumes", "Tofu"],
    carbs: ["Sweet potato", "Brown rice", "Quinoa", "Oats", "Whole grain bread", "Broccoli", "Leafy greens", "Berries", "Apple", "Banana"],
    fats: ["Olive oil", "Avocado", "Nuts", "Seeds", "Butter (moderate)"],
  },
};

/**
 * Compute macros for a calorie target using the metabolic type's split,
 * with a protein safety floor (default 1.6 g/kg) that protects muscle on a cut.
 * Extra protein calories come out of carbs first.
 */
export function macrosFromType(
  kcal: number,
  type: MetabolicType,
  weightLb: number,
  proteinFloorPerKg = 1.6
): { protein: number; carbs: number; fat: number } {
  const split = TYPE_INFO[type].split;
  const kg = weightLb / 2.20462;

  let protein = Math.round((kcal * (split.protein / 100)) / 4);
  let fat = Math.round((kcal * (split.fat / 100)) / 9);

  const floor = Math.round(proteinFloorPerKg * kg);
  if (protein < floor) protein = floor;

  // Carbs take the remainder so total calories stay on target.
  let carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  if (carbs < 0) {
    // If protein floor ate into everything, trim fat too.
    carbs = 0;
    fat = Math.max(0, Math.round((kcal - protein * 4) / 9));
  }
  return { protein, carbs, fat };
}

export function typeName(t: string | null): string {
  if (t && t in TYPE_INFO) return TYPE_INFO[t as MetabolicType].name;
  return "Not set";
}
