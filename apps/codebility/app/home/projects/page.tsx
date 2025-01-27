import { use } from "react";
import H1 from "@/Components/shared/dashboard/H1";
import { Project } from "@/types/home/codev";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import ProjectsCard from "./_components/projects-card";
import InsertButton from "./_components/projects-insert-button";

const Projects = () => {
  const supabase = getSupabaseServerComponentClient();

  const Projects = use(
    supabase
      .from("projects")
      .select("*")
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }),
  );

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Projects</H1>
        <div className="flex items-center gap-4">
          <InsertButton />
        </div>
      </div>
      {Projects && Projects.length > 0 && (
        <ProjectsCard projects={Projects as Project[]} />
      )}
    </div>
  );
};

export default Projects;
