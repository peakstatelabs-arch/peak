"use client";

import { useState, useEffect, useMemo } from "react";
import { dosingProtocols, getProtocolById, getMatchingTier, type PeptideProtocol, type ProtocolTier } from "./dosingProtocols";

interface DosingCalculatorProps {
  initialProtocol?: string;
}

export function DosingCalculator({ initialProtocol }: DosingCalculatorProps) {
  const [selectedProtocolId, setSelectedProtocolId] = useState(initialProtocol || "reta");
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [currentWeight, setCurrentWeight] = useState(180);
  const [goalWeight, setGoalWeight] = useState(160);
  const [currentBodyFat, setCurrentBodyFat] = useState(25);
  const [goalBodyFat, setGoalBodyFat] = useState(18);

  const selectedProtocol = useMemo(() => getProtocolById(selectedProtocolId), [selectedProtocolId]);

  const availableDurations = useMemo(() => {
    return selectedProtocol?.durations.map((d) => d.weeks) || [10];
  }, [selectedProtocol]);

  // Reset duration if not available for new protocol
  useEffect(() => {
    if (!availableDurations.includes(selectedDuration)) {
      setSelectedDuration(availableDurations[0]);
    }
  }, [availableDurations, selectedDuration]);

  const weightLoss = Math.max(0, currentWeight - goalWeight);

  const matchingTier = useMemo(() => {
    if (!selectedProtocol) return undefined;
    return getMatchingTier(selectedProtocol, selectedDuration, currentBodyFat, weightLoss);
  }, [selectedProtocol, selectedDuration, currentBodyFat, weightLoss]);

  const currentDuration = useMemo(() => {
    return selectedProtocol?.durations.find((d) => d.weeks === selectedDuration);
  }, [selectedProtocol, selectedDuration]);

  // Check if protocol has multiple tiers (body fat dependent)
  const hasMultipleTiers = useMemo(() => {
    return (currentDuration?.tiers.length || 0) > 1;
  }, [currentDuration]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-3">
          Your Personalized Dosing Guide
        </h1>
        <p className="text-lg text-[var(--primary)]/70 max-w-2xl mx-auto">
          Select your purchased protocol and enter your goals to receive your customized dosing schedule.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--primary)] mb-6">
            Your Protocol Details
          </h2>

          {/* Protocol Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-[var(--primary)]">
              Select Your Protocol
            </label>
            <select
              value={selectedProtocolId}
              onChange={(e) => setSelectedProtocolId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-[var(--primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all cursor-pointer"
            >
              {dosingProtocols.map((protocol) => (
                <option key={protocol.id} value={protocol.id}>
                  {protocol.name}
                </option>
              ))}
            </select>
            {selectedProtocol && (
              <p className="text-xs text-[var(--primary)]/60 mt-1">
                {selectedProtocol.description}
              </p>
            )}
          </div>

          {/* Duration Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-[var(--primary)]">
              Protocol Duration
            </label>
            <div className="flex gap-2">
              {availableDurations.map((weeks) => (
                <button
                  key={weeks}
                  onClick={() => setSelectedDuration(weeks)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    selectedDuration === weeks
                      ? "bg-[var(--primary)] text-white shadow-md"
                      : "bg-[var(--muted)] text-[var(--primary)] hover:bg-[var(--muted-dark)]"
                  }`}
                >
                  {weeks} Weeks
                </button>
              ))}
            </div>
            {currentDuration && (
              <p className="text-xs text-[var(--primary)]/60 mt-1">
                Total material: {currentDuration.totalMaterial}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[var(--border)] my-6" />

          <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
            Your Goals
          </h3>

          {/* Current Weight */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Current Weight (lbs)
              </label>
              <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                {currentWeight}
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="400"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="flex justify-between text-[10px] text-[var(--primary)] font-medium">
              <span>100</span>
              <span>400</span>
            </div>
          </div>

          {/* Goal Weight */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--primary)]">
                Goal Weight (lbs)
              </label>
              <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                {goalWeight}
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="350"
              value={goalWeight}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
              className="w-full h-1.5"
            />
            <div className="flex justify-between text-[10px] text-[var(--primary)] font-medium">
              <span>80</span>
              <span>350</span>
            </div>
          </div>

          {/* Only show body fat sliders if protocol has multiple tiers */}
          {hasMultipleTiers && (
            <>
              {/* Current Body Fat */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[var(--primary)]">
                    Current Body Fat %
                  </label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {currentBodyFat}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={currentBodyFat}
                  onChange={(e) => setCurrentBodyFat(Number(e.target.value))}
                  className="w-full h-1.5"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)] font-medium">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* Goal Body Fat */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-[var(--primary)]">
                    Goal Body Fat %
                  </label>
                  <span className="text-sm font-bold text-[var(--primary)] bg-[var(--accent)]/20 px-2 py-0.5 rounded">
                    {goalBodyFat}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={goalBodyFat}
                  onChange={(e) => setGoalBodyFat(Number(e.target.value))}
                  className="w-full h-1.5"
                />
                <div className="flex justify-between text-[10px] text-[var(--primary)] font-medium">
                  <span>5%</span>
                  <span>50%</span>
                </div>
              </div>
            </>
          )}

          {/* Weight Loss Summary */}
          <div className="mt-6 p-4 bg-[var(--muted)] rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--primary)]/70">Weight Loss Goal</span>
              <span className="text-lg font-bold text-[var(--primary)]">{weightLoss} lbs</span>
            </div>
            {hasMultipleTiers && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-[var(--primary)]/70">Body Fat Reduction</span>
                <span className="text-lg font-bold text-[var(--primary)]">
                  {Math.max(0, currentBodyFat - goalBodyFat)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Selected Protocol Card */}
          {matchingTier && (
            <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                    Your Protocol
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{matchingTier.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{matchingTier.description}</p>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                  <p className="text-2xl font-bold">{selectedDuration}</p>
                  <p className="text-xs text-white/70">Weeks</p>
                </div>
              </div>
              <p className="text-white/90 text-sm">
                <span className="font-semibold">Focus:</span> {matchingTier.focus}
              </p>
            </div>
          )}

          {/* Dosing Schedule */}
          {matchingTier && (
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
                Your Dosing Schedule
              </h3>

              <div className="space-y-3">
                {matchingTier.schedule.map((dose, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-[var(--primary)]">
                          W{dose.weeks.split("-")[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--primary)]">
                          Week{dose.weeks.includes("-") ? "s" : ""} {dose.weeks}
                        </p>
                        {dose.frequency && (
                          <p className="text-xs text-[var(--primary)]/60">{dose.frequency}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[var(--primary)]">{dose.dose}</p>
                      <p className="text-xs text-[var(--primary)]/60">Total: {dose.total}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                <span className="font-semibold text-[var(--primary)]">Total Dosage</span>
                <span className="text-xl font-bold text-[var(--accent-dark)]">
                  {matchingTier.totalDose}
                </span>
              </div>

              {/* Notes */}
              {matchingTier.notes && matchingTier.notes.length > 0 && (
                <div className="mt-4 p-3 bg-[var(--accent)]/10 rounded-xl">
                  <p className="text-xs font-medium text-[var(--primary)]/80">
                    <span className="font-semibold">Note:</span> {matchingTier.notes[0]}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Important Instructions */}
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--primary)] mb-4">
              Important Instructions
            </h3>
            <ul className="space-y-3 text-sm text-[var(--primary)]/80">
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>Store your peptides refrigerated between 36-46°F (2-8°C)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>Inject subcutaneously in the abdomen, rotating injection sites</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>Administer at the same time each day/week for best results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>Stay hydrated and maintain a protein-rich diet during protocol</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--accent)] mt-0.5">&#10003;</span>
                <span>Consult your healthcare provider if you experience adverse effects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
