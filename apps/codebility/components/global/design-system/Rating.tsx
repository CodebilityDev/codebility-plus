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
  const starClassName = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span
      role="img"
      aria-label={`${value} out of ${max}`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            starClassName,
            index < filled
              ? "fill-amber-400 text-amber-400"
              : "fill-transparent text-white/25",
          )}
        />
      ))}
    </span>
  );
}

export { Rating };
