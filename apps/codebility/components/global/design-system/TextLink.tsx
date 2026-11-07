import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  disabled?: boolean;
}

const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(
  (
    { className, asChild = false, disabled = false, tabIndex, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        className={cn(
          "inline-flex items-center gap-2 text-[15px] leading-5 text-[#c084fc] transition-colors hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

TextLink.displayName = "TextLink";

export { TextLink };
