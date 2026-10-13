"use client";

import { STATE_STYLES, STATE_BADGE } from "@/constants/home/applicants/applicants";

import { cn } from "@/utils/global/cn";
import { deriveTimeline, formatStageDate } from "@/utils/home/applicants/process-timeline";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import type { TimelineBodyProps } from "@/types/home/applicants/applicants";

export function TimelineBody({ applicant }: TimelineBodyProps) {
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
