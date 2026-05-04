"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  label?: string;
}

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const EASTERN_TIME_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const CUTOFF_HOUR = 15; // 3:00 PM Eastern (resets at midnight Eastern)

function getSecondsUntilEasternCutoff(): number {
  const parts = EASTERN_TIME_FORMATTER.formatToParts(new Date());
  const read = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const currentSecondOfDay =
    read("hour") * 3600 + read("minute") * 60 + read("second");
  const cutoffSecondOfDay = CUTOFF_HOUR * 3600;

  let diff = cutoffSecondOfDay - currentSecondOfDay;
  if (diff <= 0) diff += 86400;
  return diff;
}

export function CountdownTimer({ label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [mounted, setMounted] = useState(false);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const totalSeconds = getSecondsUntilEasternCutoff();
    return {
      hours: Math.floor(totalSeconds / 3600),
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
