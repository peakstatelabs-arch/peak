import Link from "next/link";
import type { CheckInQuestion } from "@/lib/ai-checkin";
import { CheckInPhoto } from "@/app/admin/check-ins/CheckInPhoto";

type Response = {
  id: string;
  chip: string | null;
  text: string | null;
  number: number | null;
};

export type PastCheckIn = {
  id: string;
  created_at: string;
  week_key: string;
  weight_lb: number | null;
  ai_questions: CheckInQuestion[] | null;
  ai_responses: Response[] | null;
  photo_path: string | null;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function answerOf(responses: Response[] | null, id: string): Response | null {
  if (!responses) return null;
  return responses.find((r) => r.id === id) ?? null;
}

function hasAnswer(r: Response | null): boolean {
  if (!r) return false;
  return Boolean(r.chip) || Boolean(r.text?.trim()) || typeof r.number === "number";
}

export function PastCheckIns({ checkins }: { checkins: PastCheckIn[] }) {
  if (checkins.length === 0) {
    return (
      <section className="card text-center">
        <p className="text-sm text-fg-muted">No past check-ins yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="font-display text-lg font-semibold">Past check-ins</h2>
      <ul className="space-y-2">
        {checkins.map((c, i) => (
          <li key={c.id}>
            <details className="card group" open={i === 0}>
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="min-w-0">
                  <div className="font-medium">{formatDate(c.created_at)}</div>
                  <div className="text-xs text-fg-subtle mt-0.5">
                    {c.weight_lb ? `${c.weight_lb} lb` : "No weight logged"}
                    {c.photo_path ? " · 📷 Photo" : ""}
                  </div>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-fg-muted transition-transform group-open:rotate-180 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              <div className="mt-4 space-y-4">
                {(c.ai_questions ?? []).map((q) => {
                  const r = answerOf(c.ai_responses, q.id);
                  return (
                    <div key={q.id}>
                      <div className="text-sm font-medium leading-snug">{q.text}</div>
                      {hasAnswer(r) ? (
                        <div className="mt-1.5 space-y-1">
                          {r?.chip && (
                            <div className="inline-block px-2 py-0.5 rounded-full text-xs bg-accent/15 text-accent border border-accent/30">
                              {r.chip}
                            </div>
                          )}
                          {typeof r?.number === "number" && (
                            <div className="text-sm text-fg">
                              {r.number}
                              {q.unit ? ` ${q.unit}` : ""}
                            </div>
                          )}
                          {r?.text?.trim() && (
                            <div className="text-sm text-fg-muted whitespace-pre-wrap">
                              {r.text}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1.5 text-xs text-fg-subtle italic">Skipped</div>
                      )}
                    </div>
                  );
                })}

                {c.photo_path && (
                  <div>
                    <div className="text-sm font-medium mb-2">Progress photo</div>
                    <CheckInPhoto path={c.photo_path} />
                  </div>
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
      <p className="text-xs text-fg-subtle">
        Want to look at body weight trends instead?{" "}
        <Link href="/body-tracker" className="text-accent hover:underline">
          Open Body Tracker
        </Link>
        .
      </p>
    </section>
  );
}
