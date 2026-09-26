"use client";

import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isKeyboard?: boolean;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    isKeyboard, 
    label, 
    error, 
    helperText, 
    required, 
    id, 
    className = "",
    "aria-describedby": ariaDescribedBy,
    ...props 
  }, ref) => {
    const disableKeyboardInput = (e: any) => {
      e.preventDefault();
    };
    
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    
    const describedByIds = [
      errorId,
      helperTextId,
      ariaDescribedBy
    ].filter(Boolean).join(' ');
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && (
              <>
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}
        <input
          id={inputId}
          className={`border-light_dark w-full rounded border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue-500 focus:border-customBlue-500 ${
            error 
              ? "border-red-500 focus:ring-red-500 focus:border-red-500" 
              : ""
          } ${className}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedByIds || undefined}
          aria-required={required}
          ref={ref}
          onKeyDown={isKeyboard ? disableKeyboardInput : () => {}}
          {...props}
        />
        {error && (
          <div 
            id={errorId}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
            aria-live="polite"
          >
            <span className="sr-only">Error: </span>
            {error}
          </div>
        )}
        {helperText && !error && (
          <div 
            id={helperTextId}
            className="mt-1 text-sm text-gray-600 dark:text-gray-400"
          >
            {helperText}
          </div>
        )}
      </div>
    );
  },
);

export default Input;
