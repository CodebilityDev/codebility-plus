import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@codevs/ui";

const iconButtonVariants = cva(
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        outline:
          "border-white/20 bg-white/[0.04] text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white",
        ghost:
          "border-transparent text-white/70 hover:bg-white/10 hover:text-white",
        primary:
          "border-purple-400/40 bg-[#9747ff] text-white hover:bg-[#8435ea]",
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
