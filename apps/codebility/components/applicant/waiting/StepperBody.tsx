"use client";

import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { cn } from "@/utils/global/cn";
import * as React from "react";

export const StepperBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { orientation } = React.useContext(StepperContext);

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        orientation === "vertical" ? "mt-2 md:mt-0" : "mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
StepperBody.displayName = "StepperBody";
