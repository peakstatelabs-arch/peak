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
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-8">
        {/* Current Weight */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[var(--primary)]">
              Current Weight (lbs)
            </label>
            <span className="text-lg font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg">
              {currentWeight}
            </span>
          </div>
          <input
            type="range"
            min="100"
            max="400"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--primary)]/50">
            <span>100</span>
            <span>400</span>
          </div>
        </div>

        {/* Goal Weight */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[var(--primary)]">
              Goal Weight (lbs)
            </label>
            <span className="text-lg font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg">
              {goalWeight}
            </span>
          </div>
          <input
            type="range"
            min="80"
            max="350"
            value={goalWeight}
            onChange={(e) => setGoalWeight(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--primary)]/50">
            <span>80</span>
            <span>350</span>
          </div>
        </div>

        {/* Current Body Fat */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[var(--primary)]">
              Current Body Fat % (optional)
            </label>
            <span className="text-lg font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg">
              {currentBodyFat}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={currentBodyFat}
            onChange={(e) => setCurrentBodyFat(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--primary)]/50">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Goal Body Fat */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[var(--primary)]">
              Goal Body Fat % (optional)
            </label>
            <span className="text-lg font-bold text-[var(--accent-dark)] bg-[var(--accent)]/10 px-3 py-1 rounded-lg">
              {goalBodyFat}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={goalBodyFat}
            onChange={(e) => setGoalBodyFat(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--primary)]/50">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-10 p-6 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-2xl text-center text-white shadow-xl">
        <p className="text-sm font-medium text-white/80 uppercase tracking-wider">
          Your Estimated Cycles
        </p>
        <p className="text-lg mt-2 text-white/90">You Need</p>
        <div className="my-4">
          <span className="text-6xl sm:text-7xl font-bold animate-scale-in">
            {cycles}
          </span>
        </div>
        <p className="text-xl font-semibold">
          POWER CUT™ {cycles === 1 ? "Cycle" : "Cycles"}
        </p>
        <p className="text-white/80 mt-1">to Hit Your Goal</p>
      </div>
    </div>
  );
}
