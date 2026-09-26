import type { CareersJobListingsPage, CareersJobListingsInitial } from "@/types/global/careers-job-listings";
import { fetchApiJson } from "@/utils/global/api-fetch";
import { pageCacheKey, filterCacheKey } from "@/utils/marketing/careers/careers";

export const pagePromises = new Map<string, Promise<CareersJobListingsPage>>();

export const pageMetaCache = new Map<string, CareersJobListingsPage["pagination"]>();

export function rememberPagination(
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

export function loadPage(
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

export function resolvePagination(
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
