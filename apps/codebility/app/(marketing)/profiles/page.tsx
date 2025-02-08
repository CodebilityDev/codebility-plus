import { Suspense } from "react";
import SectionWrapper from "@/Components/shared/home/SectionWrapper";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import ProfileContainer from "./_components/profile-container";
import CodevLists from "./_components/profile-lists";

export default async function Profiles() {
  // Define role IDs
  const adminRoleId = 1; // Replace with the actual role ID for admins

  // Fetch data for Codevs and Admins in parallel
  const [{ data: allCodevs, error }] = await Promise.all([getCodevs()]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  // Ensure `allCodevs` is an array
  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // Filter admins and codevs
  // const adminsArray = codevsArray.filter(
  //   (codev) => codev.role_id === adminRoleId,
  // );
  const filteredCodevs = codevsArray.filter(
    (codev) =>
      codev.role_id !== adminRoleId &&
      codev.application_status !== "failed" &&
      codev.application_status !== "applying",
  );

  return (
    <SectionWrapper
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <ProfileContainer filteredCodevs={filteredCodevs} />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevLists codevs={filteredCodevs} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
