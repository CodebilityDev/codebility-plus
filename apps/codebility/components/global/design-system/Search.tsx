"use client";

import { Search as SearchIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/global/design-system/Button";
import { cn } from "@codevs/ui";

export interface SearchProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  className?: string;
  inputAriaLabel?: string;
}

function Search({
  value,
  defaultValue,
  onValueChange,
  onSearch,
  placeholder = "Search...",
  buttonLabel = "Find",
  disabled = false,
  className,
  inputAriaLabel,
}: SearchProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const current = value ?? internalValue;

  function handleSearch() {
    if (!disabled) onSearch?.(current);
  }

  return (
    <div
      className={cn(
        "flex h-[54px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4 focus-within:border-[#9747ff] focus-within:ring-2 focus-within:ring-[#9747ff]/20",
        disabled && "opacity-50",
        className,
      )}
    >
      <SearchIcon
        aria-hidden
        className="h-[18px] w-[18px] shrink-0 text-white/40"
      />
      <input
        type="text"
        value={current}
        onChange={(event) => {
          const next = event.target.value;
          if (value === undefined) setInternalValue(next);
          onValueChange?.(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleSearch();
          }
        }}
        placeholder={placeholder}
        aria-label={inputAriaLabel ?? placeholder}
        disabled={disabled}
        className="min-w-0 flex-1 overflow-hidden text-ellipsis bg-transparent text-[15px] leading-5 text-[#f4f4f4] outline-none placeholder:text-white/50 disabled:cursor-not-allowed"
      />
      <Button size="sm" onClick={handleSearch} disabled={disabled}>
        {buttonLabel}
      </Button>
    </div>
  );
}

export { Search };
