import { Skeleton } from "@codevs/ui/skeleton";

import KanbanBoardSkeleton from "@/components/home/kanban/KanbanBoardSkeleton";

export default function KanbanBoardPageSkeleton() {
  return (
    <div aria-busy="true" className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-6">
        <Skeleton className="mb-2 h-4 w-48" />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <div className="px-4">
        <KanbanBoardSkeleton />
      </div>
    </div>
  );
}
