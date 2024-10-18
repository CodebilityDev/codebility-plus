export const formatLongDate = (dateString: string) => {
  const date = new Date(dateString);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}, ${year}`;
};

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

export const getPriorityLevel = (priority_level: string) => {
  let prioLevel;

  switch (priority_level.toLowerCase()) {
    case "highest":
      prioLevel = 1;
      break;
    case "critical":
      prioLevel = 2;
      break;
    case "high":
      prioLevel = 3;
      break;
    case "medium":
      prioLevel = 4;
      break;
    default:
      prioLevel = 5;
  }

  return prioLevel;
};
