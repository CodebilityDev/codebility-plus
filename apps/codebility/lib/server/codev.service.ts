import "server-only";

import { Codev, Project } from "@/types/home/codev";
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export const getCodevs = async (id?: string): Promise<{ error: any, data: Codev[] | Codev | null}> => {
    const supabase = getSupabaseServerComponentClient();

    let codevQuery = supabase.from("codev")
    .select(`
      *,
      user(
        *,
        profile(*),
        social(*)
      )
    `)
    .eq("type", "INHOUSE");
    
    if (id) {
      // filter codevs data to get only match id.
      codevQuery = codevQuery.eq("id", id);
    }

    const { data: codevs, error } = await codevQuery;
    
    if (error) return { error, data: null };
      
    const codevProjects = await Promise.all(codevs.map(async (codev: Codev) => { // await for all the promises.
      const { data: codevProject } = await supabase.from("codev_project")
      .select("*,project(id,name)") // requires the *, so typescript won't go crazy. thinking that project is of type Project[], instead of Project.
      .eq("codev_id", codev.id)
  
      if (codevProject && codevProject.length > 0) {
        const projects: Project[] = codevProject.map(item => item.project); // get project data only.
        return projects;
      }
      return [];
    }));
    
    const data = codevs.map<Codev>((codev, index: number) => {
        const { 
           first_name,
           last_name,
           image_url,
           address,
           about,
           main_position,
           tech_stacks,
           portfolio_website,
           contact,
           education
        } = codev.user.profile;
  
        return {
            id: codev.id,
            email: codev.user.email,
            user_id: codev.user_id,
            internal_status : codev.internal_status,
            first_name,
            last_name,
            tech_stacks,
            main_position,
            portfolio_website,
            contact,
            projects: codevProjects[index] as Project[],
            image_url,
            address,
            about,
            education,
            socials: codev.user.social,
            job_status: codev.job_status,
            nda_status: codev.nda_status
        }
    });

    if (id) return { error: null, data: data[0] as Codev}; // if we are targeting a specific codev.

    return { error: null, data };
}