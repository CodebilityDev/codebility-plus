import type { ServicesCategorySlug } from "@/types/global/constants";
import type { ServicesProjectsPage } from "@/types/global/lib";
import { fetchApiJson } from "@/utils/global/api-fetch";
import { pageCacheKey, filterCacheKey } from "@/utils/marketing/services/services";

export const pagePromises = new Map<string, Promise<ServicesProjectsPage>>();

export const pageMetaCache = new Map<string, ServicesProjectsPage["pagination"]>();

export function rememberPagination(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  pagination: ServicesProjectsPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(category, page, pageSize), pagination);
  pageMetaCache.set(filterCacheKey(category, pageSize), pagination);
}

export function resolvePagination(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  initialData: ServicesProjectsPage,
): ServicesProjectsPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(category, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(category, pageSize)) ??
    (category === initialData.category
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

export function loadPage(
  category: ServicesCategorySlug,
  page: number,
  pageSize: number,
  initialData: ServicesProjectsPage,
): Promise<ServicesProjectsPage> {
  const key = pageCacheKey(category, page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    category === initialData.category
  ) {
    rememberPagination(category, page, pageSize, initialData.pagination);
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const promise = fetchApiJson<ServicesProjectsPage>(
    `/api/services-projects?category=${category}&page=${page}&limit=${pageSize}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching services projects page:", result.error);
      const fallback = {
        projects: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        category,
      };
      rememberPagination(category, page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(category, page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}
