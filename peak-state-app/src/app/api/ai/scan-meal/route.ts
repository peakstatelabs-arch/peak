import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropic, AI_MODEL, AI_NOT_CONFIGURED, extractJson, textOf } from "@/lib/ai";

export const runtime = "nodejs";

const SYSTEM = `You are a nutrition vision engine. Identify the food in the image and estimate its nutrition.
Respond with ONLY a JSON object, no markdown, in this exact shape:
{ "description": string, "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number,
  "items": [ { "name": string, "kcal": number, "protein_g": number, "carbs_g": number, "fat_g": number } ],
  "confidence": "low" | "medium" | "high",
  "note": string }
Estimate visible portion sizes. If the image is not food, set kcal 0 and note "no food detected". Round grams to whole numbers.`;

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const anthropic = getAnthropic();
  if (!anthropic) return NextResponse.json(AI_NOT_CONFIGURED, { status: 503 });

  let dataUrl = "";
  try {
    ({ image: dataUrl } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const m = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl ?? "");
  if (!m || !ALLOWED.has(m[1])) {
    return NextResponse.json({ error: "Please upload a JPEG, PNG, or WebP photo." }, { status: 400 });
  }
  const mediaType = m[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  const base64 = m[2];

  // Guard against very large payloads (~5MB base64)
  if (base64.length > 7_000_000) {
    return NextResponse.json({ error: "Photo is too large. Try a smaller image." }, { status: 413 });
  }

  try {
    const res = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
            { type: "text", text: "Estimate the nutrition of this meal." },
          ],
        },
      ],
    });
    const parsed = extractJson(textOf(res.content));
    if (!parsed) return NextResponse.json({ error: "Couldn't read the photo." }, { status: 502 });
    return NextResponse.json({ estimate: parsed });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "AI request failed." }, { status: 502 });
  }
}
