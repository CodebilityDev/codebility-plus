import ProjectCard from "@/components/home/projects/ProjectCard";
import type { ProjectListItem } from "@/types/home/projects/projects";

export default function ProjectsGrid({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
