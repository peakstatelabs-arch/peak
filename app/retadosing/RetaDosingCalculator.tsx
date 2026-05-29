"use client";

import { useState } from "react";
import {
  retaSchedule,
  unitsForDose,
  totalMg,
  type VialSize,
} from "./retaProtocol";

interface UserInputs {
  vial: VialSize;
  currentWeight: number;
  goalWeight: number;
  currentBodyFat: number;
  goalBodyFat: number;
}

export function RetaDosingCalculator() {
  const [step, setStep] = useState<"input" | "results">("input");
  const [inputs, setInputs] = useState<UserInputs>({
    vial: 20,
    currentWeight: 180,
    goalWeight: 160,
    currentBodyFat: 25,
    goalBodyFat: 18,
  });

  const weightLoss = Math.max(0, inputs.currentWeight - inputs.goalWeight);

  const handleSubmit = () => {
    setStep("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (step === "results") {
    return (
      <ResultsView
        inputs={inputs}
        onBack={handleBack}
        onDownload={handleDownloadPDF}
      />
    );
  }

  return (
    <InputForm
      inputs={inputs}
      setInputs={setInputs}
      weightLoss={weightLoss}
      onSubmit={handleSubmit}
    />
  );
}

// ============ INPUT FORM STEP ============
interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
  weightLoss: number;
  onSubmit: () => void;
}

function InputForm({ inputs, setInputs, weightLoss, onSubmit }: InputFormProps) {
  const vialOptions: { value: VialSize; label: string }[] = [
    { value: 10, label: "10mg" },
    { value: 20, label: "20mg" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      {/* Header - Compact */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-1">
          Your Personalized Retatrutide Dosing Guide
        </h1>
        <p className="text-sm text-[var(--primary)]/70">
          Enter your details to generate your complete protocol dosing schedule.
        </p>
      </div>

      {/* Form Card - Compact */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-lg">
        {/* Vial Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--primary)] mb-2">
            Select Your Vial Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {vialOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setInputs((prev) => ({ ...prev, vial: option.value }))}
                className={`py-2.5 px-3 rounded-lg font-bold text-sm transition-all ${
                  inputs.vial === option.value
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-[var(--muted)] text-[var(--primary)] hover:bg-[var(--muted-dark)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)] my-4" />

        {/* Weight Inputs - 2 Column Grid */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-[var(--primary)] mb-3">Your Stats</h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Current Stats Column */}
            <div className="border border-[var(--primary)]/30 rounded-xl p-3 space-y-4">
              {/* Current Weight */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-[var(--primary)]">Current Weight</label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {inputs.currentWeight} lbs
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={inputs.currentWeight}
                  onChange={(e) => setInputs((prev) => ({ ...prev, currentWeight: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)]/50">
                  <span>100</span>
                  <span>400</span>
                </div>
              </div>

              {/* Current Body Fat */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-[var(--primary)]">Current Body Fat (Optional)</label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {inputs.currentBodyFat}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={inputs.currentBodyFat}
                  onChange={(e) => setInputs((prev) => ({ ...prev, currentBodyFat: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)]/50">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>

            {/* Goal Stats Column */}
            <div className="border border-[var(--primary)]/30 rounded-xl p-3 space-y-4">
              {/* Goal Weight */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-[var(--primary)]">Goal Weight</label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {inputs.goalWeight} lbs
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="350"
                  value={inputs.goalWeight}
                  onChange={(e) => setInputs((prev) => ({ ...prev, goalWeight: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)]/50">
                  <span>80</span>
                  <span>350</span>
                </div>
              </div>

              {/* Goal Body Fat */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-[var(--primary)]">Goal Body Fat (Optional)</label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {inputs.goalBodyFat}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={inputs.goalBodyFat}
                  onChange={(e) => setInputs((prev) => ({ ...prev, goalBodyFat: Number(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)]/50">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card - Inline */}
        <div className="p-3 bg-gradient-to-r from-[var(--muted)] to-[var(--accent)]/10 rounded-xl mb-4">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-xs text-[var(--primary)]/70">Weight Loss Goal</p>
              <p className="text-xl font-bold text-[var(--primary)]">{weightLoss} lbs</p>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div className="text-center">
              <p className="text-xs text-[var(--primary)]/70">Body Fat Reduction</p>
              <p className="text-xl font-bold text-[var(--primary)]">
                {Math.max(0, inputs.currentBodyFat - inputs.goalBodyFat)}%
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="w-full py-3 px-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          Generate My Protocol Dosing
        </button>
      </div>
    </div>
  );
}

// ============ RESULTS VIEW STEP ============
interface ResultsViewProps {
  inputs: UserInputs;
  onBack: () => void;
  onDownload: () => void;
}

function ResultsView({ inputs, onBack, onDownload }: ResultsViewProps) {
  const total = totalMg();
  const hasSplitWeeks = retaSchedule.some(
    (row) => unitsForDose(row.mg, inputs.vial) > 100,
  );

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in print:max-w-none print:mx-0 print:text-[11px]">
      {/* Header */}
      <div className="text-center mb-4 print:mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-1 print:text-xl">
          Your Retatrutide Dosing Protocol
        </h1>
        <p className="text-sm text-[var(--primary)]/70 print:text-xs">
          {inputs.vial}mg Vial | {inputs.currentWeight} lbs &rarr; {inputs.goalWeight} lbs | {inputs.currentBodyFat}% &rarr; {inputs.goalBodyFat}% BF
        </p>
      </div>

      {/* Action Buttons - Hide on print */}
      <div className="flex justify-center gap-3 mb-4 print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[var(--muted)] text-[var(--primary)] font-semibold rounded-lg text-sm hover:bg-[var(--muted-dark)] transition-all"
        >
          &larr; Modify Inputs
        </button>
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-[var(--primary)] text-white font-semibold rounded-lg text-sm hover:bg-[var(--primary-light)] transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Reconstitution Instructions */}
      <div className="bg-[var(--primary)] rounded-xl p-4 text-white shadow-sm mb-4 print:shadow-none print:p-2 print:mb-2 print:break-inside-avoid">
        <h2 className="text-base font-bold mb-1.5 print:text-sm print:mb-1">
          Reconstitution: Add 2mL of BAC Water
        </h2>
        <p className="text-sm text-white/90 print:text-[10px]">
          No matter whether you have a <strong>10mg</strong> or <strong>20mg</strong> vial, always add{" "}
          <strong>2mL of bacteriostatic (BAC) water</strong> to your Retatrutide vial. Your selected
          vial is <strong>{inputs.vial}mg</strong>, so the syringe-unit conversions below are
          calculated specifically for it (based on a 1mL / 100-unit insulin syringe).
        </p>
      </div>

      {/* RETA Titration Card */}
      <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden print:break-inside-avoid print:text-[10px]">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] p-3 text-white print:p-2">
          <h3 className="text-sm font-bold mb-0.5 print:text-xs">RETA - 12 WEEK TITRATION</h3>
          <p className="text-[10px] text-white/70 print:text-[9px]">
            {inputs.vial}mg vial &bull; 2mL BAC water &bull; 1mL (100 unit) syringe
          </p>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded print:text-[8px]">
              {total} mg Total
            </span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="px-3 pt-3 print:px-2 print:pt-2">
          <div className="grid grid-cols-3 gap-2 px-2 pb-2 text-[10px] font-semibold text-[var(--primary)]/60 uppercase tracking-wide print:text-[8px]">
            <span>Week</span>
            <span className="text-center">Dose</span>
            <span className="text-right">Syringe Units</span>
          </div>
        </div>

        {/* Dosing Schedule */}
        <div className="px-3 pb-3 print:px-2 print:pb-2">
          <div className="space-y-1 print:space-y-0.5">
            {retaSchedule.map((row) => {
              const units = unitsForDose(row.mg, inputs.vial);
              const isSplit = units > 100;
              return (
                <div
                  key={row.week}
                  className="grid grid-cols-3 items-center gap-2 py-1.5 px-2 rounded-lg text-xs bg-[var(--muted)] print:py-1 print:px-1.5"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--accent)] text-[var(--primary)] print:w-5 print:h-5 print:text-[8px]">
                      {row.week}
                    </span>
                    <p className="font-medium text-[var(--primary)] text-xs print:text-[10px]">
                      Week {row.week}
                    </p>
                  </div>
                  <p className="text-center font-bold text-[var(--primary)] text-xs print:text-[10px]">
                    {row.mg.toFixed(1)} mg
                  </p>
                  <p className="text-right font-bold text-[var(--accent-dark)] text-xs print:text-[10px]">
                    {units} units
                    {isSplit && (
                      <span className="text-[var(--primary)]/60 font-semibold"> *</span>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Split-injection note */}
          {hasSplitWeeks && (
            <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[var(--accent)]/15 px-2.5 py-2 text-[11px] text-[var(--primary)]/80 print:text-[9px] print:mt-1 print:break-inside-avoid">
              <span className="font-bold text-[var(--accent-dark)]">*</span>
              <span>
                <strong>Split injection:</strong> a 1mL syringe holds only 100 units, so any dose
                marked with an asterisk exceeds one full syringe. Split these weeks into two
                injections (e.g. 110 units = two draws of 55 units) to deliver the full dose.
              </span>
            </div>
          )}

          {/* Total */}
          <div className="mt-2 pt-2 border-t border-[var(--border)] flex justify-between items-center print:mt-1 print:pt-1">
            <span className="text-xs font-medium text-[var(--primary)] print:text-[10px]">Total</span>
            <span className="text-sm font-bold text-[var(--accent-dark)] print:text-xs">{total} mg</span>
          </div>
        </div>
      </div>

      {/* When & How to Take It */}
      <div className="mt-4 bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2 print:mt-2 print:break-inside-avoid">
        <h3 className="text-sm font-semibold text-[var(--primary)] mb-2 print:text-xs print:mb-1">
          When &amp; How to Take Your Injection
        </h3>
        <ul className="space-y-1.5 text-xs text-[var(--primary)]/80 print:text-[10px] print:space-y-0.5">
          <li className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&#x2022;</span>
            <span>
              <strong>Once per week.</strong> Retatrutide is a long-acting, once-weekly injection.
              Pick one day and take it on the same day each week.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&#x2022;</span>
            <span>
              <strong>In the morning, ideally fasted</strong> &mdash; or at least{" "}
              <strong>90 minutes before a big meal</strong>. This helps minimize nausea and lets the
              dose settle before your largest meal of the day.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&#x2022;</span>
            <span>
              <strong>Subcutaneous injection</strong> into the abdomen, thigh, or back of the arm.
              Rotate sites each week to protect the tissue.
            </span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&#x2022;</span>
            <span>
              <strong>Stay consistent.</strong> Same day, same time each week keeps blood levels
              stable and results predictable. If you miss a dose, take it within 1&ndash;2 days &mdash;
              otherwise skip it and resume your normal schedule (never double up).
            </span>
          </li>
        </ul>
      </div>

      {/* Optimize Your Results */}
      <div className="mt-4 bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2 print:mt-2 print:break-inside-avoid">
        <h3 className="text-sm font-semibold text-[var(--primary)] mb-2 print:text-xs print:mb-1">
          Tips to Optimize Your Results
        </h3>
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-[var(--primary)]/80 print:text-[10px] print:gap-y-1">
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Hydrate.</strong> Aim for at least half your body weight (lbs) in ounces of
              water per day &mdash; appetite suppression can mask thirst.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Electrolytes.</strong> Supplement sodium, potassium, and magnesium daily to
              avoid fatigue, cramps, and headaches while eating less.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Prioritize protein.</strong> Target <strong>1g of protein per pound of your
              ideal body weight</strong> to preserve lean muscle while losing fat.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Resistance train.</strong> Lift 3&ndash;4x per week to signal your body to
              hold onto muscle and keep your metabolism high.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Eat whole foods &amp; fiber.</strong> Lean proteins, vegetables, and fiber
              improve digestion and help manage any GI side effects.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Sleep 7&ndash;9 hours.</strong> Quality sleep supports recovery, hormones,
              and appetite regulation &mdash; all critical for fat loss.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Move daily.</strong> Aim for 8,000&ndash;10,000 steps to boost daily
              calorie burn without taxing recovery.
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-[var(--accent)] font-bold mt-0.5">&check;</span>
            <span>
              <strong>Limit alcohol &amp; ultra-processed foods.</strong> They add empty calories
              and can worsen nausea and energy dips.
            </span>
          </div>
        </div>
      </div>

      {/* Important Instructions - Compact */}
      <div className="mt-4 bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2 print:mt-2">
        <h3 className="text-sm font-semibold text-[var(--primary)] mb-2 print:text-xs print:mb-1">
          Important Instructions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[var(--primary)]/80 print:text-[10px] print:gap-1">
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Add 2mL BAC water to the vial</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Store refrigerated at 36-46&deg;F (2-8&deg;C)</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Inject subcutaneously, rotate sites</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Administer at consistent times</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Use a 1mL (100 unit) syringe</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Consult provider for adverse effects</span>
          </div>
        </div>
      </div>

      {/* Power Cut Stack Upsell + CTA - Hide on print */}
      <div className="mt-4 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] p-5 text-white shadow-lg print:hidden">
        <h3 className="text-lg font-bold mb-1.5">Maximize Your Results with the Full POWER CUT&trade; Stack</h3>
        <p className="text-sm text-white/90 leading-relaxed mb-4">
          Retatrutide is a powerful tool for fat loss &mdash; but if your goal is to{" "}
          <strong>lose fat AND build lean muscle</strong> while protecting your recovery, energy,
          and overall high performance, running Reta on its own only gets you part of the way.
          Our complete <strong>POWER CUT&trade; Stack</strong> pairs Reta with CJC-1295 / Ipamorelin
          and BPC-157 / TB-500 so you preserve lean mass, recover faster, sustain energy, and
          come out the other side leaner and stronger &mdash; not just lighter.
        </p>
        <a
          href="/powercut"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[var(--primary)] shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
        >
          Explore the POWER CUT&trade; Stack
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-2 pt-2 border-t border-[var(--border)] text-center text-[9px] text-[var(--primary)]/50">
        <p>Generated by Peak Performance | For research purposes only | Consult a healthcare provider before use</p>
      </div>
    </div>
  );
}
