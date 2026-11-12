const PHT_OFFSET_MS = 8 * 60 * 60 * 1000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface StrategyCallDay {
  isoDate: string;
  weekday: string;
  day: string;
}

function getPhtTodayString() {
  return new Date(Date.now() + PHT_OFFSET_MS).toISOString().slice(0, 10);
}

export function getUpcomingStrategyCallDays(count = 5) {
  const phtNow = new Date(Date.now() + PHT_OFFSET_MS);
  const cursor = new Date(
    Date.UTC(
      phtNow.getUTCFullYear(),
      phtNow.getUTCMonth(),
      phtNow.getUTCDate() + 1,
    ),
  );
  const days: StrategyCallDay[] = [];

  while (days.length < count) {
    const weekday = cursor.getUTCDay();

    if (weekday !== 0 && weekday !== 6) {
      days.push({
        isoDate: cursor.toISOString().slice(0, 10),
        weekday: WEEKDAYS[weekday] ?? "",
        day: String(cursor.getUTCDate()),
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

export function isStrategyCallDate(dateStr: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;

  const selected = new Date(dateStr + "T12:00:00+08:00");
  if (Number.isNaN(selected.getTime())) return false;

  const today = getPhtTodayString();
  const maxDate = new Date(Date.now() + PHT_OFFSET_MS + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  if (dateStr < today || dateStr > maxDate) return false;

  const weekday = selected.getUTCDay();
  return weekday !== 0 && weekday !== 6;
}

export function formatStrategyCallDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00+08:00").toLocaleDateString("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Manila",
  });
}
