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
    <div className={cn("flex items-center gap-4", className)}>
      <div aria-hidden className="flex items-center gap-1.5">
        {Array.from({ length: pageCount }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-2 rounded-full",
              index === page - 1 ? "w-6 bg-[#9747ff]" : "w-2 bg-white/25",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-white/50">
        {page} of {pageCount}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <IconButton
          label="Previous page"
          disabled={previousDisabled}
          onClick={() => onPageChange?.(page - 1)}
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </IconButton>
        <IconButton
          label="Next page"
          disabled={nextDisabled}
          onClick={() => onPageChange?.(page + 1)}
        >
          <ChevronRight className="h-[18px] w-[18px]" />
        </IconButton>
      </div>
    </div>
  );
}

export { CarouselPager };
