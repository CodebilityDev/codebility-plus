import { Suspense } from "react";

import { redirect } from "next/navigation";

import EmptyState from "@/components/global/feedback/EmptyState";
import H1 from "@/components/global/layout/H1";
import KanbanBoard from "@/components/home/kanban/KanbanBoard";
import KanbanBoardSkeleton from "@/components/home/kanban/KanbanBoardSkeleton";
import KanbanBreadcrumb from "@/components/home/kanban/KanbanBreadcrumb";
import KanbanConnectionBadge from "@/components/home/kanban/KanbanConnectionBadge";
import KanbanRealtimeBridge from "@/components/home/kanban/KanbanRealtimeBridge";
import pathsConfig from "@/constants/global/paths";
import {
  getAccessibleProjectIds,
  getAccess,
} from "@/lib/global/permissions";
import { getBoard } from "@/lib/home/kanban/kanban-cached";
import { KanbanStoreProvider } from "@/providers/home/kanban/KanbanStoreProvider";
import type { KanbanBoardPageProps } from "@/types/home/kanban/kanban";

export const instant = false;

export default function KanbanBoardPage({ params }: KanbanBoardPageProps) {
  return (
    <Suspense fallback={<KanbanBoardSkeleton />}>
      <KanbanBoardContent params={params} />
    </Suspense>
  );
}

async function KanbanBoardContent({ params }: KanbanBoardPageProps) {
  const { projectId, sprintId } = await params;
  const board = await getBoard(sprintId);

  if (!board) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <KanbanBreadcrumb
          items={[
            { label: "Kanban", href: pathsConfig.app.kanban },
            { label: "Project", href: pathsConfig.app.kanban + "/" + projectId },
          ]}
        />
        <EmptyState
          title="This sprint has no board"
          description="Open the sprint from the sprints list to provision one."
        />
      </div>
    );
  }

  const base = pathsConfig.app.kanban;

  const [accessibleProjectIds, { hasFullAccess }] = await Promise.all([
    getAccessibleProjectIds(),
    getAccess(),
  ]);

  if (!hasFullAccess && !accessibleProjectIds?.includes(board.projectId)) {
    redirect(pathsConfig.app.home);
  }

  return (
    <KanbanStoreProvider snapshot={board}>
      <KanbanRealtimeBridge boardId={board.boardId} sprintId={board.sprintId} />
      <div className="flex h-full min-h-0 flex-col">
        <div className="px-4 pt-6">
          <KanbanBreadcrumb
            items={[
              { label: "Kanban", href: base },
              { label: board.projectName, href: base + "/" + projectId },
              {
                label: board.sprintName ?? "Sprint",
                href: base + "/" + projectId + "/" + sprintId,
              },
            ]}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <H1>{board.sprintName ?? board.boardName}</H1>
            <KanbanConnectionBadge />
          </div>
        </div>
        {board.columns.length === 0 ? (
          <div className="px-4">
            <EmptyState
              title="This board has no columns"
              description="Add a column to start tracking tasks."
            />
          </div>
        ) : (
          <KanbanBoard />
        )}
      </div>
    </KanbanStoreProvider>
  );
}
