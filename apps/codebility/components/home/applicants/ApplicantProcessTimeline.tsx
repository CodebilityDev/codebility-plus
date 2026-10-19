// Renders the "Application Progress" timeline inside the applicant View Details
// modal. Stage states and timestamps are derived entirely from the applicant
// record (see utils/home/applicants/process-timeline.ts). Wrapped in an error
// boundary so a timeline failure never prevents the rest of the modal from
// rendering.

"use client";

import TimelineErrorBoundary from "@/components/home/applicants/TimelineErrorBoundary";
import { TimelineBody } from "@/components/home/applicants/TimelineBody";
import type { ApplicantProcessTimelineProps } from "@/types/home/applicants/applicants";

const ApplicantProcessTimeline = ({
  applicant,
}: ApplicantProcessTimelineProps) => {
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
