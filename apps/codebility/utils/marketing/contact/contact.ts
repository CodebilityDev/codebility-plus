import { PHT_OFFSET } from "@/constants/marketing/contact/contact";

export const getPHTToday = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const pht = new Date(utcMs + PHT_OFFSET * 60000);
  pht.setHours(0, 0, 0, 0);
  return pht;
};

export const toDateString = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

export const formatDisplay = (dateStr: string) => {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    timeZone: "Asia/Manila",
  });
};
