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
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-20 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
              Our Team
            </h1>
            <div className="mx-auto mt-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
          <p className="mx-auto max-w-3xl text-lg font-light text-gray-600 dark:text-gray-300">
            Meet the extraordinary individuals who drive innovation and excellence in everything we create
          </p>
        </div>
        
        <div className="relative">
          <OrgCharts data={sortedData} />
        </div>
      </div>
    </div>
  );
};

export default Page;
