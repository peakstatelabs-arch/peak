"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { todayISO } from "@/lib/utils";
import type { CheckInQuestion } from "@/lib/ai-checkin";

type Answer = { chip?: string; text?: string; number?: number };
type AnswersMap = Record<string, Answer>;

const MAX_PHOTO_MB = 6;
const ACCEPT = "image/jpeg,image/png,image/webp,image/heic,image/heif";

export function CheckInForm({
  questions,
  weekKey,
}: {
  questions: CheckInQuestion[];
  weekKey: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [answers, setAnswers] = useState<AnswersMap>({});
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function pickChip(qid: string, chip: string) {
    setAnswers((a) => ({ ...a, [qid]: { ...a[qid], chip } }));
  }
  function setText(qid: string, text: string) {
    setAnswers((a) => ({ ...a, [qid]: { ...a[qid], text } }));
  }
  function setNumber(qid: string, raw: string) {
    const n = raw.trim() === "" ? undefined : Number(raw);
    setAnswers((a) => ({ ...a, [qid]: { ...a[qid], number: Number.isFinite(n!) ? n : undefined } }));
  }

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(`Photo too large (max ${MAX_PHOTO_MB} MB).`);
      e.target.value = "";
      return;
    }
    setError(null);
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  }
  function clearPhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }

    let photoPath: string | null = null;
    if (photoFile) {
      const ext = (photoFile.name.split(".").pop() || "jpg").toLowerCase();
      photoPath = `${user.id}/${weekKey}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("progress-photos")
        .upload(photoPath, photoFile, { contentType: photoFile.type, upsert: false });
      if (upErr) {
        setError(`Photo upload failed: ${upErr.message}`);
        setSaving(false);
        return;
      }
    }

    const responses = questions.map((q) => {
      const a = answers[q.id] ?? {};
      return { id: q.id, chip: a.chip ?? null, text: a.text ?? null, number: a.number ?? null };
    });
    // Pull out a sane weight value from any "number" question whose unit is lb.
    const weightAnswer = questions
      .map((q, i) => ({ q, r: responses[i] }))
      .find(({ q, r }) =>
        q.type === "number" &&
        (q.unit ?? "lb").toLowerCase() === "lb" &&
        typeof r.number === "number" &&
        r.number > 30 && r.number < 700
      );
    const weightLb = weightAnswer ? (weightAnswer.r.number as number) : null;

    const { error: ciErr } = await supabase.from("weekly_checkins").insert({
      user_id: user.id,
      week_key: weekKey,
      weight_lb: weightLb,
      ai_questions: questions,
      ai_responses: responses,
      photo_path: photoPath,
    });
    if (ciErr) {
      setError(`Couldn't save: ${ciErr.message}`);
      setSaving(false);
      return;
    }

    if (weightLb !== null) {
      await supabase.from("body_weight_logs").upsert(
        { user_id: user.id, weight_lb: weightLb, logged_for: todayISO() },
        { onConflict: "user_id,logged_for" }
      );
    }

    if (photoPath) {
      await supabase.from("progress_photos").insert({
        user_id: user.id,
        storage_path: photoPath,
        logged_for: todayISO(),
      });
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 900);
  }

  if (success) {
    return (
      <div className="card text-center py-10">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-semibold text-lg">Check-in saved</h3>
        <p className="text-sm text-fg-muted mt-1">Heading to your dashboard…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          answer={answers[q.id] ?? {}}
          detailsOpen={showDetails[q.id] ?? false}
          onChip={(c) => pickChip(q.id, c)}
          onText={(t) => setText(q.id, t)}
          onNumber={(n) => setNumber(q.id, n)}
          onToggleDetails={() =>
            setShowDetails((s) => ({ ...s, [q.id]: !(s[q.id] ?? false) }))
          }
        />
      ))}

      <section className="card">
        <h3 className="font-semibold mb-1">Progress photo (optional)</h3>
        <p className="text-xs text-fg-subtle mb-3">
          Front-facing works best. Only you and your coach can see this.
        </p>
        {photoPreview ? (
          <div className="flex items-start gap-3">
            <img
              src={photoPreview}
              alt="Selected progress photo"
              className="h-32 w-32 object-cover rounded-lg border border-border"
            />
            <button type="button" onClick={clearPhoto} className="btn-ghost text-xs text-danger">
              Remove
            </button>
          </div>
        ) : (
          <label className="btn-secondary cursor-pointer inline-flex">
            <input
              type="file"
              accept={ACCEPT}
              capture="environment"
              className="hidden"
              onChange={onPhotoChange}
            />
            + Add photo
          </label>
        )}
      </section>

      {error && (
        <div className="card border-danger/40 text-sm text-danger">{error}</div>
      )}

      <button type="submit" disabled={saving} className="btn-primary w-full">
        {saving ? "Saving…" : "Submit check-in"}
      </button>
    </form>
  );
}

function QuestionCard({
  question,
  answer,
  detailsOpen,
  onChip,
  onText,
  onNumber,
  onToggleDetails,
}: {
  question: CheckInQuestion;
  answer: Answer;
  detailsOpen: boolean;
  onChip: (chip: string) => void;
  onText: (text: string) => void;
  onNumber: (n: string) => void;
  onToggleDetails: () => void;
}) {
  return (
    <section className="card">
      <h3 className="font-semibold text-base">{question.text}</h3>
      {question.context && (
        <p className="text-xs text-fg-subtle mt-1">{question.context}</p>
      )}

      {question.type === "number" ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min={0}
            className="input max-w-[140px]"
            placeholder="0.0"
            value={answer.number ?? ""}
            onChange={(e) => onNumber(e.target.value)}
          />
          {question.unit && <span className="text-sm text-fg-muted">{question.unit}</span>}
        </div>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {(question.chips ?? []).map((chip) => {
              const active = answer.chip === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => onChip(chip)}
                  className={
                    "px-3 py-1.5 rounded-full text-sm border transition " +
                    (active
                      ? "bg-accent text-accent-fg border-accent"
                      : "bg-bg-elev text-fg-muted border-border hover:text-fg")
                  }
                >
                  {chip}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggleDetails}
            className="mt-3 text-xs text-accent hover:underline"
          >
            {detailsOpen ? "− Hide details" : "+ Add details"}
          </button>
          {detailsOpen && (
            <textarea
              className="input mt-2 min-h-[80px] resize-y"
              placeholder="Anything else worth flagging…"
              value={answer.text ?? ""}
              onChange={(e) => onText(e.target.value)}
              maxLength={500}
            />
          )}
        </>
      )}
    </section>
  );
}
