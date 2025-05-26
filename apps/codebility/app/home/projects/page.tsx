import H1 from "@/Components/shared/dashboard/H1";
import getProjects from "@/lib/server/project.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { Project } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";

import AddProjectButton from "./_components/AddProjectButton";
import ProjectCardContainer from "./_components/ProjectCardContainer";
import ProjectFilterButton from "./_components/ProjectFilterButton";
<<<<<<< HEAD

export const dynamic = "force-dynamic";
export const revalidate = 0;
=======
>>>>>>> 29c0d54e (implement cache in projects and services page. Change services page to server component)

type PageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

const Projects = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const supabase = await createClientServerComponent();
  const filter = searchParams.filter;

  const allProjects = await getOrSetCache(cacheKeys.projects.all, () =>
    getProjects(),
  );

  const Projects =
    filter && filter !== "all"
      ? allProjects?.filter(
          (project) => project.status?.toLowerCase() === filter.toLowerCase(),
        )
      : allProjects;

  if (!Projects) {
    return (
      <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
        <H1>Projects</H1>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold">No projects found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Projects</H1>
        <div className="flex items-center gap-4">
          <ProjectFilterButton />
          <AddProjectButton />
        </div>
      </div>
      {Projects && Projects.length > 0 && (
        <ProjectCardContainer projects={Projects as Project[]} />
      )}
    </div>
  );
};
export default Projects;
