import H1 from "@/Components/shared/dashboard/H1"
import InHouseContainer from "./_components/in-house-container"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers";
import { Codev } from "./_lib/codev";

async function InHousePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: codevs, error } = await supabase.from("codev")
  .select("*, user(*, profile(*))")
  .eq("type", "INHOUSE");

  if (error) throw error;
  
  const data = codevs.map(codev => {
      const { first_name, last_name, main_position } = codev.user.profile;
      return {
          id: codev.id,
          internal_status : codev.internal_status,
          first_name,
          last_name,
          main_position
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
