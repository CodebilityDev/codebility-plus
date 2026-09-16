/**
 * Shared profile-points reader.
 *
 * Eight components on /home/settings/profile each fetched
 * `/api/profile-points/[codevId]` on mount. That endpoint recomputes and
 * *persists* the user's points, so N identical requests meant N recomputations
 * and N writes for one page load.
 *
 * Deduplicates by in-flight promise: concurrent callers share one request, and
 * an explicit `invalidateProfilePoints()` is available for the mutation paths
 * that need fresh data after saving.
 */
/** Minimal shape every caller relies on; callers may narrow via the generic. */
export type ProfilePointsData = {
  points?: { category: string; points: number }[];
  totalPoints?: number;
};

const inflight = new Map<string, Promise<unknown>>();
const cache = new Map<string, unknown>();

/**
 * `T` lets a caller declare the response shape it expects (the endpoint returns
 * more than `ProfilePointsData`). Returns null when the request fails.
 */
export function fetchProfilePoints<T = ProfilePointsData>(
  codevId: string,
): Promise<T | null> {
  if (!codevId) return Promise.resolve(null);

  if (cache.has(codevId)) return Promise.resolve(cache.get(codevId) as T);

  const existing = inflight.get(codevId);
  if (existing) return existing as Promise<T | null>;

  const request = fetch(`/api/profile-points/${codevId}`)
    .then(async (res) => {
      if (!res.ok) return null;
      const data = (await res.json()) as T;
      cache.set(codevId, data);
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(codevId);
    });

  inflight.set(codevId, request);
  return request;
}

/** Drop the cached value so the next read re-runs the endpoint (post-save). */
export function invalidateProfilePoints(codevId?: string) {
  if (codevId) {
    cache.delete(codevId);
    inflight.delete(codevId);
  } else {
    cache.clear();
    inflight.clear();
  }
}
