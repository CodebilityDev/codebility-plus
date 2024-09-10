

import ProjectCard from "./_components/ProjectCard"
import { ProjectT } from "@/types/index"
import H1 from "@/Components/shared/dashboard/H1"


import InsertButton from "./_components/projects-insert-button"
import { use } from "react"
import { useSupabase } from "@codevs/supabase/hooks/use-supabase"


const Projects = () => {


  const supabase = useSupabase();


  const Projects = use(supabase.from('projects').select('*').then(({ data, error }) => {
    if (error) throw error;
    return data;
  }));




  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>Projects</H1>
        <div className="flex items-center gap-4">

          <InsertButton/>
          
        </div>
      </div>
      {Projects && Projects.length > 0 && (
        <ProjectCard projects={Projects as ProjectT[]} />
      )}
    </div>
  );
};

export default Projects;
