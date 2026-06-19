import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropic, AI_MODEL, AI_NOT_CONFIGURED, extractJson, textOf } from "@/lib/ai";
import { metabolicSystemBlock } from "@/lib/ai-metabolic";

export const runtime = "nodejs";

type Body = {
  targets: { kcal: number; protein: number; carbs: number; fat: number };
  goal: "cut" | "recomp" | "bulk";
  metabolicType: string | null;
  prefs: { likes?: string; dislikes?: string; allergies?: string; style?: string; prepTimeMin?: number };
};

const SYSTEM = `You are a nutrition coach for Peak State Labs. Generate a 7-day meal plan tailored to the client.

OUTPUT: ONLY a JSON object, no markdown, in this exact shape:
{
  "name": string,
  "summary": string (2 sentences max about the plan's approach),
  "days": [
    {
      "day_index": 1-7,
      "day_label": "Day 1" .. "Day 7",
      "meals": [
        {
          "type": "breakfast" | "lunch" | "dinner" | "snack",
          "name": string,
          "description": string (one line — the actual dish),
          "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number,
          "prep_min": number,
          "ingredients": [string],
          "instructions": string
        }
      ]
    }
  ],
  "grocery": [string]
}

RULES:
1. Each day's meals MUST sum to within ±5% of the client's target kcal and within ±10% of each macro.
2. Include 3 meals + 1 snack per day (4 entries) unless client says otherwise.
3. Vary protein sources across the week. Vary cuisines reasonably.
4. Respect dislikes/allergies absolutely. Lean into the client's likes.
5. Keep prep_min realistic; total daily prep ≤ client's prep budget if given.
6. Cook once / eat twice patterns are great — repeat lunches occasionally to reduce prep load.
7. Grocery list: deduplicate ingredients across the week, grouped logically.
8. If client gives a metabolic type, reflect it in macro split bias and food choices.`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anthropic = getAnthropic();
  if (!anthropic) return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const userMsg = `Client targets:
- ${body.targets.kcal} kcal · ${body.targets.protein}g protein · ${body.targets.carbs}g carbs · ${body.targets.fat}g fat
- Goal: ${body.goal}
- Metabolic type: ${body.metabolicType ?? "not specified"}
- Likes: ${body.prefs.likes || "no preference"}
- Dislikes / allergies: ${[body.prefs.dislikes, body.prefs.allergies].filter(Boolean).join(", ") || "none"}
- Diet style: ${body.prefs.style || "omnivore"}
- Max prep time per meal: ${body.prefs.prepTimeMin ?? 30} min

Build the 7-day plan now.`;

  try {
    const res = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 8000,
      system: SYSTEM + metabolicSystemBlock(body.metabolicType),
      messages: [{ role: "user", content: userMsg }],
    });
    const parsed = extractJson(textOf(res.content));
    if (!parsed) return NextResponse.json({ error: "Couldn't parse the plan." }, { status: 502 });
    return NextResponse.json({ plan: parsed });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "AI request failed." }, { status: 502 });
  }
}
