import { createAdminClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { CheckInPhoto } from "./CheckInPhoto";

type Question = { id: string; type: "chips" | "number"; text: string; unit?: string };
type Response = { id: string; chip: string | null; text: string | null; number: number | null };

export const dynamic = "force-dynamic";

export default async function CheckInsPage() {
  const admin = createAdminClient();
  const { data: checkins } = await admin
    .from("weekly_checkins")
    .select("id, user_id, week_key, weight_lb, energy, sleep, mood, notes, ai_questions, ai_responses, photo_path, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: profiles } = await admin.from("profiles").select("id, first_name, last_name");
  const nameById = new Map<string, string>(
    (profiles ?? []).map((p) => [p.id, [p.first_name, p.last_name].filter(Boolean).join(" ") || "Client"])
  );

  return (
    <>
      <PageHeader title="Weekly check-ins" description="All clients, most recent first." />
      <section className="space-y-3">
        {!checkins || checkins.length === 0 ? (
          <div className="card text-sm text-fg-muted">No check-ins submitted yet.</div>
        ) : (
          checkins.map((c) => {
            const questions = (c.ai_questions as Question[] | null) ?? null;
            const responses = (c.ai_responses as Response[] | null) ?? null;
            const isLegacy = !questions || !responses;

            return (
              <article key={c.id} className="card">
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold">{nameById.get(c.user_id) ?? "Client"}</div>
                    <div className="text-xs text-fg-subtle">
                      {c.week_key} · {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {c.weight_lb && <span className="chip">{c.weight_lb} lb</span>}
                </header>

                {isLegacy ? (
                  <LegacyBody c={c} />
                ) : (
                  <AiBody questions={questions!} responses={responses!} />
                )}

                {c.photo_path && (
                  <div className="mt-3">
                    <CheckInPhoto path={c.photo_path} />
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </>
  );
}

function AiBody({ questions, responses }: { questions: Question[]; responses: Response[] }) {
  const byId = new Map(responses.map((r) => [r.id, r]));
  return (
    <ul className="space-y-3">
      {questions.map((q) => {
        const r = byId.get(q.id);
        return (
          <li key={q.id} className="text-sm">
            <div className="text-fg-muted">{q.text}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {r?.chip && <span className="chip-accent">{r.chip}</span>}
              {typeof r?.number === "number" && (
                <span className="chip-accent">
                  {r.number}
                  {q.unit ? ` ${q.unit}` : ""}
                </span>
              )}
              {!r?.chip && typeof r?.number !== "number" && !r?.text && (
                <span className="text-fg-subtle text-xs">(no answer)</span>
              )}
            </div>
            {r?.text && (
              <p className="mt-1 text-sm text-fg italic">&ldquo;{r.text}&rdquo;</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function LegacyBody({
  c,
}: {
  c: { energy: number | null; sleep: number | null; mood: number | null; notes: string | null };
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2 text-xs text-fg-muted">
        {c.energy !== null && <span className="chip">Energy {c.energy}/10</span>}
        {c.sleep !== null && <span className="chip">Sleep {c.sleep}/10</span>}
        {c.mood !== null && <span className="chip">Mood {c.mood}/10</span>}
      </div>
      {c.notes && <p className="mt-2 text-sm text-fg-muted">{c.notes}</p>}
    </>
  );
}
