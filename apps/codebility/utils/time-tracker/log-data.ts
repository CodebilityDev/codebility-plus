import { logData, type TimelogData } from "@/constants/time-tracker/log-data";

const calculateTotalRenderedHours = (data: TimelogData[]) => {
  return data.reduce(
    (total, entry) => total + parseFloat(entry.renderedHours),
    0,
  );
};

export const totalRenderedHours = calculateTotalRenderedHours(logData);

const calculateExcessHours = (data: TimelogData[]) => {
  return data.reduce((totalExcess, entry) => {
    const excess =
      parseFloat(entry.renderedHours) - parseFloat(entry.durationHours);
    return totalExcess + Math.max(excess, 0);
  }, 0);
};

export const excessHours = calculateExcessHours(logData);
