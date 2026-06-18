"use client";

import { useEffect, useRef, useState } from "react";
import { sumMacros, type MacroTargets, type MealLog } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What should I eat right now?",
  "I'm hungry between meals — best protein-forward snack?",
  "Give me a quick 30g protein breakfast.",
  "Best way to time carbs with my workout?",
  "Reta is killing my appetite — how do I still hit protein?",
];

export function NutritionCoach({
  targets,
  goal,
  metabolicType,
  todayMeals,
  activePeptides,
}: {
  targets: MacroTargets;
  goal: string;
  metabolicType: string | null;
  todayMeals: MealLog[];
  activePeptides: string[];
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const totals = sumMacros(todayMeals);

  async function send(text: string) {
    const userMsg: Msg = { role: "user", content: text };
    const next: Msg[] = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/portal/api/ai/nutrition-coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next,
          context: {
            targets,
            goal,
            metabolicType,
            todayLogged: { kcal: totals.kcal, protein: totals.protein, carbs: totals.carbs, fat: totals.fat },
            activePeptides,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Coach is offline."); setSending(false); return; }
      setMessages([...next, { role: "assistant", content: json.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <span className="chip-accent text-[10px]">AI</span>
          <h3 className="font-semibold">Nutrition coach</h3>
        </div>
        <p className="text-xs text-fg-muted">
          Ask about meals, macros, hunger, timing, or your peptide stack.
          The coach sees your targets and what you've logged today.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="card">
          <h4 className="text-sm font-medium mb-2">Try asking</h4>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-xs rounded-full bg-bg-elev border border-border px-3 py-1.5 hover:border-accent/40 text-fg-muted hover:text-fg transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "rounded-2xl px-4 py-3 max-w-[88%] text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user"
                ? "ml-auto bg-accent text-accent-fg"
                : "mr-auto bg-bg-elev border border-border text-fg"
            )}
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="mr-auto bg-bg-elev border border-border rounded-2xl px-4 py-3 text-sm text-fg-muted">
            <span className="inline-block animate-pulse">Thinking…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); if (input.trim()) send(input.trim()); }}
        className="sticky bottom-20 lg:bottom-0 bg-bg-card border border-border rounded-2xl p-2 flex gap-2 shadow-lg"
      >
        <input
          className="input flex-1"
          placeholder="Ask the coach…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
