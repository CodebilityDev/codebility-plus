"use client";

import { cn } from "@codevs/ui";

import { useStrategyCall } from "@/components/landing/StrategyCallProvider";
import { strategyCallTimes } from "@/constants/landing/strategy-call";

const emptyDays = Array.from({ length: 5 }, (_, index) => ({
  isoDate: "",
  weekday: "",
  day: "",
  key: "empty-" + index,
}));

export function StrategyCallCard({ className }: { className?: string }) {
  const {
    days,
    selectedDate,
    selectedTime,
    unavailableTimes,
    loading,
    error,
    selectDate,
    selectTime,
  } = useStrategyCall();

  const displayDays =
    days.length > 0
      ? days.map((day) => ({ ...day, key: day.isoDate }))
      : emptyDays;
  const availableCount = strategyCallTimes.filter(
    (time) => !unavailableTimes.includes(time),
  ).length;

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
        aria-busy={loading}
        className="mt-[var(--cb-space-16)] grid grid-cols-5 gap-[var(--cb-space-4)]"
      >
        {displayDays.map((item) => {
          const selected = Boolean(item.isoDate) && selectedDate === item.isoDate;

          return (
            <button
              key={item.key}
              type="button"
              disabled={!item.isoDate}
              aria-pressed={selected}
              onClick={() => selectDate(item.isoDate)}
              className={cn(
                "flex min-h-[var(--cb-size-56)] flex-col items-center justify-center gap-[var(--cb-space-2)] rounded-[var(--cb-radius-12)] border py-[var(--cb-space-8)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)] disabled:cursor-wait",
                selected
                  ? "border-[color:var(--cb-primary)] bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
                  : "border-[color:color-mix(in_srgb,var(--cb-white)_14%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-white)_3%,transparent)] text-[color:var(--cb-text-muted)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_25%,transparent)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text-secondary)]",
              )}
            >
              <span className="text-[11px] font-medium leading-4">
                {item.weekday}
              </span>
              <span className="text-sm font-semibold leading-5 text-[color:var(--cb-text)]">
                {item.day}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label="Choose a time"
        aria-busy={loading}
        className="mt-[var(--cb-space-8)] grid grid-cols-4 gap-[var(--cb-space-4)] lg:grid-cols-2 xl:grid-cols-4"
      >
        {strategyCallTimes.map((item) => {
          const unavailable = unavailableTimes.includes(item);
          const disabled = loading || Boolean(error) || unavailable;
          const selected = selectedTime === item;

          return (
            <button
              key={item}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => selectTime(item)}
              className={cn(
                "flex h-[var(--cb-size-36)] items-center justify-center whitespace-nowrap rounded-[var(--cb-radius-8)] border px-[var(--cb-space-4)] text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-surface)] sm:text-xs",
                selected
                  ? "border-transparent bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
                  : unavailable
                    ? "cursor-not-allowed border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)] line-through"
                    : disabled
                      ? "cursor-not-allowed border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)]"
                      : "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] hover:text-[color:var(--cb-text-secondary)]",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="mt-2 text-[11px] leading-4 text-[color:var(--cb-text-muted)]">
          Checking availability...
        </p>
      ) : error ? (
        <p className="mt-2 text-[11px] leading-4 text-red-400">{error}</p>
      ) : availableCount === 0 ? (
        <p className="mt-2 text-[11px] leading-4 text-[color:var(--cb-text-muted)]">
          No times left on this day. Choose another date.
        </p>
      ) : null}
    </div>
  );
}
