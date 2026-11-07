"use client";

import * as React from "react";

import { cn } from "@codevs/ui";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helpText?: string;
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
    const textareaId = id ?? generatedId;
    const helpId = `${textareaId}-help`;
    const errorId = `${textareaId}-error`;
    const messageId = error ? errorId : helpText ? helpId : undefined;

    return (
      <div className={cn("flex flex-col gap-2", containerClassName)}>
        {label ? (
          <label htmlFor={textareaId} className="text-sm text-white/70">
            {label}
          </label>
        ) : null}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={cn(
            "h-24 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[15px] leading-5 text-[#f4f4f4] outline-none transition-colors placeholder:text-white/40 hover:border-white/20 focus:border-[#9747ff] focus:ring-2 focus:ring-[#9747ff]/20 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-[#d45454] hover:border-[#d45454] focus:border-[#d45454] focus:ring-[#d45454]/20",
            className,
            inputClassName,
          )}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs leading-[18px] text-[#f08a8a]">
            {error}
          </p>
        ) : helpText ? (
          <p id={helpId} className="text-xs leading-[18px] text-white/50">
            {helpText}
          </p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
