import * as React from "react";

export type Step = {
  title: string;
  description?: string;
  optional?: boolean;
};

export type StepperContextValue = {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  steps: Step[];
  onChange: (step: number) => void;
};

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  steps: Step[];
  onStepChange?: (step: number) => void;
}
