"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate?: Date | string;
  durationMs?: number;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate, durationMs, label }: CountdownTimerProps) {
  // Parse target date - accepts Date object, ISO string, or duration in ms from now
  const [target] = useState(() => {
    if (durationMs) {
      return new Date(Date.now() + durationMs);
    }
    if (targetDate) {
      return typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    }
    // Default fallback: 3 days from now
    return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = (): TimeLeft => {
      const difference = target.getTime() - new Date().getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center gap-4">
        {label && (
          <p className="text-sm text-[var(--primary)]/70 font-medium">{label}</p>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-[var(--primary)] text-white rounded-xl w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold tabular-nums">
                  --
                </span>
              </div>
              <span className="text-xs sm:text-sm text-[var(--primary)]/60 mt-2 font-medium">
                {["Days", "Hours", "Minutes", "Seconds"][i]}
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
