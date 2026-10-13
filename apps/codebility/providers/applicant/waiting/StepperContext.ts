import { createContext } from "react";

import type { StepperContextValue } from "@/types/applicant/waiting/waiting";

export const StepperContext = createContext<StepperContextValue>({
  activeStep: 0,
  orientation: "horizontal",
  steps: [],
  onChange: () => null,
});
