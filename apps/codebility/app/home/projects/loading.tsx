import H1 from "@/components/global/layout/H1";
import ProjectsSkeleton from "@/components/home/projects/ProjectsSkeleton";

export default function ProjectsLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <H1>Projects</H1>
      <ProjectsSkeleton />
    </div>
  );
}
