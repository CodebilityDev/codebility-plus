import type { LandingInternsPage } from "@/types/global/lib";
import { fetchApiJson } from "@/utils/global/api-fetch";
import { pageCacheKey } from "@/utils/marketing/marketing";

export const pagePromises = new Map<string, Promise<LandingInternsPage>>();

export const pageMetaCache = new Map<string, LandingInternsPage["pagination"]>();

export function rememberPagination(
  page: number,
  pageSize: number,
  pagination: LandingInternsPage["pagination"],
) {
  pageMetaCache.set(pageCacheKey(page, pageSize), pagination);
  pageMetaCache.set(`rank:${pageSize}`, pagination);
}

export function resolvePagination(
  page: number,
  pageSize: number,
  initialData: LandingInternsPage,
): LandingInternsPage["pagination"] {
  return (
    pageMetaCache.get(pageCacheKey(page, pageSize)) ??
    pageMetaCache.get(`rank:${pageSize}`) ??
    initialData.pagination
  );
}

export function loadPage(
  page: number,
  pageSize: number,
  initialData: LandingInternsPage,
): Promise<LandingInternsPage> {
  const key = pageCacheKey(page, pageSize);
  const cached = pagePromises.get(key);
  if (cached) return cached;

  if (page === initialData.pagination.page) {
    rememberPagination(page, pageSize, initialData.pagination);
    const resolved = Promise.resolve(initialData);
    pagePromises.set(key, resolved);
    return resolved;
  }

  const promise = fetchApiJson<LandingInternsPage>(
    `/api/landing-interns?page=${page}&limit=${pageSize}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching landing interns page:", result.error);
      const fallback = {
        TEAM_MEMBERS: [],
        pagination: {
          page,
          limit: pageSize,
          total: 0,
          totalPages: Math.max(1, initialData.pagination.totalPages),
        },
      };
      rememberPagination(page, pageSize, fallback.pagination);
      return fallback;
    }

    rememberPagination(page, pageSize, result.data.pagination);
    return result.data;
  });

  pagePromises.set(key, promise);
  return promise;
}
