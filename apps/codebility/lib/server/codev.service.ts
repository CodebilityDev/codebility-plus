"use server";

import { Codev, Project } from "@/types/home/codev";
import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

export const getCodevs = async (): Promise<{ error: any, data: Codev[] | null}> => {
    const supabase = getSupabaseServerActionClient();
    const { data: codevs, error } = await supabase.from("codev")
    .select(`
      *,
      user(
        *,
        profile(*),
        social(
          github,
          facebook,
          linkedin,
          telegram,
          whatsapp,
          discord_id
        )
      )
    `)
    .eq("type", "INHOUSE");
    
    if (error) return { error, data: null } ;
      
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
        const { first_name, last_name, image_url, address, about, main_position, tech_stacks } = codev.user.profile;
  
        return {
            id: codev.id,
            user_id: codev.user_id,
            internal_status : codev.internal_status,
            first_name,
            last_name,
            tech_stacks,
            main_position,
            projects: codevProjects[index] as Project[],
            image_url,
            address,
            about,
            socials: codev.user.social,
            job_status: codev.job_status,
            nda_status: codev.nda_status
        }
    });

    return { error: null, data };
}