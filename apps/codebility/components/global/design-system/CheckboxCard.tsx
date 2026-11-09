"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface CheckboxCardProps {
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function CheckboxCard({
  label,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  className,
  id,
}: CheckboxCardProps) {
  const generatedId = React.useId();
  const checkboxId = id ?? generatedId;
  const labelId = `${checkboxId}-label`;

  return (
    <label
      className={cn(
        "flex h-[var(--cb-size-48)] items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-12)] transition-colors [&:has([data-state=checked])]:border-[color:color-mix(in_srgb,var(--cb-primary)_50%,transparent)] [&:has([data-state=checked])]:bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)] [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-[color:var(--cb-ring)]",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <CheckboxPrimitive.Root
        id={checkboxId}
        aria-labelledby={labelId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={(next) => onCheckedChange?.(next === true)}
        disabled={disabled}
        className="flex h-[var(--cb-size-18)] w-[var(--cb-size-18)] shrink-0 items-center justify-center rounded-[6px] border border-[color:color-mix(in_srgb,var(--cb-white)_25%,transparent)] bg-transparent text-[color:var(--cb-text)] outline-none data-[state=checked]:border-[color:var(--cb-primary)] data-[state=checked]:bg-[color:var(--cb-primary)] disabled:cursor-not-allowed"
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden className="h-[var(--cb-size-12)] w-[var(--cb-size-12)]" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span id={labelId} className="text-sm text-[color:var(--cb-text)]">
        {label}
      </span>
    </label>
  );
}

export { CheckboxCard };
