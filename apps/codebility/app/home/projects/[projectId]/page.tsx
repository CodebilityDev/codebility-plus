import { Suspense } from "react";

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@codevs/ui/breadcrumb";

import ProjectDetailContributors from "@/components/home/projects/ProjectDetailContributors";
import ProjectDetailHeader from "@/components/home/projects/ProjectDetailHeader";
import ProjectDetailInfo from "@/components/home/projects/ProjectDetailInfo";
import ProjectOverlays from "@/components/home/projects/ProjectOverlays";
import ProjectDetailSkeleton from "@/components/home/projects/ProjectDetailSkeleton";
import pathsConfig from "@/constants/global/paths";
import { getAccessibleProjectIds, getAccess } from "@/lib/global/permissions";
import { getCachedContributors, getCachedProject } from "@/lib/home/projects/projects-cached";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={pathsConfig.app.projects}>Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function ProjectDetailContent({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const [accessibleProjectIds, { hasFullAccess, roleId }] = await Promise.all([
    getAccessibleProjectIds(),
    getAccess(),
  ]);

  if (accessibleProjectIds && !accessibleProjectIds.includes(projectId)) {
    redirect(pathsConfig.app.home);
  }

  const [project, contributors] = await Promise.all([
    getCachedProject(projectId),
    getCachedContributors(projectId),
  ]);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailHeader project={project} canManage={hasFullAccess} roleId={roleId} />
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
