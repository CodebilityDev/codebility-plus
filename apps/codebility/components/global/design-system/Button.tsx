import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@codevs/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#9747ff] text-white hover:bg-[#8435ea]",
        outline:
          "border border-white/30 text-[#f4f4f4] hover:border-transparent hover:bg-[#f4f4f4] hover:text-[#030303]",
        ghost: "text-[#f4f4f4] hover:bg-white/10",
      },
      size: {
        sm: "h-10 px-[18px] text-[15px] leading-5",
        md: "h-12 px-6 text-[17px] leading-5",
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
