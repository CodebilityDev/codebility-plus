"use client";

import * as React from "react";

import { getStrategyCallAvailability } from "@/actions/landing/strategy-call";
import { strategyCallTimes } from "@/constants/landing/strategy-call";
import { getUpcomingStrategyCallDays } from "@/utils/landing/strategy-call";
import type { StrategyCallDay } from "@/utils/landing/strategy-call";

interface StrategyCallContextValue {
  days: StrategyCallDay[];
  selectedDate: string;
  selectedTime: string;
  unavailableTimes: string[];
  loading: boolean;
  error: string;
  selectDate: (date: string) => void;
  selectTime: (time: string) => void;
}

const StrategyCallContext = React.createContext<
  StrategyCallContextValue | undefined
>(undefined);

export function StrategyCallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [days, setDays] = React.useState<StrategyCallDay[]>([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [unavailableTimes, setUnavailableTimes] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const requestId = React.useRef(0);

  const loadAvailability = React.useCallback(async (date: string) => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    setLoading(true);
    setError("");
    setUnavailableTimes([]);
    setSelectedTime("");

    try {
      const result = await getStrategyCallAvailability(date);
      if (currentRequest !== requestId.current) return;

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      const unavailable = result.unavailable ?? [];
      setUnavailableTimes(unavailable);
      setSelectedTime(
        strategyCallTimes.find((time) => !unavailable.includes(time)) ?? "",
      );
    } catch {
      if (currentRequest === requestId.current) {
        setError("Unable to load availability. Please try again.");
      }
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  React.useEffect(() => {
    const upcoming = getUpcomingStrategyCallDays(5);
    setDays(upcoming);

    const first = upcoming[0];
    if (!first) return;

    setSelectedDate(first.isoDate);
    void loadAvailability(first.isoDate);
  }, [loadAvailability]);

  const selectDate = (date: string) => {
    setSelectedDate(date);
    void loadAvailability(date);
  };

  return (
    <StrategyCallContext.Provider
      value={{
        days,
        selectedDate,
        selectedTime,
        unavailableTimes,
        loading,
        error,
        selectDate,
        selectTime: setSelectedTime,
      }}
    >
      {children}
    </StrategyCallContext.Provider>
  );
}

export function useStrategyCall() {
  const context = React.useContext(StrategyCallContext);

  if (!context) {
    throw new Error("useStrategyCall must be used within StrategyCallProvider.");
  }

  return context;
}
