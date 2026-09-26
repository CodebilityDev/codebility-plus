import { fetchApiJson } from "@/utils/global/api-fetch";

export const ratingPromises = new Map<string, Promise<number>>();

export function loadRating(codevId: string): Promise<number> {
  const cached = ratingPromises.get(codevId);
  if (cached) return cached;

  const promise = fetchApiJson<{ rating: number }>(
    `/api/profile-rating/${codevId}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) return 0;
    return result.data.rating ?? 0;
  });

  ratingPromises.set(codevId, promise);
  return promise;
}
