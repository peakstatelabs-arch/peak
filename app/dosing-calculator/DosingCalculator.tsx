"use client";

import { useState, useMemo, useRef } from "react";
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
  const resultsRef = useRef<HTMLDivElement>(null);

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
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep("input");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadPDF = () => {
    // Use browser print dialog for PDF
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
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-3">
          Your Personalized Dosing Guide
        </h1>
        <p className="text-lg text-[var(--primary)]/70">
          Enter your details to generate your complete protocol schedule.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl border border-[var(--border)] p-8 shadow-lg">
        {/* Duration Selector */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-[var(--primary)] mb-3">
            Select Your Stack Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[10, 20, 30].map((weeks) => (
              <button
                key={weeks}
                onClick={() => setInputs((prev) => ({ ...prev, duration: weeks }))}
                className={`py-4 px-4 rounded-xl font-bold text-lg transition-all ${
                  inputs.duration === weeks
                    ? "bg-[var(--primary)] text-white shadow-lg scale-105"
                    : "bg-[var(--muted)] text-[var(--primary)] hover:bg-[var(--muted-dark)] hover:scale-102"
                }`}
              >
                {weeks} Weeks
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--border)] my-8" />

        {/* Weight Inputs */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--primary)]">Your Stats</h3>

          {/* Current Weight */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Current Weight (lbs)
              </label>
              <span className="text-lg font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-3 py-1 rounded-lg">
                {inputs.currentWeight}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              value={inputs.currentWeight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, currentWeight: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--primary)]/60">
              <span>100 lbs</span>
              <span>400 lbs</span>
            </div>
          </div>

          {/* Goal Weight */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Goal Weight (lbs)
              </label>
              <span className="text-lg font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-3 py-1 rounded-lg">
                {inputs.goalWeight}
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="350"
              value={inputs.goalWeight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, goalWeight: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--primary)]/60">
              <span>80 lbs</span>
              <span>350 lbs</span>
            </div>
          </div>

          {/* Current Body Fat */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Current Body Fat %
              </label>
              <span className="text-lg font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-3 py-1 rounded-lg">
                {inputs.currentBodyFat}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={inputs.currentBodyFat}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, currentBodyFat: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--primary)]/60">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Goal Body Fat */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Goal Body Fat %
              </label>
              <span className="text-lg font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-3 py-1 rounded-lg">
                {inputs.goalBodyFat}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={inputs.goalBodyFat}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, goalBodyFat: Number(e.target.value) }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--primary)]/60">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mt-8 p-5 bg-gradient-to-r from-[var(--muted)] to-[var(--accent)]/10 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-[var(--primary)]/70">Weight Loss Goal</p>
              <p className="text-2xl font-bold text-[var(--primary)]">{weightLoss} lbs</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--primary)]/70">Body Fat Reduction</p>
              <p className="text-2xl font-bold text-[var(--primary)]">
                {Math.max(0, inputs.currentBodyFat - inputs.goalBodyFat)}%
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Generate My Protocol
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
    <div className="w-full max-w-7xl mx-auto animate-fade-in print:max-w-none print:mx-0">
      {/* Header */}
      <div className="text-center mb-8 print:mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">
          Your Complete Dosing Protocol
        </h1>
        <p className="text-lg text-[var(--primary)]/70">
          {inputs.duration}-Week Stack | {inputs.currentWeight} lbs → {inputs.goalWeight} lbs | {inputs.currentBodyFat}% → {inputs.goalBodyFat}% BF
        </p>
      </div>

      {/* Action Buttons - Hide on print */}
      <div className="flex justify-center gap-4 mb-8 print:hidden">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[var(--muted)] text-[var(--primary)] font-semibold rounded-xl hover:bg-[var(--muted-dark)] transition-all"
        >
          ← Modify Inputs
        </button>
        <button
          onClick={onDownload}
          className="px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl hover:bg-[var(--primary-light)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      {/* Protocol Tier Badge */}
      {allProtocolTiers[0]?.tier && (
        <div className="text-center mb-8 print:mb-4">
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white font-semibold rounded-full text-sm">
            {allProtocolTiers[0].tier.name} ({allProtocolTiers[0].tier.description})
          </span>
        </div>
      )}

      {/* 3-Column Protocol Cards */}
      <div className="grid md:grid-cols-3 gap-6 print:gap-4 print:grid-cols-3">
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

      {/* Important Instructions */}
      <div className="mt-8 bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm print:shadow-none print:border print:mt-4">
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
          Important Instructions
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-[var(--primary)]/80">
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Store peptides refrigerated at 36-46°F (2-8°C)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Inject subcutaneously, rotating injection sites</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Administer at consistent times for best results</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Stay hydrated and maintain protein-rich diet</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Consult healthcare provider for adverse effects</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--accent)] font-bold">✓</span>
            <span>Use bacteriostatic water for reconstitution</span>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-[var(--border)] text-center text-xs text-[var(--primary)]/50">
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
      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm opacity-50">
        <h3 className="text-lg font-bold text-[var(--primary)] mb-1">{name}</h3>
        <p className="text-xs text-[var(--primary)]/60 mb-4">{description}</p>
        <p className="text-sm text-[var(--primary)]/50 italic">
          Protocol not available for {duration}-week duration
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden print:break-inside-avoid">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] p-4 text-white">
        <h3 className="text-lg font-bold mb-0.5">{name}</h3>
        <p className="text-xs text-white/70">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{totalMaterial}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{duration} Weeks</span>
        </div>
      </div>

      {/* Dosing Schedule */}
      <div className="p-4">
        <div className="space-y-2">
          {tier.schedule.map((dose, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 bg-[var(--muted)] rounded-lg text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                  W{dose.weeks.split("-")[0]}
                </span>
                <div>
                  <p className="font-medium text-[var(--primary)]">
                    Week{dose.weeks.includes("-") ? "s" : ""} {dose.weeks}
                  </p>
                  {dose.frequency && (
                    <p className="text-[10px] text-[var(--primary)]/60">{dose.frequency}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[var(--primary)]">{dose.dose}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between items-center">
          <span className="text-sm font-medium text-[var(--primary)]">Total</span>
          <span className="text-lg font-bold text-[var(--accent-dark)]">{tier.totalDose}</span>
        </div>

        {/* Notes */}
        {tier.notes && tier.notes.length > 0 && (
          <div className="mt-3 p-2 bg-[var(--accent)]/10 rounded-lg">
            <p className="text-[10px] text-[var(--primary)]/70">{tier.notes[0]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
