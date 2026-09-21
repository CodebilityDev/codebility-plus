import H1 from "@/components/shared/dashboard/H1";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import { pageSize } from "@/constants";
import { getProjectsPage } from "@/lib/server/project.service";
import { Project } from "@/types/home/codev";
import PageContainer from "../_components/PageContainer";

import AddProjectButton from "./_components/AddProjectButton";
import ProjectCardContainer from "./_components/ProjectCardContainer";
import ProjectFilterButton from "./_components/ProjectFilterButton";


type PageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

const Projects = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const filter = searchParams.filter;

  const initialData = await getProjectsPage({ page: 1, pageSize: pageSize.projects });

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
          {initialData.total > 0 && (
            <ProjectCardContainer initialData={initialData as unknown as import("@/lib/server/paginate").Page<Project>} />
          )}
        </div>
      </AsyncErrorBoundary>
    </PageContainer>
  );
};
export default Projects;
