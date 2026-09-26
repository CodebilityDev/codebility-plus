"use client";

import { JobCard } from "@/components/marketing/careers/JobCard";
import { JobListingsGridRemote } from "@/components/marketing/careers/JobListingsGridRemote";
import type { JobListingsGridProps } from "@/types/marketing/careers/careers";

export function JobListingsGrid({
  department,
  type,
  level,
  page,
  pageSize,
  initialData,
  onApply,
}: JobListingsGridProps) {
  if (
    page === initialData.pagination.page &&
    department === initialData.department &&
    type === initialData.type &&
    level === initialData.level
  ) {
    if (initialData.jobs.length === 0) {
      return (
        <div className="py-12 text-center">
          <p className="text-gray-400">
            No positions match your current filters. Try adjusting your
            criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {initialData.jobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={onApply} />
        ))}
      </div>
    );
  }

  return (
    <JobListingsGridRemote
      department={department}
      type={type}
      level={level}
      page={page}
      pageSize={pageSize}
      initialData={initialData}
      onApply={onApply}
    />
  );
}
