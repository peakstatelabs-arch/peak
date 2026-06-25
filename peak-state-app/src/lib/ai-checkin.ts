// AI question generator for the weekly check-in.
// Given a snapshot of the client's last 7 days, asks Claude to produce
// 3-4 short, personalized questions with chip-style answer suggestions.

import { getAnthropic, AI_MODEL, extractJson, textOf } from "./ai";

export type CheckInQuestion = {
  id: string;
  type: "chips" | "number";
  text: string;
  chips?: string[];   // 3-4 suggested chip answers (chips type only)
  context?: string;   // optional one-liner shown under the question (e.g. data point that inspired it)
  unit?: string;      // for number questions (e.g. "lb")
};

export type CheckInContext = {
  firstName: string | null;
  weekKey: string;
  protocolName: string | null;
  protocolWeek: number | null;
  programSlug: string | null;
  doseAdherencePct: number | null;       // 0-100, or null if no peptide pillar
  missedDoses: number;
  workoutCompletionPct: number | null;   // null if no workout pillar
  daysSinceWeightLog: number | null;
  weightDelta7dLb: number | null;
  daysSinceLastCheckin: number | null;
  prevCheckinNotes: string | null;       // notes or summary from last check-in
  goal: string | null;                   // e.g. "cut" if known
  metabolicType: string | null;
};

const FALLBACK_QUESTIONS: CheckInQuestion[] = [
  { id: "weight", type: "number", text: "What's your weight today?", unit: "lb", context: "Skip if you've already logged today." },
  { id: "energy", type: "chips", text: "How was your energy this week?", chips: ["Strong", "Steady", "Dragging", "Up and down"] },
  { id: "sleep", type: "chips", text: "How's sleep been?", chips: ["Great", "Fine", "Restless", "Poor"] },
  { id: "notable", type: "chips", text: "Anything notable to flag?", chips: ["All good", "Side effect", "Hunger spike", "Injury / pain"] },
];

function buildPrompt(ctx: CheckInContext): string {
  const lines: string[] = [];
  if (ctx.firstName) lines.push(`Client: ${ctx.firstName}`);
  if (ctx.protocolName) lines.push(`On: ${ctx.protocolName}${ctx.protocolWeek ? ` (week ${ctx.protocolWeek})` : ""}`);
  if (ctx.programSlug) lines.push(`Workout program: ${ctx.programSlug}`);
  if (ctx.goal) lines.push(`Goal: ${ctx.goal}`);
  if (ctx.metabolicType) lines.push(`Metabolic type: ${ctx.metabolicType}`);
  if (ctx.doseAdherencePct !== null) lines.push(`Dose adherence (7d): ${ctx.doseAdherencePct}%${ctx.missedDoses > 0 ? ` · ${ctx.missedDoses} missed` : ""}`);
  if (ctx.workoutCompletionPct !== null) lines.push(`Workout completion (7d): ${ctx.workoutCompletionPct}%`);
  if (ctx.daysSinceWeightLog !== null) lines.push(`Days since last weight log: ${ctx.daysSinceWeightLog}`);
  if (ctx.weightDelta7dLb !== null) lines.push(`Weight Δ 7d: ${ctx.weightDelta7dLb > 0 ? "+" : ""}${ctx.weightDelta7dLb.toFixed(1)} lb`);
  if (ctx.daysSinceLastCheckin !== null) lines.push(`Days since last check-in: ${ctx.daysSinceLastCheckin}`);
  if (ctx.prevCheckinNotes) lines.push(`Last check-in note: "${ctx.prevCheckinNotes.slice(0, 240)}"`);

  return `You are the weekly check-in coach for a peptide + training client at Peak State Labs.

Client snapshot:
${lines.join("\n")}

Write 4 short check-in questions for this client this week. Rules:
- Reference specific numbers from the snapshot when relevant ("Your adherence dipped to ${ctx.doseAdherencePct ?? "X"}% — what got in the way?")
- One question MUST capture today's weight (type: "number", unit: "lb") — make the wording friendly, mention if it's been a while since the last log.
- The other 3 questions are type: "chips" with exactly 4 short answer chips (1-3 words each) covering a realistic range.
- Optional one-line "context" under a question to anchor it in their data (e.g. "Down 1.2 lb this week").
- No medical advice. No mentions of off-label use. Conversational, supportive tone.
- Keep each question text under 90 characters.
- Always say "workouts" instead of "training" — it reads more relatable to our clients.

Return ONLY a JSON object exactly in this shape:
{
  "questions": [
    {"id": "weight", "type": "number", "text": "...", "unit": "lb", "context": "..."},
    {"id": "q2", "type": "chips", "text": "...", "chips": ["...","...","...","..."], "context": "..."},
    {"id": "q3", "type": "chips", "text": "...", "chips": ["...","...","...","..."]},
    {"id": "q4", "type": "chips", "text": "...", "chips": ["...","...","...","..."]}
  ]
}`;
}

export async function generateCheckInQuestions(ctx: CheckInContext): Promise<CheckInQuestion[]> {
  const anthropic = getAnthropic();
  if (!anthropic) return FALLBACK_QUESTIONS;

  try {
    const res = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 800,
      messages: [{ role: "user", content: buildPrompt(ctx) }],
    });
    const parsed = extractJson<{ questions?: unknown }>(textOf(res.content));
    if (!parsed || !Array.isArray(parsed.questions)) return FALLBACK_QUESTIONS;

    const cleaned = (parsed.questions as unknown[])
      .map((q): CheckInQuestion | null => {
        if (!q || typeof q !== "object") return null;
        const r = q as Record<string, unknown>;
        const id = typeof r.id === "string" ? r.id : null;
        const text = typeof r.text === "string" ? r.text : null;
        const type = r.type === "number" ? "number" : "chips";
        if (!id || !text) return null;
        const out: CheckInQuestion = { id, type, text };
        if (typeof r.context === "string") out.context = r.context;
        if (typeof r.unit === "string") out.unit = r.unit;
        if (type === "chips" && Array.isArray(r.chips)) {
          out.chips = (r.chips as unknown[]).filter((c): c is string => typeof c === "string").slice(0, 4);
        }
        return out;
      })
      .filter((q): q is CheckInQuestion => q !== null)
      .slice(0, 4);

    return cleaned.length >= 2 ? cleaned : FALLBACK_QUESTIONS;
  } catch {
    return FALLBACK_QUESTIONS;
  }
}
