// apps/codebility/app/home/applicants/_components/ApplicantProcessTimeline.tsx
//
// Renders the "Application Progress" timeline inside the applicant View Details
// modal. Stage states and timestamps are derived entirely from the applicant
// record (see _service/processTimeline.ts). Wrapped in an error boundary so a
// timeline failure never prevents the rest of the modal from rendering.

"use client";

import React, { Component, ReactNode, useEffect } from "react";
import { cn } from "@/utils/utils";
import { AlertCircle, Check, Circle, Dot, X } from "lucide-react";

import { NewApplicantType } from "@/types/applicants";
import {
  deriveTimeline,
  formatStageDate,
  StageState,
} from "@/lib/applicants/process-timeline";

const STATE_STYLES: Record<
  StageState,
  { ring: string; node: string; label: string; icon: ReactNode }
> = {
  completed: {
    ring: "border-emerald-500 bg-emerald-500",
    node: "text-white",
    label: "text-emerald-600 dark:text-emerald-400",
    icon: <Check className="h-4 w-4" />,
  },
  current: {
    ring: "border-customBlue-500 bg-customBlue-500",
    node: "text-white",
    label: "text-customBlue-600 dark:text-customBlue-400 font-semibold",
    icon: <Dot className="h-6 w-6" />,
  },
  pending: {
    ring: "border-gray-300 bg-transparent dark:border-gray-600",
    node: "text-gray-400 dark:text-gray-500",
    label: "text-gray-400 dark:text-gray-500",
    icon: <Circle className="h-3 w-3" />,
  },
  denied: {
    ring: "border-red-500 bg-red-500",
    node: "text-white",
    label: "text-red-600 dark:text-red-400 font-semibold",
    icon: <X className="h-4 w-4" />,
  },
};

const STATE_BADGE: Record<StageState, { text: string; className: string }> = {
  completed: {
    text: "Completed",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  current: {
    text: "Current",
    className:
      "bg-customBlue-100 text-customBlue-800 dark:bg-customBlue-900/30 dark:text-customBlue-400",
  },
  pending: {
    text: "Pending",
    className:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  denied: {
    text: "Denied",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

function TimelineBody({ applicant }: { applicant: NewApplicantType }) {
  const { stages, statusUnrecognized } = deriveTimeline(applicant);

  // Req 5.5: record exactly one diagnostic log entry when the application
  // status cannot be matched to a pipeline stage — without surfacing it as an
  // Admin-facing warning beyond the inline note below.
  useEffect(() => {
    if (statusUnrecognized) {
      console.warn(
        "[ApplicantProcessTimeline] Unrecognized application_status",
        {
          applicantId: applicant.id,
          applicationStatus: applicant.application_status,
        },
      );
    }
  }, [statusUnrecognized, applicant.id, applicant.application_status]);

  // Req 2.6: if the pipeline resolves to zero stages, show an explicit
  // unavailable indication rather than an empty sequence.
  if (stages.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
        <span className="flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" />
          The application pipeline is currently unavailable.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <ol className="space-y-0">
        {stages.map((stage, index) => {
          const styles = STATE_STYLES[stage.state];
          const badge = STATE_BADGE[stage.state];
          const isLast = index === stages.length - 1;
          const date = formatStageDate(stage.timestamp);
          const connectorDone =
            stage.state === "completed" || stage.state === "current";

          return (
            <li key={stage.key} className="flex gap-3">
              {/* Node + connector */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2",
                    styles.ring,
                    styles.node,
                  )}
                  aria-hidden="true"
                >
                  {styles.icon}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 w-0.5 flex-1",
                      connectorDone
                        ? "bg-emerald-500"
                        : "bg-gray-200 dark:bg-gray-700",
                    )}
                    style={{ minHeight: "1.25rem" }}
                  />
                )}
              </div>

              {/* Stage details */}
              <div className={cn("flex-1", isLast ? "pb-0" : "pb-4")}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("text-sm", styles.label)}>
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      badge.className,
                    )}
                  >
                    {badge.text}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {date ?? "No date available"}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {statusUnrecognized && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-3.5 w-3.5" />
          Current stage could not be determined from the application status.
        </p>
      )}
    </div>
  );
}

interface BoundaryProps {
  children: ReactNode;
}

interface BoundaryState {
  hasError: boolean;
}

/**
 * Isolates timeline rendering failures so the surrounding modal still renders.
 * Satisfies the requirement that a timeline error never blocks the modal.
 */
class TimelineErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Silent diagnostic log; no Admin-facing warning beyond the fallback below.
    console.error("[ApplicantProcessTimeline] failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            The application progress timeline is currently unavailable.
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

const ApplicantProcessTimeline = ({
  applicant,
}: {
  applicant: NewApplicantType;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Application Progress</h3>
      <TimelineErrorBoundary>
        <TimelineBody applicant={applicant} />
      </TimelineErrorBoundary>
    </div>
  );
};

export default ApplicantProcessTimeline;
