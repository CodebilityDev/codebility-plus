"use client";

import { Suspense, use, useState, useTransition } from "react";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@codevs/ui/badge";
import type {
  CareersJobListingsInitial,
  CareersJobListingsPage,
} from "@/types/marketing/careers-job-listings";
import { fetchApiJson } from "@/utils/api-fetch";

import type { JobListing } from "../_types/job-listings";
import JobApplicationModal from "./JobApplicationModal";
import { JobListingsSkeleton } from "./JobListingsSkeleton";

const JOB_TYPES = ["All", "Full-time", "Part-time", "Contract", "Internship"];
const JOB_LEVELS = ["All", "Entry", "Mid", "Senior", "Lead"];

const pagePromises = new Map<string, Promise<CareersJobListingsPage>>();
const pageMetaCache = new Map<string, CareersJobListingsPage["pagination"]>();

function pageCacheKey(
  department: string,
  type: string,
  level: string,
  page: number,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${page}:${pageSize}`;
}

function filterCacheKey(
  department: string,
  type: string,
  level: string,
  pageSize: number,
) {
  return `${department}:${type}:${level}:${pageSize}`;
}

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

function getLevelColor(level: string) {
  switch (level) {
    case "Entry":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "Mid":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Senior":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Lead":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Full-time":
      return "bg-customTeal/10 text-customTeal border-customTeal/20";
    case "Part-time":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Contract":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "Internship":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

function JobCard({
  job,
  onApply,
}: {
  job: JobListing;
  onApply: (job: JobListing) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-customViolet-100/50 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-r from-customViolet-100/5 to-customBlue-100/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="purple"
              size="sm"
              className="h-8 w-full max-w-[80px] px-3 text-xs sm:mt-0 sm:w-auto"
              onClick={() => onApply(job)}
            >
              Apply
            </Button>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-300">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={getLevelColor(job.level)}>
            {job.level}
          </Badge>
          <Badge variant="outline" className={getTypeColor(job.type)}>
            {job.type}
          </Badge>
          {job.remote && (
            <Badge
              variant="outline"
              className="border-green-500/20 bg-green-500/10 text-green-400"
            >
              Remote
            </Badge>
          )}
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">
            Posted {new Date(job.posted_date).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-800/50 px-2.5 py-1 text-xs text-gray-400"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobListingsPaginationSlot({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return <div className="mt-12 min-h-[2.5rem]" aria-hidden="true" />;
  }

  const currentPage = Math.min(page, totalPages);

  return (
    <div className="mt-12 flex items-center justify-center">
      <div className="flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-900/30 p-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        <div className="flex gap-1 px-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`h-8 w-8 rounded text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? "bg-customViolet-100 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-800 hover:text-white disabled:pointer-events-none disabled:opacity-50"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
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

interface Props {
  initialData: CareersJobListingsInitial;
  pageSize: number;
}

export default function JobListingsPagination({
  initialData,
  pageSize,
}: Props) {
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
