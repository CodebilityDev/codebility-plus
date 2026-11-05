"use client";

import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { cn } from "@/utils/global/cn";
import * as React from "react";

export const StepperHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = React.useContext(StepperContext);

  return (
    <div
      ref={ref}
      className={cn(
        orientation === "horizontal"
          ? "flex flex-row items-center justify-between overflow-clip"
          : "relative flex flex-col space-y-1",
        className,
      )}
      {...props}
    />
  );
});
StepperHeader.displayName = "StepperHeader";
