import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { PROGRAMS, getProgram } from "@/lib/programs";

export const runtime = "nodejs";

type Body = {
  audience: "men" | "women";
  location: "home" | "gym";
  daysPerWeek: number;
  minutesPerSession: number;
  experience: "beginner" | "intermediate" | "advanced";
  injuries: string | null;
  goalNote: string | null;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI is not configured. Add ANTHROPIC_API_KEY in Vercel project settings to enable the custom plan builder." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const baseSlug =
    body.audience === "men"
      ? body.location === "gym" ? "mens-12wk-gym" : "mens-12wk-home"
      : body.location === "gym" ? "womens-12wk-gym" : "womens-12wk-home";
  const base = getProgram(baseSlug);
  if (!base) return NextResponse.json({ error: "Base program not found." }, { status: 500 });

  // Build a tight, structured prompt. We instruct Claude to RESHAPE the base program
  // (not invent exercises) so the resulting plan stays faithful to Peak State Labs' content.
  const baseSummary = base.phases.map((ph) => ({
    phase: ph.label,
    workouts: ph.workouts.map((wt) => ({
      label: wt.label,
      focus: wt.focus,
      exercises: wt.exercises.map((ex) => ({
        code: ex.code, name: ex.name, sets: ex.sets, reps: ex.reps, rest: ex.restSec,
      })),
    })),
  }));

  const system = `You are a strength coach for Peak State Labs. You adapt one of the Peak State 12-week recomp programs to fit a client's constraints.

RULES:
1. Use ONLY exercises that appear in the base program JSON. Do not invent new exercises.
2. Output a JSON object that matches this shape exactly:
   { "name": string, "rationale": string (1-3 sentences), "phases": [ { "label": string, "weeks": number, "workouts": [ { "label": string, "focus": string, "exercises": [ { "code": string, "name": string, "sets": string, "reps": string, "restSec": number } ] } ] } ] }
3. Match phase labels and ordering of the base program (Plan A / B / C).
4. If the client picks fewer days/week than the phase has workouts, KEEP the most compound workouts (squat/deadlift/press priority) and drop the duplicate split day.
5. If the client picks shorter sessions, drop accessory C2/C3/D-prefixed exercises but never drop the A-prefixed primary lift.
6. If injuries are mentioned, swap the offending exercise to a SAFER alternative that ALREADY EXISTS in the base program.
7. Do not change reps/sets schemes drastically — they are deliberate.
8. Respond with ONLY the JSON. No markdown fences. No commentary.`;

  const userMsg = `Client constraints:
- Audience: ${body.audience}
- Location: ${body.location}
- Days per week: ${body.daysPerWeek}
- Minutes per session: ${body.minutesPerSession}
- Experience: ${body.experience}
- Injuries / limitations: ${body.injuries || "none"}
- Additional goal note: ${body.goalNote || "standard body recomp"}

Base program (slug=${base.slug}, name="${base.name}"):
${JSON.stringify(baseSummary)}

Produce the tailored plan JSON now.`;

  const anthropic = new Anthropic({ apiKey });

  try {
    const res = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: userMsg }],
    });
    const text = res.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return NextResponse.json({ error: "Couldn't parse AI response." }, { status: 502 });
    }
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json({ plan: parsed, baseSlug: base.slug });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
