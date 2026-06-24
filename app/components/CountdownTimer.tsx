"use client";

import { useState, useEffect, useCallback } from "react";
import { getEasternShippingState } from "@/app/lib/easternTime";

interface CountdownTimerProps {
  label?: string;
  labelAfterCutoff?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ label, labelAfterCutoff }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isAfterCutoff, setIsAfterCutoff] = useState(false);

  const [mounted, setMounted] = useState(false);

  const recompute = useCallback((): { time: TimeLeft; isAfter: boolean } => {
    const { secondsRemaining, isAfterCutoff } = getEasternShippingState();
    return {
      time: {
        days: Math.floor(secondsRemaining / 86400),
        hours: Math.floor((secondsRemaining % 86400) / 3600),
        minutes: Math.floor((secondsRemaining % 3600) / 60),
        seconds: Math.floor(secondsRemaining % 60),
      },
      isAfter: isAfterCutoff,
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    const initial = recompute();
    setTimeLeft(initial.time);
    setIsAfterCutoff(initial.isAfter);

    const timer = setInterval(() => {
      const next = recompute();
      setTimeLeft(next.time);
      setIsAfterCutoff(next.isAfter);
    }, 1000);

    return () => clearInterval(timer);
  }, [recompute]);

  const activeLabel = isAfterCutoff && labelAfterCutoff ? labelAfterCutoff : label;

  if (!mounted) {
    const placeholderUnits = [
      { label: "Days" },
      { label: "Hours" },
      { label: "Minutes" },
      { label: "Seconds" },
    ];
    return (
      <div className="flex flex-col items-center gap-4">
        {label && (
          <p className="text-sm text-[var(--primary)]/70 font-medium">
            {label}
          </p>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          {placeholderUnits.map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <div className="bg-[var(--primary)] text-white rounded-xl w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                  --
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[var(--primary)]/60 mt-2 font-medium">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      {activeLabel && (
        <p className="text-sm text-[var(--primary)]/70 font-medium">{activeLabel}</p>
      )}
      <div className="flex items-center gap-2 sm:gap-4">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-[var(--primary)] text-white rounded-xl w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[var(--primary)]/60 mt-2 font-medium">
                {unit.label}
              </span>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-2xl sm:text-3xl font-bold text-[var(--primary)] animate-pulse-slow -mt-6">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
