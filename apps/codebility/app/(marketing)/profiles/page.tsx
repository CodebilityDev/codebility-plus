import { Suspense } from "react";
import SectionWrapper from "@/Components/shared/home/SectionWrapper";
import { UsersSkeleton } from "@/Components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";

import CodevContainer from "./_components/CodevContainer";
import CodevList from "./_components/CodevList";

export default async function Profiles() {
  const adminRoleId = 1;

  const [{ data: allCodevs, error }] = await Promise.all([getCodevs()]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // First filter out unwanted profiles
  const filteredCodevs = codevsArray.filter(
    (codev) =>
      codev.role_id !== adminRoleId &&
      codev.application_status !== "failed" &&
      codev.application_status !== "applying",
  );

  // Sort codevs based on priority criteria
  const sortedCodevs = filteredCodevs.sort((a, b) => {
    // Priority 1: Has image_url and is available
    if (
      a.image_url &&
      a.availability_status &&
      (!b.image_url || !b.availability_status)
    ) {
      return -1;
    }
    if (
      b.image_url &&
      b.availability_status &&
      (!a.image_url || !a.availability_status)
    ) {
      return 1;
    }

    // Priority 2: Has image_url
    if (a.image_url && !b.image_url) return -1;
    if (b.image_url && !a.image_url) return 1;

    // Priority 3: Is available
    if (a.availability_status && !b.availability_status) return -1;
    if (b.availability_status && !a.availability_status) return 1;

    // If all priorities are equal, maintain original order
    return 0;
  });

  return (
    <SectionWrapper
      id="codevs"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevList codevs={sortedCodevs} />
        </Suspense>
      </div>
    </SectionWrapper>
  );
}
