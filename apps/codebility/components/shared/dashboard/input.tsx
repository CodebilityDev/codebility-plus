import * as React from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@codevs/ui";

const InputVariants = cva(
  "flex h-10 w-full rounded-md px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
  {
    variants: {
      variant: {
        default:
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        resume: " text-sm focus:outline-none md:text-lg ",
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
      <div className={cn("pt-5", parentClassName)}>
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
