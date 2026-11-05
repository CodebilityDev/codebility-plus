"use client";

import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { cn } from "@/utils/global/cn";
import * as React from "react";

export const StepperContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { step: number }
>(({ className, step, children, ...props }, ref) => {
  const { activeStep } = React.useContext(StepperContext);
  const isActive = activeStep === step;

  if (!isActive) return null;

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
});
StepperContent.displayName = "StepperContent";
