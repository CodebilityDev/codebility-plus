import { Suspense } from "react";
import { UsersSkeleton } from "@/components/ui/skeleton/UsersSkeleton";
import { getCodevs } from "@/lib/server/codev.service";
import { Codev } from "@/types/home/codev";
import {
  getPrioritizedAndFilteredCodevs,
  prioritizeCodevs,
} from "@/utils/codev-priority"; // Import the utility

import Section from "../_shared/CodevsSection";
import CodevContainer from "./_components/CodevContainer";
import { CodevHireCodevModal } from "./_components/CodevHireCodevModal";
import CodevList from "./_components/CodevList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Profiles() {
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
    <>
      <Section
        id="codevs"
        className="relative w-full bg-gradient-to-b from-slate-900 to-slate-950 min-h-screen"
      >
        <div className="bg-code-pattern absolute inset-0 bg-repeat opacity-5"></div>
        {/* Glassmorphism background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-customBlue-950/20 to-purple-950/20" />
        <div className="absolute -top-4 -right-4 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-400/10 to-orange-400/10 blur-3xl" />
        <div className="absolute -bottom-4 -left-4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-8 z-10">
          <CodevContainer />
          <Suspense fallback={<UsersSkeleton />}>
            <CodevList codevs={sortedCodevs} />
          </Suspense>
        </div>
      </Section>
      <CodevHireCodevModal />
    </>
  );
}
