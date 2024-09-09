
import { useRouter } from "next/navigation"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

import Loading from "./_components/loading"
import ProjectCard from "./_components/ProjectCard"
import { ProjectT } from "@/types/index"
import useAuthCookie from "@/hooks/use-cookie"
import { Button } from "@/Components/ui/button"
import H1 from "@/Components/shared/dashboard/H1"
import { useModal } from "@/hooks/use-modal-projects"
import { useSupabase } from "@codevs/supabase/hooks/use-supabase";
import InsertButton from "./_components/projects-insert-button"
import { use } from "react"


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
          {/* {userType?.name === "ADMIN" && (
            <Button variant="default" className="items-center" onClick={() => onOpen("projectAddModal")}>
              Add New Project
            </Button>
          )} */}

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
