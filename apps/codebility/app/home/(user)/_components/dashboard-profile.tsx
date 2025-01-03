import Image from "next/image";
import Badges from "@/Components/shared/Badges";
import Box from "@/Components/shared/dashboard/Box";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";
import { getCachedUser } from "@/lib/server/supabase-server-comp";
import { defaultAvatar } from "@/public/assets/images";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

export default async function DashboardProfile() {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();
  const { data: userData } = await supabase
    .from("profile")
    .select("first_name, image_url, main_position")
    .eq("user_id", user?.id)
    .single();
  const isLoading = !userData;
  return (
    <>
      {!isLoading ? (
        <Box className="relative flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <p className="text-2xl font-semibold capitalize">
              Hello, {userData?.first_name ?? ""}!
            </p>

            <Image
              alt="Avatar"
              src={userData.image_url ? `${userData.image_url}` : defaultAvatar}
              width={100}
              height={100}
              title={`${userData.first_name}'s Avatar`}
              className="from-violet h-[100px] w-[100px] rounded-lg bg-gradient-to-b to-blue-500 bg-cover object-cover"
            />
            <p className="text-md">{userData.main_position}</p>

            <Badges />
          </div>
        </Box>
      ) : (
        <Box className="flex-1">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Box>
      )}
    </>
  );
}
