"use client";

import {
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";

import type { Page } from "@/lib/server/paginate";

export function usePaginatedQuery<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<Page<T>>,
  options?: Omit<UseQueryOptions<Page<T>>, "queryKey" | "queryFn">,
) {
  return useQuery<Page<T>>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...options,
  });
}
