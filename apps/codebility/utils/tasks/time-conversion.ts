export const convertHoursToHMS = (hours: number) => {
  const totalSeconds = Math.round(hours * 3600);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  let result = "";

  if (h > 0) {
    result += `${h} hour${h > 1 ? "s" : ""}`;
  }

  if (m > 0) {
    result += (result ? ", " : "") + `${m} minute${m > 1 ? "s" : ""}`;
  }

  if (s > 0) {
    result += (result ? ", and " : "") + `${s} second${s > 1 ? "s" : ""}`;
  }

  return result || "0 seconds";
};
