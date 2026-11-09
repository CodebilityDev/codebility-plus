"use client";

import { ArrowRight, Search as SearchIcon } from "lucide-react";
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
  iconOnlyOnMobile?: boolean;
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
  iconOnlyOnMobile = false,
}: SearchProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const current = value ?? internalValue;

  function handleSearch() {
    if (!disabled) onSearch?.(current);
  }

  return (
    <div
      className={cn(
        "flex h-[var(--cb-size-56)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] p-[var(--cb-space-6)] pl-[var(--cb-space-16)] focus-within:border-[color:var(--cb-primary)] focus-within:ring-2 focus-within:ring-[color:var(--cb-focus-glow)]",
        disabled && "opacity-50",
        className,
      )}
    >
      <SearchIcon
        aria-hidden
        className="h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 text-[color:var(--cb-text-decorative)]"
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
        className="min-w-0 flex-1 overflow-hidden text-ellipsis bg-transparent text-[15px] leading-5 text-[color:var(--cb-text)] outline-none placeholder:text-[color:var(--cb-text-muted)] disabled:cursor-not-allowed"
      />
      <Button
        size="sm"
        onClick={handleSearch}
        disabled={disabled}
        aria-label={iconOnlyOnMobile ? buttonLabel : undefined}
        className={
          iconOnlyOnMobile
            ? "shrink-0 px-0 h-[var(--cb-size-44)] w-[var(--cb-size-44)] sm:h-[var(--cb-size-40)] sm:w-auto sm:px-[var(--cb-space-18)]"
            : undefined
        }
      >
        {iconOnlyOnMobile ? (
          <>
            <span className="hidden sm:inline">{buttonLabel}</span>
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-18)] w-[var(--cb-size-18)] sm:hidden"
            />
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </div>
  );
}

export { Search };
