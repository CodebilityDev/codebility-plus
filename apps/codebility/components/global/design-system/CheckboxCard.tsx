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
        "flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-colors [&:has([data-state=checked])]:border-[#9747ff]/50 [&:has([data-state=checked])]:bg-[#9747ff]/[0.18] [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-[#6A78F2]/40",
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
        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border border-white/25 bg-transparent text-white outline-none data-[state=checked]:border-[#9747ff] data-[state=checked]:bg-[#9747ff] disabled:cursor-not-allowed"
      >
        <CheckboxPrimitive.Indicator>
          <Check aria-hidden className="h-3 w-3" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span id={labelId} className="text-sm text-[#f4f4f4]">
        {label}
      </span>
    </label>
  );
}

export { CheckboxCard };
