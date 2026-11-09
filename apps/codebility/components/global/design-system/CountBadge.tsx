import { cn } from "@codevs/ui";

export interface CountBadgeProps {
  count: number;
  max?: number;
  label?: string;
  className?: string;
}

function CountBadge({ count, max, label, className }: CountBadgeProps) {
  const display = max !== undefined && count > max ? `${max}+` : `${count}`;

  return (
    <span
      aria-label={label ?? display}
      className={cn(
        "inline-flex min-h-[var(--cb-size-24)] min-w-[var(--cb-size-24)] items-center justify-center rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] px-[var(--cb-space-4)] text-[11px] font-medium leading-4 text-[color:var(--cb-text)]",
        className,
      )}
    >
      {display}
    </span>
  );
}

export { CountBadge };
