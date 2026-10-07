import H1 from "@/components/global/layout/H1";
import KanbanEmptyState from "@/components/home/kanban/KanbanEmptyState";
import KanbanProjectsTable from "@/components/home/kanban/KanbanProjectsTable";
import { getCachedProjects } from "@/lib/home/kanban/kanban-cached";

export const instant = false;

export default async function KanbanProjectsPage() {
  const projects = await getCachedProjects();

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <H1>Kanban</H1>
      {projects.length === 0 ? (
        <KanbanEmptyState
          title="No projects yet"
          description="A project gets a board area once it exists."
        />
      ) : (
        <KanbanProjectsTable projects={projects} />
      )}
    </div>
  );
}
