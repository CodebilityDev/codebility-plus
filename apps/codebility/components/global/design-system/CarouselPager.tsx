"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@codevs/ui";
import { IconButton } from "@/components/global/design-system/IconButton";

export interface CarouselPagerProps {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

function CarouselPager({
  page,
  pageCount,
  onPageChange,
  className,
}: CarouselPagerProps) {
  const previousDisabled = page <= 1 || onPageChange === undefined;
  const nextDisabled = page >= pageCount || onPageChange === undefined;

  return (
    <div className={cn("flex items-center gap-[var(--cb-space-16)]", className)}>
      <div aria-hidden className="flex items-center gap-[var(--cb-space-6)]">
        {Array.from({ length: pageCount }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-[var(--cb-size-8)] rounded-[var(--cb-radius-full)]",
              index === page - 1 ? "w-[var(--cb-size-24)] bg-[color:var(--cb-primary)]" : "w-[var(--cb-size-8)] bg-[color:color-mix(in_srgb,var(--cb-white)_25%,transparent)]",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[color:var(--cb-text-muted)]">
        {page} of {pageCount}
      </span>
      <div className="ml-auto flex items-center gap-[var(--cb-space-8)]">
        <IconButton
          label="Previous page"
          disabled={previousDisabled}
          onClick={() => onPageChange?.(page - 1)}
        >
          <ChevronLeft className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]" />
        </IconButton>
        <IconButton
          label="Next page"
          disabled={nextDisabled}
          onClick={() => onPageChange?.(page + 1)}
        >
          <ChevronRight className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]" />
        </IconButton>
      </div>
    </div>
  );
}

export { CarouselPager };
