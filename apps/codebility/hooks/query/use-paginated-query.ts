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

  // The seed's own server timestamp, not 0. `0` marks it instantly stale, which
  // refetches page 1 on every load even though the server just rendered it. The
  // filter case needs no special handling: a changed filter is a different key,
  // gets no seed, and fetches because it has no data at all.
  const seededAt = initialData?.fetchedAt ?? Date.now();

  const query = useQuery<Page<T>>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...rest,
    ...(seeded ? { initialData, initialDataUpdatedAt: seededAt } : {}),
  });

  // The rows on screen do not belong to the current key yet, so they are the
  // wrong rows for what the user just asked for. `isPlaceholderData` covers that
  // and `isPending` covers a cold key. `isFetching` is deliberately excluded: it
  // is also true for a same-key background refetch, where the visible rows are
  // correct and a skeleton would flash over good data.
  return { ...query, showSkeleton: query.isPending || query.isPlaceholderData };
}
