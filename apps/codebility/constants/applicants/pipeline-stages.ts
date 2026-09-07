export type PipelineStageKey =
  | "applying"
  | "testing"
  | "onboarding"
  | "waitlist";

export interface PipelineStageDefinition {
  /** Stable key matching the relevant application_status values. */
  key: PipelineStageKey;
  /** Human-readable label rendered in the timeline. */
  label: string;
  /** Sequential order position (ascending). */
  order: number;
}

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
