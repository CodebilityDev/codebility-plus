"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface SwitchProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  id?: string;
}

function Switch({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  size = "md",
  className,
  id,
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  const descriptionId = `${switchId}-description`;

  const control = (
    <SwitchPrimitive.Root
      id={switchId}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      aria-describedby={description ? descriptionId : undefined}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full px-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] data-[state=checked]:bg-[#9747ff] data-[state=unchecked]:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-5 w-9" : "h-[22px] w-10",
        !label && !description && className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "rounded-full bg-white transition-transform",
          size === "sm"
            ? "h-3.5 w-3.5 data-[state=checked]:translate-x-4"
            : "h-4 w-4 data-[state=checked]:translate-x-[18px]",
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) return control;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-0.5",
          disabled && "opacity-50",
        )}
      >
        {label ? (
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm text-[#f4f4f4]",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {label}
          </label>
        ) : null}
        {description ? (
          <p
            id={descriptionId}
            className="text-xs leading-[18px] text-white/50"
          >
            {description}
          </p>
        ) : null}
      </div>
      {control}
    </div>
  );
}

export { Switch };
