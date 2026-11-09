"use client";

import * as React from "react";

import { cn } from "@codevs/ui";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helpText?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      helpText,
      error,
      className,
      containerClassName,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const messageId = error ? errorId : helpText ? helpId : undefined;

    return (
      <div className={cn("flex flex-col gap-[var(--cb-space-8)]", containerClassName)}>
        {label ? (
          <label htmlFor={inputId} className="text-sm text-[color:var(--cb-text-secondary)]">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={cn(
            "h-[var(--cb-size-48)] w-full rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] px-[var(--cb-space-16)] text-[15px] leading-5 text-[color:var(--cb-text)] outline-none transition-colors placeholder:text-[color:var(--cb-text-muted)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] focus:border-[color:var(--cb-primary)] focus:ring-2 focus:ring-[color:var(--cb-focus-glow)] disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-[color:var(--cb-danger)] hover:border-[color:var(--cb-danger)] focus:border-[color:var(--cb-danger)] focus:ring-[color:var(--cb-danger)]",
            className,
            inputClassName,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs leading-[18px] text-[color:var(--cb-danger-text)]">
            {error}
          </p>
        ) : helpText ? (
          <p id={helpId} className="text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
            {helpText}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
