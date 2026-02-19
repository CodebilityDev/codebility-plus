import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@codevs/ui";

const InputVariants = cva(
  "placeholder:text-gray md:text-md flex h-11 w-full rounded-lg rounded-sm bg-muted/50 p-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm  file:font-medium  placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 sm:text-sm lg:text-lg [&>span]:line-clamp-1",
  {
    variants: {
      variant: {
        default:
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        resume: "",
        lightgray:
          "border-lightgray text-black-100 dark:bg-dark-200 border bg-white dark:border-zinc-700 dark:text-white",
        darkgray: "text-gray-800 dark:bg-dark-200 dark:text-gray-200 bg-gray-100",
      },
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  label?: string;
  labelClassName?: string;
  parentClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelClassName,
      parentClassName,
      className,
      variant,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn(parentClassName)}>
        <label className={cn(labelClassName)}>{label}</label>
        <input
          type={type}
          className={cn(InputVariants({ variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
