"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  asChild?: boolean;
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={cn(
          "absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0",
          className,
        )}
        {...props}
      />
    );
  },
);
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
