import Card from "@/app/home/orgchart/Card";
import { orgChartData } from "@/app/home/orgchart/data";
import Box from "@/Components/shared/dashboard/Box";
import H1 from "@/Components/shared/dashboard/H1";

const Page = () => {
  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <H1>Organizational Chart</H1>
      <Box>
        <Card orgChartData={orgChartData} />
      </Box>
    </div>
  );
};

export default Page;
