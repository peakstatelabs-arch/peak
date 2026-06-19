import { TYPE_INFO, type MetabolicType } from "./metabolic";

/**
 * Build a structured block of metabolic-type context to append to AI system prompts.
 * Returns empty string when the client hasn't taken the quiz yet.
 */
export function metabolicSystemBlock(type: string | null): string {
  if (!type || !(type in TYPE_INFO)) return "";
  const info = TYPE_INFO[type as MetabolicType];
  return `

CLIENT'S METABOLIC TYPE: ${info.name}
- Tagline: ${info.tagline}
- Target split: ${info.split.protein}% protein / ${info.split.carbs}% carbs / ${info.split.fat}% fat
- Summary: ${info.summary}
- Eating tips (apply these to every suggestion):
${info.tips.map((t) => `  • ${t}`).join("\n")}
- Preferred proteins: ${info.proteins.join(", ")}
- Preferred carbs: ${info.carbs.join(", ")}
- Preferred fats: ${info.fats.join(", ")}

Treat this type as the spine of every recommendation. Lean heavily into the preferred food lists.
Avoid the inverse pattern (e.g. for a Polar, don't recommend a carb-only meal; for an Equatorial, don't recommend a fatty steak as the whole meal).`;
}
