import { Skeleton } from "@codevs/ui/skeleton";

import KanbanListSkeleton from "@/components/home/kanban/KanbanListSkeleton";

export default function KanbanSprintsPageSkeleton() {
  return (
    <div aria-busy="true" className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <Skeleton className="mb-2 h-4 w-48" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      <KanbanListSkeleton />
    </div>
  );
}
