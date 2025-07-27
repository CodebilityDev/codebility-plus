import { createClientServerComponent } from "@/utils/supabase/server";

import OrgCharts from "./_components/OrgChart";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page = async () => {
  const supabase = await createClientServerComponent();
  const { data: orgChartData, error } = await supabase
    .from("codev")
    .select(
      "id, first_name, last_name, display_position, image_url, application_status, availability_status",
    )
    .eq("availability_status", true);

  if (error) {
    return <div>Error loading organization chart</div>;
  }

  const positionOrder: Record<string, number> = {
    "CEO/Founder": 1,
    Admin: 2,
    Marketing: 3,
    "Project Manager": 4,
    Developer: 5,
  };

  const sortedData = orgChartData.sort(
    (a, b) =>
      (positionOrder[a.display_position] || 99) -
      (positionOrder[b.display_position] || 99),
  );

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-8 p-4">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Organization Structure
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Meet the talented team behind Codebility
        </p>
      </div>
      <OrgCharts data={sortedData} />
    </div>
  );
};

export default Page;
