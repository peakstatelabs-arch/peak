"use client";

import { useState } from "react";

interface CalculatorProps {
  onCalculate?: (cycles: number) => void;
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [currentWeight, setCurrentWeight] = useState(180);
  const [goalWeight, setGoalWeight] = useState(160);
  const [currentBodyFat, setCurrentBodyFat] = useState(25);
  const [goalBodyFat, setGoalBodyFat] = useState(15);

  // Calculate cycles based on weight difference and body fat goals
  const calculateCycles = (): number => {
    const weightDiff = Math.abs(currentWeight - goalWeight);
    const bodyFatDiff = Math.abs(currentBodyFat - goalBodyFat);

    // Assume ~20lbs per cycle for weight loss
    // and ~5% body fat reduction per cycle
    const cyclesFromWeight = Math.ceil(weightDiff / 20);
    const cyclesFromBodyFat = Math.ceil(bodyFatDiff / 5);

    // Use the higher of the two calculations, minimum 1 cycle
    const cycles = Math.max(1, Math.max(cyclesFromWeight, cyclesFromBodyFat));

    if (onCalculate) {
      onCalculate(cycles);
    }

    return Math.min(cycles, 5); // Cap at 5 cycles for display
  };

  const cycles = calculateCycles();

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Current Weight */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--primary)]">
              Current Weight (lbs)
            </label>
            <span className="text-sm font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
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
          <div className="flex justify-between text-[10px] text-[var(--primary)]/40">
            <span>100</span>
            <span>400</span>
          </div>
        </div>

        {/* Goal Weight */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--primary)]">
              Goal Weight (lbs)
            </label>
            <span className="text-sm font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
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
          <div className="flex justify-between text-[10px] text-[var(--primary)]/40">
            <span>80</span>
            <span>350</span>
          </div>
        </div>

        {/* Current Body Fat */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--primary)]">
              Current Body Fat % <span className="text-[var(--primary)]/40">(optional)</span>
            </label>
            <span className="text-sm font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
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
          <div className="flex justify-between text-[10px] text-[var(--primary)]/40">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Goal Body Fat */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--primary)]">
              Goal Body Fat % <span className="text-[var(--primary)]/40">(optional)</span>
            </label>
            <span className="text-sm font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">
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
          <div className="flex justify-between text-[10px] text-[var(--primary)]/40">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl text-center text-white shadow-lg">
        <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
          Your Estimated Cycles
        </p>
        <p className="text-sm mt-1 text-white/80">You Need</p>
        <div className="my-2">
          <span className="text-4xl font-bold">{cycles}</span>
        </div>
        <p className="text-sm font-semibold">
          POWER CUT™ {cycles === 1 ? "Cycle" : "Cycles"}
        </p>
        <p className="text-white/70 text-xs mt-0.5">to Hit Your Goal</p>
      </div>
    </div>
  );
}
