import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropic, AI_MODEL, AI_NOT_CONFIGURED, extractJson, textOf } from "@/lib/ai";

export const runtime = "nodejs";

const SYSTEM = `You are a nutrition estimation engine. Given a free-text description of a meal, estimate its nutrition.
Respond with ONLY a JSON object, no markdown, in this exact shape:
{ "description": string, "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number,
  "items": [ { "name": string, "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number } ],
  "confidence": "low" | "medium" | "high",
  "note": string }
Assume typical US restaurant/home portion sizes if not specified. Round grams to whole numbers. Keep note under 12 words.`;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anthropic = getAnthropic();
  if (!anthropic) return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });

  let description = "";
  try {
    ({ description } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!description?.trim()) return NextResponse.json({ error: "Describe the meal first." }, { status: 400 });

  try {
    const res = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: `Meal: ${description}` }],
    });
    const parsed = extractJson(textOf(res.content));
    if (!parsed) return NextResponse.json({ error: "Couldn't parse the estimate." }, { status: 502 });
    return NextResponse.json({ estimate: parsed });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "AI request failed." }, { status: 502 });
  }
}
