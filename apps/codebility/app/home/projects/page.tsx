import H1 from "@/components/shared/dashboard/H1";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import getProjects from "@/lib/server/project.service";
import { getOrSetCache } from "@/lib/server/redis-cache";
import { cacheKeys } from "@/lib/server/redis-cache-keys";
import { Project } from "@/types/home/codev";
import { createClientServerComponent } from "@/utils/supabase/server";
import PageContainer from "../_components/PageContainer";

import AddProjectButton from "./_components/AddProjectButton";
import ProjectCardContainer from "./_components/ProjectCardContainer";
import ProjectFilterButton from "./_components/ProjectFilterButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

const Projects = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const supabase = await createClientServerComponent();
  const filter = searchParams.filter;

  /*  const allProjects = await getOrSetCache(cacheKeys.projects.all, () =>
    getProjects(),
  ); */
  /* to be back on redis */
  const allProjects = await getProjects();

  const Projects =
    filter && filter !== "all"
      ? allProjects?.filter(
          (project) => project.status?.toLowerCase() === filter.toLowerCase(),
        )
      : allProjects;

  if (!Projects) {
    return (
      <PageContainer maxWidth="xl">
        <H1>Projects</H1>
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold">No projects found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="xl">
      <AsyncErrorBoundary
        fallback={
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-4xl">📁</div>
            <h2 className="mb-2 text-xl font-semibold">Unable to load projects</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Something went wrong while fetching your projects. Please refresh the page to try again.
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
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
      </AsyncErrorBoundary>
    </PageContainer>
  );
};
export default Projects;
