"use client";

import { Suspense, use } from "react";
import { fetchApiJson } from "@/utils/global/api-fetch";

import ProjectList from "@/components/marketing/profiles/ProfileDetailProjectList";
import type { ProjectInfo } from "@/types/marketing/profiles/profiles";
import { ProfileProjectsSkeleton } from "@/components/marketing/profiles/ProfileProjectsSkeleton";

const projectsPromises = new Map<string, Promise<ProjectInfo[]>>();

function loadProjects(codevId: string): Promise<ProjectInfo[]> {
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

function ProfileProjectsContent({ codevId }: { codevId: string }) {
  const projects = use(loadProjects(codevId));

  if (projects.length === 0) {
    return null;
  }

  return <ProjectList projects={projects} />;
}

export default function ProfileProjectsSection({
  codevId,
}: {
  codevId: string;
}) {
  return (
    <Suspense fallback={<ProfileProjectsSkeleton count={2} />}>
      <ProfileProjectsContent codevId={codevId} />
    </Suspense>
  );
}
