// apps/codebility/app/home/applicants/_service/processTimeline.ts
//
// Pure, data-driven derivation of an applicant's recruitment pipeline timeline.
// All stage states and timestamps are derived from the applicant record
// (the `codev` row plus its nested `applicant` relation). No hardcoded states.

import { NewApplicantType } from "@/types/applicants";

export type StageState = "completed" | "current" | "pending" | "denied";

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

export interface DerivedStage {
  key: PipelineStageKey;
  label: string;
  state: StageState;
  /** ISO timestamp string for the stage, or null when unavailable. */
  timestamp: string | null;
}

export interface DerivedTimeline {
  stages: DerivedStage[];
  /** True when the application_status could not be matched to a stage. */
  statusUnrecognized: boolean;
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

const TERMINAL_PASSED = "passed";
const TERMINAL_DENIED = "denied";

/**
 * Resolve the configured stages into a single deterministic sequence.
 * Sorts by `order` ascending, breaking ties alphabetically by label, and
 * de-duplicates by key so each stage appears exactly once.
 */
export function getOrderedStages(
  stages: PipelineStageDefinition[] = PIPELINE_STAGES,
): PipelineStageDefinition[] {
  const seen = new Set<PipelineStageKey>();
  return [...stages]
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
    .filter((stage) => {
      if (seen.has(stage.key)) return false;
      seen.add(stage.key);
      return true;
    });
}

/** Pick the timestamp for a stage from the applicant record. */
function getStageTimestamp(
  key: PipelineStageKey,
  applicant: NewApplicantType,
): string | null {
  const sub = applicant.applicant ?? null;
  switch (key) {
    case "applying":
      return applicant.date_applied ?? null;
    case "testing":
      return sub?.test_taken ?? null;
    case "onboarding":
      return sub?.commitment_signed_at ?? sub?.quiz_completed_at ?? null;
    case "waitlist":
      return sub?.waitlist_entered_at ?? null;
    default:
      return null;
  }
}

/**
 * Determine the index of the furthest stage the applicant has demonstrably
 * reached based on available timestamps. Used to place the Denied/Failed
 * marker when the status is terminal `denied`.
 */
function furthestReachedIndex(
  ordered: PipelineStageDefinition[],
  applicant: NewApplicantType,
): number {
  let furthest = 0;
  ordered.forEach((stage, index) => {
    if (getStageTimestamp(stage.key, applicant)) {
      furthest = index;
    }
  });
  return furthest;
}

/**
 * Derive the full timeline (stage list + per-stage state and timestamp) for an
 * applicant from their stored data.
 */
export function deriveTimeline(
  applicant: NewApplicantType,
  stages: PipelineStageDefinition[] = PIPELINE_STAGES,
): DerivedTimeline {
  const ordered = getOrderedStages(stages);
  const status = (applicant.application_status ?? "").toLowerCase();

  const withTimestamps = (state: (index: number) => StageState): DerivedStage[] =>
    ordered.map((stage, index) => ({
      key: stage.key,
      label: stage.label,
      state: state(index),
      timestamp: getStageTimestamp(stage.key, applicant),
    }));

  // Terminal: passed -> every stage completed.
  if (status === TERMINAL_PASSED) {
    return { stages: withTimestamps(() => "completed"), statusUnrecognized: false };
  }

  // Terminal: denied -> mark the furthest reached stage as denied,
  // preceding stages completed, following stages pending.
  if (status === TERMINAL_DENIED) {
    const deniedAt = furthestReachedIndex(ordered, applicant);
    return {
      stages: withTimestamps((index) =>
        index < deniedAt ? "completed" : index === deniedAt ? "denied" : "pending",
      ),
      statusUnrecognized: false,
    };
  }

  // Non-terminal: status maps to a pipeline stage.
  const currentIndex = ordered.findIndex((stage) => stage.key === status);

  if (currentIndex === -1) {
    // Unrecognized status: render all stages as pending.
    return { stages: withTimestamps(() => "pending"), statusUnrecognized: true };
  }

  return {
    stages: withTimestamps((index) =>
      index < currentIndex ? "completed" : index === currentIndex ? "current" : "pending",
    ),
    statusUnrecognized: false,
  };
}

/**
 * Format a timestamp as a localized calendar date. Returns null for absent or
 * unparseable values so the caller can render a placeholder.
 */
export function formatStageDate(timestamp: string | null): string | null {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
