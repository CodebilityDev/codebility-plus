import H1 from "@/Components/shared/dashboard/H1"
import InHouseContainer from "./_components/in-house-container"
import { Codev } from '@/types/home/codev'
import { getCodevs } from "@/lib/server/codev.service"

async function InHousePage() {
  const { error, data } = await getCodevs();

  if (error) return <div>
    ERROR
  </div>;

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
