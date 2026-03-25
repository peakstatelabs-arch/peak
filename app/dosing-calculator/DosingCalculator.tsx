"use client";

import { useState } from "react";
import { getStackProtocol, type StackProtocol, type WeeklyDose, type BPCOption } from "./dosingProtocols";

interface UserInputs {
  stacks: number;
  currentWeight: number;
  goalWeight: number;
  currentBodyFat: number;
  goalBodyFat: number;
}

export function DosingCalculator() {
  const [step, setStep] = useState<"input" | "results">("input");
  const [inputs, setInputs] = useState<UserInputs>({
    stacks: 1,
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

  const protocol = getStackProtocol(inputs.stacks);

  if (step === "results" && protocol) {
    return (
      <ResultsView
        inputs={inputs}
        weightLoss={weightLoss}
        protocol={protocol}
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
  const stackOptions = [
    { value: 1, label: "1 Stack" },
    { value: 2, label: "2 Stacks" },
    { value: 3, label: "3 Stacks" },
  ];

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
        {/* Stack Selector */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-[var(--primary)] mb-2">
            Select How Many Stacks
          </label>
          <div className="grid grid-cols-3 gap-2">
            {stackOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setInputs((prev) => ({ ...prev, stacks: option.value }))}
                className={`py-2.5 px-3 rounded-lg font-bold text-sm transition-all ${
                  inputs.stacks === option.value
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
  protocol: StackProtocol;
  onBack: () => void;
  onDownload: () => void;
}

function ResultsView({ inputs, weightLoss, protocol, onBack, onDownload }: ResultsViewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in print:max-w-none print:mx-0 print:text-[11px]">
      {/* Header */}
      <div className="text-center mb-4 print:mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--primary)] mb-1 print:text-xl">
          Your Complete Protocol Dosing
        </h1>
        <p className="text-sm text-[var(--primary)]/70 print:text-xs">
          {inputs.stacks} Stack{inputs.stacks > 1 ? "s" : ""} | {inputs.currentWeight} lbs &rarr; {inputs.goalWeight} lbs | {inputs.currentBodyFat}% &rarr; {inputs.goalBodyFat}% BF
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

      {/* System Overview */}
      <SystemOverviewCard protocol={protocol} />

      {/* 3-Column Protocol Cards */}
      <div className="grid md:grid-cols-3 gap-4 print:gap-2 print:grid-cols-3 mt-4">
        {/* RETA Card */}
        <WeeklyScheduleCard
          title={protocol.reta.title}
          totalMaterial={protocol.reta.totalMaterial}
          schedule={protocol.reta.schedule}
        />

        {/* CJC Card */}
        <WeeklyScheduleCard
          title={protocol.cjc.title}
          totalMaterial={protocol.cjc.totalMaterial}
          subtitle={protocol.cjc.frequency}
          schedule={protocol.cjc.schedule}
        />

        {/* BPC Card */}
        <BPCCard
          title={protocol.bpc.title}
          totalMaterial={protocol.bpc.totalMaterial}
          foundation={protocol.bpc.foundation}
          performance={protocol.bpc.performance}
        />
      </div>

      {/* Important Instructions - Compact */}
      <div className="mt-4 bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2 print:mt-2">
        <h3 className="text-sm font-semibold text-[var(--primary)] mb-2 print:text-xs print:mb-1">
          Important Instructions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[var(--primary)]/80 print:text-[10px] print:gap-1">
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
            <span>Stay hydrated, protein-rich diet</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
            <span>Consult provider for adverse effects</span>
          </div>
          <div className="flex items-start gap-1">
            <span className="text-[var(--accent)] font-bold">&check;</span>
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

// ============ SYSTEM OVERVIEW CARD ============
function SystemOverviewCard({ protocol }: { protocol: StackProtocol }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-4 shadow-sm print:shadow-none print:p-2">
      <h2 className="text-lg font-bold text-[var(--primary)] mb-3 print:text-sm print:mb-1">
        {protocol.overview.title}
      </h2>
      <ul className="space-y-1.5 print:space-y-0.5">
        {protocol.overview.phases.map((phase, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--primary)]/80 print:text-[10px]">
            <span className="text-[var(--accent)] font-bold mt-0.5">&#x2022;</span>
            <span>{phase.label}</span>
          </li>
        ))}
      </ul>
      {protocol.overview.note && (
        <p className="mt-2 text-xs text-[var(--primary)]/60 italic print:text-[9px]">
          {protocol.overview.note}
        </p>
      )}
    </div>
  );
}

// ============ WEEKLY SCHEDULE CARD (RETA & CJC) ============
interface WeeklyScheduleCardProps {
  title: string;
  totalMaterial: string;
  subtitle?: string;
  schedule: WeeklyDose[];
}

function WeeklyScheduleCard({ title, totalMaterial, subtitle, schedule }: WeeklyScheduleCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden print:break-inside-avoid print:text-[10px]">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] p-3 text-white print:p-2">
        <h3 className="text-sm font-bold mb-0.5 print:text-xs">{title}</h3>
        {subtitle && (
          <p className="text-[10px] text-white/70 print:text-[9px]">{subtitle}</p>
        )}
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded print:text-[8px]">
            {totalMaterial} Total
          </span>
        </div>
      </div>

      {/* Dosing Schedule */}
      <div className="p-3 print:p-2">
        <div className="space-y-1 print:space-y-0.5 max-h-[500px] overflow-y-auto print:max-h-none print:overflow-visible">
          {schedule.map((dose, index) => (
            <div key={index}>
              {/* Cycle Label */}
              {dose.cycleLabel && (
                <div className="pt-2 pb-1 first:pt-0">
                  <p className="text-[10px] font-semibold text-[var(--primary)]/60 uppercase tracking-wide print:text-[8px]">
                    {dose.cycleLabel}
                  </p>
                </div>
              )}
              <div
                className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs print:py-1 print:px-1.5 ${
                  dose.isOff
                    ? "bg-[var(--primary)]/5 text-[var(--primary)]/50"
                    : "bg-[var(--muted)]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold print:w-5 print:h-5 print:text-[8px] ${
                      dose.isOff
                        ? "bg-[var(--primary)]/10 text-[var(--primary)]/40"
                        : "bg-[var(--accent)] text-[var(--primary)]"
                    }`}
                  >
                    {dose.week}
                  </span>
                  <p className="font-medium text-[var(--primary)] text-xs print:text-[10px]">
                    Week {dose.week}
                  </p>
                </div>
                <p
                  className={`font-bold text-xs print:text-[10px] ${
                    dose.isOff ? "text-[var(--primary)]/40 italic" : "text-[var(--primary)]"
                  }`}
                >
                  {dose.dose}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-2 pt-2 border-t border-[var(--border)] flex justify-between items-center print:mt-1 print:pt-1">
          <span className="text-xs font-medium text-[var(--primary)] print:text-[10px]">Total</span>
          <span className="text-sm font-bold text-[var(--accent-dark)] print:text-xs">{totalMaterial}</span>
        </div>
      </div>
    </div>
  );
}

// ============ BPC CARD ============
interface BPCCardProps {
  title: string;
  totalMaterial: string;
  foundation: BPCOption;
  performance: BPCOption;
}

function BPCCard({ title, totalMaterial, foundation, performance }: BPCCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] shadow-sm overflow-hidden print:break-inside-avoid print:text-[10px]">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] p-3 text-white print:p-2">
        <h3 className="text-sm font-bold mb-0.5 print:text-xs">{title}</h3>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded print:text-[8px]">
            {totalMaterial} Total
          </span>
        </div>
      </div>

      {/* Two Protocol Options */}
      <div className="p-3 print:p-2 space-y-4 print:space-y-2">
        {/* Foundation */}
        <BPCOptionSection option={foundation} optionNumber={1} />

        {/* Divider */}
        <div className="border-t border-[var(--border)]" />

        {/* Performance */}
        <BPCOptionSection option={performance} optionNumber={2} />
      </div>
    </div>
  );
}

function BPCOptionSection({ option, optionNumber }: { option: BPCOption; optionNumber: number }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center text-[9px] font-bold text-[var(--primary)]">
          {optionNumber}
        </span>
        <h4 className="text-xs font-bold text-[var(--primary)]">{option.name}</h4>
        <span className="text-[9px] bg-[var(--muted)] px-1.5 py-0.5 rounded font-medium text-[var(--primary)]/70">
          {option.frequency}
        </span>
      </div>
      <p className="text-[10px] text-[var(--primary)]/70 mb-2 print:text-[9px]">
        {option.subtitle} {option.description}
      </p>
      <div className="space-y-1 print:space-y-0.5">
        {option.details.map((detail, i) => (
          <div
            key={i}
            className={`py-1.5 px-2 rounded-lg text-xs print:py-1 print:px-1.5 ${
              detail.includes("OFF") ? "bg-[var(--primary)]/5 text-[var(--primary)]/50" : "bg-[var(--muted)]"
            }`}
          >
            <p className="font-medium text-[var(--primary)] text-[11px] print:text-[9px]">{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
