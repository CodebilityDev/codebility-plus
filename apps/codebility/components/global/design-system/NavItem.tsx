import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@codevs/ui";

export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  asChild?: boolean;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, active = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex h-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-full)] px-[var(--cb-space-16)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] aria-disabled:pointer-events-none aria-disabled:opacity-50",
          active
            ? "border border-[color:var(--cb-p400)] bg-[color:var(--cb-primary)] text-[color:var(--cb-p100)]"
            : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)]",
          className,
        )}
        {...props}
      />
    );
  },
);

NavItem.displayName = "NavItem";

export { NavItem };
