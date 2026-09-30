"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { JobListing } from "@/types/global/job-listings";
import JobApplicationModal from "@/components/marketing/careers/JobApplicationModal";
import { JobCard } from "@/components/marketing/careers/JobCard";
import { JobListingsPaginationSlot } from "@/components/marketing/careers/JobListingsPaginationSlot";
import { JOB_TYPES, JOB_LEVELS } from "@/constants/marketing/careers/careers";
import type { JobListingsPaginationProps } from "@/types/marketing/careers/careers";

function buildHref(filters: Record<string, string>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));

  const query = params.toString();
  return query ? `/careers?${query}` : "/careers";
}

export default function JobListingsPagination({
  initialData,
  pageSize,
}: JobListingsPaginationProps) {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { department, type, level, pagination } = initialData;
  const page = pagination.page;
  const filters = { department, type, level };
  const departments = ["All", ...initialData.departments];
  const hasActiveFilters = Boolean(department || type || level);

  const navigate = (next: Record<string, string>, nextPage: number) => {
    router.push(buildHref({ ...filters, ...next }, nextPage), { scroll: false });
  };

  const onPageChange = (nextPage: number) => {
    router.push(buildHref(filters, nextPage), { scroll: false });
  };

  const onFilterChange = (
    value: string,
    filterType: "department" | "type" | "level",
  ) => {
    navigate({ [filterType]: value === "All" ? "" : value }, 1);
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
      <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900/30 p-6">
        <h3 className="mb-4 text-lg font-medium text-white lg:mb-6">
          Filter by Category
        </h3>
        <div className="space-y-4 lg:space-y-0">
          <div className="lg:grid lg:grid-cols-10 lg:gap-6">
            <div className="pb-4 lg:col-span-2 lg:pb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Department
              </label>
              <div className="flex flex-wrap gap-2">
                {departments.map((item) => {
                  const active =
                    (item === "All" && !department) || item === department;
                  return (
                    <button
                      key={item}
                      onClick={() => onFilterChange(item, "department")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-customViolet-100 text-white"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pb-4 lg:col-span-4 lg:pb-4 lg:ml-[-35px]">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Job Type
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((item) => {
                  const active = (item === "All" && !type) || item === type;
                  return (
                    <button
                      key={item}
                      onClick={() => onFilterChange(item, "type")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-customTeal text-white"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pb-4 lg:col-span-4 lg:pb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Experience Level
              </label>
              <div className="flex flex-wrap gap-2">
                {JOB_LEVELS.map((item) => {
                  const active = (item === "All" && !level) || item === level;
                  return (
                    <button
                      key={item}
                      onClick={() => onFilterChange(item, "level")}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        active
                          ? "bg-purple-500 text-white"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-800 pt-4 lg:mt-6">
            <span className="text-sm text-gray-400">
              {pagination.total} position
              {pagination.total !== 1 ? "s" : ""} found
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-customViolet-100 transition-colors hover:text-customViolet-200"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      </div>

      {initialData.jobs.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-400">
            No positions match your current filters. Try adjusting your criteria.
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