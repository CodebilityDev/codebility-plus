import { Star } from "lucide-react";

import { cn } from "@codevs/ui";

export interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

function Rating({ value, max = 5, size = "sm", className }: RatingProps) {
  const filled = Math.min(max, Math.max(0, Math.round(value)));
  const starClassName = size === "sm" ? "h-[var(--cb-size-14)] w-[var(--cb-size-14)]" : "h-[var(--cb-size-16)] w-[var(--cb-size-16)]";

  return (
    <span
      role="img"
      aria-label={`${value} out of ${max}`}
      className={cn("inline-flex items-center gap-[var(--cb-space-2)]", className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            starClassName,
            index < filled
              ? "fill-amber-400 text-[color:var(--cb-rating)]"
              : "fill-transparent text-[color:color-mix(in_srgb,var(--cb-white)_25%,transparent)]",
          )}
        />
      ))}
    </span>
  );
}

export { Rating };
