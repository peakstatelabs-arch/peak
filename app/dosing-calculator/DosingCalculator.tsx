"use client";

import { useState, useMemo } from "react";
import { dosingProtocols, getMatchingTier, type ProtocolTier } from "./dosingProtocols";

interface UserInputs {
  duration: number;
  currentWeight: number;
  goalWeight: number;
  currentBodyFat: number;
  goalBodyFat: number;
}

export function DosingCalculator() {
  const [step, setStep] = useState<"input" | "results">("input");
  const [inputs, setInputs] = useState<UserInputs>({
    duration: 10,
    currentWeight: 180,
    goalWeight: 160,
    currentBodyFat: 25,
    goalBodyFat: 18,
  });

  const weightLoss = Math.max(0, inputs.currentWeight - inputs.goalWeight);

  // Get matching tiers for all 3 protocols
  const allProtocolTiers = useMemo(() => {
    return dosingProtocols.map((protocol) => {
      const tier = getMatchingTier(protocol, inputs.duration, inputs.currentBodyFat, weightLoss);
      const duration = protocol.durations.find((d) => d.weeks === inputs.duration);
      return {
        protocol,
        tier,
        totalMaterial: duration?.totalMaterial || "",
      };
    });
  }, [inputs.duration, inputs.currentBodyFat, weightLoss]);

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
        weightLoss={weightLoss}
        allProtocolTiers={allProtocolTiers}
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
  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      {/* Header - Compact */}
      <div className="text-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-1">
          Your Personalized Dosing Guide
        </h1>
        <p className="text-sm text-[var(--primary)]/70">
          Enter your details to generate your complete protocol dosing schedule.
        </p>
      </div>

      {/* Form Card - Compact */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-5 shadow-lg">
        {/* Duration Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--primary)] mb-2">
            Select Your Stack Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[10, 20, 30].map((weeks) => (
              <button
                key={weeks}
                onClick={() => setInputs((prev) => ({ ...prev, duration: weeks }))}
                className={`py-2.5 px-3 rounded-lg font-bold text-sm transition-all ${
                  inputs.duration === weeks
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "bg-[var(--muted)] text-[var(--primary)] hover:bg-[var(--muted-dark)]"
                }`}
              >
                {weeks} Weeks
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

            {/* Current Body Fat */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-[var(--primary)]">Current Body Fat</label>
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

            {/* Goal Body Fat */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-[var(--primary)]">Goal Body Fat</label>
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
  weightLoss: number;
  allProtocolTiers: Array<{
    protocol: (typeof dosingProtocols)[0];
    tier: ProtocolTier | undefined;
    totalMaterial: string;
  }>;
  onBack: () => void;
  onDownload: () => void;
}

function ResultsView({ inputs, weightLoss, allProtocolTiers, onBack, onDownload }: ResultsViewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in print:max-w-none print:mx-0 print:text-[11px]">
      {/* Header */}
      <div className="text-center mb-4 print:mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-1 print:text-xl">
          Your Complete Protocol Dosing
        </h1>
        <p className="text-sm text-[var(--primary)]/70 print:text-xs">
          {inputs.duration}-Week Stack | {inputs.currentWeight} lbs → {inputs.goalWeight} lbs | {inputs.currentBodyFat}% → {inputs.goalBodyFat}% BF
        </p>
      </div>

      {/* Action Buttons - Hide on print */}
      <div className="flex justify-center gap-3 mb-4 print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-[var(--muted)] text-[var(--primary)] font-semibold rounded-lg text-sm hover:bg-[var(--muted-dark)] transition-all"
        >
          ← Modify Inputs
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

      {/* Protocol Tier Badge */}
      {allProtocolTiers[0]?.tier && (
        <div className="text-center mb-4 print:mb-2">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold rounded-full text-xs">
            {allProtocolTiers[0].tier.name} ({allProtocolTiers[0].tier.description})
          </span>
        </div>
      )}

      {/* 3-Column Protocol Cards */}
      <div className="grid md:grid-cols-3 gap-4 print:gap-2 print:grid-cols-3">
        {allProtocolTiers.map(({ protocol, tier, totalMaterial }) => (
          <ProtocolCard
            key={protocol.id}
            name={protocol.name}
            description={protocol.description}
            tier={tier}
            totalMaterial={totalMaterial}
            duration={inputs.duration}
          />
        ))}
      </div>

      {/* Important Instructions - Compact */}
      <div className="mt-4 bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2 print:mt-2">
        <h3 className="text-sm font-semibold text-[var(--primary)] mb-2 print:text-xs print:mb-1">
          Important Instructions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[var(--primary)]/80 print:text-[10px] print:gap-1">
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Store refrigerated at 36-46°F (2-8°C)</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Inject subcutaneously, rotate sites</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Administer at consistent times</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Stay hydrated, protein-rich diet</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Consult provider for adverse effects</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Use bacteriostatic water</span>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-2 pt-2 border-t border-[var(--border)] text-center text-[9px] text-[var(--primary)]/50">
        <p>Generated by Peak Performance | For research purposes only | Consult a healthcare provider before use</p>
      </div>
    </div>
  );
}

// ============ PROTOCOL CARD ============
interface ProtocolCardProps {
  name: string;
  description: string;
  tier: ProtocolTier | undefined;
  totalMaterial: string;
  duration: number;
}

function ProtocolCard({ name, description, tier, totalMaterial, duration }: ProtocolCardProps) {
  if (!tier) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm opacity-50">
        <h3 className="text-sm font-bold text-[var(--primary)] mb-1">{name}</h3>
        <p className="text-xs text-[var(--primary)]/60 mb-2">{description}</p>
        <p className="text-xs text-[var(--primary)]/50 italic">
          Not available for {duration}-week duration
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden print:break-inside-avoid print:text-[10px]">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] p-3 text-white print:p-2">
        <h3 className="text-sm font-bold mb-0.5 print:text-xs">{name}</h3>
        <p className="text-[10px] text-white/70 print:text-[9px]">{description}</p>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded print:text-[8px]">{totalMaterial}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded print:text-[8px]">{duration} Weeks</span>
        </div>
      </div>

      {/* Dosing Schedule */}
      <div className="p-3 print:p-2">
        <div className="space-y-1.5 print:space-y-1">
          {tier.schedule.map((dose, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-1.5 px-2 bg-[var(--muted)] rounded-lg text-xs print:py-1 print:px-1.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--primary)] print:w-5 print:h-5 print:text-[8px]">
                  W{dose.weeks.split("-")[0]}
                </span>
                <div>
                  <p className="font-medium text-[var(--primary)] text-xs print:text-[10px]">
                    Wk {dose.weeks}
                  </p>
                  {dose.frequency && (
                    <p className="text-[9px] text-[var(--primary)]/60 print:text-[8px]">{dose.frequency}</p>
                  )}
                </div>
              </div>
              <p className="font-bold text-[var(--primary)] text-xs print:text-[10px]">{dose.dose}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-2 pt-2 border-t border-[var(--border)] flex justify-between items-center print:mt-1 print:pt-1">
          <span className="text-xs font-medium text-[var(--primary)] print:text-[10px]">Total</span>
          <span className="text-sm font-bold text-[var(--accent-dark)] print:text-xs">{tier.totalDose}</span>
        </div>

        {/* Notes */}
        {tier.notes && tier.notes.length > 0 && (
          <div className="mt-2 p-1.5 bg-[var(--accent)]/10 rounded print:mt-1 print:p-1">
            <p className="text-[9px] text-[var(--primary)]/70 print:text-[8px]">{tier.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
