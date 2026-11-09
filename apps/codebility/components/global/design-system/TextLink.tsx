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
          "inline-flex items-center gap-[var(--cb-space-8)] text-[15px] leading-5 text-[color:var(--cb-p400)] transition-colors hover:text-[color:var(--cb-p200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
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
