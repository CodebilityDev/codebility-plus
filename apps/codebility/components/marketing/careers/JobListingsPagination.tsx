"use client";

import { Suspense, use, useState, useTransition } from "react";



import type { CareersJobListingsInitial, CareersJobListingsPage } from "@/types/global/careers-job-listings";
import { fetchApiJson } from "@/utils/global/api-fetch";

import type { JobListing } from "@/types/global/job-listings";
import JobApplicationModal from "@/components/marketing/careers/JobApplicationModal";
import { JobListingsSkeleton } from "@/components/marketing/careers/JobListingsSkeleton";
import { JobCard } from "@/components/marketing/careers/JobCard";
import { JobListingsPaginationSlot } from "@/components/marketing/careers/JobListingsPaginationSlot";
import { JOB_TYPES, JOB_LEVELS } from "@/constants/marketing/careers/careers";
import type { JobListingsPaginationProps } from "@/types/marketing/careers/careers";
import { pageCacheKey, filterCacheKey } from "@/utils/marketing/careers/careers";


const pagePromises = new Map<string, Promise<CareersJobListingsPage>>();
const pageMetaCache = new Map<string, CareersJobListingsPage["pagination"]>();

function rememberPagination(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
  pagination: CareersJobListingsPage["pagination"],
) {
  pageMetaCache.set(
    pageCacheKey(department, type, level, page, pageSize),
    pagination,
  );
  pageMetaCache.set(
    filterCacheKey(department, type, level, pageSize),
    pagination,
  );
}

function loadPage(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
  initialData: CareersJobListingsInitial,
): Promise<CareersJobListingsPage> {
  const key = pageCacheKey(department, type, level, page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    department === initialData.department &&
    type === initialData.type &&
    level === initialData.level
  ) {
    rememberPagination(
      department,
      type,
      level,
      page,
      pageSize,
      initialData.pagination,
    );
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(pageSize),
  });
  if (department) params.set("department", department);
  if (type) params.set("type", type);
  if (level) params.set("level", level);

  const promise = fetchApiJson<CareersJobListingsPage>(
    `/api/careers-job-listings?${params.toString()}`,
    { cache: "force-cache" },
  ).then((result) => {
    const fallback: CareersJobListingsPage = {
      jobs: [],
      pagination: {
        page,
        limit: pageSize,
        total: 0,
        totalPages: 0,
      },
      department,
      type,
      level,
    };

    if (!result.ok) {
      console.error("Error fetching careers job listings page:", result.error);
      return fallback;
    }

    rememberPagination(
      department,
      type,
      level,
      page,
      pageSize,
      result.data.pagination,
    );
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}

function resolvePagination(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
  initialData: CareersJobListingsInitial,
): CareersJobListingsPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(department, type, level, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(department, type, level, pageSize)) ??
    (department === initialData.department &&
    type === initialData.type &&
    level === initialData.level
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

function JobListingsGridRemote({
  department,
  type,
  level,
  page,
  pageSize,
  initialData,
  onApply,
}: {
  department: string;
  type: string;
  level: string;
  page: number;
  pageSize: number;
  initialData: CareersJobListingsInitial;
  onApply: (job: JobListing) => void;
}) {
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

function JobListingsGrid({
  department,
  type,
  level,
  page,
  pageSize,
  initialData,
  onApply,
}: {
  department: string;
  type: string;
  level: string;
  page: number;
  pageSize: number;
  initialData: CareersJobListingsInitial;
  onApply: (job: JobListing) => void;
}) {
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

export default function JobListingsPagination({
  initialData,
  pageSize,
}: JobListingsPaginationProps) {
  const [department, setDepartment] = useState(initialData.department);
  const [type, setType] = useState(initialData.type);
  const [level, setLevel] = useState(initialData.level);
  const [page, setPage] = useState(initialData.pagination.page);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  rememberPagination(
    initialData.department,
    initialData.type,
    initialData.level,
    initialData.pagination.page,
    pageSize,
    initialData.pagination,
  );

  const departments = ["All", ...initialData.departments];
  const hasActiveFilters = Boolean(department || type || level);
  const activePagination = resolvePagination(
    department,
    type,
    level,
    page,
    pageSize,
    initialData,
  );

  const onPageChange = (nextPage: number) => {
    startTransition(() => setPage(nextPage));
  };

  const onFilterChange = (
    value: string,
    filterType: "department" | "type" | "level",
  ) => {
    const normalized = value === "All" ? "" : value;
    startTransition(() => {
      if (filterType === "department") setDepartment(normalized);
      if (filterType === "type") setType(normalized);
      if (filterType === "level") setLevel(normalized);
      setPage(1);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setDepartment("");
      setType("");
      setLevel("");
      setPage(1);
    });
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
              {activePagination.total} position
              {activePagination.total !== 1 ? "s" : ""} found
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

      <div
        className={`transition-opacity duration-200 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <Suspense
          key={`${department}:${type}:${level}:${page}`}
          fallback={<JobListingsSkeleton count={pageSize} />}
        >
          <JobListingsGrid
            department={department}
            type={type}
            level={level}
            page={page}
            pageSize={pageSize}
            initialData={initialData}
            onApply={handleApply}
          />
        </Suspense>
      </div>

      <JobListingsPaginationSlot
        page={page}
        totalPages={Math.max(0, activePagination.totalPages)}
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
