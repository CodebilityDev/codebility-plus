import { use } from "react";
import H1 from "@/Components/shared/dashboard/H1";
import { Project } from "@/types/home/codev";

import AddProjectButton from "./_components/AddProjectButton";
import ProjectCardContainer from "./_components/ProjectCardContainer";
import ProjectFilterButton from "./_components/ProjectFilterButton";
import { createClientServerComponent } from "@/utils/supabase/server";

type PageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

const Projects = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const supabase = await createClientServerComponent();
  const filter = searchParams.filter;

  const Projects = await supabase
    .from("projects")
    .select(
      `
      *,
      project_members (
        id,
        codev_id,
        role,
        joined_at,
        codev (
          first_name,
          last_name,
          image_url
        )
      )
      `,
    )
    .then(({ data, error }) => {
      if (error) throw error;

      if (filter && filter !== "all") {
        return data?.filter(
          (project) => project.status?.toLowerCase() === filter.toLowerCase(),
        );
      }
      return data;
    });

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
