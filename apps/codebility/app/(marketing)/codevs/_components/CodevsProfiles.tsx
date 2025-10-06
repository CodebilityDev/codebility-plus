import { Suspense } from "react";
import { UsersSkeleton } from "@/components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";
import {
  getPrioritizedAndFilteredCodevs,
} from "@/utils/codev-priority";

import Section from "../../_shared/CodevsSection";
import CodevList from "../../profiles/_components/CodevList";
import CodevsProfilesContainer from "./CodevsProfilesContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CodevsProfiles() {
  const [{ data: allCodevs, error }] = await Promise.all([
    getCodevs({ filters: { role_id: 10 } }), // show only Codevs with role_id 10 which is Codev
  ]);

  if (error) {
    throw new Error("Failed to fetch profiles data");
  }

  const codevsArray: Codev[] = Array.isArray(allCodevs) ? allCodevs : [];

  // Use the utility function with filterAdminAndFailed set to true
  const sortedCodevs = getPrioritizedAndFilteredCodevs(
    codevsArray,
    { activeStatus: ["active"] },
    true,
  );

  return (
    <Section
      id="codevs-profiles"
      className="from-black-500 relative w-full bg-gradient-to-b"
    >
      <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
      <div className="relative flex flex-col gap-8">
        <CodevsProfilesContainer />
        <Suspense fallback={<UsersSkeleton />}>
          <CodevList codevs={sortedCodevs} />
        </Suspense>
      </div>
    </Section>
  );
}