import type { PipelineStageDefinition } from "@/types/home/applicants/applicants";


/**
 * The configured recruitment pipeline. Terminal outcomes (`passed`, `denied`)
 * are represented as stage *states*, not as additional sequential stages.
 */
export const PIPELINE_STAGES: PipelineStageDefinition[] = [
  { key: "applying", label: "Applying", order: 0 },
  { key: "testing", label: "Testing", order: 1 },
  { key: "onboarding", label: "Onboarding", order: 2 },
  { key: "waitlist", label: "Waitlist", order: 3 },
];

export const TERMINAL_PASSED = "passed";
export const TERMINAL_DENIED = "denied";
