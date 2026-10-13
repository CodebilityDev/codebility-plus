"use client";

import { useEffect, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function splitTimeLeft(target: Date): TimeLeft {
  const difference = target.getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

export function useCountdown(target: Date): TimeLeft {
  return useRunningCountdown(target) ?? splitTimeLeft(target);
}

export function useDeferredCountdown(target: Date): TimeLeft | null {
  return useRunningCountdown(target);
}

function useRunningCountdown(target: Date): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    typeof window === "undefined" ? null : splitTimeLeft(target),
  );

  useEffect(() => {
    const tick = () => {
      const next = splitTimeLeft(target);
      setTimeLeft(next);
      return next.isExpired;
    };

    if (tick()) return;

    const interval = setInterval(() => {
      if (tick()) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}