import { Box } from "@/Components/shared/dashboard";
import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export default async function TokenPoints() {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();

  const { data } = await supabase
    .from("codev")
    .select("*, point(*)")
    .eq("user_id", user?.id)
    .single();

  const points = data ? data.point : [];

  const CategorizePoint = {
    "UI/UX": 0,
    FRONTEND: 0,
    BACKEND: 0,
  };

  for (let i = 0; i < points.length; i++) {
    const { point, category } = points[i];
    CategorizePoint[category as keyof typeof CategorizePoint] += point;
  }

  return (
    <Box className="flex w-full flex-1 flex-col gap-4">
      <p className="text-2xl">Token Points</p>
      <div className="flex flex-col gap-4 md:flex-row lg:flex-col xl:flex-row">
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-teal text-4xl">{CategorizePoint.FRONTEND}</p>
          <p className="text-gray text-xl">Front-End Points</p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-teal text-4xl">{CategorizePoint.BACKEND}</p>
          <p className="text-gray text-xl">Back-End Points</p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <p className="text-4xl">{CategorizePoint["UI/UX"]}</p>
          <p className="text-gray text-xl">UI/UX Points</p>
        </div>
      </div>
    </Box>
  );
}
