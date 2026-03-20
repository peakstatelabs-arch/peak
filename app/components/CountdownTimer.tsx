"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getSecondsUntilDeadline(): number {
  // Deadline: Thursday March 26, 2026 at midnight EST (00:00 on 3/27 EST = end of 3/26)
  const deadline = new Date("2026-03-27T00:00:00-05:00");
  const now = new Date();
  const diff = Math.floor((deadline.getTime() - now.getTime()) / 1000);
  return Math.max(0, diff);
}

export function CountdownTimer({ label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const totalSeconds = getSecondsUntilDeadline();
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: Math.floor(totalSeconds % 60),
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

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
      {label && (
        <p className="text-sm text-[var(--primary)]/70 font-medium">{label}</p>
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
