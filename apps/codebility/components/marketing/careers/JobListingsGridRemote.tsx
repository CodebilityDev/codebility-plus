"use client";

import { JobCard } from "@/components/marketing/careers/JobCard";
import { loadPage } from "@/lib/marketing/careers/job-listings-pagination-loader";
import type { JobListingsGridRemoteProps } from "@/types/marketing/careers/careers";
import { use } from "react";

export function JobListingsGridRemote({
  department,
  type,
  level,
  page,
  pageSize,
  initialData,
  onApply,
}: JobListingsGridRemoteProps) {
  const data = use(
    loadPage(department, type, level, page, pageSize, initialData),
  );

  if (data.jobs.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">
          No positions match your current filters. Try adjusting your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {data.jobs.map((job) => (
        <JobCard key={job.id} job={job} onApply={onApply} />
      ))}
    </div>
  );
}
