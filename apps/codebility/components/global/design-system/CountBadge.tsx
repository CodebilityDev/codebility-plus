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
        "inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#9747ff] px-1 text-[11px] font-medium leading-4 text-white",
        className,
      )}
    >
      {display}
    </span>
  );
}

export { CountBadge };
