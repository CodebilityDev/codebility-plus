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
        "rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)] text-[color:var(--cb-text)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-[var(--cb-space-12)]">
        <div>
          <h3 className="text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
            Strategy call
          </h3>
          <p className="mt-[var(--cb-space-4)] text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
            30 min · Google Meet
          </p>
        </div>
        <span className="shrink-0 rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] px-2.5 py-[var(--cb-space-4)] text-xs leading-[18px] text-[color:var(--cb-text-secondary)]">
          Free
        </span>
      </div>

      <div
        role="group"
        aria-label="Choose a weekday"
        className="mt-[var(--cb-space-16)] grid grid-cols-5 gap-[var(--cb-space-4)]"
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
                "flex min-h-[var(--cb-size-56)] flex-col items-center justify-center gap-[var(--cb-space-2)] rounded-[var(--cb-radius-12)] py-[var(--cb-space-8)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)]",
                selected
                  ? "bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
                  : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text-secondary)]",
              )}
            >
              <span className="text-[11px] font-medium leading-4">
                {item.label}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold leading-5",
                  selected ? "text-[color:var(--cb-text)]" : "text-[color:var(--cb-text)]",
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
        className="mt-[var(--cb-space-8)] grid grid-cols-4 gap-[var(--cb-space-4)] lg:grid-cols-2 xl:grid-cols-4"
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
                "flex h-[var(--cb-size-36)] items-center justify-center whitespace-nowrap rounded-[var(--cb-radius-8)] border px-[var(--cb-space-4)] text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)] sm:text-xs",
                selected
                  ? "border-transparent bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
                  : "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] hover:text-[color:var(--cb-text-secondary)]",
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
