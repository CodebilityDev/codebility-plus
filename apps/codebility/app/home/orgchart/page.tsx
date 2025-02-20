import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";

import OrgCharts from "./_components/OrgChart";

const Page = async () => {
  const supabase = getSupabaseServerActionClient();
  const { data: orgChartData, error } = await supabase
    .from("org_chart")
    .select(
      "id, team, profile_id (image_url, main_position, first_name, last_name)",
    );

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      {error ? "error" : <OrgCharts data={orgChartData as any[]} />}
    </div>
  );
};

export default Page;
