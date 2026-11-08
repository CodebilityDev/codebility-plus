"use client";

import * as React from "react";

import { cn } from "@codevs/ui";

const weekdays = [
  { label: "Mon", date: "3" },
  { label: "Tue", date: "4" },
  { label: "Wed", date: "5" },
  { label: "Thu", date: "6" },
  { label: "Fri", date: "7" },
];

const times = ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"];

export function StrategyCallCard({ className }: { className?: string }) {
  const [weekday, setWeekday] = React.useState("Tue");
  const [time, setTime] = React.useState("10:30 AM");

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 text-[#f4f4f4]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold leading-5 text-[#f4f4f4]">
            Strategy call
          </h3>
          <p className="mt-1 text-xs leading-[18px] text-white/50">
            30 min · Google Meet
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/20 px-2.5 py-1 text-xs leading-[18px] text-white/70">
          Free
        </span>
      </div>

      <div
        role="group"
        aria-label="Choose a weekday"
        className="mt-4 grid grid-cols-5 gap-1"
      >
        {weekdays.map((item) => {
          const selected = weekday === item.label;

          return (
            <button
              key={item.label}
              type="button"
              aria-pressed={selected}
              onClick={() => setWeekday(item.label)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
                selected
                  ? "bg-[#9747ff] text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80",
              )}
            >
              <span className="text-[11px] font-medium leading-4">
                {item.label}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold leading-5",
                  selected ? "text-white" : "text-[#f4f4f4]",
                )}
              >
                {item.date}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Choose a time"
        className="mt-2 grid grid-cols-4 gap-1 lg:grid-cols-2 xl:grid-cols-4"
      >
        {times.map((item) => {
          const selected = time === item;

          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              onClick={() => setTime(item)}
              className={cn(
                "flex h-9 items-center justify-center whitespace-nowrap rounded-lg border px-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] sm:text-xs",
                selected
                  ? "border-transparent bg-[#9747ff] text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white/80",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
