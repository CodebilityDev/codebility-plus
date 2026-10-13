import KanbanListSkeleton from "@/components/home/kanban/KanbanListSkeleton";

export default function KanbanSprintsLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <KanbanListSkeleton />
    </div>
  );
}
