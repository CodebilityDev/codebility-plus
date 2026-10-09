import { Suspense } from "react";

import EmptyState from "@/components/global/feedback/EmptyState";
import H1 from "@/components/global/layout/H1";
import KanbanListSkeleton from "@/components/home/kanban/KanbanListSkeleton";
import KanbanProjectsTable from "@/components/home/kanban/KanbanProjectsTable";
import { getAccessibleProjectIds } from "@/lib/global/permissions";
import { getCachedProjects } from "@/lib/home/kanban/kanban-cached";

export const instant = false;

export default function KanbanProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <H1>Kanban</H1>
      <Suspense fallback={<KanbanListSkeleton />}>
        <KanbanProjectsContent />
      </Suspense>
    </div>
  );
}

async function KanbanProjectsContent() {
  const [projects, accessibleProjectIds] = await Promise.all([
    getCachedProjects(),
    getAccessibleProjectIds(),
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

  return <KanbanProjectsTable projects={visibleProjects} />;
}
