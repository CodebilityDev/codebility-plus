import { Suspense } from "react";
import { createClientServerComponent } from "@/utils/supabase/server";

import OrgCharts from "./_components/OrgChart";
import OrgChartSkeleton from "./_components/OrgChartSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function OrgChartData() {
  const supabase = await createClientServerComponent();
  const { data: orgChartData, error } = await supabase
    .from("codev")
    .select("id, first_name, last_name, display_position, image_url, application_status, availability_status")
    .eq("availability_status", true)
    .eq("application_status", "passed")
    .order("first_name", { ascending: true });

  if (error) {
    return <div>Error loading organization chart</div>;
  }

  const positionOrder: Record<string, number> = {
    "CEO / Founder": 1,
    "CEO/Founder": 1,
    Admin: 2,
    Marketing: 3,
    "Project Manager": 4,
    "Full Stack Developer": 5,
    "Frontend Developer": 6,
    "Backend Developer": 7,
    "Mobile Developer": 8,
    "UI/UX Designer": 9,
    Developer: 10,
  };

  const sortedData = orgChartData.sort(
    (a, b) =>
      (positionOrder[a.display_position] || 99) -
      (positionOrder[b.display_position] || 99),
  );

  return <OrgCharts data={sortedData} />;
}

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1600px] px-6 py-12">
        <div className="relative">
          <Suspense fallback={<OrgChartSkeleton />}>
            <OrgChartData />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
