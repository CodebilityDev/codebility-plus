import { Suspense } from "react";
import SectionWrapper from "@/Components/shared/home/SectionWrapper";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getAdmins, getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileContainer from "./_components/profile-container";
import CodevLists from "./_components/profile-lists";

export default async function Profiles() {
  // Fetch data for Codevs and Admins in parallel
  const [
    { data: codevsData, error: codevsError },
    { data: adminsData, error: adminsError },
  ] = await Promise.all([getCodevs(), getAdmins()]);

  if (codevsError || adminsError) {
    throw new Error("Failed to fetch profiles data");
  }

  // Ensure `codevsData` and `adminsData` are arrays
  const codevsArray: Codev[] = Array.isArray(codevsData) ? codevsData : [];
  const adminsArray: Codev[] = Array.isArray(adminsData) ? adminsData : [];

  // Filter codevs to exclude those who are admins
  const filteredCodevs = codevsArray.filter(
    (codev) => !adminsArray.some((admin) => admin.id === codev.id),
  );

  return (
    <SectionWrapper
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <ProfileContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists codevs={filteredCodevs} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
