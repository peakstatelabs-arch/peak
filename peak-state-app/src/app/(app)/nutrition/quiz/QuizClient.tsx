"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QUIZ, scoreQuiz, TYPE_INFO, type QuizChoice } from "@/lib/metabolic";
import { cn } from "@/lib/utils";

export function QuizClient() {
  const router = useRouter();
  const supabase = createClient();
  const [answers, setAnswers] = useState<Record<number, QuizChoice>>({});
  const [result, setResult] = useState<ReturnType<typeof scoreQuiz> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / QUIZ.length) * 100);

  function setAnswer(id: number, choice: QuizChoice) {
    setAnswers((a) => ({ ...a, [id]: a[id] === choice ? "skip" : choice }));
  }

  function submit() {
    setResult(scoreQuiz(answers));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveResult() {
    if (!result) return;
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error: e } = await supabase.from("profiles").update({
      metabolic_type: result.type,
      metabolic_quiz: { answers, countA: result.countA, countB: result.countB, takenAt: new Date().toISOString() },
    }).eq("id", user.id);
    setSaving(false);
    if (e) { setError(e.message); return; }
    router.push("/nutrition");
    router.refresh();
  }

  if (result) {
    const info = TYPE_INFO[result.type];
    return (
      <div className="space-y-5">
        <section className="card bg-gradient-to-br from-accent/10 to-transparent border-accent/30 text-center py-8">
          <div className="text-xs uppercase tracking-widest text-fg-subtle mb-2">Your metabolic type</div>
          <h2 className={cn("font-display text-3xl font-semibold", info.accent)}>{info.name}</h2>
          <p className="text-sm text-fg-muted mt-1">{info.tagline}</p>
          <div className="flex justify-center gap-6 mt-5 text-sm">
            <Macro label="Protein" v={info.split.protein} />
            <Macro label="Carbs" v={info.split.carbs} />
            <Macro label="Fat" v={info.split.fat} />
          </div>
          <p className="text-xs text-fg-subtle mt-4">
            {result.countA} A · {result.countB} B answers
          </p>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-2">What this means</h3>
          <p className="text-sm text-fg-muted leading-relaxed">{info.summary}</p>
        </section>

        <section className="card">
          <h3 className="font-semibold mb-3">How to eat</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            {info.tips.map((t, i) => (
              <li key={i} className="flex gap-2"><span className="text-accent mt-0.5">•</span>{t}</li>
            ))}
          </ul>
        </section>

        <div className="grid sm:grid-cols-3 gap-3">
          <FoodCard title="Proteins" items={info.proteins} />
          <FoodCard title="Carbs" items={info.carbs} />
          <FoodCard title="Fats" items={info.fats} />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex gap-2">
          <button onClick={() => { setResult(null); }} className="btn-secondary flex-1">Retake</button>
          <button onClick={saveResult} disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving…" : "Save my type & apply macros"}
          </button>
        </div>
        <p className="text-xs text-fg-subtle text-center">
          Saving applies a {info.split.protein}/{info.split.carbs}/{info.split.fat} split (with a protein floor) to your targets,
          and tailors your AI meal plans + coach to your type.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-16 lg:top-0 z-10 bg-bg/90 backdrop-blur py-2 -mx-1 px-1">
        <div className="flex items-center justify-between text-xs text-fg-muted mb-1.5">
          <span>{answered} of {QUIZ.length} answered</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-elev overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {QUIZ.map((q) => (
        <div key={q.id} className="card">
          <div className="text-xs text-fg-subtle mb-1">Question {q.id}</div>
          <h3 className="font-medium mb-3">{q.prompt}</h3>
          <div className="space-y-2">
            <Choice selected={answers[q.id] === "a"} onClick={() => setAnswer(q.id, "a")} label="A" text={q.a} />
            <Choice selected={answers[q.id] === "b"} onClick={() => setAnswer(q.id, "b")} label="B" text={q.b} />
            <button
              onClick={() => setAnswer(q.id, "both")}
              className={cn(
                "w-full text-left text-xs rounded-lg border px-3 py-2 transition",
                answers[q.id] === "both"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-bg-elev text-fg-subtle hover:text-fg"
              )}
            >
              Both / either applies to me
            </button>
          </div>
        </div>
      ))}

      <div className="sticky bottom-20 lg:bottom-4">
        <button onClick={submit} className="btn-primary w-full shadow-lg">
          See my metabolic type{answered < QUIZ.length ? ` (${answered}/${QUIZ.length} answered)` : ""}
        </button>
        <p className="text-xs text-fg-subtle text-center mt-2">
          Skip any question that doesn't fit — it won't count.
        </p>
      </div>
    </div>
  );
}

function Choice({ selected, onClick, label, text }: { selected: boolean; onClick: () => void; label: string; text: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 text-left rounded-lg border px-3 py-3 transition",
        selected ? "border-accent bg-accent/10" : "border-border bg-bg-elev hover:border-accent/40"
      )}
    >
      <span className={cn(
        "h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0",
        selected ? "border-accent bg-accent text-accent-fg" : "border-border text-fg-muted"
      )}>{label}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

function Macro({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-accent">{v}%</div>
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">{label}</div>
    </div>
  );
}

function FoodCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h4 className="font-semibold mb-2">{title}</h4>
      <ul className="text-sm text-fg-muted space-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2"><span className="text-accent">•</span>{it}</li>
        ))}
      </ul>
    </div>
  );
}
