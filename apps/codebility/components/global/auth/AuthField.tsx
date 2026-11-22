"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface AuthFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  error?: string;
  labelAction?: React.ReactNode;
  inputClassName?: string;
}

export const AuthField = React.forwardRef<HTMLInputElement, AuthFieldProps>(
  (
    {
      label,
      error,
      labelAction,
      inputClassName,
      id,
      type = "text",
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium leading-5 text-white/80"
          >
            {label}
          </label>
          {labelAction}
        </div>

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? "text" : type}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={errorId}
            className={cn(
              "h-[42px] w-full rounded-[8px] border border-white/10 bg-[#151515] px-3.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20 disabled:cursor-not-allowed disabled:opacity-50",
              isPassword && "pr-11",
              error && "border-[#b45454] focus:border-[#b45454] focus:ring-[#b45454]/15",
              inputClassName,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9747ff]"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="h-4 w-4" />
              ) : (
                <Eye aria-hidden className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>

        {error ? (
          <p id={errorId} className="text-xs leading-4 text-[#fca5a5]">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";
