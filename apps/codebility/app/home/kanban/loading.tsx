import H1 from "@/components/global/layout/H1";
import KanbanListSkeleton from "@/components/home/kanban/KanbanListSkeleton";

export default function KanbanProjectsLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <H1>Kanban</H1>
      <KanbanListSkeleton />
    </div>
  );
}
