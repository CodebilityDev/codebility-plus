"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { JobListing } from "@/types/global/job-listings";
import JobApplicationModal from "@/components/marketing/careers/JobApplicationModal";
import { JobCard } from "@/components/marketing/careers/JobCard";
import { JobListingsFilter } from "@/components/marketing/careers/JobListingsFilter";
import { JobListingsPaginationSlot } from "@/components/marketing/careers/JobListingsPaginationSlot";
import { JobListingsSkeleton } from "@/components/marketing/careers/JobListingsSkeleton";
import { PAGE_SIZE } from "@/constants/marketing/careers/careers";
import { careersHref } from "@/utils/marketing/careers/careers";
import type { JobListingsPaginationProps } from "@/types/marketing/careers/careers";

export default function JobListingsPagination({
  initialData,
}: JobListingsPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { department, type, level, pagination } = initialData;
  const page = pagination.page;
  const filters = { department, type, level };
  const hasActiveFilters = Boolean(department || type || level);

  const navigate = (next: Record<string, string>, nextPage: number) => {
    startTransition(() => {
      router.push(careersHref({ ...filters, ...next }, nextPage), {
        scroll: false,
      });
    });
  };

  const onPageChange = (nextPage: number) => {
    startTransition(() => {
      router.push(careersHref(filters, nextPage), { scroll: false });
    });
  };

  const clearFilters = () => {
    navigate({ department: "", type: "", level: "" }, 1);
  };

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <JobListingsFilter
        departments={initialData.departments}
        department={department}
        type={type}
        level={level}
        total={pagination.total}
        onSelect={navigate}
        onClear={clearFilters}
      />

      {isPending ? (
        <JobListingsSkeleton count={PAGE_SIZE} />
      ) : initialData.jobs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400">
            {hasActiveFilters
              ? "No positions match your current filters. Try adjusting your criteria."
              : "No open positions at the moment. Please check back later."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {initialData.jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))}
        </div>
      )}

      <JobListingsPaginationSlot
        page={page}
        totalPages={Math.max(0, pagination.totalPages)}
        onPageChange={onPageChange}
      />

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
      />
    </>
  );
}
