import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@codevs/ui";

const buttonVariants = cva(
  "text-md inline-flex w-full items-center justify-center whitespace-nowrap rounded-md px-6 py-2 ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 lg:text-lg",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, rounded, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, rounded, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
