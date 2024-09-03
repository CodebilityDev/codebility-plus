import H1 from "@/Components/shared/dashboard/H1"
import InHouseContainer from "./_components/in-house-container"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"
import { Codev, Project } from '@/types/home/codev'

async function InHousePage() {
  const supabase = getSupabaseServerComponentClient();
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

  if (error) return <div>
    ERROR
  </div>;
  
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

  return (
    <div className="flex flex-col gap-2">
      <H1>In-House Codebility</H1>
      {
        error ? 
          <div>ERROR</div>
          :
          <InHouseContainer codevData={data as Codev[]}/>
      }
    </div>
  )
}

export default InHousePage;
