import { Suspense } from "react";

import { redirect } from "next/navigation";

import EmptyState from "@/components/global/feedback/EmptyState";
import H1 from "@/components/global/layout/H1";
import KanbanBreadcrumb from "@/components/home/kanban/KanbanBreadcrumb";
import KanbanSprintsPageSkeleton from "@/components/home/kanban/KanbanSprintsPageSkeleton";
import KanbanOverlays from "@/components/home/kanban/KanbanOverlays";
import KanbanSprintCreateButton from "@/components/home/kanban/KanbanSprintCreateButton";
import KanbanSprintsTable from "@/components/home/kanban/KanbanSprintsTable";
import { canManageTasks } from "@/constants/global/permissions";
import pathsConfig from "@/constants/global/paths";
import {
  getAccessibleProjectIds,
  getAccess,
  getProjectAccess,
} from "@/lib/global/permissions";
import {
  getCachedProjects,
  getCachedSprints,
} from "@/lib/home/kanban/kanban-cached";
import type { KanbanSprintsPageProps } from "@/types/home/kanban/kanban";

export default function KanbanSprintsPage({ params }: KanbanSprintsPageProps) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <KanbanBreadcrumb
        items={[{ label: "Kanban", href: pathsConfig.app.kanban }]}
      />
      <Suspense fallback={<KanbanSprintsPageSkeleton />}>
        <KanbanSprintsContent params={params} />
      </Suspense>
    </div>
  );
}

async function KanbanSprintsContent({ params }: KanbanSprintsPageProps) {
  const { projectId } = await params;
  const [
    accessibleProjectIds,
    { hasFullAccess, roleId },
    projectAccess,
    projects,
    sprints,
  ] = await Promise.all([
    getAccessibleProjectIds(),
    getAccess(),
    getProjectAccess(projectId),
    getCachedProjects(),
    getCachedSprints(projectId),
  ]);

  if (accessibleProjectIds && !accessibleProjectIds.includes(projectId)) {
    redirect(pathsConfig.app.home);
  }

  const canCreate = hasFullAccess || projectAccess.isTeamLeader;
  const project = projects.find((item) => item.id === projectId);
  const title = project?.name ?? "Project";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <H1>{title}</H1>
        <KanbanSprintCreateButton projectId={projectId} canCreate={canCreate} />
      </div>
      {sprints.length === 0 ? (
        <EmptyState
          title="No sprints yet"
          description="Create a sprint to open its board."
        />
      ) : (
        <KanbanSprintsTable projectId={projectId} sprints={sprints} />
      )}
      <KanbanOverlays canManage={canManageTasks(roleId)} />
    </>
  );
}
