import { use } from "react";
import H1 from "@/Components/shared/dashboard/H1";
import { ProjectT } from "@/types/index";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import ProjectCard from "./_components/ProjectCard";
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Projects</H1>
        <div className="flex items-center gap-4">
          <InsertButton />
        </div>
      </div>
      {Projects && Projects.length > 0 && (
        <ProjectCard projects={Projects as ProjectT[]} />
      )}
    </div>
  );
};

export default Projects;
