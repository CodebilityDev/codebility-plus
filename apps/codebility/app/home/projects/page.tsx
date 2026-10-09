import { Suspense } from "react";

import OverlayTrigger from "@/components/global/OverlayTrigger";
import EmptyState from "@/components/global/feedback/EmptyState";
import H1 from "@/components/global/layout/H1";
import ProjectOverlays from "@/components/home/projects/ProjectOverlays";
import ProjectsGrid from "@/components/home/projects/ProjectsGrid";
import ProjectsSkeleton from "@/components/home/projects/ProjectsSkeleton";
import { getAccessibleProjectIds, getAccess } from "@/lib/global/permissions";
import { getCachedProjects } from "@/lib/home/projects/projects-cached";

export const instant = false;

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <H1>Projects</H1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsContent />
      </Suspense>
      <ProjectOverlays />
    </div>
  );
}

async function ProjectsContent() {
  const [projects, accessibleProjectIds, { hasFullAccess }] =
    await Promise.all([
      getCachedProjects(),
      getAccessibleProjectIds(),
      getAccess(),
    ]);

  const visibleProjects =
    accessibleProjectIds === null
      ? projects
      : projects.filter((project) => accessibleProjectIds.includes(project.id));

  if (visibleProjects.length === 0) {
    return (
      <EmptyState
        title="No projects assigned"
        description="Projects appear here once an admin assigns you to them."
      />
    );
  }

  return (
    <>
      {hasFullAccess && (
        <div className="mb-4 flex justify-end">
          <OverlayTrigger type="projectCreateDrawer">New project</OverlayTrigger>
        </div>
      )}
      <ProjectsGrid projects={visibleProjects} />
    </>
  );
}
