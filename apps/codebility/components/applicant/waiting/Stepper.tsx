"use client";

import * as React from "react";
import { cn } from "@/utils/global/cn";

import type { StepperProps } from "@/types/applicant/waiting/waiting";
import { StepperContext } from "@/providers/applicant/waiting/StepperContext";
import { StepperBody } from "@/components/applicant/waiting/StepperBody";
import { StepperConnector } from "@/components/applicant/waiting/StepperConnector";
import { StepperContent } from "@/components/applicant/waiting/StepperContent";
import { StepperHeader } from "@/components/applicant/waiting/StepperHeader";
import { StepperStep } from "@/components/applicant/waiting/StepperStep";




const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      activeStep = 0,
      orientation = "horizontal",
      steps,
      onStepChange = () => null,
      className,
      ...props
    },
    ref,
  ) => {
    // Default to vertical on large screens, horizontal on small
    const [currentOrientation, setCurrentOrientation] = React.useState<
      "horizontal" | "vertical"
    >(orientation);

    // Check screen size and adapt orientation if needed
    React.useEffect(() => {
      const handleResize = () => {
        if (orientation !== "vertical" && orientation !== "horizontal") {
          setCurrentOrientation(
            window.innerWidth < 768 ? "horizontal" : "vertical",
          );
        } else {
          setCurrentOrientation(orientation);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [orientation]);

    const contextValue = React.useMemo(
      () => ({
        activeStep,
        orientation: currentOrientation,
        steps,
        onChange: onStepChange,
      }),
      [activeStep, currentOrientation, steps, onStepChange],
    );

    return (
      <StepperContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "h-full w-full",
            currentOrientation === "horizontal"
              ? "flex flex-col space-y-6"
              : "grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]",
            className,
          )}
          {...props}
        />
      </StepperContext.Provider>
    );
  },
);
Stepper.displayName = "Stepper";

export {
  Stepper,
  StepperHeader,
  StepperBody,
  StepperStep,
  StepperConnector,
  StepperContent,
};
