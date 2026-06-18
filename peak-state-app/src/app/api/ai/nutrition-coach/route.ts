import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAnthropic, AI_MODEL, AI_NOT_CONFIGURED, textOf } from "@/lib/ai";

export const runtime = "nodejs";

type Body = {
  messages: { role: "user" | "assistant"; content: string }[];
  context: {
    targets?: { kcal: number; protein: number; carbs: number; fat: number };
    goal?: string;
    metabolicType?: string | null;
    todayLogged?: { kcal: number; protein: number; carbs: number; fat: number };
    activePeptides?: string[];
  };
};

const SYSTEM = `You are the Peak State Labs nutrition coach. You answer client questions about food, macros, timing, hunger, peptide-nutrition pairings, and meal ideas.

VOICE:
- Direct, confident, practical. Short paragraphs. Bullets when listing.
- Never preachy. Never disclaim like a lawyer. Treat the client as a smart adult.
- If the client asks for a meal idea, suggest 2-3 specific options with rough macros.
- When you don't know something, say so plainly.

CONSTRAINTS:
- Stay inside the Peak State framework: body recomp through smart macros, training, and protocol stack.
- If a client mentions Retatrutide, CJC/Ipamorelin, BPC/TB-500, or GHK-Cu, factor in timing/fasting rules
  (Reta = appetite drops, prioritize protein; CJC = fasted 90 min after/before meals; BPC + GHK = recovery support).
- Not medical advice. Don't say that every reply — only if asked something clinical.
- Keep replies under ~150 words unless the client asks for a meal plan or detailed breakdown.`;

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
  if (!body.messages?.length) {
    return NextResponse.json({ error: "Empty conversation." }, { status: 400 });
  }

  const ctxLines: string[] = ["CLIENT CONTEXT (use when relevant, don't repeat back verbatim):"];
  if (body.context.targets) {
    ctxLines.push(
      `- Daily targets: ${body.context.targets.kcal} kcal · ${body.context.targets.protein}g P · ${body.context.targets.carbs}g C · ${body.context.targets.fat}g F`
    );
  }
  if (body.context.goal) ctxLines.push(`- Goal: ${body.context.goal}`);
  if (body.context.metabolicType) ctxLines.push(`- Metabolic type: ${body.context.metabolicType}`);
  if (body.context.todayLogged) {
    ctxLines.push(
      `- Logged so far today: ${body.context.todayLogged.kcal} kcal · ${body.context.todayLogged.protein}g P · ${body.context.todayLogged.carbs}g C · ${body.context.todayLogged.fat}g F`
    );
  }
  if (body.context.activePeptides?.length) {
    ctxLines.push(`- Active peptides: ${body.context.activePeptides.join(", ")}`);
  }

  try {
    const res = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024,
      system: `${SYSTEM}\n\n${ctxLines.join("\n")}`,
      messages: body.messages.slice(-12).map((m) => ({ role: m.role, content: m.content })),
    });
    return NextResponse.json({ reply: textOf(res.content) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "AI request failed." }, { status: 502 });
  }
}
