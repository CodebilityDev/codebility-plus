import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@codevs/ui";

const buttonVariants = cva(
  "text-md inline-flex w-full items-center justify-center whitespace-nowrap rounded-md px-6 py-2 ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed lg:text-lg",
  {
    variants: {
      variant: {
        default: "bg-blue-100 text-white hover:bg-blue-200",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        hollow:
          "border border border-[#8e8e8e] bg-white hover:opacity-80 dark:border dark:border-[#8e8e8e] dark:bg-[#444857] dark:text-white",
        link: "text-dark-100 hover:text-blue-100 dark:text-white  hover:dark:text-blue-100",
        destructive: "bg-red-100 text-white hover:bg-red-200",
        secondary: "primary-gradient hover:opacity-80",
        gradient:
          "bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300",
        outline: "border border-white bg-transparent text-white",
        purple: "bg-[#9747FF] text-white dark:text-black",
        darkgray:
          "border-2 border-[#ffffff]/15 bg-[#ffffff]/15 text-white hover:bg-[#C108FE]",
      },
      size: {
        default: "h-10",
        sm: "h-9 rounded-md",
        lg: "h-12 rounded-md",
        icon: "h-10 w-10",
      },
      rounded: {
        none: "",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    rounded, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    loadingText = "Loading...",
    disabled,
    children,
    "aria-describedby": ariaDescribedBy,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, rounded, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-describedby={loading ? `loading-state ${ariaDescribedBy || ''}`.trim() : ariaDescribedBy}
        {...props}
      >
        {loading && (
          <>
            <span className="sr-only" id="loading-state">
              Loading, please wait
            </span>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </>
        )}
        {loading ? loadingText : children}
        {variant === "destructive" && !loading && (
          <span className="sr-only"> - This action cannot be undone</span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
