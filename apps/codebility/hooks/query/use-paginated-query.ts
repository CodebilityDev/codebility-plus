"use client";

import {
  hashKey,
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

import type { Page } from "@/lib/server/paginate";

type Options<T> = Omit<
  UseQueryOptions<Page<T>>,
  "queryKey" | "queryFn" | "initialData" | "initialDataUpdatedAt"
>;

export function usePaginatedQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<Page<T>>,
  options?: Options<T> & { initialData?: Page<T>; initialDataKey?: QueryKey },
) {
  const { initialData, initialDataKey, ...rest } = options ?? {};

  // initialData is page 1 of exactly one key. Seeding any other key with it hands
  // that key fresh data it never fetched, so under staleTime queryFn never runs
  // and the table renders the unfiltered seed forever. Both sides must match.
  const seeded = initialDataKey !== undefined && hashKey(queryKey) === hashKey(initialDataKey);

  return useQuery<Page<T>>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...rest,
    ...(seeded ? { initialData, initialDataUpdatedAt: 0 } : {}),
  });
}
