"use client";

import { useState } from "react";

interface CalculatorProps {
  onCalculate?: (cycles: number) => void;
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [currentWeight, setCurrentWeight] = useState(150);
  const [goalWeight, setGoalWeight] = useState(130);
  const [currentBodyFat, setCurrentBodyFat] = useState(20);
  const [goalBodyFat, setGoalBodyFat] = useState(15);

  // Weight rules: goal > current => 0; <=18 lbs loss => 1; >18 => ceil(diff/18)
  const cyclesFromWeight = (cw: number, gw: number): number => {
    const gaining = gw > cw;
    if (gaining) return 0;
    const diff = cw - gw;
    if (diff <= 18) return 1;
    return Math.ceil(diff / 18);
  };

  // BF: ceil((cbf - gbf) / 7) if cbf > gbf, else 0
  const cyclesFromBF = (cbf: number, gbf: number): number => {
    if (cbf > gbf) {
      return Math.ceil((cbf - gbf) / 7);
    }
    return 0;
  };

  const calculateCycles = (): number => {
    const weightCycles = cyclesFromWeight(currentWeight, goalWeight);
    const bfCycles = cyclesFromBF(currentBodyFat, goalBodyFat);
    const finalCycles = Math.max(weightCycles, bfCycles);

    if (onCalculate) {
      onCalculate(finalCycles);
    }

    return finalCycles;
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
        <div className="space-y-1">
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

        {/* Current Body Fat */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-[var(--primary)]">
              Current Body Fat % <span className="text-[var(--primary)]/40">(optional)</span>
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
              Goal Body Fat % <span className="text-[var(--primary)]/40">(optional)</span>
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
      </div>

      {/* Result - Horizontal Layout */}
      <div className="mt-5 p-4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Your Estimated Cycles
            </p>
            <p className="text-sm text-white/80">You Need</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold">{cycles}</span>
            <div className="text-left">
              <p className="text-sm font-semibold">
                POWER CUT™ {cycles === 1 ? "Cycle" : "Cycles"}
              </p>
              <p className="text-white/70 text-xs">to Hit Your Goal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
