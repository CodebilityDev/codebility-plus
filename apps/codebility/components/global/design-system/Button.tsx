import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@codevs/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[var(--cb-space-8)] whitespace-nowrap rounded-[var(--cb-radius-full)] font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[color:var(--cb-primary)] text-[color:var(--cb-text-on-action)] hover:bg-[color:var(--cb-primary-hover)]",
        outline:
          "border border-[color:color-mix(in_srgb,var(--cb-white)_30%,transparent)] text-[color:var(--cb-text)] hover:border-transparent hover:bg-[color:var(--cb-white)] hover:text-[color:var(--cb-bg)]",
        ghost:
          "text-[color:var(--cb-text)] hover:bg-[color:var(--cb-glass-hover)]",
      },
      size: {
        sm: "h-[var(--cb-size-40)] px-[var(--cb-space-18)] text-[15px] leading-5",
        md: "h-[var(--cb-size-48)] px-[var(--cb-space-24)] text-[17px] leading-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = "button", ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;
