import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@codevs/ui";

const iconButtonVariants = cva(
  "inline-flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] shrink-0 items-center justify-center rounded-[var(--cb-radius-full)] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline:
          "border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] bg-[color:var(--cb-glass)] text-[color:var(--cb-text-secondary)] hover:border-[color:color-mix(in_srgb,var(--cb-white)_30%,transparent)] hover:bg-[color:var(--cb-surface-hover)] hover:text-[color:var(--cb-text)]",
        ghost:
          "border-transparent text-[color:var(--cb-text-secondary)] hover:bg-[color:var(--cb-surface-hover)] hover:text-[color:var(--cb-text)]",
        primary:
          "border-[color:color-mix(in_srgb,var(--cb-p400)_40%,transparent)] bg-[color:var(--cb-primary)] text-[color:var(--cb-text)] hover:bg-[color:var(--cb-primary-hover)]",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

export interface IconButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
  label: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant, asChild = false, label, type = "button", ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        aria-label={label}
        className={cn(iconButtonVariants({ variant, className }))}
        {...props}
      />
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
export type IconButtonVariant = NonNullable<
  VariantProps<typeof iconButtonVariants>["variant"]
>;
