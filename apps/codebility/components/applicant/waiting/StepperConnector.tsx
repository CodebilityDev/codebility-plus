"use client";

import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { cn } from "@/utils/global/cn";
import * as React from "react";

export const StepperConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { index: number }
>(({ className, index, ...props }, ref) => {
  const { activeStep, orientation } = React.useContext(StepperContext);
  const isCompleted = activeStep > index;

  // Only render connector in horizontal mode
  if (orientation === "vertical") {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-[20px] flex-1 border-t sm:max-w-none", // Short on mobile, full length on desktop
        isCompleted ? "border-customBlue-100" : "border-muted-foreground/30",
        className,
      )}
      {...props}
    />
  );
});
StepperConnector.displayName = "StepperConnector";
