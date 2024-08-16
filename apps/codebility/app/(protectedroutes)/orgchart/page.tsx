import Card from "@/app/(protectedroutes)/orgchart/Card"
import { orgChartData } from "@/app/(protectedroutes)/orgchart/data"
import H1 from "@/Components/shared/dashboard/H1"
import Box from "@/Components/shared/dashboard/Box"

const Page = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col gap-4">
      <H1>Organizational Chart</H1>
      <Box>
        <Card orgChartData={orgChartData} />
      </Box>
    </div>
  )
}

export default Page
