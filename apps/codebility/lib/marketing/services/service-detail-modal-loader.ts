import type { ServicesProjectDetail } from "@/types/global/lib";
import { fetchApiJson } from "@/utils/global/api-fetch";

export const detailPromises = new Map<string, Promise<ServicesProjectDetail | null>>();

export function loadDetail(projectId: string): Promise<ServicesProjectDetail | null> {
  const cached = detailPromises.get(projectId);
  if (cached) return cached;

  const promise = fetchApiJson<ServicesProjectDetail>(
    `/api/services-projects?id=${encodeURIComponent(projectId)}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) {
      console.error("Error fetching services project detail:", result.error);
      return null;
    }
    return result.data;
  });

  detailPromises.set(projectId, promise);
  return promise;
}
