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
          "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] aria-disabled:pointer-events-none aria-disabled:opacity-50",
          active
            ? "border border-purple-400 bg-[#9747ff] text-purple-100"
            : "text-white/60 hover:bg-white/5 hover:text-[#f4f4f4]",
          className,
        )}
        {...props}
      />
    );
  },
);

NavItem.displayName = "NavItem";

export { NavItem };
