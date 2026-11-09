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
        "relative inline-flex shrink-0 items-center rounded-[var(--cb-radius-full)] px-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] data-[state=checked]:bg-[color:var(--cb-primary)] data-[state=unchecked]:bg-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-[var(--cb-size-20)] w-[var(--cb-size-36)]" : "h-[var(--cb-size-22)] w-[var(--cb-size-40)]",
        !label && !description && className,
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "rounded-[var(--cb-radius-full)] bg-[color:var(--cb-white)] transition-transform",
          size === "sm"
            ? "h-[var(--cb-size-14)] w-[var(--cb-size-14)] data-[state=checked]:translate-x-4"
            : "h-[var(--cb-size-16)] w-[var(--cb-size-16)] data-[state=checked]:translate-x-[18px]",
        )}
      />
    </SwitchPrimitive.Root>
  );

  if (!label && !description) return control;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-[var(--cb-space-16)]",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-[var(--cb-space-2)]",
          disabled && "opacity-50",
        )}
      >
        {label ? (
          <label
            htmlFor={switchId}
            className={cn(
              "text-sm text-[color:var(--cb-text)]",
              disabled ? "cursor-not-allowed" : "cursor-pointer",
            )}
          >
            {label}
          </label>
        ) : null}
        {description ? (
          <p
            id={descriptionId}
            className="text-xs leading-[18px] text-[color:var(--cb-text-muted)]"
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
