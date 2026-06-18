"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mealTypeLabel, todayISO, type MealType } from "@/lib/nutrition";
import { cn } from "@/lib/utils";

type Mode = "ai-text" | "ai-photo" | "manual";

type Estimate = {
  description: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  items?: { name: string; kcal: number; protein_g: number; carbs_g: number; fat_g: number }[];
  confidence?: string;
  note?: string;
};

export function AddMealSheet({
  mealType,
  onCancel,
  onSaved,
}: {
  mealType: MealType;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [mode, setMode] = useState<Mode>("ai-text");
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Manual fields
  const [manual, setManual] = useState({ description: "", kcal: "", protein: "", carbs: "", fat: "" });

  const fileRef = useRef<HTMLInputElement | null>(null);

  async function estimateFromText() {
    setLoading(true);
    setError(null);
    setEstimate(null);
    try {
      const res = await fetch("/portal/api/ai/estimate-meal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Couldn't estimate."); return; }
      setEstimate(json.estimate);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function estimateFromPhoto(file: File) {
    setLoading(true);
    setError(null);
    setEstimate(null);
    try {
      const compressed = await downscaleImage(file, 1280, 0.85);
      const res = await fetch("/portal/api/ai/scan-meal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image: compressed }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Couldn't read the photo."); return; }
      setEstimate(json.estimate);
      setDescription(json.estimate?.description ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  async function saveAi() {
    if (!estimate) return;
    setSaving(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error: e } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      logged_for: todayISO(),
      meal_type: mealType,
      description: estimate.description || description,
      kcal: Math.round(estimate.kcal),
      protein_g: Math.round(estimate.protein_g),
      carbs_g: Math.round(estimate.carbs_g),
      fat_g: Math.round(estimate.fat_g),
      items: estimate.items ?? null,
      source: mode === "ai-photo" ? "ai-photo" : "ai-text",
    });
    setSaving(false);
    if (e) { setError(e.message); return; }
    onSaved();
  }

  async function saveManual() {
    setSaving(true);
    setError(null);
    if (!manual.description.trim()) { setError("Describe the meal."); setSaving(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not signed in."); setSaving(false); return; }
    const { error: e } = await supabase.from("meal_logs").insert({
      user_id: user.id,
      logged_for: todayISO(),
      meal_type: mealType,
      description: manual.description,
      kcal: Number(manual.kcal) || 0,
      protein_g: Number(manual.protein) || 0,
      carbs_g: Number(manual.carbs) || 0,
      fat_g: Number(manual.fat) || 0,
      source: "manual",
    });
    setSaving(false);
    if (e) { setError(e.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={onCancel}>
      <div
        className="w-full sm:max-w-lg card rounded-b-none sm:rounded-card max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">Log {mealTypeLabel(mealType)}</h3>
          <button onClick={onCancel} className="btn-ghost text-sm">Close</button>
        </div>

        <div className="flex gap-1 rounded-lg bg-bg-elev border border-border p-1 mb-4">
          {([
            ["ai-text", "Type"],
            ["ai-photo", "Photo"],
            ["manual", "Manual"],
          ] as [Mode, string][]).map(([v, l]) => (
            <button
              key={v}
              onClick={() => { setMode(v); setEstimate(null); setError(null); }}
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium transition",
                mode === v ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
              )}
            >{l}</button>
          ))}
        </div>

        {mode === "ai-text" && (
          <div className="space-y-3">
            <div>
              <label className="label">What did you eat?</label>
              <textarea
                className="input min-h-[80px]"
                placeholder="e.g. grilled chicken bowl with rice, avocado, and salsa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              onClick={estimateFromText}
              disabled={loading || !description.trim()}
              className="btn-primary w-full"
            >
              {loading ? "Estimating…" : "Estimate macros with AI"}
            </button>
            {estimate && <EstimateCard estimate={estimate} />}
            {estimate && (
              <button onClick={saveAi} disabled={saving} className="btn-primary w-full">
                {saving ? "Saving…" : "Save to today"}
              </button>
            )}
          </div>
        )}

        {mode === "ai-photo" && (
          <div className="space-y-3">
            <p className="text-sm text-fg-muted">
              Snap or upload a photo of your meal. AI will identify it and estimate macros.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) estimateFromPhoto(f);
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Reading photo…" : "📷 Take or upload photo"}
            </button>
            {estimate && <EstimateCard estimate={estimate} />}
            {estimate && (
              <>
                <div>
                  <label className="label">Description</label>
                  <input
                    className="input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <button onClick={saveAi} disabled={saving} className="btn-primary w-full">
                  {saving ? "Saving…" : "Save to today"}
                </button>
              </>
            )}
          </div>
        )}

        {mode === "manual" && (
          <div className="space-y-3">
            <div>
              <label className="label">Description</label>
              <input
                className="input"
                value={manual.description}
                onChange={(e) => setManual({ ...manual, description: e.target.value })}
                placeholder="e.g. Chipotle bowl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Num label="kcal" v={manual.kcal} on={(s) => setManual({ ...manual, kcal: s })} />
              <Num label="Protein (g)" v={manual.protein} on={(s) => setManual({ ...manual, protein: s })} />
              <Num label="Carbs (g)" v={manual.carbs} on={(s) => setManual({ ...manual, carbs: s })} />
              <Num label="Fat (g)" v={manual.fat} on={(s) => setManual({ ...manual, fat: s })} />
            </div>
            <button onClick={saveManual} disabled={saving} className="btn-primary w-full">
              {saving ? "Saving…" : "Save to today"}
            </button>
          </div>
        )}

        {error && <div className="rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm px-3 py-2 mt-3">{error}</div>}
      </div>
    </div>
  );
}

function EstimateCard({ estimate }: { estimate: Estimate }) {
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="chip-accent text-[10px]">AI estimate</span>
        {estimate.confidence && (
          <span className="text-[10px] uppercase tracking-wide text-fg-subtle">
            {estimate.confidence} confidence
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-sm">
        <Box label="kcal" v={Math.round(estimate.kcal)} />
        <Box label="P (g)" v={Math.round(estimate.protein_g)} />
        <Box label="C (g)" v={Math.round(estimate.carbs_g)} />
        <Box label="F (g)" v={Math.round(estimate.fat_g)} />
      </div>
      {estimate.items && estimate.items.length > 0 && (
        <details className="text-xs">
          <summary className="cursor-pointer text-fg-muted">Breakdown</summary>
          <ul className="mt-2 space-y-1 text-fg-subtle">
            {estimate.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="truncate">{it.name}</span>
                <span>{it.kcal} kcal · {it.protein_g}P / {it.carbs_g}C / {it.fat_g}F</span>
              </li>
            ))}
          </ul>
        </details>
      )}
      {estimate.note && <p className="text-xs text-fg-subtle italic">{estimate.note}</p>}
    </div>
  );
}

function Box({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-md bg-bg-elev border border-border py-2">
      <div className="font-display text-base font-semibold">{v}</div>
      <div className="text-[10px] text-fg-subtle">{label}</div>
    </div>
  );
}

function Num({ label, v, on }: { label: string; v: string; on: (s: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type="number" inputMode="numeric" className="input" value={v} onChange={(e) => on(e.target.value)} />
    </div>
  );
}

/** Downscale a File to a JPEG data URL no wider than maxWidth. */
async function downscaleImage(file: File, maxWidth: number, quality: number): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, maxWidth / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(img.src);
  return canvas.toDataURL("image/jpeg", quality);
}
