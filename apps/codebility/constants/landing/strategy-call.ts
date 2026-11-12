export const strategyCallTimes = [
  "9:00 AM",
  "10:30 AM",
  "1:00 PM",
  "3:30 PM",
] as const;

export const strategyCallDurationMinutes = 30;

export type StrategyCallTime = (typeof strategyCallTimes)[number];
