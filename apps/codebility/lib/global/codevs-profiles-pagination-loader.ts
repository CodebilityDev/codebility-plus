import type { CodevsProfilesPage } from "@/types/global/codevs-profiles";
import { fetchApiJson } from "@/utils/global/api-fetch";
import { pageCacheKey, filterCacheKey } from "@/utils/global/marketing";

export const pagePromises = new Map<string, Promise<CodevsProfilesPage>>();

export const pageMetaCache = new Map<string, CodevsProfilesPage["pagination"]>();

export function rememberPagination(
  position: string,
  page: number,
  pageSize: number,
  pagination: CodevsProfilesPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(position, page, pageSize), pagination);
  pageMetaCache.set(filterCacheKey(position, pageSize), pagination);
}

export function resolvePagination(
  position: string,
  page: number,
  pageSize: number,
  initialData: CodevsProfilesPage,
): CodevsProfilesPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(position, page, pageSize)) ??
    pageMetaCache.get(filterCacheKey(position, pageSize)) ??
    (position === initialData.position
      ? initialData.pagination
      : { page, limit: pageSize, total: 0, totalPages: 0 })
  );
}

export function loadPage(
  position: string,
  page: number,
  pageSize: number,
  initialData: CodevsProfilesPage,
): Promise<CodevsProfilesPage> {
  const key = pageCacheKey(position, page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (
    page === initialData.pagination.page &&
    position === initialData.position
  ) {
    rememberPagination(
      position,
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
  if (position) {
    params.set("position", position);
  }

  const promise = fetchApiJson<CodevsProfilesPage>(
    `/api/codevs-profiles?${params.toString()}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching codevs profiles page:", result.error);
      const fallback = {
        codevs: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: 0,
        },
        positions: initialData.positions,
        position,
      };
      rememberPagination(position, page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(position, page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}
