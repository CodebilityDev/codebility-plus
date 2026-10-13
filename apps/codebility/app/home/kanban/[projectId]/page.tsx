import { Suspense } from "react";

import { redirect } from "next/navigation";

import EmptyState from "@/components/global/feedback/EmptyState";
import H1 from "@/components/global/layout/H1";
import KanbanBreadcrumb from "@/components/home/kanban/KanbanBreadcrumb";
import KanbanListSkeleton from "@/components/home/kanban/KanbanListSkeleton";
import KanbanOverlays from "@/components/home/kanban/KanbanOverlays";
import KanbanSprintCreateButton from "@/components/home/kanban/KanbanSprintCreateButton";
import KanbanSprintsTable from "@/components/home/kanban/KanbanSprintsTable";
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

export const instant = false;

export default function KanbanSprintsPage({ params }: KanbanSprintsPageProps) {
  return (
    <Suspense fallback={<KanbanListSkeleton />}>
      <KanbanSprintsContent params={params} />
    </Suspense>
  );
}

async function KanbanSprintsContent({ params }: KanbanSprintsPageProps) {
  const { projectId } = await params;
  const [accessibleProjectIds, { hasFullAccess }] = await Promise.all([
    getAccessibleProjectIds(),
    getAccess(),
  ]);

  if (accessibleProjectIds && !accessibleProjectIds.includes(projectId)) {
    redirect(pathsConfig.app.home);
  }

  const canCreate =
    hasFullAccess || (await getProjectAccess(projectId)).isTeamLeader;
  const [projects, sprints] = await Promise.all([
    getCachedProjects(),
    getCachedSprints(projectId),
  ]);
  const project = projects.find((item) => item.id === projectId);
  const title = project?.name ?? "Project";

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <KanbanBreadcrumb
        items={[
          { label: "Kanban", href: pathsConfig.app.kanban },
          { label: title, href: pathsConfig.app.kanban + "/" + projectId },
        ]}
      />
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
      <KanbanOverlays />
    </div>
  );
}
