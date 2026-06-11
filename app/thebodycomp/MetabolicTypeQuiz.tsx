"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "I sleep best if:",
    a: "I eat a snack high in protein and fat 1-2 hours before going to sleep.",
    b: "I eat a snack higher in carbohydrates 3-4 hours before going to sleep.",
  },
  {
    q: "I sleep best if:",
    a: "My dinner is composed mainly of meat with some vegetables or carbohydrates.",
    b: "My dinner is composed mainly of vegetables or carbohydrates with a comparatively small serving of meat.",
  },
  {
    q: "I sleep best and wake up feeling rested:",
    a: "If I avoid sweet desserts before bed.",
    b: "If I occasionally eat a sweet dessert before bed.",
  },
  {
    q: "After vigorous exercise, I feel best when I consume:",
    a: "Foods or drinks with higher protein and fat content.",
    b: "Foods or drinks higher in carbohydrates such as fruit or fruit juice.",
  },
  {
    q: "I maintain mental clarity and a sense of well-being for several hours after eating:",
    a: "A protein-based meal with heavier meats and a smaller portion of carbohydrates.",
    b: "A carbohydrate-based meal with vegetables, grains, and lighter proteins.",
  },
  {
    q: "If I consume sugary foods by themselves:",
    a: "I get a burst of energy followed by a crash.",
    b: "I feel better and maintain my energy until my next meal.",
  },
  {
    q: "Which statement best describes your attitude toward food?",
    a: "I love food and live to eat.",
    b: "I eat to live and generally don't fuss over food.",
  },
  {
    q: "I often:",
    a: "Add salt to my food.",
    b: "Find food too salty for my liking.",
  },
  {
    q: "Naturally, I prefer:",
    a: "Dark meat such as thighs and legs.",
    b: "Lighter meats such as chicken or turkey breast.",
  },
  {
    q: "Which fish list appeals to you most?",
    a: "Salmon, scallops, shrimp, crab, lobster.",
    b: "Cod, flounder, haddock, perch.",
  },
  {
    q: "When eating dairy products, I feel best after eating:",
    a: "Richer, full-fat dairy products.",
    b: "Lighter, lower-fat dairy products.",
  },
  {
    q: "With regard to snacking:",
    a: "I tend to do better with snacks or smaller meals throughout the day.",
    b: "I can comfortably go longer between meals.",
  },
  {
    q: "Which breakfast sounds most appealing?",
    a: "A larger breakfast with protein and fat.",
    b: "A lighter breakfast built around carbohydrates.",
  },
  {
    q: "Which description sounds most like you?",
    a: "I digest food well, enjoy protein and fats, and tend to gain strength or muscle relatively easily.",
    b: "I prefer lighter foods and am naturally more drawn toward endurance activities.",
  },
];

type Answer = "A" | "B" | null;

export function MetabolicTypeQuiz() {
  const [answers, setAnswers] = useState<Answer[]>(
    () => new Array(QUESTIONS.length).fill(null),
  );
  const [showResult, setShowResult] = useState(false);

  const aCount = answers.filter((a) => a === "A").length;
  const bCount = answers.filter((a) => a === "B").length;
  const answered = answers.filter((a) => a !== null).length;
  const allAnswered = answered === QUESTIONS.length;

  const diff = aCount - bCount;
  const type =
    diff >= 3 ? "Polar" : diff <= -3 ? "Equatorial" : "Variable";

  const TYPE_META = {
    Polar: {
      headline: "You appear to be a Polar Type.",
      sub: "Polar Types often do best when meals contain a larger proportion of protein and healthy fats.",
      macros: { protein: 45, carbs: 35, fat: 20 },
      notice: [
        "Strong appetite",
        "Better energy with protein-rich meals",
        "Better sleep when protein and fats are included later in the day",
        "Energy crashes when consuming large amounts of carbohydrates by themselves",
      ],
      mistake:
        "Trying to follow a very high-carbohydrate diet simply because it's popular.",
    },
    Variable: {
      headline: "You appear to be a Variable Type.",
      sub: "Variable Types are the most flexible — many move between Polar and Equatorial tendencies depending on activity level, stress, recovery, and lifestyle demands.",
      macros: { protein: 40, carbs: 50, fat: 10 },
      notice: [
        "Feel good on multiple nutrition approaches",
        "Adapt quickly",
        "Notice shifts based on activity level",
        "Can move toward Polar tendencies during stressful periods",
        "Can move toward Equatorial tendencies during endurance-focused periods",
      ],
      mistake:
        "Assuming you must follow one approach forever rather than adjusting based on feedback.",
    },
    Equatorial: {
      headline: "You appear to be an Equatorial Type.",
      sub: "Equatorial Types often thrive with a larger proportion of quality carbohydrates and lighter protein sources.",
      macros: { protein: 20, carbs: 70, fat: 10 },
      notice: [
        "Stable energy from carbohydrates",
        "Preference for lighter meals",
        "Ability to go longer between meals",
        "Better results with lean proteins and nutrient-dense carbohydrate sources",
      ],
      mistake:
        "Overcorrecting toward extremely high-fat diets that don't align with how you naturally feel and perform.",
    },
  } as const;

  function setAnswer(idx: number, value: Answer) {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }

  function reset() {
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setShowResult(false);
  }

  if (showResult && allAnswered) {
    const meta = TYPE_META[type];
    return (
      <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-6 sm:p-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-xs font-bold tracking-wider text-[var(--accent-dark)] uppercase">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span>Your Result</span>
          </div>
          <h3 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight">
            {meta.headline}
          </h3>
          <p className="mt-4 text-base sm:text-lg text-[var(--primary)]/70 max-w-2xl mx-auto leading-relaxed">
            {meta.sub}
          </p>

          {/* Score */}
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-[var(--muted)] border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--primary)]/80">
            <span>A answers: <span className="tabular-nums font-bold text-[var(--primary)]">{aCount}</span></span>
            <span className="text-[var(--primary)]/30">|</span>
            <span>B answers: <span className="tabular-nums font-bold text-[var(--primary)]">{bCount}</span></span>
          </div>
        </div>

        {/* Macronutrient split */}
        <div className="mt-10">
          <p className="text-center text-xs font-bold tracking-widest text-[var(--primary)]/60 uppercase">
            Starting Macronutrient Split
          </p>
          <div className="mt-4 max-w-md mx-auto">
            <MacroBar macros={meta.macros} />
          </div>
        </div>

        {/* What you'll notice */}
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[var(--muted)]/60 border border-[var(--border)] p-5 sm:p-6">
            <h4 className="text-base font-bold text-[var(--primary)]">
              Many {type} Types Notice:
            </h4>
            <ul className="mt-3 space-y-2">
              {meta.notice.map((n) => (
                <li
                  key={n}
                  className="flex items-start gap-2 text-sm text-[var(--primary)]/75 leading-relaxed"
                >
                  <span className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[var(--accent)]/25 text-[var(--accent-dark)] font-bold text-[10px]">
                    ✓
                  </span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-5 sm:p-6">
            <h4 className="text-base font-bold text-[var(--primary)]">
              Common Mistake
            </h4>
            <p className="mt-3 text-sm text-[var(--primary)]/75 leading-relaxed">
              {meta.mistake}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[var(--border)] bg-white px-6 text-sm font-semibold text-[var(--primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--muted)]"
          >
            Retake Assessment
          </button>
          <p className="mt-4 text-xs italic text-[var(--primary)]/50 max-w-md mx-auto leading-relaxed">
            The goal isn&rsquo;t proving the quiz right. The goal is developing
            a deeper understanding of how your body responds to food.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-[var(--border)] shadow-sm p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-5">
        <p className="text-sm font-semibold text-[var(--primary)]/70">
          <span className="text-[var(--primary)] font-bold">{answered}</span>{" "}
          of {QUESTIONS.length} answered
        </p>
        <div className="flex-1 h-2 rounded-full bg-[var(--muted)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] transition-all"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {QUESTIONS.map((q, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 p-4 sm:p-5"
          >
            <p className="font-bold text-[var(--primary)]">
              <span className="text-[var(--accent-dark)] tabular-nums mr-2">
                {idx + 1}.
              </span>
              {q.q}
            </p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {(["A", "B"] as const).map((option) => {
                const isActive = answers[idx] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswer(idx, option)}
                    className={`text-left rounded-xl border px-4 py-3 text-sm leading-snug transition-colors ${
                      isActive
                        ? "border-[var(--accent-dark)] bg-[var(--accent)]/20 text-[var(--primary)] font-semibold"
                        : "border-[var(--border)] bg-white text-[var(--primary)]/80 hover:border-[var(--accent)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    <span
                      className={`inline-block w-5 h-5 mr-2 align-text-bottom rounded-full text-xs font-bold leading-5 text-center ${
                        isActive
                          ? "bg-[var(--accent-dark)] text-white"
                          : "bg-[var(--muted)] text-[var(--primary)]/60"
                      }`}
                    >
                      {option}
                    </span>
                    {option === "A" ? q.a : q.b}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setShowResult(true)}
          className={`btn-primary inline-flex h-14 items-center justify-center rounded-2xl px-8 text-lg font-semibold ${
            !allAnswered ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {allAnswered
            ? "See My Metabolic Type"
            : `Answer ${QUESTIONS.length - answered} More`}
        </button>
        <p className="mt-4 text-xs italic text-[var(--primary)]/50 max-w-md mx-auto leading-relaxed">
          If neither answer fits, skip the question. If both apply, choose the
          one that feels closer to your everyday experience.
        </p>
      </div>
    </div>
  );
}

function MacroBar({
  macros,
}: {
  macros: { protein: number; carbs: number; fat: number };
}) {
  const total = macros.protein + macros.carbs + macros.fat;
  return (
    <div>
      <div className="flex h-10 rounded-xl overflow-hidden border border-[var(--border)]">
        <div
          className="bg-[var(--primary)] flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${(macros.protein / total) * 100}%` }}
          title={`Protein ${macros.protein}%`}
        >
          {macros.protein}%
        </div>
        <div
          className="bg-[var(--accent-dark)] flex items-center justify-center text-white text-xs font-bold"
          style={{ width: `${(macros.carbs / total) * 100}%` }}
          title={`Carbohydrates ${macros.carbs}%`}
        >
          {macros.carbs}%
        </div>
        <div
          className="bg-[var(--accent-light)] flex items-center justify-center text-[var(--primary)] text-xs font-bold"
          style={{ width: `${(macros.fat / total) * 100}%` }}
          title={`Fat ${macros.fat}%`}
        >
          {macros.fat}%
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-semibold text-[var(--primary)]/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--primary)]" /> Protein
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--accent-dark)]" />{" "}
          Carbohydrates
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[var(--accent-light)]" /> Fat
        </span>
      </div>
    </div>
  );
}
