import { Suspense } from "react";

import { notFound, redirect } from "next/navigation";

import ProjectDetailContributors from "@/components/home/projects/ProjectDetailContributors";
import ProjectDetailHeader from "@/components/home/projects/ProjectDetailHeader";
import ProjectDetailInfo from "@/components/home/projects/ProjectDetailInfo";
import ProjectOverlays from "@/components/home/projects/ProjectOverlays";
import ProjectsSkeleton from "@/components/home/projects/ProjectsSkeleton";
import pathsConfig from "@/constants/global/paths";
import { getAccessibleProjectIds, getAccess } from "@/lib/global/permissions";
import { getCachedContributors, getCachedProject } from "@/lib/home/projects/projects-cached";

export const instant = false;

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const [project, contributors, accessibleProjectIds, { hasFullAccess }] =
    await Promise.all([
      getCachedProject(projectId),
      getCachedContributors(projectId),
      getAccessibleProjectIds(),
      getAccess(),
    ]);

  if (accessibleProjectIds && !accessibleProjectIds.includes(projectId)) {
    redirect(pathsConfig.app.home);
  }

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailHeader project={project} canManage={hasFullAccess} />
      <ProjectDetailInfo project={project} />
      <ProjectDetailContributors
        projectId={projectId}
        contributors={contributors}
        canManage={hasFullAccess}
      />
      <ProjectOverlays />
    </div>
  );
}
