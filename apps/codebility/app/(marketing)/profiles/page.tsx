import { Suspense } from "react";
import SectionWrapper from "@/Components/shared/home/SectionWrapper";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileContainer from "./_components/profile-container";
import CodevLists from "./_components/profile-lists";

export default async function Profiles() {
  const { data } = await getCodevs("INHOUSE");

  const codevs = (data as Codev[]) || [];

  return (
    <SectionWrapper
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <ProfileContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists codevs={codevs} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
