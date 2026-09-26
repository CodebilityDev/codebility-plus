import type { ProjectInfo } from "@/types/marketing/profiles/profiles";
import { fetchApiJson } from "@/utils/global/api-fetch";

export const projectsPromises = new Map<string, Promise<ProjectInfo[]>>();

export function loadProjects(codevId: string): Promise<ProjectInfo[]> {
  const cached = projectsPromises.get(codevId);
  if (cached) return cached;

  const promise = fetchApiJson<{ projects: ProjectInfo[] }>(
    `/api/profile-projects/${codevId}`,
    { cache: "force-cache" },
  ).then((result) => {
    if (!result.ok) return [];
    return result.data.projects ?? [];
  });

  projectsPromises.set(codevId, promise);
  return promise;
}
